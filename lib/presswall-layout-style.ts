import type {
  PresswallAlignment,
  PresswallConfig,
} from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

const logoRowAlignmentClass = {
  left: "justify-items-start",
  center: "justify-items-center",
  right: "justify-items-end",
} as const;

const marqueeAlignmentClass = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} as const;

export type PresswallViewport = "desktop" | "mobile";

export function getLogosPerRow(
  config: Pick<PresswallConfig, "logosPerRowDesktop" | "logosPerRowMobile">,
  viewport: PresswallViewport = "desktop"
): number {
  return viewport === "mobile"
    ? config.logosPerRowMobile
    : config.logosPerRowDesktop;
}

export function getLogosRowGridStyle(
  logosPerRow: number,
  gap: number
): React.CSSProperties {
  return {
    gap: `${gap}px`,
    gridTemplateColumns: `repeat(${logosPerRow}, minmax(0, 1fr))`,
    width: "100%",
  };
}

export function getLogosRowGridClassName(
  alignment: PresswallAlignment
): string {
  return cn("presswall-logo-row grid", logoRowAlignmentClass[alignment]);
}

export function getMarqueeAlignmentClassName(
  alignment: PresswallAlignment
): string {
  return marqueeAlignmentClass[alignment];
}
