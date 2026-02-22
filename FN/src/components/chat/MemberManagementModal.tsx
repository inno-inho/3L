import { useState } from 'react';
import api from '@/api/api';
import { useModal } from '@/context/ModalContext';
import type { ChatRoomDto } from '@/types/chat';

interface props {
    roomInfo: ChatRoomDto;
    onClose: () => void;
    onUpdate: () => void;
    currentUserEmail: string; // 방장 확인용
}

const MemberManagementModal = ({ roomInfo, onClose, onUpdate, currentUserEmail }: props) => {
    const { showAlert, showConfirm } = useModal();
    const [loading, setLoading] = useState(false);

    // 강퇴처리 
    const handleKick = (targetEmail: string, targetName: string) => {
        showConfirm(
            "멤버 강퇴",
            `${targetName}(${targetEmail})님을 이 방에서 내보내시겠습니까?`,
            async () => {
                try {
                    setLoading(true);
                    await api.delete(`/chatrooms/${roomInfo.roomId}/members/${targetEmail}`,{
                        params: {requestUserEmail: currentUserEmail}
                    });
                    showAlert("성공", `${targetName}님을 강퇴했습니다.`);
                    onUpdate();     // 목록 새로고침
                } catch (error) {
                    showAlert("오류", "강퇴 처리에 실패했습니다.");
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    // 초대 처리

    return (
        <>
            <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4'>
                <div className='bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200'>
                    {/* 헤더 */}
                    <div className="bg-[#F8F6F2] px-6 py-4 border-b border-[#E5E0D8] flex justify-between items-center">
                        <h2 className="font-bold text-[#4A3F35]">채팅방 멤버 관리</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default MemberManagementModal;


