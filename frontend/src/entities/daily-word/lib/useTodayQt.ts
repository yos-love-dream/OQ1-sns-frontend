"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTodayQt } from "../api/fetchTodayQt";

export function useTodayQt() {
  return useQuery({
    queryKey: ["todayQt"],
    queryFn: () => fetchTodayQt(),
  });
}
