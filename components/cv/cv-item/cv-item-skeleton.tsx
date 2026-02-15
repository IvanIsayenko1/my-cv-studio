import { A4 } from "@/components/shared/a4";
import { Skeleton } from "@/components/ui/skeleton";

export default function CVItemSkeleton() {
  return (
    <A4>
      <Skeleton className="h-full w-full" />
    </A4>
  );
}
