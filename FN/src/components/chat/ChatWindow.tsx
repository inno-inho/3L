import React, { StrictMode, useEffect, useRef } from "react";
import { useState } from "react";
import { Client } from "@stomp/stompjs";

import type { ChatMessageDto, ChatRoomDto } from "../../types/chat";
import type { User } from "../../context/AuthContext";
import api from "../../api/api";

import ChatSearchHeader from "./ChatSearchHeader";
import AlertModal from "../common/AlertModal";

import stat_minus from "@/assets/image/stat_minus.png";
import ChatInputSection from "./ChatInputSection";

interface ChatWindowProps {
    roomInfo: ChatRoomDto;
    currentUser: User | null;
}

const ChatWindow = ({ roomInfo, currentUser }: ChatWindowProps) => {

    const [ modalShow, setModalShow ] = useState(false);
    const [ modalMessage, setModalMessage ] = useState(""); 

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

    // 미리보기 파일들 상태 관리
    const [pendingFiles, setPendingFiles] = useState<{
        id: string,
        file: File,
        type: "IMAGE" | "VIDEO" | "FILE",
        previewUrl: string
    }[]>([]);

    // 웹 소켓 클라이언트
    const client = useRef<Client | null>(null);

    // 웹 소켓 클라이언트 
    useEffect(() => {
        // 웹 소켓 클라이언트 설정
        client.current = new Client({
            brokerURL: 'ws://localhost:8080/ws/chat',
            onConnect: () => {
                console.log("웹 소켓 클라이언트 연결 성공!");

                // 해당 방을 구독(누가 메시지를 보내면 나한테 알려달라고 구독 신청)
                client.current?.subscribe(`/topic/chat/${roomInfo.roomId}`, (message) => {
                    const newMessages = JSON.parse(message.body);

                    // 메시지 리스트를 업데이트하면 실시간으로 메시지가 화면에 뜸
                    setMessages((prev) => [...prev, newMessages]);
                });
            },
        });

        client.current.activate();  // 연결 시작

        return () => {
            client.current?.deactivate();  // 나갈 때 연락 끊기
        };
    }, [roomInfo.roomId]);

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

    // #######################################
    // 해당 방의 메시지를 가져오는 로직
    // #######################################
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await api.get(`/chatrooms/${roomInfo.roomId}/messages`);

                // 메시지 불러온거 세팅하기
                setMessages(response.data);
            } catch (error) {
                console.error("채팅 내역 로딩 실패: ", error);
            }
        };

        if (roomInfo.roomId) {
            fetchChatHistory();
        }

    }, [roomInfo.roomId])

    // ##################################################
    // 전송 버튼 함수
    // ##################################################
    const handleSend = async () => {
        // 유효성 검사
        if (!inputText.trim() && pendingFiles.length === 0) return;

        try {
            // FormData 생성 (텍스트와 파일)
            const formData = new FormData();
            formData.append("roomId", roomInfo.roomId);
            formData.append("message", inputText.trim());
            formData.append("sender", currentUser?.email ?? "");

            pendingFiles.forEach((p) => {
                formData.append("files", p.file);   // 서버의 RequsePart랑 이름 맞춰야함
            });

            // 서버 전송(서버로 보내면 WebSocket subscribu가 담당)
            await api.post(`/chatrooms/${roomInfo.roomId}/send`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // 성공 시 입력창 비우기
            setInputText("");
            setPendingFiles([]); 
        } catch(error) {
            console.error("전송 에러: ", error);
            setModalMessage("메시지 전송에 실패했습니다.");
            setModalShow(true);
        }
    };

    const handleFileUpload = (file: File, type: "IMAGE" | "VIDEO" | "FILE") => {
        // 임시 미리보기 URL 생성
        const tempUrl = URL.createObjectURL(file);
        const newFile = {
            id: Math.random().toString(36).substring(2, 11),    // 고유 ID 추가
            file,
            type,
            previewUrl: tempUrl
        };

        // 메시지로 바로 보내지 않고 대기 상태에 저장
        setPendingFiles(prev => [...prev, newFile]);
    };

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

    const handleCancelFile = (id: string) => {
        setPendingFiles(prev => prev.filter(f => f.id !== id));
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
                                        {/* 메시지 타입별 렌더링 */}
                                        <div className={`max-w-[300px] overflow-hidden shadow-sm ${msg.messageType === 'TEXT'
                                            ? `px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words ${isMine ? 'bg-[#FFF9ED] font-semibold rounded-tr-none' : 'bg-[#743F24] bg-opacity-20 font-semibold rounded-tl-none'
                                            }`
                                            : ''    // 이미지나 파일일 때는 배경색과 패딩을 별도로
                                            }`}>

                                            {/* 이미지 메시지 */}
                                            {msg.messageType === 'IMAGE' && (
                                                <div className="rounded-xl overflow-hidden border border-gray-100">
                                                    <img
                                                        src={msg.fileUrl} alt="첨부 이미지"
                                                        className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform"
                                                    />
                                                </div>
                                            )}

                                            {/* 비디오 메시지 */}
                                            {msg.messageType === "VIDEO" && (
                                                <div className="rounded-xl overflow-hidden border border-gray-100 bg-black">
                                                    <video src={msg.fileUrl} controls className="w-full" />
                                                </div>
                                            )}

                                            {/* 일반 파일 메시지 */}
                                            {msg.messageType === 'FILE' && (
                                                <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isMine ? 'bg-white border-[#B5A492]' : 'bg-gray-50 border-gray-200'
                                                    }`}>
                                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xl">📄</span>
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden text-left">
                                                        <span className="text-sm font-bold truncate max-w-[150px]">{msg.message}</span>
                                                        <span className="text-[10px] text-gray-500 font-medium">문서 파일</span>
                                                    </div>
                                                    <a href={msg.fileUrl} download={msg.message} className="ml-2 text-gray-400 hover:text-gray-600">
                                                        ⬇️
                                                    </a>
                                                </div>
                                            )}

                                            {/* 기존 텍스트 메시지 */}
                                            {msg.messageType === "TEXT" && msg.message}

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
                    onFileUpload={handleFileUpload}
                    pendingFiles={pendingFiles}
                    onCancelFile={handleCancelFile}
                />
            </div>

            {/* 모달 컴포넌트 */}
            <AlertModal 
                show={modalShow}
                onHide={() => setModalShow(false)}
                title="알림"
                message={modalMessage}
            />
        </>
    );
};
export default ChatWindow;