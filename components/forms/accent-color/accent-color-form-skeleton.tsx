import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccentColorFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card className="m-1 gap-0 py-0">
      <CardHeader className="gap-2 p-6">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-24" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <>
          <div className="flex flex-col gap-8">
            <CardContent className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
            <CardFooter className="cv-form-actions pb-4 sm:pb-6">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </div>
        </>
      ) : null}
    </Card>
  );
}
