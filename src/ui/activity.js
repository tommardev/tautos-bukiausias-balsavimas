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
    const candidateChips = item.choices.map(id => {
      const c = state.contestants.find(cand => cand.id === id);
      return `<span class="choice-chip">${c ? c.avatar + ' ' + escapeHTML(c.name) : id}</span>`;
    }).join("");

    return `
      <div class="activity-item">
        <div class="activity-voter-info">
          <span class="activity-time">${escapeHTML(item.timestamp || '')}</span>
          <span class="activity-voter-name">${escapeHTML(item.voter)}</span>
        </div>
        <div class="activity-choices">
          ${candidateChips}
        </div>
      </div>
    `;
  }).join("");
}
