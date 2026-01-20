// 알림음 끄기, 대화상대 차단하기(일대일만), 채팅방 나가기, 

import React, { useState } from 'react';

interface ChatDropdownMenuProps {
    isOpen: boolean;
    chatRoomType: string;
}

const ChatDropdownMenu = ( { isOpen, chatRoomType } : ChatDropdownMenuProps) => {
    
    if (!isOpen) return null;   // 안 열려있으면 걍 아무것도 아닌 거

    return (
        <>
            <div className='absolute right-0 mt-3 top-full w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden'>
                {/* 알림음 끄기 */}
                <div className='px-4 py-4 flex justify-between items-center border-b border-gray-50 hover:bg-slate-50'>
                    <span className='text-[#6F4E37] text-[12px]'>알림음 끄기</span>
                </div>
                {/* 대화상대 차단하기 */}
                {chatRoomType === 'FRIEND' && (
                    <div className='px-4 py-4 flex justify-between items-center border-b border-gray-50 hover:bg-slate-50'>
                        <span className='text-[#6F4E37] text-[12px]'>대화상대 차단하기</span>
                    </div>
                )}
                {/* 채팅방 나가기 */}
                <div className='px-4 py-4 flex justify-between items-center border-b border-gray-50 hover:bg-slate-50'>
                    <span className='text-[#6F4E37] text-[12px]'>채팅방 나가기</span>
                </div>
            </div>
        </>
    );
};

export default ChatDropdownMenu;