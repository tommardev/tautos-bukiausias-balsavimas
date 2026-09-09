/**
 * Central State Container (Single Store with Subscription Pattern)
 */

import { DEFAULT_CONTESTANTS, INITIAL_VOTES, INITIAL_VOTER_LEDGER } from "../config/contestants.data.js";
import { MAX_SELECTED_CANDIDATES } from "../config/constants.js";

const state = {
  contestants: [...DEFAULT_CONTESTANTS],
  votes: { ...INITIAL_VOTES },
  voterLedger: [...INITIAL_VOTER_LEDGER],
  selectedCandidates: new Set(),
  activeFilter: "all",
  searchQuery: "",
  isSyncing: false
};

const listeners = new Set();

function notify() {
  listeners.forEach(listener => {
    try {
      listener(state);
    } catch (err) {
      console.error("Error in store subscriber:", err);
    }
  });
}

/**
 * Subscribes a listener callback to state changes.
 * @param {Function} listener 
 * @returns {Function} Unsubscribe function
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Returns read-only reference to current state.
 */
export function getState() {
  return state;
}

/**
 * Sets the syncing indicator flag.
 * @param {boolean} isSyncing 
 */
export function setSyncing(isSyncing) {
  state.isSyncing = isSyncing;
  notify();
}

/**
 * Toggles selection of a candidate (up to MAX_SELECTED_CANDIDATES).
 * @param {string} id 
 * @returns {{ toggled: boolean, limitReached?: boolean }}
 */
export function toggleCandidateSelection(id) {
  if (state.selectedCandidates.has(id)) {
    state.selectedCandidates.delete(id);
    notify();
    return { toggled: true };
  }

  if (state.selectedCandidates.size >= MAX_SELECTED_CANDIDATES) {
    return { toggled: false, limitReached: true };
  }

  state.selectedCandidates.add(id);
  notify();
  return { toggled: true };
}

/**
 * Clears current candidate selections.
 */
export function clearCandidateSelections() {
  state.selectedCandidates.clear();
  notify();
}

/**
 * Sets the category filter.
 * @param {string} category 
 */
export function setFilter(category) {
  state.activeFilter = category;
  notify();
}

/**
 * Sets candidate search query.
 * @param {string} query 
 */
export function setSearchQuery(query) {
  state.searchQuery = (query || "").trim();
  notify();
}

/**
 * Records a new vote submission.
 * @param {Object} param0 
 * @param {string} param0.voter 
 * @param {string[]} param0.choices 
 * @param {string} param0.timestamp 
 */
export function recordVote({ voter, choices, timestamp }) {
  choices.forEach(id => {
    state.votes[id] = (state.votes[id] || 0) + 1;
  });

  state.voterLedger.push({
    voter,
    choices,
    timestamp
  });

  state.selectedCandidates.clear();
  notify();
}

/**
 * Adds a new custom contestant proposed by a user.
 * @param {Object} contestant 
 */
export function addCustomContestant(contestant) {
  state.contestants.push(contestant);
  state.votes[contestant.id] = 1;
  notify();
}

/**
 * Merges cloud payload into the local state.
 * @param {Object} cloudData 
 */
export function mergeCloudData(cloudData) {
  let changed = false;

  if (cloudData.votes) {
    state.votes = { ...state.votes, ...cloudData.votes };
    changed = true;
  }

  if (Array.isArray(cloudData.voterLedger)) {
    state.voterLedger = cloudData.voterLedger;
    changed = true;
  }

  if (Array.isArray(cloudData.customContestants)) {
    cloudData.customContestants.forEach(customC => {
      if (!state.contestants.some(c => c.id === customC.id)) {
        state.contestants.push(customC);
        changed = true;
      }
    });
  }

  if (changed) {
    notify();
  }
}

/**
 * Hydrates state from localStorage fallback.
 * @param {Object} fallback 
 */
export function hydrateFromLocalStorage(fallback) {
  if (!fallback) return;

  if (fallback.votes) state.votes = fallback.votes;
  if (Array.isArray(fallback.voterLedger)) state.voterLedger = fallback.voterLedger;
  if (Array.isArray(fallback.contestants) && fallback.contestants.length > 0) {
    state.contestants = fallback.contestants;
  }

  notify();
}

/**
 * Resets all votes and voter ledger to initial clean state.
 */
export function resetAllData() {
  state.votes = {};
  DEFAULT_CONTESTANTS.forEach(c => {
    state.votes[c.id] = 0;
  });
  state.contestants = [...DEFAULT_CONTESTANTS];
  state.voterLedger = [];
  state.selectedCandidates.clear();
  notify();
}
