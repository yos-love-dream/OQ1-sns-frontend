import { requireAuth } from "@shared/api/supabase/auth";
import type { Metadata } from "next";
import { EditContent } from "@features/edit-profile";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditPage() {
  const { profile } = await requireAuth();
  return <EditContent userId={profile!.id} />;
}
