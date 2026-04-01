const PharmacyCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-outline-low-em p-6 space-y-5 bg-surface-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-2/3 bg-surface-0 rounded" />
        <div className="size-8 bg-surface-0 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="h-3 w-full bg-surface-0 rounded" />
        <div className="h-3 w-full bg-surface-0 rounded" />
        <div className="h-3 w-full bg-surface-0 rounded" />
      </div>
    </div>
  );
};

export default PharmacyCardSkeleton;
