# Refactor Agent Rules

Use these rules when asking an agent to clean up code without changing behavior.

## Scope

- Define the behavior that must stay unchanged.
- Keep refactors small enough to review.
- Avoid mixing refactors with feature changes.
- Do not rename public APIs unless required.
- Preserve tests or improve them before changing risky code.

## Process

1. Identify current behavior and call sites.
2. Add characterization tests if behavior is unclear and risk is high.
3. Make one structural change at a time.
4. Run focused tests after each meaningful step.
5. Summarize any behavior that intentionally changed.

## Safe Refactor Patterns

- Extract repeated logic into a local helper.
- Replace duplicated constants with a named value.
- Split a long function only when the split improves readability.
- Move code closer to its owning domain.
- Remove dead code only after checking references.

## Avoid

- abstracting because code looks similar but behaves differently
- changing formatting across unrelated files
- replacing stable code with a new dependency without a strong reason
- broad renames that obscure the real change
