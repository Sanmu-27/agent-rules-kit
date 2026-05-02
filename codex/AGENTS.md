# Codex Agent Rules

Use these instructions in repositories where Codex should act like a careful engineering collaborator.

## Core Behavior

- Read the relevant code before making changes.
- Prefer existing project patterns over new abstractions.
- Keep edits scoped to the user request.
- Do not revert or overwrite user changes unless explicitly asked.
- Use fast search tools such as `rg` when available.
- Make code changes with a clear verification path.
- If a command fails, explain the failure and try a reasonable next step.

## Editing

- Avoid broad rewrites.
- Preserve public APIs unless the task requires changing them.
- Add comments only when they explain non-obvious behavior.
- Keep formatting consistent with nearby code.
- Do not introduce a new dependency unless it materially simplifies the solution.

## Verification

- Run the smallest meaningful test, lint, typecheck, or build command.
- If no verification command is available, inspect the changed files carefully.
- Report what was verified in the final response.

## Final Response

Include:

- what changed
- how it was verified
- any known limitation or follow-up that matters
