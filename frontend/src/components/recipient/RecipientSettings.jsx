import React, { useState } from 'react';

export default function RecipientSettings({ user }) {
    // Mock settings update since we don't have a specific recipient profile update endpoint yet
    // We can reuse the auth/me endpoint or similar if it existed for updates
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        mobile: user?.mobile || '',
        address: user?.address || ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setMsg('✓ Settings updated (Mock).');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="rp-animate-fade">
            <div className="rp-header">
                <div>
                    <h1 className="rp-title">Account Settings</h1>
                    <p className="rp-subtitle">Manage your account and privacy.</p>
                </div>
            </div>

            <div className="rp-card" style={{ maxWidth: '600px' }}>
                {msg && (
                    <div className={`rp-badge success`} style={{ marginBottom: '1rem', display: 'block', padding: '1rem', fontSize: '1rem' }}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="rp-grid-2">
                        <div className="rp-form-group">
                            <label className="rp-label">First Name</label>
                            <input
                                type="text" className="rp-input"
                                value={formData.first_name}
                                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Last Name</label>
                            <input
                                type="text" className="rp-input"
                                value={formData.last_name}
                                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="rp-form-group">
                        <label className="rp-label">Mobile Number</label>
                        <input
                            type="tel" className="rp-input"
                            value={formData.mobile}
                            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>

                    <div className="rp-form-group">
                        <label className="rp-label">Address</label>
                        <textarea
                            className="rp-textarea" rows="2"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        ></textarea>
                    </div>

                    <button type="submit" className="rp-btn rp-btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
