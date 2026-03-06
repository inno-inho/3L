import type { Friendship } from "@/types/friend";
import type { User } from "@/types/user";

interface Props {
    friendships: Friendship[];
    onSelect: (friend: User) => void;
    selectedFriend: User | null;
}
const FriendList = ({ friendships, onSelect, selectedFriend }: Props) => {

    return (
        // 친구 목록에 프로필 사진, name 같이 뜨게 하기
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
            {friendships.map((friendship) => (
                <div
                    key={friendship.id} 
                    className={`flex items-center gap-3 p-3 text-left cursor-pointer hover:bg-gray-100 transition
                        ${selectedFriend?.id === friendship.friend.id
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                    onClick={() => onSelect(friendship.friend)}
                >
                    <div className="flex justify-start items-center gap-4">
                        <img 
                            src={friendship.friend.profileImage || "/profile/default.jpg"} 
                            alt="profile" 
                            className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div className="flex flex-col">
                            <span className="text-left text-lg">{friendship.friend.name}</span>
                            {friendship.friend.statusMessage && (
                                <span className="text-sm text-gray-400">{friendship.friend.statusMessage}</span>
                            )}
                        </div>
                        
                    </div>
                    
                </div>
            ))}
        </div>
    );
};

export default FriendList;