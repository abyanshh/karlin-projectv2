import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-8 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4 w-1/3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex items-center justify-end w-2/3 gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
        <Skeleton className="h-10 w-32 mt-4" />
      </CardContent>
    </Card>
  );
}