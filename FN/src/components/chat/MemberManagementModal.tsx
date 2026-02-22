import React from 'react';
import { useModal } from '@/context/ModalContext';
import api from '@/api/api';
import type { ChatRoomDto } from '../../types/chat';

interface props {
    roomInfo: ChatRoomDto;
    currentUserEmail: string;
    isOwner: boolean;
    onClose: () => void;
    onUpdate: (updatedRoom: ChatRoomDto) => void;
}

const MemberManagementModal = ({ roomInfo, currentUserEmail, isOwner, onClose, onUpdate }: props) => {
    const { showAlert, showConfirm } = useModal();

    // 강퇴처리 
    const handleKick = (targetEmail: string, targetName: string) => {
        showConfirm(
            "멤버 내보내기",
            `${targetName}(${targetEmail})님을 이 방에서 내보내시겠습니까?`,
            async () => {
                try {
                    await api.delete(`/chatrooms/${roomInfo.roomId}/members/${targetEmail}`,{
                        params: {requestUserEmail: currentUserEmail}
                    });

                    // 성공 시 로컬 상태 업데이트(화면 반영)
                    const updatedMembers = roomInfo.memberNames.filter(member => member.email !== targetEmail)
                    const updatedRoom = {
                        ...roomInfo,
                        memberNames: updatedMembers,
                        userCount: updatedMembers.length
                    };
                    
                    showAlert("성공", `${targetName}님을 강퇴했습니다.`);
                    onUpdate(updatedRoom);

                } catch (error) {
                    showAlert("오류", "강퇴 처리에 실패했습니다.");
                } 
            }
        );
    };



    return (
        <>
            <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50'>
                <div className='w-[350px] bg-white rounded-2xl overflow-hidden shadow-2xl'>
                    <div className='p-5 border-b border-gray-100 flex justify-between items-center'>
                        <h3 className='font-bold text-[#4A3F35]'>멤버 관리</h3>
                        <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>X</button>
                    </div>

                    <div className='max-h-[400px] overflow-y-auto p-2'>
                        {roomInfo.memberNames?.map((member) => (
                            <div key={member.email} className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#B5A492] font-bold'>
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <div className='text-sm font-semibold text-[$4A3F35]'>
                                            {member.name}
                                            {member.email === roomInfo.ownerEmail && <span className='ml-2 text-[10px] bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded'>방장</span>}
                                            {member.email === currentUserEmail && <span className='ml-1 text-[10px] text-gray-400'>(나)</span>}
                                        </div>
                                        <div className='text-[11px] text-gray-400'>{member.email}</div>
                                    </div>
                                </div>

                                {/* 방장이고 본인이 아닐 때에만 '내보내기' 버튼 노출 */}
                                {isOwner && member.email !== currentUserEmail && (
                                    <button
                                        onClick={() => handleKick(member.email, member.name)}
                                        className='text-[11px] text-red-400 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors'
                                    >
                                        내보내기
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>  
        </>
    )
}

export default MemberManagementModal;


