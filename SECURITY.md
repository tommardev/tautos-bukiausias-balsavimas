# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| 1.2.x   | :white_check_mark: |
| < 1.2   | :x:                |

---

## Reporting a Vulnerability

We take the security of **Tautos Bukiausias** seriously. If you discover a potential vulnerability or security issue:

1. **Do not open a public GitHub issue.**
2. Report the vulnerability privately via [GitHub Security Advisories](https://github.com/tommardev/tautos-bukiausias-balsavimas/security/advisories/new) on this repository.
3. Include detailed steps to reproduce the issue, proof of concept, and any suggested mitigations.

### Response Timeline
- **Acknowledgement:** Within 48 hours.
- **Assessment:** Vulnerability triage and severity assessment within 5 business days.
- **Resolution:** Validated fixes deployed and a security patch release tagged.

---

## Threat Model & Security Architecture

### 1. Cross-Site Scripting (XSS) Prevention
- All user-controlled fields (voter names, custom candidate names, aliases, quotes, avatars) are rigorously sanitized via `escapeHTML()` in `src/utils/dom.js` before insertion into the DOM.
- Input lengths are clamped at form submission (voter name max 40 chars, candidate name max 40 chars, tagline max 100 chars).
- Avatars are strictly validated against an approved emoji whitelist (`ALLOWED_EMOJIS`).

### 2. Content Security Policy (CSP)
- A strict CSP is enforced both at the web server layer via `firebase.json` headers and inside `index.html` via `<meta http-equiv="Content-Security-Policy">`:
  - `script-src 'self' https://www.gstatic.com https://cdn.jsdelivr.net;`
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
  - `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com;`
  - `img-src 'self' data:;`
- Restricts untrusted script execution, inline injections, and unauthorized network endpoints.

### 3. Firebase Web Configuration vs Admin Credentials
- The Firebase configuration in `src/services/api.js` (including `apiKey`) is the standard Google Firebase Web Client config. Per official Google Firebase security specifications, client API keys identify the project to Google services and are **not** secret administrative credentials.
- Actual database security is strictly enforced server-side through **Cloud Firestore Security Rules** (`firestore.rules`).
- No Firebase Service Account private keys, Admin SDK tokens, or sensitive credentials are ever placed in client code or committed to the repository.

### 4. Firestore Security Rules & Anti-Tampering
- The database rules (`firestore.rules`) enforce a strict **default-deny** policy on all document collections.
- Writes to `/voting/state` are governed by declarative validation functions:
  - **Payload schema:** Exactly `['votes', 'customContestants', 'voterLedger', 'updatedAt']`.
  - **Size caps:** Max 70 candidate keys in `votes`, max 50 custom candidates, max 100 audit ledger entries.
  - **Anti-wipe / Anti-rollback protection:** When updating existing state, incoming updates must preserve all existing candidate keys (`incomingDoc.votes.keys().toSet().hasAll(currentDoc.data.votes.keys().toSet())`) and provide a monotonic timestamp (`incomingDoc.updatedAt >= currentDoc.data.updatedAt`).
  - Anonymous visitors cannot inject arbitrary collections or wipe existing voting tallies.

### 5. Privacy & Zero PII
- No passwords, emails, phone numbers, or tracker cookies are collected, tracked, or stored.
- Auditing displays only the friendly display name entered by the voter and their choices.
