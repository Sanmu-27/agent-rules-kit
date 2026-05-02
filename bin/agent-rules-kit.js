#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(import.meta.url);
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const tools = {
  codex: {
    label: "Codex",
    source: "codex/AGENTS.md",
    target: "AGENTS.md"
  },
  "claude-code": {
    label: "Claude Code",
    source: "claude-code/CLAUDE.md",
    target: "CLAUDE.md"
  },
  cursor: {
    label: "Cursor",
    source: "cursor/.cursorrules",
    target: ".cursorrules"
  },
  windsurf: {
    label: "Windsurf",
    source: "windsurf/rules.md",
    target: ".windsurfrules"
  },
  "github-copilot": {
    label: "GitHub Copilot",
    source: "github-copilot/copilot-instructions.md",
    target: ".github/copilot-instructions.md"
  }
};

const packs = {
  frontend: "frontend/rules.md",
  backend: "backend/rules.md",
  testing: "testing/rules.md",
  "code-review": "code-review/rules.md",
  security: "security/rules.md",
  refactor: "refactor/rules.md"
};

const promptFiles = {
  "bug-fix": "prompts/bug-fix.md",
  feature: "prompts/feature.md",
  "pr-review": "prompts/pr-review.md",
  refactor: "prompts/refactor.md",
  "security-review": "prompts/security-review.md",
  "test-plan": "prompts/test-plan.md"
};

const presets = {
  "web-app": ["frontend", "backend", "testing", "security"],
  frontend: ["frontend", "testing"],
  api: ["backend", "testing", "security"],
  "pr-review": ["code-review", "testing", "security"],
  refactor: ["refactor", "testing"],
  security: ["security", "code-review", "testing"]
};

function readTemplate(relativePath) {
  return readFileSync(join(rootDir, relativePath), "utf8").trimEnd();
}

function parseOptions(args) {
  const options = {
    dir: ".",
    force: false,
    interactive: false,
    packs: [],
    output: undefined,
    preset: undefined,
    yes: false
  };
  const positionals = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dir") {
      options.dir = args[index + 1];
      index += 1;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--interactive" || arg === "-i") {
      options.interactive = true;
    } else if (arg === "--packs") {
      options.packs = args[index + 1].split(",").map((item) => item.trim()).filter(Boolean);
      index += 1;
    } else if (arg === "--output") {
      options.output = args[index + 1];
      index += 1;
    } else if (arg === "--preset") {
      options.preset = args[index + 1];
      index += 1;
    } else if (arg === "--yes" || arg === "-y") {
      options.yes = true;
    } else {
      positionals.push(arg);
    }
  }

  return { options, positionals };
}

function printHelp(io = console) {
  io.log(`ai-agent-rules-kit

Usage:
  ai-agent-rules-kit list
  ai-agent-rules-kit doctor [--dir <path>]
  ai-agent-rules-kit init [tool] [--preset <preset>] [--interactive] [--dir <path>] [--force]
  ai-agent-rules-kit install <tool> [--dir <path>] [--force]
  ai-agent-rules-kit compose <tool> --packs <pack,pack> [--dir <path>] [--output <file>] [--force]
  ai-agent-rules-kit show <tool|pack|prompt>

Tools:
  ${Object.keys(tools).join(", ")}

Packs:
  ${Object.keys(packs).join(", ")}

Prompts:
  ${Object.keys(promptFiles).join(", ")}

Presets:
  ${Object.keys(presets).join(", ")}

Examples:
  ai-agent-rules-kit doctor
  ai-agent-rules-kit init --interactive
  ai-agent-rules-kit init cursor --preset web-app
  ai-agent-rules-kit install codex
  ai-agent-rules-kit compose cursor --packs frontend,testing,code-review
  ai-agent-rules-kit show security
`);
}

function list(io = console) {
  io.log("Tools");
  for (const [id, tool] of Object.entries(tools)) {
    io.log(`  ${id.padEnd(15)} -> ${tool.target}`);
  }

  io.log("\nRule packs");
  for (const id of Object.keys(packs)) {
    io.log(`  ${id}`);
  }

  io.log("\nPrompts");
  for (const id of Object.keys(promptFiles)) {
    io.log(`  ${id}`);
  }

  io.log("\nPresets");
  for (const [id, packList] of Object.entries(presets)) {
    io.log(`  ${id.padEnd(15)} -> ${packList.join(", ")}`);
  }
}

function writeTarget(baseDir, relativeTarget, content, force) {
  const target = resolve(baseDir, relativeTarget);

  if (existsSync(target) && !force) {
    throw new Error(`${relativeTarget} already exists. Re-run with --force to overwrite it.`);
  }

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${content}\n`, "utf8");
  return target;
}

function detectProject(baseDir) {
  const names = new Set(existsSync(baseDir) ? readdirSync(baseDir) : []);
  const has = (name) => names.has(name);

  if (has("next.config.js") || has("next.config.mjs") || has("vite.config.js") || has("vite.config.ts")) {
    return "web-app";
  }
  if (has("package.json")) {
    try {
      const pkg = JSON.parse(readFileSync(resolve(baseDir, "package.json"), "utf8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.react || deps.vue || deps.svelte) {
        return "frontend";
      }
      if (deps.express || deps.fastify || deps.koa || deps.hono || deps.nestjs) {
        return "api";
      }
    } catch {
      return "web-app";
    }
    return "web-app";
  }
  if (has("pyproject.toml") || has("requirements.txt") || has("go.mod") || has("Cargo.toml")) {
    return "api";
  }

  return "web-app";
}

function detectTool(baseDir) {
  for (const [id, tool] of Object.entries(tools)) {
    if (existsSync(resolve(baseDir, tool.target))) {
      return id;
    }
  }

  if (existsSync(resolve(baseDir, ".cursor")) || existsSync(resolve(baseDir, ".cursorrules"))) {
    return "cursor";
  }
  if (existsSync(resolve(baseDir, ".github"))) {
    return "github-copilot";
  }

  return "codex";
}

function install(toolId, options, io = console) {
  const tool = tools[toolId];
  if (!tool) {
    throw new Error(`Unknown tool "${toolId}". Run "ai-agent-rules-kit list" to see options.`);
  }

  const baseDir = resolve(options.dir);
  const content = readTemplate(tool.source);
  const target = writeTarget(baseDir, tool.target, content, options.force);
  io.log(`Installed ${tool.label} rules at ${target}`);
}

function compose(toolId, options, io = console) {
  const tool = tools[toolId];
  if (!tool) {
    throw new Error(`Unknown tool "${toolId}". Run "ai-agent-rules-kit list" to see options.`);
  }
  if (options.packs.length === 0) {
    throw new Error("No packs provided. Use --packs frontend,testing for example.");
  }

  const unknownPacks = options.packs.filter((id) => !packs[id]);
  if (unknownPacks.length > 0) {
    throw new Error(`Unknown pack(s): ${unknownPacks.join(", ")}`);
  }

  const sections = [
    readTemplate(tool.source),
    ...options.packs.map((id) => `\n\n---\n\n${readTemplate(packs[id])}`)
  ];
  const output = options.output || tool.target;
  const target = writeTarget(resolve(options.dir), output, sections.join(""), options.force);
  io.log(`Composed ${tool.label} rules with ${options.packs.join(", ")} at ${target}`);
}

function init(toolId, options, io = console) {
  const preset = options.preset || "web-app";
  const packList = presets[preset];

  if (!packList) {
    throw new Error(`Unknown preset "${preset}". Available presets: ${Object.keys(presets).join(", ")}`);
  }

  compose(toolId, { ...options, packs: packList }, io);
}

async function askChoice(rl, question, choices, fallback) {
  const label = choices.map((choice, index) => `${index + 1}) ${choice}`).join("  ");
  const answer = await rl.question(`${question}\n${label}\n> `);
  const trimmed = answer.trim();
  const byNumber = Number(trimmed);

  if (Number.isInteger(byNumber) && byNumber >= 1 && byNumber <= choices.length) {
    return choices[byNumber - 1];
  }
  if (choices.includes(trimmed)) {
    return trimmed;
  }

  return fallback;
}

async function interactiveInit(options, io = console) {
  const baseDir = resolve(options.dir);
  const recommendedTool = detectTool(baseDir);
  const recommendedPreset = detectProject(baseDir);
  const toolIds = Object.keys(tools);
  const presetIds = Object.keys(presets);

  if (options.yes) {
    io.log(`Using recommended tool "${recommendedTool}" and preset "${recommendedPreset}".`);
    init(recommendedTool, { ...options, preset: recommendedPreset }, io);
    return;
  }

  io.log(`Agent Rules Kit interactive setup for ${baseDir}`);
  io.log(`Recommended: ${recommendedTool} + ${recommendedPreset}`);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const toolId = await askChoice(rl, "Choose an AI coding tool:", toolIds, recommendedTool);
    const preset = await askChoice(rl, "Choose a preset:", presetIds, recommendedPreset);
    init(toolId, { ...options, preset }, io);
  } finally {
    rl.close();
  }
}

function doctor(options, io = console) {
  const baseDir = resolve(options.dir);
  const found = [];
  const missing = [];
  const recommendedTool = detectTool(baseDir);
  const recommendedPreset = detectProject(baseDir);

  for (const [id, tool] of Object.entries(tools)) {
    const target = resolve(baseDir, tool.target);
    if (existsSync(target)) {
      found.push({ id, target: tool.target });
    } else {
      missing.push({ id, target: tool.target });
    }
  }

  io.log(`Agent Rules Kit doctor for ${baseDir}`);
  io.log(`\nRecommended setup: ai-agent-rules-kit init ${recommendedTool} --preset ${recommendedPreset}`);
  if (found.length > 0) {
    io.log("\nFound agent config files:");
    for (const item of found) {
      io.log(`  ${item.id.padEnd(15)} ${item.target}`);
    }
  } else {
    io.log("\nNo agent config files found.");
  }

  io.log("\nAvailable installs:");
  for (const item of missing) {
    io.log(`  ${item.id.padEnd(15)} ai-agent-rules-kit init ${item.id}`);
  }
}

function show(id, io = console) {
  const source = tools[id]?.source || packs[id] || promptFiles[id];
  if (!source) {
    throw new Error(`Unknown item "${id}". Run "ai-agent-rules-kit list" to see options.`);
  }

  io.log(readTemplate(source));
}

export async function run(argv = process.argv.slice(2), io = console) {
  const [command, ...rest] = argv;
  const { options, positionals } = parseOptions(rest);

  try {
    if (!command || command === "help" || command === "--help" || command === "-h") {
      printHelp(io);
      return 0;
    }
    if (command === "list") {
      list(io);
      return 0;
    }
    if (command === "doctor") {
      doctor(options, io);
      return 0;
    }
    if (command === "init") {
      if (options.interactive || !positionals[0]) {
        await interactiveInit(options, io);
        return 0;
      }
      init(positionals[0], options, io);
      return 0;
    }
    if (command === "install") {
      install(positionals[0], options, io);
      return 0;
    }
    if (command === "compose") {
      compose(positionals[0], options, io);
      return 0;
    }
    if (command === "show") {
      show(positionals[0], io);
      return 0;
    }

    throw new Error(`Unknown command "${command}".`);
  } catch (error) {
    io.error(`Error: ${error.message}`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === cliPath) {
  process.exitCode = await run();
}
