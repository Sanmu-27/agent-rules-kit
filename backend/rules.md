# Backend Agent Rules

Use these rules for APIs, services, jobs, data pipelines, and server-side logic.

## Design

- Preserve existing API contracts unless the task requires a breaking change.
- Validate inputs at system boundaries.
- Keep domain logic separate from transport concerns when the codebase already does so.
- Use existing repository, service, and transaction patterns.

## Data

- Treat migrations as production changes.
- Consider backfills, rollbacks, and default values.
- Avoid N+1 queries in new data access paths.
- Use transactions for multi-step writes that must succeed or fail together.

## Errors And Observability

- Match existing error handling.
- Return useful errors without leaking secrets or internals.
- Add logs or metrics only where they help diagnose real production failures.
- Include enough context for debugging without exposing sensitive data.

## Verification

- Add or update tests for changed behavior.
- Include failure paths when changing validation, permissions, or persistence.
- Run focused tests before broader test suites.
