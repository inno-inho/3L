import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { BlockedUser } from "@/types/friend";
import { getBlockedUsers, unblockFriend } from '@/api/friendApi';

const FriendBlockedModal = ({ onClose }: { onClose: () => void }) => {
    const { user } = useAuth();
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔹 차단 목록 조회
    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                setLoading(true);

                const data = await getBlockedUsers();
                setBlockedUsers(data);

                setError(null);
            } catch (error) {
                console.error("차단 목록 조회 실패", error);
                setError("차단 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlockedUsers();
    }, [user?.email]);

    // 🔹 차단 해제
    const handleUnblock = async (targetEmail: string) => {
        try {
            await unblockFriend(targetEmail);

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
                    <div className="mb-4 text-center text-sm text-red font-medium">
                        {message}
                    </div>
                )}

                <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <p className="text-center py-10 text-gray-400">
                            불러오는 중...
                        </p>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500 font-semibold mb-2">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-sm text-red underline">다시 시도</button>
                        </div>
                    ) : blockedUsers.length === 0 ? (
                        <p className="text-center py-10 text-gray-400">차단한 사용자가 없습니다.</p>
                    ) : (
                        blockedUsers.map(user => (
                            <div
                                key={user.email}
                                className="flex items-center justify-between p-3 border-b border-gray-100"
                            >
                                <div>
                                    <p className="font-bold">
                                        {user.nickname}
                                    </p>
                                    <p className="text-s text-gray-500">
                                        {user.email}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleUnblock(user.email)}
                                    className="border-1 border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm hover:border-[#6F4E37] hover:text-[#6F4E37] hover:bg-[#6F4E37]/20 transition"
                                >
                                    차단 해제
                                </button>
                            </div>
                        ))
                    )}   
                </div>
            </div>
        </div>
    );
};

export default FriendBlockedModal;