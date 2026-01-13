// 메시지를 받는 인터페이스 
export interface ChatMessageDto{
    messageId: string;
    messageType: 'ENTER' | 'QUIT' | 'SYSTEM' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'URL_LINK' | 'DELETE' | 'TYPING';
    chatType: 'GROUP' | 'FRIEND';
    roomId: string;
    sender: string;
    senderName: string;
    senderInitial: string;
    message: string;
    fileUrl?: string;
    thumbnailUrl?: string;
    metadata?: string;
    isDeleted: boolean;
    sentTime?: string;
    createdAt: string;
    unreadCount: number;
}

// 채팅방 목록에 표시할 것들을 받는 인터페이스
export interface ChatRoomDto{
    roomId: string;
    roomName: string;
    chatRoomType: 'GROUP' | 'FRIEND';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount?: number;
    userCount: number;
    roomImageUrls: string[];
}

// typing이면 표시하게 만들기 위한 인터페이서
export interface TypingEventDto {
    roomId: string;
    senderName: string;
    isTyping: boolean;
}