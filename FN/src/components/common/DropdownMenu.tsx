import React, { useState } from 'react';

interface DropdownMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const DropdownMenu = ({ isOpen, onClose, onLogout }: DropdownMenuProps) => {
    // 채팅알림 ON/OFF 상태 관리(기본값은 true)
    const [isNotifyOn, setIsNotifyOn] = useState(true);

    if (!isOpen) return null;   // 안 열려있으면 걍 아무것도 아닌 거

    return (
        <>
            <div className='absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden'>
                {/* 채팅알림 섹션 */}
                <div className='px-4 py-4 flex justify-between items-center border-b border-gray-50 hover:bg-slate-50'>
                    <span className='text-[#6F4E37] font-bold text-[15px]'>채팅 알림</span>
                    {/* 채팅알림 스위치 버튼 */}
                    <button
                        onClick={() => setIsNotifyOn(!isNotifyOn)} // 클릭 시 상태 반전
                        className={`w-11 h-6 rounded-full relative transition-colors duration-300 ease-in-out ${
                            isNotifyOn ? 'bg-[#6F4E37]' : 'bg-[#C7C7C7]'
                        }`} // 상태에 따라 주황색/회색 변경
                    >
                        <div 
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                                isNotifyOn ? 'translate-x-6' : 'translate-x-1'
                            }`}     // ON일 때 오른쪽(translate-x-6), OFF일 때 왼쪽(translate-x-1)로 이동
                        >
                        </div>
                    </button>
                </div>

                <button
                    className='w-full text-left px-4 py-3 text-[#4A3428] hover:bg-gray-50 transition-colors text-[15px]'
                    onClick={() => {
                        window.location.reload();
                        onClose();
                    }}
                >
                    새로고침
                </button>

                {/* 하단 구분선 및 로그아웃 */}
                <div className='mt-2 border-t border-gray-100'>
                    <button
                        className='w-full text-left px-4 py-4 text-[#D2691E] font-extrabold hover:bg-red-50 transition-colors text-[15px]'
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </>
    );
};

export default DropdownMenu;