/** Post 표시용 작성자 정보. entities/user의 User와 별도로 정의해 cross-import를 피한다. */
export interface PostAuthor {
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

export interface Post {
  id: string;
  user: PostAuthor;
  content: string;
  scriptureRef: string;
  scriptureContent?: string;
  scriptureTitle?: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  amenCount: number;
  commentCount: number;
  isLiked: boolean;
  timestamp: string;
  tags: string[];
  likedUsers?: { userId: string; userName: string; avatarUrl?: string }[];
}

export interface Comment {
  id: string;
  user: PostAuthor;
  text: string;
  timestamp: string;
}

export enum FeedFilter {
  ALL = "ALL",
  MY_TYPE = "MY_TYPE",
}
