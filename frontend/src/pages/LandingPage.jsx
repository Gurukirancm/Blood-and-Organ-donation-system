import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="landing-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#2d3748' }}>🩸 LifeConnect</h1>
                <p style={{ fontSize: '1.25rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
                    Advanced Smart Blood & Organ Donation Management System.
                    AI-driven matching for life-saving connections.
                </p>
            </div>

            <div className="portal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>

                {/* Donor Portal Card */}
                <Link to="/login/donor" style={{ textDecoration: 'none' }}>
                    <div className="portal-card" style={cardStyle}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💚</div>
                        <h2 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Donor Portal</h2>
                        <p style={{ color: '#718096' }}>Register to donate blood or organs. Track your donation history.</p>
                        <div style={{ marginTop: '1.5rem', color: '#38a169', fontWeight: 'bold' }}>Login as Donor →</div>
                    </div>
                </Link>

                {/* Recipient Portal Card */}
                <Link to="/login/recipient" style={{ textDecoration: 'none' }}>
                    <div className="portal-card" style={cardStyle}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
                        <h2 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Recipient Portal</h2>
                        <p style={{ color: '#718096' }}>Request blood or organs. View real-time availability and matches.</p>
                        <div style={{ marginTop: '1.5rem', color: '#e53e3e', fontWeight: 'bold' }}>Login as Recipient →</div>
                    </div>
                </Link>

                {/* Hospital Portal Card */}
                <Link to="/login/hospital" style={{ textDecoration: 'none' }}>
                    <div className="portal-card" style={cardStyle}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏥</div>
                        <h2 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Hospital Portal</h2>
                        <p style={{ color: '#718096' }}>Manage inventory, view requests, and access AI matching engine.</p>
                        <div style={{ marginTop: '1.5rem', color: '#3182ce', fontWeight: 'bold' }}>Login as Hospital →</div>
                    </div>
                </Link>

                {/* Admin Portal Card */}
                <Link to="/login/admin" style={{ textDecoration: 'none' }}>
                    <div className="portal-card" style={cardStyle}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
                        <h2 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Admin Portal</h2>
                        <p style={{ color: '#718096' }}>System oversight, user management, and global analytics.</p>
                        <div style={{ marginTop: '1.5rem', color: '#805ad5', fontWeight: 'bold' }}>Login as Admin →</div>
                    </div>
                </Link>

            </div>

            <footer style={{ marginTop: '4rem', color: '#718096', fontSize: '0.9rem' }}>
                © 2026 LifeConnect System. Secure & Compliant.
            </footer>
        </div>
    )
}

const cardStyle = {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer'
}
