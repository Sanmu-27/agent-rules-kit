import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { run } from "../bin/agent-rules-kit.js";

function createIo() {
  const output = [];
  const errors = [];

  return {
    io: {
      log(message = "") {
        output.push(String(message));
      },
      error(message = "") {
        errors.push(String(message));
      }
    },
    output,
    errors
  };
}

test("list prints tools and packs", () => {
  const { io, output } = createIo();
  const status = run(["list"], io);

  assert.equal(status, 0);
  assert.match(output.join("\n"), /codex/);
  assert.match(output.join("\n"), /frontend/);
  assert.match(output.join("\n"), /bug-fix/);
});

test("install writes a tool rule file", () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io } = createIo();

  try {
    const status = run(["install", "codex", "--dir", dir], io);
    const installed = readFileSync(join(dir, "AGENTS.md"), "utf8");

    assert.equal(status, 0);
    assert.match(installed, /Codex Agent Rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("compose combines tool and packs", () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io } = createIo();

  try {
    const status = run(["compose", "cursor", "--packs", "frontend,testing", "--dir", dir], io);
    const installed = readFileSync(join(dir, ".cursorrules"), "utf8");

    assert.equal(status, 0);
    assert.match(installed, /Cursor Rules/);
    assert.match(installed, /Frontend Agent Rules/);
    assert.match(installed, /Testing Agent Rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("show prints a pack", () => {
  const { io, output } = createIo();
  const status = run(["show", "security"], io);

  assert.equal(status, 0);
  assert.match(output.join("\n"), /Security Agent Rules/);
});

test("unknown packs fail clearly", () => {
  const { io, errors } = createIo();
  const status = run(["compose", "codex", "--packs", "made-up"], io);

  assert.equal(status, 1);
  assert.match(errors.join("\n"), /Unknown pack/);
});

test("init writes a preset-based rule file", () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io } = createIo();

  try {
    const status = run(["init", "codex", "--preset", "web-app", "--dir", dir], io);
    const installed = readFileSync(join(dir, "AGENTS.md"), "utf8");

    assert.equal(status, 0);
    assert.match(installed, /Codex Agent Rules/);
    assert.match(installed, /Frontend Agent Rules/);
    assert.match(installed, /Backend Agent Rules/);
    assert.match(installed, /Security Agent Rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("doctor reports existing and available agent files", () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const installIo = createIo();
  const { io, output } = createIo();

  try {
    assert.equal(run(["install", "cursor", "--dir", dir], installIo.io), 0);

    const status = run(["doctor", "--dir", dir], io);
    const text = output.join("\n");

    assert.equal(status, 0);
    assert.match(text, /Found agent config files/);
    assert.match(text, /cursor/);
    assert.match(text, /Available installs/);
    assert.match(text, /codex/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("unknown presets fail clearly", () => {
  const { io, errors } = createIo();
  const status = run(["init", "codex", "--preset", "made-up"], io);

  assert.equal(status, 1);
  assert.match(errors.join("\n"), /Unknown preset/);
});
