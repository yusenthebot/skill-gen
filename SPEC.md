# skill-gen — Project Spec

## What
A CLI tool that auto-generates OpenClaw SKILL.md files from:
- GitHub repo URL
- npm package name
- Documentation URL
- Local folder path

## How it works
1. Fetch the source (README, docs, package.json, source files)
2. Extract: core commands/API, use cases, config options, common patterns
3. Generate a structured SKILL.md following OpenClaw's format
4. Optionally publish to ~/.openclaw/skills/<name>/

## SKILL.md format to generate
```markdown
---
name: <tool-name>
description: >
  One-line description. Use when: X, Y, Z. NOT for: A, B.
---
# <Tool Name>
## Overview
## Installation
## Core Commands / API
## Common Patterns
## Configuration
## Tips & Gotchas
```

## CLI interface
```
skill-gen <source>              # auto-detect type
skill-gen --repo <github-url>   # GitHub repo
skill-gen --npm <package-name>  # npm package
skill-gen --url <doc-url>       # documentation page
skill-gen --local <path>        # local folder
skill-gen --install             # copy to ~/.openclaw/skills/
skill-gen --publish             # push to clawhub (future)
```

## Tech stack
- Node.js + TypeScript
- Jina Reader (curl https://r.jina.ai/URL) for web content
- GitHub API (gh CLI) for repo metadata
- Anthropic API for content extraction + SKILL.md generation
- Uses $ANTHROPIC_API_KEY from environment

## Output
- Prints SKILL.md to stdout (default)
- --output <file> to save
- --install to deploy directly

## Quality bar
- Must handle repos with no README gracefully
- Should detect language/framework automatically
- Generated skill must pass a basic format validator
- Include usage examples extracted from real repo
