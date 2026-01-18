import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import DonorDashboard from './pages/DonorDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import AdminDashboard from './pages/AdminDashboard'
import UnifiedDashboard from './pages/UnifiedDashboard'
import DonorPortal from './pages/DonorPortal'
import RecipientPortal from './pages/RecipientPortal'
import HospitalPortal from './pages/HospitalPortal'
import LandingPage from './pages/LandingPage'
import API from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      API.setToken(token)
      fetchUser()
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await API.get('/api/auth/me')
      setUser(res.data)
    } catch (err) {
      localStorage.removeItem('token')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    API.setToken(null)
  }

  return (
    <div className="app">
      {!isLoginPage && (
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>🩸 Smart Blood & Organ Donation</h1>
            {user && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'white' }}>
                <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}>{user.role}</span>
              </div>
            )}
          </div>
          {user && (
            <nav>
              <Link to="/dashboard">
                📊 Unified Dashboard
              </Link>
              <Link to="/donor-portal">
                💚 Donor Portal
              </Link>
              <Link to="/recipient-portal">
                ❤️ Recipient Portal
              </Link>
              <Link to="/hospital-portal">
                🏥 Hospital Portal
              </Link>
              <button className="secondary" onClick={() => { handleLogout(); window.location.href = '/login' }} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                🚪 Logout
              </button>
            </nav>
          )}
        </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={() => fetchUser()} />} />
          <Route path="/login/:role" element={<Login onLoginSuccess={() => fetchUser()} />} />

          {/* Secured Role Routes */}
          <Route path="/donor/dashboard" element={user && user.role === 'donor' ? <DonorDashboard /> : <Login onLoginSuccess={() => fetchUser()} />} />
          <Route path="/hospital/dashboard" element={user && user.role === 'hospital' ? <HospitalDashboard /> : <Login onLoginSuccess={() => fetchUser()} />} />
          <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Login onLoginSuccess={() => fetchUser()} />} />
          <Route path="/recipient/dashboard" element={user && user.role === 'recipient' ? <RecipientPortal /> : <Login onLoginSuccess={() => fetchUser()} />} />

          <Route path="/dashboard" element={<UnifiedDashboard />} /> {/* Keep for dev/fallback or remove */}
        </Routes>
      </main>
    </div>
  )
}
