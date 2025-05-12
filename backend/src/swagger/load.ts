import { readFileSync } from "node:fs";
import { parse } from "yaml";

export function loadSwagger(openApiPath: string): any {
  const file = readFileSync(openApiPath, { encoding: "utf-8" });
  if (!file) {
    console.error("failed to load swagger file");
    return;
  }
  const openApiJson = parse(file);
  return openApiJson;
}
