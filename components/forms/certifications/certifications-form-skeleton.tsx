import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CertificationsFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card className="m-1 gap-0 py-0">
      <CardHeader className="gap-2 p-6">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <>
          <CardContent className="space-y-8 pt-4 pb-2">
            <Skeleton className="h-30 w-full" />
          </CardContent>
          <CardFooter className="cv-form-actions pb-4 sm:pb-6">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
}
