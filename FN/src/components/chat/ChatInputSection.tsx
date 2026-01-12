import text from "@/assets/image/text.svg";
import addPhoto from "@/assets/image/addPhoto.svg";
import addReaction from "@/assets/image/addReaction.svg";

interface Props {
    inputText: string;
    setInputText: (v: string) => void;
    handleSend: () => void;
}

const ChatInputSection = ({ inputText, setInputText, handleSend }: Props) => {
    return (
        <div className="p-4 bg-white border-t border-gray-50">
            <div className="border border-[#743F24] rounded-2xl p-3 bg-white">
                <textarea
                    className="w-full h-24 resize-none outline-none text-sm font-semibold py-2 px-2"
                    placeholder="메시지를 입력해주세요"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}  // 입력할 때마다 상태 업데이트
                    onKeyDown={(e) => {
                        // Enter키를 누르면 전송 (Shift+Enter는 줄바꿈)
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-3">
                        <button className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full">
                            <img src={addPhoto} alt="사진이나 파일 추가" className="h-8 w-8" />
                        </button>
                        <button className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full">
                            <img src={text} alt="파일 추가" className="h-8 w-8" />
                        </button>
                        <button className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full">
                            <img src={addReaction} alt="리액션" className="h-8 w-8" />
                        </button>
                    </div>
                    <button
                        onClick={handleSend}    // 클릭 시 전송 함수 실행
                        className="bg-[#B5A492] hover:bg-[#8B4513] text-white px-6 py-1.5 rounded-xl text-sm transition-colors font-medium"
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInputSection;