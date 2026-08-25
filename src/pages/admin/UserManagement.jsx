import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchUserById, updateUserStatus, updateUserRole } from '../../services/adminApi';
import '../../styles/admin.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Detail Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Status Action Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, user: null, action: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers({ search, role: roleFilter, status: statusFilter });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to fetch user accounts' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (user) => {
    setSelectedUser(user);
    setLoadingDetails(true);
    try {
      const data = await fetchUserById(user._id);
      setSelectedUser(data.user);
      setUserAppointments(data.appointments || []);
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatusClick = (user) => {
    setConfirmModal({
      open: true,
      user,
      action: user.isActive ? 'deactivate' : 'activate',
    });
  };

  const executeStatusChange = async () => {
    if (!confirmModal.user) return;
    try {
      setActionLoading(true);
      const newStatus = !confirmModal.user.isActive;
      await updateUserStatus(confirmModal.user._id, newStatus);
      setFeedbackMsg({
        type: 'success',
        text: `Successfully ${newStatus ? 'activated' : 'deactivated'} user ${confirmModal.user.fullName}`,
      });
      setConfirmModal({ open: false, user: null, action: '' });
      loadUsers();
      if (selectedUser && selectedUser._id === confirmModal.user._id) {
        setSelectedUser({ ...selectedUser, isActive: newStatus });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to update user status' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(true);
      await updateUserRole(userId, newRole);
      setFeedbackMsg({ type: 'success', text: `User role updated to '${newRole}'` });
      loadUsers();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to update user role' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>User Management</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Review, search, and manage platform user permissions and account statuses</p>
        </div>
      </div>

      {feedbackMsg.text && (
        <div
          className="admin-card"
          style={{
            padding: '1rem',
            backgroundColor: feedbackMsg.type === 'error' ? '#FEF2F2' : '#F0FDF4',
            borderColor: feedbackMsg.type === 'error' ? '#FCA5A5' : '#86EFAC',
            color: feedbackMsg.type === 'error' ? '#991B1B' : '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{feedbackMsg.text}</span>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => setFeedbackMsg({ type: '', text: '' })}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="admin-card">
        <div className="admin-filter-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="admin-select-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
            <option value="admin">Admin</option>
          </select>

          <select className="admin-select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {(search || roleFilter || statusFilter) && (
            <button
              className="admin-btn admin-btn-outline"
              onClick={() => {
                setSearch('');
                setRoleFilter('');
                setStatusFilter('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="admin-loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">👥</div>
            <div className="admin-empty-title">No user records found</div>
            <p>Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{u.email}</div>
                    </td>
                    <td>
                      <select
                        className="admin-select-input"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={actionLoading}
                      >
                        <option value="client">client</option>
                        <option value="lawyer">lawyer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`admin-badge ${u.isActive ? 'active' : 'inactive'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleOpenDetails(u)}>
                          View Details
                        </button>
                        <button
                          className={`admin-btn admin-btn-sm ${u.isActive ? 'admin-btn-danger' : 'admin-btn-gold'}`}
                          onClick={() => handleToggleStatusClick(u)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Administrative User Overview</h3>
              <button className="admin-modal-close" onClick={() => setSelectedUser(null)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              {loadingDetails ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="admin-loading-spinner"></div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#D4AF37',
                        color: '#0B132B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                      }}
                    >
                      {selectedUser.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{selectedUser.fullName}</h2>
                      <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{selectedUser.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Role</label>
                      <span className={`admin-badge ${selectedUser.role}`}>{selectedUser.role}</span>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Account Status</label>
                      <span className={`admin-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                        {selectedUser.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Phone</label>
                      <div style={{ fontSize: '0.9rem' }}>{selectedUser.phone || 'Not provided'}</div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Registration Date</label>
                      <div style={{ fontSize: '0.9rem' }}>
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div className="admin-form-group">
                      <label className="admin-form-label">Bio / Profile Notes</label>
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#475569',
                        }}
                      >
                        {selectedUser.bio}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 700, fontSize: '1rem' }}>
                      Associated Consultations ({userAppointments.length})
                    </h4>
                    {userAppointments.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: '#64748B' }}>No appointment records found for this user.</p>
                    ) : (
                      <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {userAppointments.map((appt) => (
                          <div
                            key={appt._id}
                            style={{
                              padding: '0.65rem 0.85rem',
                              borderBottom: '1px solid #E2E8F0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{appt.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                {appt.appointmentDate} at {appt.appointmentTime}
                              </div>
                            </div>
                            <span className={`admin-badge ${appt.status}`}>{appt.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Destructive/Status Action */}
      {confirmModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '420px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Account Status Change</h3>
              <button className="admin-modal-close" onClick={() => setConfirmModal({ open: false, user: null, action: '' })}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to <strong>{confirmModal.action}</strong> the user account for{' '}
                <strong>{confirmModal.user?.fullName}</strong> ({confirmModal.user?.email})?
              </p>
              {confirmModal.action === 'deactivate' && (
                <p style={{ fontSize: '0.85rem', color: '#DC2626' }}>
                  ⚠️ Deactivating this account will prevent the user from logging in or booking new consultations.
                </p>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setConfirmModal({ open: false, user: null, action: '' })}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className={`admin-btn ${confirmModal.action === 'deactivate' ? 'admin-btn-danger' : 'admin-btn-gold'}`}
                onClick={executeStatusChange}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : `Confirm ${confirmModal.action.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
