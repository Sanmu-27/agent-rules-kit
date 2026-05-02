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

test("list prints tools and packs", async () => {
  const { io, output } = createIo();
  const status = await run(["list"], io);

  assert.equal(status, 0);
  assert.match(output.join("\n"), /codex/);
  assert.match(output.join("\n"), /frontend/);
  assert.match(output.join("\n"), /bug-fix/);
});

test("install writes a tool rule file", async () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io } = createIo();

  try {
    const status = await run(["install", "codex", "--dir", dir], io);
    const installed = readFileSync(join(dir, "AGENTS.md"), "utf8");

    assert.equal(status, 0);
    assert.match(installed, /Codex Agent Rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("compose combines tool and packs", async () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io } = createIo();

  try {
    const status = await run(["compose", "cursor", "--packs", "frontend,testing", "--dir", dir], io);
    const installed = readFileSync(join(dir, ".cursorrules"), "utf8");

    assert.equal(status, 0);
    assert.match(installed, /Cursor Rules/);
    assert.match(installed, /Frontend Agent Rules/);
    assert.match(installed, /Testing Agent Rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("show prints a pack", async () => {
  const { io, output } = createIo();
  const status = await run(["show", "security"], io);

  assert.equal(status, 0);
  assert.match(output.join("\n"), /Security Agent Rules/);
});

test("unknown packs fail clearly", async () => {
  const { io, errors } = createIo();
  const status = await run(["compose", "codex", "--packs", "made-up"], io);

  assert.equal(status, 1);
  assert.match(errors.join("\n"), /Unknown pack/);
});

test("init writes a preset-based rule file", async () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io } = createIo();

  try {
    const status = await run(["init", "codex", "--preset", "web-app", "--dir", dir], io);
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

test("doctor reports existing and available agent files", async () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const installIo = createIo();
  const { io, output } = createIo();

  try {
    assert.equal(await run(["install", "cursor", "--dir", dir], installIo.io), 0);

    const status = await run(["doctor", "--dir", dir], io);
    const text = output.join("\n");

    assert.equal(status, 0);
    assert.match(text, /Found agent config files/);
    assert.match(text, /cursor/);
    assert.match(text, /Available installs/);
    assert.match(text, /codex/);
    assert.match(text, /Recommended setup/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("unknown presets fail clearly", async () => {
  const { io, errors } = createIo();
  const status = await run(["init", "codex", "--preset", "made-up"], io);

  assert.equal(status, 1);
  assert.match(errors.join("\n"), /Unknown preset/);
});

test("interactive init can accept recommended defaults", async () => {
  const dir = mkdtempSync(join(tmpdir(), "agent-rules-kit-"));
  const { io, output } = createIo();

  try {
    const status = await run(["init", "--interactive", "--yes", "--dir", dir], io);
    const installed = readFileSync(join(dir, "AGENTS.md"), "utf8");
    const text = output.join("\n");

    assert.equal(status, 0);
    assert.match(text, /Using recommended tool/);
    assert.match(installed, /Codex Agent Rules/);
    assert.match(installed, /Frontend Agent Rules/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
