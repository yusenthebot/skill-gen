import chalk from "chalk";
import ora from "ora";
import { writeFile } from "node:fs/promises";
import { fetchSource } from "./fetcher.js";
import { generateSkillMd } from "./generator.js";
import { installSkill } from "./installer.js";
import type { SkillGenOptions } from "./types.js";

export async function run(opts: SkillGenOptions): Promise<void> {
  const spinner = ora(`Fetching from ${opts.sourceType}: ${opts.source}`).start();

  const fetchResult = await fetchSource(opts.source, opts.sourceType);
  spinner.succeed(`Fetched: ${fetchResult.name}`);

  spinner.start("Generating SKILL.md...");
  const skillMd = await generateSkillMd(fetchResult);
  spinner.succeed("Generated SKILL.md");

  if (opts.output) {
    await writeFile(opts.output, skillMd, "utf-8");
    console.log(chalk.green(`Written to ${opts.output}`));
  } else if (opts.install) {
    const path = await installSkill(fetchResult.name, skillMd);
    console.log(chalk.green(`Installed to ${path}`));
  } else {
    console.log(skillMd);
  }
}
