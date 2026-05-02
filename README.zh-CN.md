# Agent Rules Kit

让 AI 编程工具遵守你的工程规范。

Agent Rules Kit 是一个零依赖 CLI 和规则库，支持 Codex、Claude Code、Cursor、Windsurf、GitHub Copilot。

它解决的是一个很现实的问题：AI agent 能写代码，但经常没有边界感。这个项目把常见翻车点整理成可以一键生成的规则文件。

```bash
npx github:Sanmu-27/agent-rules-kit init --interactive
npx github:Sanmu-27/agent-rules-kit init cursor --preset web-app
npx github:Sanmu-27/agent-rules-kit doctor
```

## 前后对比

| 没有规则 | 使用 Agent Rules Kit |
| --- | --- |
| Agent 没读代码就开始改 | 明确要求先检查相关文件 |
| 顺手重构无关文件 | 明确要求保持改动范围 |
| 跳过测试 | 明确要求运行最相关的验证命令 |
| 不遵守项目风格 | 明确要求沿用现有模式 |
| Review 只说空话 | 优先指出 bug、回归、安全风险和缺失测试 |

## 30 秒演示

```bash
$ npx github:Sanmu-27/agent-rules-kit init --interactive

Agent Rules Kit interactive setup for /my-app
Recommended: codex + web-app

Choose an AI coding tool:
1) codex  2) claude-code  3) cursor  4) windsurf  5) github-copilot

Choose a preset:
1) web-app  2) frontend  3) api  4) pr-review  5) refactor  6) security

Composed Codex rules with frontend, backend, testing, security at /my-app/AGENTS.md
```

发布到 npm 后，计划命令是：

```bash
npx ai-agent-rules-kit init --interactive
```

## 支持的工具

| 工具 | 命令 | 输出文件 |
| --- | --- | --- |
| Codex | `ai-agent-rules-kit init codex` | `AGENTS.md` |
| Claude Code | `ai-agent-rules-kit init claude-code` | `CLAUDE.md` |
| Cursor | `ai-agent-rules-kit init cursor` | `.cursorrules` |
| Windsurf | `ai-agent-rules-kit init windsurf` | `.windsurfrules` |
| GitHub Copilot | `ai-agent-rules-kit init github-copilot` | `.github/copilot-instructions.md` |

## 预设场景

| Preset | 适用场景 |
| --- | --- |
| `web-app` | 全栈 Web 应用 |
| `frontend` | 前端项目 |
| `api` | 后端 API 或服务 |
| `pr-review` | PR Review 助手 |
| `refactor` | 不改变行为的重构 |
| `security` | 权限、密钥、上传、Webhook、数据访问等安全敏感项目 |

## 常用命令

交互式初始化：

```bash
npx github:Sanmu-27/agent-rules-kit init --interactive
```

给 Cursor 生成全栈 Web 应用规则：

```bash
npx github:Sanmu-27/agent-rules-kit init cursor --preset web-app
```

检查当前项目：

```bash
npx github:Sanmu-27/agent-rules-kit doctor
```

查看安全规则包：

```bash
npx github:Sanmu-27/agent-rules-kit show security
```

## 它会让 Agent 更注意什么

- 先读相关代码，再做修改
- 不乱改无关文件
- 遵守项目已有架构和命名风格
- 行为变化时补测试或跑验证
- Review 时优先指出真正风险
- 对权限、密钥、上传、Webhook、数据访问更加谨慎

## 为什么有人会用

因为它不是“道理正确的 prompt 集合”，而是一个能马上执行的工具：

```bash
npx github:Sanmu-27/agent-rules-kit init --interactive
```

重度使用 Cursor、Codex、Claude Code 的开发者，只要被 agent 乱改过一次，就能立刻理解这个项目的价值。
