import React, { useState, useEffect } from 'react'
import API from '../api'

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ pending: 0, matched: 0, fulfilled: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Parallel fetch
      const [reqRes, donRes] = await Promise.all([
        API.get('/api/requests'),
        API.get('/api/donors')
      ])

      setRequests(reqRes.data)
      setInventory(donRes.data)

      // Calc stats
      const s = { pending: 0, matched: 0, fulfilled: 0 }
      reqRes.data.forEach(r => {
        if (s[r.status] !== undefined) s[r.status]++
      })
      setStats(s)

    } catch (err) {
      console.error("Error fetching data", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFulfill = async (requestId, donorId) => {
    if (!window.confirm("Are you sure you want to proceed with this transplant/transfusion? This action is irreversible and will be logged to the blockchain.")) return

    try {
      await API.post(`/api/hospitals/fulfill/${requestId}`, { donor_id: donorId })
      alert("Procedure confirmed and logged to Blockchain!")
      fetchData() // Refresh
    } catch (err) {
      console.error("Fulfill error", err)
      const msg = err.response?.status === 409
        ? "⚠️ This donor was already claimed by another hospital! Refreshing..."
        : "Failed to fulfill request. See console."
      alert(msg)
      fetchData()
    }
  }

  const getUrgencyColor = (u) => {
    if (u === 'critical') return '#e53e3e'
    if (u === 'high') return '#ed8936'
    return '#38a169'
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Hospital Data...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0 }}>🏥 Hospital Operations Center</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ opacity: 0.9 }}>Manage requests, inventory, and transplant procedures</p>
          <button onClick={fetchData} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            🔄 Refresh Live Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Pending Requests" value={stats.pending} color="#e53e3e" />
        <StatCard label="Matched Ready" value={stats.matched} color="#d69e2e" />
        <StatCard label="Procedures Done" value={stats.fulfilled} color="#38a169" />
        <StatCard label="Total Donors" value={inventory.length} color="#3182ce" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
        <TabButton label="📋 Request Queue" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
        <TabButton label="🩸 Donor Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
      </div>

      {/* Content */}
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

        {activeTab === 'requests' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Pending/Matched Section */}
            <div>
              <h3 style={{ borderBottom: '2px solid #f7fafc', paddingBottom: '0.5rem' }}>Active Requests</h3>
              {requests.filter(r => r.status !== 'fulfilled').length === 0 && <p style={{ color: '#aaa' }}>No active requests.</p>}

              {requests.filter(r => r.status !== 'fulfilled').map((req, i) => (
                <div key={i} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  borderLeft: `5px solid ${getUrgencyColor(req.urgency)}`,
                  background: req.status === 'matched' ? '#f0fff4' : '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>Needed: {req.organ} ({req.blood_group})</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Badge color={getUrgencyColor(req.urgency)}>{req.urgency}</Badge>
                        <Badge color="#4a5568">{new Date(req.created_at).toLocaleDateString()}</Badge>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: req.status === 'matched' ? '#38a169' : '#e53e3e'
                      }}>
                        STATUS: {req.status.toUpperCase()}
                      </div>
                      {req.status === 'pending' && <div style={{ fontSize: '0.8rem', color: '#718096' }}>Waiting for donor match...</div>}
                    </div>
                  </div>

                  {/* AI Matches */}
                  {req.matches && req.matches.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>✨ AI Suggested Donors</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ textAlign: 'left', color: '#718096' }}>
                            <th>Donor ID</th>
                            <th>Match Score</th>
                            <th>Location</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {req.matches.map((m, idx) => (
                            <tr key={idx} style={{ borderTop: '1px solid #edf2f7' }}>
                              <td style={{ padding: '0.5rem 0' }}>#{m.donor_id ? m.donor_id.slice(-4) : '????'}</td>
                              <td style={{ fontWeight: 'bold', color: m.match_score > 0.8 ? '#38a169' : '#d69e2e' }}>
                                {(m.match_score * 100).toFixed(0)}%
                              </td>
                              <td>{m.location}</td>
                              <td>
                                <button onClick={() => handleFulfill(req._id, m.donor_id)} style={{
                                  background: '#11998e', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'
                                }}>
                                  ✅ Fulfill Function
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* History Section */}
            <div>
              <h3 style={{ borderBottom: '2px solid #f7fafc', paddingBottom: '0.5rem', color: '#718096' }}>Completed Procedures</h3>
              {requests.filter(r => r.status === 'fulfilled').map((req, i) => (
                <div key={i} style={{ padding: '1rem', borderBottom: '1px solid #eee', color: '#718096' }}>
                  ✅ <strong>{req.organ} ({req.blood_group})</strong> - Fulfilled on {new Date().toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <h3>Global Donor Inventory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7fafc', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th>Blood Group</th>
                  <th>Organs</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '1rem' }}>{d.name}</td>
                    <td><span style={{ background: '#bee3f8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>{d.blood_group}</span></td>
                    <td>{d.organs_available && d.organs_available.join(', ')}</td>
                    <td>{d.location}</td>
                    <td>
                      {d.availability ?
                        <span style={{ color: '#38a169', fontWeight: 'bold' }}>Available</span> :
                        <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>Unavailable</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', borderLeft: `5px solid ${color}`, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{value}</div>
      <div style={{ color: '#718096', fontSize: '0.9rem' }}>{label}</div>
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.75rem 1.5rem',
      background: 'none',
      border: 'none',
      borderBottom: active ? '3px solid #11998e' : '3px solid transparent',
      color: active ? '#11998e' : '#718096',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem'
    }}>
      {label}
    </button>
  )
}

function Badge({ children, color }) {
  return (
    <span style={{ background: color, color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
      {children}
    </span>
  )
}
