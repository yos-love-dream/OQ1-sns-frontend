import abrahamImg from "@/assets/images/abraham.png";
import davidImg from "@/assets/images/david.png";
import isaacImg from "@/assets/images/isaac.png";
import johnImg from "@/assets/images/john.png";
import josephImg from "@/assets/images/joseph.png";
import mosesImg from "@/assets/images/moses.png";
import ruthImg from "@/assets/images/ruth.png";
import samuelImg from "@/assets/images/samuel.png";
import solomonImg from "@/assets/images/solomon.png";
import type { StaticImageData } from "next/image";

export interface EnneagramInfo {
  name: string;
  description: string;
  image: StaticImageData;
}

export const ENNEAGRAM_INFO: Record<string, EnneagramInfo> = {
  "1": {
    name: "모세",
    description: "완벽을 추구하는 이상주의자",
    image: mosesImg,
  },
  "2": { name: "룻", description: "사랑으로 섬기는 돕는 사람", image: ruthImg },
  "3": {
    name: "사무엘",
    description: "목표를 향해 달려가는 성취자",
    image: samuelImg,
  },
  "4": {
    name: "세례 요한",
    description: "진정성을 추구하는 개인주의자",
    image: johnImg,
  },
  "5": {
    name: "요셉",
    description: "지혜롭게 관찰하는 탐구자",
    image: josephImg,
  },
  "6": { name: "이삭", description: "신실하게 따르는 충성가", image: isaacImg },
  "7": {
    name: "솔로몬",
    description: "기쁨을 나누는 열정가",
    image: solomonImg,
  },
  "8": {
    name: "다윗",
    description: "담대하게 도전하는 지도자",
    image: davidImg,
  },
  "9": {
    name: "아브라함",
    description: "평화를 이루는 중재자",
    image: abrahamImg,
  },
};

export function getEnneagramInfo(typeValue: string | undefined): EnneagramInfo | undefined {
  const mainType = typeValue?.[0];
  return mainType ? ENNEAGRAM_INFO[mainType] : undefined;
}
