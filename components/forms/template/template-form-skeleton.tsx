import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          <Skeleton className="mt-2 h-4 w-80 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <CardContent className="space-y-6 px-4 sm:px-6">
          <Skeleton className="h-64 w-full" />

          <div className="cv-form-actions">
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
