/** ERD oq_users 테이블 기준 회원가입/회원 정보 */
export interface OqUser {
  id?: number;
  user_name: string;
  guk_no: number;
  birth_date: string; // YYYY-MM-DD
  enneagram_type: string;
  reg_date?: string;
  update_date?: string;
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
