import React from 'react';
import { ChevronDown, Bell, Menu } from 'lucide-react';

const Header = ({ userName, activePage, onMenuClick }) => {
    const initials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'UC';

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn" onClick={onMenuClick}>
                    <Menu size={20} />
                </button>
                <h1 className="header-title">{activePage}</h1>
            </div>
            

            <div className="header-user-menu">
                <button className="header-bell-btn">
                    <Bell size={22}/>
                    <span className="notification-badge">2</span>
                </button>
                <div className="user-profile">
                    <div className="user-avatar">
                        {initials}
                    </div>
                    <div>
                        <span className="user-name">{userName || 'Upesh Chowdary'}</span>
                        <ChevronDown className="inline-block text-gray-400" size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;