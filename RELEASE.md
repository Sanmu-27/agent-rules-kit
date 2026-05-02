# Release Guide

## Before Release

```bash
npm test
npm pack --dry-run
```

## Publish To npm

```bash
npm login
npm publish
```

## Tag

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Announcement Copy

```text
I built Agent Rules Kit: copy-ready rules and a tiny CLI for Codex, Claude Code, Cursor, Windsurf, and GitHub Copilot.

It helps AI coding agents inspect code first, keep edits scoped, run tests, and produce useful PR reviews.

npx ai-agent-rules-kit compose cursor --packs frontend,testing,security
```
