import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if ([".ts", ".tsx", ".js", ".mjs"].includes(extname(path))) files.push(path);
  }
  return files;
}

const rules = [
  { pattern: /localStorage\.(?:getItem|setItem|removeItem)\(["'](?:token|accessToken|authToken)["']/g, message: "bearer token in localStorage" },
  { pattern: /NEXT_PUBLIC_MOCK_AUTH/g, message: "public mock-auth bypass" },
  { pattern: /dangerouslySetInnerHTML/g, message: "unsafe HTML rendering" },
  { pattern: /using demo data|fall through to mock data|MOCK_SINGLE_ELIMINATION/g, message: "fabricated production bracket fallback" },
];

const root = process.cwd();
const files = await walk(join(root, "src"));
const failures = [];
for (const file of files) {
  if (file.endsWith("check-source-safety.mjs")) continue;
  const content = await readFile(file, "utf8");
  for (const rule of rules) {
    if (rule.pattern.test(content)) failures.push(`${relative(root, file)}: ${rule.message}`);
    rule.pattern.lastIndex = 0;
  }
}
if (failures.length) {
  console.error("Source safety gate failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Source safety gate passed (${files.length} files scanned).`);
