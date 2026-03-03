import Anthropic from "@anthropic-ai/sdk";
import type { FetchResult } from "./types.js";

const SYSTEM_PROMPT = `You are an expert at writing OpenClaw SKILL.md files. Given source content about a tool, generate a well-structured SKILL.md. The description must include Use when: and NOT for: clauses.

Output ONLY the SKILL.md content — no extra commentary, no wrapping code fences.`;

const SKILL_TEMPLATE = `---
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
## Tips & Gotchas`;

export async function generateSkillMd(fetchResult: FetchResult): Promise<string> {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
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
  const parts = [
    `Generate an OpenClaw SKILL.md for "${fetchResult.name}".`,
    "",
    "## Source Information",
    `- **Name**: ${fetchResult.name}`,
    `- **Description**: ${fetchResult.description || "(none)"}`,
    `- **Language**: ${fetchResult.language ?? "unknown"}`,
  ];

  if (fetchResult.packageJson) {
    const deps = Object.keys((fetchResult.packageJson["dependencies"] as Record<string, string>) ?? {});
    if (deps.length > 0) {
      parts.push(`- **Dependencies**: ${deps.join(", ")}`);
    }
  }

  parts.push("", "## README / Documentation Content", "```", fetchResult.readme || "(no README available)", "```");

  parts.push(
    "",
    "## Output Format",
    "Use this exact SKILL.md template structure:",
    "```",
    SKILL_TEMPLATE,
    "```",
    "",
    "Requirements:",
    "- Fill in every section with real, specific content extracted from the source material above.",
    "- The `description` frontmatter MUST include `Use when:` and `NOT for:` clauses.",
    "- Include actual usage examples and commands found in the documentation.",
    "- If the source has installation instructions, use those exactly.",
    "- Under Tips & Gotchas, include real caveats or important notes from the docs.",
  );

  return parts.join("\n");
}
