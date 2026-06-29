"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import type { ThemeActivationStatus } from "@/lib/theme-activation";

const DISMISS_KEY = "presswall-theme-activation-dismissed";

interface UseThemeActivationStatusOptions {
  enabled?: boolean;
}

export function useThemeActivationStatus(
  options: UseThemeActivationStatusOptions = {}
) {
  const enabled = options.enabled ?? true;
  const [status, setStatus] = useState<ThemeActivationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isDismissed, setIsDismissed] = useState(false);

  const loadStatus = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminFetch("/api/theme-activation");
      if (!response.ok) {
        setStatus(null);
        return;
      }

      const data = (await response.json()) as ThemeActivationStatus;
      setStatus(data);

      if (data.isActive) {
        sessionStorage.removeItem(DISMISS_KEY);
        setIsDismissed(false);
      }
    } catch {
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setIsDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    loadStatus().catch(() => undefined);
  }, [enabled, loadStatus]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const refreshStatus = () => {
      if (document.visibilityState === "visible") {
        loadStatus().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", refreshStatus);
    window.addEventListener("focus", refreshStatus);

    return () => {
      document.removeEventListener("visibilitychange", refreshStatus);
      window.removeEventListener("focus", refreshStatus);
    };
  }, [enabled, loadStatus]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setIsDismissed(true);
  }, []);

  return {
    dismiss,
    isDismissed,
    isLoading,
    reload: loadStatus,
    status,
  };
}
