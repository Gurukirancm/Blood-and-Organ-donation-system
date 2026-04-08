import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function DonationHistory({ donor }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [donor]);

    const fetchHistory = async () => {
        try {
            const res = await API.get('/api/donors/history');
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="dp-animate-fade">Loading history...</div>;

    return (
        <div className="dp-animate-fade">
            <div className="dp-header">
                <div>
                    <h1 className="dp-title">Donation History</h1>
                    <p className="dp-subtitle">A record of your life-saving contributions.</p>
                </div>
            </div>

            <div className="dp-card">
                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dp-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
                        <h3>No donation history found</h3>
                        <p>Your journey is just beginning!</p>
                    </div>
                ) : (
                    <table className="dp-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Hospital / Recipient</th>
                                <th>Status</th>
                                <th>Certificate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((h, i) => (
                                <tr key={i}>
                                    <td>{new Date(h.date).toLocaleDateString()}</td>
                                    <td>{h.type}</td>
                                    <td>{h.hospital}</td>
                                    <td>
                                        <span className={`dp-badge ${h.status === 'Completed' ? 'success' : 'info'}`}>
                                            {h.status}
                                        </span>
                                    </td>
                                    <td>
                                        {h.status === 'Completed' && (
                                            <button className="dp-btn dp-btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                Download
                                            </button>
                                        )}
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
