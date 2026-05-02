#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
    packs: [],
    output: undefined,
    preset: undefined
  };
  const positionals = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dir") {
      options.dir = args[index + 1];
      index += 1;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--packs") {
      options.packs = args[index + 1].split(",").map((item) => item.trim()).filter(Boolean);
      index += 1;
    } else if (arg === "--output") {
      options.output = args[index + 1];
      index += 1;
    } else if (arg === "--preset") {
      options.preset = args[index + 1];
      index += 1;
    } else {
      positionals.push(arg);
    }
  }

  return { options, positionals };
}

function printHelp(io = console) {
  io.log(`agent-rules-kit

Usage:
  agent-rules-kit list
  agent-rules-kit doctor [--dir <path>]
  agent-rules-kit init <tool> [--preset <preset>] [--dir <path>] [--force]
  agent-rules-kit install <tool> [--dir <path>] [--force]
  agent-rules-kit compose <tool> --packs <pack,pack> [--dir <path>] [--output <file>] [--force]
  agent-rules-kit show <tool|pack|prompt>

Tools:
  ${Object.keys(tools).join(", ")}

Packs:
  ${Object.keys(packs).join(", ")}

Prompts:
  ${Object.keys(promptFiles).join(", ")}

Presets:
  ${Object.keys(presets).join(", ")}

Examples:
  agent-rules-kit doctor
  agent-rules-kit init cursor --preset web-app
  agent-rules-kit install codex
  agent-rules-kit compose cursor --packs frontend,testing,code-review
  agent-rules-kit show security
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

function install(toolId, options, io = console) {
  const tool = tools[toolId];
  if (!tool) {
    throw new Error(`Unknown tool "${toolId}". Run "agent-rules-kit list" to see options.`);
  }

  const baseDir = resolve(options.dir);
  const content = readTemplate(tool.source);
  const target = writeTarget(baseDir, tool.target, content, options.force);
  io.log(`Installed ${tool.label} rules at ${target}`);
}

function compose(toolId, options, io = console) {
  const tool = tools[toolId];
  if (!tool) {
    throw new Error(`Unknown tool "${toolId}". Run "agent-rules-kit list" to see options.`);
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

function doctor(options, io = console) {
  const baseDir = resolve(options.dir);
  const found = [];
  const missing = [];

  for (const [id, tool] of Object.entries(tools)) {
    const target = resolve(baseDir, tool.target);
    if (existsSync(target)) {
      found.push({ id, target: tool.target });
    } else {
      missing.push({ id, target: tool.target });
    }
  }

  io.log(`Agent Rules Kit doctor for ${baseDir}`);
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
    io.log(`  ${item.id.padEnd(15)} agent-rules-kit init ${item.id}`);
  }
}

function show(id, io = console) {
  const source = tools[id]?.source || packs[id] || promptFiles[id];
  if (!source) {
    throw new Error(`Unknown item "${id}". Run "agent-rules-kit list" to see options.`);
  }

  io.log(readTemplate(source));
}

export function run(argv = process.argv.slice(2), io = console) {
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
  process.exitCode = run();
}
