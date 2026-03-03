import type { FetchResult, SourceType } from "./types.js";

export async function fetchSource(source: string, sourceType: SourceType): Promise<FetchResult> {
  switch (sourceType) {
    case "repo":
      return fetchFromRepo(source);
    case "npm":
      return fetchFromNpm(source);
    case "url":
      return fetchFromUrl(source);
    case "local":
      return fetchFromLocal(source);
  }
}

async function fetchFromRepo(url: string): Promise<FetchResult> {
  // TODO: use gh CLI to fetch repo metadata + README
  // TODO: use Jina Reader for additional docs
  return {
    name: url.split("/").pop() ?? "unknown",
    description: "",
    readme: "",
    sourceFiles: [],
  };
}

async function fetchFromNpm(packageName: string): Promise<FetchResult> {
  // TODO: fetch from npm registry API
  return {
    name: packageName,
    description: "",
    readme: "",
    sourceFiles: [],
  };
}

async function fetchFromUrl(url: string): Promise<FetchResult> {
  // TODO: use Jina Reader (r.jina.ai) to fetch content
  return {
    name: new URL(url).hostname,
    description: "",
    readme: "",
    sourceFiles: [],
  };
}

async function fetchFromLocal(path: string): Promise<FetchResult> {
  // TODO: read local files (README, package.json, source)
  return {
    name: path.split("/").pop() ?? "unknown",
    description: "",
    readme: "",
    sourceFiles: [],
  };
}
