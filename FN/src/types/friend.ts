import type { User } from "./user";

// 관계정보 확인
export interface Friendship {
    id: number; // 관계 id
    status: "REQUESTED" | "ACCEPTED" | "BLOCKED" ;
    friend: User;
}

// 친구 요청 모달
export interface FriendRequestModalProps {
    email: string;
    nickname: string;
}

// 차단정보 확인
export interface BlockedUser {
    email: string;
    nickname: string;
}