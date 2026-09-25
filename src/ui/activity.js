import { escapeHTML } from "../utils/dom.js";

const seenLedgerSignatures = new Set();
let isInitialActivityRender = true;

/**
 * Creates a unique signature string for a ledger entry.
 * @param {Object} item 
 * @returns {string}
 */
function makeLedgerSignature(item) {
  if (!item || typeof item !== "object") return "";
  const voter = (item.voter || "").trim();
  const timestamp = (item.timestamp || "").trim();
  const choices = Array.isArray(item.choices) ? [...item.choices].sort().join(",") : "";
  return `${voter}_${timestamp}_${choices}`;
}

/**
 * Renders the recent voter audit feed into #activityList with entrance animation for new votes.
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

  const recentItems = ledger.slice(0, 15);

  // On first paint, seed existing ledger items without animating all of them
  if (isInitialActivityRender) {
    recentItems.forEach(item => {
      seenLedgerSignatures.add(makeLedgerSignature(item));
    });
    isInitialActivityRender = false;
  }

  listEl.innerHTML = recentItems.map(item => {
    if (!item || typeof item !== "object") return "";
    const choices = Array.isArray(item.choices) ? item.choices : [];
    const candidateChips = choices.map(id => {
      const c = state.contestants.find(cand => cand.id === id);
      return `<span class="choice-chip">${c ? escapeHTML(c.avatar) + ' ' + escapeHTML(c.name) : escapeHTML(id)}</span>`;
    }).join("");

    const voterName = (typeof item.voter === "string" && item.voter.trim()) ? item.voter.trim() : "Balsuotojas";
    const timeDisplay = (typeof item.timestamp === "string") ? item.timestamp : "";

    const sig = makeLedgerSignature(item);
    const isNew = !seenLedgerSignatures.has(sig);
    if (isNew) {
      seenLedgerSignatures.add(sig);
    }

    return `
      <div class="activity-item ${isNew ? 'activity-item-new' : ''}">
        <div class="activity-voter-info">
          <span class="activity-time" title="Balsavimo laikas: ${escapeHTML(timeDisplay)}">${escapeHTML(timeDisplay)}</span>
          <span class="activity-voter-name">${escapeHTML(voterName)}</span>
        </div>
        <div class="activity-choices">
          ${candidateChips}
        </div>
      </div>
    `;
  }).join("");
}

