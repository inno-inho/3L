import React from 'react'
import { useAuth } from '../../context/AuthContext'

import coconuttalk_bg from '@/assets/image/coconuttalk_bg.png';

const Header: React.FC = () => {
    const { user } = useAuth();

    return (
        <>
            <header className='ml-11 mr-11 flex justify-between items-center px-6 py-3 bg-transparent'>
                {/* 로고 영역 */}
                <div className='flex itmes-center gap-2'>
                    <div className='w-8 h-8 flex items-center justify-center text-white font-bold'>
                        <img className="" src={coconuttalk_bg} alt="코코넛 톡 로그" />
                    </div>
                    <span className='text-2xl font-black text-[#6F4E37] tracking-tight'>
                        CoconutTalk
                    </span>
                </div>

                {/* 오른쪽: 사용자 정보 및 드롭다운 */}
                <div className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
                    <div className='flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/5 cursor-pointer transition-colors'>
                        <div className='w-8 h-8 rounded-full border border-[#D7CCC8] overflow-hidden bg-white'>
                            <img
                                src={user?.profileImageUrl || 'https://via.placeholder.com/150'}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className='text-[#6F4E37] font-bold text-sm'>
                            {user?.nickname}
                        </span>
                        <svg className='w-4 h-4 text-[#6F4E37]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                </div>
            </header>
        </>
    )
}

export default Header;