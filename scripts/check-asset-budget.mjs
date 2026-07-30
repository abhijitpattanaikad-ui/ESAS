import { readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const MAX_RASTER_BYTES = 2 * 1024 * 1024;
const MAX_PUBLIC_BYTES = 18 * 1024 * 1024;
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

const root = process.cwd();
const files = await walk(join(root, "public"));
let total = 0;
const oversized = [];
for (const file of files) {
  const size = (await stat(file)).size;
  total += size;
  if (RASTER.has(extname(file).toLowerCase()) && size > MAX_RASTER_BYTES) {
    oversized.push(`${relative(root, file)} (${(size / 1024 / 1024).toFixed(2)} MiB)`);
  }
}
if (oversized.length || total > MAX_PUBLIC_BYTES) {
  console.error(`Asset budget failed. Total ${(total / 1024 / 1024).toFixed(2)} MiB / ${(MAX_PUBLIC_BYTES / 1024 / 1024).toFixed(0)} MiB.`);
  for (const file of oversized) console.error(`- ${file}`);
  process.exit(1);
}
console.log(`Asset budget passed: ${(total / 1024 / 1024).toFixed(2)} MiB across ${files.length} files.`);
