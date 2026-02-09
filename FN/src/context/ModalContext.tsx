import { Children, createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import AlertModal from '../components/common/AlertModal';
import ConfirmModal from '../components/common/ConfirmModal';

interface ModalContextType {
    showAlert: (title: string, message: string) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    
    // Alert 전용 상태
    const [ alertConfig, setAlertConfig ] = useState({
        show: false,
        title: '',
        message: '',
    });

    // Confirm 전용 상태
    const [confirmConfig, setConfirmConfig] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},  
    });

    // Alert 실행 함수
    const showAlert = (title: string, message: string) => {
        setAlertConfig({ show: true, title, message });
    };

    // Confirm 실행 함수
    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setConfirmConfig({ show: true, title, message, onConfirm });
    };

    return (
        <>
            <ModalContext.Provider value={{ showAlert, showConfirm }}>
                {children}

                {/* 전역 AlertModal */}
                <AlertModal 
                    show={alertConfig.show}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onHide={() => setAlertConfig(prev => ({ ...prev, show: false }))}
                />

                {/* 전역 ConfirmModal */}
                <ConfirmModal 
                    show={confirmConfig.show}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    onHide={() => setConfirmConfig(prev => ({ ...prev, show: false }))}
                    onConfirm={confirmConfig.onConfirm}
                />

            </ModalContext.Provider>  
        </>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if(!context) throw new Error("ModalProvider없이는 쓸 수 없습니다.");
    return context;
}