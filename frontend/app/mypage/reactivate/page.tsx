import { requireAuth } from "@shared/api/supabase/auth";
import type { Metadata } from "next";
import { ReactivateContent } from "@features/reactivate-account";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ReactivatePage() {
  await requireAuth();
  return <ReactivateContent />;
}
