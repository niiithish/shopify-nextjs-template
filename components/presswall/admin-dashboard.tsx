"use client";

import { EditorWorkspace } from "@/components/presswall/editor-workspace";
import { ThemeActivationBanner } from "@/components/presswall/theme-activation-banner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePresswallEditor } from "@/hooks/use-presswall-editor";

export function AdminDashboard() {
  const editor = usePresswallEditor();

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <ThemeActivationBanner variant="compact" />

      {editor.unavailableCount > 0 ? (
        <Alert className="shrink-0 rounded-none border-x-0 border-t-0 py-2">
          <AlertTitle className="text-sm">
            Some outlets are no longer available
          </AlertTitle>
          <AlertDescription className="text-xs">
            {editor.unavailableCount} previously selected outlet
            {editor.unavailableCount === 1 ? "" : "s"} will not show on your
            storefront. Remove them or save to update.
          </AlertDescription>
        </Alert>
      ) : null}

      <EditorWorkspace editor={editor} />
    </div>
  );
}
