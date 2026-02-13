import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useModal } from '../../context/ModalContext';

// 가짜 친구 데이터
interface Friend {
    email: string;
    nickname: string;
    profile_image_url: string;
}

// 가짜 친구 데이터 목록
const dummyFriends: Friend[] = [
    { email: 'member1@test.com', nickname: '이노', profile_image_url: 'https://via.placeholder.com/40' },
    { email: 'member2@test.com', nickname: '헤렌', profile_image_url: 'https://via.placeholder.com/40' },
    { email: 'member3@test.com', nickname: '사랑해', profile_image_url: 'https://via.placeholder.com/40' },
    { email: 'member4@test.com', nickname: '마니마니', profile_image_url: 'https://via.placeholder.com/40' }
];

interface CreateChatModalProps {
    show: boolean;
    onHide: () => void;
    onCreate: (roomName: string, selectedEmails: string[]) => void;
}

const CreateChatRoomModal = ({ show, onHide, onCreate }: CreateChatModalProps) => {
    const [roomName, setRoomName] = useState("");
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const { showAlert } = useModal();

    // 선택된 사람이 나 제외 2명 이상이면 'GROUP'으로 판단
    const isGroup = selectedEmails.length >= 2;

    // 선택된 친구들의 닉네임 목록 추출
    const selectedFriendNames = dummyFriends.filter(f => selectedEmails.includes(f.email))
                                            .map(f => f.nickname)
                                            .join(", ");

    // 친구 선택/해제 토글
    const toggleFriend = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const handleCreate = () => {
        if (isGroup && !roomName.trim()) {
            showAlert("입력 오류", "채팅방 이름을 입력해 주세요.");
            return
        }
        if (selectedEmails.length === 0) {
            showAlert("입력 오류", "최소 한 명 이상의 친구를 초대해주세요.");
            return;
        }

        // 1:1인데 이름이 없으면 1:1 채팅방 혹은 빈 값 전달(백엔드에서 어차피 가공해놓음)
        const finalName = isGroup ? roomName : (roomName || "1:1 채팅");


        // 부모 컴포넌트(ChatPage)로 데이터 전달
        onCreate(finalName, selectedEmails)

        // 초기화 및 닫기
        setRoomName('');
        setSelectedEmails([]);
        onHide();
    };

    return (
        <>
            <Modal
                show={show} onHide={onHide} centered
                contentClassName='rounded-3xl border-0 shadow-lg'
            >
                <Modal.Header closeButton className='border-0 px-6 pt-6'>
                    <Modal.Title className='font-bold text-[#4A3F35]'>새 채팅방 만들기</Modal.Title>
                </Modal.Header>

                <Modal.Body className='px-6 pb-6'>
                    {/* 방 이름 입력 하는 곳 */}
                    
                    {/* 2명 이상 선택되었을 때만 방 이름 입력란 노출 */}
                    <div className={`mb-4 transition-all ${isGroup ? 'opacity-100' : 'opacity-50'}`}>
                        <label className='block text-sm font-bold text-gray-600 mb-2'>
                            채팅방 이름 {isGroup ? "(필수)" : ""}
                        </label>
                        <input 
                            type='text'
                            className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none transition-all ${isGroup ? 'focus:ring-2 focus:ring-[#B5A492]' : 'cursor-not-allowed'}`}
                            placeholder={isGroup ? "그룹 이름을 입력하세요" : "참여 멤버가 2명 이하일 시 상대방 이름으로 자동 설정됩니다."}
                            value={isGroup ? roomName : ""}
                            onChange={(e) => setRoomName(e.target.value)}
                            disabled={!isGroup}
                        />
                    </div>


                    {/* 친구 선택 하는 곳 */}
                    <div>
                        <label className='block text-sm font-bold text-gray-600 mb-2'>
                            친구 초대 ({selectedEmails.length}명 선택됨)
                        </label>
                        {/* 선택된 멤버 닉네임 보여주는 곳 */}
                        <div className='text-xs text-[#B5A492] font-semibold mb-3 min-h-[1rem]'>
                            {selectedFriendNames ? `초대 멤버: ${selectedFriendNames}` : '초대할 친구를 선택해 주세요.'}
                        </div>
                        <div className='max-h-64 overflow-auto space-y-2 pr-2 custom-scrollbar'>
                            {dummyFriends.map(friend => (       // 친구목록의 가짜 데이터임. 유저관련 기능 만들어지면 수정해야함
                                <div
                                    key={friend.email}
                                    onClick={() => toggleFriend(friend.email)}
                                    className={`flex items-center p-3 rounded-2xl cursor-pointer border transition-all ${selectedEmails.includes(friend.email)
                                        ? 'bg-[#FDF5E6] border-[#B5A492]'
                                        : 'bg-white border-gray-100 hover:bg-gray-50'
                                        }`}
                                >
                                    <img src={friend.profile_image_url} alt={friend.nickname} className='w-10 h-10 rounded-xl mr-3' />
                                    <span className='flex-1 font-semibold text-[#4A3F35]'>{friend.nickname}</span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedEmails.includes(friend.email) ? 'bg-[#B5A492] border-[#B5A492]' : 'border-gray-300'
                                        }`}>
                                        {selectedEmails.includes(friend.email) && <span className='text-white text-xs'>✓</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        onClick={handleCreate}
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
                        방 만들기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateChatRoomModal;