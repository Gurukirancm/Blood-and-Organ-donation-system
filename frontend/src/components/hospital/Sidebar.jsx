import React from 'react';
import './HospitalPortal.css';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'raise-request', label: 'Raise Request', icon: '➕' },
        { id: 'active-requests', label: 'Active Requests', icon: '📋' },
        { id: 'matched-donors', label: 'Matched Donors', icon: '🤝' },
        { id: 'history', label: 'Donation History', icon: '📜' },
        { id: 'emergency', label: 'Emergency Requests', icon: '🚨' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'blockchain', label: 'Blockchain Logs', icon: '🔗' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'profile', label: 'Profile Settings', icon: '⚙️' },
    ];

    return (
        <div className="hp-sidebar">
            <div className="hp-sidebar-header">
                <span>🏥 Hospital Portal</span>
            </div>

            <div className="hp-sidebar-nav">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`hp-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="hp-sidebar-footer">
                <button className="hp-logout-btn" onClick={onLogout}>
                    <span>🚪</span> Logout
                </button>
            </div>
        </div>
    );
}
