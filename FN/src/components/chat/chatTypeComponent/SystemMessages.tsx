import React from 'react';
import type { ChatMessageDto } from '../../../types/chat';

interface SystemProps {
    msg: ChatMessageDto;
}

const SystemMessages = ({ msg }: SystemProps) => {

    // 타입별 문구 설정
    const getMessageContent = () => {
        switch (msg.messageType) {
            case 'ENTER':
                return `${msg.senderName}님이 입장하셨습니다.`;
            case 'QUIT':
                return `${msg.senderName}님이 퇴장하셨습니다.`;
            case 'DELETE':
                return "삭제된 메시지입니다.";
            default:
                return msg.message;
        }
    };

    return (
        <div className='flex justify-center my-4 w-full'>
            <span className='bg-gray-100 text-gray-500 text-[11px] px-4 py-1 rounded-full shadow-sm border border-gray-50'>
                {getMessageContent()}
            </span>
        </div>
    );
};

export default SystemMessages;