"use client";

import {
  MarqueeLayout,
  MarqueeTrack,
} from "@/components/presswall/marquee-layout";
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
import {
  getMarqueeRepeatCount,
  getMarqueeTrackStyle,
} from "@/lib/presswall-marquee";
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

/** ~25% smaller than the previous template thumbnail caps. */
const TEMPLATE_THUMBNAIL_LOGO_HEIGHT_CAP = 12;
const TEMPLATE_THUMBNAIL_LOGO_MAX_WIDTH = 42;
const TEMPLATE_THUMBNAIL_PADDING_CAP = 9;

function PreviewLogos({
  backgroundColor,
  config,
  gap,
  items,
  logosPerRow,
  renderLogo,
  textColor,
}: {
  backgroundColor: string;
  config: PresswallConfig;
  gap: number;
  items: ReturnType<typeof resolveStorefrontPublishers>;
  logosPerRow: number;
  renderLogo: (item: StorefrontPublisher) => React.ReactNode;
  textColor: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center text-[10px] text-muted-foreground/70">
        Select outlets to preview
      </div>
    );
  }

  if (config.layout === "marquee") {
    const segments = getMarqueeRepeatCount(items.length);
    const marqueeItems = Array.from({ length: segments }, (_, segment) =>
      items.map((item) => ({ item, suffix: String(segment) }))
    ).flat();

    return (
      <MarqueeLayout
        backgroundColor={backgroundColor}
        config={config}
        textColor={textColor}
      >
        <MarqueeTrack
          style={getMarqueeTrackStyle(segments, gap, config.marqueeSpeed)}
        >
          {marqueeItems.map(({ item, suffix }) => (
            <div className="pw-mq-item shrink-0" key={`${item.id}-${suffix}`}>
              {renderLogo(item)}
            </div>
          ))}
        </MarqueeTrack>
      </MarqueeLayout>
    );
  }

  const rowItems = items.slice(0, logosPerRow * 2);

  if (config.layout === "grid") {
    return (
      <div
        className={getLogosRowGridClassName(config.logoAlignment)}
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
      className={getLogosRowGridClassName(config.logoAlignment)}
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
  const isTemplateThumbnail = scale === "sm";

  const viewport = deviceMode ?? "desktop";
  const logosPerRow = getLogosPerRow(config, viewport);
  const logoHeight = isLivePreview
    ? config.logoHeight
    : Math.min(
        config.logoHeight,
        isTemplateThumbnail ? TEMPLATE_THUMBNAIL_LOGO_HEIGHT_CAP : 16
      );
  const gap = isLivePreview
    ? config.gap
    : scaleSpacingForPreview(config.gap, config.logoHeight, logoHeight);
  const paddingY = isLivePreview
    ? config.paddingY
    : Math.min(
        config.paddingY,
        isTemplateThumbnail ? TEMPLATE_THUMBNAIL_PADDING_CAP : 12
      );
  const paddingX = isLivePreview
    ? config.paddingX
    : Math.min(
        config.paddingX,
        isTemplateThumbnail ? TEMPLATE_THUMBNAIL_PADDING_CAP : 12
      );

  let logoMaxWidth = 56;
  if (isLivePreview) {
    logoMaxWidth = 200;
  } else if (isTemplateThumbnail) {
    logoMaxWidth = TEMPLATE_THUMBNAIL_LOGO_MAX_WIDTH;
  }

  const renderLogo = (item: StorefrontPublisher) => (
    <PublisherLogo
      customLogoSvg={item.isCustom ? item.logoSvg || undefined : undefined}
      key={item.id}
      logoImageUrl={item.logoImageUrl}
      name={item.name}
      publisherId={item.isCustom ? undefined : item.id}
      style={getLogoSlotStyle(logoHeight, logoMaxWidth, logoStyle)}
    />
  );

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
      {config.showHeading &&
      config.headingText &&
      config.layout !== "marquee" ? (
        <p
          className={cn(
            "m-0 font-medium uppercase tracking-[0.28em]",
            headingAlignmentClass[config.headingAlignment]
          )}
          style={getHeadingStyle(
            {
              ...config,
              textColor: previewColors.textColor,
            },
            {
              compact: !isLivePreview,
              compactFontSizeCap: isTemplateThumbnail ? 6 : 8,
            }
          )}
        >
          {config.headingText}
        </p>
      ) : null}

      <PreviewLogos
        backgroundColor={previewColors.backgroundColor}
        config={config}
        gap={gap}
        items={items}
        logosPerRow={logosPerRow}
        renderLogo={renderLogo}
        textColor={previewColors.textColor}
      />
    </div>
  );
}
