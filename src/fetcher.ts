import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { FetchResult, SourceType } from "./types.js";

export async function fetchSource(source: string, sourceType: SourceType): Promise<FetchResult> {
  switch (sourceType) {
    case "repo":
      return fetchGitHub(source);
    case "npm":
      return fetchNpm(source);
    case "url":
      return fetchUrl(source);
    case "local":
      return fetchLocal(source);
  }
}

function extractOwnerRepo(url: string): string {
  // Handle https://github.com/owner/repo or https://github.com/owner/repo.git
  const match = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:\/|$)/);
  if (!match) throw new Error(`Cannot parse GitHub URL: ${url}`);
  return match[1];
}

async function fetchGitHub(url: string): Promise<FetchResult> {
  const ownerRepo = extractOwnerRepo(url);

  // Fetch repo metadata via gh CLI
  let ghData: { name: string; description: string; readme: string } = {
    name: ownerRepo.split("/")[1],
    description: "",
    readme: "",
  };
  try {
    const raw = execSync(`gh repo view ${ownerRepo} --json name,description,readme`, {
      encoding: "utf-8",
      timeout: 30_000,
    });
    ghData = JSON.parse(raw);
  } catch {
    // gh CLI may not be available or authenticated — continue with Jina fallback
  }

  // Fetch rendered page via Jina Reader for richer content
  let jinaContent = "";
  try {
    const resp = await fetch(`https://r.jina.ai/${url}`);
    if (resp.ok) jinaContent = await resp.text();
  } catch {
    // Jina fetch failed — we still have gh data
  }

  const readme = ghData.readme || jinaContent;

  return {
    name: ghData.name,
    description: ghData.description ?? "",
    readme,
    sourceFiles: [],
    language: detectLanguageFromReadme(readme),
  };
}

async function fetchNpm(packageName: string): Promise<FetchResult> {
  // Fetch package metadata from npm registry
  const registryResp = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`);
  if (!registryResp.ok) {
    throw new Error(`npm registry returned ${registryResp.status} for "${packageName}"`);
  }
  const data = await registryResp.json() as Record<string, unknown>;

  const latestVersion = (data["dist-tags"] as Record<string, string>)?.["latest"];
  const versions = data["versions"] as Record<string, Record<string, unknown>> | undefined;
  const latestMeta = latestVersion && versions ? versions[latestVersion] : undefined;

  let readme = (data["readme"] as string) ?? "";

  // If registry README is minimal, try Jina Reader on the npm page
  if (readme.length < 200) {
    try {
      const jinaResp = await fetch(`https://r.jina.ai/https://www.npmjs.com/package/${encodeURIComponent(packageName)}`);
      if (jinaResp.ok) readme = await jinaResp.text();
    } catch {
      // continue with what we have
    }
  }

  return {
    name: packageName,
    description: (data["description"] as string) ?? "",
    readme,
    sourceFiles: [],
    packageJson: latestMeta as Record<string, unknown> | undefined,
    language: "JavaScript/TypeScript",
  };
}

async function fetchUrl(url: string): Promise<FetchResult> {
  const resp = await fetch(`https://r.jina.ai/${url}`);
  if (!resp.ok) {
    throw new Error(`Jina Reader returned ${resp.status} for "${url}"`);
  }
  const content = await resp.text();

  // Derive a name from the URL
  const urlObj = new URL(url);
  const name = urlObj.pathname.split("/").filter(Boolean).pop() ?? urlObj.hostname;

  return {
    name,
    description: "",
    readme: content,
    sourceFiles: [],
  };
}

async function fetchLocal(dirPath: string): Promise<FetchResult> {
  let readme = "";
  let packageJson: Record<string, unknown> | undefined;
  let name = dirPath.split("/").filter(Boolean).pop() ?? "unknown";
  let description = "";

  // Read README.md
  try {
    readme = await readFile(join(dirPath, "README.md"), "utf-8");
  } catch {
    // No README — try readme.md (lowercase)
    try {
      readme = await readFile(join(dirPath, "readme.md"), "utf-8");
    } catch {
      // No README at all
    }
  }

  // Read package.json
  try {
    const raw = await readFile(join(dirPath, "package.json"), "utf-8");
    packageJson = JSON.parse(raw);
    name = (packageJson["name"] as string) ?? name;
    description = (packageJson["description"] as string) ?? "";
  } catch {
    // No package.json
  }

  return {
    name,
    description,
    readme,
    sourceFiles: [],
    packageJson,
    language: packageJson ? "JavaScript/TypeScript" : undefined,
  };
}

function detectLanguageFromReadme(readme: string): string | undefined {
  const lower = readme.toLowerCase();
  if (lower.includes("python") || lower.includes("pip install")) return "Python";
  if (lower.includes("npm install") || lower.includes("yarn add") || lower.includes("typescript")) return "JavaScript/TypeScript";
  if (lower.includes("cargo") || lower.includes("rust")) return "Rust";
  if (lower.includes("go get") || lower.includes("golang")) return "Go";
  return undefined;
}
