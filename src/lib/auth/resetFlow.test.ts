import { describe, expect, it } from "vitest";
import { getResetOutcome } from "./resetFlow";

describe("getResetOutcome", () => {
  it("redirects to login only after a successful reset", () => {
    expect(getResetOutcome({ ok: true, status: 200 })).toEqual({
      kind: "success",
      redirectTo: "/login",
    });
  });

  it("keeps an expired reset on the page so the user controls navigation", () => {
    expect(getResetOutcome({ ok: false, status: 401 })).toEqual({
      kind: "expired",
      redirectTo: null,
    });
  });

  it("keeps generic failures on the form for retry", () => {
    expect(getResetOutcome({ ok: false, status: 500 })).toEqual({
      kind: "error",
      redirectTo: null,
    });
  });
});
