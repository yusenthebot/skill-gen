import Anthropic from "@anthropic-ai/sdk";
import type { FetchResult } from "./types.js";

export async function generateSkillMd(fetchResult: FetchResult): Promise<string> {
  const client = new Anthropic();

  // TODO: build prompt from fetchResult, call Claude, return SKILL.md
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: buildPrompt(fetchResult),
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }
  return block.text;
}

function buildPrompt(fetchResult: FetchResult): string {
  return `Generate an OpenClaw SKILL.md for "${fetchResult.name}".

Use this information:
- Description: ${fetchResult.description}
- README: ${fetchResult.readme}
- Language: ${fetchResult.language ?? "unknown"}
- Source files: ${fetchResult.sourceFiles.length} files

Output the SKILL.md in this exact format:

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

Include real usage examples extracted from the provided content.`;
}
