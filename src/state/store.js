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
  standingsView: "chart"
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
 * Sets the standings display view mode ('chart' | 'list').
 * @param {'chart' | 'list'} view 
 */
export function setStandingsView(view) {
  if (view === "chart" || view === "list") {
    state.standingsView = view;
    notify();
  }
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
 * Merges cloud payload into the local state using robust concurrency strategies.
 * @param {Object} cloudData 
 */
export function mergeCloudData(cloudData) {
  if (!cloudData || typeof cloudData !== "object") return;
  let changed = false;

  // 1. Custom Contestants: Validate schema and uniqueness before adding
  // Process custom contestants FIRST so newly arrived candidates are recognized when merging votes
  if (Array.isArray(cloudData.customContestants)) {
    cloudData.customContestants.forEach(customC => {
      if (
        customC &&
        typeof customC === "object" &&
        typeof customC.id === "string" &&
        typeof customC.name === "string" &&
        typeof customC.alias === "string" &&
        typeof customC.tagline === "string" &&
        typeof customC.avatar === "string"
      ) {
        if (!state.contestants.some(c => c.id === customC.id)) {
          state.contestants.push({
            id: customC.id,
            name: customC.name,
            alias: customC.alias,
            tagline: customC.tagline,
            avatar: customC.avatar,
            category: "custom"
          });
          if (state.votes[customC.id] === undefined) {
            state.votes[customC.id] = 1;
          }
          changed = true;
        }
      }
    });
  }

  // 2. Vote Counts: Only merge votes for valid, recognized contestants
  if (cloudData.votes && typeof cloudData.votes === "object") {
    const validIds = new Set(state.contestants.map(c => c.id));
    Object.entries(cloudData.votes).forEach(([id, count]) => {
      if (!validIds.has(id)) return; // Reject orphan / invalid keys like "1"
      const serverVal = Number(count) || 0;
      const localVal = state.votes[id] || 0;
      const mergedVal = Math.max(localVal, serverVal);
      if (state.votes[id] !== mergedVal) {
        state.votes[id] = mergedVal;
        changed = true;
      }
    });
  }

  // Purge any orphan / invalid keys from state.votes
  const validIds = new Set(state.contestants.map(c => c.id));
  Object.keys(state.votes).forEach(key => {
    if (!validIds.has(key)) {
      delete state.votes[key];
      changed = true;
    }
  });

  // 3. Voter Ledger: Deduplicate entries by unique signature (voter_timestamp_choices)
  if (Array.isArray(cloudData.voterLedger)) {
    const makeSignature = (entry) => {
      if (!entry || typeof entry !== "object") return "";
      const voter = entry.voter || "";
      const timestamp = entry.timestamp || "";
      const choices = Array.isArray(entry.choices) ? [...entry.choices].sort().join(",") : "";
      return `${voter}_${timestamp}_${choices}`;
    };

    const seenSignatures = new Set();
    const combinedLedger = [];

    // Prioritize preserving both local entries and incoming cloud entries without duplication
    [...state.voterLedger, ...cloudData.voterLedger].forEach(entry => {
      if (entry && typeof entry === "object") {
        const sig = makeSignature(entry);
        if (sig && !seenSignatures.has(sig)) {
          seenSignatures.add(sig);
          combinedLedger.push(entry);
        }
      }
    });

    // Enforce Firestore schema bounds (max 100 entries)
    const boundedLedger = combinedLedger.slice(-100);
    if (boundedLedger.length !== state.voterLedger.length || 
        JSON.stringify(boundedLedger) !== JSON.stringify(state.voterLedger)) {
      state.voterLedger = boundedLedger;
      changed = true;
    }
  }

  if (changed) {
    notify();
  }
}

/**
 * Hydrates state from localStorage fallback without overwriting codebase roster updates.
 * @param {Object} fallback 
 */
export function hydrateFromLocalStorage(fallback) {
  if (!fallback || typeof fallback !== "object") return;
  let changed = false;

  // 1. Retain DEFAULT_CONTESTANTS as base; restore user-proposed custom contestants FIRST
  if (Array.isArray(fallback.contestants)) {
    const savedCustoms = fallback.contestants.filter(c => c && c.category === "custom");
    savedCustoms.forEach(customC => {
      if (customC?.id && !state.contestants.some(c => c.id === customC.id)) {
        state.contestants.push(customC);
        changed = true;
      }
    });
  }

  // 2. Hydrate votes only for recognized contestants
  if (fallback.votes && typeof fallback.votes === "object") {
    const validIds = new Set(state.contestants.map(c => c.id));
    Object.entries(fallback.votes).forEach(([id, count]) => {
      if (!validIds.has(id)) return; // Ignore orphan keys
      const storedCount = Number(count) || 0;
      if (storedCount > (state.votes[id] || 0)) {
        state.votes[id] = storedCount;
        changed = true;
      }
    });
  }

  // Purge any orphan keys from state.votes
  const validIds = new Set(state.contestants.map(c => c.id));
  Object.keys(state.votes).forEach(key => {
    if (!validIds.has(key)) {
      delete state.votes[key];
      changed = true;
    }
  });

  // 3. Voter ledger
  if (Array.isArray(fallback.voterLedger) && fallback.voterLedger.length > 0) {
    state.voterLedger = fallback.voterLedger.slice(-100);
    changed = true;
  }

  if (changed) {
    notify();
  }
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
