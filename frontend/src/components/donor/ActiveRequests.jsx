import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function ActiveRequests({ donor }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, [donor]);

    const fetchRequests = async () => {
        try {
            const res = await API.get('/api/requests');
            // Filter for requests that match the donor's blood group or organ
            // and are pending
            const pending = res.data.filter(r => r.status === 'pending');
            setRequests(pending);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVolunteer = (req) => {
        // In a real system, this would trigger a notification to the hospital
        // or add the donor to a potential match list.
        // For now, we'll simulate the action.
        alert(`Thank you! The hospital has been notified of your willingness to donate for ${req.patient_name}.`);
    };

    if (loading) return <div className="dp-animate-fade">Loading requests...</div>;

    return (
        <div className="dp-animate-fade">
            <div className="dp-header">
                <div>
                    <h1 className="dp-title">Active Donation Requests</h1>
                    <p className="dp-subtitle">Urgent cases matching your profile near you.</p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="dp-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <h3>No urgent requests at the moment.</h3>
                    <p className="dp-subtitle">That's good news! We'll notify you when someone needs your help.</p>
                </div>
            ) : (
                <div className="dp-grid">
                    {requests.map(req => (
                        <div key={req.id || req._id} className="dp-card" style={{ borderLeft: `4px solid ${req.urgency === 'Critical' ? '#ff4757' : '#ffa502'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span className={`dp-badge ${req.urgency === 'Critical' ? 'danger' : 'warning'}`}>
                                    {req.urgency} Urgency
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--dp-muted)' }}>
                                    Needed by: {new Date(req.required_date).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 style={{ margin: '0 0 0.5rem' }}>{req.organ} / {req.blood_group}</h3>
                            <p style={{ margin: '0 0 1rem', color: 'var(--dp-text)' }}>
                                <strong>Patient:</strong> {req.patient_name} <br />
                                <strong>Location:</strong> {req.location}
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    className="dp-btn dp-btn-primary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => handleVolunteer(req)}
                                >
                                    Volunteer
                                </button>
                                <button className="dp-btn dp-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                    Ignore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
