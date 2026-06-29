"use client";

import { useEffect, useState } from "react";
import { getPresswallAppNavLinks } from "@/lib/presswall-app-nav-contract";
import { getPresswallNavPaths } from "@/lib/presswall-nav-paths";

export function PresswallAppNav() {
  const [paths, setPaths] = useState(() => getPresswallNavPaths());

  useEffect(() => {
    setPaths(getPresswallNavPaths());
  }, []);

  const [homeLink, editorLink] = getPresswallAppNavLinks(paths);

  return (
    <div aria-hidden="true" className="presswall-app-nav-host">
      <s-app-nav>
        <s-link href={homeLink.href} rel={homeLink.rel}>
          {homeLink.label}
        </s-link>
        <s-link href={editorLink.href}>{editorLink.label}</s-link>
      </s-app-nav>
    </div>
  );
}
