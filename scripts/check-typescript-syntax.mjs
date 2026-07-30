import { createRequire } from "node:module";
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);

function loadTypeScript() {
  for (const candidate of [
    "typescript",
    "/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js",
    "/usr/local/lib/node_modules/typescript/lib/typescript.js",
  ]) {
    try { return require(candidate); } catch { /* try next */ }
  }
  throw new Error("TypeScript is required. Run npm ci before npm run syntax:check.");
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const output = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function resolveLocalImport(specifier, sourceFile, root) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return true;
  const base = specifier.startsWith("@/")
    ? resolve(root, "src", specifier.slice(2))
    : resolve(dirname(sourceFile), specifier);
  const candidates = [
    base,
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"].map((suffix) => `${base}${suffix}`),
    ...["index.ts", "index.tsx", "index.js", "index.jsx"].map((name) => join(base, name)),
  ];
  return (await Promise.all(candidates.map(exists))).some(Boolean);
}

const ts = loadTypeScript();
const root = process.cwd();
const files = [
  ...(await walk(join(root, "src"))),
  join(root, "next.config.ts"),
]
  .filter((file) => [".ts", ".tsx"].includes(extname(file)))
  .filter((file) => !file.endsWith(".d.ts"));

const failures = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.Preserve,
      isolatedModules: true,
    },
  });
  const diagnostics = (result.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
  if (diagnostics.length) {
    failures.push(ts.formatDiagnostics(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }));
  }

  const imports = ts.preProcessFile(source, true, true).importedFiles.map((item) => item.fileName);
  for (const specifier of imports) {
    if (!(await resolveLocalImport(specifier, file, root))) {
      failures.push(`${file}: unresolved local import ${specifier}`);
    }
  }
}

if (failures.length) {
  console.error(`TypeScript syntax/import gate failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}

console.log(`TypeScript syntax/import gate passed (${files.length} files checked).`);
