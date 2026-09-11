/**
 * Live Horizontal Leaderboard Component
 */

import { escapeHTML } from "../utils/dom.js";

/**
 * Renders the ranked leaderboard rows into #leaderboardList.
 * @param {Object} state 
 */
export function renderLeaderboard(state) {
  const container = document.getElementById("leaderboardList");
  if (!container) return;

  const contestantsWithVotes = state.contestants.map(c => ({
    ...c,
    voteCount: state.votes[c.id] || 0
  })).sort((a, b) => b.voteCount - a.voteCount);

  const totalVotes = Object.values(state.votes).reduce((sum, v) => sum + v, 0) || 1;

  // Toggle visibility of Chart vs List containers based on standingsView
  const chartContainer = document.getElementById("votesChartContainer");
  const chartBtn = document.getElementById("viewChartBtn");
  const listBtn = document.getElementById("viewListBtn");

  const isChart = state.standingsView !== "list";

  if (chartContainer) {
    if (isChart) {
      chartContainer.classList.remove("hidden");
    } else {
      chartContainer.classList.add("hidden");
    }
  }

  if (isChart) {
    container.classList.add("hidden");
  } else {
    container.classList.remove("hidden");
  }

  if (chartBtn && listBtn) {
    if (isChart) {
      chartBtn.classList.add("active");
      chartBtn.setAttribute("aria-pressed", "true");
      listBtn.classList.remove("active");
      listBtn.setAttribute("aria-pressed", "false");
    } else {
      chartBtn.classList.remove("active");
      chartBtn.setAttribute("aria-pressed", "false");
      listBtn.classList.add("active");
      listBtn.setAttribute("aria-pressed", "true");
    }
  }

  container.innerHTML = contestantsWithVotes.map((c, idx) => {
    const rank = idx + 1;
    const rankClass = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : ''));
    const pct = Math.round((c.voteCount / totalVotes) * 100);

    return `
      <div class="leaderboard-row ${rankClass}">
        <span class="leaderboard-rank">#${rank}</span>
        <span class="leaderboard-avatar">${escapeHTML(c.avatar)}</span>
        <div class="leaderboard-details">
          <div class="leaderboard-names">
            <span class="leaderboard-name">${escapeHTML(c.name)}</span>
            <span class="leaderboard-alias">${escapeHTML(c.alias)}</span>
          </div>
          <div class="leaderboard-bar-track">
            <div class="leaderboard-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
        <div class="leaderboard-stats">
          <div class="leaderboard-votes">${c.voteCount}</div>
          <div class="leaderboard-pct">${pct}%</div>
        </div>
      </div>
    `;
  }).join("");
}
