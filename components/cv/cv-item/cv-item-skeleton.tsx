import { Skeleton } from "@/components/ui/skeleton";

import CVItemActionsSkeleton from "../cv-item-actions/cv-item-actions-skeleton";

export default function CVItemSkeleton() {
  return (
    <div className="border-border/70 bg-card flex h-full flex-col overflow-hidden rounded-4xl border">
      {/* Template thumbnail skeleton */}
      <Skeleton className="h-36 w-full rounded-none" />

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-[75%]" />

        {/* Info row skeleton */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Actions skeleton */}
        <div className="mt-auto flex flex-col items-center gap-2 pt-2">
          <CVItemActionsSkeleton />
          <Skeleton className="h-12 w-full rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
