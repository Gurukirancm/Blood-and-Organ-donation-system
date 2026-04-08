import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function DonorManagement() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        try {
            const res = await API.get('/api/admin/donors');
            setDonors(res.data);
        } catch (err) {
            console.error("Failed to fetch donors", err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, currentStatus) => {
        try {
            await API.patch(`/api/admin/donors/${id}/verify?is_verified=${!currentStatus}`);
            fetchDonors();
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete donor?")) return;
        try {
            await API.delete(`/api/admin/donors/${id}`);
            fetchDonors();
        } catch (err) {
            alert("Delete failed");
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="ap-module">
            <div className="ap-module-header">
                <h2>🩸 Donor Management</h2>
            </div>

            <div className="ap-card ap-table-container">
                <table className="ap-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Blood Group</th>
                            <th>Organs</th>
                            <th>Contact</th>
                            <th>Verification</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.map(d => (
                            <tr key={d.id}>
                                <td>{d.first_name} {d.last_name}</td>
                                <td><span className="badge-red">{d.blood_group}</span></td>
                                <td>{d.organs?.join(', ') || '-'}</td>
                                <td>{d.mobile}</td>
                                <td>
                                    <span className={`ap-badge ${d.is_verified ? 'success' : 'warning'}`}>
                                        {d.is_verified ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td>
                                    <div className="ap-actions">
                                        <button
                                            onClick={() => handleVerify(d.id, d.is_verified)}
                                            className={`ap-action-btn ${d.is_verified ? 'disable' : 'enable'}`}
                                        >
                                            {d.is_verified ? 'Revoke' : 'Verify'}
                                        </button>
                                        <button onClick={() => handleDelete(d.id)} className="ap-action-btn delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {donors.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No donors found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
