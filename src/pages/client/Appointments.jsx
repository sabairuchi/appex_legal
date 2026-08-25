import React, { useState, useEffect } from 'react';
import { fetchAppointments, createAppointment } from '../../services/clientApi';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    appointmentType: 'General Legal Consultation',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAppointments();
      setAppointments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('[Appointments Fetch Error]:', err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      await createAppointment(formData);
      setShowModal(false);
      setFormData({
        title: '',
        appointmentType: 'General Legal Consultation',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
      });
      loadAppointments(); // Refresh list
    } catch (err) {
      console.error('[Appointment Creation Error]:', err);
      setModalError(err.message || 'Failed to submit appointment request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="portal-card" style={{ padding: '30px' }}>
        <div className="skeleton" style={{ height: '30px', width: '30%', marginBottom: '20px' }}></div>
        <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '15px' }}></div>
        <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '15px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header Bar */}
      <div className="portal-card" style={{ borderTopColor: 'var(--gold-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="portal-card-title" style={{ fontSize: '24px' }}>Client Consultations & Calendar</h2>
            <p style={{ color: 'var(--gray-pillar)', fontSize: '14px', margin: 0 }}>
              Manage your legal consultation requests and confirmed lawyer meetings.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '14px' }}
          >
            + Request Consultation
          </button>
        </div>
      </div>

      {error ? (
        <div style={{ padding: '16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      ) : null}

      {/* Appointments List / Table */}
      <div className="portal-card">
        {appointments.length > 0 ? (
          <div className="portal-table-wrapper">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Consultation Title</th>
                  <th>Date & Time</th>
                  <th>Lawyer</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong style={{ color: 'var(--navy-primary)' }}>{app.title}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy-dark)' }}>🗓️ {app.appointmentDate}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-pillar)' }}>⏰ {app.appointmentTime}</div>
                    </td>
                    <td>
                      {app.lawyer ? (
                        <div>
                          <strong style={{ color: 'var(--navy-primary)' }}>{app.lawyer.fullName}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--gold-accent)' }}>{app.lawyer.email}</div>
                        </div>
                      ) : (
                        <span style={{ fontStyle: 'italic', color: 'var(--gray-light)' }}>Unassigned (Pending intake)</span>
                      )}
                    </td>
                    <td>{app.appointmentType}</td>
                    <td>
                      <span className={`status-pill ${app.status}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--gray-pillar)', maxWidth: '240px' }}>
                      {app.notes || 'No specific notes'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div className="empty-state-icon">📅</div>
            <h3 className="empty-state-title">No Appointments Found</h3>
            <p className="empty-state-desc">
              You currently have no scheduled appointments or pending consultation requests.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              Request a Legal Consultation
            </button>
          </div>
        )}
      </div>

      {/* Appointment Creation Modal */}
      {showModal ? (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy-primary)', margin: 0 }}>
                Request Consultation
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-pillar)' }}
              >
                ×
              </button>
            </div>

            {modalError ? (
              <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                ⚠️ {modalError}
              </div>
            ) : null}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                  Consultation Subject / Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Corporate Contract Review Consultation"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                  Practice Area / Consultation Type
                </label>
                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFF' }}
                >
                  <option value="General Legal Consultation">General Legal Consultation</option>
                  <option value="Corporate & M&A">Corporate & M&A</option>
                  <option value="Commercial Litigation">Commercial Litigation</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Employment & Labor Law">Employment & Labor Law</option>
                  <option value="Real Estate & Property">Real Estate & Property</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                  Consultation Notes / Description
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Provide background context for your consultation..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px', fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '14px', borderColor: '#CBD5E1', color: 'var(--gray-pillar)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '14px' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

    </div>
  );
}
