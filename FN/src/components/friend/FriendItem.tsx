import type { User } from "@/types/user";
import { deleteFriend, blockFriend } from '@/api/friendApi';
import { useModal } from "../../context/ModalContext";

interface Props {
    friend: User;
    onDelete: (email: string) => void;
}

// 친구 한명 UI
const FriendItem = ({ friend, onDelete }: Props) => {
    // const { showAlert, showConfirm } = useModal();

    const handleDelete = async () => {
        if(!confirm(`${friend.name}님을 친구 목록에서 삭제하시겠습니까?`)) return;

        await deleteFriend(friend.email);
        onDelete(friend.email); // 부모 상태 업데이트
    };

    const handleBlock = async () => {
        if(!confirm(`${friend.name}님을 차단하시겠습니까?`)) return;

        await blockFriend(friend.email);
        alert("차단되었습니다.");
        // 친구 목록에서도 제거
        onDelete(friend.email);
    }

    // if (!friend) {
    //     return <div>친구를 선택해주세요.</div>;
    // }
    return (
        <div className="border flex flex-col items-center p-4">
            <img
                src={friend.profileImage || "/profile/default.jpg"}
                alt={friend.name}
                className="w-40 h-40 rounded-full mb-4"
            />
            <h4 className="text-2xl font-bold">{friend.name} </h4>
            <p className="text-gray-500">{friend.statusMessage}</p>
            
            <div className="flex gap-3 mt-5">
                <button className="mr-5 px-4 py-2 rounded bg-[#6F4E37]/70 text-white hover:bg-[#6F4E37] transition">1:1채팅</button>
                <button
                    onClick={handleDelete} 
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                >
                    친구 삭제
                </button>
                <button 
                    onClick={handleBlock}
                    className="px-4 py-2 rounded border border-red-400 text-red-500 hover:bg-red-50 transition"
                >
                    차단
                </button>

            </div>
        </div>
    )
}

export default FriendItem;