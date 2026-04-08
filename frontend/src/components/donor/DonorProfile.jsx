import React from 'react';

export default function DonorProfile({ donor }) {
    if (!donor) return <div>Loading profile...</div>;

    return (
        <div className="dp-animate-fade">
            <div className="dp-header">
                <div>
                    <h1 className="dp-title">Medical Profile</h1>
                    <p className="dp-subtitle">Your confidential health and donation information.</p>
                </div>
                <div className={`dp-badge ${donor.health_status === 'Healthy' ? 'success' : 'warning'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    Health Status: {donor.health_status || 'Not Reported'}
                </div>
            </div>

            <div className="dp-grid">
                <div className="dp-card">
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--dp-primary)' }}>Blood Donation Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="dp-label" style={{ color: 'var(--dp-muted)' }}>Blood Group</label>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--dp-text)' }}>
                                {donor.blood_group || 'Not Set'}
                            </div>
                        </div>
                        <div>
                            <label className="dp-label" style={{ color: 'var(--dp-muted)' }}>Last Donation</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                                {donor.last_donation || 'Never'}
                            </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="dp-label" style={{ color: 'var(--dp-muted)' }}>Eligibility Status</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{donor.donate_blood ? '✅ Eligible' : '❌ Ineligible'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dp-card">
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--dp-secondary)' }}>Organ Donation Profile</h3>
                    <div>
                        <label className="dp-label" style={{ color: 'var(--dp-muted)' }}>Pledged Organs</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {donor.organs && donor.organs.length > 0 ? (
                                donor.organs.map(o => (
                                    <span key={o} className="dp-badge info" style={{ fontSize: '0.9rem' }}>{o}</span>
                                ))
                            ) : (
                                <span style={{ color: 'var(--dp-muted)' }}>No organs pledged yet.</span>
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label className="dp-label" style={{ color: 'var(--dp-muted)' }}>Consent Agreement</label>
                        <div>{donor.consent_agreement ? 'Signed ✅' : 'Not signed ❌'}</div>
                    </div>
                </div>
            </div>

            <div className="dp-card">
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Medical History & Notes</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--dp-text)' }}>
                    {donor.medical_history || 'No medical history recorded. Please update your profile if you have any conditions.'}
                </p>
            </div>
        </div>
    );
}
