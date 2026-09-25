import { escapeHTML, navigateToContestantCard } from "../utils/dom.js";

/**
 * Attaches a single delegated click and keydown listener to the leaderboard container.
 * @param {HTMLElement} container 
 */
function initDelegatedLeaderboardListeners(container) {
  if (!container || container.dataset.delegated === "true") return;

  container.addEventListener("click", (e) => {
    const row = e.target.closest(".leaderboard-row");
    if (row) {
      const id = row.getAttribute("data-contestant-id");
      if (id) navigateToContestantCard(id);
    }
  });

  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const row = e.target.closest(".leaderboard-row");
      if (row) {
        e.preventDefault();
        const id = row.getAttribute("data-contestant-id");
        if (id) navigateToContestantCard(id);
      }
    }
  });

  container.dataset.delegated = "true";
}

/**
 * Renders the ranked leaderboard rows into #leaderboardList.
 * @param {Object} state 
 */
export function renderLeaderboard(state) {
  const container = document.getElementById("leaderboardList");
  if (!container) return;

  initDelegatedLeaderboardListeners(container);

  const contestantsWithVotes = state.contestants.map(c => ({
    ...c,
    voteCount: state.votes[c.id] || 0
  })).sort((a, b) => b.voteCount - a.voteCount);

  const totalVotes = contestantsWithVotes.reduce((sum, c) => sum + c.voteCount, 0) || 1;

  container.innerHTML = contestantsWithVotes.map((c, idx) => {
    const rank = idx + 1;
    const rankClass = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : ''));
    const pct = Math.round((c.voteCount / totalVotes) * 100);

    return `
      <div 
        class="leaderboard-row ${rankClass}" 
        data-contestant-id="${escapeHTML(c.id)}"
        role="button"
        tabindex="0"
        title="Spustelėkite, norėdami pamatyti ${escapeHTML(c.name)} kortelę sąraše"
        aria-label="#${rank} vieta: ${escapeHTML(c.name)}, ${c.voteCount} balsų (${pct}%). Spustelėkite, norėdami atiduoti balsą."
      >
        <span class="leaderboard-rank">#${rank}</span>
        <span class="leaderboard-avatar" aria-hidden="true">${escapeHTML(c.avatar)}</span>
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

