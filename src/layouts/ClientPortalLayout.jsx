import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications } from '../services/clientApi';
import '../styles/portal.css';

export default function ClientPortalLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadNotificationCount = async () => {
      try {
        const notifs = await fetchNotifications();
        if (isMounted && Array.isArray(notifs)) {
          const unread = notifs.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        // Silent catch for layout banner
      }
    };
    if (user) {
      loadNotificationCount();
    }
    return () => {
      isMounted = false;
    };
  }, [user, location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Appointments', path: '/appointments', icon: '📅' },
    { label: 'Legal Documents', path: '/documents', icon: '📜' },
    { label: 'Notifications', path: '/notifications', icon: '🔔', badge: unreadCount },
    { label: 'My Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="portal-wrapper">
      {/* Portal Header Hero */}
      <section className="portal-hero">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--gold-accent)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--navy-secondary)',
                    color: 'var(--gold-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: '2px solid var(--gold-accent)',
                  }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
              )}
              <div>
                <div className="eyebrow" style={{ justifyContent: 'flex-start', margin: 0 }}>
                  Client Portal
                </div>
                <h1 style={{ fontSize: '32px', marginTop: '4px', marginBottom: '2px', color: 'var(--white)' }}>
                  Welcome, {user?.fullName || 'Client'}
                </h1>
                <p style={{ color: 'var(--gray-light)', fontSize: '14px', margin: 0 }}>
                  Apex Legal Secure Vault & Case Management | {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs Bar */}
      <nav className="portal-nav-bar" aria-label="Client Portal Navigation">
        <div className="container">
          <div className="portal-nav-container">
            <div className="portal-nav-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `portal-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge > 0 ? (
                    <span className="portal-badge">{item.badge}</span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container">
        {children}
      </main>
    </div>
  );
}
