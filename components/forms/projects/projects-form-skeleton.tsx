import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-4 border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        ))}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
