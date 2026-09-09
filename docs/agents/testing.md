# Testing

Load before verifying changes.

## Precedence
`repo:` verification steps below are this project's standard.

## Test Strategy
- The repository has no automated unit or E2E runner (plain static web files).
- Verification is done by running a local static server and testing in an evergreen web browser.

## Critical Manual Verification Flows
1. **Voting Flow:**
   - Input a voter name (or click random name generator button `diceBtn`).
   - Select 1 to 3 contestant cards.
   - Verify maximum 3 selection limit enforces disabling unselected cards.
   - Click "Patvirtinti Balsus" (`submitVotesBtn`).
   - Verify synthesized audio chime plays, canvas confetti launches, and candidate vote count increments.
2. **Podium & Charts:**
   - Verify top 3 candidates display with crowns/toilet icons on the podium (`renderPodium`).
   - Verify horizontal bars update with correct percentages (`renderCharts`).
3. **Audit Log:**
   - Verify the new vote appears in the "Kas už ką balsavo" audit table with timestamp and voter name (`renderLog`).
4. **Cloud Synchronization:**
   - Click "Atnaujinti" (`manualSyncBtn`).
   - Verify network request to `CLOUD_SYNC_URL` completes successfully and status indicator shows "Sinchronizuota".
5. **Mobile Responsiveness:**
   - Test viewport width <= 860px to confirm control bar stacks correctly.
