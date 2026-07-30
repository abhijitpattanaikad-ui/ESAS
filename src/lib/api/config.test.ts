import { describe, expect, it } from "vitest";
import { normalizeApiBaseUrl } from "./config";

describe("normalizeApiBaseUrl", () => {
  it("removes trailing slashes from an HTTPS API base URL", () => {
    expect(normalizeApiBaseUrl("https://apis.xesports.pro///")).toBe(
      "https://apis.xesports.pro",
    );
  });

  it("uses the production API when a value is missing", () => {
    expect(normalizeApiBaseUrl(undefined)).toBe("https://apis.xesports.pro");
  });

  it("rejects non-HTTP protocols", () => {
    expect(() => normalizeApiBaseUrl("javascript:alert(1)")).toThrow(
      "API URL must use HTTP or HTTPS",
    );
  });
});
