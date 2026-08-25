import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Member';

  return (
    <main id="main">
      {/* Client Portal Header */}
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        padding: '140px 0 60px',
        color: 'var(--white)',
        borderBottom: '4px solid var(--gold-accent)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="eyebrow" style={{ justifyContent: 'flex-start', margin: 0 }}>Client Dashboard</div>
              <h1 style={{ fontSize: '42px', marginTop: '10px', marginBottom: '5px' }}>
                Welcome back, {user?.fullName || 'Client'}
              </h1>
              <p style={{ color: 'var(--gray-light)', fontSize: '15px' }}>
                Account Email: {user?.email} | Role: <span style={{ textTransform: 'uppercase', color: 'var(--gold-accent)', fontWeight: 'bold' }}>{user?.role}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '12px 24px', fontSize: '14px', borderColor: 'var(--gold-accent)', color: 'var(--gold-accent)' }}
            >
              🔒 Log Out
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {/* Account Overview Card */}
            <div style={{
              background: 'var(--white)',
              padding: '30px',
              borderRadius: '4px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              borderTop: '3px solid var(--navy-primary)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy-primary)', marginBottom: '15px' }}>
                Account Profile
              </h3>
              <div style={{ fontSize: '15px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
                <p><strong>Client ID:</strong> {user?._id}</p>
                <p><strong>Member Since:</strong> {formattedDate}</p>
                <p><strong>Status:</strong> <span style={{ color: '#065F46', background: '#D1FAE5', padding: '2px 8px', borderRadius: '3px', fontWeight: 'bold', fontSize: '13px' }}>Active Confidential Account</span></p>
              </div>
            </div>

            {/* Consultations Card (Clean Real Empty State) */}
            <div style={{
              background: 'var(--white)',
              padding: '30px',
              borderRadius: '4px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              borderTop: '3px solid var(--gold-accent)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy-primary)', marginBottom: '15px' }}>
                Upcoming Consultations
              </h3>
              <div style={{
                textAlign: 'center',
                padding: '30px 15px',
                border: '1px dashed #D1D5DB',
                borderRadius: '4px',
                background: 'var(--off-white)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📅</div>
                <h4 style={{ fontSize: '16px', color: 'var(--navy-primary)', marginBottom: '5px' }}>No Consultations Scheduled</h4>
                <p style={{ fontSize: '14px', color: 'var(--gray-pillar)', marginBottom: '20px' }}>
                  You currently have no scheduled appointments with our legal team.
                </p>
                <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  Schedule Consultation
                </Link>
              </div>
            </div>

            {/* Legal Documents Card (Clean Real Empty State) */}
            <div style={{
              background: 'var(--white)',
              padding: '30px',
              borderRadius: '4px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              borderTop: '3px solid var(--navy-primary)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy-primary)', marginBottom: '15px' }}>
                Legal Documents & Vault
              </h3>
              <div style={{
                textAlign: 'center',
                padding: '30px 15px',
                border: '1px dashed #D1D5DB',
                borderRadius: '4px',
                background: 'var(--off-white)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📜</div>
                <h4 style={{ fontSize: '16px', color: 'var(--navy-primary)', marginBottom: '5px' }}>No Active Documents</h4>
                <p style={{ fontSize: '14px', color: 'var(--gray-pillar)' }}>
                  Encrypted file exchange will activate upon your formal engagement with our firm.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
