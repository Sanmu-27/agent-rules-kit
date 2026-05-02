# Code Review Agent Rules

Use these rules when asking an AI agent to review a pull request or diff.

## Review Priorities

Lead with findings that can cause:

- incorrect behavior
- security issues
- data loss
- performance regressions
- broken compatibility
- missing test coverage for risky changes

## Review Style

- Tie each finding to a specific file and line when possible.
- Explain the user-visible or production impact.
- Suggest a concrete fix.
- Do not leave generic comments.
- Do not praise the code before listing defects.
- Avoid style comments unless they affect maintainability or correctness.

## Severity Guide

- P0: breaks production, corrupts data, or creates a critical security issue.
- P1: likely user-facing bug or serious regression.
- P2: moderate bug, missing important edge case, or maintainability risk.
- P3: minor issue or low-risk improvement.

## Review Prompt

```text
Review this diff for correctness, security, regressions, and missing tests.
Return findings first, ordered by severity.
For each finding, include file, line, impact, and a concrete fix.
If there are no findings, say that clearly and mention residual test risk.
```
