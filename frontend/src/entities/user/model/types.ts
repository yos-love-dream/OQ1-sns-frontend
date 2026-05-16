/** Supabase oq_users 테이블 row (select * 결과). avatar_url은 호출 측에서 빈 문자열로 보정될 수 있음. */
export interface OqUserRow {
  id: string;
  user_name: string;
  guk_no: number;
  birth_date: string | null;
  enneagram_type: string | null;
  avatar_url: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  type: "Morning" | "Night" | "Lunch" | "Anytime";
  streak: number;
  group: string;
  level: number;
  currentExp: number;
  maxExp: number;
  hasDoneToday?: boolean;
  enneagramType?: string;
  badges?: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  acquired: boolean;
  dateAcquired?: string;
}
