import { Skeleton } from "@/components/ui/skeleton";

import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

export default function CVFormMenuSkeleton() {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  return (
    <>
      {isDesktop && (
        <div className=" gap-4">
          <Skeleton className="w-[200px] h-9" />
        </div>
      )}

      {!isDesktop && (
        <div className=" gap-4">
          <Skeleton className="w-10 h-9" />
        </div>
      )}
    </>
  );
}
