"use client";

import { ErrorFallback } from "@shared/ui/error-fallback";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { reset: resetQuery } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={() => {
        resetQuery();
        reset();
      }}
    />
  );
}
