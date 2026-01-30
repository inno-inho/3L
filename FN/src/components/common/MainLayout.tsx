import React from 'react';
import type {ReactNode} from 'react';
import { Outlet } from 'react-router-dom';

import Header from './Header';

interface MainLayoutProps{
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    
    return(
        <>
            {/* 베이지색 배경색 지정 */}
            <div className='w-full min-h-screen bg-[#fff9ed] flex flex-col m-0 p-0'>
                <Header />
                <main className='flex-1 w-full p-6'>
                    {/* 하위 라우터들이 이 자리에 렌더링 됨 */}
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default MainLayout;

