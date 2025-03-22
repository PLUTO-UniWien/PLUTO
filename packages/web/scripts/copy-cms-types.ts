import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Locate source and destination paths
const repoRoot = join(__dirname, "../../../");
const cmsTypesPath = join(repoRoot, "packages/cms/types/generated");
const webTypesPath = join(repoRoot, "packages/web/src/types");

// Read the source files
const components = readFileSync(join(cmsTypesPath, "components.d.ts"), "utf-8");
const contentTypes = readFileSync(join(cmsTypesPath, "contentTypes.d.ts"), "utf-8");

function processFile(file: string) {
  let processed = file;

  // Replace all occurrences of '@strapi/strapi' with '@strapi/types' to make sure the web package does not need to depend on @strapi/strapi
  processed = processed.replace(/@strapi\/strapi/g, "@strapi/types");

  // Disable eslint for the file
  processed = ["/* eslint-disable */", processed].join("\n");

  return processed;
}

// Write the processed files
writeFileSync(join(webTypesPath, "components.d.ts"), processFile(components));
writeFileSync(join(webTypesPath, "contentTypes.d.ts"), processFile(contentTypes));
