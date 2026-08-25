import React, { useEffect, useState } from 'react';
import {
  fetchAppointments,
  fetchLawyers,
  updateAppointmentStatus,
  assignLawyerToAppointment,
  rescheduleAppointment,
} from '../../services/adminApi';
import '../../styles/admin.css';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [lawyerFilter, setLawyerFilter] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Detail Modal state
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Assign Lawyer Modal state
  const [assignModal, setAssignModal] = useState({ open: false, appt: null, lawyerId: '' });
  const [assignLoading, setAssignLoading] = useState(false);

  // Reschedule Modal state
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, appt: null, date: '', time: '' });
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Cancel Confirmation Modal state
  const [cancelModal, setCancelModal] = useState({ open: false, appt: null });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [search, statusFilter, lawyerFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apptsData, lawyersData] = await Promise.all([
        fetchAppointments({ search, status: statusFilter, lawyerId: lawyerFilter }),
        fetchLawyers(),
      ]);
      setAppointments(apptsData);
      setLawyers(lawyersData);
    } catch (err) {
      console.error('Failed to load appointments data:', err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Error fetching appointments' });
    } finally {
      setLoading(false);
    }
  };

  // Status update (e.g. Approve/Confirm/Complete)
  const handleStatusChange = async (apptId, newStatus) => {
    try {
      await updateAppointmentStatus(apptId, newStatus);
      setFeedbackMsg({ type: 'success', text: `Appointment status updated to '${newStatus}'` });
      loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to update appointment status' });
    }
  };

  // Open Assign Lawyer Modal
  const handleOpenAssignModal = (appt) => {
    setAssignModal({
      open: true,
      appt,
      lawyerId: appt.lawyer ? (appt.lawyer._id || appt.lawyer) : '',
    });
  };

  const handleExecuteAssignLawyer = async (e) => {
    e.preventDefault();
    if (!assignModal.lawyerId) {
      setFeedbackMsg({ type: 'error', text: 'Please select a lawyer from the roster.' });
      return;
    }
    try {
      setAssignLoading(true);
      await assignLawyerToAppointment(assignModal.appt._id, assignModal.lawyerId);
      setFeedbackMsg({ type: 'success', text: 'Lawyer assigned to appointment successfully.' });
      setAssignModal({ open: false, appt: null, lawyerId: '' });
      loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to assign lawyer' });
    } finally {
      setAssignLoading(false);
    }
  };

  // Open Reschedule Modal
  const handleOpenRescheduleModal = (appt) => {
    setRescheduleModal({
      open: true,
      appt,
      date: appt.appointmentDate || '',
      time: appt.appointmentTime || '10:00 AM',
    });
  };

  const handleExecuteReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleModal.date || !rescheduleModal.time) {
      setFeedbackMsg({ type: 'error', text: 'Both appointment date and time slot are required.' });
      return;
    }
    try {
      setRescheduleLoading(true);
      await rescheduleAppointment(rescheduleModal.appt._id, rescheduleModal.date, rescheduleModal.time);
      setFeedbackMsg({ type: 'success', text: 'Appointment rescheduled and synchronized with Client Portal.' });
      setRescheduleModal({ open: false, appt: null, date: '', time: '' });
      loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to reschedule appointment' });
    } finally {
      setRescheduleLoading(false);
    }
  };

  // Open Cancel Modal
  const handleExecuteCancel = async () => {
    if (!cancelModal.appt) return;
    try {
      setCancelLoading(true);
      await updateAppointmentStatus(cancelModal.appt._id, 'cancelled');
      setFeedbackMsg({ type: 'success', text: 'Appointment cancelled.' });
      setCancelModal({ open: false, appt: null });
      loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to cancel appointment' });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Consultation & Appointment Operations</h1>
          <p style={{ color: '#64748B', margin: 0 }}>
            Approve, assign attorneys, reschedule, or cancel client legal consultation sessions
          </p>
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
            placeholder="Search client, title, practice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="admin-select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed / Approved</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select className="admin-select-input" value={lawyerFilter} onChange={(e) => setLawyerFilter(e.target.value)}>
            <option value="">All Lawyers</option>
            {lawyers.map((l) => (
              <option key={l._id} value={l._id}>
                {l.fullName} ({l.specialization || 'Lawyer'})
              </option>
            ))}
          </select>

          {(search || statusFilter || lawyerFilter) && (
            <button
              className="admin-btn admin-btn-outline"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setLawyerFilter('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="admin-loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading appointment schedule...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📅</div>
            <div className="admin-empty-title">No appointments found</div>
            <p>Try adjusting your search filter criteria.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Consultation Title</th>
                  <th>Date & Time</th>
                  <th>Assigned Lawyer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{appt.client?.fullName || 'Client User'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{appt.client?.email || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{appt.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{appt.appointmentType || 'General Practice'}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {appt.appointmentDate} <br />
                      <span style={{ color: '#64748B' }}>{appt.appointmentTime}</span>
                    </td>
                    <td>
                      {appt.lawyer ? (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>{appt.lawyer.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{appt.lawyer.specialization || 'Lawyer'}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${appt.status}`}>{appt.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          onClick={() => setSelectedAppt(appt)}
                        >
                          Details
                        </button>
                        <button
                          className="admin-btn admin-btn-gold admin-btn-sm"
                          onClick={() => handleOpenAssignModal(appt)}
                        >
                          Assign
                        </button>
                        <button
                          className="admin-btn admin-btn-primary admin-btn-sm"
                          onClick={() => handleOpenRescheduleModal(appt)}
                        >
                          Reschedule
                        </button>

                        {appt.status === 'pending' && (
                          <button
                            className="admin-btn admin-btn-sm"
                            style={{ backgroundColor: '#10B981', color: '#FFF' }}
                            onClick={() => handleStatusChange(appt._id, 'confirmed')}
                          >
                            Approve
                          </button>
                        )}

                        {appt.status !== 'cancelled' && (
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setCancelModal({ open: true, appt })}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Consultation Overview Details</h3>
              <button className="admin-modal-close" onClick={() => setSelectedAppt(null)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="admin-form-label">Client Name</label>
                  <div style={{ fontWeight: 600 }}>{selectedAppt.client?.fullName || 'Client'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedAppt.client?.email}</div>
                </div>
                <div>
                  <label className="admin-form-label">Assigned Attorney</label>
                  <div style={{ fontWeight: 600, color: selectedAppt.lawyer ? '#0F172A' : '#DC2626' }}>
                    {selectedAppt.lawyer?.fullName || 'Unassigned'}
                  </div>
                  {selectedAppt.lawyer?.email && (
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedAppt.lawyer.email}</div>
                  )}
                </div>
                <div>
                  <label className="admin-form-label">Title / Practice Area</label>
                  <div style={{ fontWeight: 600 }}>{selectedAppt.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#D4AF37' }}>{selectedAppt.appointmentType}</div>
                </div>
                <div>
                  <label className="admin-form-label">Date & Time Slot</label>
                  <div style={{ fontWeight: 600 }}>{selectedAppt.appointmentDate}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedAppt.appointmentTime}</div>
                </div>
                <div>
                  <label className="admin-form-label">Current Status</label>
                  <span className={`admin-badge ${selectedAppt.status}`}>{selectedAppt.status}</span>
                </div>
                <div>
                  <label className="admin-form-label">Booking Date</label>
                  <div style={{ fontSize: '0.85rem' }}>
                    {selectedAppt.createdAt ? new Date(selectedAppt.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>

              {selectedAppt.notes && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Intake Notes / Legal Concern</label>
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#334155',
                    }}
                  >
                    {selectedAppt.notes}
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setSelectedAppt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Lawyer Modal */}
      {assignModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '460px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Assign Attorney to Consultation</h3>
              <button className="admin-modal-close" onClick={() => setAssignModal({ open: false, appt: null, lawyerId: '' })}>
                ✕
              </button>
            </div>
            <form onSubmit={handleExecuteAssignLawyer}>
              <div className="admin-modal-body">
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>
                  Select a real attorney from your firm roster to assign to consultation{' '}
                  <strong>"{assignModal.appt?.title}"</strong>.
                </p>

                <div className="admin-form-group">
                  <label className="admin-form-label">Select Attorney *</label>
                  <select
                    className="admin-form-select"
                    value={assignModal.lawyerId}
                    onChange={(e) => setAssignModal({ ...assignModal, lawyerId: e.target.value })}
                  >
                    <option value="">-- Choose Attorney --</option>
                    {lawyers.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.fullName} — {l.specialization || 'General Practice'} ({l.availabilityStatus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => setAssignModal({ open: false, appt: null, lawyerId: '' })}
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-gold" disabled={assignLoading}>
                  {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '460px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Reschedule Consultation</h3>
              <button
                className="admin-modal-close"
                onClick={() => setRescheduleModal({ open: false, appt: null, date: '', time: '' })}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleExecuteReschedule}>
              <div className="admin-modal-body">
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>
                  Reschedule consultation for <strong>"{rescheduleModal.appt?.title}"</strong>. Server will check attorney
                  availability conflicts automatically.
                </p>

                <div className="admin-form-group">
                  <label className="admin-form-label">New Date *</label>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={rescheduleModal.date}
                    onChange={(e) => setRescheduleModal({ ...rescheduleModal, date: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">New Time Slot *</label>
                  <select
                    className="admin-form-select"
                    value={rescheduleModal.time}
                    onChange={(e) => setRescheduleModal({ ...rescheduleModal, time: e.target.value })}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => setRescheduleModal({ open: false, appt: null, date: '', time: '' })}
                  disabled={rescheduleLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={rescheduleLoading}>
                  {rescheduleLoading ? 'Checking Availability...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '420px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Appointment Cancellation</h3>
              <button className="admin-modal-close" onClick={() => setCancelModal({ open: false, appt: null })}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to cancel the appointment for <strong>"{cancelModal.appt?.title}"</strong> booked by{' '}
                <strong>{cancelModal.appt?.client?.fullName}</strong>?
              </p>
              <p style={{ fontSize: '0.85rem', color: '#DC2626' }}>
                ⚠️ This will update the database status to 'cancelled' and synchronize immediately with the Client Portal.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setCancelModal({ open: false, appt: null })}
                disabled={cancelLoading}
              >
                Keep Appointment
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleExecuteCancel} disabled={cancelLoading}>
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
