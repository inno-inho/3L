export interface User{
    id: number;
    email: string;
    username: string;
    nickname: string;
    phone?: string;
    profileImageUrl: string;
    statusMessage: string;
    passwordUpdatedAt: string | null;
}