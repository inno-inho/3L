import { NavLink } from 'react-router-dom';
import account from '@/assets/image/account_box.svg';
import security from '@/assets/image/security.svg';
import support from '@/assets/image/support_agent.svg';

const SettingsSidebar = () => {
    return (
        <aside className="w-40 border-r border-[#743F24]">
            <nav className="flex flex-col gap-3">
                <NavLink 
                    to="profile" 
                    end={false} // settings에 접속했을 때 바로 /settings/profile로 변경(처음부터 계정 active 한 상태로 보임)
                    className={({ isActive }) => `flex items-center gap-2 py-2 mr-2 rounded-md transition-colors 
                    ${ isActive ? 'bg-[#FFF9ED] text-[#743F24] font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}` }>
                    <img src={account} className="w-8 h-8" />
                    <p className="text-xl">계정정보</p>
                </NavLink>
                <NavLink to="security"
                    className={({ isActive }) => `flex items-center gap-2 py-2 mr-2 rounded-md transition-colors 
                    ${ isActive ? 'bg-[#FFF9ED] text-[#743F24] font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}` }>
                    <img src={security} className="w-8 h-8" />
                    <p className="text-xl">보안</p>
                </NavLink>
                <NavLink to="support"
                    className={({ isActive }) => `flex items-center gap-2 py-2 mr-2 rounded-md transition-colors 
                    ${ isActive ? 'bg-[#FFF9ED] text-[#743F24] font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}` }>
                    <img src={support} className="w-8 h-8" />
                    <p className="text-xl">고객센터</p>
                </NavLink>
            </nav>
        </aside>
    )
};

export default SettingsSidebar;