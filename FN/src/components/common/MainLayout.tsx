import React from 'react';
import type {ReactNode} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps{
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    const { user } = useAuth(); 
    const location = useLocation(); // 사용자가 어떤 페이지(URL)에 있는지 알 수 있음 location 객체 안에 {pathname:, search:}

    //
    const isChatPage = location.pathname.startsWith('/chatPage');

    return(
        <div className='w-full min-h-screen bg-[#fff9ed] flex justify-center'>
            <div className="w-full max-w-screen-xl mx-auto flex flex-col">
                <Header />
                <div className="flex-1 flex min-h-0">
                    <Sidebar currentUser={user} />
                    <main className="flex-1 min-w-0 px-4 py-3">
                        {isChatPage ? (
                            <Outlet />
                        ) : (
                            <div className="w-full h-full mx-auto bg-white rounded-xl shoadow-sm p-8">
                                <Outlet /> {/* 바뀌는 영역 */}
                            </div>
                        )
                        }
                        
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;

