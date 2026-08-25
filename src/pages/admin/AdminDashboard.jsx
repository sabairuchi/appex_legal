import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchAppointments } from '../../services/adminApi';
import '../../styles/admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, apptsData] = await Promise.all([
        fetchDashboardStats(),
        fetchAppointments({ limit: 5 }),
      ]);
      setStats(statsData);
      setRecentAppointments(apptsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError(err.message || 'Error loading dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="admin-loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading real-time platform metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card" style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}>
        <h3 style={{ color: '#991B1B', margin: 0 }}>System Alert</h3>
        <p style={{ color: '#B91C1C' }}>{error}</p>
        <button className="admin-btn admin-btn-outline" onClick={loadDashboardData}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>System Overview</h1>
        <p style={{ color: '#64748B', margin: 0 }}>Real-time legal practice management and analytics data</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon clients">👥</div>
          <div>
            <div className="admin-stat-val">{stats?.totalClients ?? 0}</div>
            <div className="admin-stat-label">Registered Clients</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon lawyers">⚖️</div>
          <div>
            <div className="admin-stat-val">{stats?.totalLawyers ?? 0}</div>
            <div className="admin-stat-label">Active Attorneys</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon appointments">📅</div>
          <div>
            <div className="admin-stat-val">{stats?.totalAppointments ?? 0}</div>
            <div className="admin-stat-label">Total Consultations</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon pending">⏳</div>
          <div>
            <div className="admin-stat-val">{stats?.pendingAppointments ?? 0}</div>
            <div className="admin-stat-label">Pending Intake</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon confirmed">✅</div>
          <div>
            <div className="admin-stat-val">{stats?.confirmedAppointments ?? 0}</div>
            <div className="admin-stat-label">Confirmed Sessions</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon completed">🎯</div>
          <div>
            <div className="admin-stat-val">{stats?.completedAppointments ?? 0}</div>
            <div className="admin-stat-label">Completed Cases</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon cancelled">🚫</div>
          <div>
            <div className="admin-stat-val">{stats?.cancelledAppointments ?? 0}</div>
            <div className="admin-stat-label">Cancelled Consults</div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Consultations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Quick Administration Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to="/admin/lawyers" className="admin-btn admin-btn-gold" style={{ justifyContent: 'center' }}>
              ➕ Add New Attorney
            </Link>
            <Link to="/admin/appointments" className="admin-btn admin-btn-primary" style={{ justifyContent: 'center' }}>
              📅 Manage Consultations
            </Link>
            <Link to="/admin/users" className="admin-btn admin-btn-outline" style={{ justifyContent: 'center' }}>
              👥 Review User Accounts
            </Link>
            <Link to="/admin/analytics" className="admin-btn admin-btn-outline" style={{ justifyContent: 'center' }}>
              📈 Deep Data Analytics
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Appointment Activity</h3>
            <Link to="/admin/appointments" style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">📂</div>
              <div className="admin-empty-title">No appointments found</div>
              <p style={{ fontSize: '0.85rem' }}>Client appointment bookings will appear here automatically.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appt) => (
                    <tr key={appt._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{appt.client?.fullName || 'Client'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{appt.appointmentType || 'Consultation'}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {appt.appointmentDate} <br />
                        <span style={{ color: '#64748B' }}>{appt.appointmentTime}</span>
                      </td>
                      <td>
                        <span className={`admin-badge ${appt.status}`}>{appt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
