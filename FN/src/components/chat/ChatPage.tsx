import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import Sidebar from '../common/Sidebar';
import ChatRoomList from './ChatRoomList';
import ChatEmptyState from './ChatEmptyState';
import ChatWindow from './ChatWindow';
import CreateChatRoomModal from './CreateChatRoomModal';
import api from '../../api/api';

import type { ChatRoomDto } from '../../types/chat';
import { useModal } from '../../context/ModalContext';

// 채팅방 가짜 데이터
// const dummyRooms: ChatRoomDto[] = [
//     {
//         roomId: '1',
//         roomName: '코코넛톡 테스트방1코코넛코코넛코코넛',
//         chatRoomType: 'GROUP',
//         lastMessage: '자 이제 시작이야!',
//         lastMessageTime: '오후 4:32',
//         unreadCount: 3,
//         userCount: 4,
//         roomImageUrls: ['https://via.placeholder.com/20', 'https://via.placeholder.com/20']
//     },
//     {
//         roomId: '2',
//         roomName: '테스트톡 코코넛방2',
//         chatRoomType: 'FRIEND',
//         lastMessage: '내 꿈을 위한 여행',
//         lastMessageTime: '오전 4:32',
//         unreadCount: 10,
//         userCount: 2,
//         roomImageUrls: ['https://via.placeholder.com/20']
//     }
// ];

const ChatPage = () => {
    const { user } = useAuth();     // 로그인한 유저 정보 가져오기
    // 공용 모달 상태 관리
    const { showAlert } = useModal();
    
    //
    // 방 목록 상태
    const [rooms, setRooms] = useState<ChatRoomDto[]>([]);
    // 처음 입장시에는 채팅방 선택 안되있음
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);    
    // 모달 상태 관리
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
     
    // selectedRoomId와 일치하는 방 객체 설정
    const selectedRoom = rooms.find(r => r.roomId === selectedRoomId);

    // 방 목록 가져오기 함수(최초 로드와 생성 후 재호출용)
    const fetchRooms = useCallback(async () => {
        if(!user?.email) return;

        try {
            // 내 이메일을 파라미터로 보내서 내가 속한 방 목록을 가져옴
            const response = await api.get(`/chatrooms?email=${user.email}`);
            console.log("API 응답 데이터: ", response.data);
            setRooms(response.data);
        } catch(error) {
            console.log("방 목록 로딩 실패: ", error);
        } 
    }, [user?.email]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);
    
    // 방 만들기 버튼 클릭 시 실행될 함수
    const handleRoomCreate = async (roomName: string, selectedEmails: string[]) => {
        try {
            // 서버에 보낼 데이터 구성
            const payload = {
                roomName: roomName,
                // 초대한 친구들 + 나 자신(방장)의 이메일 포함
                memberEmails: [...selectedEmails, user?.email]
            };

            // 서버에 저장 요청
            const response = await api.post('/chatrooms', payload);   
            
            // 백엔드에서 생성된 ChatRoomDto를 통째로 넘기기
            const newRoomId: ChatRoomDto = response.data;

            // 서버에서 최신 목록 가져오기(만든 순서 정렬 반영)
            await fetchRooms();
            
            // 모달 닫기
            setIsCreateModalOpen(false);
            showAlert("생성 완료", `'${roomName}'방이 만들어졌습니다.`);


            // 목록을 다시 불러오지 않고 상태만 업데이트해서 성능 최적화
            // setRooms(prev => [newRoomId, ...prev]);

            // 만든 새 방을 선택 상태로 만들기
            if (newRoomId && newRoomId.roomId) setSelectedRoomId(newRoomId.roomId);
            
    } catch (error) {
        console.log("방 생성 실패: ", error);
        showAlert("오류", "방 생성 중 문제가 발생했습니다.");
    }
};


    return (
        <>
            <div className='flex h-[calc(100vh-100px)] w-full overflow-hidden p-4 gap-4'>
                <ChatRoomList
                    rooms={rooms}
                    selectedId={selectedRoomId}
                    onSelect={setSelectedRoomId}
                    onCreateRomm={() => setIsCreateModalOpen(true)}    // 모달 열기
                />

                {/* 선택된 방이 있을 때만 ChatWindow를 띄움 */}
                {selectedRoomId && selectedRoom ? (
                    <ChatWindow
                        key={selectedRoom.roomId}
                        roomInfo={selectedRoom}
                        currentUser={user}
                    />
                ) : (
                    <ChatEmptyState />
                )}
            </div>

            <CreateChatRoomModal
                show={isCreateModalOpen}
                onHide={() => setIsCreateModalOpen(false)}
                onCreate={handleRoomCreate}
            />
        </>
    );
};

export default ChatPage;