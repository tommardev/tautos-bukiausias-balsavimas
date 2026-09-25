/**
 * LocalStorage Persistence Service
 */

import { getActiveStorageKey } from "../config/constants.js";

/**
 * Saves relevant state fields to localStorage as offline fallback.
 * @param {Object} state 
 */
export function saveLocalFallback(state) {
  try {
    const payload = {
      votes: state.votes,
      voterLedger: state.voterLedger,
      contestants: state.contestants
    };
    localStorage.setItem(getActiveStorageKey(), JSON.stringify(payload));
  } catch (err) {
    console.warn("Unable to save state to localStorage:", err);
  }
}

/**
 * Loads cached state from localStorage.
 * @returns {Object|null}
 */
export function loadLocalFallback() {
  try {
    const raw = localStorage.getItem(getActiveStorageKey());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Unable to parse state from localStorage:", err);
    return null;
  }
}

/**
 * Purges obsolete localStorage keys from previous builds to prevent ghost data resurrecting.
 */
export function purgeLegacyStorageKeys() {
  const legacyKeys = [
    "tautos_bukiausias_v3_state",
    "tautos_bukiausias_v2_state",
    "tautos_bukiausias_state_v1",
    "tautos_bukiausias_voting_v1"
  ];

  legacyKeys.forEach(key => {
    try {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore security errors in restricted sandbox contexts
    }
  });
}

