export type SourceType = "repo" | "npm" | "url" | "local";

export interface SkillGenOptions {
  source: string;
  sourceType: SourceType;
  output?: string;
  install?: boolean;
}

export interface FetchResult {
  name: string;
  description: string;
  readme: string;
  sourceFiles: string[];
  packageJson?: Record<string, unknown>;
  language?: string;
}

export interface SkillSection {
  title: string;
  content: string;
}
