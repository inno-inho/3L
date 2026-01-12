import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import type { User } from '../../context/AuthContext';

import ProfileImage from './ProfileImage';
import chats from '@/assets/image/chats.svg';
import users from '@/assets/image/users.svg';
import megaphone from '@/assets/image/megaphone.png';
import setting from '@/assets/image/setting.png';
import exit from '@/assets/image/exit.png';


const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className='w-20 h-full flex flex-col items-center py-6'>
                {/* 최상단 코코넛톡 로그 */}
                <div className='mb-10'>
                    <ProfileImage
                        url={user?.userProfileImageUrl}
                        size='md'
                    />
                </div>
                {/* 중앙 메뉴 아이콘들 */}
                <div className='flex-1 flex-col gap-6 mb-4'>
                    {/* 네모-> 아마도 채팅 */}
                    <div 
                        className={`relative w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-colors mb-3
                            ${isActive('/chatPage') ? 'bg-[#EBDCCB]' : 'hover:bg-[#f2ebe0]'}`}
                        onClick={() => navigate('/chatPage')}
                    >
                    <img src={chats} alt='채팅방 목록?' className='w-7 h-7'/>
                    {isActive('/chatPage') && (
                        <div className='absolute -right-4 w-1 h-8 bg-[#8B4513] rounded-l-full'/>
                    )}        
                    </div>
                    {/* 친구목록 아이콘 */}
                    <div className='w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer hover:bg-[#f2ebe0] transition-colors opacity-50 hover:opacity-100'>
                        <img src={users} alt='접속상태인 친구목록' className='w-7 h-7'/>
                    </div>
                    
                   
                </div>
                {/* 하단 아이콘들 */}
                <div className='flex flex-col gap-6 mb-4'>
                    {/* 확성기 아이콘 */}
                    <div className='w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer hover:bg-[#f2ebe0] transition-colors opacity-50 hover:opacity-100'>
                        <img src = {megaphone} alt='확성기' className='w-7 h-7'/>
                    </div>
                    {/* 설정 아이콘 */}
                    <div className='w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer hover:bg-[#f2ebe0] transition-colors opacity-50 hover:opacity-100'>
                        <img src={setting} alt='설정' className='w-7 h-7' />
                    </div>
                    {/* 나가기 아이콘 */}
                    <div className='w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer hover:bg-[#f2ebe0] transition-colors opacity-50 hover:opacity-100'>
                        <img src={exit} alt='나가기' className='w-7 h-7' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;