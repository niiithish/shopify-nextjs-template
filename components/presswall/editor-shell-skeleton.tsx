import { SkeletonBlock } from "@/components/presswall/skeleton-block";

export function EditorShellSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading editor"
      className="flex h-svh flex-col overflow-hidden bg-background"
      role="status"
    >
      <SkeletonBlock className="h-9 shrink-0 rounded-none bg-muted/30" />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 pb-6 sm:px-6">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3">
          <div className="flex min-h-0 flex-1 gap-4">
            <div className="flex min-h-0 min-w-0 flex-[3] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-8 w-24 rounded-md" />
              </div>
              <SkeletonBlock className="m-4 min-h-0 flex-1 rounded-lg" />
            </div>

            <div className="flex min-h-0 min-w-0 flex-[2] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="shrink-0 border-b p-3">
                <SkeletonBlock className="h-9 w-full rounded-md" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
                <SkeletonBlock className="h-8 w-full rounded-md" />
                <SkeletonBlock className="h-8 w-full rounded-md" />
                <SkeletonBlock className="h-8 w-4/5 rounded-md" />
                <SkeletonBlock className="h-8 w-full rounded-md" />
                <SkeletonBlock className="h-8 w-3/4 rounded-md" />
              </div>
              <div className="flex shrink-0 gap-2 border-t p-3">
                <SkeletonBlock className="h-9 flex-1 rounded-md" />
                <SkeletonBlock className="h-9 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
