export function EditorShellSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading editor"
      className="flex h-svh flex-col overflow-hidden bg-background"
      role="status"
    >
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="presswall-canvas-bg flex min-w-0 flex-1 items-center justify-center p-6">
          <div className="h-32 w-full max-w-3xl animate-pulse rounded-xl border bg-background/60" />
        </div>

        <div className="w-80 shrink-0 border-l bg-card xl:w-96">
          <div className="space-y-3 border-b p-3">
            <div className="h-8 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="space-y-3 p-3">
            <div className="h-8 animate-pulse rounded-md bg-muted" />
            <div className="h-56 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-24 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-10 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
