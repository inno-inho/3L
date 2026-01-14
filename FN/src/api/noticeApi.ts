import api from "./api";
import type { Notice } from "@/types/notice";

// 공지 목록 조회 
export const getNotices = async (): Promise<Notice[]> => {
    // 실제 요청 주소 : /api/notices (api.ts의 baseURL + '/notices')
    const response = await api.get<Notice[]>('/notices');
    
    return response.data;
};

export const getNotice = async (id:number): Promise<Notice> => {
    const response = await api.get(`/api/notices/${id}`);
    return response.data;
};

export const createNotice = async (data: {
    title: string;
    content: string;
    authorId: string;
}) => {
    const response = await api.post("/api/notices", data);
    return response.data;
};