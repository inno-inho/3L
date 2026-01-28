import { useState } from 'react';
import type { ExistingFile } from '@/types/noticeFormTypes';

export const useNoticeFiles = () => {
    // 서버에 이미 있는 파일
    const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
    // 새로 추가한 파일
    const [newFiles, setNewFiles] = useState<File[]>([]);

    // 삭제 예정 파일 id
    const [deleteFileIds, setDeleteFilesIds] = useState<number[]>([]);

    // 초기화(수정모드)
    const initExistingFiles = (files: ExistingFile[]) => {
        setExistingFiles(files);
    }
    
    // 기존 파일 삭제
    const removeExistingFile = (fileId: number) => {
        setExistingFiles(prev => prev.filter(f => f.id != fileId));
        setDeleteFilesIds(prev => [...prev, fileId]);
    };

    // 새 파일 추가
    const addNewFiles = (fileList: FileList) => {
        setNewFiles(prev => [...prev, ...Array.from(fileList)]);
    }

    // 새 파일 제거
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