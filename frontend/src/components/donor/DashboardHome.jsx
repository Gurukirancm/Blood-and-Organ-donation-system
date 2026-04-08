import React from 'react';
import './DonorPortal.css';

export default function DashboardHome({ donor, stats, onQuickAction }) {
    if (!donor) return <div className="dp-animate-fade">Loading...</div>;

    return (
        <div className="dp-animate-fade">
            <div className="dp-header">
                <div>
                    <h1 className="dp-title">Welcome, {donor.first_name}! 👋</h1>
                    <p className="dp-subtitle">Thank you for being a hero. Here's your impact overview.</p>
                </div>
                <div className={`dp-badge ${donor.availability ? 'success' : 'warning'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {donor.availability ? '✅ Available to Donate' : '⏸️ Temporarily Unavailable'}
                </div>
            </div>

            <div className="dp-grid">
                <div className="dp-stat-card">
                    <div className="dp-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757' }}>🩸</div>
                    <div className="dp-stat-info">
                        <h3>{stats?.totalDonations || 0}</h3>
                        <p>Total Donations</p>
                    </div>
                </div>
                <div className="dp-stat-card">
                    <div className="dp-stat-icon" style={{ background: 'rgba(46, 213, 115, 0.1)', color: '#2ed573' }}>❤️</div>
                    <div className="dp-stat-info">
                        <h3>{stats?.livesSaved || 0}</h3>
                        <p>Lives Impacted</p>
                    </div>
                </div>
                <div className="dp-stat-card">
                    <div className="dp-stat-icon" style={{ background: 'rgba(30, 144, 255, 0.1)', color: '#1e90ff' }}>🚑</div>
                    <div className="dp-stat-info">
                        <h3>{stats?.pendingRequests || 0}</h3>
                        <p>Urgent Matches</p>
                    </div>
                </div>
                <div className="dp-stat-card">
                    <div className="dp-stat-icon" style={{ background: 'rgba(255, 165, 2, 0.1)', color: '#ffa502' }}>⏳</div>
                    <div className="dp-stat-info">
                        <h3>{donor.last_donation ? donor.last_donation : 'None'}</h3>
                        <p>Last Donation</p>
                    </div>
                </div>
            </div>

            <h2 className="dp-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Start Saving Lives</h2>
            <div className="dp-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="dp-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onQuickAction('donate-blood')}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩸</div>
                    <h3>Donate Blood</h3>
                    <p className="dp-subtitle">Schedule a blood donation</p>
                </div>
                <div className="dp-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onQuickAction('donate-organ')}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫀</div>
                    <h3>Donate Organs</h3>
                    <p className="dp-subtitle">Register for organ donation</p>
                </div>
                <div className="dp-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onQuickAction('active-requests')}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3>Find Matches</h3>
                    <p className="dp-subtitle">View urgent requests near you</p>
                </div>
            </div>
        </div>
    );
}
