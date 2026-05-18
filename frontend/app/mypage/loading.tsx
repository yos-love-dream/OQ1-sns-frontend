import { MobileHeader } from "@widgets/mobile-header";

export default function Loading() {
  return (
    <div className="pb-20 md:py-8 animate-pulse">
      <MobileHeader />

      <div className="mt-2 md:mt-0 w-full">
        <div className="bg-white p-6 md:rounded-xl md:border border-gray-200 md:shadow-sm mb-6">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-24 bg-gray-100 rounded" />
              <div className="h-3 w-36 bg-gray-100 rounded" />
              <div className="flex gap-6">
                <div className="h-8 w-12 bg-gray-100 rounded" />
                <div className="h-8 w-12 bg-gray-100 rounded" />
                <div className="h-8 w-12 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-32" />
        </div>
      </div>
    </div>
  );
}
