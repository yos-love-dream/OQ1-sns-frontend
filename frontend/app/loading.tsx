import { MobileHeader } from "@widgets/mobile-header";

export default function Loading() {
  return (
    <div className="relative pb-20 md:py-8 px-0">
      <MobileHeader />

      <div className="md:px-4 mt-2 md:mt-0">
        <div className="bg-white md:rounded-xl border-b md:border border-gray-200 mb-6 overflow-hidden animate-pulse">
          <div className="bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 px-5 py-4 flex justify-between items-center">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3 w-28 bg-white/30 rounded" />
              <div className="h-5 w-36 bg-white/30 rounded" />
            </div>
            <div className="h-5 w-5 bg-white/30 rounded shrink-0 ml-3" />
          </div>

          <div className="p-5">
            <div className="h-5 w-28 bg-gray-200 rounded mb-3" />

            <div className="space-y-2 mb-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>

            <div className="mt-5 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300 space-y-1.5">
              <div className="h-3.5 w-full bg-gray-200 rounded" />
              <div className="h-3.5 w-4/5 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0 flex items-center gap-2 mb-4 animate-pulse">
          <div className="h-8 w-20 bg-gray-100 rounded-full border border-gray-200" />
          <div className="h-8 w-32 bg-gray-100 rounded-full border border-gray-200" />
        </div>
      </div>
    </div>
  );
}
