import { useState } from 'react';
import { searchUsers, requestFriend } from "@/api/friendApi";

const FriendAddModal = ({ onClose }: { onClose: () => void }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]); // 친구 검색창 빈배열상태
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(""); // 검색 에러
    const [requestedEmails, setRequestedEmails] = useState<string[]>([]);
    const [requestError, setRequestError] = useState(""); // 친구 신청 에러
    
    
    // 유저 검색 요청
    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setLoading(true);
        setSearchError("");

        try {
            const users = await searchUsers(keyword); 
            setResults(users);
        } catch (error) {
            console.error('검색 실패:', error);
            setSearchError("검색에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 친구 신청 요청 
    const handleRequest = async (email: string) => {
        try {
            await requestFriend(email);

            setRequestError(""); 
            setRequestedEmails(prev => [...prev, email]);
        } catch(error) {
            setRequestError("친구 신청에 실패했습니다.");
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
                <div className="bg-white w-full max-w-[400px] p-5 rounded-2xl shadow-xl">
                    <div className="relative flex justify-center mb-4">
                        <h3 className="font-bold text-xl">새로운 친구 찾기</h3>
                        <button
                            onClick={onClose}
                            className="absolute right-0 text-gray-600 hover:text-gray-900 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* 검색 바 */}
                    <div className="flex gap-2 mb-2 bg-[#F5F5F5] p-2 rounded-md">
                        <input
                            className="bg-transparent flex-1 outline-none text-sm px-1"
                            placeholder="닉네임 또는 이메일"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="text-sm px-2 text-[#8B4513] hover:font-bold">검색</button>
                    </div>
                    {searchError && (
                            <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded-md">{searchError}</div>
                        )}

                    {/* 결과 리스트 */}
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <p className="text-center text-xs text-gray-400 py-4">검색 중...</p>
                        ) : results.length > 0 ? (
                            <>
                                {results.map(user => (
                                    <div 
                                        key={user.email} 
                                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 min-w-0"
                                    >
                                        <div className="flex flex-col min-w-0 flex-1 pr-3">
                                            <span className="text-sm font-semibold truncate">{user.nickname}</span>
                                            <span className="text-s text-gray-700 truncate max-w-[180px]" title={user.email}>{user.email}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRequest(user.email)}
                                            disabled={requestedEmails.includes(user.email)}
                                            className={`shrink-0 px-3 py-2 rounded-full text-xs ${
                                                requestedEmails.includes(user.email) 
                                                    ? "bg-gray-300 text-gray-500"
                                                    : "bg-[#6F3611]/80 text-white   hover:bg-[#6F3611]"
                                            }`}
                                        >
                                            {requestedEmails.includes(user.email) ? "신청완료" : "신청"}
                                        </button>
                                    </div>
                                    ))
                                }
                                {requestError && (
                                    <div className="mt-3 p-2 text-sm text-red-600 bg-red-50 rounded-md">
                                        {requestError}
                                    </div>
                                )}
                            </>

                        ) : (
                            keyword ? (
                                <p className="text-center text-xs text-gray-400 my-4 py-2">
                                    검색 결과가 없습니다.
                                </p>
                            ) : (
                                <p className="text-center text-xs text-gray-400 my-4 py-2">
                                    닉네임 또는 이메일을 입력해 친구를 검색하세요.
                                </p>
                            )
                        )}
                    </div>

                    
                </div>
            </div>
        </>
    )
}


export default FriendAddModal;