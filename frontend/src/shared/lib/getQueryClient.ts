import { QueryClient } from "@tanstack/react-query";

// Server Component마다 새 QueryClient를 만들어 prefetch에 사용한다.
// staleTime은 QueryProvider와 동일하게 60초 — hydrate 직후 클라이언트가
// 즉시 재요청해 mismatch를 일으키지 않도록 한다.
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}
