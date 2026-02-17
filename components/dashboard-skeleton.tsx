import CVItemSkeleton from "./cv/cv-item/cv-item-skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="grid w-full gap-2 p-2 sm:gap-4 sm:p-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CVItemSkeleton />
      <CVItemSkeleton />
      <CVItemSkeleton />
      <CVItemSkeleton />
      <CVItemSkeleton />
      <CVItemSkeleton />
      <CVItemSkeleton />
      <CVItemSkeleton />
    </div>
  );
}
