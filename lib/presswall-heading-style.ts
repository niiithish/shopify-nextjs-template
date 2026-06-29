import type { CSSProperties } from "react";
import { scaleSpacingForPreview } from "@/lib/presswall-spacing";
import type { PresswallConfig } from "@/lib/presswall-types";

interface HeadingMetricsOptions {
  compact?: boolean;
}

export function getHeadingMetrics(
  config: Pick<PresswallConfig, "headingFontSize" | "headingSpacing">,
  options: HeadingMetricsOptions = {}
): { fontSize: number; marginBottom: number } {
  if (options.compact) {
    const fontSize = Math.min(config.headingFontSize, 8);

    return {
      fontSize,
      marginBottom: scaleSpacingForPreview(
        config.headingSpacing,
        config.headingFontSize,
        fontSize
      ),
    };
  }

  return {
    fontSize: config.headingFontSize,
    marginBottom: config.headingSpacing,
  };
}

export function getHeadingStyle(
  config: Pick<
    PresswallConfig,
    "headingFontSize" | "headingSpacing" | "textColor"
  >,
  options: HeadingMetricsOptions = {}
): CSSProperties {
  const metrics = getHeadingMetrics(config, options);

  return {
    color: config.textColor,
    fontSize: `${metrics.fontSize}px`,
    marginBottom: `${metrics.marginBottom}px`,
  };
}
