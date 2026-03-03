import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export async function installSkill(name: string, content: string): Promise<string> {
  const skillDir = join(homedir(), ".openclaw", "skills", name);
  await mkdir(skillDir, { recursive: true });

  const skillPath = join(skillDir, "SKILL.md");
  await writeFile(skillPath, content, "utf-8");

  return skillPath;
}
