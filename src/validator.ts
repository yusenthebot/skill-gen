export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSkill(content: string): ValidationResult {
  const errors: string[] = [];

  // Check length
  if (content.length <= 200) {
    errors.push("Content must be longer than 200 characters");
  }

  // Check frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    errors.push("Missing frontmatter (--- delimited block at start)");
  } else {
    const fm = frontmatterMatch[1];
    if (!/^name:\s*.+/m.test(fm)) {
      errors.push("Frontmatter missing 'name' field");
    }
    if (!/description:/m.test(fm)) {
      errors.push("Frontmatter missing 'description' field");
    }
  }

  // Check for ## sections
  if (!/^## .+/m.test(content)) {
    errors.push("Must contain at least one '## ' section heading");
  }

  // Check description contains 'Use when:'
  if (!content.includes("Use when:")) {
    errors.push("Description must include 'Use when:' clause");
  }

  return { valid: errors.length === 0, errors };
}
