import React from 'react';
import { LayoutDashboard, ArrowRightLeft, Target, BarChart2, Settings, LogOut, ChevronLeft, ChevronRight, Calendar, Clock, Tag, TrendingUp, Cloud, Moon, Sun } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, onLogout, isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
    const navItems = [
        { name: 'Overview', icon: LayoutDashboard },
        { name: 'Transactions', icon: ArrowRightLeft },
        { name: 'Scheduled transactions', icon: Clock },
        { name: 'Budgets', icon: Target },
        { name: 'Charts', icon: BarChart2 },
        { name: 'Categories', icon: Tag },
        { name: 'Forecasts', icon: Cloud },
        { name: 'Calendar', icon: Calendar },
    ];

    const footerItems = [
        { name: 'Settings', icon: Settings },
        { name: 'Preferences', icon: Settings },
    ];

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`} role="complementary" aria-label="Primary sidebar">
            <style>{`
                :root {
                    --sidebar-bg: #F7F9FC;
                    --sidebar-logo-text: #1a202c;
                    --sidebar-link-text: #718096;
                    --sidebar-link-hover-bg: #EDF2F7;
                    --sidebar-link-active-bg: #EBF8FF;
                    --sidebar-link-active-text: #3182CE;
                    --sidebar-link-active-indicator: #3182CE;
                    --sidebar-border-color: #E2E8F0;
                }

                body.dark-mode {
                    --sidebar-bg: #1A202C;
                    --sidebar-logo-text: #F7FAFC;
                    --sidebar-link-text: #A0AEC0;
                    --sidebar-link-hover-bg: #2D3748;
                    --sidebar-link-active-bg: #2D3748;
                    --sidebar-link-active-text: #63B3ED;
                    --sidebar-link-active-indicator: #63B3ED;
                    --sidebar-border-color: #2D3748;
                }

                .sidebar {
                    display: flex;
                    flex-direction: column;
                    background-color: var(--sidebar-bg);
                    border-right: 1px solid var(--sidebar-border-color);
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    height: 100vh;
                }
                .sidebar.open { width: 260px; }
                .sidebar.closed { width: 88px; }

                .sidebar-inner {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 1.5rem;
                }

                .sidebar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0 0.5rem;
                    margin-bottom: 2.5rem;
                    height: 40px;
                }
                .sidebar-logo-icon {
                    font-size: 2.25rem;
                    line-height: 1;
                }
                .sidebar-logo span {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--sidebar-logo-text);
                    white-space: nowrap;
                    opacity: 1;
                    transition: opacity 0.2s ease;
                }
                 .sidebar.closed .sidebar-logo span {
                    opacity: 0;
                 }

                .sidebar-nav { flex-grow: 1; }
                .sidebar-nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .sidebar-nav-item a, .sidebar-footer button, .sidebar-footer a {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 1rem;
                    border-radius: 8px;
                    color: var(--sidebar-link-text);
                    text-decoration: none;
                    font-weight: 500;
                    transition: background-color 0.2s, color 0.2s;
                    white-space: nowrap;
                    position: relative;
                    width: 100%;
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    font-size: 0.95rem;
                }
                .sidebar-nav-item a:hover, .sidebar-footer button:hover, .sidebar-footer a:hover {
                    background-color: var(--sidebar-link-hover-bg);
                    color: var(--sidebar-logo-text);
                }
                .sidebar-nav-item a.active, .sidebar-footer a.active {
                    background-color: var(--sidebar-link-active-bg);
                    color: var(--sidebar-link-active-text);
                    font-weight: 600;
                }
                
                .sidebar .icon { 
                    min-width: 24px; 
                    transition: transform 0.2s;
                }
                 .sidebar-nav-item a:hover .icon, .sidebar-footer button:hover .icon, .sidebar-footer a:hover .icon {
                    transform: scale(1.1);
                 }

                .sidebar-separator {
                    height: 1px;
                    background-color: var(--sidebar-border-color);
                    margin: 1.5rem 0.5rem;
                }

                .sidebar-footer { 
                    margin-top: auto; 
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .sidebar-toggle-btn {
                    position: absolute;
                    top: 2.2rem;
                    right: -14px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: var(--sidebar-bg);
                    border: 1px solid var(--sidebar-border-color);
                    color: var(--sidebar-link-text);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    z-index: 10;
                }
                .sidebar-toggle-btn:hover {
                    transform: scale(1.15);
                    color: var(--sidebar-logo-text);
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
            `}</style>
            <div className="sidebar-inner">
                <div className="sidebar-logo" aria-hidden={!isSidebarOpen}>
                    <div className="sidebar-logo-icon">💰</div>
                    {isSidebarOpen && <span>Fast Budget</span>}
                </div>
                
                <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
                    <ul>
                        {navItems.map(item => {
                            const isActive = activePage === item.name;
                            const ItemIcon = item.icon;
                            return (
                                <li key={item.name} className="sidebar-nav-item">
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setActivePage(item.name); }}
                                        className={isActive ? 'active' : ''}
                                        aria-current={isActive ? 'page' : undefined}
                                        title={item.name}
                                    >
                                        <ItemIcon className="icon" size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                                        {isSidebarOpen && <span className="label">{item.name}</span>}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-separator"></div>
                    {footerItems.map(item => {
                        const isActive = activePage === item.name;
                        const ItemIcon = item.icon;
                        return (
                             <a key={item.name} href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.name); }} className={isActive ? 'active' : ''} title={item.name}>
                                <ItemIcon className="icon" size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                                {isSidebarOpen && <span className="label">{item.name}</span>}
                            </a>
                        );
                    })}
                     <button type="button" onClick={toggleDarkMode} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                        {isDarkMode ? <Sun className="icon" size={20} /> : <Moon className="icon" size={20} />}
                        {isSidebarOpen && <span className="label">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    <button type="button" onClick={onLogout} aria-label="Logout" title="Logout">
                        <LogOut className="icon" size={20} aria-hidden="true" />
                        {isSidebarOpen && <span className="label">Logout</span>}
                    </button>
                </div>
            </div>

            <button
                onClick={toggleSidebar}
                className="sidebar-toggle-btn"
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-expanded={isSidebarOpen}
                title={isSidebarOpen ? 'Collapse' : 'Expand'}
            >
                {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </aside>
    );
};

export default Sidebar;

