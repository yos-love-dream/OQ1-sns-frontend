"use client";

import {
  ApiError,
  ApiResponseValidationError,
  NetworkError,
} from "@shared/api/errors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const MAX_QUERY_RETRY = 2;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRY) return false;
  // 스키마 불일치는 서버 배포 문제 — 재시도 의미 없음
  if (error instanceof ApiResponseValidationError) return false;
  // fetch 자체 실패는 한 번 더 시도해볼 가치 있음 (transient 네트워크)
  if (error instanceof NetworkError) return true;
  // 서버 에러: 5xx/408/429만 재시도
  if (error instanceof ApiError) return error.isRetryable();
  // 정체 불명 에러는 기본 한 번
  return true;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: shouldRetry,
            // 재시도 후에도 실패한 query는 ErrorBoundary로 전파
            throwOnError: true,
          },
          mutations: {
            // 사용자 액션은 자동 재시도 금지 (중복 결제·중복 등록 위험)
            retry: false,
            // mutation 실패는 호출처에서 try/catch + Toast로 처리
            throwOnError: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
