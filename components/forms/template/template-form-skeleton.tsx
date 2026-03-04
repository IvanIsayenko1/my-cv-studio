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
    <Card className="w-full p-0 gap-0">
      <CardHeader className="p-6 gap-2">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <CardContent className="space-y-6 pt-4">
          <Skeleton className="h-64 w-full" />

          <div className="cv-form-actions">
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
