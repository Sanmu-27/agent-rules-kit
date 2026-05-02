# Agent Rules Kit

给 AI 编程 Agent 用的规则、提示词和轻量 CLI。

它的目标是让 Codex、Claude Code、Cursor、Windsurf、GitHub Copilot 在真实项目里更像一个谨慎的高级工程师。

```bash
npx agent-rules-kit list
npx agent-rules-kit install codex
npx agent-rules-kit compose cursor --packs frontend,testing,code-review
```

## 这个项目解决什么问题

AI 编程工具经常不是因为能力不够翻车，而是因为没有明确工程规则：

- 没读代码就开始改
- 顺手重构无关文件
- 跳过测试
- 不遵守项目已有风格
- Code Review 只说空话
- 忽略权限、密钥、上传、Webhook 等安全边界

Agent Rules Kit 把这些经验整理成可以直接复制或一键生成的规则文件。

## 快速开始

给 Codex 安装规则：

```bash
npx agent-rules-kit install codex
```

给 Cursor 组合前端、测试和安全规则：

```bash
npx agent-rules-kit compose cursor --packs frontend,testing,security
```

查看某个规则包：

```bash
npx agent-rules-kit show code-review
```

## 支持的工具

| 工具 | 命令 | 输出文件 |
| --- | --- | --- |
| Codex | `agent-rules-kit install codex` | `AGENTS.md` |
| Claude Code | `agent-rules-kit install claude-code` | `CLAUDE.md` |
| Cursor | `agent-rules-kit install cursor` | `.cursorrules` |
| Windsurf | `agent-rules-kit install windsurf` | `.windsurfrules` |
| GitHub Copilot | `agent-rules-kit install github-copilot` | `.github/copilot-instructions.md` |

## 规则包

| 规则包 | 适用场景 |
| --- | --- |
| `frontend` | UI、产品流程、响应式布局、可访问性 |
| `backend` | API、服务、任务、数据访问、参数校验 |
| `testing` | 测试新增、测试修复、回归测试 |
| `code-review` | PR Review、Diff Review |
| `security` | 登录、权限、密钥、上传、Webhook、数据访问 |
| `refactor` | 不改变行为的代码整理 |

## 适合冲星的原因

这个项目不是单纯 prompt 集合，而是：

- 能直接用
- 能一条命令安装
- 覆盖主流 AI 编程工具
- 方便社区贡献新规则
- 每个规则都来自真实工程失败模式

## 贡献

欢迎贡献新的规则、prompt、真实失败案例和工具适配。

规则最好短、具体、可复制。
