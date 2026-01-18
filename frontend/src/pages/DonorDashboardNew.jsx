import React, { useState, useEffect } from 'react'
import API from '../api'

export default function DonorDashboard(){
  const [donors, setDonors] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', age: '', blood_group: 'O+', organ: 'Kidney', 
    phone: '', location: '', availability: true
  })

  useEffect(() => {
    fetchUser()
    fetchDonors()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await API.get('/api/auth/me')
      if(res.data.role !== 'donor') window.location.href = '/donor'
      setUser(res.data)
    } catch(err) {
      console.error('User fetch failed:', err)
    }
  }

  const fetchDonors = async () => {
    setLoading(true)
    try {
      const res = await API.get('/api/donors/')
      setDonors(res.data || [])
    } catch(err) {
      console.error('Donors fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/donors/', formData)
      setShowForm(false)
      setFormData({name: '', age: '', blood_group: 'O+', organ: 'Kidney', phone: '', location: '', availability: true})
      fetchDonors()
    } catch(err) {
      console.error('Submit failed:', err)
    }
  }

  return (
    <div>
      <div className="card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '2rem'}}>
        <h2 style={{margin: '0 0 0.5rem 0'}}>👤 Welcome, {user?.email || 'Donor'}</h2>
        <p style={{margin: '0', opacity: 0.9}}>Help save lives by becoming a donor</p>
      </div>

      <div className="grid">
        <div className="stat-box">
          <div className="stat-label">📊 Total Donors</div>
          <div className="stat-number">{donors.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">🩸 Blood Groups</div>
          <div className="stat-number">{new Set(donors.map(d => d.blood_group)).size}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">🏥 Available</div>
          <div className="stat-number">{donors.filter(d => d.availability).length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🩸 Donor Profiles</h3>
          <button className="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Profile'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'}}>
            <div className="grid-2">
              <label>
                <span>Name</span>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </label>
              <label>
                <span>Age</span>
                <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required />
              </label>
              <label>
                <span>Blood Group</span>
                <select value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})}>
                  <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                </select>
              </label>
              <label>
                <span>Organ</span>
                <select value={formData.organ} onChange={e => setFormData({...formData, organ: e.target.value})}>
                  <option>Kidney</option><option>Heart</option><option>Liver</option>
                  <option>Lungs</option><option>Pancreas</option><option>Eyes</option>
                </select>
              </label>
              <label>
                <span>Phone</span>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </label>
              <label>
                <span>Location</span>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </label>
            </div>
            <button type="submit" className="success" style={{marginTop: '1rem', width: '100%'}}>✓ Register as Donor</button>
          </form>
        )}

        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <span className="spinner"></span>
            <p>Loading donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <p style={{textAlign: 'center', color: '#999', padding: '2rem'}}>No donors yet. Be the first to register!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>👤 Name</th>
                <th>🩸 Blood</th>
                <th>🫀 Organ</th>
                <th>📍 Location</th>
                <th>✓ Status</th>
              </tr>
            </thead>
            <tbody>
              {donors.map(donor => (
                <tr key={donor.id}>
                  <td><strong>{donor.name}</strong><br/><span style={{fontSize: '0.85rem', color: '#666'}}>Age: {donor.age}</span></td>
                  <td><span className="badge info">{donor.blood_group}</span></td>
                  <td>{donor.organ}</td>
                  <td>{donor.location || '-'}</td>
                  <td>
                    <span className={`badge ${donor.availability ? 'success' : 'warning'}`}>
                      {donor.availability ? '✓ Available' : '⊘ Not Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
