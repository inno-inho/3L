interface ChatReplyMessagesProps {
    parentMessageId: string;
    senderName: string;
    content: string;
    // 부모로부터 전달받은 Ref Map을 이용해 스크롤 이동 함수를 직접 수행
    onJump: (messageId: string) => void;
}

const ChatReplyMessages = ({ parentMessageId, senderName, content, onJump}: ChatReplyMessagesProps) => {
    return (
        <>
            {/* 답장의 대상이 되는 메시지가 적힐 곳 */}
            <div 
                className="mb-4 p-2 bg-[#F3EFE7] rounded-lg border-1-4 border-gray-400 text-[11px] cursor-pointer hover:bg-opacity-10 transition-all"
                onClick={(e) => {
                    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                    onJump(parentMessageId);
                }}
            >   
                <p className="font-bold opacity-70 text-gray-700">{senderName}</p>
                <p className="truncate opacity-60 text-gray-600">{content}</p>
            </div>
        </>
    );
};

export default ChatReplyMessages;