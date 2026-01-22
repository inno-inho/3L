import React from "react";
import type { ChatMessageDto } from "../../types/chat";
import type { User } from "../../context/AuthContext";

import SystemMessages from "./chatTypeComponent/SystemMessages";
import ImageMessage from "./chatTypeComponent/ImageMessages";
import VideoMessage from "./chatTypeComponent/VideoMessages";
import FileMessages from "./chatTypeComponent/FileMessages";
import UrlMessages from "./chatTypeComponent/UrlMessages";
import ChatMessageReactionMenu from "./ChatMessageReactionMenu";

interface ChatMessageListProps {
    messages: ChatMessageDto[];
    currentUser: User | null;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    messageRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    onDeleteClick: (messageId: string) => void;
}

const ChatMessageList = ({
    messages,
    currentUser,
    onDeleteClick,
    scrollRef,
    messagesEndRef,
    messageRefs,
    handleScroll
}: ChatMessageListProps) => {


    return (
        <div
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
            onScroll={handleScroll} // 스크롤 이벤트 연결
            ref={scrollRef}
        >
            {messages.map((msg, index) => {
                const isMine = msg.sender === currentUser?.email;
                const isSystem = msg.messageType === 'ENTER' ||
                    msg.messageType === 'QUIT' ||
                    msg.messageType === 'DELETE' ||
                    msg.messageType === 'SYSTEM';

                // #######################################
                // 날짜 구분선 로직
                // #######################################
                // 현재 메시지의 날짜 추출 (예: 2024-01-19)
                const currentDate = msg.createdAt.split('T')[0];

                // 이전 메시지의 날짜 추출 (첫 번째 메시지라면 비교 대상 없음)
                const prevDate = index > 0 ? messages[index - 1].createdAt.split('T')[0] : null;

                // 이전 메시지와 날짜가 다르다면 구분선 표시 여부 결정
                const showDataDivider = currentDate !== prevDate;

                return (
                    <React.Fragment key={msg.messageId}>
                        {/* 날짜 구분선 렌더링 (날짜가 바뀔 때만 렌더링) */}
                        {showDataDivider && (
                            <div className="flex justify-center my-8">
                                <div className="bg-[#FFF9ED] text-black text-[11px] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                    {/* 날짜 포맷팅: 2024년 01월 19일 형식으로 변환 */}
                                    {new Date(currentDate).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long'
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 메시지 본문 */}
                        {isSystem ? (
                            <SystemMessages msg={msg} />
                        ) : (
                            <div
                                // 각 메시지 엘리먼트를 참조하기 위한 Map Ref 설정
                                ref={(e) => {
                                    if (e) messageRefs.current.set(msg.messageId, e);
                                    else messageRefs.current.delete(msg.messageId);
                                }}
                                className={` w=full group relative flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* 리액션 메뉴(내 메시지이고 삭제 안 된 경우만) */}
                                {!isSystem && msg.messageType !== 'DELETE' && (
                                    <div className={`-m-2 hidden group-hover:flex absolute -top-8 z-10${isMine ? 'right-0' : 'left-12'}`}>
                                        <ChatMessageReactionMenu
                                            isMine={isMine}
                                            onDelete={() => onDeleteClick(msg.messageId)}
                                            onReply={() => console.log("답장 기능 할거임")}
                                        />
                                    </div>
                                )}

                                {!isMine && (
                                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 mt-1 flex-shrink-0" />
                                )}
                                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                    {!isMine && <span className="text-xs font-bold text-[#4A3F35] mb-1">{msg.senderName}</span>}

                                    <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* 말풍선 */}
                                        <div className={`max-w-[300px] overflow-hidden shadow-sm ${msg.messageType === 'DELETE'
                                            ? 'bg-gray-50 border border-gray-100 rounded-xl px-3 py-2'
                                            : (isMine ? 'bg-[#FFF9ED] rounded-2xl rounded-tr-none' : 'bg-[#743F24] bg-opacity-10 rounded-2xl rounded-tl-none')
                                            }`}>
                                            {msg.messageType === 'DELETE' ? (
                                                <p className="text-gray-400 italic text-[11px]">삭제된 메시지입니다.</p>
                                            ) : (
                                                <div className="px-3 py-1.5 text-sm whitespace-pre-wrap break-words">
                                                    {msg.messageType === "IMAGE" && <ImageMessage msg={msg} />}
                                                    {msg.messageType === "VIDEO" && msg.files?.map((file, i) => <VideoMessage key={i} url={file.fileUrl} />)}
                                                    {msg.messageType === "FILE" && <FileMessages msg={msg} isMine={isMine} />}

                                                    {/* URL_LINK 타입일 때 */}
                                                    {msg.messageType === "URL_LINK" && (
                                                        <div className="flex flex-col gap-2">
                                                            <UrlMessages msg={msg} isMine={isMine} />
                                                        </div>
                                                    )}

                                                    {/* 일반 텍스트 타입일 때 */}
                                                    {msg.messageType === "TEXT" && <p className="leading-tight m-1">{msg.message}</p>}
                                                </div>
                                            )}
                                        </div>

                                        {/* 시간 및 안 읽은 사람 표시(삭제되지 않았을 때만 노출) */}
                                        {!isSystem && msg.messageType !== 'DELETE' && (
                                            <div className={`flex flex-col mb-[2px] ${isMine ? 'items-end' : 'items-start'} leading-none`}>
                                                {msg.unreadCount > 0 && <span className="text-[10px] text-yellow-600 font-bold mb-1">{msg.unreadCount}</span>}
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{msg.sentTime}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}

            {/* 메시지 끝 지점 표시 (여기로 스크롤되서 내려올거야) */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessageList;