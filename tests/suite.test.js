/**
 * Automated Verification & Regression Test Suite
 * Validates State Store, Concurrency Merging, DOM Utilities, and UI Component Logic.
 */

import assert from "node:assert/strict";
import { test, describe } from "node:test";

// 1. State Store Tests
import {
  getState,
  toggleCandidateSelection,
  clearCandidateSelections,
  setFilter,
  setSearchQuery,
  setStandingsView,
  recordVote,
  addCustomContestant,
  mergeCloudData,
  hydrateFromLocalStorage,
  resetAllData
} from "../src/state/store.js";

import { escapeHTML, formatVotesLt } from "../src/utils/dom.js";

describe("Tautos Bukiausias - State Store & Logic Suite", () => {

  test("Initial State and Defaults", () => {
    resetAllData();
    const state = getState();
    assert.ok(Array.isArray(state.contestants), "Contestants should be an array");
    assert.ok(state.contestants.length >= 10, "Should have default contestants");
    assert.equal(state.selectedCandidates.size, 0, "Selected candidates should initially be empty");
    assert.equal(state.activeFilter, "all", "Default filter should be 'all'");
    assert.equal(state.searchQuery, "", "Default search query should be empty");
  });

  test("Candidate Selection & 3-Choice Limit", () => {
    resetAllData();
    const state = getState();
    const c1 = state.contestants[0].id;
    const c2 = state.contestants[1].id;
    const c3 = state.contestants[2].id;
    const c4 = state.contestants[3].id;

    // Select candidate 1
    const res1 = toggleCandidateSelection(c1);
    assert.equal(res1.toggled, true);
    assert.ok(state.selectedCandidates.has(c1));
    assert.equal(state.selectedCandidates.size, 1);

    // Select candidate 2 & 3
    toggleCandidateSelection(c2);
    toggleCandidateSelection(c3);
    assert.equal(state.selectedCandidates.size, 3);

    // Try to select 4th candidate (limit reached)
    const res4 = toggleCandidateSelection(c4);
    assert.equal(res4.toggled, false);
    assert.equal(res4.limitReached, true);
    assert.equal(state.selectedCandidates.size, 3);
    assert.ok(!state.selectedCandidates.has(c4));

    // Deselect candidate 1
    const resDeselect = toggleCandidateSelection(c1);
    assert.equal(resDeselect.toggled, true);
    assert.equal(state.selectedCandidates.size, 2);
    assert.ok(!state.selectedCandidates.has(c1));

    // Clear all
    clearCandidateSelections();
    assert.equal(state.selectedCandidates.size, 0);
  });

  test("Filtering and Search State", () => {
    setFilter("pupil");
    assert.equal(getState().activeFilter, "pupil");

    setFilter("teacher");
    assert.equal(getState().activeFilter, "teacher");

    setSearchQuery("   Petras   ");
    assert.equal(getState().searchQuery, "Petras");

    setStandingsView("list");
    assert.equal(getState().standingsView, "list");

    setStandingsView("chart");
    assert.equal(getState().standingsView, "chart");

    // Invalid standings view should be ignored
    setStandingsView("invalid_view");
    assert.equal(getState().standingsView, "chart");
  });

  test("Vote Recording & Auto-Clear of Selection", () => {
    resetAllData();
    const state = getState();
    const id1 = state.contestants[0].id;
    const id2 = state.contestants[1].id;

    const initialVotes1 = state.votes[id1] || 0;
    const initialVotes2 = state.votes[id2] || 0;

    toggleCandidateSelection(id1);
    toggleCandidateSelection(id2);
    assert.equal(state.selectedCandidates.size, 2);

    recordVote({
      voter: "Jonas Testuotojas",
      choices: [id1, id2],
      timestamp: "12:00"
    });

    assert.equal(state.votes[id1], initialVotes1 + 1);
    assert.equal(state.votes[id2], initialVotes2 + 1);
    assert.equal(state.selectedCandidates.size, 0, "Selected candidates should auto-clear on vote");

    const lastLedger = state.voterLedger[state.voterLedger.length - 1];
    assert.equal(lastLedger.voter, "Jonas Testuotojas");
    assert.deepEqual(lastLedger.choices, [id1, id2]);
  });

  test("Custom Contestant Creation", () => {
    resetAllData();
    const customId = "custom_test_123";
    const customCandidate = {
      id: customId,
      name: "Testas Testauskas",
      alias: "„Bandymų Triušis“",
      tagline: "Bando visus testus",
      avatar: "🤓",
      category: "custom",
      categoryLabel: "Pasiūlytas Draugų"
    };

    addCustomContestant(customCandidate);
    const state = getState();
    const found = state.contestants.find(c => c.id === customId);
    assert.ok(found, "Custom contestant should be in state");
    assert.equal(state.votes[customId], 1, "New custom contestant starts with 1 vote");
  });

  test("Cloud Concurrency Merge", () => {
    resetAllData();
    const state = getState();
    const id1 = state.contestants[0].id;

    // Local vote is 10
    state.votes[id1] = 10;

    // Cloud has 12
    mergeCloudData({
      votes: { [id1]: 12, "orphan_invalid_id": 999 },
      customContestants: [{
        id: "cloud_custom_1",
        name: "Debesų Kandidatas",
        alias: "„Sinoptikas“",
        tagline: "Žada lietų",
        avatar: "⚡"
      }],
      voterLedger: [{
        voter: "Cloud Voter",
        choices: [id1],
        timestamp: "13:45"
      }]
    });

    assert.equal(state.votes[id1], 12);
    assert.equal(state.votes["orphan_invalid_id"], undefined, "Orphan keys must be pruned");
    assert.ok(state.contestants.some(c => c.id === "cloud_custom_1"), "Custom contestant should merge");
    assert.ok(state.voterLedger.some(l => l.voter === "Cloud Voter"), "Ledger should merge");
  });

  test("LocalStorage Fallback Hydration", () => {
    resetAllData();
    const state = getState();
    const id0 = state.contestants[0].id;

    hydrateFromLocalStorage({
      contestants: [{
        id: "saved_custom_1",
        name: "Išsaugotas",
        alias: "„Archyvaras“",
        tagline: "Saugo vietiškai",
        avatar: "💾",
        category: "custom"
      }],
      votes: {
        [id0]: 42,
        "bogus_key": 99
      },
      voterLedger: [{
        voter: "Local Voter",
        choices: [id0],
        timestamp: "10:15"
      }]
    });

    assert.equal(state.votes[id0], 42);
    assert.equal(state.votes["bogus_key"], undefined, "Bogus keys must be purged");
    assert.ok(state.contestants.some(c => c.id === "saved_custom_1"));
    assert.equal(state.voterLedger.length, 1);
  });
});

describe("Tautos Bukiausias - DOM Utilities", () => {
  test("HTML Sanitization against Stored XSS", () => {
    assert.equal(escapeHTML("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
    assert.equal(escapeHTML('Hello "World" & \'Friends\''), "Hello &quot;World&quot; &amp; &#39;Friends&#39;");
    assert.equal(escapeHTML("Normal Text 123"), "Normal Text 123");
    assert.equal(escapeHTML(null), "");
    assert.equal(escapeHTML(undefined), "");
  });

  test("Lithuanian Grammatical Pluralization (formatVotesLt)", () => {
    assert.equal(formatVotesLt(0), "0 balsų");
    assert.equal(formatVotesLt(1), "1 balsas");
    assert.equal(formatVotesLt(2), "2 balsai");
    assert.equal(formatVotesLt(5), "5 balsai");
    assert.equal(formatVotesLt(9), "9 balsai");
    assert.equal(formatVotesLt(10), "10 balsų");
    assert.equal(formatVotesLt(11), "11 balsų");
    assert.equal(formatVotesLt(12), "12 balsų");
    assert.equal(formatVotesLt(19), "19 balsų");
    assert.equal(formatVotesLt(20), "20 balsų");
    assert.equal(formatVotesLt(21), "21 balsas");
    assert.equal(formatVotesLt(22), "22 balsai");
    assert.equal(formatVotesLt(29), "29 balsai");
    assert.equal(formatVotesLt(100), "100 balsų");
    assert.equal(formatVotesLt(101), "101 balsas");
    assert.equal(formatVotesLt(111), "111 balsų");
    assert.equal(formatVotesLt(122), "122 balsai");
  });
});

// 3. UI Component & Interaction Suite (Mock DOM)
import { updateDockControls } from "../src/ui/dock.js";
import { renderContestants } from "../src/ui/contestants.js";
import { renderLeaderboard } from "../src/ui/leaderboard.js";
import { renderActivity } from "../src/ui/activity.js";
import { APP_VERSION } from "../src/config/constants.js";
import fs from "node:fs";

function setupMockDOM() {
  const elements = new Map();

  function getOrCreateElement(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        tagName: "DIV",
        textContent: "",
        innerHTML: "",
        value: "",
        disabled: false,
        dataset: {},
        classList: {
          _classes: new Set(),
          add(...cls) { cls.forEach(c => this._classes.add(c)); },
          remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
          toggle(cls, force) {
            if (force === undefined) {
              if (this._classes.has(cls)) this._classes.delete(cls);
              else this._classes.add(cls);
            } else if (force) {
              this._classes.add(cls);
            } else {
              this._classes.delete(cls);
            }
          },
          contains(cls) { return this._classes.has(cls); }
        },
        getAttribute(name) { return this[name] || this.dataset[name.replace("data-", "")]; },
        setAttribute(name, val) { this[name] = val; },
        addEventListener() {},
        querySelector() { return null; },
        querySelectorAll() { return []; },
        closest() { return null; }
      });
    }
    return elements.get(id);
  }

  globalThis.document = {
    getElementById: (id) => getOrCreateElement(id),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => getOrCreateElement(`mock_${Math.random().toString(36).slice(2)}`)
  };

  return { elements, getEl: getOrCreateElement };
}

describe("Tautos Bukiausias - UI Component & Interaction Logic", () => {

  test("Dock Controls: instructions, chip tray, and submit button state", () => {
    const { getEl } = setupMockDOM();
    const c1 = "cand_1";
    const c2 = "cand_2";
    const c3 = "cand_3";

    const fakeState = {
      contestants: [
        { id: c1, name: "Petras", alias: "P", avatar: "🤠", category: "pupil" },
        { id: c2, name: "Antanas", alias: "A", avatar: "🤓", category: "teacher" },
        { id: c3, name: "Kazys", alias: "K", avatar: "🤡", category: "custom" }
      ],
      selectedCandidates: new Set([c1]),
      votes: { [c1]: 5, [c2]: 3, [c3]: 1 }
    };

    // 1 selected candidate, no voter name
    getEl("voterNameInput").value = "";
    updateDockControls(fakeState);

    assert.equal(getEl("selectedCount").textContent, 1);
    assert.equal(getEl("counterInstruction").textContent, "Galite pasirinkti dar 2");
    assert.ok(getEl("votingDock").classList.contains("active"));
    assert.ok(!getEl("dockSelectedTray").classList.contains("hidden"));
    assert.ok(getEl("dockSelectedTray").innerHTML.includes("Petras"));
    assert.ok(getEl("dockSelectedTray").innerHTML.includes('data-remove-id="cand_1"'));
    assert.ok(getEl("dockSelectedTray").innerHTML.includes("dockClearAllBtn"));
    assert.equal(getEl("submitVoteBtn").disabled, true, "Submit should be disabled without voter name");

    // Add voter name (>= 2 chars)
    getEl("voterNameInput").value = "Vytas";
    updateDockControls(fakeState);
    assert.equal(getEl("submitVoteBtn").disabled, false, "Submit should be enabled with candidate and name");

    // 2 selected candidates
    fakeState.selectedCandidates.add(c2);
    updateDockControls(fakeState);
    assert.equal(getEl("counterInstruction").textContent, "Galite pasirinkti dar 1");

    // 3 selected candidates (limit reached)
    fakeState.selectedCandidates.add(c3);
    updateDockControls(fakeState);
    assert.equal(getEl("counterInstruction").textContent, "Pasirinkta norma (3 iš 3)");

    // 0 selected candidates (dock inactive)
    fakeState.selectedCandidates.clear();
    updateDockControls(fakeState);
    assert.equal(getEl("selectedCount").textContent, 0);
    assert.equal(getEl("counterInstruction").textContent, "Iki 3 kandidatų");
    assert.ok(!getEl("votingDock").classList.contains("active"));
    assert.ok(getEl("dockSelectedTray").classList.contains("hidden"));
    assert.equal(getEl("submitVoteBtn").disabled, true);
  });

  test("Leaderboard: Descending sort, podium ranks, and bidirectional navigation attrs", () => {
    const { getEl } = setupMockDOM();
    const fakeState = {
      contestants: [
        { id: "cand_low", name: "Mažasis", alias: "M", avatar: "🥉", category: "pupil" },
        { id: "cand_top", name: "Lyderis", alias: "L", avatar: "🥇", category: "teacher" },
        { id: "cand_mid", name: "Vidurinis", alias: "V", avatar: "🥈", category: "pupil" }
      ],
      votes: { cand_low: 5, cand_top: 25, cand_mid: 10 }
    };

    renderLeaderboard(fakeState);
    const html = getEl("leaderboardList").innerHTML;

    assert.ok(html.includes("Lyderis"));
    assert.ok(html.includes("#1"));
    assert.ok(html.includes("rank-1"));
    assert.ok(html.includes('data-contestant-id="cand_top"'));

    // Verify ordering: cand_top appears before cand_mid, and cand_mid before cand_low
    const posTop = html.indexOf('data-contestant-id="cand_top"');
    const posMid = html.indexOf('data-contestant-id="cand_mid"');
    const posLow = html.indexOf('data-contestant-id="cand_low"');

    assert.ok(posTop < posMid, "Top candidate must precede middle candidate");
    assert.ok(posMid < posLow, "Middle candidate must precede lowest candidate");
  });

  test("Contestants Roster: Category counts and empty zero-state", () => {
    const { getEl } = setupMockDOM();
    const fakeState = {
      contestants: [
        { id: "c1", name: "Jonas Mokinys", alias: "JM", avatar: "🎒", category: "pupil", tagline: "Mokinasi" },
        { id: "c2", name: "Petras Mokytojas", alias: "PM", avatar: "📚", category: "teacher", tagline: "Moko" },
        { id: "c3", name: "Saulius Siūlytasis", alias: "SS", avatar: "💡", category: "custom", tagline: "Pasiūlytas" }
      ],
      votes: { c1: 2, c2: 4, c3: 1 },
      selectedCandidates: new Set(),
      activeFilter: "all",
      searchQuery: ""
    };

    renderContestants(fakeState);

    // Verify category counts
    assert.equal(getEl("totalContestantsCount").textContent, 3);
    assert.equal(getEl("countFilterPupil").textContent, 1);
    assert.equal(getEl("countFilterTeacher").textContent, 1);
    assert.equal(getEl("countFilterCustom").textContent, 1);

    // Verify cards rendered
    const gridHtml = getEl("contestantsGrid").innerHTML;
    assert.ok(gridHtml.includes("Jonas Mokinys"));
    assert.ok(gridHtml.includes("Petras Mokytojas"));
    assert.ok(gridHtml.includes("Saulius Siūlytasis"));

    // Filter by search query with 0 results -> zero-state view
    fakeState.searchQuery = "Neegzistuojantis žmogus";
    renderContestants(fakeState);

    const emptyHtml = getEl("contestantsGrid").innerHTML;
    assert.ok(emptyHtml.includes("roster-empty-state"));
    assert.ok(emptyHtml.includes("Kandidatų nerasta"));
    assert.ok(emptyHtml.includes("Neegzistuojantis žmogus"));
    assert.ok(emptyHtml.includes("clearSearchBtn"));
  });

  test("Activity Feed: Empty state and ledger item rendering", () => {
    const { getEl } = setupMockDOM();
    const fakeState = {
      contestants: [
        { id: "c1", name: "Jonas", alias: "J", avatar: "🎒" }
      ],
      voterLedger: []
    };

    // Empty ledger
    renderActivity(fakeState);
    assert.equal(getEl("totalVotersBadge").textContent, "Balsavo: 0");
    assert.ok(!getEl("emptyActivityMsg").classList.contains("hidden"));

    // Populated ledger
    fakeState.voterLedger.push({
      voter: "Austėja",
      choices: ["c1"],
      timestamp: "14:20"
    });

    renderActivity(fakeState);
    assert.equal(getEl("totalVotersBadge").textContent, "Balsavo: 1");
    assert.ok(getEl("emptyActivityMsg").classList.contains("hidden"));
    const listHtml = getEl("activityList").innerHTML;
    assert.ok(listHtml.includes("Austėja"));
    assert.ok(listHtml.includes("14:20"));
    assert.ok(listHtml.includes("Jonas"));
  });
});

describe("Tautos Bukiausias - System & Version Consistency", () => {
  test("Version token consistency across package.json, constants.js, and index.html", () => {
    const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

    assert.equal(APP_VERSION, `v${pkg.version}`, "constants.js version must match package.json vX.Y.Z");
    assert.ok(html.includes(`id="appVersionBadge" title="Dabartinė gamybinė versija">${APP_VERSION}</span>`), "index.html version badge must match APP_VERSION");
    assert.ok(html.includes(`src="./src/main.js?v=${pkg.version}"`), "main.js script query param must match package.json version");
  });

  test("Stylesheet import integrity and brace symmetry", () => {
    const styleCss = fs.readFileSync(new URL("../style.css", import.meta.url), "utf8");
    const importRegex = /@import\s+url\(["']([^"']+)["']\);/g;
    const matches = [...styleCss.matchAll(importRegex)];

    assert.ok(matches.length >= 10, "style.css should import modular stylesheets");

    for (const match of matches) {
      const relPath = match[1];
      const filePath = new URL(`../${relPath}`, import.meta.url);
      assert.ok(fs.existsSync(filePath), `Imported CSS file must exist: ${relPath}`);

      const content = fs.readFileSync(filePath, "utf8");
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      assert.equal(openBraces, closeBraces, `Brace mismatch in ${relPath}: { count (${openBraces}) != } count (${closeBraces})`);
    }
  });

  test("Environment isolation (state_dev vs state) and storage keys", async () => {
    const { 
      isDevEnvironment, 
      getFirestoreDocName, 
      getActiveStorageKey, 
      LOCAL_STORAGE_KEY_PROD, 
      LOCAL_STORAGE_KEY_DEV 
    } = await import("../src/config/constants.js");

    // Default Node environment (without window)
    assert.equal(isDevEnvironment(), false, "Default non-browser should evaluate to prod");
    assert.equal(getFirestoreDocName(), "state", "Production should target 'state' document");
    assert.equal(getActiveStorageKey(), LOCAL_STORAGE_KEY_PROD, "Production should use prod storage key");

    // Simulated browser localhost
    globalThis.window = {
      location: { hostname: "localhost", search: "", protocol: "http:" }
    };
    globalThis.localStorage = {
      getItem: () => null
    };

    assert.equal(isDevEnvironment(), true, "localhost should evaluate to dev environment");
    assert.equal(getFirestoreDocName(), "state_dev", "Localhost should target 'state_dev' document");
    assert.equal(getActiveStorageKey(), LOCAL_STORAGE_KEY_DEV, "Localhost should use dev storage key");

    // Simulated explicit ?env=prod query override
    globalThis.window.location.search = "?env=prod";
    assert.equal(isDevEnvironment(), false, "?env=prod query param should force production");
    assert.equal(getFirestoreDocName(), "state");

    // Cleanup globals
    delete globalThis.window;
    delete globalThis.localStorage;
  });
});
