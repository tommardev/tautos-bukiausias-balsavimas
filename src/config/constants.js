/**
 * Application Constants
 */
export const LOCAL_STORAGE_KEY_PROD = "tautos_bukiausias_v4_state";
export const LOCAL_STORAGE_KEY_DEV = "tautos_bukiausias_dev_state";
export const LOCAL_STORAGE_KEY = LOCAL_STORAGE_KEY_PROD; // Default export for backwards compatibility
export const MAX_SELECTED_CANDIDATES = 3;
export const APP_VERSION = "v1.4.0";

/**
 * Checks if the current environment is running in local development mode.
 * Matches localhost, 127.0.0.1, file:, or an explicit ?env=dev / ?env=test query param.
 * Can be overridden via localStorage.getItem("tautos_env").
 * @returns {boolean}
 */
export function isDevEnvironment() {
  if (typeof window === "undefined") return false;
  try {
    const forcedEnv = localStorage.getItem("tautos_env");
    if (forcedEnv === "dev" || forcedEnv === "test") return true;
    if (forcedEnv === "prod") return false;

    if (window.location && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const paramEnv = urlParams.get("env");
      if (paramEnv === "dev" || paramEnv === "test") return true;
      if (paramEnv === "prod") return false;
    }

    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "" || window.location.protocol === "file:";
  } catch {
    return false;
  }
}

/**
 * Returns the active localStorage key for the current environment.
 * @returns {string}
 */
export function getActiveStorageKey() {
  return isDevEnvironment() ? LOCAL_STORAGE_KEY_DEV : LOCAL_STORAGE_KEY_PROD;
}

/**
 * Returns the target Cloud Firestore document name ("state" in prod, "state_dev" in dev/test).
 * @returns {string}
 */
export function getFirestoreDocName() {
  return isDevEnvironment() ? "state_dev" : "state";
}


