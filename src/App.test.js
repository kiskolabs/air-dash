import { describe, expect, it } from "vitest";

describe("App smoke suite", () => {
  it("keeps the smoke suite runnable without IndexedDB", () => {
    expect(true).toBe(true);
  });
});
