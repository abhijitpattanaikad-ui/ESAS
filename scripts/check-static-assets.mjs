import { join } from "node:path";
import process from "node:process";

import { findMissingStaticAssets } from "./static-assets-lib.mjs";

const root = process.cwd();
const missing = await findMissingStaticAssets({
  sourceRoots: [join(root, "src")],
  publicRoot: join(root, "public"),
});

if (missing.length) {
  console.error("Static asset reference check failed:");
  for (const item of missing) {
    console.error(`- ${item.reference} referenced by ${item.source}`);
  }
  process.exit(1);
}

console.log("Static asset reference check passed.");
