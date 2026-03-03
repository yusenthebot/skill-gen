import chalk from "chalk";
import ora from "ora";
import { writeFile } from "node:fs/promises";
import { fetchSource } from "./fetcher.js";
import { generateSkillMd } from "./generator.js";
import { installSkill } from "./installer.js";
import type { SkillGenOptions } from "./types.js";

export async function run(opts: SkillGenOptions): Promise<void> {
  const spinner = ora(`Fetching from ${opts.sourceType}: ${opts.source}`).start();

  let fetchResult;
  try {
    fetchResult = await fetchSource(opts.source, opts.sourceType);
  } catch (err) {
    spinner.fail("Fetch failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
  spinner.succeed(`Fetched: ${fetchResult.name}`);

  if (!fetchResult.readme && !fetchResult.description) {
    console.error(chalk.yellow("Warning: no README or description found — output may be sparse."));
  }

  spinner.start("Generating SKILL.md with Claude...");
  let skillMd;
  try {
    skillMd = await generateSkillMd(fetchResult);
  } catch (err) {
    spinner.fail("Generation failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
  spinner.succeed("Generated SKILL.md");

  if (opts.output) {
    await writeFile(opts.output, skillMd, "utf-8");
    console.log(chalk.green(`Written to ${opts.output}`));
  } else if (opts.install) {
    const path = await installSkill(fetchResult.name, skillMd);
    console.log(chalk.green(`Installed to ${path}`));
  } else {
    console.log("\n" + skillMd);
  }
}
