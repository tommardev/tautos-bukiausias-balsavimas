/**
 * Tautos Bukiausias 2026 – TV3 Balsavimo Platforma
 * Main Application Bootstrap & Controller (ES Module)
 */

import { APP_VERSION } from "./config/constants.js";
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
import { pushCloudState, initRealtimeCloudSync } from "./services/api.js";
import { loadLocalFallback, saveLocalFallback } from "./services/storage.js";
import { renderAll } from "./ui/render.js";
import { updateDockControls } from "./ui/dock.js";
import { initModal } from "./ui/modal.js";
import { showToast } from "./ui/toast.js";
import { triggerConfetti } from "./utils/effects.js";

/** Cooldown duration between vote submissions in milliseconds (5s) */
const VOTE_COOLDOWN_MS = 5000;

/**
 * Handles the vote submission workflow with cooldown and double-click prevention.
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

  // Rate limiting check: prevent rapid submissions or accidental double clicks
  const lastVoteTimestamp = Number(sessionStorage.getItem("tautos_last_vote_timestamp")) || 0;
  const now = Date.now();
  if (now - lastVoteTimestamp < VOTE_COOLDOWN_MS) {
    const remainingSec = Math.ceil((VOTE_COOLDOWN_MS - (now - lastVoteTimestamp)) / 1000);
    showToast(`Prašome palaukti ${remainingSec} sek. prieš kitą balsavimą!`, "toast-error");
    return;
  }

  const submitBtn = document.getElementById("submitVoteBtn");
  const originalBtnText = submitBtn ? submitBtn.textContent : "Balsuoti";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Balsuojama...";
  }

  const selectedIds = Array.from(state.selectedCandidates);
  const nowDate = new Date();
  const timeStr = `${nowDate.getHours().toString().padStart(2, '0')}:${nowDate.getMinutes().toString().padStart(2, '0')}`;

  recordVote({
    voter: voterName,
    choices: selectedIds,
    timestamp: timeStr
  });

  sessionStorage.setItem("tautos_last_vote_timestamp", String(Date.now()));
  triggerConfetti();
  showToast(`Ačiū, ${voterName}! Tavo balsas sėkmingai užfiksuotas.`, "toast-success");

  try {
    await pushCloudState();
  } finally {
    if (submitBtn) {
      submitBtn.textContent = originalBtnText;
    }
    updateDockControls(getState());
  }
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
      document.querySelectorAll(".filter-pill").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      const category = btn.getAttribute("data-category") || "all";
      setFilter(category);
    });
  });

  // 7. Search filter input (debounced by 150ms to prevent render cascade on fast typing)
  let searchDebounceTimer = null;
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      setSearchQuery(e.target.value);
    }, 150);
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

  // 11. Optional developer debug console helper
  if (typeof window !== "undefined") {
    window.__TAUTOS_DEBUG__ = {
      resetLocal: () => {
        resetAllData();
        saveLocalFallback(getState());
        renderAll(getState());
        console.log("Local voting state reset.");
      },
      resetCloud: async () => {
        resetAllData();
        await pushCloudState();
        renderAll(getState());
        console.log("Cloud voting state reset.");
      },
      cleanOrphanVotes: async () => {
        await pushCloudState();
        renderAll(getState());
        console.log("Orphan votes cleaned from cloud.");
      }
    };
  }

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
