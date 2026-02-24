import { useState, useRef, useEffect } from 'react';
import more_vert from "@/assets/image/more_vert.png";
import coconuttalk from "@/assets/image/coconuttalk.png";
import stat_minus from "@/assets/image/stat_minus.png";
import ChatDropdownMenu from "./ChatDropdownMenu";
import api from "@/api/api";
import type { ChatRoomDto } from "../../types/chat";
import { useModal } from '@/context/ModalContext';
import MemberManagementModal from './MemberManagementModal';
import { useAuth } from '@/context/AuthContext';

interface Props {
    isSearchMode: boolean;
    setIsSearchMode: (v: boolean) => void;
    roomInfo: ChatRoomDto;
    searchQuery: string;
    searchResults: string[];
    currentSearchIndex: number;
    handleSearch: (q: string) => void;
    moveSearchIndex: (d: 'next' | 'prev') => void;
    handleCloseSearch: () => void;
    isChatDropdownOpen: boolean;
    setChatIsDropdownOpen: (v: boolean) => void;
    chatDropdownRef: React.RefObject<HTMLDivElement | null>;
    onRoomInfoUpdate?: (updatedRoom: ChatRoomDto) => void;  // 방 정보가 변경되었을 때 부모에게 알리는 함수 추가
}

const ChatSearchHeader = ({
    isSearchMode, setIsSearchMode, roomInfo, searchQuery, searchResults,
    currentSearchIndex, handleSearch, moveSearchIndex, handleCloseSearch,
    isChatDropdownOpen, setChatIsDropdownOpen, chatDropdownRef, onRoomInfoUpdate
}: Props) => {

    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(roomInfo.roomName);
    const inputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();

    const { showAlert, showConfirm } = useModal();

    const [ isMemberModalOpen, setIsMemberModalOpen ] = useState(false);
    const [ isInviteModalOpen, setIsInviteModalOpen ] = useState(false);

    // 드롭다운에서 '멤버 관리하기' 클릭 시
    const handleOpenManageModal = () => {
        setIsMemberModalOpen(true); // 모달은 열고
        setChatIsDropdownOpen(false);   // 메뉴는 닫기
    };

    // 드롭다운에서 '대화상대 초대 클릭 시'
    const handleOpenInviteModal = () => {
        setIsInviteModalOpen(true);
        setChatIsDropdownOpen(false);
    }

    // 방 정보가 바뀌면 입력 필드 상태도 업데이트
    useEffect(() => {
        setEditedName(roomInfo.roomName);
    }, [roomInfo.roomName]);

    // 수정 모드 진입 시 포커스
    useEffect(() => {
        if (isEditingName && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditingName]);

    // 방 이름 변경 API 호출
    const hanldeNameSubmit = async () => {
        // 이름이 비어있거나 변경사항이 없으면 리턴
        if (editedName.trim() === "" || editedName === roomInfo.roomName) {
            setIsEditingName(false);
            setEditedName(roomInfo.roomName);
            return;
        }

        try {
            await api.patch(`/chatrooms/${roomInfo.roomId}/name`, {
                roomName: editedName
            });

            // 성공 시 로컬 객체 업데이트 및 부모에게 전달
            const updatedRoom = { ...roomInfo, roomName: editedName };
            if (onRoomInfoUpdate) {
                onRoomInfoUpdate(updatedRoom);
            }
            setIsEditingName(false);
        } catch (error) {
            showAlert("변경 실패", "방 이름 번경에 실패했습니다.");
            setEditedName(roomInfo.roomName);
            setIsEditingName(false);
        }
    }

    const handleLeaveRoom = async () => {
        showConfirm(
            "채팅방 나가기",
            "정말 이 채팅방을 나가시겠습니까?",
            async () => {
                // 확인을 눌렀을 때 실행되는 로직
                try {
                    await api.post(`/chatrooms/${roomInfo.roomId}/leave`, null, {
                        params: {
                            userEmail: user?.email
                        }
                    })

                    // 성공 알림 후 새로고침 
                    showAlert("성공", "채팅방에서 나갔습니다.");

                    window.location.href = "/chatPage";
                } catch(error) {
                    console.error("방 나가기 에러", error);
                    showAlert("오류", "방 나가기에 실패했습니다.");
                }
            }
        )
    }

    console.log("현재 방 정보(roomInfo): ", roomInfo);

    return (
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
                                <img src={coconuttalk} alt="코코넛톡 기본 이미지" />
                            )}
                        </div>

                        {/* 방 이름 및 인원수 and Search Icon */}
                        <div className="flex items-center min-w-0">
                            {isEditingName ? (
                                <input
                                    ref={inputRef}
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={hanldeNameSubmit}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') hanldeNameSubmit();
                                        if (e.key === 'Escape') {
                                            setIsEditingName(false);
                                            setEditedName(roomInfo.roomName);
                                        }
                                    }}
                                    className='font-bold text-[#4A3F35] leading-none border-b-2 border-[#B5A492] outline-none bg-transparent'
                                    style={{ width: `${Math.max(editedName.length * 14, 50)}px` }}
                                />
                            ) : (
                                <div
                                    className='flex items-center gap-1 cursor-pointer group'
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <span className="font-bold text-[#4A3F35] leading-none">
                                        {roomInfo.roomName}
                                    </span>
                                    <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            )}

                            {/*  인원수 및 멤버 리스트*/}
                            {roomInfo.userCount > 2 && (
                                <div
                                    className="flex items-center ml-2"
                                    onClick={() => setIsMemberModalOpen(true)}    
                                >
                                    <span className="text-xs text-gray-900 p-3">
                                        {roomInfo.userCount}명
                                    </span>
                                    {roomInfo.userCount > 2 && roomInfo.memberNames && roomInfo.memberNames.length > 0 && (
                                        <div className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[250px]">
                                            {roomInfo.memberNames
                                            .slice(0, 5)
                                            .map((member: any) => member.name || member)
                                            .join(", ")
                                            }
                                            {roomInfo.memberNames.length > 5 && "..."}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 검색 아이콘 버튼 */}
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
                            isOwner={user?.email === roomInfo.ownerEmail}   // 방장 여부 전달
                            onInviteClick={handleOpenInviteModal}
                            onManageClick={handleOpenManageModal}
                            onLeaveClick={handleLeaveRoom}
                        />

                        {/* 멤버 관리 모달(강퇴 기능) */}
                        {isMemberModalOpen && (
                            <MemberManagementModal 
                                roomInfo={roomInfo}
                                currentUserEmail={user?.email || ""}
                                isOwner={user?.email === roomInfo.ownerEmail}
                                onClose={() => setIsMemberModalOpen(false)}
                                onUpdate={(updatedRoom) => onRoomInfoUpdate?.(updatedRoom)}
                            />
                        )}

                        {/* 초대하기 모달 */}
                        
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
                                placeholder="메시지 검색"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();         // 페이지 새로고침 

                                        // 검색 결과가 있는 상태(화살표가 있음)에서 엔터를 치면
                                        if (searchResults.length > 0) {
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
    );
};

export default ChatSearchHeader;