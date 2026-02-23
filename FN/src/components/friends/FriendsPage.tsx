import { useState } from "react"; 
import FriendItem from "./FriendItem";
import FriendList from './FriendList';
import type { Friendship } from '@/types/friend';
import type { User } from "@/types/user";

// 여기서 friendList, freindItem을 받는 역할

const FriendsPage = () => {
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
    return(
        <div className="grid grid-cols-3 h-screen">
            <div className="col-span-1 border-r">
                <h2 className="text-left text-xl font-bold p-2 border-b">친구 목록</h2>
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
    )
}

export default FriendsPage;