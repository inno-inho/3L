// ResponseDto 복사본
export interface Notice {
    id: number;
    title: string;
    content: string;
    authorId: string;
    viewCount: number;
    createdAt: string | null;
    updatedAt: string | null;

}

// RequestDto
export interface NoticeCreateRequest {
    title: string;
    content: string;
    // id, createdAt 같은 건 포함 X 
    // authorid은 지금 고정이거나 서버에서 처리
}

export interface NoticePageResponse {
    content: Notice[];
    totalPages: number;
    totalElements: number;
    number: number; // 현재 페이지
    size: number;
}

export interface NoticeDetailDto{
    id: number;
    title: string;
    content: string;
    authorId: string;
    viewCount: number;
    createdAt: string | null;
    updatedAt: string | null;
    files?: NoticeFile[]; // 기존 파일 포함
    // comment: Comment[];
}

// 파일첨부 공지
export interface NoticeFile{
    id: number;
    originalName: string;
    fileSize: number;
}

// 댓글기능 추가할때
// export type Comment = {
//   id: number;
//   content: string;
//   writer: string;
//   createdAt: string;
// };