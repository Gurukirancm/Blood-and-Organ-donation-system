import React from 'react';
import './RecipientPortal.css';

export default function DashboardHome({ user, stats, onQuickAction }) {
    if (!user) return <div className="rp-animate-fade">Loading...</div>;

    return (
        <div className="rp-animate-fade">
            <div className="rp-header">
                <div>
                    <h1 className="rp-title">Welcome, {user.first_name || 'Recipient'}! 👋</h1>
                    <p className="rp-subtitle">Monitor your health requests and donor matches.</p>
                </div>
            </div>

            <div className="rp-grid">
                <div className="rp-stat-card">
                    <div className="rp-stat-icon" style={{ background: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b' }}>🚑</div>
                    <div className="rp-stat-info">
                        <h3>{stats?.activeRequests || 0}</h3>
                        <p>Active Requests</p>
                    </div>
                </div>
                <div className="rp-stat-card">
                    <div className="rp-stat-icon" style={{ background: 'rgba(46, 213, 115, 0.1)', color: '#2ed573' }}>🤝</div>
                    <div className="rp-stat-info">
                        <h3>{stats?.matchesFound || 0}</h3>
                        <p>Matches Found</p>
                    </div>
                </div>
                <div className="rp-stat-card">
                    <div className="rp-stat-icon" style={{ background: 'rgba(30, 144, 255, 0.1)', color: '#1e90ff' }}>✅</div>
                    <div className="rp-stat-info">
                        <h3>{stats?.completedReqs || 0}</h3>
                        <p>Fulfilled</p>
                    </div>
                </div>
                <div className="rp-stat-card">
                    <div className="rp-stat-icon" style={{ background: 'rgba(255, 165, 2, 0.1)', color: '#ffa502' }}>🔔</div>
                    <div className="rp-stat-info">
                        <h3>{stats?.notifications || 0}</h3>
                        <p>Alerts</p>
                    </div>
                </div>
            </div>

            <h2 className="rp-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
            <div className="rp-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="rp-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onQuickAction('request-blood')}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩸</div>
                    <h3>Request Blood</h3>
                    <p className="rp-subtitle">Urgent blood requirement</p>
                </div>
                <div className="rp-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onQuickAction('request-organ')}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫀</div>
                    <h3>Request Organ</h3>
                    <p className="rp-subtitle">Find an organ donor</p>
                </div>
                <div className="rp-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onQuickAction('matched-donors')}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3>View Matches</h3>
                    <p className="rp-subtitle">See compatible donors</p>
                </div>
            </div>
        </div>
    );
}
