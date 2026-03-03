#!/usr/bin/env node
import { Command } from "commander";
import { run } from "./index.js";
import type { SkillGenOptions, SourceType } from "./types.js";

const program = new Command();

program
  .name("skill-gen")
  .description("Auto-generate OpenClaw SKILL.md files")
  .version("0.1.0")
  .argument("[source]", "auto-detect source type")
  .option("--repo <url>", "GitHub repo URL")
  .option("--npm <package>", "npm package name")
  .option("--url <url>", "documentation URL")
  .option("--local <path>", "local folder path")
  .option("-o, --output <file>", "output file path")
  .option("--install", "install to ~/.openclaw/skills/")
  .action(async (source: string | undefined, flags: Record<string, string | boolean | undefined>) => {
    const opts = resolveOptions(source, flags);
    await run(opts);
  });

function resolveOptions(
  source: string | undefined,
  flags: Record<string, string | boolean | undefined>
): SkillGenOptions {
  if (flags.repo) return { source: flags.repo as string, sourceType: "repo", output: flags.output as string | undefined, install: flags.install as boolean | undefined };
  if (flags.npm) return { source: flags.npm as string, sourceType: "npm", output: flags.output as string | undefined, install: flags.install as boolean | undefined };
  if (flags.url) return { source: flags.url as string, sourceType: "url", output: flags.output as string | undefined, install: flags.install as boolean | undefined };
  if (flags.local) return { source: flags.local as string, sourceType: "local", output: flags.output as string | undefined, install: flags.install as boolean | undefined };

  if (source) {
    const sourceType = detectSourceType(source);
    return { source, sourceType, output: flags.output as string | undefined, install: flags.install as boolean | undefined };
  }

  program.help();
  process.exit(1);
}

function detectSourceType(source: string): SourceType {
  if (source.includes("github.com")) return "repo";
  if (source.startsWith("http://") || source.startsWith("https://")) return "url";
  if (source.startsWith("/") || source.startsWith("./") || source.startsWith("..")) return "local";
  return "npm";
}

program.parse();
