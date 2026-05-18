const SKELETON_COUNT = 3;

export function HomeFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="bg-white border-b border-gray-200 md:border md:rounded-xl animate-pulse"
        >
          <div className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="px-3 pb-3 space-y-2">
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
            <div className="h-3.5 w-3/5 bg-gray-100 rounded" />
          </div>
          <div className="px-3 pb-3 flex gap-3">
            <div className="h-6 w-6 bg-gray-100 rounded" />
            <div className="h-6 w-6 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
