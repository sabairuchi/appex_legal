import React, { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/clientApi';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchNotifications();
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('[Notifications Load Error]:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('[Mark Read Error]:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('[Mark All Read Error]:', err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="portal-card" style={{ padding: '30px' }}>
        <div className="skeleton" style={{ height: '30px', width: '40%', marginBottom: '20px' }}></div>
        <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Header */}
      <div className="portal-card" style={{ borderTopColor: 'var(--gold-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="portal-card-title" style={{ fontSize: '24px' }}>Notifications Center</h2>
            <p style={{ color: 'var(--gray-pillar)', fontSize: '14px', margin: 0 }}>
              Stay updated on appointment changes, document uploads, and case activities.
            </p>
          </div>
          {unreadCount > 0 ? (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px', borderColor: 'var(--gold-accent)', color: 'var(--gold-accent)' }}
            >
              ✓ Mark All as Read ({unreadCount})
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div style={{ padding: '16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      ) : null}

      {/* Controls & Filter Bar */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
            border: 'none', cursor: 'pointer',
            backgroundColor: filter === 'all' ? 'var(--navy-primary)' : 'var(--white)',
            color: filter === 'all' ? 'var(--white)' : 'var(--gray-pillar)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
            border: 'none', cursor: 'pointer',
            backgroundColor: filter === 'unread' ? 'var(--navy-primary)' : 'var(--white)',
            color: filter === 'unread' ? 'var(--white)' : 'var(--gray-pillar)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="portal-card">
        {filteredNotifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredNotifications.map((n) => (
              <div
                key={n._id}
                style={{
                  padding: '18px 20px',
                  borderRadius: '6px',
                  backgroundColor: n.isRead ? 'var(--white)' : '#FEFCE8',
                  border: '1px solid',
                  borderColor: n.isRead ? '#E2E8F0' : '#FEF08A',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '15px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>
                      {n.type === 'appointment' ? '📅' : n.type === 'document' ? '📜' : '🔔'}
                    </span>
                    <strong style={{ color: 'var(--navy-primary)', fontSize: '15px' }}>{n.title}</strong>
                    {!n.isRead ? (
                      <span className="portal-badge" style={{ fontSize: '10px' }}>NEW</span>
                    ) : null}
                  </div>
                  <p style={{ color: 'var(--navy-dark)', fontSize: '14px', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                    {n.message}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--gray-light)' }}>
                    Received on {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>

                {!n.isRead ? (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--gold-accent)',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                  >
                    Mark as Read ✓
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div className="empty-state-icon">🔔</div>
            <h3 className="empty-state-title">
              {filter === 'unread' ? 'No Unread Notifications' : "You're All Caught Up"}
            </h3>
            <p className="empty-state-desc">
              {filter === 'unread'
                ? 'All existing notification alerts have been marked as read.'
                : 'There are currently no notification records associated with your account.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
