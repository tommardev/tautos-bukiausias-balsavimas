/**
 * Cloud Sync API Service (Firebase Cloud Firestore Live Synchronization)
 */

import { getState, mergeCloudData } from "../state/store.js";
import { saveLocalFallback, loadLocalFallback } from "./storage.js";

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
      setDoc: firestoreMod.setDoc
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
    const app = modules.initializeApp(FIREBASE_CONFIG, "tautos-bukiausias-prod");
    dbInstance = modules.getFirestore(app);
    stateDocRef = modules.doc(dbInstance, "voting", "state");
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
 * Pushes current local state to Cloud Firestore so all connected devices update instantly.
 */
export async function pushCloudState() {
  const currentState = getState();
  saveLocalFallback(currentState);

  const payload = {
    votes: currentState.votes,
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

    await instance.modules.setDoc(instance.stateDocRef, payload, { merge: true });
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
