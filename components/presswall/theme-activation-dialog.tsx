"use client";

import {
  IconExternalLink,
  IconLayoutGrid,
  IconPlug,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminFetch } from "@/lib/admin-fetch";
import type { ThemeActivationStatus } from "@/lib/theme-activation";

interface ThemeActivationDialogProps {
  isDirty?: boolean;
  trigger: React.ReactElement;
}

function ThemeActivationActions({
  isDirty,
  status,
}: {
  isDirty: boolean;
  status: ThemeActivationStatus;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        className="justify-start"
        disabled={isDirty}
        onClick={() => {
          window.open(status.activateEmbedUrl, "_top");
        }}
      >
        <IconPlug stroke={2} />
        Enable app embed
        <IconExternalLink className="ml-auto size-3.5 opacity-60" stroke={2} />
      </Button>
      <Button
        className="justify-start"
        disabled={isDirty}
        onClick={() => {
          window.open(status.activateSectionUrl, "_top");
        }}
        variant="outline"
      >
        <IconLayoutGrid stroke={2} />
        Add section block
        <IconExternalLink className="ml-auto size-3.5 opacity-60" stroke={2} />
      </Button>
    </div>
  );
}

function ThemeActivationBody({
  isDirty,
  isLoading,
  status,
}: {
  isDirty: boolean;
  isLoading: boolean;
  status: ThemeActivationStatus | null;
}) {
  if (isLoading) {
    return (
      <p className="text-muted-foreground text-xs">Checking theme status…</p>
    );
  }

  if (!status) {
    return (
      <p className="text-muted-foreground text-xs">
        Could not load theme settings. Try again from Shopify admin.
      </p>
    );
  }

  return <ThemeActivationActions isDirty={isDirty} status={status} />;
}

export function ThemeActivationDialog({
  isDirty = false,
  trigger,
}: ThemeActivationDialogProps) {
  const [status, setStatus] = useState<ThemeActivationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await adminFetch("/api/theme-activation");
      if (!response.ok) {
        setStatus(null);
        return;
      }

      const data = (await response.json()) as ThemeActivationStatus;
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadStatus().catch(() => undefined);
    }
  }, [loadStatus, open]);

  if (status?.isActive) {
    return null;
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to your Shopify theme</DialogTitle>
          <DialogDescription>
            {isDirty
              ? "Save your changes first, then choose how Presswall appears on your store."
              : "Enable the app embed for site-wide display, or add a section block to a specific page."}
          </DialogDescription>
        </DialogHeader>

        <ThemeActivationBody
          isDirty={isDirty}
          isLoading={isLoading}
          status={status}
        />
      </DialogContent>
    </Dialog>
  );
}
