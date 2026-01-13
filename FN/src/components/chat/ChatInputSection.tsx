import text from "@/assets/image/text.svg";
import addPhoto from "@/assets/image/addPhoto.svg";
import addReaction from "@/assets/image/addReaction.svg";
import { useReducer, useRef } from "react";


interface Props {
    inputText: string;
    setInputText: (v: string) => void;
    handleSend: () => void;
    onFileUpload: (file: File, type: "IMAGE" | "VIDEO" | "FILE") => void;
    pendingFiles: any[];   // 대기 중인 파일 정보
    onCancelFile: (id: string) => void;   // 파일 취소 함수, 특정 파일만 취소 가능하도록 ID 전달
}

const ChatInputSection = ({ inputText, setInputText, handleSend, onFileUpload, pendingFiles, onCancelFile }: Props) => {

    // 미디어, 파일의 Input을 위한 Ref
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const fileDocInputRef = useRef<HTMLInputElement>(null);

    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: "MEDIA" | "DOC") => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            let type: "IMAGE" | "VIDEO" | "FILE" = "FILE";

            if (category === "MEDIA") {
                // 파일의 type을 확인하여 IMAGE 또는 VIDEO 결정
                type = file.type.startsWith("video/") ? "VIDEO" : "IMAGE"
            } else {
                type = "FILE";
            }

            // 부모의 handleFileUpload를 호출하여 pendingFiles 배열에 추가함
            onFileUpload(file, type);
        });



        // 같은 파일을 다시 선택할 수 있도록 value 초기화
        e.target.value = "";
    }

    return (
        <div className="p-4 bg-white border-t border-gray-50">
            {/* 미디어 전용(이미지/영상) */}
            <input
                type="file"
                ref={mediaInputRef}
                className="hidden"
                accept="image/*, video/*"
                multiple
                onChange={(e) => handleFileChange(e, "MEDIA")}
            />
            {/* 일반 문서 전용(PDF, PPT, TXT 등) */}
            <input
                type="file"
                ref={fileDocInputRef}
                className="hidden"
                accept=".txt, .pdf, .pptx, .xlsx, .docx, .zip"
                multiple
                onChange={(e) => handleFileChange(e, "DOC")}
            />

            <div className="border border-[#743F24] rounded-2xl p-3 bg-white">
                {pendingFiles.length > 0 && (
                    <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                        {pendingFiles.map((p) => (
                            <div key={p.id} className="relative flex-shrink-0">
                                {p.type === 'IMAGE' ? (
                                    <img src={p.previewUrl} className="w-16 h-16 object-cover rounded-xl border border-gray-200" alt="미리보기" />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 text-xl">📄</div>
                                )}

                                {/* 개별 삭제 버튼 */}
                                <button
                                    onClick={() => onCancelFile(p.id)}
                                    className="absolute -top-1.5 -right-1.5 bg-[#4A3F35] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <textarea
                    className="w-full h-24 resize-none outline-none text-sm font-semibold py-2 px-2"
                    placeholder="메시지를 입력해주세요."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}  // 입력할 때마다 상태 업데이트
                    onKeyDown={(e) => {
                        // Enter키를 누르면 전송 (Shift+Enter는 줄바꿈)
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    // 이미지 복붙 로직
                    onPaste={(e) => {
                        const item = e.clipboardData.items[0];
                        if (item?.type.includes("image")) {
                            const file = item.getAsFile();
                            if (file) onFileUpload(file, "IMAGE");
                        }
                    }}
                />

                {/* 하단의 사진, 파일, 리액션 아이콘 */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-3">
                        <button
                            onClick={() => mediaInputRef.current?.click()}
                            className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full"
                        >
                            <img src={addPhoto} alt="사진이나 파일 추가" className="h-8 w-8" />
                        </button>
                        <button
                            onClick={() => fileDocInputRef.current?.click()}
                            className="hover:bg-gray-200 h-12 w-12 flex items-center justify-center rounded-full"
                        >
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