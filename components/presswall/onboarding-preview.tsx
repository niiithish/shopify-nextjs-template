"use client";

import { PublisherLogo } from "@/components/presswall/publisher-logo";
import { getHeadingStyle } from "@/lib/presswall-heading-style";
import {
  getLogosPerRow,
  getLogosRowGridClassName,
  getLogosRowGridStyle,
  type PresswallViewport,
} from "@/lib/presswall-layout-style";
import {
  getLogoImageStyle,
  getLogoSlotStyle,
} from "@/lib/presswall-logo-style";
import { getPreviewColors } from "@/lib/presswall-preview-colors";
import { scaleSpacingForPreview } from "@/lib/presswall-spacing";
import type {
  PresswallConfig,
  PublisherCatalogItem,
  ShopPublisherSelection,
  StorefrontPublisher,
} from "@/lib/presswall-types";
import { resolveStorefrontPublishers } from "@/lib/resolve-storefront-publishers";
import { cn } from "@/lib/utils";

interface OnboardingPreviewProps {
  catalog: PublisherCatalogItem[];
  className?: string;
  config: PresswallConfig;
  deviceMode?: PresswallViewport;
  previewTheme?: "light" | "dark";
  scale?: "sm" | "md" | "lg";
  selections: ShopPublisherSelection[];
}

const headingAlignmentClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

function PreviewLogos({
  config,
  gap,
  items,
  logosPerRow,
  renderLogo,
}: {
  config: PresswallConfig;
  gap: number;
  items: ReturnType<typeof resolveStorefrontPublishers>;
  logosPerRow: number;
  renderLogo: (item: StorefrontPublisher) => React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center text-[10px] text-muted-foreground/70">
        Select outlets to preview
      </div>
    );
  }

  if (config.layout === "marquee") {
    return (
      <div className="overflow-hidden">
        <div
          className="presswall-marquee flex w-max items-center"
          style={{
            gap: `${gap}px`,
            animationDuration: `${config.marqueeSpeed}s`,
          }}
        >
          {items
            .map((item) => ({ item, suffix: "a" as string }))
            .concat(items.map((item) => ({ item, suffix: "b" as string })))
            .map(({ item, suffix }) => (
              <div key={`${item.id}-${suffix}`}>{renderLogo(item)}</div>
            ))}
        </div>
      </div>
    );
  }

  const rowItems = items.slice(0, logosPerRow * 2);

  if (config.layout === "grid") {
    return (
      <div
        className={getLogosRowGridClassName(config.alignment)}
        style={getLogosRowGridStyle(logosPerRow, gap)}
      >
        {rowItems.map((item) => (
          <div className="flex min-w-0 items-center" key={item.id}>
            {renderLogo(item)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={getLogosRowGridClassName(config.alignment)}
      style={getLogosRowGridStyle(logosPerRow, gap)}
    >
      {rowItems.map((item) => (
        <div className="flex min-w-0 items-center" key={item.id}>
          {renderLogo(item)}
        </div>
      ))}
    </div>
  );
}

export function OnboardingPreview({
  catalog,
  config,
  selections,
  className,
  deviceMode,
  scale = "md",
  previewTheme = "light",
}: OnboardingPreviewProps) {
  const items = resolveStorefrontPublishers(config, catalog, selections);
  const isDark = previewTheme === "dark";
  const previewColors = getPreviewColors(config, isDark);
  const logoStyle = getLogoImageStyle(config, { previewIsDark: isDark });
  const isLivePreview = scale === "lg" && deviceMode !== undefined;

  const viewport = deviceMode ?? "desktop";
  const logosPerRow = getLogosPerRow(config, viewport);
  const logoHeight = isLivePreview
    ? config.logoHeight
    : Math.min(config.logoHeight, 16);
  const gap = isLivePreview
    ? config.gap
    : scaleSpacingForPreview(config.gap, config.logoHeight, logoHeight);
  const paddingY = isLivePreview
    ? config.paddingY
    : Math.min(config.paddingY, 12);
  const paddingX = isLivePreview
    ? config.paddingX
    : Math.min(config.paddingX, 12);

  const renderLogo = (item: StorefrontPublisher) => {
    const maxWidth = isLivePreview ? 200 : 56;

    return (
      <PublisherLogo
        customLogoSvg={item.isCustom ? item.logoSvg || undefined : undefined}
        key={item.id}
        logoImageUrl={item.logoImageUrl}
        name={item.name}
        publisherId={item.isCustom ? undefined : item.id}
        style={getLogoSlotStyle(logoHeight, maxWidth, logoStyle)}
      />
    );
  };

  return (
    <div
      className={cn("w-full overflow-hidden rounded-xl border", className)}
      style={{
        backgroundColor: previewColors.backgroundColor,
        color: previewColors.textColor,
        borderRadius: `${config.borderRadius}px`,
        padding: `${paddingY}px ${paddingX}px`,
      }}
    >
      {config.showHeading && config.headingText ? (
        <p
          className={cn(
            "m-0 font-medium uppercase tracking-[0.28em]",
            headingAlignmentClass[config.alignment]
          )}
          style={getHeadingStyle(
            {
              ...config,
              textColor: previewColors.textColor,
            },
            { compact: !isLivePreview }
          )}
        >
          {config.headingText}
        </p>
      ) : null}

      <PreviewLogos
        config={config}
        gap={gap}
        items={items}
        logosPerRow={logosPerRow}
        renderLogo={renderLogo}
      />
    </div>
  );
}
