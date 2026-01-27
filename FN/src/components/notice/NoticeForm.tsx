import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNotice, getNotice } from '@/api/noticeApi';
import type { NoticeCreateRequest } from '@/types/notice';
import AlertModal from '@/components/common/AlertModal';

// 등록 수정 공용
const NoticeForm = () =>{
    // useState : 그 안에 값을 넣거나(setTitle), 꺼내 쓸 수 있도록(노트에 적어두는 값)
    // useEffect : 어떤 일이 끝난 뒤 자동으로 실행되는 코드(노트가 바뀌면 자동으로 하는 행동)

    // 공지 수정
    const { id } = useParams();
    const isEdit = Boolean(id); 
    // 공지 생성
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate(); // 모달 닫고 목록 페이지로 이동할 때 필요
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (isEdit && id) {
            getNotice(id).then(res => {
                setTitle(res.title);
                setContent(res.content);
            });
        }
    }, [id, isEdit]);

    const handleSubmit = async () => {
        const noticeData: NoticeCreateRequest = {
            title, content,
        };
        if (isEdit) {
            await updateNotice(id!, {title, content});
            navigate(`/notices/${id}`);
        } else {
            try{
                await createNotice(noticeData, files);
                setModalMessage("공지 등록이 완료되었습니다.");
                setModalShow(true);
            } catch (error){
                setModalMessage("공지 등록에 실패했습니다.");
                setModalShow(true);
            } 
        }
        

    };

    return (
        <div className="flex bg-white">
            <main className="flex-1 bg-white">
                <div className="max-w-full p-8">
                    <h1 className="text-3xl font-bold text-left mb-4">{isEdit ? '공지사항 &gt; 수정' : '공지사항 &gt; 등록'}</h1>
                    <hr/>
                </div>
                <form className="px-8">
                    <div className="flex flex-row items-center space-y-2">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">제목</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요." type="text" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" id="noticeTitle" />
                    </div>
                    <div className="flex flex-row items-center space-y-2">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">파일첨부</label>
                        <input 
                            type="file" 
                            multiple 
                            onChange={(e) => {
                                if(e.target.files){
                                    setFiles(Array.from(e.target.files));
                                }
                            }}
                            placeholder="내 PC"
                            className="px-2 py-2"
                        />
                    </div>
                    <div className="flex flex-row items-center space-y-2 ">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">내용</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력해주세요." id="noticeContent" className="min-h-80 p-2 flex-1 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div className="py-8">
                        <button 
                            onClick={handleSubmit} 
                            type="button" 
                            className="w-28 px-4 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all" 
                        >
                            {isEdit ? '수정 완료' : '등록'}
                        </button>
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