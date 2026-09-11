/**
 * Cloud Sync API Service (Firebase Cloud Firestore Live Synchronization)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { getState, mergeCloudData, setSyncing } from "../state/store.js";
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

/**
 * Lazily initializes and returns the Firestore instance and state document reference.
 */
function getFirestoreInstance() {
  if (!dbInstance) {
    const app = initializeApp(FIREBASE_CONFIG, "tautos-bukiausias-prod");
    dbInstance = getFirestore(app);
    stateDocRef = doc(dbInstance, "voting", "state");
  }
  return { db: dbInstance, stateDocRef };
}

/**
 * Initializes real-time live synchronization via Firestore onSnapshot.
 * Any vote cast on any device (phone, desktop, other browsers) pushes updates
 * in real time (~100ms) without polling.
 */
export function initRealtimeCloudSync() {
  try {
    const { stateDocRef } = getFirestoreInstance();

    onSnapshot(stateDocRef, (docSnap) => {
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
  } catch (err) {
    console.warn("Could not establish Firestore live listener:", err);
  }
}

/**
 * One-off fetch of the latest shared state from Cloud Firestore.
 */
export async function fetchCloudState() {
  try {
    const { stateDocRef } = getFirestoreInstance();
    const docSnap = await getDoc(stateDocRef);
    if (docSnap.exists()) {
      const cloudData = docSnap.data();
      if (cloudData) {
        mergeCloudData(cloudData);
        saveLocalFallback(getState());
      }
    }
  } catch (err) {
    console.warn("Firestore fetch error, loading local fallback:", err);
    const fallback = loadLocalFallback();
    if (fallback) {
      mergeCloudData(fallback);
    }
  }
}

/**
 * Pushes current local state to Cloud Firestore so all connected devices update instantly.
 */
export async function pushCloudState() {
  const currentState = getState();
  setSyncing(true);
  saveLocalFallback(currentState);

  const payload = {
    votes: currentState.votes,
    customContestants: currentState.contestants.filter(c => c.category === "custom"),
    voterLedger: currentState.voterLedger,
    updatedAt: Date.now()
  };

  try {
    const { stateDocRef } = getFirestoreInstance();
    await setDoc(stateDocRef, payload, { merge: true });
  } catch (err) {
    console.warn("Failed to push to Cloud Firestore, local fallback saved:", err);
  } finally {
    setSyncing(false);
  }
}
