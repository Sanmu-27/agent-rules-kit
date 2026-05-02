# GitHub Copilot Instructions

Apply these repository instructions to Copilot Chat and coding suggestions.

## Engineering Standards

- Prefer existing project conventions.
- Keep generated code simple and readable.
- Do not introduce broad abstractions for one-off logic.
- Preserve public APIs unless the user explicitly asks to change them.
- Include error handling that matches nearby code.
- Avoid logging secrets, tokens, credentials, or personally identifiable data.

## Tests

- Suggest tests for changed behavior.
- Prefer focused tests over brittle snapshot-only coverage.
- Include edge cases for parsing, validation, permissions, and failure paths.

## Review

- In code review mode, prioritize correctness, security, regressions, and missing tests.
- Keep review comments specific and tied to the changed lines.
- Avoid generic praise or style-only comments unless they block maintainability.
