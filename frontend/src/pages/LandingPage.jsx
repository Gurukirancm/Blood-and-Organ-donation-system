import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="landing-page">
            <header>
                <h1>Connect Life</h1>
                <nav>
                    <Link to="/login/donor">Donor</Link>
                    <Link to="/login/recipient">Recipient</Link>
                    <Link to="/login/hospital">Hospital</Link>
                    <Link to="/login/admin">Admin</Link>
                </nav>
            </header>

            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Connect Life</h1>
                    <p className="hero-subtitle">
                        AI-Powered Smart Blood and Organ Donation Management System
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="cta-button">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>

            <div className="section-title">
                <h2>Platform Highlights</h2>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🧬</div>
                    <h3>AI-Based Donor Matching</h3>
                    <p>Intelligent compatibility scoring for precise life-saving connections.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3>Blockchain Security</h3>
                    <p>Immutable medical records ensuring data integrity and trust.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">☁️</div>
                    <h3>Cloud-Based Access</h3>
                    <p>Real-time system availability for hospitals and donors anywhere.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🚑</div>
                    <h3>Emergency Priority</h3>
                    <p>Smart queuing system to handle critical requests instantly.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🏥</div>
                    <h3>Hospital Coordination</h3>
                    <p>Seamless inventory and request management for medical facilities.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔔</div>
                    <h3>Smart Notifications</h3>
                    <p>Automated multi-channel alerts for matches and urgent needs.</p>
                </div>
            </div>

            <div className="section-title">
                <h2>Access Portals</h2>
            </div>

            <div className="portal-grid">
                {/* Donor Portal Card */}
                <Link to="/login/donor" className="portal-link">
                    <div className="portal-card">
                        <div className="portal-icon">💚</div>
                        <h2>Donor Portal</h2>
                        <p>Register to donate blood or organs. Track your donation history.</p>
                        <div className="portal-action">Login as Donor →</div>
                    </div>
                </Link>

                {/* Recipient Portal Card */}
                <Link to="/login/recipient" className="portal-link">
                    <div className="portal-card">
                        <div className="portal-icon">❤️</div>
                        <h2>Recipient Portal</h2>
                        <p>Request blood or organs. View real-time availability and matches.</p>
                        <div className="portal-action">Login as Recipient →</div>
                    </div>
                </Link>

                {/* Hospital Portal Card */}
                <Link to="/login/hospital" className="portal-link">
                    <div className="portal-card">
                        <div className="portal-icon">🏥</div>
                        <h2>Hospital Portal</h2>
                        <p>Manage inventory, view requests, and access AI matching engine.</p>
                        <div className="portal-action">Login as Hospital →</div>
                    </div>
                </Link>

                {/* Admin Portal Card */}
                <Link to="/login/admin" className="portal-link">
                    <div className="portal-card">
                        <div className="portal-icon">🔐</div>
                        <h2>Admin Portal</h2>
                        <p>System oversight, user management, and global analytics.</p>
                        <div className="portal-action">Login as Admin →</div>
                    </div>
                </Link>
            </div>

            <footer>
                © 2026 Connect Life System. AI-Powered & Blockchain Secured.
            </footer>
        </div >
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
