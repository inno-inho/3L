import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
    return(
        <div className='w-full min-h-screen bg-[#fff9ed] flex justify-center'>
            <div className="w-full max-w-screen-xl mx-auto flex flex-col">
                <Header />
                <div className="flex-1 flex min-h-0">
                    <Sidebar />
                    <main className="flex-1 min-w-0 px-4 py-3">
                        <div className="w-full h-full mx-auto bg-white rounded-xl shoadow-sm p-8">
                            <Outlet /> {/* 바뀌는 영역 */}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;

