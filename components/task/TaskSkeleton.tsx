import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const TaskHeaderSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-1/3" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardTitle>

        <div className="flex gap-4 mt-4">
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
    </Card>
  );
};

const InputTaskSkeleton = () => {
  return (   
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-medium">
        <Skeleton className="h-5 w-40" />
      </CardTitle>
    </CardHeader>

    <CardContent>
      {/* Upload box */}
      <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
        <Skeleton className="w-10 h-10 mb-4 rounded" />
        <Skeleton className="w-48 h-4 mb-4" />
        <Skeleton className="w-24 h-8 rounded-md" />
      </div>

      {/* File List */}
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-40" />

        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between border rounded-md p-3 bg-muted/40"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        ))}
      </div>

      {/* Button verify */}
      <div className="flex justify-end mt-4">
        <Skeleton className="w-24 h-9 rounded-md" />
      </div>
    </CardContent>
  </Card>
  )
};
export { TaskHeaderSkeleton, InputTaskSkeleton };
