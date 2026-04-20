import { Skeleton } from "@/components/ui/skeleton";

import CVBuilderMenuSkeleton from "../cv-builder-header/cv-builder-menu-skeleton";

export default function CVItemSkeleton() {
  return (
    <div className="skeleton-sheen border-border/70 bg-card flex h-full flex-col gap-3 overflow-hidden rounded-4xl border p-4">
      {/* Title skeleton */}
      <Skeleton className="bg-accent/80 h-6 w-[75%] rounded-sm" />

      {/* Info row skeleton */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="bg-accent/70 h-5 w-20 rounded-full" />
        <Skeleton className="bg-accent/70 h-4 w-24 rounded-sm" />
        <Skeleton className="bg-accent/70 h-4 w-32 rounded-sm" />
      </div>

      {/* Action buttons skeleton */}
      <div className="mt-auto flex items-center justify-end gap-2 pt-2">
        <CVBuilderMenuSkeleton />
      </div>
    </div>
  );
}
