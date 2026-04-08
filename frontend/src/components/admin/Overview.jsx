import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function Overview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Reusing inventory endpoint or creating a dedicated stats endpoint
            // Using existing inventory endpoint from admin_routes.py which returns broad stats
            const res = await API.get('/api/admin/inventory');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <div className="ap-grid">
                <StatBox label="Total Hospitals" value={stats?.total_hospitals || 0} color="#ed8936" icon="🏥" />
                <StatBox label="Registered Donors" value={stats?.total_donors || 0} color="#48bb78" icon="🩸" />
                <StatBox label="Active Requests" value="-" color="#4299e1" icon="📝" /> {/* Placeholder as inventory endpoint lacks this specific count currently */}
                <StatBox label="Organ Types" value={Object.keys(stats?.organs || {}).length} color="#805ad5" icon="🫀" />
            </div>

            <div className="ap-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
                <div className="ap-card">
                    <h3>Blood Supply Distribution</h3>
                    <div className="chart-placeholder">
                        {/* Simple visualization */}
                        {Object.entries(stats?.blood || {}).map(([bg, count]) => (
                            <div key={bg} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                <span>{bg}</span>
                                <span style={{ fontWeight: 'bold' }}>{count} units</span>
                            </div>
                        ))}
                        {Object.keys(stats?.blood || {}).length === 0 && <p>No data</p>}
                    </div>
                </div>
                <div className="ap-card">
                    <h3>Organ Availability</h3>
                    <div className="chart-placeholder">
                        {Object.entries(stats?.organs || {}).map(([organ, count]) => (
                            <div key={organ} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                <span>{organ}</span>
                                <span style={{ fontWeight: 'bold' }}>{count} available</span>
                            </div>
                        ))}
                        {Object.keys(stats?.organs || {}).length === 0 && <p>No data</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatBox = ({ label, value, color, icon }) => (
    <div className="ap-stat-box" style={{ borderTopColor: color }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
                <div className="ap-stat-label">{label}</div>
                <div className="ap-stat-value">{value}</div>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.2 }}>{icon}</div>
        </div>
    </div>
);
