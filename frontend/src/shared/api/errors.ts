/**
 * API 에러 3계층 — 재시도·UI 처리 정책의 단일 분류 지점.
 * - ApiError: 서버 응답 에러 (4xx/5xx). 5xx·408·429만 재시도.
 * - ApiResponseValidationError: 응답 스키마 불일치. 재시도 금지.
 * - NetworkError: fetch 자체 실패. 재시도 금지 (Query 단에서 일반 재시도는 가능).
 */

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    options: { status: number; code?: string; cause?: unknown },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.cause = options.cause;
  }

  /** 5xx·408·429만 재시도 대상 */
  isRetryable(): boolean {
    return this.status >= 500 || this.status === 408 || this.status === 429;
  }
}

export class ApiResponseValidationError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ApiResponseValidationError";
    this.cause = cause;
  }
}

export class NetworkError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

export function isApiResponseValidationError(
  e: unknown,
): e is ApiResponseValidationError {
  return e instanceof ApiResponseValidationError;
}

export function isNetworkError(e: unknown): e is NetworkError {
  return e instanceof NetworkError;
}
