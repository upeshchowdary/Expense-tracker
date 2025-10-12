import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, CreditCard, Database, Trash2, Download, Upload, Save, Edit, Eye, EyeOff } from 'lucide-react';

const SettingsPage = ({ currency, setCurrency, userName, setUserName }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: userName?.split(' ')[0] || '',
        lastName: userName?.split(' ')[1] || '',
        email: 'upesh@example.com',
        phone: '+1 234 567 8900',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
        },
        privacy: {
            profileVisibility: 'private',
            dataSharing: false,
            analytics: true
        }
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSave = () => {
        const newUserName = `${formData.firstName} ${formData.lastName}`.trim();
        setUserName(newUserName);
        // Here you would typically save to backend
        console.log('Settings saved:', formData);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'data', label: 'Data & Storage', icon: Database }
    ];

    const currencies = [
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
    ];

    return (
        <div className="settings-page">
            <div className="settings-header">
            <h2>Settings</h2>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="settings-container">
                <div className="settings-sidebar">
                    <div className="settings-tabs">
                        {tabs.map(tab => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <IconComponent size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <h3>Profile Information</h3>
                            <div className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                            </div>
                                <div className="form-group">
                                <label>Currency</label>
                                <select
                                        name="currency"
                                        value={currency.code}
                                        onChange={(e) => setCurrency(currencies.find(c => c.code === e.target.value))}
                                        className="form-input"
                                    >
                                        {currencies.map(curr => (
                                            <option key={curr.code} value={curr.code}>
                                                {curr.symbol} {curr.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>Notification Preferences</h3>
                            <div className="settings-form">
                                <div className="checkbox-group">
                                    <div className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id="email"
                                            name="notifications.email"
                                            checked={formData.notifications.email}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="email">Email Notifications</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id="push"
                                            name="notifications.push"
                                            checked={formData.notifications.push}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="push">Push Notifications</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id="sms"
                                            name="notifications.sms"
                                            checked={formData.notifications.sms}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="sms">SMS Notifications</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id="marketing"
                                            name="notifications.marketing"
                                            checked={formData.notifications.marketing}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="marketing">Marketing Emails</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="settings-section">
                            <h3>Privacy & Security</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Profile Visibility</label>
                                    <select
                                        name="privacy.profileVisibility"
                                        value={formData.privacy.profileVisibility}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="friends">Friends Only</option>
                                    </select>
                                </div>
                                <div className="checkbox-group">
                                    <div className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id="dataSharing"
                                            name="privacy.dataSharing"
                                            checked={formData.privacy.dataSharing}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="dataSharing">Allow data sharing for analytics</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id="analytics"
                                            name="privacy.analytics"
                                            checked={formData.privacy.analytics}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="analytics">Enable usage analytics</label>
                                    </div>
                                </div>
                                <div className="password-section">
                                    <h4>Change Password</h4>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <div className="password-input">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance tab removed as requested */}

                    {activeTab === 'data' && (
                        <div className="settings-section">
                            <h3>Data & Storage</h3>
                            <div className="settings-form">
                                <div className="data-actions">
                                    <div className="data-action-card">
                                        <div className="data-action-icon">
                                            <Download size={24} />
                                        </div>
                                        <div className="data-action-content">
                                            <h4>Export Data</h4>
                                            <p>Download all your data in JSON format</p>
                                            <button className="data-action-btn">
                                                <Download size={16} />
                                                Export Data
                                            </button>
                                        </div>
                                    </div>
                                    <div className="data-action-card">
                                        <div className="data-action-icon">
                                            <Upload size={24} />
                                        </div>
                                        <div className="data-action-content">
                                            <h4>Import Data</h4>
                                            <p>Import data from a JSON file</p>
                                            <button className="data-action-btn">
                                                <Upload size={16} />
                                                Import Data
                            </button>
                        </div>
                                    </div>
                                    <div className="data-action-card danger">
                                        <div className="data-action-icon">
                                            <Trash2 size={24} />
                </div>
                                        <div className="data-action-content">
                                            <h4>Delete All Data</h4>
                                            <p>Permanently delete all your data</p>
                                            <button className="data-action-btn danger">
                                                <Trash2 size={16} />
                                                Delete All Data
                            </button>
                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="settings-actions">
                        <button className="save-btn" onClick={handleSave}>
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;