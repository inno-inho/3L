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
                    className="p-4 text-left border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelect(friendship.friend)}
                >
                    {friendship.friend.name}
                </div>
            ))}
        </div>
    );
};

export default FriendList;