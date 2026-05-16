"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/userService";

export function useUserProfile(
  userId: string,
  initialData?: Awaited<ReturnType<typeof fetchUserProfile>>,
) {
  return useSuspenseQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    initialData,
  });
}
