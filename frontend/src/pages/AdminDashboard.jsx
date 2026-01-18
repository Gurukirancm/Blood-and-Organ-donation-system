import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [inventory, setInventory] = useState({ blood: {}, organs: {} })
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const meRes = await API.get('/api/auth/me')
      if (meRes.data.role !== 'admin') navigate('/login')
      setUser(meRes.data)

      // Fetch initial data
      await Promise.all([fetchUsers(), fetchInventory(), fetchAudit()])
    } catch (err) {
      console.error('Admin fetch failed:', err)
      navigate('/login') // Strict RBAC
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/admin/users')
      setUsers(res.data)
    } catch (e) { console.error(e) }
  }

  const fetchInventory = async () => {
    try {
      const res = await API.get('/api/admin/inventory')
      setInventory(res.data)
    } catch (e) { console.error(e) }
  }

  const fetchAudit = async () => {
    try {
      const res = await API.get('/api/admin/audit-trail')
      setAuditLogs(res.data)
    } catch (e) { console.error(e) }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await API.patch(`/api/admin/users/${userId}/status`, { is_active: !currentStatus })
      fetchUsers() // Refresh list
    } catch (e) {
      alert('Failed to update status')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    API.setToken(null)
    navigate('/login')
  }

  if (loading) return <div className="loading-spinner">Loading Admin Portal...</div>

  return (
    <div className="admin-portal">
      {/* Sidebar / Navigation */}
      <div className="sidebar" style={{ width: '250px', background: '#2d3748', color: 'white', minHeight: '100vh', padding: '1.5rem', position: 'fixed', left: 0, top: 0 }}>
        <h2 style={{ borderBottom: '1px solid #4a5568', paddingBottom: '1rem', marginBottom: '2rem' }}>🛡️ Admin Core</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>📊 Overview</NavBtn>
          <NavBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')}>👥 User Management</NavBtn>
          <NavBtn active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>📦 Inventory</NavBtn>
          <NavBtn active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>📜 Blockchain Audit</NavBtn>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button onClick={logout} style={{ width: '100%', padding: '0.75rem', background: '#e53e3e', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content" style={{ marginLeft: '250px', padding: '2rem', background: '#f7fafc', minHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ textTransform: 'capitalize' }}>{activeTab}</h1>
          <div style={{ color: '#718096' }}>Welcome, {user?.email}</div>
        </header>

        {activeTab === 'overview' && <OverviewTab users={users} inventory={inventory} auditLogs={auditLogs} />}
        {activeTab === 'users' && <UsersTab users={users} onToggle={toggleUserStatus} />}
        {activeTab === 'inventory' && <InventoryTab inventory={inventory} />}
        {activeTab === 'audit' && <AuditTab logs={auditLogs} />}
      </div>
    </div>
  )
}

const NavBtn = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    textAlign: 'left',
    padding: '0.75rem 1rem',
    background: active ? '#4a5568' : 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: active ? 'bold' : 'normal'
  }}>
    {children}
  </button>
)

const OverviewTab = ({ users, inventory, auditLogs }) => (
  <div className="grid">
    <StatBox label="Total Users" value={users.length} color="#4299e1" />
    <StatBox label="Active Donors" value={inventory?.total_donors || 0} color="#48bb78" />
    <StatBox label="Hospitals" value={inventory?.total_hospitals || 0} color="#ed8936" />
    <StatBox label="Audit Events" value={auditLogs.length} color="#805ad5" />
  </div>
)

const StatBox = ({ label, value, color }) => (
  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderTop: `4px solid ${color}` }}>
    <div style={{ fontSize: '0.9rem', color: '#718096' }}>{label}</div>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>{value}</div>
  </div>
)

const UsersTab = ({ users, onToggle }) => (
  <div className="card">
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => {
          // Default to active if field is missing (for pre-migration users)
          const isActive = u.is_active !== false
          return (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td><span className={`badge ${u.role === 'admin' ? 'purple' : u.role === 'hospital' ? 'blue' : 'green'}`}>{u.role}</span></td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${isActive ? 'success' : 'danger'}`}>
                  {isActive ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td>
                {u.role !== 'admin' && (
                  <button onClick={() => onToggle(u.id, isActive)} style={{
                    padding: '0.25rem 0.5rem',
                    background: isActive ? '#feb2b2' : '#9ae6b4',
                    color: isActive ? '#9b2c2c' : '#22543d',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}>
                    {isActive ? 'Disable' : 'Enable'}
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

const InventoryTab = ({ inventory }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
    <div className="card">
      <h3>🩸 Blood Supply</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
        {Object.entries(inventory.blood || {}).map(([type, count]) => (
          <div key={type} style={{ padding: '1rem', background: '#ffe4e6', borderRadius: '8px', flex: '1', minWidth: '80px', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#e53e3e' }}>{type}</div>
            <div style={{ fontSize: '1.5rem' }}>{count}</div>
          </div>
        ))}
        {Object.keys(inventory.blood || {}).length === 0 && <p style={{ color: '#718096' }}>No blood data available</p>}
      </div>
    </div>
    <div className="card">
      <h3>🫀 Organ Availability</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
        {Object.entries(inventory.organs || {}).map(([organ, count]) => (
          <div key={organ} style={{ padding: '1rem', background: '#e6fffa', borderRadius: '8px', flex: '1', minWidth: '80px', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#319795' }}>{organ}</div>
            <div style={{ fontSize: '1.5rem' }}>{count}</div>
          </div>
        ))}
        {Object.keys(inventory.organs || {}).length === 0 && <p style={{ color: '#718096' }}>No organ data available</p>}
      </div>
    </div>
  </div>
)

const AuditTab = ({ logs }) => (
  <div className="card">
    {logs.length === 0 ? <p>No blockchain records found.</p> : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logs.map((block, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#805ad5' }}>Block #{block.index}</span>
              <span style={{ fontSize: '0.85rem', color: '#718096' }}>{new Date(block.timestamp).toLocaleString()}</span>
            </div>
            <div style={{ background: '#edf2f7', padding: '0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {JSON.stringify(block.data, null, 2)}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#a0aec0', fontFamily: 'monospace' }}>
              Hash: {block.hash}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)
