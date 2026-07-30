import { describe, expect, it } from "vitest";
import { sanitizeRichHtml } from "./sanitizeHtml";
import { getSafeHttpsUrl } from "./safeUrl";

describe("sanitizeRichHtml", () => {
  it("removes executable content while preserving allowed formatting", () => {
    const dirty =
      '<p onclick="steal()">Welcome <strong>player</strong></p>' +
      '<img src=x onerror="steal()"><script>steal()</script>';

    expect(sanitizeRichHtml(dirty)).toBe(
      "<p>Welcome <strong>player</strong></p>",
    );
  });

  it("removes unsafe links and protects links opened in a new tab", () => {
    expect(
      sanitizeRichHtml(
        '<a href="javascript:steal()">bad</a><a href="https://example.com" target="_blank">good</a>',
      ),
    ).toBe(
      '<a>bad</a><a href="https://example.com" target="_blank" rel="noopener noreferrer">good</a>',
    );
  });
});

describe("getSafeHttpsUrl", () => {
  it.each([
    ["https://example.com/rules", "https://example.com/rules"],
    ["example.com/rules", "https://example.com/rules"],
    ["javascript:alert(1)", null],
    ["http://example.com/rules", null],
    ["not a url", null],
  ])("maps %s to %s", (input, expected) => {
    expect(getSafeHttpsUrl(input)).toBe(expected);
  });
});
