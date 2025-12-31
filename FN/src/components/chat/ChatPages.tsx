import React, {useState} from 'react';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
    const { user } = useAuth();

    // 가짜 방 목록
    const [rooms] = useState([
        {id: '1', roomName: '코코넛톡 테스트방1', lastMessage: '자 이제 시작이야!', unreadCount: 2},
        {id: '2', roomName: '테스트톡 코코넛방2', lastMessage: '내 꿈을 내 꿈을 위한 여행', unreadCount: 1}
    ]);

    return(
        <>
            <div>
                
            </div>        
        </>
    )
}