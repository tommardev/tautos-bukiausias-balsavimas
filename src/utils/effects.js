/**
 * Visual effects and celebration helpers
 */

/**
 * Triggers a subtle confetti burst if the user has not requested reduced motion.
 */
export function triggerConfetti() {
  if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    typeof window.confetti === "function"
  ) {
    window.confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#D97706', '#FFFFFF']
    });
  }
}
