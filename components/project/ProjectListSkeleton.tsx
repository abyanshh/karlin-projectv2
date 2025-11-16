import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProjectListSkeleton = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="space-y-4 pt-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectListSkeleton;
