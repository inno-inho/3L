import React, { useState } from "react";
import type { ChatMessageDto } from "../../../types/chat";
import AlertModal from "../../common/AlertModal";
import download from "@/assets/image/download.png"

interface ImageMessageProps {
    msg: ChatMessageDto;
}

// 파일 객체 타입 정의 (ChatMessageDto 내부 구조와 동일하게)
interface FileItem {
    fileUrl: string;
    originalFileName?: string;
}

const ImageMessage = ({ msg }: ImageMessageProps) => {
    // 브라우저가 현재 호스트(5173)의 /uploads/... 로 요청하면 Vite Proxy가 8080으로 전달합니다.
    // vite.config.ts에서 설정해놨기 때문

    // 클릭된 이미지의 URL을 저장하는 상태(null일때는 모달이 닫힌 상태)
    const [selectedImage, setSelectedImage] = useState<FileItem | null>(null);

    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // 다운로드 핸들러
    const handleDownload = async (file: FileItem) => {
        try {
            const response = await fetch(file.fileUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            
            // 서버에서 준 원본 파일명이 있으면 그것을 쓰고, 없으면 URL에서 마지막 부분을 가져옴
            link.download = file.originalFileName || file.fileUrl.split('/').pop() || 'download';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("다운로드 중 오류 발생: ", error);
            setModalMessage("이미지를 다운로드할 수 없습니다.");
            setModalShow(true);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                {msg.files?.map((file, index) => (
                    <img
                        key={index}
                        src={file.fileUrl}      // 예: "/uploads/maltese.png"
                        alt="채팅 이미지"
                        onClick={() => setSelectedImage(file)}
                        className="max-w-full h-auto rounded-xl shadow-sm"
                    />
                ))}
            </div>

            {/* 이미지 눌렀을 시 크게 보는 모달 */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}  // 배경 클릭 시 이미지 크게 보기 화면 닫기
                >
                    {/* 상단 컨트롤 바 */}
                    <div className="absolute top-5 right-5 flex items-center gap-4 justify-center">
                        {/* 다운로드 버튼 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()     // 모달 닫힘 방지
                                handleDownload(selectedImage);
                            }}
                            className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors group"
                        >
                            <img 
                                src={download}
                                alt="다운로드 아이콘"
                                className="w-6 h-6 object-contain invert"
                            />
                        </button>

                        {/* 닫기 버튼 */}
                        <button
                            className="text-white/70 hover:text-white text-5xl font-light transition-colors leading-none pb-2"
                            onClick={() => setSelectedImage(null)}  // 닫기 버튼을 눌러도 닫히게
                        >
                            &times;
                        </button>
                    </div>
                    {/* 크게 보는 이미지 */}
                    <img
                        src={selectedImage.fileUrl}
                        alt="원본 이미지"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}    // 이미지 클릭 시에는 모달이 안 닫히게 보호
                    />

                    {/* 모달 컴포넌트 */}
                    <AlertModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title="알림"
                        message={modalMessage}
                    />
                </div>
            )}
        </>
    );
};

export default ImageMessage;