# Launch Posts

## GitHub Release

```text
Agent Rules Kit v0.1.0 is out.

It is a zero-dependency CLI and rule library for AI coding agents.

Supported tools:
- Codex
- Claude Code
- Cursor
- Windsurf
- GitHub Copilot

Core commands:
- agent-rules-kit doctor
- agent-rules-kit init cursor --preset web-app
- agent-rules-kit compose codex --packs backend,testing,security

This first release includes rule packs for frontend, backend, testing, code review, security, and refactoring work.
```

## X / Twitter

```text
I built Agent Rules Kit.

A tiny CLI + copy-ready rules for Codex, Claude Code, Cursor, Windsurf, and GitHub Copilot.

It helps agents:
- read before editing
- avoid random refactors
- follow local patterns
- run focused tests
- write better PR reviews

npx agent-rules-kit init cursor --preset web-app
```

## Hacker News

```text
Show HN: Agent Rules Kit - rules and presets for AI coding agents

I built a small zero-dependency CLI that installs instruction files for AI coding tools such as Codex, Claude Code, Cursor, Windsurf, and GitHub Copilot.

The idea is simple: most coding-agent failures are predictable. They edit before reading, over-refactor, skip verification, or miss security-sensitive edge cases. This repo turns those failure modes into practical rule files and presets.

Example:

npx agent-rules-kit init cursor --preset web-app

It currently includes frontend, backend, testing, code review, security, and refactor packs. Feedback welcome, especially from people using agents in larger codebases.
```

## Reddit

```text
I made a small CLI for installing rule files for AI coding agents.

It supports Codex, Claude Code, Cursor, Windsurf, and GitHub Copilot.

The goal is to make agents behave more consistently in real projects: inspect code first, keep changes scoped, follow local patterns, update tests, and treat auth/secrets/webhooks/uploads as security-sensitive.

Example:

npx agent-rules-kit init cursor --preset web-app

I am looking for feedback on useful presets and real failure modes worth turning into rules.
```

## Chinese Social Post

```text
我做了一个给 AI 编程工具用的小项目：Agent Rules Kit。

它不是普通 prompt 集合，而是一个可以直接运行的 CLI：

npx agent-rules-kit init cursor --preset web-app

支持 Codex、Claude Code、Cursor、Windsurf、GitHub Copilot。

核心作用是让 AI Agent 在真实项目里更稳：
- 先读代码再改
- 不乱重构
- 遵守项目已有风格
- 记得跑测试
- Code Review 先指出真正风险
- 对权限、密钥、Webhook、上传等安全点更谨慎

现在有 frontend/backend/testing/security/code-review/refactor 几套规则包。
欢迎提真实翻车案例，我会整理成规则。
```
