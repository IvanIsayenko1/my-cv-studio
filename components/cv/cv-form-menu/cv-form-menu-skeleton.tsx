import { Skeleton } from "@/components/ui/skeleton";

export default function CVFormMenuSkeleton() {
  return (
    <>
      <div className="hidden sm:flex gap-4">
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-[405px] h-9" />
      </div>

      <div className="flex sm:hidden gap-4">
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-10 h-9" />
      </div>
    </>
  );
}
