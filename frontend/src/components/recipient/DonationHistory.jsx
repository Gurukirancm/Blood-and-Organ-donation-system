import React from 'react';

export default function DonationHistory({ requests }) {
    // Filter for completed/fulfilled requests
    const history = requests.filter(r => r.status === 'fulfilled' || r.status === 'completed');

    return (
        <div className="rp-animate-fade">
            <div className="rp-header">
                <div>
                    <h1 className="rp-title">Request History</h1>
                    <p className="rp-subtitle">Archive of your past medical requests.</p>
                </div>
            </div>

            <div className="rp-card">
                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--rp-muted)' }}>
                        <p>No completed requests in history.</p>
                    </div>
                ) : (
                    <table className="rp-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Patient</th>
                                <th>Hospital</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((h, i) => (
                                <tr key={i}>
                                    <td>{h.required_date || 'N/A'}</td>
                                    <td>{h.organ} ({h.blood_group})</td>
                                    <td>{h.patient_name}</td>
                                    <td>{h.hospital_location}</td>
                                    <td>
                                        <span className="rp-badge success">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
