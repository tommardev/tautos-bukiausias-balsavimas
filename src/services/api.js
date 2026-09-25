/**
 * Cloud Sync API Service (Firebase Cloud Firestore Live Synchronization)
 */

import { getState, mergeCloudData } from "../state/store.js";
import { saveLocalFallback, loadLocalFallback } from "./storage.js";
import { getFirestoreDocName, isDevEnvironment } from "../config/constants.js";

/**
 * Official Firebase Web configuration for project 'balsavimas-vaciukai'.
 */
const FIREBASE_CONFIG = {
  projectId: "balsavimas-vaciukai",
  appId: "1:177762418820:web:3fab2a5ca684f38fbd42d1",
  storageBucket: "balsavimas-vaciukai.firebasestorage.app",
  apiKey: "AIzaSyCblD0bX7q8BlQjt4HCq2_ax2TCNc6Mp7k",
  authDomain: "balsavimas-vaciukai.firebaseapp.com",
  messagingSenderId: "177762418820"
};

let dbInstance = null;
let stateDocRef = null;
let firebaseModules = null;
let isRealtimeListenerActive = false;

/**
 * Dynamically imports Firebase SDK modules to ensure the application evaluates
 * and loads cleanly even when offline or when gstatic.com is unreachable.
 */
async function loadFirebaseModules() {
  if (firebaseModules) return firebaseModules;
  try {
    const [appMod, firestoreMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
    ]);
    firebaseModules = {
      initializeApp: appMod.initializeApp,
      getFirestore: firestoreMod.getFirestore,
      doc: firestoreMod.doc,
      onSnapshot: firestoreMod.onSnapshot,
      setDoc: firestoreMod.setDoc,
      runTransaction: firestoreMod.runTransaction
    };
    return firebaseModules;
  } catch (err) {
    console.warn("Could not load Firebase SDK (offline or network restricted):", err);
    return null;
  }
}

/**
 * Lazily initializes and returns the Firestore instance and state document reference.
 */
async function getFirestoreInstance() {
  if (dbInstance && stateDocRef && firebaseModules) {
    return { db: dbInstance, stateDocRef, modules: firebaseModules };
  }

  const modules = await loadFirebaseModules();
  if (!modules) return null;

  try {
    const isDev = isDevEnvironment();
    const appName = isDev ? "tautos-bukiausias-dev" : "tautos-bukiausias-prod";
    const app = modules.initializeApp(FIREBASE_CONFIG, appName);
    dbInstance = modules.getFirestore(app);
    const docName = getFirestoreDocName();
    stateDocRef = modules.doc(dbInstance, "voting", docName);
    return { db: dbInstance, stateDocRef, modules };
  } catch (err) {
    console.warn("Could not initialize Firebase Firestore instance:", err);
    return null;
  }
}

/**
 * Initializes real-time live synchronization via Firestore onSnapshot.
 * Any vote cast on any device pushes updates in real time (~100ms) without polling.
 * If offline, gracefully falls back to localStorage and waits for the online event.
 */
export async function initRealtimeCloudSync() {
  if (isRealtimeListenerActive) return;

  try {
    const instance = await getFirestoreInstance();
    if (!instance) {
      console.warn("Firestore live listener skipped (offline). Continuing with local state.");
      return;
    }

    const { stateDocRef: docRef, modules } = instance;

    modules.onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData) {
          mergeCloudData(cloudData);
          saveLocalFallback(getState());
        }
      }
    }, (err) => {
      console.warn("Firestore live listener encountered an issue, loading local fallback:", err);
      const fallback = loadLocalFallback();
      if (fallback) {
        mergeCloudData(fallback);
      }
    });

    isRealtimeListenerActive = true;
  } catch (err) {
    console.warn("Could not establish Firestore live listener:", err);
  }
}

/**
 * Atomically submits a vote to Cloud Firestore using a transaction.
 * Reads the latest server state, increments the votes for selected choices,
 * appends the new entry to voterLedger (max 100 entries), and updates the document.
 * This guarantees multi-device concurrency without dropping votes or resurrecting stale cache.
 * @param {Object} param0
 * @param {string} param0.voter
 * @param {string[]} param0.choices
 * @param {string} param0.timestamp
 */
export async function submitVoteToCloud({ voter, choices, timestamp }) {
  const currentState = getState();
  saveLocalFallback(currentState);

  const newEntry = {
    voter,
    choices,
    timestamp
  };

  try {
    const instance = await getFirestoreInstance();
    if (!instance) {
      console.warn("Submit vote to cloud skipped (offline or SDK unreachable). Local state preserved.");
      return;
    }

    const { db, stateDocRef: docRef, modules } = instance;

    if (typeof modules.runTransaction === "function") {
      await modules.runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          // Initialize state document if it doesn't exist
          const validIds = new Set(currentState.contestants.map(c => c.id));
          const cleanVotes = {};
          validIds.forEach(id => {
            cleanVotes[id] = currentState.votes[id] || 0;
          });
          choices.forEach(id => {
            if (validIds.has(id)) {
              cleanVotes[id] = (cleanVotes[id] || 0) + 1;
            }
          });
          transaction.set(docRef, {
            votes: cleanVotes,
            customContestants: currentState.contestants.filter(c => c.category === "custom"),
            voterLedger: [newEntry],
            updatedAt: Date.now()
          });
          return;
        }

        const data = docSnap.data() || {};
        const serverVotes = { ...(data.votes || {}) };
        choices.forEach(id => {
          serverVotes[id] = (Number(serverVotes[id]) || 0) + 1;
        });

        const currentLedger = Array.isArray(data.voterLedger) ? data.voterLedger : [];
        const updatedLedger = [...currentLedger, newEntry].slice(-100);

        transaction.set(docRef, {
          votes: serverVotes,
          customContestants: Array.isArray(data.customContestants) ? data.customContestants : [],
          voterLedger: updatedLedger,
          updatedAt: Date.now()
        });
      });
      return;
    }
  } catch (err) {
    console.warn("Transaction failed or unsupported, falling back to pushCloudState:", err);
  }

  // Fallback to pushCloudState if transaction fails or is unsupported
  await pushCloudState();
}

/**
 * Atomically adds a custom contestant to Cloud Firestore.
 * @param {Object} contestant 
 */
export async function addCustomContestantToCloud(contestant) {
  const currentState = getState();
  saveLocalFallback(currentState);

  try {
    const instance = await getFirestoreInstance();
    if (!instance) {
      console.warn("Add custom contestant skipped (offline). Local state preserved.");
      return;
    }

    const { db, stateDocRef: docRef, modules } = instance;

    if (typeof modules.runTransaction === "function") {
      await modules.runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          await pushCloudState();
          return;
        }

        const data = docSnap.data() || {};
        const serverCustoms = Array.isArray(data.customContestants) ? [...data.customContestants] : [];
        if (!serverCustoms.some(c => c && c.id === contestant.id)) {
          serverCustoms.push(contestant);
        }

        const serverVotes = { ...(data.votes || {}) };
        if (serverVotes[contestant.id] === undefined) {
          serverVotes[contestant.id] = 1;
        }

        transaction.set(docRef, {
          votes: serverVotes,
          customContestants: serverCustoms.slice(-50),
          voterLedger: Array.isArray(data.voterLedger) ? data.voterLedger : [],
          updatedAt: Date.now()
        });
      });
      return;
    }
  } catch (err) {
    console.warn("Transaction for custom contestant failed, falling back to pushCloudState:", err);
  }

  await pushCloudState();
}

/**
 * Pushes current local state to Cloud Firestore so all connected devices update instantly.
 */
export async function pushCloudState() {
  const currentState = getState();
  saveLocalFallback(currentState);

  // Sanitize votes to only include known contestants
  const validIds = new Set(currentState.contestants.map(c => c.id));
  const cleanVotes = {};
  validIds.forEach(id => {
    cleanVotes[id] = currentState.votes[id] || 0;
  });

  const payload = {
    votes: cleanVotes,
    customContestants: currentState.contestants.filter(c => c.category === "custom"),
    voterLedger: currentState.voterLedger,
    updatedAt: Date.now()
  };

  try {
    const instance = await getFirestoreInstance();
    if (!instance) {
      console.warn("Push to cloud skipped (offline or SDK unreachable). Local fallback preserved.");
      return;
    }

    // Set doc without { merge: true } to ensure orphan/legacy keys are cleanly expunged
    await instance.modules.setDoc(instance.stateDocRef, payload);
  } catch (err) {
    console.warn("Failed to push to Cloud Firestore, local fallback saved:", err);
  }
}

// Re-attempt cloud synchronization whenever browser connectivity is restored
if (typeof window !== "undefined") {
  window.addEventListener("online", async () => {
    console.info("Network connection restored. Re-establishing Firestore sync...");
    await initRealtimeCloudSync();
    await pushCloudState();
  });
}

