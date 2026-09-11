/**
 * Toast Notification Component
 */

/**
 * Displays an ephemeral toast message.
 * @param {string} message 
 * @param {"toast-success"|"toast-error"} type 
 */
export function showToast(message, type = "toast-success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px) scale(0.96)';
    setTimeout(() => toast.remove(), 180);
  }, 3500);
}
