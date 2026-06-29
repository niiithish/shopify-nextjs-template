import type { CSSProperties } from "react";
import { isTransparentBackground } from "@/lib/presswall-preview-colors";

export function getMarqueeFadeColor(backgroundColor: string): string {
  if (isTransparentBackground(backgroundColor)) {
    return "#ffffff";
  }

  return backgroundColor;
}

export function getMarqueeScrollStyle(backgroundColor: string): CSSProperties {
  return {
    ["--pw-mq-fade" as string]: getMarqueeFadeColor(backgroundColor),
  };
}
