import React from 'react';
import './HospitalPortal.css';

export default function Notifications() {
    // Mock notifications
    const notifications = [
        { id: 1, type: 'match', message: 'New donor match found for Kidney request #REQ-102.', time: '10 mins ago', read: false },
        { id: 2, type: 'alert', message: 'Emergency alert: O- blood shortage in your region.', time: '2 hours ago', read: false },
        { id: 3, type: 'system', message: 'System maintenance scheduled for tonight at 2 AM.', time: '1 day ago', read: true },
        { id: 4, type: 'success', message: 'Procedure #TXN-9831 confirmed on blockchain.', time: '2 days ago', read: true }
    ];

    return (
        <div className="hp-animate-fade">
            <div className="hp-header">
                <div>
                    <h1 className="hp-title">Notifications</h1>
                    <p className="hp-subtitle">Alerts and system updates</p>
                </div>
                <button className="hp-btn hp-btn-outline">
                    Mark all as read
                </button>
            </div>

            <div className="hp-grid" style={{ gridTemplateColumns: '1fr' }}>
                {notifications.map(notif => (
                    <div key={notif.id} className="hp-card" style={{
                        borderLeft: `5px solid ${notif.read ? 'var(--hp-border)' : 'var(--hp-primary)'}`,
                        background: notif.read ? 'white' : '#f0f9ff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '1.5rem' }}>
                            {notif.type === 'match' && '🤝'}
                            {notif.type === 'alert' && '🚨'}
                            {notif.type === 'system' && '🛠️'}
                            {notif.type === 'success' && '✅'}
                        </div>
                        <div>
                            <div style={{ fontWeight: notif.read ? 'normal' : 'bold', color: '#1e293b' }}>
                                {notif.message}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--hp-text-muted)', marginTop: '0.25rem' }}>
                                {notif.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
