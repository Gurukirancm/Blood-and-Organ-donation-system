import React, { useState, useEffect } from 'react'
import API from '../api'

export default function DonorDashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Profile Form Data
  const [formData, setFormData] = useState({
    name: '', age: '', blood_group: 'O+', organ: 'Kidney',
    phone: '', location: '', availability: true
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const me = await API.get('/api/auth/me')
      if (me.data.role !== 'donor') window.location.href = '/login'
      setUser(me.data)

      try {
        const profileRes = await API.get('/api/donors/me')
        setProfile(profileRes.data)
        setFormData(profileRes.data)
      } catch (e) {
        // Profile not found - User needs to register
        console.log("No profile found, ready to register")
      }

      await fetchHistory()
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await API.get('/api/donors/history').catch(() => ({ data: [] }))
      setHistory(res.data)
    } catch (e) { console.error(e) }
  }

  const handleRegisterOrUpdate = async (e) => {
    e.preventDefault()
    try {
      let res
      if (profile) {
        res = await API.put('/api/donors/me', formData)
      } else {
        res = await API.post('/api/donors/', formData)
      }
      setProfile(res.data)
      setFormData(res.data)
      setIsEditing(false)
      alert(profile ? 'Profile updated!' : 'Registration successful!')
    } catch (err) {
      alert('Failed to save profile.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    API.setToken(null)
    window.location.href = '/login'
  }

  if (loading) return <div className="loading-spinner">Loading Donor Portal...</div>

  return (
    <div className="donor-portal" style={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ width: '250px', background: '#553c9a', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid #805ad5', paddingBottom: '1rem' }}>🩸 Donor Life</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>👤 My Profile</NavBtn>
          <NavBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')}>📜 Donation History</NavBtn>
          {/* <NavBtn active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>🔔 Notifications</NavBtn> */}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={logout} style={{ width: '100%', padding: '0.75rem', background: '#9b2c2c', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content" style={{ flex: 1, padding: '2rem' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{profile ? `Welcome Back, ${profile.name}` : 'Setup Your Profile'}</h1>
          <div style={{ color: '#718096' }}>{user?.email}</div>
        </header>

        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-header">
              <h3>My Donor Profile</h3>
              {profile && !isEditing && (
                <button className="secondary" onClick={() => setIsEditing(true)}>✎ Edit Profile</button>
              )}
            </div>

            {(!profile || isEditing) ? (
              <form onSubmit={handleRegisterOrUpdate} className="grid-2">
                <label>
                  <span>Full Name</span>
                  <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </label>
                <label>
                  <span>Age</span>
                  <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} required />
                </label>
                <label>
                  <span>Blood Group</span>
                  <select value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })}>
                    <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                  </select>
                </label>
                <label>
                  <span>Organ to Donate</span>
                  <select value={formData.organ} onChange={e => setFormData({ ...formData, organ: e.target.value })}>
                    <option>Kidney</option><option>Heart</option><option>Liver</option>
                    <option>Lungs</option><option>Pancreas</option><option>Eyes</option>
                  </select>
                </label>
                <label>
                  <span>Phone</span>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </label>
                <label>
                  <span>City / Location</span>
                  <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
                  <input type="checkbox" checked={formData.availability} onChange={e => setFormData({ ...formData, availability: e.target.checked })} />
                  <span>I am currently available for donation matching</span>
                </label>
                <div style={{ gridColumn: 'span 2', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="success">{profile ? 'Save Changes' : 'Register Profile'}</button>
                  {isEditing && profile && <button type="button" onClick={() => { setIsEditing(false); setFormData(profile) }} className="warning">Cancel</button>}
                </div>
              </form>
            ) : (
              <div className="profile-view">
                <div className="grid-2" style={{ gap: '2rem' }}>
                  <div><strong>Name:</strong> {profile.name}</div>
                  <div><strong>Age:</strong> {profile.age}</div>
                  <div><strong>Blood Group:</strong> <span className="badge info">{profile.blood_group}</span></div>
                  <div><strong>Organ:</strong> {profile.organ}</div>
                  <div><strong>Location:</strong> {profile.location}</div>
                  <div><strong>Status:</strong>
                    <span className={`badge ${profile.availability ? 'success' : 'danger'}`}>
                      {profile.availability ? 'Active' : 'Unavailble'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h3>My Donation History</h3>
            {history.length === 0 ? (
              <p style={{ color: '#718096', padding: '2rem', textAlign: 'center' }}>No donation history found yet.</p>
            ) : (
              <ul>
                {history.map((h, i) => (
                  <li key={i}>{JSON.stringify(h)}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const NavBtn = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    textAlign: 'left', padding: '0.75rem', background: active ? '#6b46c1' : 'transparent',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem'
  }}>
    {children}
  </button>
)
