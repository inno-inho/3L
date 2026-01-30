// 날짜 포맷 : 2026.1.14 형태로
// -> 사용 방법 {formatDate(notice.createdAt)}
export const formatDate = (
    createdAt?: string | null,
    updatedAt?: string | null
    ) => {
    // 수정일이 있으면 수정일 우선
    const targetDate = updatedAt ?? createdAt;

    if (!targetDate) return '';

    return targetDate.slice(0, 10).replaceAll('-', '.');
};

