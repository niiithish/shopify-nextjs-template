import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorPanelProps {
  children: ReactNode;
  className?: string;
}

export function EditorPanel({ children, className }: EditorPanelProps) {
  return (
    <aside
      className={cn(
        "flex min-h-0 w-80 shrink-0 flex-col border-l bg-card xl:w-96",
        className
      )}
    >
      {children}
    </aside>
  );
}
