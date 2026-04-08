import React, { useState } from 'react';
import API from '../../api';

export default function RequestBlood({ onForceRefresh }) {
    const [formData, setFormData] = useState({
        patient_name: '',
        age: '',
        blood_group: '',
        quantity: 1,
        hospital_location: '',
        urgency: 'medium',
        required_date: '',
        health_condition: '',
        organ: 'Whole Blood' // Hidden field
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            await API.post('/api/requests', formData);
            setMsg('✓ Blood request created successfully!');
            // Reset form
            setFormData({
                patient_name: '', age: '', blood_group: '', quantity: 1,
                hospital_location: '', urgency: 'medium', required_date: '',
                health_condition: '', organ: 'Whole Blood'
            });
            if (onForceRefresh) onForceRefresh();
        } catch (err) {
            console.error(err);
            setMsg('✗ Failed to create request. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rp-animate-fade">
            <div className="rp-header">
                <div>
                    <h1 className="rp-title">Request Blood</h1>
                    <p className="rp-subtitle">Submit a new request for blood donation.</p>
                </div>
            </div>

            <div className="rp-card">
                {msg && (
                    <div className={`rp-badge ${msg.includes('✓') ? 'success' : 'danger'}`} style={{ marginBottom: '1rem', display: 'block', padding: '1rem', fontSize: '1rem' }}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="rp-grid-2">
                        <div className="rp-form-group">
                            <label className="rp-label">Patient Name</label>
                            <input
                                type="text" className="rp-input" required
                                value={formData.patient_name}
                                onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                            />
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Patient Age</label>
                            <input
                                type="number" className="rp-input" required min="0" max="120"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Blood Group Required</label>
                            <select
                                className="rp-select" required
                                value={formData.blood_group}
                                onChange={e => setFormData({ ...formData, blood_group: e.target.value })}
                            >
                                <option value="">Select Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Units/Quantity</label>
                            <input
                                type="number" className="rp-input" required min="1"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Hospital Location</label>
                            <input
                                type="text" className="rp-input" required placeholder="Hospital Name & City"
                                value={formData.hospital_location}
                                onChange={e => setFormData({ ...formData, hospital_location: e.target.value })}
                            />
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Required Date</label>
                            <input
                                type="date" className="rp-input" required
                                value={formData.required_date}
                                onChange={e => setFormData({ ...formData, required_date: e.target.value })}
                            />
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Urgency Level</label>
                            <select
                                className="rp-select" required
                                value={formData.urgency}
                                onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="rp-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="rp-label">Medical Notes / Condition</label>
                            <textarea
                                className="rp-textarea" rows="3"
                                value={formData.health_condition}
                                onChange={e => setFormData({ ...formData, health_condition: e.target.value })}
                                placeholder="Reason for transfusion, specific requirements..."
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="rp-btn rp-btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Submitting...' : 'Submit Blood Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
