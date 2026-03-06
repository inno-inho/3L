import React from "react";
import { useEffect, useState } from "react";
import api from "@/api/api";

import coconuttalk from "@/assets/image/coconuttalk.png";
import { useModal } from '../../context/ModalContext';
import { UserPlus, Ban, Check, Clock, X, UserMinus } from "lucide-react"; // 아이콘 라이브러리

interface ProfileModalProps {
    userEmail: string;
    userName: string;
    profileImg?: string;
    onClose: () => void;
}


const ProfileModal = ({ userEmail, userName, profileImg, onClose }: ProfileModalProps) => {

    const [status, setStatus] = useState("LOADING"); // NONE, PENDING, ACCEPTED, BLOCKED, ME가 있음

    const { showAlert, showConfirm } = useModal();

    useEffect(() => {
        // API 호출로 현재 관계 상태 가져오기
        api.get(`/friends/relation-status?targetEmail=${userEmail}`)
            .then(res => setStatus(res.data));
    }, [userEmail]);

    // API 통신을 담당하는 공통 함수
    const executeAction = async (actionType: string) => {
        try {
            let successMessage = "";
            if (actionType === 'REQUEST') {
                await api.post(`/friends/request?targetEmail=${userEmail}`);
                successMessage = "친구 신청을 성공적으로 보냈습니다.";
            } else if (actionType === 'BLOCK') {
                await api.post(`/friends/block?targetEmail=${userEmail}`);
                successMessage = "해당 사용자를 차단했습니다.";
            } else if (actionType === 'DELETE') {
                await api.delete(`/friends/delete?friendEmail=${userEmail}`);
                successMessage = "친구 관계를 해제했습니다.";
            }

            // 성공 알림 모달 띄우기
            showAlert("성공", successMessage);

            // 상태 재 조회
            const res = await api.get(`/friends/relation-status?targetEmail=${userEmail}`);
            setStatus(res.data);
        } catch(error) {
            console.error("요청 중 오류", error);
            showAlert("오류", "요청을 처리하는 중 문제가 발생하였습니다.");
        }
    }

    const handleActionClick = (actionType: string) => {
        let title = "";
        let message = "";

        if (actionType === 'REQUEST') {
            title = "친구 추가";
            message = `${userName}님께 친구 신청을 보내시겠습니까?`;
        } else if (actionType === 'BLOCK') {
            title = "사용자 차단";
            message = `${userName}님을 차단하시겠습니까?\n차단 시 서로 메시지를 주고 받을 수 없습니다.`;
        } else if (actionType === 'DELETE') {
            title = "친구 삭제";
            message = `${userName}님과 친구 관계를 해제하시겠습니까?`;
        }

        showConfirm(title, message, () => {
            executeAction(actionType);
        });
    }

    return (
        <>
            <div 
                className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4" 
                onClick={onClose}
            >
                <div 
                    className="relative flex w-full max-w-[320px] flex-col items-center overflow-hidden rounded-2xl bg-[#fff9ed] pt-12 pb-8 shadow-2xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 닫기 버튼 */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-[#4A3F35] hover:opacity-60 transition-opacity"
                    >
                        <X size={24} />
                    </button>

                    {/* 중앙 프로필 섹션 */}
                    <div className="flex flex-col items-center">
                        <div className="mb-4 h-28 w-28 overflow-hidden rounded-[40px] border-2 border-white/20 bg-white shadow-lg">
                            <img 
                                src={profileImg || coconuttalk}
                                alt="profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-[#4A3F35]">{userName}</h3>
                        <p className="mt-1 text-sm text-[#4A3F35]">{userEmail}</p>
                    </div>

                    {/* 하단 액션 버튼들 */}
                    <div className="mt-10 flex w-full items-center justify-center gap-12 border-t border-white/20 pt-6">

                        {/* 상태별 버튼 분기 처리 */}
                        {status === "NONE" && (
                            <button
                                onClick={() => handleActionClick('REQUEST')}
                                className="group flex flex-col items-center gap-2 text-[#4A3F35] hover:opacity-70"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4A3F35]/5 group-hover:bg-[#4A3F35]/10">
                                    <UserPlus size={22} />
                                </div>
                                <span className="text-xs font-medium">친구 추가</span>
                            </button>
                        )}

                        {/* 친구 요청 중 */}
                        {status === "PENDING" && (
                            <div className="flex flex-col items-center gap-2 text-[#4A3F35]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                                    <Clock size={20} />
                                </div>
                                <span className="text-xs">친구 요청 중</span>
                            </div>
                        )}

                        {/* 이미 친구 */}
                        {status === "ACCEPTED" && (
                            <button
                                onClick={() => handleActionClick('DELETE')}
                                className="group flex flex-col items-center gap-2 text-[#4A3F35] hover:opacity-70"
                            >
                                <div className="flex w-12 h-12 items-center justify-center rounded-full bg-yellow-400 text-[#4A3F35] shadow-sm group-hover:bg-yellow-500">
                                    <UserMinus size={22} />
                                </div>
                                <span className="text-xs font-medium">친구 삭제</span>
                            </button>
                        )}

                        {/* 차단하기 (자기 자신이 아닐 때만) */}
                        {status !== "ME" && (
                            <button
                                onClick={() => handleActionClick('BLOCK')}
                                className="group flex flex-col items-center gap-2 text-red-500 hover:opacity-70"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 group-hover:bg-red-500/20">
                                    <Ban size={18}/>
                                </div>
                                <span className="text-xs font-medium">차단하기</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileModal;