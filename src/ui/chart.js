/**
 * Modern Votes Bar Chart Component
 * High-clarity vertical column bar chart taking ~half-screen space.
 * Built according to Emil Kowalski & Karpathy simplicity standards.
 */

import { escapeHTML } from "../utils/dom.js";

/**
 * Formats contestant name to fit cleanly in compact column layout.
 * e.g., "Petras Gražulis" -> "Petras G."
 * @param {string} fullName 
 * @returns {string}
 */
function formatShortName(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

/**
 * Computes readable Y-axis tick values with comfortable visual headroom.
 * @param {number} maxVotes 
 * @returns {{ yMax: number, ticks: number[] }}
 */
function computeYAxisScale(maxVotes) {
  // Ensure minimum scale headroom of at least 4
  const ceiling = Math.max(maxVotes + (maxVotes > 10 ? 2 : 1), 4);
  const step = ceiling <= 6 ? 1 : (ceiling <= 15 ? 3 : Math.ceil(ceiling / 5));
  const yMax = Math.ceil(ceiling / step) * step;

  const ticks = [];
  for (let val = 0; val <= yMax; val += step) {
    ticks.push(val);
  }
  return { yMax, ticks };
}

/**
 * Renders the modern votes bar chart into #votesChartContainer.
 * @param {Object} state 
 */
export function renderChart(state) {
  const container = document.getElementById("votesChartContainer");
  if (!container) return;

  const contestantsWithVotes = state.contestants.map(c => ({
    ...c,
    voteCount: state.votes[c.id] || 0
  })).sort((a, b) => b.voteCount - a.voteCount);

  const totalVotes = Object.values(state.votes).reduce((sum, v) => sum + v, 0) || 0;
  const maxVotes = Math.max(...contestantsWithVotes.map(c => c.voteCount), 0);
  const { yMax, ticks } = computeYAxisScale(maxVotes);

  const leader = contestantsWithVotes[0];
  const leaderLabel = totalVotes > 0 && leader && leader.voteCount > 0
    ? `Dabartinis lyderis: <strong>${escapeHTML(leader.name)}</strong> (${leader.voteCount} ${leader.voteCount === 1 ? 'balsas' : 'balsai'})`
    : "Balsavimas atidarytas • Atiduokite savo balsą žemiau";

  container.innerHTML = `
    <div class="chart-meta-bar">
      <div class="chart-summary-info">
        <span class="chart-leader-highlight">${leaderLabel}</span>
      </div>
      <div class="chart-total-pill">
        Iš viso balsų: <strong>${totalVotes}</strong>
      </div>
    </div>

    <div class="votes-chart" role="region" aria-label="Balsavimo rezultatų stulpelinė diagrama">
      <!-- Y-Axis Grid Reference Lines -->
      <div class="chart-grid" aria-hidden="true">
        ${ticks.map(tick => {
          const bottomPct = yMax > 0 ? (tick / yMax) * 100 : 0;
          return `
            <div class="chart-grid-line" style="bottom: ${bottomPct}%;">
              <span class="grid-tick-label">${tick}</span>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Scrollable Columns Track -->
      <div class="chart-scroll-area">
        <div class="chart-columns-track">
          ${contestantsWithVotes.map((c, idx) => {
            const rank = idx + 1;
            const rankClass = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : ''));
            const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
            const heightPct = yMax > 0 ? Math.max(Math.round((c.voteCount / yMax) * 100), 4) : 4;
            const shortName = formatShortName(c.name);
            const isSelected = state.selectedCandidates.has(c.id);

            return `
              <div 
                class="chart-col ${rankClass} ${isSelected ? 'selected' : ''}" 
                data-id="${c.id}"
                title="${escapeHTML(c.name)} (${escapeHTML(c.alias)}): ${c.voteCount} ${c.voteCount === 1 ? 'balsas' : 'balsai'} (${pct}%) – #${rank} vieta"
              >
                <!-- Top Value Header -->
                <div class="chart-col-head">
                  <span class="chart-col-votes">${c.voteCount}</span>
                  <span class="chart-col-pct">${pct}%</span>
                </div>

                <!-- Proportional Bar Pillar -->
                <div class="chart-bar-slot">
                  <div 
                    class="chart-bar-pillar" 
                    style="height: ${heightPct}%;"
                    aria-valuenow="${c.voteCount}" 
                    aria-valuemin="0" 
                    aria-valuemax="${yMax}"
                  >
                    <div class="pillar-cap"></div>
                  </div>
                </div>

                <!-- Bottom Candidate Anchor -->
                <div class="chart-col-base">
                  <span class="chart-col-avatar">${c.avatar}</span>
                  <span class="chart-col-rank">#${rank}</span>
                  <span class="chart-col-name">${escapeHTML(shortName)}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}
