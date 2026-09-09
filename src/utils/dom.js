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
