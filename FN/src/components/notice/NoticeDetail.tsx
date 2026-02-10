import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getNotice, downloadNoticeFile } from "@/api/noticeApi";
import type { NoticeDetailDto } from "@/types/notice";
import { formatDate } from "@/utils/date";
import thumb_up from '@/assets/image/thumb_up.svg';
import text from '@/assets/image/comment.svg';
import visibility from '@/assets/image/visibility.svg';
import AlertModal from '@/components/common/AlertModal';
import { useAuth } from "@/context/AuthContext";

// 단건 조회
const NoticeDetail = () => {

    const { id } = useParams();
    // 상세페이지는 무조건 API를 다시 호출
    const [ notice, setNotice ] = useState<NoticeDetailDto | null>(null);

    const navigate = useNavigate(); // 모달 닫고 목록 페이지로 이동할 때 필요
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        if (!id) return;
        
        // 공지사항 상세 데이터를 가져오는 비동기 작업
        const fetchNotice = async () => {
            try {
                const data = await getNotice(Number(id)); // /notice/{id} 요청 전송 -> 서버에서 공지 데이터 반환 -> getNotice는 response.data를 리턴
                setNotice(data); // 이 코드가 없으면 화면은 영원히 로딩중(notice === null이 아니라면 데이터가 있으므로 실제 UI 표시)
            }catch (error) {
                console.error("공지 상세 조회 실패", error);
            }
        };
        fetchNotice();
    }, [id]); // id가 바뀔때마다 실행

    const handleDownload = async(fileId: number, originalName:string) => {
        try{
            const response = await downloadNoticeFile(fileId);
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = originalName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch(e) {
            setModalMessage("파일 다운로드에 실패했습니다.");
        }

    };

    const user = useAuth();

    if (!notice) return <div className="text-gray-400 p-10"> 로딩중 ...  </div>



    return(
        <>
            <div className="flex bg-white">
                <main className="flex-1 bg-white px-4">
                    <div className="text-left">
                        <div className="flex items-center py-3">
                            <h2 className="flex-1 text-2xl font-bold">{notice.title}</h2>
                            <p className="">{formatDate(notice.createdAt)}</p>
                        </div>
                        <hr />
                        {notice.files && notice.files.length > 0 && (
                            <div className="flex items-center p-2">
                                <h3 className="font-semibold mr-4">첨부파일</h3>
                                <ul className="space-y-1">
                                    {notice.files.map(file => (
                                        <li key={file.id} className="flex items-center justify-between">
                                            <span className="truncate max-w-[70%] mx-4">{file.originalName}</span>
                                            <button 
                                                onClick={() => handleDownload(file.id, file.originalName)}
                                                className="shrink-0 hover:underline text-blue-600 border rounded-md bg-gray-300 p-1"
                                            >
                                                다운로드
                                            </button>
                                            <AlertModal
                                                show={modalShow}
                                                onHide={() => {
                                                    setModalShow(false);
                                                    navigate("/notices/{id}");
                                                }}
                                                title="알림"
                                                message={modalMessage}
                                            />
                                            
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <hr />

                        <div className="py-4 min-h-[300px] max-h-[60vh] overflow-y-auto whitespace-pre-line">
                            <p className="text-xl">{notice.content} </p>
                        </div>
                        <div className="py-4 flex">
                            <div className="flex items-center">
                                <img src={thumb_up} className="w-7 h-7 mx-2" />
                                <img src={text} className="w-7 h-7 mx-2" />
                                <div className="flex mx-2">
                                    <img src={visibility} className="w-7 h-7 mx-1" />
                                    <p className="text-xl">{notice.viewCount}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="w-full py-4 mx-auto max-w-64">
                            <Link to="/notices">
                                <button className="mx-4 px-6 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all shadow-sm">목록</button>
                            </Link>
                            <Link to={`/notices/${notice.id}/edit`}>
                                <button className="mx-4 px-6 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#e04e05] hover:text-white transition-all shadow-sm">수정</button>
                            </Link>
                        </div>
                        <div>
                            <div className="flex gap-4">
                                <p>등록순</p>
                                <p>최신순</p>
                            </div>
                            <div className="text-center">
                                <p className="my-10">아직 댓글이 없어요. <br /> 가장 먼저 댓글을 남겨보세요.</p>
                                <button className="px-6 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all shadow-sm">댓글 쓰기</button>
                            </div>
                        </div>
                        
                    </div>

                    
                </main>
            </div>
        </>
    )
};
export default NoticeDetail;