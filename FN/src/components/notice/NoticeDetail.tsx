import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getNotice } from "@/api/noticeApi";
import type { Notice } from "@/types/notice";

// 단건 조회
const NoticeDetail = () => {

    const { id } = useParams();
    const [ notice, setNotice ] = useState<Notice | null>(null);

    useEffect(() => {
        if (!id) return;

        
        getNotice(Number(id));
    }, [id]);


    return(
         <div className="flex bg-white">
            <main className="flex-1 bg-white">
                <div className="max-w-full p-8">
                    <h1 className="text-3xl font-bold text-left mb-4">공지사항 &gt; 조회</h1>
                    <hr/>
                </div>
                <div>
                    <p>제목 : {notice.title}</p>
                    <p>날짜 </p>
                    <p>컨텐츠 내용 notice.content</p>
                </div>

                  
            </main>
        </div>
    )
};
export default NoticeDetail;