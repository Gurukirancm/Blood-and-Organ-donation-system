import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function DonorProfileSetup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        address: '',
        blood_group: '',
        donate_blood: true,
        organs: []
    })

    const organOptions = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes", "Skin"]

    useEffect(() => {
        // Fetch user email to pre-fill
        const fetchUser = async () => {
            try {
                const res = await API.get('/api/auth/me')
                setFormData(prev => ({ ...prev, email: res.data.email }))

                // Check if profile exists
                try {
                    const profileRes = await API.get('/api/donors/me')
                    if (profileRes.data) {
                        setFormData(profileRes.data)
                    }
                } catch (e) {
                    // No profile yet
                }
            } catch (err) {
                navigate('/login')
            }
        }
        fetchUser()
    }, [navigate])

    const handleOrganChange = (organ) => {
        setFormData(prev => {
            const newOrgans = prev.organs.includes(organ)
                ? prev.organs.filter(o => o !== organ)
                : [...prev.organs, organ]
            return { ...prev, organs: newOrgans }
        })
    }

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMsg('')

        try {
            // Clean data before sending
            const payload = {
                ...formData,
                mobile: formData.mobile.replace(/\s+/g, '').replace(/-/g, '')
            }

            // Check if updating or creating
            try {
                await API.get('/api/donors/me')
                await API.put('/api/donors/me', payload)
            } catch (e) {
                await API.post('/api/donors/', payload)
            }

            setMsg('✓ Profile verified and saved!')
            setTimeout(() => navigate('/donor/dashboard'), 1500)
        } catch (err) {
            console.error(err)
            let errorDetail = 'Failed to save profile.';
            if (err.response?.data?.detail) {
                errorDetail = typeof err.response.data.detail === 'string'
                    ? err.response.data.detail
                    : JSON.stringify(err.response.data.detail);
            }
            setMsg('✗ ' + errorDetail);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page" style={{ flexDirection: 'column', gap: '2rem' }}>
            <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                background: 'linear-gradient(to right, #ffffff, #00d2ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(0, 210, 255, 0.3))',
                animation: 'fadeInUp 1s ease-out',
                margin: 0
            }}>
                Connect Life
            </h1>
            <div className="login-card" style={{ maxWidth: '700px' }}>
                <div className="login-header">
                    <div className="login-icon">📝</div>
                    <h2>Complete Your Profile</h2>
                    <p>Help us match you with those in need</p>
                </div>

                {msg && <div className={`message ${msg.includes('✓') ? 'success' : 'error'}`}>{msg}</div>}

                <form onSubmit={submit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>First Name</label>
                            <input
                                value={formData.first_name}
                                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                required placeholder="John"
                            />
                        </div>
                        <div className="input-group">
                            <label>Last Name</label>
                            <input
                                value={formData.last_name}
                                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                required placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Mobile Number</label>
                            <input
                                value={formData.mobile}
                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                required placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email" value={formData.email}
                                readOnly
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Address</label>
                        <input
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            required placeholder="Full street address, City, Zip"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Blood Group</label>
                            <select
                                value={formData.blood_group}
                                onChange={e => setFormData({ ...formData, blood_group: e.target.value })}
                                className="custom-select"
                            >
                                <option value="">Select Group</option>
                                <option value="A+">A+</option><option value="A-">A−</option>
                                <option value="B+">B+</option><option value="B-">B−</option>
                                <option value="AB+">AB+</option><option value="AB-">AB−</option>
                                <option value="O+">O+</option><option value="O-">O−</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Donate Blood?</label>
                            <select
                                value={formData.donate_blood}
                                onChange={e => setFormData({ ...formData, donate_blood: e.target.value === 'true' })}
                                className="custom-select"
                            >
                                <option value="true">Yes, I want to donate</option>
                                <option value="false">No, not at this time</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Organs to Donate (Select all that apply)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {organOptions.map(organ => (
                                <button
                                    key={organ}
                                    type="button"
                                    onClick={() => handleOrganChange(organ)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--glass-border)',
                                        background: formData.organs.includes(organ) ? 'var(--accent-color)' : 'transparent',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {organ} {formData.organs.includes(organ) ? '✓' : '+'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="primary" disabled={loading}>
                        {loading ? 'Saving Profile...' : 'Save & Continue'}
                    </button>
                </form>
            </div>
        </div>
    )
}
