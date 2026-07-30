import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const SOURCE_EXTENSIONS = new Set([".css", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const STRING_REFERENCE = /(["'`])(\/images\/[^"'`?#]+?)(?:[?#][^"'`]*)?\1/g;
const CSS_REFERENCE = /url\(\s*(["']?)(\/images\/[^"')?#]+?)(?:[?#][^"')]+)?\1\s*\)/g;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (
      SOURCE_EXTENSIONS.has(extname(path).toLowerCase()) &&
      !path.includes(".test.") &&
      !path.includes(".spec.")
    ) {
      files.push(path);
    }
  }
  return files;
}

function normalizeReference(reference) {
  try {
    return decodeURIComponent(reference.trim());
  } catch {
    return reference.trim();
  }
}

export function extractStaticAssetReferences(source) {
  const references = new Set();
  for (const pattern of [STRING_REFERENCE, CSS_REFERENCE]) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      const reference = normalizeReference(match[2]);
      if (reference.startsWith("/images/")) references.add(reference);
    }
  }
  return [...references].sort();
}

async function isFile(path) {
  try {
    await access(path);
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

export async function findMissingStaticAssets({ sourceRoots, publicRoot }) {
  const projectRoot = dirname(resolve(publicRoot));
  const sourceFiles = (await Promise.all(sourceRoots.map((root) => walk(root)))).flat();
  const missing = [];

  for (const file of sourceFiles) {
    const source = await readFile(file, "utf8");
    for (const reference of extractStaticAssetReferences(source)) {
      const relativeAssetPath = reference.replace(/^\/+/, "");
      const target = resolve(publicRoot, relativeAssetPath);
      const publicRootPrefix = `${resolve(publicRoot)}/`;

      if (!target.startsWith(publicRootPrefix) || !(await isFile(target))) {
        missing.push({
          reference,
          source: relative(projectRoot, file).replaceAll("\\", "/"),
        });
      }
    }
  }

  return missing.sort((left, right) =>
    `${left.reference}:${left.source}`.localeCompare(`${right.reference}:${right.source}`),
  );
}
