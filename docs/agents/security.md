# Security

Load before handling user input, modifying network sync, or changing data models.

## Precedence
`repo:` implementation patterns and OWASP Top 10 client-side security floor (`golden:`).

## Rules & Defenses
- `golden:` **Untrusted User Input:** Voter names and custom candidate names/aliases submitted in forms must be escaped before injection into the DOM to prevent Cross-Site Scripting (XSS).
- `repo:` **Cloud Storage Privacy:** `CLOUD_SYNC_URL` (`https://api.restful-api.dev/objects/...`) is a shared JSON endpoint. Never commit private authentication keys, personal identification numbers, or secret tokens.
- `repo:` **Payload Schema Validation:** Validate incoming JSON structures from cloud sync in `mergeCloudData()` to guard against corrupted or malicious object payloads.
