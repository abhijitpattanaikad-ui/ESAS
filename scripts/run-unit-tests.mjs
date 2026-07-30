import { createRequire } from "node:module";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const require = createRequire(import.meta.url);

function loadTypeScript() {
  try {
    return require("typescript");
  } catch {
    const globalCandidates = [
      "/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js",
      "/usr/local/lib/node_modules/typescript/lib/typescript.js",
    ];
    for (const candidate of globalCandidates) {
      try {
        return require(candidate);
      } catch {
        // Continue to the next known global installation path.
      }
    }
  }
  throw new Error("TypeScript is required. Run npm ci before npm test.");
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

const ts = loadTypeScript();
const root = process.cwd();
const outputRoot = join(root, ".unit-test-build");
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await writeFile(join(outputRoot, "package.json"), '{"type":"commonjs"}\n');

const sourceRoots = [join(root, "src", "lib"), join(root, "src", "features")];
const sourceFiles = (await Promise.all(sourceRoots.map(walk)))
  .flat()
  .filter((file) => [".ts", ".tsx"].includes(extname(file)) && !file.endsWith(".d.ts"));

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      resolveJsonModule: true,
      sourceMap: true,
    },
  });
  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length) {
    const formatted = ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    });
    throw new Error(formatted);
  }
  const output = join(outputRoot, relative(root, file)).replace(/\.tsx?$/, ".js");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, result.outputText);
}

const compiledTests = (await walk(outputRoot)).filter((file) => file.endsWith(".test.js"));
const nativeTests = (await walk(join(root, "src"))).filter((file) => file.endsWith(".test.mjs"));
const tests = [...compiledTests, ...nativeTests];
if (!tests.length) throw new Error("No unit tests were found.");

const run = spawnSync(process.execPath, ["--test", ...tests], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "test" },
});
process.exit(run.status ?? 1);
