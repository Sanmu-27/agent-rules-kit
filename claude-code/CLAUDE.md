# Claude Code Rules

Follow these rules when working in this repository.

## First Steps

- Inspect the existing implementation before proposing changes.
- Identify the smallest set of files needed for the request.
- Ask a question only if a reasonable assumption would be risky.

## Implementation

- Match the local style, naming, and architecture.
- Avoid speculative refactors.
- Keep behavior changes intentional and easy to review.
- Update tests when behavior changes.
- Do not remove code only because it looks unused without checking references.

## Safety

- Never discard local changes without explicit permission.
- Do not run destructive commands unless the user asks for them.
- Be careful with migrations, generated files, and lockfiles.

## Communication

- Be concise.
- Lead with concrete results.
- Mention tests or verification.
- Call out unresolved risks directly.
