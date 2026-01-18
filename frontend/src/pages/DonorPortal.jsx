import React, { useState, useEffect } from 'react'
import API from '../api'

export default function DonorPortal() {
  const [donor, setDonor] = useState(null)
  const [donations, setDonations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    blood_type: '',
    health_status: 'healthy',
    organs: [],
    contact: '',
  })

  useEffect(() => {
    fetchDonorInfo()
  }, [])

  const fetchDonorInfo = async () => {
    try {
      const res = await API.get('/api/donors/me')
      setDonor(res.data)
      setFormData({
        blood_type: res.data.blood_type || '',
        health_status: res.data.health_status || 'healthy',
        organs: res.data.organs || [],
        contact: res.data.contact || '',
      })
      setLoading(false)
    } catch (err) {
      console.error('Error fetching donor info:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/donors', formData)
      setShowForm(false)
      fetchDonorInfo()
    } catch (err) {
      console.error('Error updating donor info:', err)
    }
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>💚 Donor Portal</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Save lives by donating organs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Blood Type Card */}
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #667eea'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Blood Type</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
            {donor?.blood_type || 'Not Set'}
          </div>
        </div>

        {/* Health Status Card */}
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #48bb78'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Health Status</div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#48bb78',
            textTransform: 'capitalize'
          }}>
            {donor?.health_status || 'Not Set'}
          </div>
        </div>

        {/* Organs Available Card */}
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ed8936'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Organs Available</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ed8936' }}>
            {donor?.organs?.length || 0} organs
          </div>
          {donor?.organs && donor.organs.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              {donor.organs.join(', ')}
            </div>
          )}
        </div>

        {/* Registration Date Card */}
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #9f7aea'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Member Since</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#9f7aea' }}>
            {donor?.created_at ? new Date(donor.created_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0 }}>📋 Your Donation History</h2>
        {donor?.organs && donor.organs.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {donor.organs.map((organ, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                background: '#f7fafc',
                borderRadius: '5px',
                borderLeft: '3px solid #667eea'
              }}>
                <div style={{ fontWeight: 'bold', color: '#2d3748' }}>🫀 {organ}</div>
                <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                  Available for matching
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
            <p>No organs registered yet</p>
            <p style={{ fontSize: '0.9rem' }}>Update your profile to add organs for donation</p>
          </div>
        )}
      </div>

      {/* Update Profile Section */}
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>✏️ Update Profile</h2>
          <button onClick={() => setShowForm(!showForm)} style={{
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            {showForm ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Blood Type</label>
              <select
                value={formData.blood_type}
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Blood Type</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Health Status</label>
              <select
                value={formData.health_status}
                onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              >
                <option value="healthy">Healthy</option>
                <option value="critical">Critical</option>
                <option value="recovering">Recovering</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Organs Available (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., Kidney, Liver, Heart"
                value={formData.organs.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  organs: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Number</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button type="submit" style={{
              padding: '0.75rem 1.5rem',
              background: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              💾 Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Tips Section */}
      <div style={{
        background: '#edf2f7',
        padding: '1.5rem',
        borderRadius: '10px',
        marginTop: '2rem',
        borderLeft: '4px solid #667eea'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 Tips for Donors</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Keep your health status updated</li>
          <li>Specify all organs available for donation</li>
          <li>Maintain contact information for quick updates</li>
          <li>Your donation can save up to 8 lives</li>
        </ul>
      </div>
    </div>
  )
}
