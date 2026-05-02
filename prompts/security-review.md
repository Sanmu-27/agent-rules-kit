# Security Review Prompt

```text
Review this change for security risk.

Focus on:
- missing authorization checks
- insecure direct object references
- untrusted input
- injection risks
- leaked secrets
- unsafe file uploads
- webhook signature verification
- replay attacks
- sensitive data exposure

Return concrete findings first.
For each finding, include file, line, impact, and a suggested fix.
If there are no findings, say so clearly and mention residual risk.
```
