import React, { useState } from 'react';
import { Settings, Bell, Palette, Shield, Database, Save, RefreshCw, Download, Upload } from 'lucide-react';

// --- Reusable Styled Components ---
const StyledSelect = ({ value, onChange, children, ...props }) => (
    <div className="custom-select-wrapper">
        <select value={value} onChange={onChange} className="form-input" {...props}>
            {children}
        </select>
    </div>
);

const StyledCheckbox = ({ id, checked, onChange, label }) => (
    <div className="checkbox-item">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>{label}</label>
    </div>
);

const PreferencesPage = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [preferences, setPreferences] = useState({
        general: { language: 'en', timezone: 'UTC', dateFormat: 'DD/MM/YYYY', currency: 'INR', confirmActions: true },
        notifications: { email: true, push: false, budgetAlerts: true, weeklyReports: false },
        appearance: { theme: 'dark', fontSize: 'medium', colorScheme: 'blue' },
        data: { autoBackup: true, backupFrequency: 'daily', syncEnabled: true },
        security: { twoFactor: false, sessionTimeout: '30min', loginNotifications: true }
    });

    const handlePreferenceChange = (section, key, value) => {
        setPreferences(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value }
        }));
    };

    const sections = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'data', label: 'Data & Backup', icon: Database },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    // --- Data for Selects ---
    const languages = [{ code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'de', name: 'German' }];
    const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata'];
    const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
    const currencies = [{ code: 'INR', name: 'Indian Rupee' }, { code: 'USD', name: 'US Dollar' }, { code: 'EUR', name: 'Euro' }];
    const colorSchemes = [
        { id: 'blue', color: '#3b82f6' }, { id: 'green', color: '#10b981' },
        { id: 'purple', color: '#8b5cf6' }, { id: 'red', color: '#ef4444' }
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'general': return (
                <>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Language</label>
                            <StyledSelect value={preferences.general.language} onChange={(e) => handlePreferenceChange('general', 'language', e.target.value)}>
                                {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                            </StyledSelect>
                        </div>
                        <div className="form-group">
                            <label>Timezone</label>
                            <StyledSelect value={preferences.general.timezone} onChange={(e) => handlePreferenceChange('general', 'timezone', e.target.value)}>
                                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                            </StyledSelect>
                        </div>
                        <div className="form-group">
                            <label>Date Format</label>
                            <StyledSelect value={preferences.general.dateFormat} onChange={(e) => handlePreferenceChange('general', 'dateFormat', e.target.value)}>
                                {dateFormats.map(df => <option key={df} value={df}>{df}</option>)}
                            </StyledSelect>
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <StyledSelect value={preferences.general.currency} onChange={(e) => handlePreferenceChange('general', 'currency', e.target.value)}>
                                {currencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </StyledSelect>
                        </div>
                    </div>
                    <StyledCheckbox id="confirmActions" checked={preferences.general.confirmActions} onChange={(e) => handlePreferenceChange('general', 'confirmActions', e.target.checked)} label="Confirm destructive actions (e.g., deleting)" />
                </>
            );
            case 'notifications': return (
                <>
                    <h4>Channels</h4>
                    <div className="checkbox-grid">
                        <StyledCheckbox id="email" checked={preferences.notifications.email} onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)} label="Email Notifications" />
                        <StyledCheckbox id="push" checked={preferences.notifications.push} onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)} label="Push Notifications" />
                    </div>
                    <h4 className="mt-4">Alerts</h4>
                    <div className="checkbox-grid">
                        <StyledCheckbox id="budgetAlerts" checked={preferences.notifications.budgetAlerts} onChange={(e) => handlePreferenceChange('notifications', 'budgetAlerts', e.target.checked)} label="Budget Alerts" />
                        <StyledCheckbox id="weeklyReports" checked={preferences.notifications.weeklyReports} onChange={(e) => handlePreferenceChange('notifications', 'weeklyReports', e.target.checked)} label="Weekly Reports" />
                    </div>
                </>
            );
            case 'appearance': return (
                <div className="form-grid">
                    <div className="form-group">
                        <label>Theme</label>
                        <div className="theme-options">
                            {['light', 'dark', 'auto'].map(theme => (
                                <div key={theme} className="theme-option">
                                    <input type="radio" id={theme} name="theme" value={theme} checked={preferences.appearance.theme === theme} onChange={e => handlePreferenceChange('appearance', 'theme', e.target.value)} />
                                    <label htmlFor={theme}> <div className={`theme-preview ${theme}`}></div> <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span> </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Font Size</label>
                        <StyledSelect value={preferences.appearance.fontSize} onChange={(e) => handlePreferenceChange('appearance', 'fontSize', e.target.value)}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </StyledSelect>
                    </div>
                    <div className="form-group">
                        <label>Accent Color</label>
                        <div className="color-scheme-options">
                            {colorSchemes.map(s => <div key={s.id} className="color-scheme-option"> <input type="radio" id={`c-${s.id}`} name="color" value={s.id} checked={preferences.appearance.colorScheme === s.id} onChange={e => handlePreferenceChange('appearance', 'colorScheme', e.target.value)} /> <label htmlFor={`c-${s.id}`} style={{ backgroundColor: s.color }}></label> </div>)}
                        </div>
                    </div>
                </div>
            );
            case 'data': return (
                <>
                    <div className="form-grid">
                        <div className="form-group">
                            <StyledCheckbox id="autoBackup" checked={preferences.data.autoBackup} onChange={(e) => handlePreferenceChange('data', 'autoBackup', e.target.checked)} label="Enable Cloud Auto-Backup" />
                        </div>
                        <div className="form-group">
                            <label>Backup Frequency</label>
                            <StyledSelect value={preferences.data.backupFrequency} onChange={(e) => handlePreferenceChange('data', 'backupFrequency', e.target.value)} disabled={!preferences.data.autoBackup}>
                                <option value="daily">Daily</option> <option value="weekly">Weekly</option>
                            </StyledSelect>
                        </div>
                    </div>
                    <StyledCheckbox id="syncEnabled" checked={preferences.data.syncEnabled} onChange={(e) => handlePreferenceChange('data', 'syncEnabled', e.target.checked)} label="Sync data across your devices" />
                    <div className="data-actions">
                        <button className="btn btn-secondary"><Download size={16} /> Export Data</button>
                        <button className="btn btn-secondary"><Upload size={16} /> Import Data</button>
                    </div>
                </>
            );
            case 'security': return (
                <>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Session Timeout</label>
                            <StyledSelect value={preferences.security.sessionTimeout} onChange={(e) => handlePreferenceChange('security', 'sessionTimeout', e.target.value)}>
                                <option value="15min">15 Minutes</option> <option value="30min">30 Minutes</option> <option value="1hr">1 Hour</option>
                            </StyledSelect>
                        </div>
                    </div>
                    <StyledCheckbox id="twoFactor" checked={preferences.security.twoFactor} onChange={(e) => handlePreferenceChange('security', 'twoFactor', e.target.checked)} label="Enable Two-Factor Authentication (2FA)" />
                    <StyledCheckbox id="loginNotifications" checked={preferences.security.loginNotifications} onChange={(e) => handlePreferenceChange('security', 'loginNotifications', e.target.checked)} label="Notify on new device login" />
                </>
            );
            default: return null;
        }
    };

    return (
        <div className="page-container preferences-page">
            <style>{`
                /* --- Main Layout --- */
                .preferences-page { display: flex; gap: 2rem; height: 100%; background-color: var(--color-background); color: var(--color-text-primary); }
                .preferences-sidebar { flex: 0 0 240px; background-color: var(--color-background-offset); padding: 1.5rem; border-radius: 12px; }
                .preferences-content { flex: 1; display: flex; flex-direction: column; }
                .preferences-section-card { background-color: var(--color-background-offset); padding: 2rem; border-radius: 12px; flex: 1; }
                
                /* --- Sidebar --- */
                .preferences-sidebar h2 { font-size: 1.25rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
                .preferences-sidebar ul { list-style: none; padding: 0; margin: 0; }
                .preferences-sidebar li { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, color 0.2s; color: var(--color-text-secondary); }
                .preferences-sidebar li:hover { background-color: var(--color-background-hover); color: var(--color-text-primary); }
                .preferences-sidebar li.active { background-color: var(--color-primary-muted); color: var(--color-primary); font-weight: 500; }
                
                /* --- Content Area --- */
                .preferences-section-card h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 2rem; }
                .preferences-section-card h4 { font-size: 1rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 1rem; color: var(--color-text-secondary); }
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-group label { margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); }
                
                /* --- Form Elements --- */
                .form-input { width: 100%; background-color: var(--color-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 0.6rem 1rem; color: var(--color-text-primary); font-size: 0.875rem; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; -moz-appearance: none; appearance: none; }
                .form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-muted); }
                .custom-select-wrapper { position: relative; }
                .custom-select-wrapper::after { content: '▼'; font-size: 0.6rem; color: var(--color-text-secondary); position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; }
                .form-input[disabled] { background-color: var(--color-background-offset); cursor: not-allowed; opacity: 0.6; }

                /* --- Checkboxes & Radios --- */
                .checkbox-item { display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; }
                .checkbox-item label { color: var(--color-text-primary); }
                .checkbox-item input[type="checkbox"] { appearance: none; width: 18px; height: 18px; border: 2px solid var(--color-border); border-radius: 5px; cursor: pointer; transition: all 0.2s; }
                .checkbox-item input[type="checkbox"]:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
                .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem 1.5rem; }

                /* --- Appearance Settings --- */
                .theme-options { display: flex; gap: 1rem; }
                .theme-option input { display: none; }
                .theme-option label { cursor: pointer; text-align: center; color: var(--color-text-secondary); }
                .theme-option label span { font-size: 0.875rem; }
                .theme-option .theme-preview { width: 60px; height: 40px; border-radius: 6px; border: 2px solid var(--color-border); margin-bottom: 0.5rem; transition: border-color 0.2s; }
                .theme-option .theme-preview.light { background-color: #f8fafc; }
                .theme-option .theme-preview.dark { background-color: #1f2937; }
                .theme-option .theme-preview.auto { background: linear-gradient(45deg, #f8fafc 50%, #1f2937 50%); }
                .theme-option input:checked + label .theme-preview { border-color: var(--color-primary); }
                .theme-option input:checked + label span { color: var(--color-text-primary); }
                .color-scheme-options { display: flex; gap: 0.75rem; align-items: center; }
                .color-scheme-option input { display: none; }
                .color-scheme-option label { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: border-color 0.2s; box-shadow: 0 0 0 1px var(--color-border); }
                .color-scheme-option input:checked + label { border-color: var(--color-background-offset); }

                /* --- Data Actions --- */
                .data-actions { display: flex; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 2rem; }
                
                /* --- Action Footer --- */
                .preferences-actions { padding: 1.5rem 0; border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; gap: 1rem; margin-top: auto; }
                .btn { font-weight: 500; padding: 0.6rem 1.2rem; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
                .btn-primary { background-color: var(--color-primary); color: white; }
                .btn-primary:hover { opacity: 0.9; }
                .btn-secondary { background-color: var(--color-background-offset-2); color: var(--color-text-primary); border: 1px solid var(--color-border); }
                .btn-secondary:hover { background-color: var(--color-background-hover); }
                
                /* --- Variable Definitions (Light & Dark Themes) --- */
                :root { 
                    --color-primary: #3b82f6; 
                    --color-primary-muted: rgba(59, 130, 246, 0.1);
                    --color-background: #f8fafc; 
                    --color-background-offset: #ffffff; 
                    --color-background-offset-2: #f1f5f9; 
                    --color-background-hover: #e2e8f0;
                    --color-text-primary: #1e293b; 
                    --color-text-secondary: #64748b;
                    --color-border: #e2e8f0;
                }

                body.dark-mode {
                    --color-primary: #60a5fa; 
                    --color-primary-muted: rgba(96, 165, 250, 0.15);
                    --color-background: #111827; 
                    --color-background-offset: #1f2937; 
                    --color-background-offset-2: #374151; 
                    --color-background-hover: #4b5563;
                    --color-text-primary: #f9fafb; 
                    --color-text-secondary: #9ca3af;
                    --color-border: #374151;
                }
            `}</style>

            <div className="preferences-sidebar">
                <h2><Settings size={24} /> Preferences</h2>
                <nav>
                    <ul>
                        {sections.map(section => (
                            <li key={section.id} className={activeSection === section.id ? 'active' : ''} onClick={() => setActiveSection(section.id)}>
                                <section.icon size={20} />
                                <span>{section.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="preferences-content">
                <div className="preferences-section-card">
                    <h3>{sections.find(s => s.id === activeSection)?.label}</h3>
                    {renderSectionContent()}
                </div>
                <div className="preferences-actions">
                    <button className="btn btn-secondary"><RefreshCw size={16} /> Reset to Default</button>
                    <button className="btn btn-primary"><Save size={16} /> Save Preferences</button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesPage;

