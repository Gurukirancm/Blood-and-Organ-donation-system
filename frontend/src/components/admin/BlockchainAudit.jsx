import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function BlockchainAudit() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAudit();
    }, []);

    const fetchAudit = async () => {
        try {
            const res = await API.get('/api/admin/audit-trail');
            setLogs(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="ap-module">
            <div className="ap-module-header">
                <h2>📜 Blockchain Transaction Ledger</h2>
            </div>
            <div className="ap-card">
                {logs.length === 0 ? <p>No blockchain records found.</p> : (
                    <div className="ap-audit-list">
                        {logs.map((block, i) => (
                            <div key={i} className="ap-audit-item">
                                <div className="ap-audit-header">
                                    <span className="ap-block-id">Block #{block.index}</span>
                                    <span className="ap-timestamp">{new Date(block.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="ap-audit-data">
                                    <pre>{JSON.stringify(block.data, null, 2)}</pre>
                                </div>
                                <div className="ap-audit-hash">
                                    Hash: {block.hash}
                                </div>
                                <div className="ap-audit-prev-hash">
                                    Prev Hash: {block.previous_hash}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
