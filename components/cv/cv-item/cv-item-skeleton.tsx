import { A4 } from "@/components/shared/a4";
import { Skeleton } from "@/components/ui/skeleton";

import CVBuilderMenuSkeleton from "../cv-builder-header/cv-builder-menu-skeleton";

export default function CVItemSkeleton() {
  return (
    <A4>
      <div className="flex h-full flex-col gap-2">
        <div className="skeleton-sheen border-border/70 flex h-full flex-col rounded-2xl border">
          <div className="flex h-full flex-col p-4 sm:p-4">
            <div>
              <h4 className="mt-2 line-clamp-3 text-xl leading-tight font-semibold tracking-tight transition-transform duration-300 group-hover/card:translate-x-0.5 sm:text-base sm:font-medium">
                <Skeleton className="bg-accent/80 h-7 w-[78%] rounded-sm sm:h-5" />
              </h4>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="bg-accent/70 h-6 w-16 rounded-sm" />
            </div>

            <div className="scroll-reveal text-muted-foreground mt-4 space-y-1 text-sm sm:mt-3 sm:text-xs">
              <Skeleton className="bg-accent/70 h-4 w-24 rounded-sm sm:h-3 sm:w-20" />
              <Skeleton className="bg-accent/70 h-4 w-32 rounded-sm sm:h-3 sm:w-28" />
            </div>

            <div className="mt-4 space-y-2 opacity-35 sm:mt-3 sm:space-y-1.5 sm:opacity-30">
              <div className="bg-border/80 h-2 w-full" />
              <div className="bg-border/90 h-2 w-[92%]" />
              <div className="bg-border/90 h-2 w-[86%]" />
              <div className="bg-border/90 h-2 w-[94%]" />
              <div className="bg-border/90 h-2 w-[78%]" />
            </div>
          </div>
        </div>
        <div className="flex justify-end sm:justify-center">
          <CVBuilderMenuSkeleton />
        </div>
      </div>
    </A4>
  );
}
