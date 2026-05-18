const FALLBACK_FIELD_COUNT = 4;

export function SignupFallback() {
  return (
    <div className="min-h-screen bg-fafafa flex flex-col items-center justify-center px-4 py-12 animate-pulse">
      <div className="w-full max-w-[360px] bg-white border border-gray-200 rounded-xl p-8 mb-4">
        <div className="h-7 w-16 bg-gray-100 rounded mx-auto mb-2" />
        <div className="h-3 w-28 bg-gray-100 rounded mx-auto mb-8" />
        <div className="space-y-4">
          {Array.from({ length: FALLBACK_FIELD_COUNT }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-12 bg-gray-100 rounded" />
              <div className="h-10 w-full bg-gray-50 rounded-md border border-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
