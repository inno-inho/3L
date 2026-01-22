import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import coconuttalk from "@/assets/image/coconuttalk.png";

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    onHide: () => void;     // 취소나 닫기 버튼 눌렀을 때
    onConfirm: () => void;
}

const ConfirmModal = ({ show, title, message, onHide, onConfirm }: ConfirmModalProps) => {
    if (!show) return null;

    return (
        <>
            <Modal 
                show={show} 
                onHide={onHide}
                centered
                contentClassName='border-0 bg-transparent shadow-none'    
            >
                <div className='bg-[#FAF9F6] overflow-hidden rounded-3xl flex flex-col shadow-xl border border-gray-100'>
                    
                    {/* 헤더 */}
                    <Modal.Header className='border-0 pt-4 px-3 flex items-center justify-between'>
                        <div className='flex items-center'>
                            <img src={coconuttalk} alt='로고' className='h-10 w-10 ml-3 object-contain'/>
                            <Modal.Title className='font-bold text-[#4A3F35] text-2xl ml-3'>{title}</Modal.Title>
                        </div>
                    </Modal.Header>

                    {/* 바디 */}
                    <Modal.Body className='px-6 py-4 text-lg text-[#6B7280]'>
                        {message}
                    </Modal.Body>

                    {/* 푸터: 버튼 2개 */}
                    <Modal.Footer className='border-0 pb-4 px-4 flex justify-end gap-2'>
                        <Button
                            onClick={onHide}    // 모달 닫기
                            className='border-0 rounded-2xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors'
                            style={{ width: '100px', height: '48px', fontWeight: '600' }}
                        >
                            취소
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm();    // 실제 확인 버튼 눌렀을 시 동작
                                onHide();   // 모달 닫기
                            }}  
                            className='border-0 rounded-2xl text-white hover:bg-[#8B4513] transition-colors'
                            style={{ backgroundColor: '#B5A492', width: '100px', height: '48px', fontWeight: '600' }}
                        >
                            확인
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

export default ConfirmModal;