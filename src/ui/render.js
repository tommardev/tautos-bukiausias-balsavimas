/**
 * Centralized Idempotent Render Coordinator
 */

import { renderLeaderboard } from "./leaderboard.js";
import { renderChart } from "./chart.js";
import { renderContestants } from "./contestants.js";
import { renderActivity } from "./activity.js";
import { updateDockControls } from "./dock.js";

/**
 * Idempotently re-renders all UI sections based on current state.
 * @param {Object} state 
 */
export function renderAll(state) {
  renderChart(state);
  renderLeaderboard(state);
  renderContestants(state);
  renderActivity(state);
  updateDockControls(state);
}
