import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import search from '@/assets/image/search.svg';
import type { Notice } from '@/types/notice';
import { getNotices } from '@/api/noticeApi';
import { formatDate } from '@/utils/date';
import DoubleArrowLeft from '@/assets/image/double_arrow_left.svg';
import DoubleArrowRight from '@/assets/image/double_arrow_right.svg';
import ArrowLeft from '@/assets/image/arrow_left.svg';
import ArrowRight from '@/assets/image/arrow_right.svg';

// 전체 목록 조회
const NoticeList = () => {

    const [notices, setNotices] = useState<Notice[]>([]);  // 화면에 보여줄 공지 목록
    const [page, setPage] = useState(1); // 현재 페이지번호 프론트 기준 1부터
    const [totalPages, setTotalPages] = useState(0); // 페이지네이션 버튼 개수 계산
    const [keyword, setKeyword] = useState(''); // 검색창 입력값

    const [expandedId, setExpandedId] = useState<number | null>(null); 
    // 현재 어떤 공지사항의 상세 내용이 펼쳐져 있는지를 기억하는 메모장
    // 처음엔 아무것도 안열려 있으니까 null -> setExpandedId(1) 이 실행되면 1이라는 ID의 내용만 보여지게되도록

    // 목록 조회 함수
    const fetchNotices = async (pageNumber: number) => {
        const data = await getNotices(pageNumber, keyword);
        setNotices(data.content);
        setTotalPages(data.totalPages);
    };
    // Page<Notice> 는 배열이 아닌 객체가 오도록, page가 바뀔때마다 현재 keyword 기준으로
    useEffect(()=> {
        fetchNotices(page);
    }, [page]);

    // Enter로 검색 가능
    const handleSearch = () => {
        setPage(1);
        fetchNotices(1);
    };

    

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
                            {notices.length === 0 ? (
                                 <tr>
                                    <td colSpan={4} className="py-10 text-center text-gray-400">
                                        요청한 검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                notices.map((notice) => (
                                    <React.Fragment key={notice.id}>
                                        {/* 제목 행 누르면 펼쳐짐 */}
                                        <tr 
                                            onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)} // 똑같은 항목을 누르면 토글 사라짐
                                            className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group"
                                        >
                                            <td className="py-6 px-4 w-[5%] text-gray text-center">{notice.id}</td>
                                            <td className="py-6 px-4 w-[70%]">
                                                <div className="truncate font-semibold text-lg text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                                    {notice.title}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 w-[20%] text-gray tabular-nums text-center">{formatDate(notice.createdAt, notice.updatedAt)} &gt; </td>
                                            <td className="py-4 px-6 w-[5%]text-gray text-center">{notice.viewCount}</td>
                                        </tr>

                                        {expandedId === notice.id && (
                                            <tr>
                                                <td colSpan={4} className="bg-gray-50 p-6 animate-fadeIn">
                                                    <p className="mb-4 text-gray-600 whitespace-pre-line">{notice.content}</p>
                                                    <Link to={`/notices/${notice.id}`} className="text-[#743F24] font-bold">자세히 보기 → 
                                                    </Link>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지 네이션 */}
                <div className="max-w-full px-8 my-20 flex item-center justify-center gap-2">
                    <button onClick={() => setPage(1)}
                            className="w-6 h-6 flex items-center justify-center"
                    >
                        <img src={DoubleArrowLeft} alt="맨 첫 페이지" />
                    </button>
                    <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            className="w-6 h-6 flex items-center"
                    >
                        <img src={ArrowLeft} alt="이전 페이지"  />    
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`mx-2 px-2 ${page == pageNum ? 'font-bold' : 'hover:bg-gray-300'}`}
                        >
                            {pageNum}
                        </button>
                        
                    ))}
                    <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            className="w-6 h-6 flex items-center"
                    >
                        <img src={ArrowRight} alt="다음 페이지" />
                    </button>
                    <button onClick={() => setPage(totalPages)}
                            className="w-6 h-6 flex items-center justify-center"
                    >
                        <img src={DoubleArrowRight} alt="맨 마지막 페이지" />
                    </button>
                </div>
                <div className="flex justify-between max-w-full px-8 mt-4 mb-10" >
                    <Link to="/notices/write" className="px-6 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all shadow-sm">글쓰기</Link>
                    <div className="flex justify-between border border-[#743F24] rounded-lg w-80 focus-within:ring-1 focus-within:ring-[#743F24]">
                        <input 
                            type="text"
                            value={keyword}
                            placeholder="키워드를 입력해주세요"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') {handleSearch();} }}
                            className="flex-grow px-2 py-2 rounded-lg bg-transparent outline-none"  />
                        <button 
                            onClick={() => {
                                setPage(1);
                                fetchNotices(1);
                            }}
                            className="flex-shrink-0 hover:scale-110 transition-transform active:opacity-70"
                        >
                            <img src={search} alt="검색" className="mr-2 w-7 h-7 opacity-60 pointer-eventes-none" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
};
export default NoticeList;