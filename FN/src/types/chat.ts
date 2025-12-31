export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'SYSTEM';

export interface Message{
    id: string;
    senderEmail: string;
    senderNickname: string;
    content: string;
    type: MessageType;
    timestamp: string;
    readCount: number;
}

export interface ChatRoom{
    id: string;
    roomName: string;
    lastMessage?: string;
    unreadCount: number;
}