import type { ChatRoomDto } from "../../types/chat";
import { Plus } from 'lucide-react';    // 아이콘 라이브러리
import coconuttalk from "@/assets/image/coconuttalk.png";

import search from "@/assets/image/search.svg"



interface ListProps {
    rooms: ChatRoomDto[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onCreateRomm: () => void;
}

const ChatRoomList = ({ rooms, selectedId, onSelect, onCreateRomm }: ListProps) => {


    return (
        <>
            <div className="relative w-80 bg-white rounded-3xl shadow-sm flex flex-col overflow-hidden border border-[#E5E0D5]">

                {/* 검색창 및 Chats */}
                <div className="p-6 pb-2">
                    <h1 className="text-2xl font-bold text-[#4A3F35]">Chats</h1>
                    {/* 검색창 */}
                    <div className="relative mt-4">
                        <img src={search} alt="돋보기" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input className="w-full bg-[#F5F5F5] rounded-xl pl-10 pr-4 py-2 text-sm font-semibold outline-none" placeholder="Search Messenger" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto mt-4">
                    {rooms.map(room => (
                        <div
                            key={room.roomId}
                            onClick={() => onSelect(room.roomId)}
                            className={`flex items-center p-4 mx-2 rounded-2xl cursor-pointer transition-all ${selectedId === room.roomId ? 'bg-[#FDF5E6]' : 'hover:bg-gray-50'}`}
                        >
                            {/* 프로필 이미지 영역*/}
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-200 mr-3 shrink-0">
                                {room.roomImageUrls && room.roomImageUrls.length <= 1 ? (
                                    // 1:1채팅방이거나 프로필 이미지가 하나 이하인 경우
                                    <img 
                                        src={room.roomImageUrls[0] || coconuttalk}
                                        className="w-full h-full object-cover"
                                        alt="profile"
                                    />
                                ) : (
                                    // 그룹 채팅방
                                    <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                                        {room.roomImageUrls.slice(0, 4).map((url, i) => (
                                            <img key={i} src={url} className="w-full h-full object-cover" alt="group"/>
                                        ))}        
                                    </div>
                                )}
                                
                                
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <span className="truncate font-bold text-[#4A3F35] max-w-full">{room.roomName}</span>
                                        <span className="text-xs text-gray-400 font-medium shrink-0">{room.userCount}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{room.lastMessageTime}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-1">{room.lastMessage}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <button
                onClick={onCreateRomm}
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#B5A492] rounded-2xl shadow-lg flex items-center justify-center text-white hover:bg-[#8B4513] transition-transform active:scale-95"
            >
                <Plus size={32} />
            </button>
        </div >
        </>
    );
};

export default ChatRoomList;