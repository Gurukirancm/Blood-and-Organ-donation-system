import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function RecipientLogin() {
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
            setTimeout(() => navigate('/recipient/dashboard'), 1000)
        } catch (err) {
            setMsg('✗ Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page recipient-theme">
            <div className="glass-card login-card">
                <div className="login-header">
                    <div className="login-icon">❤️</div>
                    <h2>Recipient Login</h2>
                    <p>Request blood/organs and track matches</p>
                </div>

                {msg && <div className={`message ${msg.includes('✓') ? 'success' : 'error'}`}>{msg}</div>}

                <form onSubmit={submit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="recipient@example.com"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/">← Back to Home</Link>
                    <Link to="/register">Register New Account</Link>
                </div>
            </div>
        </div>
    )
}
