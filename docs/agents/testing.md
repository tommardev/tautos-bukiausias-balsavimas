# Testing

Load before verifying changes.

## Precedence

`repo:` verification steps below are this project's standard.

## Test Strategy

- The repository has no automated unit or E2E runner (vanilla static web files).
- Verification is done by running a local static server (`npx -y serve .`) and testing in an evergreen browser.

---

## Critical Manual Verification Flows

1. **Voting Flow:**
   - Input a voter name into `voterNameInput`.
   - Select 1 to 3 contestant cards.
   - Verify selection state visually changes (crisp amber border highlight, `:active` press feedback).
   - Verify that selecting 3 candidates disables remaining unselected cards.
   - Click "Patvirtinti Balsus" (`submitVoteBtn`).
   - Verify subtle victory celebration triggers (if reduced-motion is not requested) and vote count increments.

2. **Leaderboard & Ranks:**
   - Verify top 3 candidates display clearly with rank badges.
   - Verify horizontal leaderboard progress bars update with correct percentages.

3. **Audit Log:**
   - Verify the submitted vote appears in the "Kas už ką balsavo" audit table with timestamp, voter name, and selected candidates.

4. **Cloud Synchronization:**
   - Click "Atnaujinti" (`manualSyncBtn`).
   - Verify request to `CLOUD_SYNC_URL` completes successfully and status indicator displays "Sinchronizuota".
   - Test offline fallback by disabling network in DevTools and verifying votes persist to `localStorage`.

5. **Responsiveness & Accessibility:**
   - Test viewports: 375px (mobile), 768px (tablet), 1280px (desktop).
   - Tab through the entire page to verify keyboard focus rings and logical tab order.
   - Verify that `prefers-reduced-motion: reduce` disables celebratory animations and snaps transitions instantly.
