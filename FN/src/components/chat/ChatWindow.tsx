import React, { StrictMode, useEffect, useRef } from "react";
import { useState } from "react";
import { Client } from "@stomp/stompjs";

import type { ChatMessageDto, ChatRoomDto } from "../../types/chat";
import type { User } from "../../context/AuthContext";
import api from "../../api/api";

import ChatSearchHeader from "./ChatSearchHeader";
import AlertModal from "../common/AlertModal";

import ChatInputSection from "./ChatInputSection";

import ChatMessageList from "./ChatMessageList";

import stat_minus from "@/assets/image/stat_minus.png";


interface ChatWindowProps {
    roomInfo: ChatRoomDto;
    currentUser: User | null;
}

const ChatWindow = ({ roomInfo, currentUser }: ChatWindowProps) => {

    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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

        // localStorage에서 직접 토큰을 꺼내온다
        const token = localStorage.getItem("accessToken");

        // 현재 브라우저가 접속한 프로토콜(http/https)에 맞춰 ws/wss 결정
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // 현재 브라우저 주소창의 호스트(localhost:5173_리액트 vite 주소)를 자동으로 가져옴
        const host = window.location.host

        // 웹 소켓 클라이언트 설정
        client.current = new Client({

            // /ws는 EndPoint, /websocket은 순수 소켓 연결을 위한 STOMP 표준 주소
            brokerURL: `${protocol}//${host}/ws`,
            connectHeaders: {
                // Authorization: token ? `Bearer ${token}` : ""        // 유저 기능이랑 토큰관련 백엔드 로직 끝나면 추가해야함
            },

            // 연결 성공 시 로직
            onConnect: () => {
                console.log("웹 소켓 클라이언트 연결 성공!");

                // 해당 방을 구독(누가 메시지를 보내면 나한테 알려달라고 구독 신청), `/topic/chat/${roomInfo.roomId}는 ChatController에서 잡아논 주소
                client.current?.subscribe(`/sub/chat/${roomInfo.roomId}`, (message) => {
                    console.log("메시지 원본: ", message.body);
                    
                    const newMessages = JSON.parse(message.body);

                    console.log("수신 데이터: ", newMessages);
                    // 메시지 리스트를 업데이트하면 실시간으로 메시지가 화면에 뜸
                    setMessages((prev) => {
                        // 이미 리스트에 있는 ID라면 추가하지 않음
                        if(prev.some(m => m.messageId === newMessages.messageId)) return prev;
                        return [...prev, newMessages];
                    });
                });
            },
            // 콘솔에서 통신 과정 다 볼 수 있음
            debug: (str) => console.log(str),
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
                // 데이터가 최신 -> 과거 순으로 오므로 
                // 프론트엔드 화면에 마자게 과거 -> 최신순으로 뒤집는다
                const sortedMessages = [...response.data].reverse();
                setMessages(sortedMessages);
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
            formData.append("messageType", "TEXT");

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
        } catch (error) {
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
                <ChatMessageList 
                    messages={messages}
                    currentUser={currentUser}
                    scrollRef={scrollRef}
                    messagesEndRef={messagesEndRef}
                    messageRefs={messageRefs}
                    handleScroll={handleScroll}
                />


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