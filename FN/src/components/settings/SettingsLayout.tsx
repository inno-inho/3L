import { Outlet } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';

const SettingsLayout = () => {
    return(
        <div className="flex h-full">
            <SettingsSidebar />
            <div className="">
                <Outlet />
            </div>
        </div>
    )
};

export default SettingsLayout;