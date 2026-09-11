/**
 * Voter Audit Activity Log Component
 */

import { escapeHTML } from "../utils/dom.js";

/**
 * Renders the recent voter audit feed into #activityList.
 * @param {Object} state 
 */
export function renderActivity(state) {
  const listEl = document.getElementById("activityList");
  const emptyMsg = document.getElementById("emptyActivityMsg");
  const totalBadge = document.getElementById("totalVotersBadge");
  if (!listEl) return;

  const ledger = [...state.voterLedger].reverse();

  if (totalBadge) {
    totalBadge.textContent = `Balsavo: ${ledger.length}`;
  }

  if (ledger.length === 0) {
    listEl.innerHTML = "";
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("hidden");

  listEl.innerHTML = ledger.slice(0, 15).map(item => {
    if (!item || typeof item !== "object") return "";
    const choices = Array.isArray(item.choices) ? item.choices : [];
    const candidateChips = choices.map(id => {
      const c = state.contestants.find(cand => cand.id === id);
      return `<span class="choice-chip">${c ? escapeHTML(c.avatar) + ' ' + escapeHTML(c.name) : escapeHTML(id)}</span>`;
    }).join("");

    const voterName = (typeof item.voter === "string" && item.voter.trim()) ? item.voter.trim() : "Balsuotojas";
    const timeDisplay = (typeof item.timestamp === "string") ? item.timestamp : "";

    return `
      <div class="activity-item">
        <div class="activity-voter-info">
          <span class="activity-time">${escapeHTML(timeDisplay)}</span>
          <span class="activity-voter-name">${escapeHTML(voterName)}</span>
        </div>
        <div class="activity-choices">
          ${candidateChips}
        </div>
      </div>
    `;
  }).join("");
}
