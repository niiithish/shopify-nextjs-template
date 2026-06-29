import { describe, expect, test } from "bun:test";
import { buildAdminPath, getAdminSearchParams } from "@/lib/admin-path";

describe("getAdminSearchParams", () => {
  test("removes id_token from forwarded admin query params", () => {
    const params = getAdminSearchParams(
      "?shop=test.myshopify.com&host=abc&id_token=secret&embedded=1"
    );

    expect(params.get("shop")).toBe("test.myshopify.com");
    expect(params.get("host")).toBe("abc");
    expect(params.get("embedded")).toBe("1");
    expect(params.has("id_token")).toBe(false);
  });
});

describe("buildAdminPath", () => {
  test("preserves shop and host when building editor links", () => {
    expect(
      buildAdminPath(
        "/editor",
        "?shop=test.myshopify.com&host=abc&id_token=secret"
      )
    ).toBe("/editor?shop=test.myshopify.com&host=abc");
  });

  test("returns pathname only when no query params remain", () => {
    expect(buildAdminPath("/", "?id_token=secret")).toBe("/");
  });
});
