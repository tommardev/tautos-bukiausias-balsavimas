/**
 * Tautos Bukiausias 2026 – TV3 Balsavimo Platforma
 * Main Application Bootstrap & Controller (ES Module)
 */

import { CLOUD_SYNC_INTERVAL_MS, APP_VERSION } from "./config/constants.js";
import { 
  getState, 
  subscribe, 
  setFilter, 
  setSearchQuery, 
  setStandingsView,
  recordVote, 
  resetAllData, 
  hydrateFromLocalStorage 
} from "./state/store.js";
import { fetchCloudState, pushCloudState, initRealtimeCloudSync } from "./services/api.js";
import { loadLocalFallback, saveLocalFallback } from "./services/storage.js";
import { renderAll } from "./ui/render.js";
import { updateDockControls } from "./ui/dock.js";
import { initModal } from "./ui/modal.js";
import { showToast } from "./ui/toast.js";
import { triggerConfetti } from "./utils/effects.js";

/**
 * Handles the vote submission workflow.
 */
async function handleVoteSubmit() {
  const voterNameInput = document.getElementById("voterNameInput");
  const voterName = (voterNameInput?.value || "").trim();

  if (!voterName || voterName.length < 2) {
    showToast("Įveskite savo vardą balsavimui!", "toast-error");
    voterNameInput?.focus();
    return;
  }

  const state = getState();
  if (state.selectedCandidates.size === 0) {
    showToast("Pasirinkite bent 1 kandidatą!", "toast-error");
    return;
  }

  const selectedIds = Array.from(state.selectedCandidates);
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  recordVote({
    voter: voterName,
    choices: selectedIds,
    timestamp: timeStr
  });

  triggerConfetti();
  showToast(`Ačiū, ${voterName}! Tavo balsas sėkmingai užfiksuotas.`, "toast-success");

  await pushCloudState();
}

/**
 * Initializes the application once the DOM is ready.
 */
function initApp() {
  // 1. Subscribe render coordinator to store updates
  subscribe(renderAll);

  // 2. Hydrate from localStorage fallback immediately for instant first paint
  const localFallback = loadLocalFallback();
  if (localFallback) {
    hydrateFromLocalStorage(localFallback);
  }

  // 3. Connect to live Realtime Cloud Firestore sync (instant push updates across all devices)
  initRealtimeCloudSync();

  // 4. Voter Name input listener
  const voterInput = document.getElementById("voterNameInput");
  voterInput?.addEventListener("input", () => {
    updateDockControls(getState());
  });

  // 5. Submit vote button
  document.getElementById("submitVoteBtn")?.addEventListener("click", handleVoteSubmit);

  // 6. Category filter pills
  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category") || "all";
      setFilter(category);
    });
  });

  // 7. Search filter input
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    setSearchQuery(e.target.value);
  });

  // 8. View switcher buttons (Chart vs List)
  document.getElementById("viewChartBtn")?.addEventListener("click", () => {
    setStandingsView("chart");
  });
  document.getElementById("viewListBtn")?.addEventListener("click", () => {
    setStandingsView("list");
  });

  // 9. Scroll to top floating button
  const scrollTopBtn = document.getElementById("scrollToTopBtn");
  let scrollTicking = false;

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 280) {
          scrollTopBtn?.classList.add("visible");
        } else {
          scrollTopBtn?.classList.remove("visible");
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener("click", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ 
      top: 0, 
      behavior: prefersReducedMotion ? "auto" : "smooth" 
    });
  });

  // 10. Initialize modal handlers
  initModal();

  // 11. Reset data button (Discrete test reset in footer)
  document.getElementById("resetDataBtn")?.addEventListener("click", () => {
    if (confirm("Ar tikrai norite atstatyti visus balsus ir pradėti iš naujo?")) {
      resetAllData();
      saveLocalFallback(getState());
      pushCloudState();
      showToast("Visi balsai sėkmingai atstatyti.", "toast-success");
    }
  });

  // 12. Version tracking badge
  const versionBadge = document.getElementById("appVersionBadge");
  if (versionBadge) {
    versionBadge.textContent = APP_VERSION;
    versionBadge.setAttribute("title", `Versija: ${APP_VERSION} (Gyva gamybinė versija)`);
  }

  // 13. Initial render pass
  renderAll(getState());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
