import { Skeleton } from "@/components/ui/skeleton";

export default function CVItemActionsSkeleton() {
  return (
    <div className="flex w-full content-center items-center justify-center gap-2">
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="size-10 rounded-full" />
    </div>
  );
}
