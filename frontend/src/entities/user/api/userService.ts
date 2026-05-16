import { createClient } from "@shared/api/supabase/client";

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
  if (
    raw &&
    typeof (raw as Date).toISOString === "function"
  ) {
    return (raw as Date).toISOString().slice(0, 10);
  }
  return "";
}

export async function fetchProfileRow(
  userId: string,
  fallbackAvatarUrl: string | null = null,
): Promise<ProfileRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("oq_users")
    .select("user_name, guk_no, birth_date, enneagram_type, avatar_url")
    .eq("id", userId)
    .single();
  if (error || !data) return null;

  return {
    user_name: data.user_name ?? "",
    guk_no: data.guk_no ?? 1,
    birth_date: parseBirthDate(data.birth_date),
    enneagram_type: data.enneagram_type ?? null,
    avatar_url: (data.avatar_url as string) ?? fallbackAvatarUrl ?? null,
  };
}

export async function fetchUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("oq_users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    if (error) console.error("Error fetching user profile:", error);
    return null;
  }

  return {
    ...data,
    avatar_url: data.avatar_url || "",
  };
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("oq_users")
    .update(input)
    .eq("id", userId);
  if (error) throw error;
}

export async function reactivateAccount(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("oq_users")
    .update({ deleted_at: null })
    .eq("id", userId);
  if (error) throw error;
}
