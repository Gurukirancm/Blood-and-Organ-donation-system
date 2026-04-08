import React from 'react';
import './HospitalPortal.css';

export default function BlockchainLogs({ requests }) {
    // Simulate logs based on requests
    // For each fulfilled request, create a log entry. 
    // Plus some random mock entries for "simulation".

    const fulfilled = requests.filter(r => r.status === 'fulfilled');
    const logs = fulfilled.map((r, i) => ({
        id: `TXN-${r.id ? r.id.slice(-8) : Math.random().toString(36).substr(2, 9)}`,
        requestId: r.id || `REQ-${i}`,
        donorId: r.fulfilled_by || `DNR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        time: new Date().toISOString(),
        status: 'Confirmed',
        block: 1024 + i,
        hash: `0x${Math.random().toString(16).substr(2, 40)}`
    }));

    // Add dummy logs if empty
    if (logs.length === 0) {
        logs.push({
            id: 'TXN-INIT-GENESIS',
            requestId: 'REQ-GENESIS',
            donorId: 'SYSTEM',
            time: new Date(Date.now() - 10000000).toISOString(),
            status: 'Verified',
            block: 0,
            hash: '0x0000000000000000000000000000000000000000'
        });
    }

    return (
        <div className="hp-animate-fade">
            <div className="hp-header">
                <div>
                    <h1 className="hp-title">Blockchain Audit Trail</h1>
                    <p className="hp-subtitle">Immutable ledger of all donation activities</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--hp-success)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-success)' }}></span>
                    Network Synced
                </div>
            </div>

            <div className="hp-card" style={{ background: '#1e293b', color: '#e2e8f0', border: 'none' }}>
                <code style={{ display: 'block', padding: '1rem', color: '#6366f1', fontSize: '0.9rem' }}>
            // Connected to Private Ethereum Network (Simulated) <br />
            // Latest Block: #{1024 + logs.length}
                </code>
            </div>

            <div className="hp-table-container" style={{ marginTop: '2rem' }}>
                <table className="hp-table">
                    <thead>
                        <tr>
                            <th>Transaction Hash</th>
                            <th>Block</th>
                            <th>Request ID</th>
                            <th>Donor ID</th>
                            <th>Timestamp</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, idx) => (
                            <tr key={idx}>
                                <td style={{ fontFamily: 'monospace', color: 'var(--hp-primary)' }}>
                                    {log.hash.substring(0, 16)}...
                                </td>
                                <td>#{log.block}</td>
                                <td>{log.requestId}</td>
                                <td>{log.donorId}</td>
                                <td>{new Date(log.time).toLocaleString()}</td>
                                <td>
                                    <span className="hp-badge hp-badge-success">{log.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
