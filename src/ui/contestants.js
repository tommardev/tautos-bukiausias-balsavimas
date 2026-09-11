/**
 * Contestants Roster Grid Component
 */

import { escapeHTML } from "../utils/dom.js";
import { toggleCandidateSelection } from "../state/store.js";
import { showToast } from "./toast.js";

/**
 * Handles toggling candidate selection with validation toast.
 * @param {string} id 
 */
export function handleCandidateToggle(id) {
  const result = toggleCandidateSelection(id);
  if (result && result.limitReached) {
    showToast("Daugiausiai galima pasirinkti 3 kandidatus!", "toast-error");
  }
}

/**
 * Attaches a single delegated click and keydown listener to the contestants grid.
 * @param {HTMLElement} grid 
 */
function initDelegatedGridListeners(grid) {
  if (!grid || grid.dataset.delegated === "true") return;

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".contestant-card");
    if (card) {
      const id = card.getAttribute("data-id");
      if (id) handleCandidateToggle(id);
    }
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".contestant-card");
      if (card) {
        e.preventDefault();
        const id = card.getAttribute("data-id");
        if (id) handleCandidateToggle(id);
      }
    }
  });

  grid.dataset.delegated = "true";
}

/**
 * Renders filtered contestant cards into #contestantsGrid.
 * @param {Object} state 
 */
export function renderContestants(state) {
  const grid = document.getElementById("contestantsGrid");
  if (!grid) return;

  initDelegatedGridListeners(grid);

  const query = state.searchQuery.toLowerCase();
  const filtered = state.contestants.filter(c => {
    const matchesCategory = state.activeFilter === "all" || c.category === state.activeFilter;
    const matchesSearch = !query || 
      c.name.toLowerCase().includes(query) ||
      c.alias.toLowerCase().includes(query) ||
      c.tagline.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const totalCountEl = document.getElementById("totalContestantsCount");
  if (totalCountEl) totalCountEl.textContent = state.contestants.length;

  const isMaxReached = state.selectedCandidates.size >= 3;

  grid.innerHTML = filtered.map(c => {
    const isSelected = state.selectedCandidates.has(c.id);
    const isDisabled = !isSelected && isMaxReached;
    const voteCount = state.votes[c.id] || 0;
    const voteLabel = `${voteCount} ${voteCount === 1 ? 'balsas' : 'balsai'}`;

    return `
      <article 
        class="contestant-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
        data-id="${escapeHTML(c.id)}"
        tabindex="${isDisabled ? '-1' : '0'}"
        role="button"
        aria-pressed="${isSelected}"
        aria-label="${escapeHTML(c.name)}, ${voteLabel}"
      >
        <div class="card-top">
          <div class="card-avatar-pod">
            <span class="card-avatar">${escapeHTML(c.avatar)}</span>
          </div>
          <span class="card-check" aria-hidden="true">${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}</span>
        </div>
        <div class="card-body">
          <div class="card-category-tag">${escapeHTML(c.categoryLabel || 'Kandidatas')}</div>
          <h3 class="contestant-name">${escapeHTML(c.name)}</h3>
          <div class="contestant-alias">${escapeHTML(c.alias)}</div>
          <p class="contestant-tagline">${escapeHTML(c.tagline)}</p>
        </div>
        <div class="card-footer">
          <span class="card-vote-count">${voteLabel}</span>
          <span class="card-action-status">${isSelected ? 'Pasirinkta' : (isDisabled ? 'Laisvų vietų: 0' : 'Pasirinkti')}</span>
        </div>
      </article>
    `;
  }).join("");
}
