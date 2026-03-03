import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateSkill } from "../src/validator.js";

const VALID_SKILL = `---
name: example-tool
description: >
  A CLI tool for examples. Use when: you need to test things. NOT for: production.
---
# Example Tool
## Overview
Example tool does many useful things for developers.

## Installation
\`\`\`
npm install -g example-tool
\`\`\`

## Core Commands / API
- \`example run\` — runs the example
- \`example build\` — builds the project

## Common Patterns
Use \`example run --watch\` for development.

## Configuration
Create a \`.examplerc\` file in your project root.

## Tips & Gotchas
- Always run \`example build\` before deploying.
`;

describe("validateSkill", () => {
  it("accepts a valid SKILL.md", () => {
    const result = validateSkill(VALID_SKILL);
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it("rejects content shorter than 200 chars", () => {
    const result = validateSkill("too short");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("200 characters")));
  });

  it("rejects missing frontmatter", () => {
    const noFrontmatter = `# Example Tool
## Overview
This is a long enough description to pass length check. Use when: you need it.
${"x".repeat(200)}`;
    const result = validateSkill(noFrontmatter);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("frontmatter")));
  });

  it("rejects frontmatter missing name field", () => {
    const missingName = `---
description: >
  A tool. Use when: testing.
---
## Overview
${"x".repeat(200)}`;
    const result = validateSkill(missingName);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("name")));
  });

  it("rejects frontmatter missing description field", () => {
    const missingDesc = `---
name: example
---
## Overview
Use when: testing something here.
${"x".repeat(200)}`;
    const result = validateSkill(missingDesc);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("description")));
  });

  it("rejects missing 'Use when:' clause", () => {
    const noUseWhen = `---
name: example
description: >
  A tool for examples.
---
## Overview
This tool does stuff.
${"x".repeat(200)}`;
    const result = validateSkill(noUseWhen);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("Use when:")));
  });

  it("rejects missing ## sections", () => {
    const noSections = `---
name: example
description: >
  A tool. Use when: testing.
---
# Example
This has no level-2 headings at all and is just a long block of text.
${"x".repeat(200)}`;
    const result = validateSkill(noSections);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("## ")));
  });

  it("reports multiple errors at once", () => {
    const result = validateSkill("bad");
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 1);
  });
});
