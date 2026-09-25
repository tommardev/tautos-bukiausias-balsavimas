import { escapeHTML, formatVotesLt } from "../utils/dom.js";
import { toggleCandidateSelection, setFilter, setSearchQuery } from "../state/store.js";
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
    // Check if clicked the clear search/filter button in empty state
    if (e.target.closest("#clearSearchBtn")) {
      setFilter("all");
      setSearchQuery("");
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }
      const searchClearBtn = document.getElementById("searchClearBtn");
      if (searchClearBtn) searchClearBtn.classList.add("hidden");

      document.querySelectorAll(".filter-pill").forEach(b => {
        const isAll = b.getAttribute("data-category") === "all";
        b.classList.toggle("active", isAll);
        b.setAttribute("aria-pressed", isAll ? "true" : "false");
      });
      return;
    }

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
 * Updates filter pill count badges with live numbers.
 * @param {Object} state 
 */
function updateCategoryFilterCounts(state) {
  const total = state.contestants.length;
  const pupilCount = state.contestants.filter(c => c.category === "pupil").length;
  const teacherCount = state.contestants.filter(c => c.category === "teacher").length;
  const customCount = state.contestants.filter(c => c.category === "custom").length;

  const totalCountEl = document.getElementById("totalContestantsCount");
  const pupilEl = document.getElementById("countFilterPupil");
  const teacherEl = document.getElementById("countFilterTeacher");
  const customEl = document.getElementById("countFilterCustom");

  if (totalCountEl) totalCountEl.textContent = total;
  if (pupilEl) pupilEl.textContent = pupilCount;
  if (teacherEl) teacherEl.textContent = teacherCount;
  if (customEl) customEl.textContent = customCount;
}

/**
 * Renders filtered contestant cards into #contestantsGrid or displays a zero-state.
 * @param {Object} state 
 */
export function renderContestants(state) {
  const grid = document.getElementById("contestantsGrid");
  if (!grid) return;

  initDelegatedGridListeners(grid);
  updateCategoryFilterCounts(state);

  const query = state.searchQuery.toLowerCase();
  const filtered = state.contestants.filter(c => {
    const matchesCategory = state.activeFilter === "all" || c.category === state.activeFilter;
    const matchesSearch = !query || 
      c.name.toLowerCase().includes(query) ||
      c.alias.toLowerCase().includes(query) ||
      c.tagline.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="roster-empty-state" role="status">
        <div class="empty-state-icon" aria-hidden="true">🔍</div>
        <h3 class="empty-state-title">Kandidatų nerasta</h3>
        <p class="empty-state-text">
          ${query 
            ? `Pagal paieškos užklausą „<strong>${escapeHTML(state.searchQuery)}</strong>“ nieko neradome.` 
            : 'Šioje kategorijoje kandidatų kol kas nėra.'}
        </p>
        <button type="button" class="btn-clear-search" id="clearSearchBtn">
          Išvalyti filtrus ir paiešką
        </button>
      </div>
    `;
    return;
  }

  const isMaxReached = state.selectedCandidates.size >= 3;

  grid.innerHTML = filtered.map(c => {
    const isSelected = state.selectedCandidates.has(c.id);
    const isDisabled = !isSelected && isMaxReached;
    const voteCount = state.votes[c.id] || 0;
    const voteLabel = formatVotesLt(voteCount);

    return `
      <article 
        class="contestant-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
        data-id="${escapeHTML(c.id)}"
        tabindex="0"
        role="button"
        aria-pressed="${isSelected}"
        aria-label="${escapeHTML(c.name)} (${escapeHTML(c.alias)}) – ${escapeHTML(c.tagline)}. ${voteLabel}"
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

