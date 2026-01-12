import React, { StrictMode, useEffect, useRef } from "react";
import { useState } from "react";

import type { ChatMessageDto, ChatRoomDto } from "../../types/chat";
import type { User } from "../../context/AuthContext";

import ChatDropdownMenu from "./ChatDropdownMenu";

import more_vert from "@/assets/image/more_vert.png"
import text from "@/assets/image/text.svg";
import addPhoto from "@/assets/image/addPhoto.svg";
import addReaction from "@/assets/image/addReaction.svg";
import coconuttalk_bg from "@/assets/image/coconuttalk_bg.png";
import stat_minus from "@/assets/image/stat_minus.png";
import search from "@/assets/image/search.png";

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

    // 각 메시지 엘리먼트를 참조하기 위한 Map Ref(타입 지정)
    const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // 최하단으로 스크롤하는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // 검색창 활성화 여부
    const [isSearchMode, setIsSearchMode] = useState(false);

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

    // 드롭다운 메뉴 상태 관리
    const [isChatDropdownOpen, setChatIsDropdownOpen] = useState(false);
    const chatDropdownRef = useRef<HTMLDivElement>(null);

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
                {/* 상단 헤더 (통합프레임) */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
                    {!isSearchMode ? (
                        // 기본 모드
                        <>               
                            <div className="flex items-center gap-3">
                                {/* roomImage 처리 */}
                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                    {roomInfo.roomImageUrls && roomInfo.roomImageUrls.length > 0 ? (
                                        <img
                                            src={roomInfo.roomImageUrls[0]}
                                            alt={roomInfo.roomName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        // 이미지가 없을 때 보여줄 기본 아이콘이나 대체 텍스트
                                        <img src={coconuttalk_bg} alt="코코넛톡 기본 이미지" />
                                    )}
                                </div>

                                {/* 방 이름 및 인원수 and Search Icon */}
                                <div className="flex items-center">
                                    <span className="font-bold text-[#4A3F35] leading-none">
                                        {roomInfo.roomName}
                                    </span>
                                    {roomInfo.userCount > 2 && (
                                        <span className="text-xs text-gray-400 pl-3">
                                            {roomInfo.userCount}명
                                        </span>
                                    )}
                                    <button
                                        className="h-8 w-8 pl-3"
                                        onClick={() => setIsSearchMode(true)}
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {/* 누르면 드롭다운메뉴 나오는 곳 ... */}
                            <div
                                className="relative"
                                ref={chatDropdownRef}
                            >
                                <button
                                    className=" hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full"
                                    onClick={() => setChatIsDropdownOpen(!isChatDropdownOpen)}
                                >
                                    <img src={more_vert} alt="채팅알람 관련 설정" className="w-7 h-7" />
                                </button>
                                
                                {/* 드롭다운 컴포넌트 적용 */}
                                <ChatDropdownMenu
                                    isOpen={isChatDropdownOpen}
                                    chatRoomType={roomInfo.chatRoomType}
                                />
                            </div>
                        </>
                    ) : (
                        // 검색창 모드
                        <>                        
                            <div className="flex items-center gap-4 w-full animate-in silde-in-from-top-1 duration-200">
                                {/* 검색창 */}
                                <div className="flex-1 flex items-center bg-[#F8F6F2] rounded-xl px-4 py-2 border border-transparent focus-within:border-[#B5A492] transition-all">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        autoFocus
                                        className="bg-transparent flex-1 outline-none text-sm"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();         // 페이지 새로고침 
                                                
                                                // 검색 결과가 있는 상태(화살표가 있음)에서 엔터를 치면
                                                if(searchResults.length > 0){
                                                    moveSearchIndex('next');    // 엔터 누르면 다음 결과로 이동
                                                }
                                                
                                            }
                                        }}
                                    />
                                    {/* 검색 결과 컨트롤(결과가 있을 때만 표시) */}
                                    {searchResults.length > 0 && (
                                        <div className="flex items-center gap-3 border-1 border-gray-300 ml-2 pl-3 text-gray-500">
                                            <span className="text-[11px] font-medium min-w-[35px]">
                                                {currentSearchIndex + 1} / {searchResults.length}
                                            </span>
                                            <div className="flex gap-1">
                                                <button onClick={() => moveSearchIndex('prev')} className="p-1 hover:bg-gray-200 rounded-3xl h-5 w-5">
                                                    <img
                                                        src={stat_minus}
                                                        alt="채팅 검색 내용 위로 이동"
                                                        className="rotate-180"
                                                    />
                                                </button>
                                                <button onClick={() => moveSearchIndex('next')} className="p-1 hover:bg-gray-200 rounded-3xl h-5 w-5">
                                                    <img
                                                        src={stat_minus}
                                                        alt="채팅 검색 내용 아래로 이동"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleCloseSearch}
                                    className="text-sm text-darkgray-50 hover:text-[#743F24] px-1 transition-colors font-semibold"
                                >
                                    X
                                </button>
                            </div>            
                        </>
                    )}
                </div>

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
                <div className="p-4 bg-white border-t border-gray-50">
                    <div className="border border-[#743F24] rounded-2xl p-3 bg-white">
                        <textarea
                            className="w-full h-24 resize-none outline-none text-sm font-semibold py-2 px-2"
                            placeholder="메시지를 입력해주세요"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}  // 입력할 때마다 상태 업데이트
                            onKeyDown={(e) => {
                                // Enter키를 누르면 전송 (Shift+Enter는 줄바꿈)
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-3">
                                <button className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full">
                                    <img
                                        src={addPhoto}
                                        alt="사진이나 파일 추가"
                                        className="h-8 w-8"
                                    />
                                </button>
                                <button className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full">
                                    <img
                                        src={text}
                                        alt="파일 추가"
                                        className="h-8 w-8"
                                    />
                                </button>
                                <button className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full">
                                    <img
                                        src={addReaction}
                                        alt="리액션"
                                        className="h-8 w-8"
                                    />
                                </button>
                            </div>
                            <button
                                onClick={handleSend}    // 클릭 시 전송 함수 실행
                                className="bg-[#B5A492] hover:bg-[#8B4513] text-white px-6 py-1.5 rounded-xl text-sm transition-colors font-medium"
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ChatWindow;