import { SkeletonBlock } from "@/components/presswall/skeleton-block";

export function HomeShellSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading home"
      className="flex h-svh flex-col overflow-hidden bg-background"
      role="status"
    >
      <SkeletonBlock className="h-9 shrink-0 rounded-none bg-muted/30" />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 pb-6 sm:px-6">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2.5">
              <SkeletonBlock className="h-4 w-32" />
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-8 w-24 rounded-md" />
                <SkeletonBlock className="h-8 w-28 rounded-md" />
              </div>
            </div>
            <SkeletonBlock className="m-4 min-h-0 flex-1 rounded-lg" />
          </div>

          <div className="grid shrink-0 gap-3 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-4/5" />
              <SkeletonBlock className="mt-2 h-8 w-32 rounded-md" />
            </div>
            <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-3/4" />
              <SkeletonBlock className="mt-2 h-8 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
