import React, { useState } from 'react';

import text from "@/assets/image/text.svg";
import download from "@/assets/image/download.png";
import type { ChatMessageDto } from "../../../types/chat";

import AlertModal from "../../common/AlertModal";

interface FileMessagesProps {
    msg: ChatMessageDto;
    isMine: boolean;
}

interface FileItem {
    fileUrl: string;
    originalFileName?: string;
}

const FileMessages = ({ msg, isMine }: FileMessagesProps) => {

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
            setModalMessage("문서를 다운로드할 수 없습니다.");
            setModalShow(true);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                {msg.files?.map((file, index) => {
                    // 백엔드 DTO 구조에 맞춰 변수 할당
                    const displayName = file.originalFileName || file.fileName || "Unknown File";

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-2xl border ${isMine ? 'bg-white border-[#B5A492]' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            {/* 아이콘 영역 */}
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <img src={text} alt="문서" className="w-6 h-6" />
                            </div>

                            {/* 파일 정보 영역 */}
                            <div className="overflow-hidden text-left flex-1 flex flex-col justify-center">
                                <p className="text-sm font-bold truncate max-w-[150px] text-gray-800 leading-tight">
                                    {displayName}
                                </p>
                                <p className="text-[10px] text-gray-400 uppercase leading-none mt-0.5">
                                    {displayName.split('.').pop()} FILE
                                </p>
                            </div>

                            {/* 다운로드 버튼 */}
                            <button
                                onClick={() => handleDownload({
                                    fileUrl: file.fileUrl,
                                    originalFileName: displayName
                                })}
                                className="ml-2 p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <img src={download} alt="다운로드" className="w-5 h-5 object-contain" />
                            </button>

                            {/* 모달 컴포넌트 */}
                            <AlertModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                title="알림"
                                message={modalMessage}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FileMessages;