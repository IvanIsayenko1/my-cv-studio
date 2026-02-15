import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateFormSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base sm:text-lg">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          <Skeleton className="h-4 w-64 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
