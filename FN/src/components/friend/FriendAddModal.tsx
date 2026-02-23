import React, { useState } from 'react';
import api from '@/api/api';
import { useModal } from '@/context/ModalContext';

const FriendAddModal = ({ onClose }: { onClose: () => void }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useModal();

    // 유저 검색 요청
    const handleSearch = async () => {
        if (!keyword.trim()) return;
        try {
            const response = await api.get(`/friends/search?keyword=${keyword}`);
            setResults(response.data);
        } catch (error) {
            console.error('검색 실패:', error);
            showAlert(
                "검색 실패",
                "유저 검색에 실패했습니다."
            );
        }
    }

    // 친구 신청 요청 
    const handleRequest = async (email: string) => {
        try {
            await api.post(`/friends/request?targetEmail=${email}`);
            showAlert(
                "친구 신청",
                "친구 신청을 완료했습니다."
            );
        } catch (error) {
            showAlert(
                "친구 신청",
                "친구 신청에 실패했습니다."
            );
        };
    }

    return (
        <>
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
                <div className="bg-white w-102 p-5 rounded-[24px] shadow-2xl border-2 border-[#8B4513]">
                    <h3 className="font-bold text-[#5D4037] mb-4 text-center">새로운 친구 찾기</h3>

                    {/* 검색 바 */}
                    <div className="flex gap-2 mb-4 bg-[#F5F5F5] p-2 rounded-xl">
                        <input
                            className="bg-transparent flex-1 outline-none text-sm px-1"
                            placeholder="닉네임 또는 이메일"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="text-sm font-bold text-[#8B4513]">검색</button>
                    </div>

                    {/* 결과 리스트 */}
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <p className="text-center text-xs text-gray-400 py-4">검색 중...</p>
                        ) : results.length > 0 ? (
                            results.map(user => (
                                <div key={user.email} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">{user.nickname}</span>
                                        <span className="text-[10px] text-gray-400">{user.email}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRequest(user.email)}
                                        className="bg-[#8B4513] text-white px-3 py-1 rounded-full text-xs hover:bg-[#6F3611]"
                                    >
                                        신청
                                    </button>
                                </div>
                            ))
                        ) : (
                            keyword && !loading && <p className="text-center text-xs text-gray-400 py-4">검색 결과가 없습니다.</p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                        취소
                    </button>
                </div>
            </div>
        </>
    )
}


export default FriendAddModal;