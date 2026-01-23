import { NavLink } from 'react-router-dom';
import account from '@/assets/image/account_box.svg';
import security from '@/assets/image/security.svg';

const SettingsSidebar = () => {
    return (
        <aside className="w-48 border-r">
            <nav className="flex gap-2 p-4">
                <NavLink to="profile"><img src={account} />계정정보</NavLink>
                <NavLink to="security"><img src={security} />보안</NavLink>
            </nav>
        </aside>
    )
};

export default SettingsSidebar;