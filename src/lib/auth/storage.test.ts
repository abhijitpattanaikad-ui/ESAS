import { beforeEach, describe, expect, it } from "vitest";
import { clearAuthStorage } from "./storage";

describe("clearAuthStorage", () => {
  beforeEach(() => localStorage.clear());

  it("removes xEsports authentication data without deleting unrelated data", () => {
    localStorage.setItem("token", "secret");
    localStorage.setItem("username", "player");
    localStorage.setItem("userId", "123");
    localStorage.setItem("profileImage", "avatar.png");
    localStorage.setItem("theme", "dark");

    clearAuthStorage(localStorage);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("username")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(localStorage.getItem("profileImage")).toBeNull();
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
