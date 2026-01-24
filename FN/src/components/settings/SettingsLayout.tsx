import { Outlet } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';

const SettingsLayout = () => {
    return(
        <div className="flex h-full">
            <SettingsSidebar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
};

export default SettingsLayout;