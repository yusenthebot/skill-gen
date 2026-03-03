# skill-gen

[![npm version](https://img.shields.io/npm/v/skill-gen)](https://www.npmjs.com/package/skill-gen)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Auto-generate [OpenClaw](https://github.com/anthropics/openclaw) SKILL.md files from any GitHub repo, npm package, or documentation URL. Point it at a source and get a structured, ready-to-use skill file powered by Claude.

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

# Generate and install directly to ~/.openclaw/skills/
skill-gen --repo https://github.com/sindresorhus/ora --install
```

Output goes to stdout by default. Use `-o <file>` to write to a file, or `--install` to deploy directly to `~/.openclaw/skills/`.

## How It Works

1. **Fetch** — Pulls README, metadata, and docs from the source (GitHub API, npm registry, or Jina Reader for URLs)
2. **Generate** — Sends the extracted content to Claude, which produces a structured SKILL.md following the OpenClaw format
3. **Validate** — Runs the output through a format validator; retries once with error feedback if validation fails
4. **Output** — Prints the SKILL.md to stdout, saves to a file, or installs to `~/.openclaw/skills/`

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes and add tests
4. Run `npm test` to verify
5. Open a pull request
