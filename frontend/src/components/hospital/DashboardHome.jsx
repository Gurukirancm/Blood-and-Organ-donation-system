import React from 'react';
import './HospitalPortal.css';

export default function DashboardHome({ stats, recentActivity }) {
    return (
        <div className="hp-animate-fade">
            <div className="hp-header">
                <div>
                    <h1 className="hp-title">Dashboard Overview</h1>
                    <p className="hp-subtitle">Welcome back, Hospital Admin</p>
                </div>
                <button className="hp-btn hp-btn-primary">
                    <span>📅</span> {new Date().toLocaleDateString()}
                </button>
            </div>

            <div className="hp-grid">
                <StatCard
                    label="Total Requests"
                    value={stats.total || 0}
                    icon="📋"
                    color="primary"
                />
                <StatCard
                    label="Pending Approval"
                    value={stats.pending || 0}
                    icon="⏳"
                    color="warning"
                />
                <StatCard
                    label="Matched Donors"
                    value={stats.matched || 0}
                    icon="🤝"
                    color="success"
                />
                <StatCard
                    label="Completed Procedures"
                    value={stats.fulfilled || 0}
                    icon="✅"
                    color="info"
                />
            </div>

            <div className="hp-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="hp-card">
                    <h3 className="hp-card-title" style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                    {recentActivity && recentActivity.length > 0 ? (
                        <div className="hp-activity-list">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--hp-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{activity.description}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--hp-text-muted)' }}>{new Date(activity.date).toLocaleString()}</div>
                                    </div>
                                    <span className={`hp-badge hp-badge-${activity.type === 'emergency' ? 'danger' : 'info'}`}>
                                        {activity.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--hp-text-muted)', textAlign: 'center', padding: '2rem' }}>No recent activity to display.</p>
                    )}
                </div>

                <div className="hp-card">
                    <h3 className="hp-card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="hp-btn hp-btn-primary" style={{ justifyContent: 'center' }}>
                            ➕ Raise New Request
                        </button>
                        <button className="hp-btn hp-btn-outline" style={{ justifyContent: 'center' }}>
                            🔍 Search Donors
                        </button>
                        <button className="hp-btn hp-btn-outline" style={{ justifyContent: 'center' }}>
                            🚑 Emergency Alert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const bgColors = {
        primary: '#e0f2fe',
        warning: '#fef3c7',
        success: '#dcfce7',
        info: '#e0e7ff',
        danger: '#fee2e2'
    };

    const textColors = {
        primary: '#0284c7',
        warning: '#d97706',
        success: '#166534',
        info: '#4338ca',
        danger: '#dc2626'
    };

    return (
        <div className="hp-card">
            <div className="hp-icon-box" style={{ background: bgColors[color], color: textColors[color] }}>
                {icon}
            </div>
            <div className="hp-stat-val">{value}</div>
            <div className="hp-stat-label">{label}</div>
        </div>
    );
}
