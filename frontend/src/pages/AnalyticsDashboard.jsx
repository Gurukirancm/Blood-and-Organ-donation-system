import React, { useState, useEffect } from 'react'
import API from '../api'

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Simulated data - in production, fetch from backend
      const mockData = {
        summary: {
          total_donors: 124,
          total_hospitals: 18,
          pending_requests: 7,
          new_donors_30d: 23,
          new_hospitals_30d: 3,
          matches_found_30d: 15,
          transplants_completed_30d: 8,
          average_match_time_hours: 4.5
        },
        success_rate: 53.33,
        system_health: {
          status: 'Excellent',
          uptime_percentage: 99.8,
          error_count_24h: 2,
          operations_24h: 1245,
          database_status: 'Healthy',
          api_response_time_ms: 145
        }
      }
      setMetrics(mockData)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner"></span></div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>📊 Analytics Dashboard</h1>
        <p style={{ margin: '0', opacity: 0.9 }}>Real-time metrics and insights</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e0e0e0', flexWrap: 'wrap' }}>
        {['overview', 'trends', 'health'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'transparent',
              color: activeTab === tab ? 'white' : '#666',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {tab === 'overview' && '📈 Overview'}
            {tab === 'trends' && '📊 Trends'}
            {tab === 'health' && '💚 System Health'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <MetricCard label="👥 Total Donors" value={metrics?.summary?.total_donors} color="#667eea" />
            <MetricCard label="🏥 Total Hospitals" value={metrics?.summary?.total_hospitals} color="#11998e" />
            <MetricCard label="📋 Pending Requests" value={metrics?.summary?.pending_requests} color="#f093fb" />
            <MetricCard label="✓ Success Rate" value={`${metrics?.success_rate?.toFixed(1)}%`} color="#38ef7d" />
            <MetricCard label="⚡ Avg Match Time" value={`${metrics?.summary?.average_match_time_hours}h`} color="#30cfd0" />
            <MetricCard label="📈 Matches (30d)" value={metrics?.summary?.matches_found_30d} color="#fa709a" />
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Last 30 Days Activity</h3>
              <div style={{ padding: '1rem 0' }}>
                <ActivityItem icon="👤" label="New Donors" value={metrics?.summary?.new_donors_30d} />
                <ActivityItem icon="🏥" label="New Hospitals" value={metrics?.summary?.new_hospitals_30d} />
                <ActivityItem icon="🎯" label="Matches Found" value={metrics?.summary?.matches_found_30d} />
                <ActivityItem icon="✅" label="Transplants Completed" value={metrics?.summary?.transplants_completed_30d} />
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Key Insights</h3>
              <div style={{ padding: '1rem 0' }}>
                <InsightItem 
                  title="Blood Group Distribution" 
                  content="O+ is the most common type (35% of donors)" 
                  priority="info"
                />
                <InsightItem 
                  title="High Demand Organs" 
                  content="Kidney transplants account for 45% of requests" 
                  priority="warning"
                />
                <InsightItem 
                  title="Match Performance" 
                  content="53.3% success rate - Above industry average!" 
                  priority="success"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="card">
          <h2>📊 7-Day Trends</h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            padding: '2rem',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#666'
          }}>
            <p>Donor registrations trending up ↑ 15%</p>
            <p>Hospital activity stable →</p>
            <p>Match requests increased ↑ 8%</p>
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'health' && (
        <div className="card">
          <h2>💚 System Health Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <HealthMetric 
              label="System Status"
              value={metrics?.system_health?.status}
              color="#11998e"
            />
            <HealthMetric 
              label="Uptime"
              value={`${metrics?.system_health?.uptime_percentage}%`}
              color="#38ef7d"
            />
            <HealthMetric 
              label="Database"
              value={metrics?.system_health?.database_status}
              color="#667eea"
            />
            <HealthMetric 
              label="API Response"
              value={`${metrics?.system_health?.api_response_time_ms}ms`}
              color="#30cfd0"
            />
          </div>
        </div>
      )}

      <button 
        onClick={fetchAnalytics}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        🔄 Refresh Analytics
      </button>
    </div>
  )
}

function MetricCard({ label, value, color }) {
  return (
    <div className="card" style={{ borderLeft: `5px solid ${color}` }}>
      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</div>
    </div>
  )
}

function ActivityItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e0e0e0' }}>
      <span>{icon} {label}</span>
      <strong style={{ color: '#667eea' }}>{value}</strong>
    </div>
  )
}

function InsightItem({ title, content, priority }) {
  const colors = {
    success: '#11998e',
    warning: '#fa709a',
    info: '#667eea'
  }
  
  return (
    <div style={{ 
      padding: '1rem', 
      margin: '0.5rem 0', 
      background: '#f9f9f9', 
      borderLeft: `4px solid ${colors[priority]}`,
      borderRadius: '5px'
    }}>
      <strong style={{ color: colors[priority] }}>{title}</strong>
      <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>{content}</p>
    </div>
  )
}

function HealthMetric({ label, value, color }) {
  return (
    <div className="card" style={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`, border: `2px solid ${color}` }}>
      <div style={{ color: color, fontWeight: 'bold' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: color, marginTop: '0.5rem' }}>{value}</div>
    </div>
  )
}
