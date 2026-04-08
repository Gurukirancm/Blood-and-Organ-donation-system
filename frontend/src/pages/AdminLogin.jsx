import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function AdminLogin() {
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
            const res = await API.post('/api/auth/token', { email, password })
            const token = res.data.access_token
            localStorage.setItem('token', token)
            API.setToken(token)

            setMsg('✓ Login successful! Redirecting...')
            setTimeout(() => navigate('/admin/dashboard'), 1000)
        } catch (err) {
            console.error('Admin Login error:', err)
            let errMsg = 'Login failed. Please check your credentials.'

            if (err.response?.data?.detail) {
                errMsg = typeof err.response.data.detail === 'string'
                    ? err.response.data.detail
                    : JSON.stringify(err.response.data.detail)
            } else if (err.message) {
                errMsg = err.message
            }
            setMsg(`✗ ${errMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page admin-theme">
            <div className="glass-card login-card">
                <div className="login-header">
                    <div className="login-icon">🔐</div>
                    <h2>Admin Login</h2>
                    <p>System oversight and analytics</p>
                </div>

                {msg && <div className={`message ${msg.includes('✓') ? 'success' : 'error'}`}>{msg}</div>}

                <form onSubmit={submit}>
                    <div className="input-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@connectlife.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="primary full-width" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/">← Back to Home</Link>
                </div>
            </div>
        </div>
    )
}
