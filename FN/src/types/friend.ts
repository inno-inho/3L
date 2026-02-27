import type { User } from "./user";

// 관계정보 확인
export interface Friendship {
    id: number; // 관계 id
    status: "REQUESTED" | "ACCEPTED" | "BLOCKED" ;
    friend: User;
}