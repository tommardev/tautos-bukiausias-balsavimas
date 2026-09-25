/**
 * DOM Utility Helpers
 */

/**
 * Escapes unsafe characters for safe HTML injection.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  return String(str || "").replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/**
 * Formats vote count with correct Lithuanian grammatical pluralization.
 * 0 balsų, 1 balsas, 2-9 balsai, 10 balsų, 11-19 balsų, 20 balsų, 21 balsas, etc.
 * @param {number} count 
 * @returns {string}
 */
export function formatVotesLt(count) {
  const n = Math.abs(Number(count) || 0);
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${count} balsų`;
  if (mod10 === 1) return `${count} balsas`;
  if (mod10 >= 2 && mod10 <= 9) return `${count} balsai`;
  return `${count} balsų`;
}

/**
 * Smoothly scrolls to a candidate's card in the roster and applies a pulse highlight.
 * If the candidate is currently hidden by active category/search filters, resets them.
 * @param {string} id 
 */
export function navigateToContestantCard(id) {
  if (!id) return;

  let card = document.querySelector(`.contestant-card[data-id="${id}"]`);

  // If card is not visible due to filtering, reset filters to show all candidates
  if (!card) {
    import("../state/store.js").then(({ setFilter, setSearchQuery }) => {
      setFilter("all");
      setSearchQuery("");

      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = "";
      const searchClearBtn = document.getElementById("searchClearBtn");
      if (searchClearBtn) searchClearBtn.classList.add("hidden");

      document.querySelectorAll(".filter-pill").forEach(b => {
        const isAll = b.getAttribute("data-category") === "all";
        b.classList.toggle("active", isAll);
        b.setAttribute("aria-pressed", isAll ? "true" : "false");
      });

      // Allow DOM update pass before scrolling
      requestAnimationFrame(() => {
        const refreshedCard = document.querySelector(`.contestant-card[data-id="${id}"]`);
        if (refreshedCard) {
          scrollAndHighlightCard(refreshedCard);
        }
      });
    });
    return;
  }

  scrollAndHighlightCard(card);
}

/**
 * Handles smooth scrolling and the visual amber pulse ring.
 * @param {HTMLElement} card 
 */
function scrollAndHighlightCard(card) {
  const prefersReducedMotion = typeof window !== "undefined" && 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  card.scrollIntoView({ 
    behavior: prefersReducedMotion ? "auto" : "smooth", 
    block: "center" 
  });

  card.classList.remove("card-pulse-highlight");
  void card.offsetWidth; // Force reflow to restart CSS keyframe animation
  card.classList.add("card-pulse-highlight");

  setTimeout(() => {
    card.classList.remove("card-pulse-highlight");
  }, 1400);

  // Optional keyboard focus without jarring re-scroll
  if (typeof card.focus === "function") {
    card.focus({ preventScroll: true });
  }
}

