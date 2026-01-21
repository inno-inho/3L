import React from 'react';
import type {ReactNode} from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';



const MainLayout: React.FC = () => {
    return(
        <div className='w-full min-h-screen bg-[#fff9ed] flex flex-col m-0 p-0'>
            <Header />
            
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto px-6 py-4">
                    <Outlet /> {/* 바뀌는 영역 */}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

