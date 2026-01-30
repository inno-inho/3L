import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNotice, getNotice, updateNotice } from '@/api/noticeApi';
import type { NoticeCreateRequest } from '@/types/notice';
import { useNoticeFiles } from '@/hooks/useNoticeFiles';
import AlertModal from '@/components/common/AlertModal';

// 등록 수정 공용
const NoticeForm = () => {
    // useState : 그 안에 값을 넣거나(setTitle), 꺼내 쓸 수 있도록(노트에 적어두는 값)
    // useEffect : 어떤 일이 끝난 뒤 자동으로 실행되는 코드(노트가 바뀌면 자동으로 하는 행동)

    // 공지 수정
    const { id } = useParams<{ id: string }>(); // id 안전하게 처리
    const isEdit = !!id;  // id 있으면 수정 모드
    const navigate = useNavigate(); // 모달 닫고 목록 페이지로 이동할 때도 필요
    // 공지 기본 필드
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // 알림 모달
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // 커스텀 훅(기존파일, 새파일, 삭제 예정 파일 id 따로 둠)
    const {
        existingFiles,      // [{id, name, url}]
        newFiles,           // File[]
        deleteFileIds,      // number[]
        initExistingFiles,  // 기존 파일 초기 세팅
        addNewFiles,        // 새 파일 추가
        removeExistingFile, // 기존 파일 삭제(id로)
        removeNewFile,      // 새 파일 삭제(로컬)
    } = useNoticeFiles();

    // 수정 모드 초기값 세팅(수정상태에 기존 입력된 title, files, content 남아있게 하려면)
    useEffect(() => {
        if (!isEdit || !id) return; // id 없으면 그냥 return   
        const noticeId = Number(id);
        if (isNaN(noticeId)) return; // NaN이면 호출 x

        getNotice(noticeId).then(res => {
            // 기본 필드 세팅
            setTitle(res.title);
            setContent(res.content);

            // 기존 첨부 파일이 있다면 파일 목록 세팅 
            if (res.files && res.files.length > 0) {
                // 백엔드에서 파일 URL이나 이름 리스트를 보내주면 세팅
                initExistingFiles(
                    res.files.map((f) => ({
                        id: f.id,
                        name: f.originalName, // 파일이름
                        url: `/notices/files/${f.id}/download`, // 다운로드, 뷰용 URL
                    }))
                );
            }
        }).catch(err => { console.error("공지 조회 실패", err); });
    }, [id, isEdit]);

    // 등록, 수정 제출
    const handleSubmit = async () => {
        const noticeData: NoticeCreateRequest = { title, content };
        const formData = new FormData();

        // 공지 JSON
        // formData.append("백엔드의 @RequsetParam의 "notice'와 일치", noticeData)로 하지 말고 반드시 Blob 사용
        formData.append("notice", new Blob([JSON.stringify(noticeData)], { type: "application/json" }));

        // 새 파일
        newFiles.forEach((file) => formData.append('files', file));

        // 삭제 파일 ID JSON
        if (deleteFileIds.length > 0) {
            formData.append('deleteFileIds', new Blob([JSON.stringify(deleteFileIds)], { type: 'application/json' }));
        }

        try {
            if (isEdit && id) {
                // 수정 새 파일 + 삭제 파일 id 같이 전달
                await updateNotice(Number(id), formData);
                setModalMessage("공지 수정이 완료되었습니다.");
                setModalShow(true);
                navigate(`/notices/${id}`);
            } else {
                // 등록: 새 파일만 전달
                await createNotice(formData); // 새로 등록
                setModalMessage("공지 등록이 완료되었습니다.");
                setModalShow(true);
                navigate(`/notices`); // 목록으로 이동
            }
        } catch (error) {
            setModalMessage(isEdit ? "공지 수정에 실패했습니다." : "공지 등록에 실패했습니다.");
            setModalShow(true);
        }
    };


    return (
        <div className="flex bg-white">
            <main className="flex-1 bg-white">
                <div className="max-w-full p-8">
                    <h1 className="text-3xl font-bold text-left mb-4">{isEdit ? '공지사항 > 수정' : '공지사항 > 등록'}</h1>
                    <hr />
                </div>
                <form className="px-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-row items-center space-y-2">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">제목</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력해주세요."
                            type="text"
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div className="flex flex-row items-center space-y-2">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">파일첨부</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => {
                                if (!e.target.files) return;
                                addNewFiles(e.target.files); // 새파일 추가
                            }}
                            className="px-2 py-2"
                        />
                    </div>
                    <div className="flex flex-row items-center space-y-2">
                        <label className=" text-gray-700 text-left mx-8 w-24"></label>
                        <ul className="flex-1 p-2 bg-gray-50 rounded-md border space-y-2 mt-2 text-sm">
                            {existingFiles.map((file) => (
                                <li key={file.id} className="flex items-center space-x-2 py-1">
                                    <span className="mr-4 text-gray-700">{file.name}</span>
                                    <a href={file.url} target="_blank" className="text-blue-500 hover:font-bold">다운로드</a>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log("삭제 버튼 클릭됨");
                                            removeExistingFile(file.id);
                                        }}
                                        className="text-red-500 hover:font-bold"
                                    >
                                        삭제
                                    </button>
                                </li>
                            ))}
                            {newFiles.map((file, index) => (
                                <li key={`${file.name}-${index}`} className="flex items-center space-x-2 py-1">
                                    <span className="mr-4 text-gray-700">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(index)}
                                        className="text-red-500 hover:font-bold"
                                    >
                                        삭제
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-row items-center space-y-2 ">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력해주세요."
                            className="min-h-80 p-2 flex-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="py-8">
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className={`w-30 px-4 py-2 rounded-lg border border-[#743F24] text-[#392419] transition-all
                            ${isEdit ? "bg-blue-400 text-white hover:bg-blue-700" : "hover:bg-[#743F24] hover:text-white"}`}
                        >
                            {isEdit ? '수정 완료' : '등록'}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="border rounded-lg w-30 px-4 py-2 mx-10 border-[#743F24] text-[#392419] hover:text-blue-700 hover:font-bold"
                            >취소</button>
                        )}
                        <AlertModal
                            show={modalShow}
                            onHide={() => {
                                setModalShow(false);
                                navigate("/notices");
                            }}
                            title="알림"
                            message={modalMessage}
                        />
                    </div>
                </form>
            </main>

        </div>
    )
}

export default NoticeForm