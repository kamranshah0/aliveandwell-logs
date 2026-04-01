const DashboardStatsCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-outline-low-em p-6 space-y-3 bg-surface-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-2/3 bg-surface-0 rounded" />
        
      </div>

      {/* Stats */}
      <div className=" flex items-center justify-between gap-2">
        <div className="h-3 w-1/2 bg-surface-0 rounded" />
         <div className="size-10 bg-surface-0 rounded-lg" />
      </div>
    </div>
  );
};

export default DashboardStatsCardSkeleton;