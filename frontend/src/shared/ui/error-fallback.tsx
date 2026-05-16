"use client";

import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        문제가 발생했어요
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        {error instanceof Error
          ? error.message || "잠시 후 다시 시도해 주세요."
          : "잠시 후 다시 시도해 주세요."}
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:opacity-90 active:opacity-80 transition-opacity"
      >
        다시 시도
      </button>
    </div>
  );
}
