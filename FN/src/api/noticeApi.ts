import api from "./api";
import type { Notice, NoticeCreateRequest, NoticePageResponse } from "@/types/notice";


// 공지 목록 조회 
export const getNotices = async (page: number, keyword?: string) => {     // page번호를 맏아서 서버에서 해당 페이지 공지 목록을 가져오는 함수

    // API 요청(api.ts의 baseURL + '/notices') ex) GET /api/notices?page=0&size=10 
    // api.get(url, config)
    const response = await api.get<NoticePageResponse>(
        '/notices',
        {
            params: {
                page: page - 1, // 프론트는 1부터 쓰는게 자연스러움(Spring에서는 0부터 시작)
                size: 5, // 1, 2, 3, 4, 5까지만 보여지도록
                keyword: keyword || undefined, // keyword ''(빈문자열)이면 undefined, 백엔드의 @RequestParam(required = false) String keyword와 매치
            },
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

// 🔥 수정 (이거 꼭 필요)
// export const updateNotice = async (
//   id: number,
//   data: NoticeUpdateRequest
// ) => {
//   return api.put(`/notices/${id}`, data);
// };
// 파일 없는 공지일 때
// export const createNotice = async (data: {
//     title: string;
//     content: string;
//     authorId:string;
// }) => {
//     const response = await api.post("/notices", data);
//     return response.data;
// };

// 파일 있는 공지
export const createNotice = async (
    data: NoticeCreateRequest,
    files: File[]
) => {
    const formData = new FormData();

    // Json 데이터 formData.append("백엔드의 @RequsetParam의 "notice'와 일치", noticeData)로 하지 말고 반드시 Blob 사용
    formData.append(
        "notice",
        new Blob([JSON.stringify(data)], {
            type:"application/json",
        })
    );

    // 파일들
    if (files && files.length > 0){
        files.forEach(file => formData.append("files", file));
    }
    
    const response = await api.post("/notices", formData);
    return response.data;
};

export const downloadNoticeFile = (fileId: number) => {
    return api.get(`/notices/files/${fileId}/download`, {responseType: 'blob'} );
};