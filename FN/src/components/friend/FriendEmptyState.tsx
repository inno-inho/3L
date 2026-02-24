import React from "react";

import users from '@/assets/image/users.svg';

interface FriendEmptyStateProps {
    onAddFriend: () => void;
}

const FriendEmptyState = ({ onAddFriend }: FriendEmptyStateProps) => {
    return (
        <>
            <div className="flex-1 h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-40 h-40 bg-[#fdfdf5] rounded-full flex items-center justify-center">
                    <img
                        src={users}
                        alt="친구 없음"
                        className="w-20 h-20 opacity-20"
                    />
                </div>

                <div className="text-center">
                    <p className="text-[#8B4513] font-bold text-xl mb-2">아직 등록된 친구가 없습니다.</p>
                    <p className="text-[#A08572] text-sm">새로운 친구를 찾아 대화를 시작해 보세요</p>
                </div>

                <button
                    className="bg-[#8B4513] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#6F3611] transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    + 첫 친구 추가하기
                </button>
            </div>
        </>
    );
};

export default FriendEmptyState;

