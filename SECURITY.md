# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.2   | :x:                |

---

## Reporting a Vulnerability

We take the security of **Tautos Bukiausias** seriously. If you discover a security vulnerability, please report it responsibly:

1. **Do not create a public issue.**
2. Report the vulnerability privately via GitHub Security Advisories on this repository or contact the maintainer directly through GitHub profile contact options.
3. Include detailed steps to reproduce the issue, proof of concept, and any suggested mitigations.

### What to expect:
- **Acknowledgement:** We aim to acknowledge receipt of security reports within 48 hours.
- **Assessment:** We will validate and assess the vulnerability severity.
- **Resolution:** A patch will be deployed and a release tagged once verified.

---

## Security Architecture & Best Practices

- **XSS Prevention:** All user-supplied inputs (voter names, custom contestant additions, aliases) are strictly sanitized via `escapeHTML()` before DOM insertion.
- **No Third-Party Tracker Cookies:** The application operates without tracker cookies, authentication cookies, or third-party analytics pixels.
- **Cloud Sync Security:** Shared voting state is synchronized in real time via Firebase Cloud Firestore (`/voting/state`) and locked down with schema-validating `firestore.rules`. Anonymous visitors cannot inject arbitrary collections or write out-of-schema documents. Do not submit sensitive, private, or confidential information through voter names or candidate bios.
