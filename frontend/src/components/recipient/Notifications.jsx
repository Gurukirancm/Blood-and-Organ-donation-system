import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reusing the same notification endpoint
        API.get('/api/notifications')
            .then(res => setNotifications(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="rp-animate-fade">Loading notifications...</div>;

    return (
        <div className="rp-animate-fade">
            <div className="rp-header">
                <div>
                    <h1 className="rp-title">Notifications</h1>
                    <p className="rp-subtitle">Alerts and updates on your requests.</p>
                </div>
            </div>

            <div className="rp-card">
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--rp-muted)' }}>
                        <p>No new notifications.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map((notif, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                borderLeft: '4px solid var(--rp-secondary)',
                                background: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <p style={{ margin: '0 0 0.5rem', fontWeight: '500' }}>{notif.message}</p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--rp-muted)' }}>
                                        {notif.date ? new Date(notif.date).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>
                                {!notif.is_read && <span className="rp-badge info">New</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
