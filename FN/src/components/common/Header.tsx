import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom';    

import ProfileImage from './ProfileImage';
import coconuttalk from '@/assets/image/coconuttalk.png';
import DropdownMenu from './DropdownMenu';

const Header: React.FC = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown' , handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <>
            <header className='ml-11 mr-11 flex justify-between items-center px-6 py-3 bg-transparent'>
                {/* 로고 영역 */}
                <Link 
                    to="/chatPages" 
                    className='flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer'
                >
                    <div className='w-8 h-8 flex items-center justify-center text-white font-bold'>
                        <img src={coconuttalk} alt="코코넛 톡 로고" />
                    </div>
                    <span className='text-4xl text-[#6F4E37] tracking-tight font-nerko font-normal'>
                        CoconutTalk
                    </span>
                </Link>

                {/* 오른쪽: 사용자 정보 및 드롭다운 */}
                <div className='relative' ref={dropdownRef}>
                    <div 
                        className='flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/5 cursor-pointer transition-colors'
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                            <ProfileImage
                                url={user?.userProfileImageUrl}
                                nickname={user?.nickname}
                                size='sm'
                            />
                        <span className='text-[#6F4E37] font-bold text-sm'>{user?.nickname}</span>
                        <svg 
                            className={`w-4 h-4 text-[#6F4E37] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill='none' 
                            stroke='currentColor' 
                            viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* 드롭다운 컴포넌트 적용 */}
                    <DropdownMenu 
                        isOpen = {isDropdownOpen}
                        onClose={() => setIsDropdownOpen(false)}
                        onLogout={logout}
                        // nickname={user?.nickname}
                    />
                </div>
            </header>
        </>
    )
}

export default Header;