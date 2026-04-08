import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../components/admin/AdminPortal.css'; // Ensure this CSS is comprehensive

// Components
import Sidebar from '../components/admin/Sidebar';
import Overview from '../components/admin/Overview';
import HospitalManagement from '../components/admin/HospitalManagement';
import DonorManagement from '../components/admin/DonorManagement';
import RequestManagement from '../components/admin/RequestManagement';
import BlockchainAudit from '../components/admin/BlockchainAudit';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/api/auth/me');
        if (res.data.role !== 'admin') {
          navigate('/login');
          return;
        }
        setUser(res.data);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    API.setToken(null);
    navigate('/login');
  };

  if (loading) return <div className="loading-screen">Loading Control Panel...</div>;

  return (
    <div className="ap-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="ap-content">
        <header className="ap-header">
          <div className="ap-breadcrumbs">
            <span>Admin</span> / <span className="current">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          </div>
          <div className="ap-user-profile">
            <span>👤 {user?.email}</span>
          </div>
        </header>

        <div className="ap-workspace">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'hospitals' && <HospitalManagement />}
          {activeTab === 'donors' && <DonorManagement />}
          {activeTab === 'requests' && <RequestManagement />}
          {activeTab === 'audit' && <BlockchainAudit />}
        </div>
      </main>
    </div>
  );
}
