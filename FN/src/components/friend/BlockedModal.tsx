import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

interface BlockedUser {
    email: string;
    nickname: string;
}

const BlockedListModal = ({ onClose }: { onClose: () => void }) => {
    const { user } = useAuth();
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    // 🔹 차단 목록 조회
    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const response = await api.get("/friends/blocked-list");
                setBlockedUsers(response.data);
            } catch (error) {
                console.error("차단 목록 조회 실패", error);
                setMessage("차단 목록을 불러오지 못했습니다.");
            }
        };

        fetchBlockedUsers();
    }, [user?.email]);

    // 🔹 차단 해제
    const handleUnblock = async (targetEmail: string) => {
        try {
            await api.delete(`/friends/unblock?targetEmail=${targetEmail}`);

            // 리스트에서 제거
            setBlockedUsers(prev =>
                prev.filter(user => user.email !== targetEmail)
            );

            setMessage(`${targetEmail}님의 차단을 해제했습니다.`);
        } catch (error) {
            setMessage("차단 해제에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-xl p-6">
                
                <div className="relative flex justify-center mb-4">
                    <h3 className="text-xl font-bold">차단 목록</h3>
                    <button 
                        onClick={onClose}
                        className="absolute right-0 text-gray-600 hover:text-gray-900 font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* 🔹 상태 메시지 */}
                {message && (
                    <div className="mb-4 text-center text-sm text-[#8B4513] font-medium">
                        {message}
                    </div>
                )}

                <div className="max-h-[300px] overflow-y-auto">
                    {blockedUsers.length > 0 ? (
                        blockedUsers.map(user => (
                            <div
                                key={user.email}
                                className="flex items-center justify-between p-3 border-b border-gray-100"
                            >
                                <div>
                                    <p className="font-bold text-[#4A2C2A]">
                                        {user.nickname}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleUnblock(user.email)}
                                    className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                                >
                                    차단 해제
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-10 text-gray-400">
                            차단한 사용자가 없습니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockedListModal;