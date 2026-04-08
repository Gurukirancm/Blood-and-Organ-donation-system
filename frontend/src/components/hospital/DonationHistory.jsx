import React from 'react';
import './HospitalPortal.css';

export default function DonationHistory({ requests }) {
    const history = requests.filter(r => r.status === 'fulfilled' || r.status === 'completed');

    return (
        <div className="hp-animate-fade">
            <div className="hp-header">
                <div>
                    <h1 className="hp-title">Donation History</h1>
                    <p className="hp-subtitle">Archive of successful transplants and procedures</p>
                </div>
            </div>

            <div className="hp-table-container">
                <table className="hp-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Patient</th>
                            <th>Organ / Blood</th>
                            <th>Donor ID</th>
                            <th>Date Completed</th>
                            <th>Outcome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? history.map((req, idx) => (
                            <tr key={idx}>
                                <td>#{req.id ? req.id.slice(-6) : '...'}</td>
                                <td>{req.patient_name}</td>
                                <td>{req.organ} ({req.blood_group})</td>
                                <td>{req.fulfilled_by ? req.fulfilled_by.slice(-6) : 'Unknown'}</td>
                                <td>{new Date().toLocaleDateString()}</td> {/* Mock date if not in object */}
                                <td>
                                    <span className="hp-badge hp-badge-success">Successful</span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--hp-text-muted)' }}>
                                    No completed donations found in history.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
