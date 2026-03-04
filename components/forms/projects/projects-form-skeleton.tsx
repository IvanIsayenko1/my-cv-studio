import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="p-6 gap-2">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <CardContent className="space-y-8 pt-4">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-10 w-full" />

              {i === 0 ? <Skeleton className="mt-8 h-px w-full" /> : null}
            </div>
          ))}

          <div className="cv-form-actions">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
