import React, { useState } from 'react';
import FriendAddModal from './FriendAddModal'; // 기존에 만든 모달
import { useAsyncError } from 'react-router-dom';
import FriendRequestModal from './FriendRequestModal';

const FriendListPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);    // 친구 추가 요청 확인 모달 상태
    const [requestCount, setRequestCount] = useState(0);    // 친구 추가 요청 개수


    return (
        <> 
                <h2>친구 목록</h2>
                {/* 친구 추가는 여기서 모달로! */}
                
                    {/* 친구 요청 확인 버튼 */}
                    <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="relative bg-white border border-[#8B4513] text-[#8B4513] px-4 py-2 rounded-xl hover:bg-[#fdfaf5] transition-colors"
                    >
                        친구 추가 요청 확인하기
                        {requestCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {requestCount}
                            </span>
                        )}
                    </button>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#8B4513] text-white px-4 py-2 rounded-xl hover:bg-[#6F3611] transition-colors"
                    >
                        + 친구 추가
                    </button>

                    <button 
                        className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#6F3611] transition-colors"
                    >
                        차단한 친구 관리
                    </button>
                
            

            {/* 친구 목록 리스트가 들어갈 자리 */}
            <div>
                <p>친구 목록 보여줄 자리</p>
            </div>

            {/* 친구 추가 모달 */}
            {isAddModalOpen && (
                <FriendAddModal onClose={() => setIsAddModalOpen(false)} />
            )}

            {isRequestModalOpen && (
                <FriendRequestModal 
                    onClose={() => setIsRequestModalOpen(false)} 
                    onRefreshFriends={() => { /* 친구 목록 갱신 로직 */ }}
                />
            )}
        </>
    );
};

export default FriendListPage;