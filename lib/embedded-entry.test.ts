import { describe, expect, test } from "bun:test";
import { hasEmbeddedEntryParams } from "@/lib/embedded-entry";

describe("hasEmbeddedEntryParams", () => {
  test("accepts shop query param", () => {
    expect(hasEmbeddedEntryParams({ shop: "test.myshopify.com" })).toBe(true);
  });

  test("accepts host query param without shop", () => {
    expect(hasEmbeddedEntryParams({ host: "encoded-host" })).toBe(true);
  });

  test("rejects bare entry with no shop or host", () => {
    expect(hasEmbeddedEntryParams({})).toBe(false);
    expect(hasEmbeddedEntryParams({ embedded: "1" })).toBe(false);
  });
});
