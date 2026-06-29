"use client";

import { IconEye } from "@tabler/icons-react";
import { useState } from "react";
import { PresswallStrip } from "@/components/presswall/strip-content";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { usePresswallStripItems } from "@/hooks/use-presswall-strip-items";
import { getLogosPerRow } from "@/lib/presswall-layout-style";
import { getLogoImageStyle } from "@/lib/presswall-logo-style";
import { getPreviewColors } from "@/lib/presswall-preview-colors";
import type {
  PresswallConfig,
  PublisherCatalogItem,
  ShopPublisherSelection,
} from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

interface PreviewProps {
  catalog: PublisherCatalogItem[];
  config: PresswallConfig;
  isLoading?: boolean;
  selections: ShopPublisherSelection[];
  variant?: "default" | "canvas";
}

const previewEmptyState = (
  <Empty className="border-0 p-4">
    <EmptyHeader>
      <EmptyTitle>No outlets selected</EmptyTitle>
      <EmptyDescription>
        Pick outlets from the library to preview your presswall.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);

export function PresswallPreview({
  config,
  catalog,
  selections,
  variant = "default",
  isLoading = false,
}: PreviewProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";
  const previewColors = getPreviewColors(config, isDark);
  const logoStyle = getLogoImageStyle(config, { previewIsDark: isDark });
  const isCanvas = variant === "canvas";

  const { items, renderLogo } = usePresswallStripItems({
    catalog,
    logoHeight: config.logoHeight,
    logoMaxWidth: 200,
    logoStyle,
    selections,
  });

  const containerStyle = {
    backgroundColor: previewColors.backgroundColor,
    color: previewColors.textColor,
    borderRadius: `${config.borderRadius}px`,
    padding: `${config.paddingY}px ${config.paddingX}px`,
  } satisfies React.CSSProperties;

  const themeToggle = (
    <div className="flex gap-1 rounded-lg border bg-background/90 p-0.5 shadow-sm backdrop-blur">
      <Button
        onClick={() => setTheme("light")}
        size="sm"
        variant={theme === "light" ? "secondary" : "ghost"}
      >
        Light
      </Button>
      <Button
        onClick={() => setTheme("dark")}
        size="sm"
        variant={theme === "dark" ? "secondary" : "ghost"}
      >
        Dark
      </Button>
    </div>
  );

  const previewBody = (
    <div
      className={cn(
        "w-full rounded-xl border shadow-sm",
        isDark ? "border-white/10" : "border-black/10",
        isCanvas ? "max-w-3xl" : "min-h-32"
      )}
      style={containerStyle}
    >
      <PresswallStrip
        backgroundColor={previewColors.backgroundColor}
        config={config}
        emptyState={previewEmptyState}
        items={items}
        logosPerRow={getLogosPerRow(config, "desktop")}
        renderLogo={renderLogo}
        textColor={previewColors.textColor}
      />
    </div>
  );

  if (isCanvas) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="absolute top-3 right-3 z-10">{themeToggle}</div>

        <div
          className={cn(
            "presswall-canvas-bg flex min-h-0 flex-1 items-center justify-center overflow-auto p-6",
            isDark && "presswall-canvas-bg-dark"
          )}
        >
          {isLoading ? (
            <div className="h-32 w-full max-w-3xl animate-pulse rounded-xl border bg-background/60" />
          ) : (
            previewBody
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconEye className="text-muted-foreground" stroke={2} />
          <div>
            <p className="font-medium text-sm">Live preview</p>
            <p className="text-muted-foreground text-xs">
              How your presswall will look on the storefront
            </p>
          </div>
        </div>
        {themeToggle}
      </div>

      {previewBody}
    </div>
  );
}
