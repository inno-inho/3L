import type { Friendship } from "@/types/friend";
import type { User } from "@/types/user";

interface Props {
    friendships: Friendship[];
    onSelect: (friend: User) => void;
}
const FriendList = ({ friendships, onSelect }: Props) => {
    return (
        // 친구 목록에 프로필 사진, name 같이 뜨게 하기
        <div>
            {friendships.map((friendship) => (
                <div
                    key={friendship.id} 
                    className="p-4 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelect(friendship.friend)}
                >
                    <div className="flex justify-start items-center gap-4">
                        <img src={friendship.friend.profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover" />
                        <span className="text-left text-lg">{friendship.friend.name}</span>
                    </div>
                    
                </div>
            ))}
        </div>
    );
};

export default FriendList;