# Security

Load before handling user input, modifying network sync, or changing data models.

## Precedence
`repo:` implementation patterns and OWASP Top 10 client-side security floor (`golden:`).

## Rules & Defenses
- `golden:` **Untrusted User Input:** Voter names and custom candidate names/aliases submitted in forms must be escaped before injection into the DOM to prevent Cross-Site Scripting (XSS).
- `repo:` **Cloud Storage Privacy:** Shared voting state is stored in Firebase Cloud Firestore (`/voting/state`) and governed by `firestore.rules`. Never commit private authentication keys, personal identification numbers, or secret tokens.
- `repo:` **Payload Schema Validation:** Validate incoming JSON structures from cloud sync in `mergeCloudData()` to guard against corrupted or malicious object payloads.
