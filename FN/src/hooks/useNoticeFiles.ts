import { useState } from 'react';
import type { ExistingFile } from '@/types/noticeFormTypes';

export const useNoticeFiles = () => {
    // 서버에 이미 있는 파일(수정화면 진입시 보여줄 파일 목록)
    const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
    // 새로 추가할 파일
    const [newFiles, setNewFiles] = useState<File[]>([]);
    // 삭제 예정 파일 id(아직 서버에는 안 지움)
    const [deleteFileIds, setDeleteFilesIds] = useState<number[]>([]);

    // 초기화(수정모드)
    const initExistingFiles = (files: ExistingFile[]) => {
        setExistingFiles(files);
    }
    
    // 기존 파일 삭제(화면에서는 사라지지만 실제 삭제는 수정완료 버튼 눌렀을 때 한번에 처리)
    const removeExistingFile = (fileId: number) => {
        console.log("기존 파일 삭제 클릭", fileId);
        setExistingFiles(prev => prev.filter(f => f.id != fileId));
        setDeleteFilesIds(prev => [...prev, fileId]);
    };

    // 새 파일 추가
    const addNewFiles = (fileList: FileList) => {
        setNewFiles(prev => [...prev, ...Array.from(fileList)]);
    }

    // 새 파일 제거(index 방식이 안전)
    const removeNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    return{
        existingFiles,
        newFiles,
        deleteFileIds,

        initExistingFiles,
        addNewFiles,
        removeExistingFile,
        removeNewFile,
    };
};