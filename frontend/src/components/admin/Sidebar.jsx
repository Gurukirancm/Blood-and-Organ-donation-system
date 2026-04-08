import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const NavBtn = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`ap-nav-btn ${activeTab === id ? 'active' : ''}`}
        >
            <span>{icon}</span> {label}
        </button>
    );

    return (
        <div className="ap-sidebar">
            <div className="ap-sidebar-header">
                <span>🛡️</span> Super Admin
            </div>
            <nav className="ap-nav">
                <NavBtn id="overview" label="Overview" icon="📊" />
                <NavBtn id="hospitals" label="Hospital Management" icon="🏥" />
                <NavBtn id="donors" label="Donor Management" icon="🩸" />
                <NavBtn id="requests" label="Request Management" icon="📝" />
                <NavBtn id="audit" label="Blockchain Audit" icon="📜" />
            </nav>
            <div className="ap-logout-container">
                <button onClick={onLogout} className="ap-logout-btn">
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}
