/**
 * Centralized Idempotent Render Coordinator
 */

import { renderLeaderboard } from "./leaderboard.js";
import { renderChart } from "./chart.js";
import { renderContestants } from "./contestants.js";
import { renderActivity } from "./activity.js";
import { updateDockControls } from "./dock.js";

/**
 * Toggles container visibility and button states based on state.standingsView ('chart' | 'list').
 * @param {Object} state 
 */
function updateStandingsViewVisibility(state) {
  const chartContainer = document.getElementById("votesChartContainer");
  const leaderboardList = document.getElementById("leaderboardList");
  const chartBtn = document.getElementById("viewChartBtn");
  const listBtn = document.getElementById("viewListBtn");

  const isChart = state.standingsView !== "list";

  if (chartContainer) {
    chartContainer.classList.toggle("hidden", !isChart);
  }

  if (leaderboardList) {
    leaderboardList.classList.toggle("hidden", isChart);
  }

  if (chartBtn && listBtn) {
    chartBtn.classList.toggle("active", isChart);
    chartBtn.setAttribute("aria-pressed", isChart ? "true" : "false");
    listBtn.classList.toggle("active", !isChart);
    listBtn.setAttribute("aria-pressed", !isChart ? "true" : "false");
  }
}

/**
 * Idempotently re-renders UI sections based on current state.
 * Selectively renders either chart or leaderboard to optimize render performance.
 * @param {Object} state 
 */
export function renderAll(state) {
  updateStandingsViewVisibility(state);

  if (state.standingsView === "list") {
    renderLeaderboard(state);
  } else {
    renderChart(state);
  }

  renderContestants(state);
  renderActivity(state);
  updateDockControls(state);
}
