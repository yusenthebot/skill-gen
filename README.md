<div align="center">

# skill-gen

**Turn any GitHub repo, npm package, or docs page into an OpenClaw SKILL.md — in seconds.**

[![npm](https://img.shields.io/npm/v/skill-gen?color=cb3837&logo=npm)](https://www.npmjs.com/package/skill-gen)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js)](https://nodejs.org)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-compatible-orange)](https://openclaw.ai)

```
skill-gen --npm ora
```

*→ Reads the package. Calls Claude. Outputs a ready-to-use SKILL.md.*

</div>

---

## Why

Every time you install a new tool, you spend 20 minutes reading docs before your AI agent can use it effectively. `skill-gen` reads the docs for you and outputs a structured [`SKILL.md`](https://docs.openclaw.ai/skills) that teaches your agent exactly how to use the tool — commands, patterns, gotchas included.

## Demo

```
$ skill-gen --npm ora

⠸ Fetching ora from npm registry...
⠼ Generating SKILL.md with Claude...
✔ Done (2.3s)

---
name: ora
description: >
  Elegant terminal spinners for Node.js. Use when: showing progress
  for async operations, long-running CLI tasks. NOT for: progress
  bars with percentages, non-TTY environments.
---

# ora

## Core API
...
## Common Patterns
...
## Tips & Gotchas
...
```

**Full demo output →** [demo-output.md](./demo-output.md)

## Install

```bash
npm install -g skill-gen
```

Requires `ANTHROPIC_API_KEY` in your environment.

## Usage

```bash
# From a GitHub repo
skill-gen --repo https://github.com/tj/commander.js

# From an npm package  
skill-gen --npm chalk

# From a documentation URL
skill-gen --url https://docs.astro.build/en/getting-started/

# Generate + install directly to ~/.openclaw/skills/
skill-gen --repo https://github.com/sindresorhus/ora --install

# Save to file
skill-gen --npm zod --output ~/.openclaw/skills/zod/SKILL.md
```

## How It Works

```
Input (repo / npm / url / local)
    │
    ▼
┌─────────────────────────────┐
│  Fetcher                    │
│  GitHub API + Jina Reader   │  ← pulls README, metadata, source files
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Generator                  │
│  Claude claude-sonnet-4-6   │  ← extracts commands, patterns, gotchas
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Validator                  │
│  Format checker             │  ← retries once if format is wrong
└─────────────┬───────────────┘
              │
    stdout / file / ~/.openclaw/skills/
```

## SKILL.md Format

Generated files follow the [OpenClaw skill format](https://docs.openclaw.ai/skills):

```markdown
---
name: tool-name
description: >
  One-liner. Use when: X, Y. NOT for: A, B.
---

# Tool Name
## Overview
## Installation
## Core Commands / API
## Common Patterns
## Configuration
## Tips & Gotchas
```

## Contributing

```bash
git clone https://github.com/yusenthebot/skill-gen
cd skill-gen
npm install
npm test
```

PRs welcome. If a tool generates a bad skill, open an issue with the source URL — the prompt is the easiest thing to tune.

---

<div align="center">
Built with <a href="https://openclaw.ai">OpenClaw</a> · Powered by <a href="https://anthropic.com">Claude</a>
</div>
