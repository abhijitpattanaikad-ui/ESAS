import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rootSource = await readFile("src/app/layout.tsx", "utf8");
const authSource = await readFile("src/app/(auth)/layout.tsx", "utf8");
const privacySource = await readFile("src/app/(site)/privacy/page.tsx", "utf8");
const termsSource = await readFile("src/app/(site)/terms/page.tsx", "utf8");
const tournamentSource = await readFile("src/app/(site)/tournaments/[id]/page.tsx", "utf8");

const rootTemplate = rootSource.match(/template:\s*"([^"]+)"/)?.[1];

function staticTitle(source) {
  const absolute = source.match(/title:\s*\{\s*absolute:\s*"([^"]+)"/s)?.[1];
  if (absolute) return { absolute };
  return source.match(/title:\s*"([^"]+)"/)?.[1];
}

function resolveTitle(title) {
  if (typeof title === "object" && title?.absolute) return title.absolute;
  return rootTemplate.replace("%s", title);
}

test("descendant metadata resolves each public title with the GoEzPz brand exactly once", () => {
  const fallbackTournamentTitle = tournamentSource.match(
    /result\.kind !== "success"\) return \{ title: "([^"]+)" \}/,
  )?.[1];
  const templateTitleSuffix = tournamentSource.match(
    /title: `\$\{result\.data\.name\}([^`]*)`/,
  )?.[1];
  const tournamentNameSuffix = /title:\s*result\.data\.name/.test(tournamentSource)
    ? ""
    : templateTitleSuffix;

  assert.deepEqual(
    {
      auth: resolveTitle(staticTitle(authSource)),
      privacy: resolveTitle(staticTitle(privacySource)),
      terms: resolveTitle(staticTitle(termsSource)),
      tournamentFallback: resolveTitle(fallbackTournamentTitle),
      tournamentSuccess: resolveTitle(`Summer Cup${tournamentNameSuffix}`),
    },
    {
      auth: "GoEzPz — Login",
      privacy: "Privacy Policy | GoEzPz",
      terms: "Terms & Conditions | GoEzPz",
      tournamentFallback: "Tournament | GoEzPz",
      tournamentSuccess: "Summer Cup | GoEzPz",
    },
  );
});
