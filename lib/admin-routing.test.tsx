import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { createPresswallEditorFixture } from "@/lib/test-fixtures/presswall-editor-fixture";

const repoRoot = join(import.meta.dir, "..");

function readSource(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("embedded app bridge setup", () => {
  test("root layout loads unified app bridge script and api key metadata", () => {
    const layout = readSource("app/layout.tsx");

    expect(layout).toContain("cdn.shopify.com/shopifycloud/app-bridge.js");
    expect(layout).toContain("beforeInteractive");
    expect(layout).toContain("shopify-api-key");
  });
});

describe("admin routing structure", () => {
  test("root dashboard renders merchant overview instead of editor workspace", async () => {
    const { AdminDashboardView } = await import(
      "@/components/presswall/admin-dashboard"
    );

    const view = render(
      <AdminDashboardView
        editor={createPresswallEditorFixture({ needsOnboarding: false })}
      />
    );

    expect(view.getByText("Quick actions")).toBeTruthy();
    expect(view.getByText("Storefront preview")).toBeTruthy();
    expect(view.queryByText("Discard")).toBeNull();
    expect(view.queryByText("Templates")).toBeNull();
  });
});

describe("editor sub-page", () => {
  test("dedicated route mounts full editor workspace", () => {
    const editorView = readSource("components/presswall/editor-view.tsx");
    const editorPage = readSource("app/editor/page.tsx");

    expect(editorView).toContain("EditorWorkspace");
    expect(editorView).toContain("usePresswallEditor");
    expect(editorPage).toContain("hasEmbeddedEntryParams");
    expect(editorPage).toContain("EditorView");
  });
});
