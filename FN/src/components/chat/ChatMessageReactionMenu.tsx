import React from "react";

interface ChatMessageReactionMenuProps {
    isMine: boolean;
    onDelete: () => void
    onReply?: () => void
}

const ChatMessageReactionMenu = ({ isMine, onDelete, onReply }: ChatMessageReactionMenuProps) => {
    
    return (
        <>
            <div className={`flex items-center gap-1 px-2 py-1 bg-white border border-gray-100 shadow-sm rounded-full
                ${isMine ? 'mr-2' : 'ml-2'} transition-all duration-200`}
            >
                
                {/*  삭제 버튼(내 메시지일 때만 보이게 할거야) */}
                {isMine && (
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-red-50 rounded-full group/btn"
                    >
                        <span className="text-[10px] text-gray-400 group-400 group-hover/btn:text-red-500">삭제하기</span>
                    </button>
                )}

                {/* 답장 버튼 (누구나 가능) */}
                <button
                    onClick={onReply}
                    className="p-1 hover:bg-blue-50 rounded-full group/btn"
                >
                    <span className="text-[10px] text-gray-400 group-hover/btn:text-blue-500">답장하기</span>
                </button>
            </div>
        </>
    )
}

export default ChatMessageReactionMenu;
