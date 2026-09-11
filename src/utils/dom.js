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
