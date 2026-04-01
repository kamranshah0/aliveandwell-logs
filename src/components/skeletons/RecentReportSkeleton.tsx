import { Skeleton } from "@/components/skeletons/skeleton";

const RecentReportSkeleton = () => {
  return (
    <div className="flex justify-between items-center bg-surface-1/70 p-4 rounded-lg">
      <div className="flex gap-3">
        <Skeleton className="size-12 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="size-9 rounded-md" />
    </div>
  );
};

export default RecentReportSkeleton;
