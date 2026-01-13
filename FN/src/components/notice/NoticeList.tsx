import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import search from '@/assets/image/search.png';

const DUMMY_NOTICES = [
  {
    id: 1,
    title: "코코넛톡 운영정책 개정 안내",
    content: "안녕하세요. 시스템 안정화를 위한 정기 점검이 예정되어 있습니다. 점검 시간 동안은 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.",
    date: "2025.06.30",
    views: 432
  },
  {
    id: 2,
    title: "쓰는 이에 집중, 쓰기 좋게 맞춤 🌟 25.08.15 업데이트 안내",
    content: "새로운 아코디언 스타일의 공지사항 UI가 적용되었습니다. 이제 목록에서 바로 내용을 확인하고 상세 페이지로 이동할 수 있습니다.",
    date: "2025.08.15",
    views: 11326
  },
  {
    id: 3,
    title: "기온은 낮아져도 관계의 온도는 높게 🥐🥨🥯🍞🧈🥞🧇🍳🧀🥖🍪🍩🍨🎂🍰🧁🍫🍬🍭🍡 25.10.31 업데이트 안내",
    content: "제목이 긴 공지내용에 대해 확인 가능합니다. ",
    date: "2025.08.15",
    views: 11326
  },

];



// 전체 목록 조회
const NoticeList = () => {

    const [notices] = useState(DUMMY_NOTICES); // 임시로
    const [expandedId, setExpandedId] = useState<number | null>(null); 
    // 현재 어떤 공지사항의 상세 내용이 펼쳐져 있는지를 기억하는 메모장
    // 처음엔 아무것도 안열려 있으니까 null -> setExpandedId(1) 이 실행되면 1이라는 ID의 내용만 보여지게되도록
    return(
        <div className="flex bg-white">
            <main className="flex-1 bg-white">
                <div className="max-w-6xl p-8">
                    <h1 className="text-3xl font-bold text-left mb-4">공지사항</h1>
                    <hr/>
                </div>

                <div className="max-w-6xl px-8">
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            {notices.map((notice) => (
                                <React.Fragment key={notice.id}>
                                    {/* 제목 행 누르면 펼쳐짐 */}
                                    <tr 
                                        onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)} // 똑같은 항목을 누르면 토글 사라짐
                                        className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group"
                                    >
                                        <td className="py-6 px-4 w-16 text-sm text-gray">{notice.id}</td>
                                        <td className="py-6 px-4">
                                            <div className="truncate font-semibold text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                                {notice.title}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 w-[120px] text-sm text-gray tabular-nums">{notice.date} &gt; </td>
                                        <td className="py-4 px-6 w-[100px] text-sm text-gray">{notice.views}</td>
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
                            {/* <tr className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group">
                                <td className="py-6 px-4 w-16 text-sm text-gray">4</td>
                                <td className="py-6 px-4">
                                    <div className="truncate font-semibold text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                        기온은 낮아져도 관계의 온도는 높게 🥐🥨🥯🍞🧈🥞🧇🍳🧀🥖🍪🍩🍨🎂🍰🧁🍫🍬🍭🍡 25.10.31 업데이트 안내
                                    </div>
                                </td>
                                <td className="py-4 px-4 w-[120px] text-sm text-gray tabular-nums">2025.10.31 &gt; </td>
                                <td className="py-4 px-6 w-[100px] text-sm text-gray">2599</td>
                            </tr>
                            <tr className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group">
                                <td className="py-6 px-4 w-16 text-sm text-gray">3</td>
                                <td className="py-6 px-4">
                                    <div className="truncate font-semibold text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                        코코넛톡 운영정책 개정 안내
                                    </div>
                                </td>
                                <td className="py-4 px-4 w-[120px] text-sm text-gray tabular-nums">2025.10.01 &gt; </td>
                                <td className="py-4 px-6 w-[100px] text-sm text-gray">45532</td>
                            </tr>
                            <tr className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group">
                                <td className="py-6 px-4 w-16 text-sm text-gray">2</td>
                                <td className="py-6 px-4">
                                    <div className="truncate font-semibold text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                        쓰는 이에 집중, 쓰기 좋게 맞춤 🌟 25.08.15 업데이트 안내
                                    </div>
                                </td>
                                <td className="py-4 px-4 w-[120px] text-sm text-gray tabular-nums">2025.08.15 &gt; </td>
                                <td className="py-4 px-6 w-[100px] text-sm text-gray">11326</td>
                            </tr>
                            <tr className="border-b border-[#743F24] last:border-0 hover:bg-[#FFF9ED] transition-colors cursor-pointer group">
                                <td className="py-6 px-4 w-16 text-sm text-gray">1</td>
                                <td className="py-6 px-4">
                                    <div className="truncate font-semibold text-gray-800 text-left group-hover:text-[#743F24]" title="여기에 전체 제목을 넣으면 마우스 올릴 때 툴팁으로 보입니다">
                                        코코넛톡 운영정책 개정 안내
                                    </div>
                                </td>
                                <td className="py-4 px-4 w-[120px] text-sm text-gray tabular-nums">2025.06.30 &gt; </td>
                                <td className="py-4 px-6 w-[100px] text-sm text-gray">432</td>
                            </tr> */}

                </div>

                {/* 페이지 네이션 */}
                <div className="max-w-6xl px-8 my-20">
                    <Link className="px-2">첫페이지</Link>
                    <Link className="px-2">이전 페이지 그룹</Link>
                    <span className="px-2">1</span>
                    <Link className="px-2">2</Link>
                    <Link className="px-2">3</Link>
                    <Link className="px-2">4</Link>
                    <Link className="px-2">5</Link>
                    <Link className="px-2">다음 페이지 그룹</Link>
                    <Link className="px-2">마지막페이지</Link>
                </div>
                <div className="flex justify-between max-w-6xl px-8 mt-4 mb-10" >
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