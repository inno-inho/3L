import React, { useState, useEffect } from "react";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";

interface FriendRequestModalProps {
    email: string;
    nickname: string;
}

const FriendRequestModal = ({ onClose, onRefreshFriends }: { onClose: () => void, onRefreshFriends: () => void }) => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<FriendRequestModalProps[]>([]);
    const { showAlert } = useModal();


    useEffect(() => {
        // 나에게 온 요청 목록 조회 API 호출
        const fetchRequests = async () => {
            try {
                const response = await api.get('/friends/pending');
                setRequests(response.data);
            } catch (error) {
                console.error("요청 로드 실패", error);
            }
        };
        fetchRequests();
    }, [user?.email]);

    // 수락/거절 처리 함수
    const handleAction = async (requesterEmail: string, action: 'ACCEPT' | 'REJECT') => {
        try {
            if (action === 'ACCEPT') {
                await api.post(`/friends/accept?requesterEmail=${requesterEmail}`);

                showAlert("친구 요청 수락", `${requesterEmail}님과 친구가 되었습니다!`);
            } else {
                await api.post(`/friends/reject?requesterEmail=${requesterEmail}`);
                
                showAlert("친구 요청 거절", `${requesterEmail}님의 친구 요청을 거절하였습니다.`)
            }

            // 성공 시 리스트에서 제거
            setRequests(prev => prev.filter(req => req.email !== requesterEmail));
            if (action === 'ACCEPT') onRefreshFriends();
        } catch (error) {
            showAlert("친구 요청", "요청 처리에 실패하였습니다.");
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-[400px] rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-[#4A2C2A]">받은 친구 요청</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        X
                    </button>

                    <div className="max-h-[300px] overflow-y-auto">
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <div
                                    key={req.email}
                                    className="flex items-center justify-between p-3 border-b border-gray-100"
                                >
                                    <div>
                                        <p className="font-bold text-[#4A2C2A]">{req.nickname}</p>
                                        <p className="text-xs text-gray-500">{req.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(req.email, 'ACCEPT')}
                                            className="bg-[#8B4513] text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            수락
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.email, 'REJECT')}
                                            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm"
                                        >
                                            거절
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-gray-400">받은 요청이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default FriendRequestModal;