/**
 * Add Contestant Modal Component
 */

import { addCustomContestant } from "../state/store.js";
import { pushCloudState } from "../services/api.js";
import { showToast } from "./toast.js";

/**
 * Opens the add candidate modal.
 */
export function openAddModal() {
  document.getElementById("addContestantModal")?.classList.remove("hidden");
  document.getElementById("newCandidateName")?.focus();
}

/**
 * Closes the add candidate modal and resets the form.
 */
export function closeAddModal() {
  document.getElementById("addContestantModal")?.classList.add("hidden");
  document.getElementById("addContestantForm")?.reset();
}

/**
 * Handles custom candidate form submission.
 * @param {Event} e 
 */
export async function handleAddContestantSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById("newCandidateName");
  const aliasInput = document.getElementById("newCandidateAlias");
  const taglineInput = document.getElementById("newCandidateTagline");
  const emojiInput = document.getElementById("selectedEmoji");

  const name = (nameInput?.value || "").trim();
  const alias = (aliasInput?.value || "").trim();
  const tagline = (taglineInput?.value || "").trim();
  const avatar = emojiInput?.value || "🤡";

  if (!name || !alias || !tagline) return;

  const newId = "custom_" + Date.now().toString(36);
  const newCandidate = {
    id: newId,
    name,
    alias: alias.startsWith("„") ? alias : `„${alias}“`,
    tagline,
    avatar,
    category: "custom",
    categoryLabel: "Pasiūlytas Draugų"
  };

  addCustomContestant(newCandidate);
  closeAddModal();
  showToast(`${name} įtrauktas į kandidatų sąrašą!`, "toast-success");

  await pushCloudState();
}

/**
 * Initializes modal dialog event listeners.
 */
export function initModal() {
  document.getElementById("openAddModalBtn")?.addEventListener("click", openAddModal);
  document.getElementById("closeModalBtn")?.addEventListener("click", closeAddModal);
  document.getElementById("cancelAddBtn")?.addEventListener("click", closeAddModal);
  document.getElementById("addContestantForm")?.addEventListener("submit", handleAddContestantSubmit);

  // Emoji buttons selector
  document.querySelectorAll(".emoji-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const emojiInput = document.getElementById("selectedEmoji");
      if (emojiInput) {
        emojiInput.value = btn.getAttribute("data-emoji") || "🤡";
      }
    });
  });
}
