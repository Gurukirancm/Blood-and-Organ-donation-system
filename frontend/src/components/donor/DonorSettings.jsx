import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function DonorSettings({ donor, onUpdate }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        mobile: '',
        address: '',
        email: '' // Read only
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (donor) {
            setFormData({
                first_name: donor.first_name || '',
                last_name: donor.last_name || '',
                mobile: donor.mobile || '',
                address: donor.address || '',
                email: donor.email || ''
            });
        }
    }, [donor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            await API.put('/api/donors/me', formData);
            setMsg('✓ Account settings updated successfully!');
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
            setMsg('✗ Failed to update settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dp-animate-fade">
            <div className="dp-header">
                <div>
                    <h1 className="dp-title">Account Settings</h1>
                    <p className="dp-subtitle">Manage your personal information.</p>
                </div>
            </div>

            <div className="dp-card" style={{ maxWidth: '600px' }}>
                {msg && (
                    <div className={`dp-badge ${msg.includes('✓') ? 'success' : 'danger'}`} style={{ marginBottom: '1rem', display: 'block', padding: '1rem', fontSize: '1rem' }}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="dp-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="dp-form-group">
                            <label className="dp-label">First Name</label>
                            <input
                                type="text"
                                className="dp-input"
                                value={formData.first_name}
                                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="dp-form-group">
                            <label className="dp-label">Last Name</label>
                            <input
                                type="text"
                                className="dp-input"
                                value={formData.last_name}
                                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="dp-form-group">
                        <label className="dp-label">Email Address</label>
                        <input
                            type="email"
                            className="dp-input"
                            value={formData.email}
                            disabled
                            style={{ background: '#f1f2f6', cursor: 'not-allowed' }}
                        />
                        <small style={{ color: 'var(--dp-muted)' }}>Email cannot be changed.</small>
                    </div>

                    <div className="dp-form-group">
                        <label className="dp-label">Mobile Number</label>
                        <input
                            type="tel"
                            className="dp-input"
                            value={formData.mobile}
                            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>

                    <div className="dp-form-group">
                        <label className="dp-label">Residential Address</label>
                        <textarea
                            className="dp-textarea"
                            rows="2"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="dp-form-group" style={{ marginTop: '2rem' }}>
                        <button type="submit" className="dp-btn dp-btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Update Settings'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="dp-card" style={{ maxWidth: '600px', border: '1px solid #ff4757' }}>
                <h3 style={{ marginTop: 0, color: '#ff4757' }}>Danger Zone</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="dp-btn" style={{ background: '#ff4757', color: 'white' }}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}
