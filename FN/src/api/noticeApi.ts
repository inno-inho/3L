import api from "./api";
import type { Notice, NoticePageResponse } from "@/types/notice";


// 공지 목록 조회 
export const getNotices = async (page: number) => {     // page번호를 맏아서 서버에서 해당 페이지 공지 목록을 가져오는 함수

    // API 요청(api.ts의 baseURL + '/notices') ex) GET /api/notices?page=0&size=10 
    // api.get(url, config)
    const response = await api.get<NoticePageResponse>(
        '/notices',
        {
            params: {
                page: page - 1, // 프론트는 1부터 쓰는게 자연스러움(Spring에서는 0부터 시작)
                size: 5
            }
        }
    );
    
    return response.data; // 응답반환
    // {
    //  content: Notice[],
    //  totalPages: number,
    //  totalElements:number,...
    // }
}

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