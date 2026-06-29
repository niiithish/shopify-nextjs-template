import { describe, expect, test } from "bun:test";
import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";
import {
  deriveHeadingSpacing,
  deriveLogoGap,
  withDerivedSpacing,
} from "@/lib/presswall-spacing";

describe("deriveLogoGap", () => {
  test("derives bar spacing from logo height", () => {
    expect(deriveLogoGap(32, "bar")).toBe(36);
    expect(deriveLogoGap(28, "bar")).toBe(32);
  });

  test("uses tighter spacing for grid layouts", () => {
    expect(deriveLogoGap(32, "grid")).toBe(28);
  });
});

describe("deriveHeadingSpacing", () => {
  test("derives heading spacing from font size", () => {
    expect(deriveHeadingSpacing(16)).toBe(26);
    expect(deriveHeadingSpacing(16)).toBe(26);
  });
});

describe("withDerivedSpacing", () => {
  test("fills spacing fields from typography and layout", () => {
    const config = withDerivedSpacing({
      ...DEFAULT_PRESSWALL_CONFIG,
      layout: "grid",
      logoHeight: 32,
      headingFontSize: 16,
      gap: 10,
      headingSpacing: 8,
    });

    expect(config.gap).toBe(28);
    expect(config.headingSpacing).toBe(26);
  });
});
