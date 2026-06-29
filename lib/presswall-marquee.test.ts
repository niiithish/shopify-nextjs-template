import { describe, expect, test } from "bun:test";
import { getMarqueeRepeatCount } from "@/lib/presswall-marquee";

describe("getMarqueeRepeatCount", () => {
  test("returns at least two segments for seamless looping", () => {
    expect(getMarqueeRepeatCount(12)).toBe(2);
  });

  test("repeats more when few logos are selected", () => {
    expect(getMarqueeRepeatCount(1)).toBe(8);
    expect(getMarqueeRepeatCount(3)).toBe(6);
    expect(getMarqueeRepeatCount(6)).toBe(3);
  });
});
