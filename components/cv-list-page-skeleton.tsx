import CVItemSkeleton from "./cv/cv-item/cv-item-skeleton";
import PageContent from "./layout/page-content";
import { Skeleton } from "./ui/skeleton";

export default function CVListPageSeleton() {
  return (
    <PageContent className="space-y-6 py-7 sm:p-4">
      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full rounded-3xl" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <CVItemSkeleton key={index} />
        ))}
      </div>
    </PageContent>
  );
}
