import forum from "@/assets/image/forum.png"

const ChatEmptyState = () => {

    return(
        <>
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[#E5E0D5] flex flex-col items-center justify-center">
                <div className="w-70 h-70 flex items-center justify-center">
                    <span className="">
                        <img src={forum} alt="채팅방 선택 안 되어있음" />
                    </span>
                </div>
                <p className="text-[#8B4513] font-bold text-lg">채팅할 상대를 선택해주세요</p>
            </div>
        </>
    );
};

export default ChatEmptyState;