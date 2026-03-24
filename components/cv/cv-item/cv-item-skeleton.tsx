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
              <h4 className="mt-2 line-clamp-3 text-xl font-semibold leading-tight tracking-tight transition-transform duration-300 group-hover/card:translate-x-0.5 sm:text-base sm:font-medium">
                <Skeleton className="h-7 w-[78%] rounded-sm bg-accent/80 sm:h-5" />
              </h4>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-sm bg-accent/70 " />
            </div>

            <div className="scroll-reveal  space-y-1 text-sm text-muted-foreground sm:text-xs mt-4 sm:mt-3">
              <Skeleton className="h-4 w-24 rounded-sm bg-accent/70 sm:h-3 sm:w-20" />
              <Skeleton className="h-4 w-32 rounded-sm bg-accent/70 sm:h-3 sm:w-28" />
            </div>

            <div className="mt-4 space-y-2 opacity-35 sm:mt-3 sm:space-y-1.5 sm:opacity-30 ">
              <div className="h-2 w-full bg-border/80" />
              <div className="h-2 w-[92%] bg-border/90" />
              <div className="h-2 w-[86%] bg-border/90" />
              <div className="h-2 w-[94%] bg-border/90" />
              <div className="h-2 w-[78%] bg-border/90" />
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
