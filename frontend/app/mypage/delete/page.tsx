import { requireAuth } from "@shared/api/supabase/auth";
import type { Metadata } from "next";
import { DeleteContent } from "@features/delete-account";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DeletePage() {
  await requireAuth();
  return <DeleteContent />;
}
