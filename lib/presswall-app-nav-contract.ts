/**
 * Shopify App Home discovers `<s-app-nav>` automatically when App Bridge loads
 * (see shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav).
 * Use native `<a>` children with static app-relative hrefs for Next.js apps.
 * App Bridge preserves embedded context on navigation; avoid window.search in hrefs.
 */
export interface PresswallNavPaths {
  editor: string;
  home: string;
}

export interface PresswallAppNavLinkSpec {
  href: string;
  label: string;
}

export function getPresswallAppNavLinks(
  paths: PresswallNavPaths
): PresswallAppNavLinkSpec[] {
  return [
    { href: paths.home, label: "Home" },
    { href: paths.editor, label: "Editor" },
  ];
}

export function assertPresswallAppNavContract(
  root: ParentNode,
  paths: PresswallNavPaths
): void {
  const host = root.querySelector(".presswall-app-nav-host");
  if (!host) {
    throw new Error("Expected .presswall-app-nav-host wrapper");
  }

  if (host.getAttribute("aria-hidden") !== "true") {
    throw new Error("Nav host must be aria-hidden so Shopify owns sidebar UX");
  }

  const appNav = host.querySelector("s-app-nav");
  if (!appNav) {
    throw new Error("Expected <s-app-nav> inside nav host");
  }

  const links = [...host.querySelectorAll("s-app-nav a[href]")];
  if (links.length !== 2) {
    throw new Error("Expected exactly Home + Editor sidebar links");
  }

  const homeLink = links.find((link) => link.textContent?.trim() === "Home");
  if (!homeLink) {
    throw new Error("Expected visible Home sub-page link");
  }

  if (homeLink.getAttribute("href") !== paths.home) {
    throw new Error(`Home href mismatch: ${homeLink.getAttribute("href")}`);
  }

  if (homeLink.getAttribute("rel") === "home") {
    throw new Error(
      "Home must be a visible sidebar item — do not set rel=home"
    );
  }

  const editorLink = links.find(
    (link) => link.textContent?.trim() === "Editor"
  );
  if (!editorLink) {
    throw new Error("Expected visible Editor sub-page link");
  }

  if (editorLink.getAttribute("href") !== paths.editor) {
    throw new Error(`Editor href mismatch: ${editorLink.getAttribute("href")}`);
  }

  for (const link of links) {
    const href = link.getAttribute("href");
    if (!href?.startsWith("/")) {
      throw new Error(`Nav href must be app-relative: ${href}`);
    }
  }
}
