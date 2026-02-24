import React, { useState } from 'react';
import FriendAddModal from './FriendAddModal'; // 기존에 만든 모달
import { useAsyncError } from 'react-router-dom';
import FriendRequestModal from './FriendRequestModal';

import FriendItem from "./FriendItem";
import FriendList from './FriendList';
import type { Friendship } from '@/types/friend';
import type { User } from "@/types/user";
import UserPlus from "@/assets/image/user-plus.svg";
import  UserX from "@/assets/image/user-x.svg";
import  Bell from "@/assets/image/bell.svg";

const FriendPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);    // 친구 추가 요청 확인 모달 상태
    const [requestCount, setRequestCount] = useState(0);    // 친구 추가 요청 개수

    // 임시 더미 데이터
    // ❗❗❗❗ mockFriends -> 나중에 API 응답으로 교체
    const mockFriendships: Friendship[] = [
        {
            id: 100, // friendship id
            status: "ACCEPTED",
            friend:{
                id:1,
                name: "변우석",
                statusMessage: "취업 파이팅!",
                profileImage: "/profile/111.jpg",
            },
        },
        {
            id: 101,
            status:"ACCEPTED",
            friend:{
                id: 2,
                name: "김선호",
                statusMessage: "취업 성공 기원",
                profileImage: "",
            },
        },
        {
            id: 102,
            status:"ACCEPTED",
            friend: {
                id: 3,
                name: "문상민",
                statusMessage: "키 190cm",
                profileImage: "/profile/333.jpg",
            },
        },
    ];

    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
    const acceptedFriends = mockFriendships.filter(
        (f) => f.status === "ACCEPTED"
    );

    return (
        <> 
            {/* 친구 추가는 여기서 모달로! */}
            {/* 친구 요청 확인 버튼 */}
            <div className="grid grid-cols-3 h-screen">
                <div className="col-span-1">
                    <h2 className="text-left text-xl font-bold p-2 border-b">친구 목록</h2>
                    <div className="flex justify-center gap-2 p-2">
                        <button 
                            onClick={() => setIsRequestModalOpen(true)}
                            className="relative flex flex-col items-center justify-center bg-white border-[#8B4513] hover:!bg-[#8B4513]/10 px-4 py-2 transition-colors rounded-xl"
                        >
                            <img src={Bell} className="w-5 h-5 mb-1 text-gray-700" />  
                            <span className="text-sm">요청 확인</span>
                            {requestCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {requestCount}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex flex-col items-center justify-center border-[#8B4513] hover:bg-[#8B4513]/10 px-4 py-2 rounded-xl transition-colors"
                        >
                            <img src={UserPlus} className="w-5 h-5 mb-1 text-gray-700" />
                            <span className="text-sm">친구 추가</span>
                        </button>
                        <button 
                            className="flex flex-col items-center justify-center text-gray-600 border-gray-300 hover:bg-gray-100 px-2 py-2 rounded-xl transition-colors"
                        >
                            <img src={UserX} className="w-5 h-5 mb-1 text-gray-700" />
                            <span className="text-sm">차단 친구 목록</span>
                        </button> 
                    </div>
                    <FriendList friendships={acceptedFriends} onSelect={(friend) => setSelectedFriend(friend)} />
                </div>
                

                {selectedFriend && (
                    <div className="col-span-2 p-6">
                        {selectedFriend ? (
                            <FriendItem friend={selectedFriend} />
                        ) : (
                            <div className="text-gray-400">
                                친구를 선택해주세요
                            </div>
                        )}
                        
                    </div>
                )}
                
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

export default FriendPage;