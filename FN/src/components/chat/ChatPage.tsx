import React, {useState} from 'react';
import { useAuth } from '../../context/AuthContext';

import ChatSidebar from '../common/ChatSidebar';
import ChatRoomList from './ChatRoomList';
import ChatEmptyState from './ChatEmptyState';
import ChatWindow from './ChatWindow';
import type { ChatRoomDto } from '../../types/chat';

// 채팅방 가짜 데이터
const dummyRooms: ChatRoomDto[] = [
    {
        roomId: '1',
        roomName: '코코넛톡 테스트방1',
        chatRoomType: 'GROUP',
        lastMessage: '자 이제 시작이야!',
        lastMessageTime: '오후 4:32',
        unreadCount: 3,
        userCount: 4,
        roomImageUrls: ['https://via.placeholder.com/20', 'https://via.placeholder.com/20']
    },
    {
        roomId: '2',
        roomName: '테스트톡 코코넛방2',
        chatRoomType: 'FRIEND',
        lastMessage: '내 꿈을 위한 여행',
        lastMessageTime: '오전 4:32',
        unreadCount: 10,
        userCount: 2,
        roomImageUrls: ['https://via.placeholder.com/20']
    }
];

const ChatPage = () => {
    const { user } = useAuth();     // 로그인한 유저 정보 가져오기
    const [ selectedRoomId, setSelectedRoomId ] = useState<string | null>(null);    // 처음 입장시에는 채팅방 선택 안되있음

    // 선택된 ID를 바탕으로 실제 방 정보 찾기
    const selectedRoom = dummyRooms.find(r => r.roomId === selectedRoomId);

    return(
        <>
            <div className='flex h-[calc(100vh-100px)] w-full overflow-hidden p-4 gap-4'>
                {/* ChatSidebar 내 프로필 이미지를 보여주기위해 user 전달 */}
                <ChatSidebar currentUser={user} />
                
                <ChatRoomList 
                    rooms={dummyRooms}
                    selectedId={selectedRoomId}
                    onSelect={setSelectedRoomId}
                />

                {/* 선택된 방이 있을 때만 ChatWindow를 띄움 */}
                {selectedRoomId && selectedRoom ? (
                    <ChatWindow
                        key={selectedRoom.roomId} 
                        roomInfo={selectedRoom}
                        currentUser = {user}
                    />
                ) : (
                    <ChatEmptyState />
                )}

            </div>
        </>
    );
};

export default ChatPage;