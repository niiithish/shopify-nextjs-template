import type { PresswallConfig } from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

const rowAlignmentClass = {
  left: "justify-items-start",
  center: "justify-items-center",
  right: "justify-items-end",
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
  alignment: PresswallConfig["alignment"]
): string {
  return cn("presswall-logo-row grid", rowAlignmentClass[alignment]);
}
