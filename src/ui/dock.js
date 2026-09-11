/**
 * Voting Action Dock Component
 */

/**
 * Updates the floating voting dock counter, instructions, and submit button state.
 * @param {Object} state 
 */
export function updateDockControls(state) {
  const selectedCount = state.selectedCandidates.size;
  const countEl = document.getElementById("selectedCount");
  const instructionEl = document.getElementById("counterInstruction");
  const submitBtn = document.getElementById("submitVoteBtn");
  const dock = document.getElementById("votingDock");
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

  if (submitBtn) {
    if (submitBtn.textContent === "Balsuojama...") {
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = !(selectedCount > 0 && voterName.length >= 2);
    }
  }
}
