import React, { StrictMode, useEffect, useRef } from "react";
import { useState } from "react";

import type { ChatMessageDto, ChatRoomDto } from "../../types/chat";
import type { User } from "../../context/AuthContext";

import ChatDropdownMenu from "./ChatDropdownMenu";
import ChatSearchHeader from "./chatSearchHeader";

import more_vert from "@/assets/image/more_vert.png"
import text from "@/assets/image/text.svg";
import addPhoto from "@/assets/image/addPhoto.svg";
import addReaction from "@/assets/image/addReaction.svg";
import coconuttalk_bg from "@/assets/image/coconuttalk_bg.png";
import stat_minus from "@/assets/image/stat_minus.png";
import search from "@/assets/image/search.png";
import ChatInputSection from "./ChatInputSection";

interface ChatWindowProps {
    roomInfo: ChatRoomDto;
    currentUser: User | null;
}

const ChatWindow = ({ roomInfo, currentUser }: ChatWindowProps) => {

    // 입력창의 텍스트를 관리하는 상태
    const [inputText, setInputText] = useState("");

    // 방 ID에 따라 다른 초기 메시지를 보여주고 싶을 때
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);

    // 추가할 상태와 Ref
    const [showScrollBtn, setSshowScrollBtn] = useState(false);   // 아래로 이동하는 버튼 보여주는 상태
    const scrollRef = useRef<HTMLDivElement>(null); // 메시지 리스트 컨테이너 
    const messagesEndRef = useRef<HTMLDivElement>(null);    // 리스트의 제일 마지막 지점

    // 검색어 상태
    const [searchQuery, setSearchQuery] = useState("");
    // 검색된 메시지 Id들을 저장(순차 이동용)
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);



    // 검색창 활성화 여부
    const [isSearchMode, setIsSearchMode] = useState(false);

    // 각 메시지 엘리먼트를 참조하기 위한 Map Ref(타입 지정)
    const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());


    // 드롭다운 메뉴 상태 관리
    const [isChatDropdownOpen, setChatIsDropdownOpen] = useState(false);
    const chatDropdownRef = useRef<HTMLDivElement>(null);

    // 최하단으로 스크롤하는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // 새 메시지가 올 때마다 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    // 스크롤 위치를 감지하여 버튼 표시 여부 결정
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        // 바닥에서 200px 이상 위로 올라가면 버튼 표시
        if (scrollHeight - scrollTop - clientHeight > 200) {
            setSshowScrollBtn(true);
        } else {
            setSshowScrollBtn(false);
        }
    }

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target as Node)) {
                setChatIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 해당 방의 메시지를 가져오는 로직 적을거야
    useEffect(() => {
        // 실제로는 여기서 서버에 roomId를 보내서 메시지 목록을 가져와야하지만
        // 지금은 임시로 데이터 만들어놓음
        const welcomeMsg: ChatMessageDto = {
            messageId: 'welcome',
            messageType: 'SYSTEM',
            chatType: 'GROUP',
            roomId: roomInfo.roomId,
            sender: 'system',
            senderName: '시스템',
            senderInitial: 'ㅅ',
            message: `${roomInfo.roomName}에 입장했습니다.`,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            unreadCount: roomInfo.userCount - 1
        };
        setMessages([welcomeMsg]);
    }, [roomInfo.roomId])

    // ##################################################
    // 전송 버튼 함수
    // ##################################################
    const handleSend = () => {
        // 내용이 없으면 전송하지 않음
        if (!inputText.trim()) return;

        // 새 메시지 객체 생성
        const newMessage: ChatMessageDto = {
            messageId: Date.now().toString(), // 실제 DB에 넣을 ID대신 현재 시간을 ID로 임시 사용
            messageType: 'TEXT',
            chatType: 'GROUP',
            roomId: roomInfo.roomId,
            sender: currentUser?.email ?? "",
            senderName: currentUser?.nickname ?? "나",
            senderInitial: 'ㄴ',
            message: inputText,
            isDeleted: false,
            sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString(),
            unreadCount: roomInfo.userCount - 1
        };

        // 기존 메시지 목록에 새 메시지 추가
        setMessages([...messages, newMessage]);

        // 입력창 비우기
        setInputText("");
    }

    // 검색 및 스크롤 이동 함수
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setCurrentSearchIndex(-1);
            return;
        }

        // 메시지 중 텍스트 타입이고 검색어를 포함하는 ID 추출
        const foundIds = messages
            .filter(msg => msg.messageType === 'TEXT' && msg.message.includes(query))
            .map(msg => msg.messageId)

        setSearchResults(foundIds);

        if (foundIds.length > 0) {
            setCurrentSearchIndex(0);
        } else {
            setCurrentSearchIndex(-1);
        }
    };

    // 검색 결과 이동 함수(방햐이 'next' | 'prev')
    const moveSearchIndex = (direction: 'next' | 'prev') => {
        if (searchResults.length === 0) return;

        let nextIndex = currentSearchIndex;
        if (direction === 'next') {
            nextIndex = (currentSearchIndex + 1) % searchResults.length;
        } else {
            nextIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        }

        setCurrentSearchIndex(nextIndex);
        const targetId = searchResults[nextIndex];
        const targetElement = messageRefs.current.get(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            // 강조효과
            targetElement.style.backgroundColor = "#FEF9C3";
            setTimeout(() => { targetElement.style.backgroundColor = ""; }, 1500);
        }
    };

    // 검색 종료(취소) 함수
    const handleCloseSearch = () => {
        setIsSearchMode(false);
        setSearchQuery("");
        setSearchResults([]);
        setCurrentSearchIndex(-1);
    }

    return (
        <>
            <div className="relative flex-1 bg-white rounded-3xl shadow-sm border border-[#E5E0D5] flex flex-col overflow-hidden">

                {/* 채팅윈도우의 헤더(검색창 있는 곳) */}
                <ChatSearchHeader
                    isSearchMode={isSearchMode}
                    setIsSearchMode={setIsSearchMode}
                    roomInfo={roomInfo}
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                    currentSearchIndex={currentSearchIndex}
                    handleSearch={handleSearch}
                    moveSearchIndex={moveSearchIndex}
                    handleCloseSearch={handleCloseSearch}
                    isChatDropdownOpen={isChatDropdownOpen}
                    setChatIsDropdownOpen={setChatIsDropdownOpen}
                    chatDropdownRef={chatDropdownRef}
                />

                {/* 메시지 리스트 영역 */}
                <div
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
                    onScroll={handleScroll}     // 스크롤 이벤트 연결
                    ref={scrollRef}
                >
                    {messages.map((msg) => {
                        const isMine = msg.sender === currentUser?.email;
                        const isSystem = msg.messageType === 'SYSTEM';

                        if (isSystem) {
                            return (
                                <div key={msg.messageId} className="flex justify-center">
                                    <span className="bg-gray-100 text-gray-500 text-xs px-4 py-1 rounded-full">
                                        {msg.message}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={msg.messageId}
                                ref={(el) => {
                                    if (el) messageRefs.current.set(msg.messageId, el);
                                    else messageRefs.current.delete(msg.messageId);
                                }}
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isMine && (
                                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 mt-1 flex-shrink-0" />
                                )}
                                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                    {!isMine && <span className="text-xs font-bold text-[#4A3F35] mb-1">{msg.senderName}</span>}

                                    {/* 말풍선과 시간이나 안 읽은 사람 수를 감싸는 컨테이너 */}
                                    <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* 말풍선 */}
                                        <div className={`max-w-[300px] px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap break-words ${isMine
                                            ? 'bg-[#FFF9ED] text-[000000] font-semibold rounded-tr-none'
                                            : 'bg-[#743F24] bg-opacity-20 text-[000000] font-semibold rounded-tl-none'
                                            }`}>
                                            {msg.message}
                                        </div>
                                        {/* 시간 및 안 읽은 사람 수 표시하는 영역 */}
                                        <div className={`flex flex-col mb-1 ${isMine ? 'items-end' : 'items-start'}`}>
                                            {msg.unreadCount > 0 && (
                                                <span className="text-[10px] text-yellow-600 font-bold leading-none mb-1">
                                                    {msg.unreadCount}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 leading-none">
                                                {msg.sentTime}
                                            </span>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* 메시지 끝 지점 표시(여기로 스크롤되서 내려올거야) */}
                    <div ref={messagesEndRef} />
                </div>


                {/* 하단으로 가는 스크롤 버튼 */}
                {showScrollBtn && (
                    <div className="absolute bottom-56 right-8 z-30 opacity-85">
                        <button
                            onClick={scrollToBottom}
                            className="bg-white border border-gray-200 shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-all z-10 animate-bounce"
                        >
                            <img
                                src={stat_minus}
                                alt="밑으로 가는 이동버튼"
                                className="w-6 h-6"
                            />
                        </button>
                    </div>
                )}

                {/* 하단 메시지 입력창 영역 */}
                <ChatInputSection
                    inputText={inputText}
                    setInputText={setInputText}
                    handleSend={handleSend}
                />
            </div>
        </>
    );
};
export default ChatWindow;