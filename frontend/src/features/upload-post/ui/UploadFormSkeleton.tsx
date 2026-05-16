export function UploadFormSkeleton() {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-12">
        <div className="h-4 w-10 bg-gray-100 rounded" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-10 bg-gray-100 rounded" />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="mx-4 mt-4 mb-2 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-200 space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-4/5 bg-gray-200 rounded" />
        </div>
        <div className="flex p-4 gap-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
