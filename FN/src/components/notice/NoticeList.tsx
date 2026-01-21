import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import search from '@/assets/image/search.png';
import type { Notice } from '@/types/notice';
import { getNotices } from '@/api/noticeApi';
import { formatDate } from '@/utils/date';
// import DoubleArrowLeft from '@/assets/image/double_arrow_left.png';
// import DoubleArrowRight from '@/assets/image/double_arrow_right.png';
import ArrowLeft from '@/assets/image/arrow_left.png';
import ArrowRight from '@/assets/image/arrow_right.png';


// 전체 목록 조회
const NoticeList = () => {

    const [notices, setNotices] = useState<Notice[]>([]); 
    const [page, setPage] = useState(1); // 1부터 시작(백엔드에서)
    const [totalPages, setTotalPages] = useState(0);

    // Page<Notice> 는 배열이 아닌 객체가 오도록
    useEffect(()=> {
        getNotices(page).then((data) => {
            console.log("공지목록 : " + data);
            setNotices(data.content); // 배열만 저장
            setTotalPages(data.totalPages); // 전체 페이지 수 
        });
    }, [page]);

    const [expandedId, setExpandedId] = useState<number | null>(null); 
    // 현재 어떤 공지사항의 상세 내용이 펼쳐져 있는지를 기억하는 메모장
    // 처음엔 아무것도 안열려 있으니까 null -> setExpandedId(1) 이 실행되면 1이라는 ID의 내용만 보여지게되도록
    
    return(
        <div className="flex bg-white rounded-md w-full">
            <main className="flex-1 bg-white w-full">
                <div className="max-w-full mx-auto p-8">
                    <h1 className="text-3xl font-bold text-left mb-4">공지사항</h1>
                    <hr className="border-gray" />
                </div>
                
                <div className="max-w-full px-8">
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            {notices.map((notice) => (
                                <React.Fragment key={notice.id}>
                                    {/* 제목 행 누르면 펼쳐짐 */}
                                    <tr 
                                        onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)} // 똑같은 항목을 누르면 토글 사라짐
                                        className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group"
                                    >
                                        <td className="py-6 px-4 w-[5%] text-sm text-gray text-center">{notice.id}</td>
                                        <td className="py-6 px-4 w-[70%]">
                                            <div className="truncate font-semibold text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                                {notice.title}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 w-[20%] text-sm text-gray tabular-nums text-center">{formatDate(notice.createdAt, notice.updatedAt)} &gt; </td>
                                        <td className="py-4 px-6 w-[5%] text-sm text-gray text-center">{notice.viewCount}</td>
                                    </tr>

                                    {expandedId === notice.id && (
                                        <tr>
                                            <td colSpan={4} className="bg-gray-50 p-6 animate-fadeIn">
                                                <p className="mb-4 text-gray-600">{notice.content}</p>
                                                <Link to={`/notices/${notice.id}`} className="text-[#743F24] font-bold">자세히 보기 → 
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지 네이션 */}
                <div className="max-w-full px-8 my-20">
                    <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                    >
                        <img src={ArrowLeft} alt="이전 페이지" />    
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-2 ${page == pageNum ? 'bg-orange-400 text-white' : ''}`}
                        >
                            {pageNum}
                        </button>
                        
                    ))}
                    <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                    >
                        <img src={ArrowRight} alt="다음 페이지" />
                    </button>
                </div>
                <div className="flex justify-between max-w-full px-8 mt-4 mb-10" >
                    <Link to="/notices/write" className="px-6 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all shadow-sm">글쓰기</Link>
                    <div className="flex justify-between border border-[#743F24] rounded-lg w-80 focus-within:ring-1 focus-within:ring-[#743F24]">
                        <input className="flex-grow px-2 py-2 rounded-lg bg-transparent outline-none" type="text" placeholder="키워드를 입력해주세요" />
                        <button className="flex-shrink-0 hover:scale-110 transition-transform active:opacity-70">
                            <img src={search} alt="검색" className="mr-2 w-7 h-7 opacity-60 pointer-eventes-none" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
};
export default NoticeList;