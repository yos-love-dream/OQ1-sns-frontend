import type { Badge, User } from "./types";

export const CURRENT_USER: User = {
  id: "u1",
  name: "김은혜",
  avatar: "https://picsum.photos/100/100",
  type: "Morning",
  streak: 14,
  group: "청년 1부",
  level: 3,
  currentExp: 340,
  maxExp: 500,
};

export const BADGES: Badge[] = [
  {
    id: "b1",
    name: "작심삼일 탈출",
    description: "3일 연속 큐티 인증",
    icon: "🌱",
    acquired: true,
    dateAcquired: "2024-03-10",
  },
  {
    id: "b2",
    name: "일주일의 기적",
    description: "7일 연속 큐티 인증",
    icon: "🔥",
    acquired: true,
    dateAcquired: "2024-03-17",
  },
  {
    id: "b3",
    name: "새벽이슬",
    description: "오전 6시 이전 인증 10회",
    icon: "🌅",
    acquired: false,
  },
  {
    id: "b4",
    name: "묵상의 고수",
    description: "총 100회 인증 달성",
    icon: "👑",
    acquired: false,
  },
];
