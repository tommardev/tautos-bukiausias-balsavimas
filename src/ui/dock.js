import { escapeHTML } from "../utils/dom.js";
import { toggleCandidateSelection, clearCandidateSelections } from "../state/store.js";

/**
 * Attaches a single delegated click listener to the dock tray.
 * @param {HTMLElement} trayEl 
 */
function initDelegatedTrayListener(trayEl) {
  if (!trayEl || trayEl.dataset.delegated === "true") return;

  trayEl.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-id]");
    if (removeBtn) {
      const id = removeBtn.getAttribute("data-remove-id");
      if (id) toggleCandidateSelection(id);
      return;
    }

    if (e.target.closest("#dockClearAllBtn")) {
      clearCandidateSelections();
    }
  });

  trayEl.dataset.delegated = "true";
}

/**
 * Updates the floating voting dock counter, instructions, chips tray, and submit button state.
 * @param {Object} state 
 */
export function updateDockControls(state) {
  const selectedCount = state.selectedCandidates.size;
  const countEl = document.getElementById("selectedCount");
  const instructionEl = document.getElementById("counterInstruction");
  const submitBtn = document.getElementById("submitVoteBtn");
  const dock = document.getElementById("votingDock");
  const trayEl = document.getElementById("dockSelectedTray");
  const voterName = (document.getElementById("voterNameInput")?.value || "").trim();

  if (countEl) countEl.textContent = selectedCount;

  if (instructionEl) {
    if (selectedCount === 0) instructionEl.textContent = "Iki 3 kandidatų";
    else if (selectedCount === 1) instructionEl.textContent = "Galite pasirinkti dar 2";
    else if (selectedCount === 2) instructionEl.textContent = "Galite pasirinkti dar 1";
    else instructionEl.textContent = "Pasirinkta norma (3 iš 3)";
  }

  if (dock) {
    if (selectedCount > 0) dock.classList.add("active");
    else dock.classList.remove("active");
  }

  // Render selected candidate chips tray
  if (trayEl) {
    initDelegatedTrayListener(trayEl);

    if (selectedCount > 0) {
      trayEl.classList.remove("hidden");
      const chips = Array.from(state.selectedCandidates).map(id => {
        const c = state.contestants.find(cand => cand.id === id);
        if (!c) return "";
        return `
          <div class="dock-candidate-chip" data-id="${escapeHTML(c.id)}">
            <span class="dock-chip-avatar" aria-hidden="true">${escapeHTML(c.avatar)}</span>
            <span class="dock-chip-name">${escapeHTML(c.name)}</span>
            <button 
              type="button" 
              class="dock-chip-remove" 
              data-remove-id="${escapeHTML(c.id)}" 
              aria-label="Pašalinti kandidatą ${escapeHTML(c.name)}"
              title="Pašalinti"
            >&times;</button>
          </div>
        `;
      }).join("");

      trayEl.innerHTML = `
        <div class="dock-tray-chips" role="group" aria-label="Pasirinkti kandidatai">
          ${chips}
        </div>
        <button type="button" class="dock-clear-all-btn" id="dockClearAllBtn">
          Išvalyti visus
        </button>
      `;
    } else {
      trayEl.classList.add("hidden");
      trayEl.innerHTML = "";
    }
  }

  if (submitBtn) {
    if (submitBtn.textContent === "Balsuojama...") {
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = !(selectedCount > 0 && voterName.length >= 2);
    }
  }
}

