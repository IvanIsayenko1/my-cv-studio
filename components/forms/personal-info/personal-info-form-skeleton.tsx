import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalInfoFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card className="m-1 gap-0 py-0">
      <CardHeader className="gap-2 px-4 py-6 sm:px-6">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <>
          <CardContent className="space-y-6 px-4 pt-4 pb-6 sm:px-6">
            {/* Name row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-5 w-56" />
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            {/* Location row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-[14px] w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            {/* Professional links */}
            <div className="bg-muted/20 space-y-4 rounded-lg p-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-80 max-w-full" />

              <div className="flex flex-row justify-end pt-6">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="cv-form-actions pb-4 sm:pb-6">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
}
