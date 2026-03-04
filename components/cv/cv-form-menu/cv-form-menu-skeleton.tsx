import { Skeleton } from "@/components/ui/skeleton";

export default function CVFormMenuSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="hidden h-9 w-[240px] md:block" />
      <Skeleton className="h-10 w-10 md:hidden" />
    </div>
  );
}
