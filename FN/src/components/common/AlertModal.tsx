import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import coconuttalk_bg from "@/assets/image/coconuttalk_bg.png";

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
            <Modal show={show} onHide={onHide} centered contentClassName='border-0 bg-transparent shadow-none' style={{borderRadius: '24px'}}>
                <div className='bg-[#FAF9F6] overflow-hidden rounded-3xl flex flex-col shadow-xl border border-gray-100'>
                    
                    {/* 모달 헤더 부분 */}
                    <Modal.Header className='border-0 pt-4 px-3 flex items-center justify-between'>
                        <div className='flex items-center'>
                            <img 
                                src={coconuttalk_bg} alt='코코넛톡 기본 배경' 
                                className='h-10 w-10 ml-3 object-contain'
                            />
                            <Modal.Title className='font-bold text-[#4A3F35] text-2xl ml-3'>{title}</Modal.Title> 
                        </div>
                        <button
                            onClick={onHide}
                            className='text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none'
                        >
                            &times;
                        </button>
                    </Modal.Header>

                    {/* 모달 바디 부분 */}
                    <Modal.Body className='px-6 py-4 text-lg text-[#6B7280]'>
                        {message}
                    </Modal.Body>

                    {/* 푸터 부분(오른쪽 정렬) */}
                    <Modal.Footer className='border-0 pb-4 px-4 flex justify-end'>
                        <Button 
                            onClick={onHide}
                            className='border-0 rounded-2xl hover:bg-[#8B4513] active:scale-95 transition-colors'
                            style={{ 
                            backgroundColor: '#B5A492', 
                            color: 'white',
                            width: '100px',
                            height: '48px',
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