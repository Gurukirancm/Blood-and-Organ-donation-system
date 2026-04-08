import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('donor')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMsg('✗ Passwords do not match')
            return
        }
        setLoading(true)
        setMsg('')
        try {
            await API.post('/api/auth/register', { email, password, role })
            setMsg('✓ Account created! Redirecting to login...')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            console.error('Registration error:', err.response?.data)
            let errMsg = 'Registration failed'

            if (err.response?.data?.message) {
                errMsg = err.response.data.message
            } else if (err.response?.data?.detail) {
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
                    <div className="login-icon">🤝</div>
                    <h2>Join the Mission</h2>
                    <p>Create your Connect Life account</p>
                </div>

                {msg && (
                    <div className={`message ${msg.includes('✓') ? 'success' : 'error'}`}>
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
                            placeholder="you@example.com"
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
                            placeholder="Create a strong password"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <label>I am a...</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            disabled={loading}
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                        >
                            <option value="donor" style={{ color: 'black' }}>Donor (I want to donate)</option>
                            <option value="recipient" style={{ color: 'black' }}>Recipient (I need a donation)</option>
                            <option value="hospital" style={{ color: 'black' }}>Hospital (Medical Institute)</option>
                        </select>
                    </div>

                    <button type="submit" className="primary" disabled={loading}>
                        {loading ? 'Creating account...' : '✓ Register Now'}
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/">← Back to Home</Link>
                    <Link to="/login">Already have an account? Sign In</Link>
                </div>
            </div>
        </div>
    )
}
