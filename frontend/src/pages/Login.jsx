import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      // 1. Get Token
      const res = await API.post(`/api/auth/token?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      const token = res.data.access_token
      localStorage.setItem('token', token)
      API.setToken(token)

      // 2. Get User Role
      const meRes = await API.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const userRole = meRes.data.role

      // 3. Redirect based on role
      setMsg('✓ Login successful! Redirecting...')
      onLoginSuccess && onLoginSuccess()

      setTimeout(() => {
        if (userRole === 'admin') navigate('/admin/dashboard')
        else if (userRole === 'hospital') navigate('/hospital/dashboard')
        else if (userRole === 'donor') navigate('/donor/dashboard')
        else if (userRole === 'recipient') navigate('/recipient/dashboard')
        else navigate('/')
      }, 1000)

    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Login failed'
      setMsg(`✗ ${errMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: '0' }}>🩸</h1>
          <h2>Smart Blood & Organ Donation</h2>
          <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Secure Login</p>
        </div>

        {msg && (
          <div className={`message ${msg.includes('✓') ? 'success' : msg.includes('✗') ? 'error' : 'loading'}`}>
            {loading && <span className="spinner" style={{ marginRight: '0.5rem' }}></span>}
            {msg}
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            <span>📧 Email Address</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
              disabled={loading}
            />
          </label>

          <label>
            <span>🔐 Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </label>

          <button type="submit" className="primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              '✓ Sign In'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0', fontSize: '0.9rem', color: '#666' }}>
          <p style={{ margin: '0.5rem 0' }}><strong>Test Credentials:</strong></p>
          <p style={{ margin: '0.5rem 0' }}>📧 test@example.com</p>
          <p style={{ margin: '0.5rem 0' }}>🔐 password123</p>
          <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>First-time users? Register with any email.</p>
        </div>
      </div>
    </div>
  )
}
