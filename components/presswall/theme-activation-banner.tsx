"use client";

import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { useContext } from "react";
import {
  ThemeActivationContext,
  type ThemeActivationContextValue,
} from "@/components/presswall/theme-activation-provider";
import { Button } from "@/components/ui/button";
import { useThemeActivationStatus } from "@/hooks/use-theme-activation-status";
import { cn } from "@/lib/utils";

interface ThemeActivationBannerProps {
  className?: string;
  variant?: "default" | "compact";
}

export function ThemeActivationBanner({
  className,
  variant = "default",
}: ThemeActivationBannerProps) {
  const shared = useContext(ThemeActivationContext);
  const local = useThemeActivationStatus({ enabled: shared === null });
  const activation = shared ?? local;

  return (
    <ThemeActivationBannerContent
      activation={activation}
      className={className}
      variant={variant}
    />
  );
}

function ThemeActivationBannerContent({
  activation,
  className,
  variant,
}: {
  activation: ThemeActivationContextValue;
  className?: string;
  variant: "default" | "compact";
}) {
  const { dismiss, isDismissed, isLoading, status } = activation;

  if (isLoading || isDismissed || !status || status.isActive) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-between gap-3 border-amber-200/80 border-b bg-amber-50 px-4 py-2 text-amber-950",
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <IconAlertTriangle className="size-4 shrink-0" stroke={2} />
          <p className="truncate text-xs sm:text-sm">
            Enable the Presswall app embed to show logos on your storefront.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            onClick={() => {
              window.open(
                status.activateEmbedUrl,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            size="sm"
            variant="outline"
          >
            Activate
          </Button>
          <button
            aria-label="Dismiss activation reminder"
            className="rounded-md p-1 text-amber-950/70 transition-colors hover:bg-amber-100 hover:text-amber-950"
            onClick={dismiss}
            type="button"
          >
            <IconX className="size-4" stroke={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-amber-200/80 bg-card shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 bg-amber-400 px-4 py-3 text-amber-950">
        <div className="flex items-center gap-2">
          <IconAlertTriangle className="size-5 shrink-0" stroke={2} />
          <p className="font-semibold text-sm">
            Activate Presswall on your store
          </p>
        </div>
        <button
          aria-label="Dismiss activation reminder"
          className="rounded-md p-1 text-amber-950/80 transition-colors hover:bg-amber-500/30 hover:text-amber-950"
          onClick={dismiss}
          type="button"
        >
          <IconX className="size-4" stroke={2} />
        </button>
      </div>

      <div className="space-y-4 px-4 py-4">
        <p className="text-sm leading-relaxed">
          Enable the Presswall app embed so your &ldquo;as seen on&rdquo; logos
          appear on your storefront. After enabling, save your theme changes in
          the editor.
        </p>

        <Button
          onClick={() => {
            window.open(
              status.activateEmbedUrl,
              "_blank",
              "noopener,noreferrer"
            );
          }}
        >
          Activate now
        </Button>
      </div>
    </div>
  );
}
