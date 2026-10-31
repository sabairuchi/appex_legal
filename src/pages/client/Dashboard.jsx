import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../../services/clientApi';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resData = await fetchDashboard();
      setData(resData);
    } catch (err) {
      console.error('[Dashboard Error]:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="portal-card" style={{ minHeight: '260px' }}>
            <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '12px' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '12px' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ height: '40px', width: '40%', marginTop: 'auto' }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="portal-card" style={{ borderTopColor: '#EF4444', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '36px', marginBottom: '15px' }}>⚠️</div>
        <h3 style={{ fontSize: '20px', color: '#991B1B', marginBottom: '10px' }}>Dashboard Unavailable</h3>
        <p style={{ color: 'var(--gray-pillar)', marginBottom: '20px' }}>{error}</p>
        <button onClick={loadData} className="btn btn-primary" style={{ padding: '10px 24px' }}>
          Retry Loading
        </button>
      </div>
    );
  }

  const { user, assignedLawyer, upcomingAppointment, notifications, documents, stats } = data;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Active Member';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      
      {/* Top Grid: Account Summary & Assigned Lawyer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
        
        {/* Account Overview */}
        <div className="portal-card">
          <div className="portal-card-header">
            <h2 className="portal-card-title">Account Summary</h2>
            <span className="status-pill active">Confidential</span>
          </div>
          <div style={{ fontSize: '15px', color: 'var(--navy-dark)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <span style={{ color: 'var(--gray-pillar)', fontSize: '13px', display: 'block' }}>Full Name</span>
              <strong>{user.fullName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--gray-pillar)', fontSize: '13px', display: 'block' }}>Email Address</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--gray-pillar)', fontSize: '13px', display: 'block' }}>Phone Number</span>
              <strong>{user.phone || 'Not provided'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--gray-pillar)', fontSize: '13px', display: 'block' }}>Member Since</span>
              <strong>{memberSince}</strong>
            </div>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--gray-bg)' }}>
            <Link to="/profile" className="btn btn-outline" style={{ display: 'inline-block', padding: '8px 16px', fontSize: '13px' }}>
              Edit Account Profile →
            </Link>
          </div>
        </div>

        {/* Assigned Lawyer Card */}
        <div className="portal-card accent-gold">
          <div className="portal-card-header">
            <h2 className="portal-card-title">Assigned Legal Counsel</h2>
            <span style={{ fontSize: '12px', color: 'var(--gold-accent)', fontWeight: 'bold' }}>OFFICIAL APPOINTMENT</span>
          </div>
          {assignedLawyer ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {assignedLawyer.profileImage ? (
                <img
                  src={assignedLawyer.profileImage}
                  alt={assignedLawyer.fullName}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-accent)' }}
                />
              ) : (
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--navy-primary)',
                  color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', fontWeight: 'bold'
                }}>
                  ⚖️
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', color: 'var(--navy-primary)', marginBottom: '4px' }}>{assignedLawyer.fullName}</h3>
                <p style={{ color: 'var(--gold-accent)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  {assignedLawyer.bio || 'Senior Legal Counsel'}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--gray-pillar)', marginBottom: '12px' }}>
                  Email: <a href={`mailto:${assignedLawyer.email}`} style={{ color: 'var(--navy-primary)', textDecoration: 'underline' }}>{assignedLawyer.email}</a>
                </p>
                <a href={`mailto:${assignedLawyer.email}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  ✉️ Contact Counsel
                </a>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⚖️</div>
              <h3 className="empty-state-title">No Lawyer Assigned Yet</h3>
              <p className="empty-state-desc">
                Your assigned lawyer will appear here once assigned by firm management during intake.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Middle Grid: Upcoming Appointment & Notifications Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
        
        {/* Upcoming Appointment Overview */}
        <div className="portal-card">
          <div className="portal-card-header">
            <h2 className="portal-card-title">Upcoming Appointment</h2>
            <Link to="/appointments" style={{ fontSize: '13px', color: 'var(--gold-accent)', fontWeight: '600' }}>
              View All ({stats.totalAppointments}) →
            </Link>
          </div>
          {upcomingAppointment ? (
            <div style={{ backgroundColor: 'var(--off-white)', padding: '20px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--navy-primary)', margin: 0 }}>{upcomingAppointment.title}</h3>
                <span className={`status-pill ${upcomingAppointment.status}`}>
                  {upcomingAppointment.status}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--navy-dark)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>🗓️ <strong>Date:</strong> {upcomingAppointment.appointmentDate}</div>
                <div>⏰ <strong>Time:</strong> {upcomingAppointment.appointmentTime}</div>
                <div>📋 <strong>Type:</strong> {upcomingAppointment.appointmentType}</div>
                {upcomingAppointment.notes ? (
                  <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--gray-pillar)', fontStyle: 'italic' }}>
                    "{upcomingAppointment.notes}"
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3 className="empty-state-title">No Upcoming Appointments</h3>
              <p className="empty-state-desc">
                You currently have no scheduled consultations on your calendar.
              </p>
              <Link to="/appointments" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                + Request Consultation
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Card */}
        <div className="portal-card">
          <div className="portal-card-header">
            <h2 className="portal-card-title">Recent Notifications</h2>
            <Link to="/notifications" style={{ fontSize: '13px', color: 'var(--gold-accent)', fontWeight: '600' }}>
              View All ({stats.unreadNotifications} Unread) →
            </Link>
          </div>
          {notifications && notifications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    backgroundColor: n.isRead ? 'var(--white)' : '#FEFCE8',
                    border: '1px solid',
                    borderColor: n.isRead ? '#E2E8F0' : '#FEF08A',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--navy-primary)' }}>{n.title}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--gray-light)' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--gray-pillar)', margin: 0, fontSize: '13px' }}>{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <h3 className="empty-state-title">You're All Caught Up</h3>
              <p className="empty-state-desc">No new notifications at this time.</p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Row: Legal Documents Vault Preview */}
      <div className="portal-card">
        <div className="portal-card-header">
          <h2 className="portal-card-title">Legal Documents Vault</h2>
          <Link to="/documents" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Open Vault & Upload Documents →
          </Link>
        </div>
        {documents && documents.length > 0 ? (
          <div className="portal-table-wrapper">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Uploaded Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <strong style={{ color: 'var(--navy-primary)' }}>📜 {doc.title}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--gray-light)' }}>{doc.filename}</div>
                    </td>
                    <td>{doc.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td><span className="status-pill active">{doc.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📜</div>
            <h3 className="empty-state-title">No Legal Documents Available Yet</h3>
            <p className="empty-state-desc">
              Your uploaded and firm-issued confidential legal documents will be securely archived here.
            </p>
            <Link to="/documents" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '13px', borderColor: 'var(--navy-primary)' }}>
              + Upload Document
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
