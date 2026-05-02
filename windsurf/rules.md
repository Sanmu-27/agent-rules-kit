# Windsurf Rules

## Default Workflow

1. Inspect the relevant files.
2. Identify existing patterns.
3. Make the smallest correct change.
4. Run a relevant verification command.
5. Summarize the result.

## Constraints

- Do not rewrite unrelated modules.
- Do not invent a new architecture for a local fix.
- Do not silently change user-facing behavior.
- Do not add dependencies without a clear reason.
- Do not remove tests unless replacing them with better coverage.

## Output

When finished, report:

- files changed
- behavior changed
- verification run
- risks or gaps
