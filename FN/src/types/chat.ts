// 상세 메타데이터 인터페이스
export interface ChatMetadata {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    url?: string;
}

// 메시지를 받는 인터페이스 
export interface ChatMessageDto{
    messageId: string;
    messageType: 'ENTER' | 'QUIT' | 'SYSTEM' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'URL_LINK' | 'DELETE' | 'TYPING';
    chatRoomType: 'GROUP' | 'FRIEND' | null;
    roomId: string;
    sender: string;
    senderName: string;
    senderInitial: string;
    message: string;
    files?: {
        fileUrl: string;
        fileName: string;
        originalFileName: string;
    }[];
    thumbnailUrl?: string;
    metadata?: ChatMetadata | null;
    deleted: boolean;
    sentTime?: string;
    createdAt: string;
    unreadCount?: number | null;
    parentMessageId?: string;   // 답장기능 필드
    parentMessageSenderName?: string;   // 답장기능 필드
    parentMessageContent?: string;    // 답장기능 필드
    // parentMessage?: any;
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