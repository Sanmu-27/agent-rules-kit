# Example Project Rule Stack

This is a practical starter stack for a typical production web application.

## Base Agent Rules

Use one of:

- `codex/AGENTS.md`
- `claude-code/CLAUDE.md`
- `cursor/.cursorrules`
- `windsurf/rules.md`
- `github-copilot/copilot-instructions.md`

## Add Domain Rules

For a full-stack app:

- `frontend/rules.md`
- `backend/rules.md`
- `testing/rules.md`
- `code-review/rules.md`
- `security/rules.md`

## Recommended Combined Instruction

```text
Follow the base agent rules for this project.
For frontend changes, also apply frontend/rules.md.
For backend changes, also apply backend/rules.md.
For behavior changes, apply testing/rules.md.
For PR review tasks, apply code-review/rules.md.
For auth, permissions, secrets, uploads, webhooks, or data access, apply security/rules.md.
```
