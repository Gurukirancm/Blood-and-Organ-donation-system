import React, { useState, useEffect } from 'react'
import API from '../api'

export default function RecipientPortal() {
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    blood_type: '',
    organ_needed: '',
    urgency: 'normal',
    health_condition: '',
  })

  useEffect(() => {
    fetchUser()
    fetchRequests()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await API.get('/api/auth/me')
      if (res.data.role !== 'recipient') window.location.href = '/login'
    } catch (err) {
      window.location.href = '/login'
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await API.get('/api/requests')
      setRequests(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching requests:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/requests', formData)
      setShowForm(false)
      setFormData({ blood_type: '', organ_needed: '', urgency: 'normal', health_condition: '' })
      fetchRequests()
    } catch (err) {
      console.error('Error creating request:', err)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#e53e3e'
      case 'high': return '#ed8936'
      case 'normal': return '#38a169'
      default: return '#4299e1'
    }
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>❤️ Recipient Portal</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Request an organ and find hope for a healthier life</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderTop: '3px solid #f5576c'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f5576c' }}>{requests.length}</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Requests</div>
        </div>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderTop: '3px solid #e53e3e'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e53e3e' }}>
            {requests.filter(r => r.urgency === 'critical').length}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Critical Cases</div>
        </div>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderTop: '3px solid #38a169'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38a169' }}>
            {requests.filter(r => r.status === 'matched').length}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Matched</div>
        </div>
      </div>

      {/* New Request Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '0.75rem 1.5rem',
          background: '#f5576c',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          {showForm ? '❌ Cancel' : '➕ New Request'}
        </button>
      </div>

      {/* Create Request Form */}
      {showForm && (
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>Create New Request</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Blood Type</label>
              <select
                value={formData.blood_type}
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                required
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Organ Needed</label>
              <select
                value={formData.organ_needed}
                onChange={(e) => setFormData({ ...formData, organ_needed: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Organ</option>
                <option value="Kidney">🫀 Kidney</option>
                <option value="Liver">🫀 Liver</option>
                <option value="Heart">❤️ Heart</option>
                <option value="Lungs">🫁 Lungs</option>
                <option value="Pancreas">🫀 Pancreas</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Urgency Level</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Health Condition</label>
              <textarea
                value={formData.health_condition}
                onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
                placeholder="Describe your health condition..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button type="submit" style={{
              padding: '0.75rem 1.5rem',
              background: '#38a169',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              📝 Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>📋 Your Requests</h2>
        {requests.length > 0 ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {requests.map((req, idx) => (
              <div key={idx} style={{
                padding: '1.5rem',
                background: '#f7fafc',
                borderRadius: '8px',
                borderLeft: `4px solid ${getUrgencyColor(req.urgency)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>🫀 {req.organ_needed}</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e2e8f0',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}>
                        Blood Type: {req.blood_type}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: getUrgencyColor(req.urgency),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}>
                        {req.urgency}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: req.status === 'matched' ? '#c6f6d5' : req.status === 'pending' ? '#fed7d7' : '#bee3f8',
                    color: req.status === 'matched' ? '#22543d' : req.status === 'pending' ? '#742a2a' : '#2c5282',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}>
                    {req.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                {req.health_condition && (
                  <div style={{
                    padding: '0.75rem',
                    background: '#fff',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    color: '#4a5568'
                  }}>
                    <strong>Condition:</strong> {req.health_condition}
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
                  Requested on: {new Date(req.created_at).toLocaleDateString()}
                </div>

                {/* Matches Section */}
                {req.matches && req.matches.length > 0 && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>✨ AI Suggested Matches</h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {req.matches.map((match, mIdx) => (
                        <div key={mIdx} style={{
                          background: '#fff',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#4a5568' }}>Donor #{match.donor_id ? match.donor_id.slice(-4) : '????'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                              {match.blood_group} • {match.location}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontWeight: 'bold',
                              color: match.match_score > 0.8 ? '#38a169' : '#d69e2e',
                              fontSize: '1.1rem'
                            }}>
                              {(match.match_score * 100).toFixed(0)}% Match
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                              {match.breakdown?.confidence} Confidence
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
            <p>No requests yet</p>
            <p style={{ fontSize: '0.9rem' }}>Create a new request to find a matching donor</p>
          </div>
        )}
      </div>

      {/* Important Info */}
      <div style={{
        background: '#fef3c7',
        padding: '1.5rem',
        borderRadius: '10px',
        marginTop: '2rem',
        borderLeft: '4px solid #f59e0b'
      }}>
        <h3 style={{ marginTop: 0, color: '#92400e' }}>⚠️ Important Information</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
          <li>Keep your contact information updated</li>
          <li>Urgent cases have higher priority for matching</li>
          <li>You will be notified as soon as a match is found</li>
          <li>Transplant coordination requires immediate response</li>
        </ul>
      </div>
    </div>
  )
}
