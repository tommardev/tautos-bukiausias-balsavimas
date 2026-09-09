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
 * Renders filtered contestant cards into #contestantsGrid.
 * @param {Object} state 
 */
export function renderContestants(state) {
  const grid = document.getElementById("contestantsGrid");
  if (!grid) return;

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
        data-id="${c.id}"
        tabindex="${isDisabled ? '-1' : '0'}"
        role="button"
        aria-pressed="${isSelected}"
        aria-label="${escapeHTML(c.name)}, ${voteLabel}"
      >
        <div class="card-top">
          <span class="card-avatar">${c.avatar}</span>
          <span class="card-check">${isSelected ? '✓' : ''}</span>
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

  // Attach card selection event listeners
  grid.querySelectorAll(".contestant-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      if (id) handleCandidateToggle(id);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const id = card.getAttribute("data-id");
        if (id) handleCandidateToggle(id);
      }
    });
  });
}
