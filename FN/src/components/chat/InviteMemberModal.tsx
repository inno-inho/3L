import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useModal } from '../../context/ModalContext';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';

import coconuttalk from '@/assets/image/coconuttalk.png'
import type { ChatRoomDto } from '@/types/chat';

// 가짜 친구 데이터
interface Friend {
    email: string;
    nickname: string;
    profileImageUrl: string;
}

interface InviteMemberModalProps {
    show: boolean;
    onHide: () => void;
    roomId: string | number;
    currentMemberEmails: string[]; // 현재 방에 있는 사람들 (제외 용도)
    onUpdate: (data: ChatRoomDto) => void;  // 초대 성공 시 콜백
}

const InviteMemberModal = ({ show, onHide, roomId, currentMemberEmails, onUpdate }: InviteMemberModalProps) => {
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const { showAlert } = useModal();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();

    // 이 모달이 열릴 때마다 실시간으로 친구 목록을 가져온다
    useEffect(() => {
        if (show) {
            fetchFriends();
            setSelectedEmails([]);  // 이 모달 열 때마다 선택 초기화
        }
    }, [show]);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const response = await api.get<Friend[]>('/friends/list');
            
            // 이미 방에 있는 멤버는 목록에서 제외
            const inviteableFriends = response.data.filter(
                friend => !currentMemberEmails.includes(friend.email)
            );
            setFriends(inviteableFriends);
        } catch(error) {
            console.error("친구 목록 조회 에러:", error);
            showAlert("데이터 로드 실패", "친구 목록을 가져오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    };


    // 친구 선택/해제 토글
    const toggleFriend = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const handleInvite = async () => {
        if (selectedEmails.length === 0) {
            showAlert("친구 초대", "초대할 친구를 선택해주세요.");
            return;
        }

        if (!user?.email) {
            showAlert("오류", "로그인 정보를 찾을 수 없습니다.")
            return;
        }

        try {
            // 초대 요청 전송
            await api.post(`/chatrooms/${roomId}/invite-update`, {
                inviteeEmails: selectedEmails,
                requesterEmail: user.email
            });

            // 초대가 성공했으니 갱신된 방 정보를 요청
            const response = await api.get<ChatRoomDto>(`/chatrooms/${roomId}?email=${user.email}`);

            // 부모한테서 받은 상태 변경 함수 (onUpdate) 실행
            // Header의 roomInfo가 바뀌면서 인원수 등이 즉시 갱신됨
            if (onUpdate) {
                onUpdate(response.data);
            }

            showAlert("성공", "멤버를 초대했습니다.");
            onHide();
        } catch(error) {
            console.error("초대 실패", error);
            showAlert("실패", "멤버 초대에 실패했습니다.");
        }
    };

    return (
        <>
            <Modal
                show={show} onHide={onHide} centered
                contentClassName='rounded-3xl border-0 shadow-lg'
            >
                <Modal.Header closeButton className='border-0 px-6 pt-6'>
                    <Modal.Title className='font-bold text-[#4A3F35]'>멤버 초대하기</Modal.Title>
                </Modal.Header>

                <Modal.Body className='px-6 pb-6'>
                    <div className='max-h-80 overflow-auto space-y-2 custom-scrollbar'>
                        {isLoading ? (
                            <div className='text-center py-10 text-gray-400'>불러오는 중...</div>
                        ) : friends.length === 0 ? (
                            <div className='text-center py-10 text-gray-400'>초대할 수 있는 친구가 없습니다</div>
                        ) : (
                            friends.map(friend => (
                                <div
                                    key={friend.email}
                                    onClick={() => toggleFriend(friend.email)}
                                    className={`flex items-center p-3 rounded-2xl cursor-pointer border transition-all ${
                                        selectedEmails.includes(friend.email)
                                            ? 'bg-[#FDF5E6] border-[#B5A492]'
                                            : 'bg-white border-gray-100 hover:bg-gray-50'
                                    }`}
                                >
                                    <img 
                                        src={friend.profileImageUrl || coconuttalk}
                                        className='w-10 h-10 rounded-xl mr-3 object-cover'
                                    />
                                    <span className='flex-1 font-semibold text-[#4A3F35]'>{friend.nickname}</span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                        selectedEmails.includes(friend.email) ? 'bg-[#B5A492] border-[#B5A492]' : 'border-gray-300'
                                    }`}>
                                        {selectedEmails.includes(friend.email) && <span className='text-white text-[10px]'>✓</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className='border-0 px-6 pb-6'>
                    <Button
                        onClick={onHide}

                        style={{
                            backgroundColor: '#fff9ed', // bg-gray-100
                            border: '1px',             // border-0
                            color: 'gray',            // text-gray-500
                            borderRadius: '0.75rem',     // rounded-xl
                            paddingLeft: '1rem',         // px-4
                            paddingRight: '1rem',
                            paddingTop: '0.5rem',        // py-2
                            paddingBottom: '0.5rem',
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleInvite}
                        style={{
                            backgroundColor: '#743F24',
                            border: 'none',
                            color: 'white',
                            borderRadius: '0.75rem',   // rounded-xl
                            paddingLeft: '1.5rem',     // px-6
                            paddingRight: '1.5rem',
                            paddingTop: '0.5rem',      // py-2
                            paddingBottom: '0.5rem',
                            fontWeight: '700',         // font-bold
                        }}

                    >
                        초대하기 ({selectedEmails.length})명
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default InviteMemberModal;