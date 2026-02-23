import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';
import FriendListModal from '../friend/FriendListPage';

import ProfileImage from './ProfileImage';
import chats from '@/assets/image/chats.svg';
import users from '@/assets/image/users.svg';
import megaphone from '@/assets/image/megaphone.svg';
import setting from '@/assets/image/settings.svg';
import exit from '@/assets/image/logout.svg';

interface SidebarProps {
    currentUser: User | null;
}

const Sidebar = ({ currentUser }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const isActive = (path: string) => {
        // 메인 페이지(/)가 아니라도, 해당 경로로 시작하면 true 반환
        if (path !== '/') {
            return location.pathname.startsWith(path);
        }
        return location.pathname === path;
    };

    return (
        <>
            <div className="mx-2 py-8 px-2 h-full flex flex-col">
                <div className='flex flex-col items-center h-full'>
                    {/* 최상단 코코넛톡 로그 */}
                    <div className='mb-10'>
                        <ProfileImage
                            url={user?.profileImageUrl}
                            size='md'
                        />
                    </div>
                    {/* 중앙 메뉴 아이콘들 */}
                    <div className='flex-1 flex-col gap-6 mb-4'>
                        {/* 네모-> 채팅방 목록 */}
                        <div
                            className={`relative w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-colors mb-3
                                ${isActive('/chatPage') ? 'bg-[#EBDCCB]' : 'hover:bg-[#f2ebe0]'}`}
                            onClick={() => navigate('/chatPage')}
                        >
                            <img src={chats} alt='채팅방 목록?' className='w-7 h-7' />
                            {isActive('/chatPage') && (
                                <div className='absolute -right-4 w-1 h-8 bg-[#8B4513] rounded-l-full' />
                            )}
                        </div>
                        {/* 친구목록 아이콘 */}
                        <div
                            className={`relative w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-colors
                                ${isActive('/friends') ? 'bg-[#EBDCCB]' : 'hover:bg-[#f2ebe0] opacity-50 hover:opacity-100'}`}
                            onClick={() => navigate('/friends')}
                        >
                            <img src={users} alt='친구목록' className='w-7 h-7' />
                            {isActive('/friends') && (
                                <div className='absolute -right-4 w-1 h-8 bg-[#8B4513] rounded-l-full' />
                            )}
                        </div>
                    </div>
                    {/* 하단 아이콘들 */}
                    <div className='flex flex-col gap-4 mb-4'>
                        {/* 공지사항 */}
                        <Link to="/notices">
                            <div className={`relative w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-colors
                                ${isActive('/notices') ? 'bg-[#EBDCCB] opacity-100' : 'hover:bg-[#f2ebe0] opacity-50 hover:opacity-100'}`}>
                                <img src={megaphone} alt='공지사항' className='w-7 h-7' />
                                {isActive('/notices') && (
                                    <div className='absolute -right-4 w-1 h-8 bg-[#8B4513] rounded-l-full' />
                                )}
                            </div>
                        </Link>

                        {/* 설정 아이콘 */}
                        <Link to="/settings">
                            <div className={`relative w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-colors
                                ${isActive('/settings') ? 'bg-[#EBDCCB] opacity-100' : 'hover:bg-[#f2ebe0] opacity-50 hover:opacity-100'}`}>
                                <img src={setting} alt='설정' className='w-7 h-7' />
                                {isActive('/settings') && (
                                    <div className='absolute -right-4 w-1 h-8 bg-[#8B4513] rounded-l-full' />
                                )}
                            </div>
                        </Link>

                        <div className='w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer hover:bg-[#f2ebe0] transition-colors opacity-50 hover:opacity-100'>
                            <img src={exit} alt='로그아웃' className='w-7 h-7' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;