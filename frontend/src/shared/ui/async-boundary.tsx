"use client";

import { isCriticalError } from "@shared/api/errors";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import {
  Suspense,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  ErrorBoundary,
  type ErrorBoundaryProps,
  type FallbackProps,
} from "react-error-boundary";
import { ErrorFallback } from "./error-fallback";

interface AsyncBoundaryProps
  extends Omit<
    ErrorBoundaryProps,
    "fallback" | "FallbackComponent" | "fallbackRender" | "onReset"
  > {
  pendingFallback: ReactNode;
  /** 기본값: ErrorFallback. 커스텀 fallback 필요 시 컴포넌트 지정. */
  rejectedFallback?: ComponentType<FallbackProps>;
  /**
   * 이 boundary가 잡을 에러인지 결정. false면 상위 boundary로 rethrow.
   * 기본 정책: 스키마 불일치/401은 rethrow, 그 외 로컬 처리.
   */
  shouldHandle?: (error: unknown) => boolean;
  children: ReactNode;
}

function defaultShouldHandle(error: unknown): boolean {
  return !isCriticalError(error);
}

/**
 * Suspense(pending) + ErrorBoundary(rejected) + QueryErrorResetBoundary를
 * 한 컴포넌트로 묶어 비동기 처리를 선언적으로 위임한다.
 * 자식은 success path만 다룬다. critical error는 자동으로 상위로 rethrow.
 */
export function AsyncBoundary({
  pendingFallback,
  rejectedFallback: RejectedFallback = ErrorFallback,
  shouldHandle = defaultShouldHandle,
  children,
  ...errorBoundaryProps
}: AsyncBoundaryProps) {
  function GatedFallback(props: FallbackProps) {
    if (!shouldHandle(props.error)) {
      // 이 boundary가 처리하지 않을 에러 — 상위로 전파
      throw props.error;
    }
    return <RejectedFallback {...props} />;
  }

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={GatedFallback}
          {...errorBoundaryProps}
        >
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
