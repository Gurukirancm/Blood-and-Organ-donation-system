import React from 'react';

export default function RecipientProfile({ user, requests }) {
    if (!user) return <div>Loading profile...</div>;

    // Get latest request for "current condition" if available
    const latestRequest = requests && requests.length > 0 ? requests[0] : null;

    return (
        <div className="rp-animate-fade">
            <div className="rp-header">
                <div>
                    <h1 className="rp-title">Medical Profile</h1>
                    <p className="rp-subtitle">Your patient details and medical history.</p>
                </div>
            </div>

            <div className="rp-grid">
                <div className="rp-card">
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--rp-primary)' }}>Personal Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="rp-label" style={{ color: 'var(--rp-muted)' }}>Full Name</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--rp-text)' }}>
                                {user.first_name} {user.last_name}
                            </div>
                        </div>
                        <div>
                            <label className="rp-label" style={{ color: 'var(--rp-muted)' }}>Email</label>
                            <div style={{ fontSize: '1.1rem' }}>{user.email}</div>
                        </div>
                        <div>
                            <label className="rp-label" style={{ color: 'var(--rp-muted)' }}>Registered Since</label>
                            <div style={{ fontSize: '1rem' }}>{new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <div className="rp-card">
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--rp-secondary)' }}>Medical Summary</h3>
                    {latestRequest ? (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="rp-label" style={{ color: 'var(--rp-muted)' }}>Blood Group</label>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--rp-text)' }}>
                                    {latestRequest.blood_group}
                                </div>
                            </div>
                            <div>
                                <label className="rp-label" style={{ color: 'var(--rp-muted)' }}>Primary Condition</label>
                                <p style={{ margin: 0 }}>{latestRequest.health_condition || 'Not specified'}</p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--rp-muted)' }}>No medical requests filed yet. Submit a request to update your medical profile.</p>
                    )}
                </div>
            </div>

            <div className="rp-card">
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Emergency Contact</h3>
                <p style={{ color: 'var(--rp-muted)', fontStyle: 'italic' }}>
                    Please ensure your emergency contact details are up to date in Settings.
                </p>
                {/* Placeholder for emergency contact if we had it in user model */}
                <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffeeba', color: '#856404' }}>
                    <strong>⚠️ Action Needed:</strong> Please add an emergency contact number.
                </div>
            </div>
        </div>
    );
}
