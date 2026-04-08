import React from 'react';
import './DonorPortal.css';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'donate-blood', label: 'Donate Blood', icon: '🩸' },
        { id: 'donate-organ', label: 'Donate Organ', icon: '🫀' },
        { id: 'active-requests', label: 'Active Requests', icon: '🚑' },
        { id: 'history', label: 'Donation History', icon: '📜' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'profile', label: 'Medical Profile', icon: '👤' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="dp-sidebar">
            <div className="dp-sidebar-header">
                <span className="dp-logo">❤️ LifeLink</span>
            </div>

            <div className="dp-sidebar-nav">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`dp-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="dp-sidebar-footer">
                <button className="dp-logout-btn" onClick={onLogout}>
                    <span>🚪</span> Logout
                </button>
            </div>
        </div>
    );
}
