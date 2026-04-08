import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function RequestManagement() {
    const [requests, setRequests] = useState([]);
    const [donors, setDonors] = useState([]); // Needed for manual assignment
    const [matches, setMatches] = useState([]); // AI Matches
    const [loading, setLoading] = useState(true);
    const [matchingLoading, setMatchingLoading] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null); // For assignment modal
    const [assignDonorId, setAssignDonorId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedReq) {
            fetchMatches(selectedReq.id);
        } else {
            setMatches([]);
        }
    }, [selectedReq]);

    const fetchData = async () => {
        try {
            const [reqRes, donorRes] = await Promise.all([
                API.get('/api/admin/requests'),
                API.get('/api/admin/donors')
            ]);
            setRequests(reqRes.data);
            setDonors(donorRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMatches = async (requestId) => {
        setMatchingLoading(true);
        try {
            const res = await API.get(`/api/admin/requests/${requestId}/ai-matches`);
            setMatches(res.data);
        } catch (err) {
            console.error("Failed to fetch AI matches", err);
            setMatches([]);
        } finally {
            setMatchingLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await API.patch(`/api/admin/requests/${id}/status?status=${newStatus}`);
            fetchData();
        } catch (err) {
            alert("Status update failed");
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedReq || !assignDonorId) return;

        try {
            await API.patch(`/api/admin/requests/${selectedReq.id}/assign?donor_id=${assignDonorId}`);
            setSelectedReq(null);
            setAssignDonorId('');
            fetchData();
            alert("Donor assigned successfully!");
        } catch (err) {
            alert("Assignment failed: " + (err.response?.data?.detail || err.message));
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="ap-module">
            <div className="ap-module-header">
                <h2>📝 Request Management</h2>
            </div>

            <div className="ap-card ap-table-container">
                <table className="ap-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Type</th>
                            <th>Urgency</th>
                            <th>Status</th>
                            <th>Matched Donor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(r => (
                            <tr key={r.id}>
                                <td>
                                    <div style={{ fontWeight: 'bold' }}>{r.patient_name}</div>
                                    <div className="text-muted text-sm">{r.hospital_name || r.hospital_location}</div>
                                </td>
                                <td>
                                    {r.request_type === 'blood' ? `🩸 ${r.blood_group}` : `🫀 ${r.organ}`}
                                </td>
                                <td>
                                    <span className={`ap-badge ${r.urgency === 'urgent' ? 'danger' : 'warning'}`}>
                                        {r.urgency}
                                    </span>
                                </td>
                                <td>
                                    <span className={`ap-badge ${r.status === 'completed' ? 'success' : r.status === 'matched' ? 'blue' : 'warning'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>{r.matched_donor_name || '-'}</td>
                                <td>
                                    <div className="ap-actions">
                                        {r.status === 'pending' && (
                                            <>
                                                <button onClick={() => setSelectedReq(r)} className="ap-action-btn enable">Assign</button>
                                                <button onClick={() => handleStatusUpdate(r.id, 'rejected')} className="ap-action-btn delete">Reject</button>
                                            </>
                                        )}
                                        {r.status === 'matched' && (
                                            <button onClick={() => handleStatusUpdate(r.id, 'completed')} className="ap-action-btn success">Complete</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No requests found</td></tr>}
                    </tbody>
                </table>
            </div>

            {selectedReq && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Assign Donor to {selectedReq.patient_name}</h3>
                        <p className="text-muted">Required: {selectedReq.request_type === 'blood' ? selectedReq.blood_group : selectedReq.organ}</p>

                        <form onSubmit={handleAssign}>
                            <div className="input-group">
                                <label>Select Donor (AI Recommended First)</label>
                                <select
                                    className="custom-select"
                                    value={assignDonorId}
                                    onChange={e => setAssignDonorId(e.target.value)}
                                    required
                                    disabled={matchingLoading}
                                >
                                    {matchingLoading ? (
                                        <option>Finding matches...</option>
                                    ) : (
                                        <>
                                            <option value="">{matches.length > 0 ? '-- Choose a Recommended Match --' : '-- No AI Matches Found --'}</option>

                                            {/* AI Matches Section */}
                                            {matches.length > 0 && (
                                                <optgroup label="AI Recommended Matches">
                                                    {matches.map(m => (
                                                        <option key={m.donor_id} value={m.donor_id}>
                                                            {m.donor_name} - Score: {Math.round(m.match_score * 100)}% ({m.recommendation})
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}

                                            {/* All Verified Donors Section as Fallback */}
                                            <optgroup label="All Compatible Verified Donors">
                                                {donors
                                                    .filter(d => d.is_verified)
                                                    .filter(d => {
                                                        const isAlreadyMatched = matches.some(m => m.donor_id === d.id);
                                                        if (isAlreadyMatched) return false;

                                                        if (selectedReq.request_type === 'blood') return d.blood_group === selectedReq.blood_group;
                                                        if (selectedReq.request_type === 'organ') return d.organs?.includes(selectedReq.organ);
                                                        return true;
                                                    })
                                                    .map(d => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.first_name} {d.last_name} ({d.blood_group})
                                                        </option>
                                                    ))
                                                }
                                            </optgroup>

                                            {matches.length === 0 && donors.filter(d => d.is_verified && (selectedReq.request_type === 'blood' ? d.blood_group === selectedReq.blood_group : d.organs?.includes(selectedReq.organ))).length === 0 && (
                                                <option disabled>No matches found in the system</option>
                                            )}
                                        </>
                                    )}
                                </select>
                                {matches.length === 0 && !matchingLoading && (
                                    <p className="text-danger text-xs mt-1">No AI matches found. Please check other donors manually.</p>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setSelectedReq(null)} className="secondary">Cancel</button>
                                <button type="submit" className="primary" disabled={matchingLoading}>Confirm Assignment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
