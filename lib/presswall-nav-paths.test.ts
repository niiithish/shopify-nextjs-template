import { describe, expect, test } from "bun:test";
import { getPresswallNavPaths } from "@/lib/presswall-nav-paths";

describe("getPresswallNavPaths", () => {
  test("forwards shop and host into sidebar link targets", () => {
    const paths = getPresswallNavPaths(
      "?shop=test.myshopify.com&host=abc&id_token=secret"
    );

    expect(paths.home).toBe("/?shop=test.myshopify.com&host=abc");
    expect(paths.editor).toBe("/editor?shop=test.myshopify.com&host=abc");
  });
});
