import type { CSSProperties } from "react";
import { scaleSpacingForPreview } from "@/lib/presswall-spacing";
import type {
  PresswallAlignment,
  PresswallConfig,
} from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

interface HeadingMetricsOptions {
  compact?: boolean;
  compactFontSizeCap?: number;
}

const headingAlignmentClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function getHeadingAlignmentClass(
  alignment: PresswallAlignment
): string {
  return headingAlignmentClass[alignment];
}

export function getHeadingMetrics(
  config: Pick<PresswallConfig, "headingFontSize" | "headingSpacing">,
  options: HeadingMetricsOptions = {}
): { fontSize: number; marginBottom: number } {
  if (options.compact) {
    const fontSize = Math.min(
      config.headingFontSize,
      options.compactFontSizeCap ?? 8
    );

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

export function getHeadingClassName(alignment: PresswallAlignment): string {
  return cn(
    "m-0 font-medium uppercase tracking-[0.28em]",
    getHeadingAlignmentClass(alignment)
  );
}
