import React, { useState } from 'react';
import API from '../../api';

export default function RequestOrgan({ onForceRefresh }) {
    const [formData, setFormData] = useState({
        patient_name: '',
        age: '',
        blood_group: '',
        organ: '',
        hospital_location: '',
        urgency: 'medium',
        required_date: '',
        health_condition: '',
        consent_agreement: false
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Convert_To_Eye', 'Skin'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.consent_agreement) {
            setMsg('✗ You must agree to the consent terms.');
            return;
        }
        setLoading(true);
        setMsg('');
        try {
            await API.post('/api/requests', formData);
            setMsg('✓ Organ request created successfully!');
            // Reset form
            setFormData({
                patient_name: '', age: '', blood_group: '', organ: '',
                hospital_location: '', urgency: 'medium', required_date: '',
                health_condition: '', consent_agreement: false
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
                    <h1 className="rp-title">Request Organ</h1>
                    <p className="rp-subtitle">Register a request for organ transplantation.</p>
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
                            <label className="rp-label">Organ Required</label>
                            <select
                                className="rp-select" required
                                value={formData.organ}
                                onChange={e => setFormData({ ...formData, organ: e.target.value })}
                            >
                                <option value="">Select Organ</option>
                                {organs.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="rp-form-group">
                            <label className="rp-label">Patient Blood Group</label>
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
                            <label className="rp-label">Hospital Details</label>
                            <input
                                type="text" className="rp-input" required placeholder="Name, City, Room #"
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
                                <option value="low">Low - Routine</option>
                                <option value="medium">Medium - Urgent</option>
                                <option value="high">High - Very Urgent</option>
                                <option value="critical">Critical - Life Threatening</option>
                            </select>
                        </div>
                        <div className="rp-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="rp-label">Patient Condition</label>
                            <textarea
                                className="rp-textarea" rows="3"
                                value={formData.health_condition}
                                onChange={e => setFormData({ ...formData, health_condition: e.target.value })}
                                placeholder="Diagnosis details..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="rp-form-group" style={{ background: '#e3f2fd', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem' }}>
                        <label className="rp-label" style={{ color: '#1565c0' }}>Consent Agreement</label>
                        <p style={{ fontSize: '0.9rem', color: '#1e88e5' }}>
                            I certify that the information provided is accurate and I have the authority to make this request on behalf of the patient. I understand that organ allocation is subject to availability and medical matching protocols.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="consent"
                                checked={formData.consent_agreement}
                                onChange={e => setFormData({ ...formData, consent_agreement: e.target.checked })}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <label htmlFor="consent" className="rp-label" style={{ marginBottom: 0 }}>
                                I agree to the terms and conditions.
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="rp-btn rp-btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Submitting...' : 'Submit Organ Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
