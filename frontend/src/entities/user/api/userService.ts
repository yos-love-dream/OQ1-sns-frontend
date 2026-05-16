import { createClient } from "@shared/api/supabase/client";
import { assertOk, unwrapOrNull } from "@shared/api/supabase/unwrap";
import type { OqUserRow } from "../model/types";
import { OqUserRowSchema, ProfileRowSchema } from "./schemas";

export interface ProfileRow {
  user_name: string;
  guk_no: number;
  birth_date: string;
  enneagram_type: string | null;
  avatar_url: string | null;
}

export interface UpdateProfileInput {
  user_name: string;
  guk_no: number;
  birth_date: string;
  enneagram_type: string | null;
}

function parseBirthDate(raw: unknown): string {
  if (raw == null) return "";
  if (typeof raw === "string") return raw.slice(0, 10);
  if (raw && typeof (raw as Date).toISOString === "function") {
    return (raw as Date).toISOString().slice(0, 10);
  }
  return "";
}

export async function fetchProfileRow(
  userId: string,
  fallbackAvatarUrl: string | null = null,
): Promise<ProfileRow | null> {
  const supabase = createClient();
  const data = await unwrapOrNull(
    supabase
      .from("oq_users")
      .select("user_name, guk_no, birth_date, enneagram_type, avatar_url")
      .eq("id", userId)
      .single(),
    ProfileRowSchema,
  );
  if (!data) return null;

  return {
    user_name: data.user_name ?? "",
    guk_no: data.guk_no ?? 1,
    birth_date: parseBirthDate(data.birth_date),
    enneagram_type: data.enneagram_type ?? null,
    avatar_url: data.avatar_url ?? fallbackAvatarUrl ?? null,
  };
}

export async function fetchUserProfile(
  userId: string,
): Promise<OqUserRow | null> {
  const supabase = createClient();
  const data = await unwrapOrNull(
    supabase.from("oq_users").select("*").eq("id", userId).single(),
    OqUserRowSchema,
  );
  if (!data) return null;
  return { ...data, avatar_url: data.avatar_url || "" };
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<void> {
  const supabase = createClient();
  await assertOk(supabase.from("oq_users").update(input).eq("id", userId));
}

export async function reactivateAccount(userId: string): Promise<void> {
  const supabase = createClient();
  await assertOk(
    supabase.from("oq_users").update({ deleted_at: null }).eq("id", userId),
  );
}
