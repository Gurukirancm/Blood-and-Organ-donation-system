import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
      const res = await API.post('/api/auth/token', { email, password })
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
      console.error('Login error:', err.response?.data)
      let errMsg = 'Login failed'

      if (err.response?.data?.detail) {
        // Handle both string and array detail formats
        if (Array.isArray(err.response.data.detail)) {
          errMsg = err.response.data.detail.map(e => e.msg || JSON.stringify(e)).join(', ')
        } else if (typeof err.response.data.detail === 'string') {
          errMsg = err.response.data.detail
        } else {
          errMsg = JSON.stringify(err.response.data.detail)
        }
      } else if (err.message) {
        errMsg = err.message
      }

      setMsg(`✗ ${errMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🩸</div>
          <h2>Smart Blood & Organ Donation</h2>
          <p>Secure Login</p>
        </div>

        {msg && (
          <div className={`message ${msg.includes('✓') ? 'success' : msg.includes('✗') ? 'error' : 'loading'}`}>
            {loading && <span className="spinner" style={{ marginRight: '0.5rem' }}></span>}
            {msg}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="primary" disabled={loading}>
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

        <div className="login-footer">
          <Link to="/">← Back to Home</Link>
          <Link to="/register">New to platform? Register here</Link>
        </div>
      </div>
    </div>
  )
}
