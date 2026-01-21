import api from "./api";
import type { Notice, NoticePageResponse } from "@/types/notice";


// 공지 목록 조회 
export const getNotices = async (page: number) => {
    // 실제 요청 주소 : /api/notices (api.ts의 baseURL + '/notices')
    const response = await api.get<NoticePageResponse>('/notices'),
    {
        params: {
            page: page - 1,
            size: 10
        }
    };
    
    return response.data;
};

export const getNotice = async (id:number): Promise<Notice> => {
    const response = await api.get(`/notices/${id}`);
    return response.data;
};

export const createNotice = async (data: {
    title: string;
    content: string;
    authorId: string;
}) => {
    const response = await api.post("/notices", data);
    return response.data;
};