# Security Agent Rules

Use these rules when changing authentication, authorization, secrets, payment flows, uploads, webhooks, or data access.

## Security Checklist

- Validate and normalize untrusted input.
- Check authorization at the server boundary.
- Do not trust client-provided role, owner, price, or permission fields.
- Avoid exposing secrets in logs, errors, telemetry, or test fixtures.
- Use constant-time comparison for sensitive token checks when available.
- Verify webhook signatures before processing payloads.
- Apply rate limits to sensitive endpoints when the project supports them.

## Data Handling

- Minimize access to personally identifiable data.
- Avoid returning internal identifiers unless the API already exposes them.
- Redact credentials and tokens in debug output.
- Use secure defaults for cookies, sessions, and CORS.

## Review Focus

When reviewing security-sensitive code, inspect:

- privilege escalation paths
- missing ownership checks
- insecure direct object references
- injection risks
- unsafe file handling
- replay attacks in webhooks
- leaked secrets in logs
