/**
 * Cloud Sync API Service (RESTful API Dev Object Storage)
 */

import { CLOUD_SYNC_URL } from "../config/constants.js";
import { getState, mergeCloudData, setSyncing } from "../state/store.js";
import { saveLocalFallback, loadLocalFallback } from "./storage.js";

/**
 * Fetches latest shared state from the cloud endpoint.
 */
export async function fetchCloudState() {
  try {
    const response = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Cloud fetch status: " + response.status);
    const result = await response.json();
    if (result && result.data) {
      mergeCloudData(result.data);
      saveLocalFallback(getState());
    }
  } catch (err) {
    console.warn("Cloud sync unavailable, loading local fallback:", err);
    const fallback = loadLocalFallback();
    if (fallback) {
      mergeCloudData(fallback);
    }
  }
}

/**
 * Pushes current local state to the cloud endpoint.
 */
export async function pushCloudState() {
  const currentState = getState();
  setSyncing(true);
  saveLocalFallback(currentState);

  const payload = {
    name: "Lietuvos_Bukiausias_Sync",
    data: {
      votes: currentState.votes,
      customContestants: currentState.contestants.filter(c => c.category === "custom"),
      voterLedger: currentState.voterLedger
    }
  };

  try {
    await fetch(CLOUD_SYNC_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("Offline state saved locally, failed to push cloud sync:", err);
  } finally {
    setSyncing(false);
  }
}
