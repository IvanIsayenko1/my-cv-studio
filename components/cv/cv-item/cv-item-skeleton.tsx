import { A4 } from "@/components/shared/a4";
import { Skeleton } from "@/components/ui/skeleton";

import CVFormMenuSkeleton from "../cv-form-menu/cv-form-menu-skeleton";

export default function CVItemSkeleton() {
  return (
    <A4>
      <div className="flex h-full flex-col gap-2">
        <div className="skeleton-sheen flex h-full flex-col rounded-md border border-border/70">
          <div className="flex h-full flex-col p-4 sm:p-4">
            <div>
              <Skeleton className="h-2 w-8 rounded-sm bg-accent/70" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-7 w-[78%] rounded-sm bg-accent/80 sm:h-5" />
                <Skeleton className="h-7 w-[62%] rounded-sm bg-accent/70 sm:h-5" />
              </div>
            </div>

            <div className="mt-4 space-y-2 opacity-40 sm:mt-3 sm:space-y-1.5">
              <Skeleton className="h-px w-full rounded-none bg-accent/50" />
              <Skeleton className="h-px w-[92%] rounded-none bg-accent/50" />
              <Skeleton className="h-px w-[86%] rounded-none bg-accent/40" />
              <Skeleton className="h-px w-[94%] rounded-none bg-accent/40" />
              <Skeleton className="h-px w-[78%] rounded-none bg-accent/40" />
              <Skeleton className="h-px w-[90%] rounded-none bg-accent/40" />
            </div>

            <div className="mt-auto space-y-1">
              <Skeleton className="h-4 w-24 rounded-sm bg-accent/70 sm:h-3 sm:w-20" />
              <Skeleton className="h-4 w-32 rounded-sm bg-accent/70 sm:h-3 sm:w-28" />
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
