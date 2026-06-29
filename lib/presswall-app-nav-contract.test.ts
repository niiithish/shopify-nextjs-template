import { describe, expect, test } from "bun:test";
import {
  assertPresswallAppNavContract,
  getPresswallAppNavLinks,
} from "@/lib/presswall-app-nav-contract";

describe("presswall app nav contract", () => {
  test("declares Home override plus Editor sub-page per Shopify app-nav docs", () => {
    const paths = {
      home: "/?shop=test.myshopify.com",
      editor: "/editor?shop=test.myshopify.com",
    };

    expect(getPresswallAppNavLinks(paths)).toEqual([
      { href: paths.home, label: "Home", rel: "home" },
      { href: paths.editor, label: "Editor" },
    ]);
  });

  test("assertPresswallAppNavContract validates bridge-discoverable nav DOM", () => {
    const previousHtml = document.body.innerHTML;
    document.body.innerHTML = `
      <div aria-hidden="true" class="presswall-app-nav-host">
        <s-app-nav>
          <s-link href="/?shop=test.myshopify.com" rel="home">Home</s-link>
          <s-link href="/editor?shop=test.myshopify.com">Editor</s-link>
        </s-app-nav>
      </div>
    `;

    try {
      expect(() =>
        assertPresswallAppNavContract(document.body, {
          home: "/?shop=test.myshopify.com",
          editor: "/editor?shop=test.myshopify.com",
        })
      ).not.toThrow();
    } finally {
      document.body.innerHTML = previousHtml;
    }
  });
});
