import React from 'react';
import './RecipientPortal.css';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'request-blood', label: 'Request Blood', icon: '🩸' },
        { id: 'request-organ', label: 'Request Organ', icon: '🫀' },
        { id: 'active-requests', label: 'Active Requests', icon: '🚑' },
        { id: 'matched-donors', label: 'Matched Donors', icon: '🤝' },
        { id: 'history', label: 'Request History', icon: '📜' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'profile', label: 'Medical Profile', icon: '👤' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="rp-sidebar">
            <div className="rp-sidebar-header">
                <span className="rp-logo">❤️ LifeLink</span>
            </div>

            <div className="rp-sidebar-nav">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`rp-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="rp-sidebar-footer">
                <button className="rp-logout-btn" onClick={onLogout}>
                    <span>Door</span> Logout
                </button>
            </div>
        </div>
    );
}
