import type { User } from "@/types/user";

interface Props {
    friend: User;
}

// 친구 한명 UI
const FriendItem = ({ friend }: Props) => {
    if (!friend) {
        return <div>친구를 선택해주세요.</div>;
    }
    return (
        <div className="border flex flex-col items-center p-4">
            <img
                src={friend.profileImage || "/profile/default.jpg"}
                alt={friend.name}
                className="w-40 h-40 rounded-full mb-4"
            />
            <h4 className="text-2xl font-bold">{friend.name} </h4>
            <p className="text-gray-500">{friend.statusMessage}</p>
            {/* 버튼 추가 1:1 채팅하기 (친구 삭제/친구 차단) 버튼 추가*/}
        </div>
    )
}

export default FriendItem;