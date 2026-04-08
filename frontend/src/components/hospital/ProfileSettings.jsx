import React, { useState } from 'react';
import './HospitalPortal.css';

export default function ProfileSettings({ user }) {
    const [formData, setFormData] = useState({
        name: user?.name || 'City General Hospital',
        email: user?.email || 'admin@cityhospital.com',
        phone: user?.phone || '+1 555-0123',
        address: user?.address || '123 Healthcare Blvd, Metropolis',
        license: user?.license || 'LIC-987654321'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to update profile
        alert("Profile updated successfully!");
    };

    return (
        <div className="hp-animate-fade">
            <div className="hp-header">
                <div>
                    <h1 className="hp-title">Hospital Profile</h1>
                    <p className="hp-subtitle">Manage institutional details and settings</p>
                </div>
            </div>

            <div className="hp-card" style={{ maxWidth: '800px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--hp-border)' }}>
                    <div style={{ width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        🏥
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{formData.name}</h2>
                        <p style={{ color: 'var(--hp-text-muted)', margin: '0.5rem 0' }}>License: {formData.license}</p>
                        <span className="hp-badge hp-badge-success">Verified Institution</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="hp-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="hp-form-group">
                            <label className="hp-label">Institution Name</label>
                            <input className="hp-input" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="hp-form-group">
                            <label className="hp-label">Email Address</label>
                            <input className="hp-input" name="email" value={formData.email} onChange={handleChange} disabled style={{ background: '#f8fafc' }} />
                        </div>
                    </div>

                    <div className="hp-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="hp-form-group">
                            <label className="hp-label">Phone Number</label>
                            <input className="hp-input" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="hp-form-group">
                            <label className="hp-label">License Key</label>
                            <input className="hp-input" name="license" value={formData.license} onChange={handleChange} disabled style={{ background: '#f8fafc' }} />
                        </div>
                    </div>

                    <div className="hp-form-group">
                        <label className="hp-label">Address</label>
                        <textarea className="hp-textarea" name="address" value={formData.address} onChange={handleChange} rows="3"></textarea>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <button type="submit" className="hp-btn hp-btn-primary">
                            💾 Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
