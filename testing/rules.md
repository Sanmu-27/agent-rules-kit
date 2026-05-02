# Testing Agent Rules

Use these rules when adding, updating, or reviewing tests.

## Test Strategy

- Test behavior, not implementation details.
- Prefer focused tests for the changed logic.
- Add regression tests for confirmed bugs.
- Cover success, failure, and boundary cases when risk is meaningful.
- Avoid deleting tests unless they are replaced or truly obsolete.

## Test Quality

- Keep test names specific.
- Use existing fixtures and factories.
- Avoid sleeps and timing-dependent assertions when possible.
- Avoid broad snapshots for dynamic UI unless they provide real signal.
- Make tests deterministic.

## Running Tests

- Start with the smallest relevant test command.
- If it passes and risk is high, run a broader suite.
- If tests fail for unrelated reasons, report the failure clearly.

## Final Report

Always mention:

- test files changed
- command run
- result
- any tests that should exist but were not added
