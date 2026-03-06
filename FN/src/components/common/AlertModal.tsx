import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import coconuttalk from "@/assets/image/coconuttalk.png";

interface AlertModalProps {
    show: boolean;
    title: string;
    message: string;
    onHide: () => void;
}

const AlertModal = ({ show, title, message, onHide }: AlertModalProps) => {

    // show가 false라면 화면에 아무것도 나오지 않음
    if (!show) return null;

    return (
        <>
            <Modal show={show} onHide={onHide} centered contentClassName='border-0 bg-transparent shadow-none' style={{borderRadius: '24px'}} dialogClassName="max-w-[380px]">
                <div className='bg-[#FAF9F6] overflow-hidden rounded-3xl flex flex-col shadow-lg border border-gray-100'>
                    
                    {/* 모달 헤더 부분 */}
                    <Modal.Header className='border-0 pt-4 px-3 flex items-center justify-between'>
                        <div className='flex items-center'>
                            <img 
                                src={coconuttalk} alt='코코넛톡 기본 배경' 
                                className='h-10 w-10 object-contain'
                            />
                            <Modal.Title className='font-semibold tracking-tight text-[#4A3F35] text-[20px] ml-3'>{title}</Modal.Title> 
                        </div>
                        <button
                            onClick={onHide}
                            className='text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none'
                        >
                            &times;
                        </button>
                    </Modal.Header>

                    {/* 모달 바디 부분 */}
                    <Modal.Body className='px-6 py-4 text-[#6B7280] leading-relaxed'>
                        {message}
                    </Modal.Body>

                    {/* 푸터 부분(오른쪽 정렬) */}
                    <Modal.Footer className='border-0 pb-5 px-6 flex justify-center'>
                        <Button 
                            onClick={onHide}
                            className='w-24 h-11 border-0 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 active:scale-95 transition'
                            style={{ 
                            width: '96px',
                            height: '44px',
                            fontWeight: '600',
                        }}
                        
                        >
                        확인
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    )
}

export default AlertModal;