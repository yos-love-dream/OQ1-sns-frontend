import type { PostgrestError } from "@supabase/supabase-js";
import { ZodError, type ZodType } from "zod";
import { ApiError, ApiResponseValidationError, NetworkError } from "../errors";

/**
 * supabase response shape. Database 타입 generic이 없는 프로젝트에서는
 * data가 자동 추론되지 않으므로 호출처가 generic 또는 cast로 좁힌다.
 */
interface SupabaseResponse {
  data: unknown;
  error: PostgrestError | null;
  status?: number;
  statusText?: string;
  count?: number | null;
}

const NOT_FOUND_CODE = "PGRST116"; // .single()에서 row 0개일 때

async function awaitWithNetworkGuard<T>(request: PromiseLike<T>): Promise<T> {
  try {
    return await request;
  } catch (e) {
    throw new NetworkError(
      e instanceof Error ? e.message : "Network request failed",
      e,
    );
  }
}

function toApiError(
  err: PostgrestError,
  status: number | undefined,
): ApiError {
  return new ApiError(err.message, {
    status: status ?? 500,
    code: err.code,
    cause: err,
  });
}

function parseOrThrow<T>(data: unknown, schema: ZodType<T>): T {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ApiResponseValidationError(
        `Response schema mismatch: ${e.issues.map((i) => i.message).join("; ")}`,
        e,
      );
    }
    throw e;
  }
}

/** error → throw ApiError, data 없으면 throw. schema 있으면 parse, 실패 시 ApiResponseValidationError. */
export async function unwrap<T = unknown>(
  request: PromiseLike<SupabaseResponse>,
  schema?: ZodType<T>,
): Promise<T> {
  const response = await awaitWithNetworkGuard(request);
  if (response.error) throw toApiError(response.error, response.status);
  if (response.data == null) {
    throw new ApiError("No data returned", {
      status: response.status ?? 404,
    });
  }
  if (schema) return parseOrThrow(response.data, schema);
  return response.data as T;
}

/** mutation 등 응답 본문이 필요 없는 경우. error만 throw로 변환. */
export async function assertOk(
  request: PromiseLike<SupabaseResponse>,
): Promise<void> {
  const response = await awaitWithNetworkGuard(request);
  if (response.error) throw toApiError(response.error, response.status);
}

/** "데이터가 없을 수 있음"이 정상인 경우 (.single() + 미가입 user 등). row 없음 → null, 그 외 에러 → throw */
export async function unwrapOrNull<T = unknown>(
  request: PromiseLike<SupabaseResponse>,
  schema?: ZodType<T>,
): Promise<T | null> {
  const response = await awaitWithNetworkGuard(request);
  if (response.error) {
    if (response.error.code === NOT_FOUND_CODE) return null;
    throw toApiError(response.error, response.status);
  }
  if (response.data == null) return null;
  if (schema) return parseOrThrow(response.data, schema);
  return response.data as T;
}
