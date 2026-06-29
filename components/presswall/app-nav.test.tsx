import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, waitFor } from "@testing-library/react";
import { assertPresswallAppNavContract } from "@/lib/presswall-app-nav-contract";
import { PresswallAppNav } from "./app-nav";

function mountGlobalStyles() {
  const styleId = "presswall-test-globals";
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = readFileSync(
    join(import.meta.dir, "../../app/globals.css"),
    "utf8"
  );
  document.head.append(style);
}

describe("PresswallAppNav", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders App Bridge nav contract Shopify admin discovers automatically", async () => {
    mountGlobalStyles();

    window.location.href =
      "http://localhost:3000/?shop=test.myshopify.com&host=abc&id_token=secret";

    const view = render(<PresswallAppNav />);

    await waitFor(() => {
      assertPresswallAppNavContract(view.container, {
        home: "/?shop=test.myshopify.com&host=abc",
        editor: "/editor?shop=test.myshopify.com&host=abc",
      });
    });

    const host = view.container.querySelector(
      ".presswall-app-nav-host"
    ) as HTMLElement;
    expect(window.getComputedStyle(host).display).toBe("none");
  });
});
