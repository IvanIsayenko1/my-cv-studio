import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CVTailorFormSkeleton() {
  return (
    <div className="mb-4 w-full p-[1px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-24" />
          </CardTitle>

          <CardDescription>
            <Skeleton className="h-5 w-full" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4 pb-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
        <CardFooter className="cv-form-actions pb-4 sm:pb-6">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  );
}
