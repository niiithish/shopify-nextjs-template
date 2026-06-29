"use client";

import { createContext, type ReactNode } from "react";
import { useThemeActivationStatus } from "@/hooks/use-theme-activation-status";

export type ThemeActivationContextValue = ReturnType<
  typeof useThemeActivationStatus
>;

export const ThemeActivationContext =
  createContext<ThemeActivationContextValue | null>(null);

export function ThemeActivationProvider({ children }: { children: ReactNode }) {
  const value = useThemeActivationStatus();

  return (
    <ThemeActivationContext.Provider value={value}>
      {children}
    </ThemeActivationContext.Provider>
  );
}
