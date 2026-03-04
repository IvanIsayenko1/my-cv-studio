import { A4 } from "@/components/shared/a4";
import { Skeleton } from "@/components/ui/skeleton";

import CVFormMenuSkeleton from "../cv-form-menu/cv-form-menu-skeleton";

export default function CVItemSkeleton() {
  return (
    <A4>
      <div className="flex h-full flex-col gap-2">
        <div className="skeleton-sheen flex h-full flex-col rounded-md border border-border/70">
          <div className="flex h-full flex-col justify-between gap-2 p-3 sm:p-4">
            <div>
              <Skeleton className="h-2 w-8 rounded-sm bg-accent/70" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-[78%] rounded-sm bg-accent/80" />
                <Skeleton className="h-4 w-[62%] rounded-sm bg-accent/70" />
              </div>
            </div>

            <div className="space-y-1">
              <Skeleton className="h-3 w-20 rounded-sm bg-accent/70" />
              <Skeleton className="h-3 w-28 rounded-sm bg-accent/70" />
            </div>
          </div>
        </div>
        <div className="flex justify-end sm:justify-center">
          <CVFormMenuSkeleton />
        </div>
      </div>
    </A4>
  );
}
