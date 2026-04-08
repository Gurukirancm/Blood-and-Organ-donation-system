import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function HospitalManagement() {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHospital, setNewHospital] = useState({
        hospital_name: '',
        city: '',
        contact_number: '',
        email: '',
        password: '',
        address: ''
    });

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const res = await API.get('/api/admin/hospitals');
            setHospitals(res.data);
        } catch (err) {
            console.error("Failed to fetch hospitals", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHospital = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/admin/hospitals', newHospital);
            setShowAddModal(false);
            fetchHospitals();
            setNewHospital({ hospital_name: '', city: '', contact_number: '', email: '', password: '', address: '' });
            alert("Hospital added successfully!");
        } catch (err) {
            alert("Failed to add hospital: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hospital? This action cannot be undone.")) return;
        try {
            await API.delete(`/api/admin/hospitals/${id}`);
            fetchHospitals();
        } catch (err) {
            alert("Failed to delete hospital");
        }
    };

    const handleApprove = async (id, currentStatus) => {
        try {
            await API.patch(`/api/admin/hospitals/${id}/approve?is_active=${!currentStatus}`);
            fetchHospitals();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="ap-module">
            <div className="ap-module-header">
                <h2>🏥 Hospital Management</h2>
                <button className="primary" onClick={() => setShowAddModal(true)}>+ Add Hospital</button>
            </div>

            <div className="ap-card ap-table-container">
                <table className="ap-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>City</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospitals.map(h => (
                            <tr key={h.id}>
                                <td>{h.hospital_name}</td>
                                <td>{h.city}</td>
                                <td>{h.email}</td>
                                <td>{h.contact_number}</td>
                                <td>
                                    <span className={`ap-badge ${h.is_active ? 'success' : 'danger'}`}>
                                        {h.is_active ? 'Active' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <div className="ap-actions">
                                        <button
                                            onClick={() => handleApprove(h.id, h.is_active)}
                                            className={`ap-action-btn ${h.is_active ? 'disable' : 'enable'}`}
                                        >
                                            {h.is_active ? 'Disable' : 'Approve'}
                                        </button>
                                        <button onClick={() => handleDelete(h.id)} className="ap-action-btn delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {hospitals.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hospitals found</td></tr>}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Hospital</h3>
                        <form onSubmit={handleAddHospital}>
                            <div className="input-group">
                                <label>Hospital Name</label>
                                <input required value={newHospital.hospital_name} onChange={e => setNewHospital({ ...newHospital, hospital_name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>City</label>
                                <input required value={newHospital.city} onChange={e => setNewHospital({ ...newHospital, city: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Email (Login)</label>
                                <input type="email" required value={newHospital.email} onChange={e => setNewHospital({ ...newHospital, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input type="password" required value={newHospital.password} onChange={e => setNewHospital({ ...newHospital, password: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Contact Number</label>
                                <input required value={newHospital.contact_number} onChange={e => setNewHospital({ ...newHospital, contact_number: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Address</label>
                                <input value={newHospital.address} onChange={e => setNewHospital({ ...newHospital, address: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddModal(false)} className="secondary">Cancel</button>
                                <button type="submit" className="primary">Create Hospital</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
