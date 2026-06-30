"use client";

import { useCallback, useState } from "react";
import { navigateAdminPath } from "@/lib/admin-navigation";

export function useAdminNavigation() {
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback(async (pathname: string) => {
    setIsNavigating(true);

    try {
      await navigateAdminPath(pathname);
    } catch {
      setIsNavigating(false);
    }
  }, []);

  return { isNavigating, navigate };
}
