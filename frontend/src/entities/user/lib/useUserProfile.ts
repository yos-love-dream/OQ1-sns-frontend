"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/userService";

export function useUserProfile(
  userId: string,
  initialData?: Awaited<ReturnType<typeof fetchUserProfile>>,
) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    initialData,
  });
}
