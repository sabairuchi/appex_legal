import React, { useEffect, useState } from 'react';
import { fetchLawyers, createLawyer, updateLawyer, deactivateLawyer } from '../../services/adminApi';
import '../../styles/admin.css';

export default function LawyerManagement() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLawyerId, setSelectedLawyerId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    specialization: 'Corporate & M&A',
    experienceYears: '5',
    availabilityStatus: 'available',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Deactivate Modal state
  const [deactivateModal, setDeactivateModal] = useState({ open: false, lawyer: null });

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const data = await fetchLawyers();
      setLawyers(data);
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Error fetching lawyer directory' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Valid email address is required';
      }
    }
    if (isNaN(formData.experienceYears) || Number(formData.experienceYears) < 0) {
      errors.experienceYears = 'Years of experience must be a valid non-negative number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedLawyerId(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      bio: '',
      specialization: 'Corporate & M&A',
      experienceYears: '5',
      availabilityStatus: 'available',
      password: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (lawyer) => {
    setIsEditing(true);
    setSelectedLawyerId(lawyer._id);
    setFormData({
      fullName: lawyer.fullName || '',
      email: lawyer.email || '',
      phone: lawyer.phone || '',
      bio: lawyer.bio || '',
      specialization: lawyer.specialization || 'Corporate & M&A',
      experienceYears: lawyer.experienceYears !== undefined ? String(lawyer.experienceYears) : '5',
      availabilityStatus: lawyer.availabilityStatus || 'available',
      password: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      if (isEditing) {
        await updateLawyer(selectedLawyerId, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          specialization: formData.specialization,
          experienceYears: Number(formData.experienceYears),
          availabilityStatus: formData.availabilityStatus,
        });
        setFeedbackMsg({ type: 'success', text: `Attorney ${formData.fullName} profile updated successfully.` });
      } else {
        await createLawyer({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          specialization: formData.specialization,
          experienceYears: Number(formData.experienceYears),
          availabilityStatus: formData.availabilityStatus,
          password: formData.password || undefined,
        });
        setFeedbackMsg({ type: 'success', text: `Attorney ${formData.fullName} added to firm roster successfully.` });
      }
      setModalOpen(false);
      loadLawyers();
    } catch (err) {
      console.error('Save lawyer error:', err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to save attorney record' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateModal.lawyer) return;
    try {
      setSubmitLoading(true);
      await deactivateLawyer(deactivateModal.lawyer._id);
      setFeedbackMsg({ type: 'success', text: `Attorney ${deactivateModal.lawyer.fullName} has been deactivated.` });
      setDeactivateModal({ open: false, lawyer: null });
      loadLawyers();
    } catch (err) {
      console.error('Deactivate lawyer error:', err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to deactivate attorney' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Attorney Roster Management</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Add, update, and manage firm legal practitioners and practice areas</p>
        </div>
        <button className="admin-btn admin-btn-gold" onClick={handleOpenAddModal}>
          ➕ Add New Attorney
        </button>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="admin-loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading attorney directory...</p>
        </div>
      ) : lawyers.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon">⚖️</div>
            <div className="admin-empty-title">No attorney records found</div>
            <p>Add your firm's attorneys to enable appointment assignment and client portal synchronization.</p>
            <button className="admin-btn admin-btn-gold" style={{ marginTop: '1rem' }} onClick={handleOpenAddModal}>
              ➕ Add First Attorney
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {lawyers.map((lawyer) => (
            <div key={lawyer._id} className="admin-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#0B132B',
                      color: '#D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                    }}
                  >
                    {lawyer.fullName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{lawyer.fullName}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{lawyer.email}</span>
                  </div>
                </div>
                <span
                  className={`admin-badge ${
                    lawyer.availabilityStatus === 'available'
                      ? 'confirmed'
                      : lawyer.availabilityStatus === 'busy'
                      ? 'pending'
                      : 'cancelled'
                  }`}
                >
                  {lawyer.availabilityStatus ? lawyer.availabilityStatus.replace('_', ' ') : 'Available'}
                </span>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                  Specialization: <span style={{ color: '#D4AF37' }}>{lawyer.specialization || 'General Legal Practice'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Experience: {lawyer.experienceYears ?? 0} Years • Contact: {lawyer.phone || 'N/A'}
                </div>
              </div>

              {lawyer.bio && (
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#475569',
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {lawyer.bio}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleOpenEditModal(lawyer)}>
                  ✏️ Edit Profile
                </button>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => setDeactivateModal({ open: true, lawyer })}
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Attorney Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{isEditing ? 'Edit Attorney Profile' : 'Add New Attorney'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Full Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Attorney Sarah Jenkins, Esq."
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {formErrors.fullName && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem' }}>{formErrors.fullName}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Address *</label>
                    <input
                      type="email"
                      className="admin-form-input"
                      placeholder="sjenkins@apexlegal.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {formErrors.email && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem' }}>{formErrors.email}</div>}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone Number</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="+1 (555) 019-2831"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Specialization</label>
                    <select
                      className="admin-form-select"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    >
                      <option value="Corporate & M&A">Corporate & M&A</option>
                      <option value="Commercial Litigation">Commercial Litigation</option>
                      <option value="Intellectual Property">Intellectual Property</option>
                      <option value="Real Estate & Land Use">Real Estate & Land Use</option>
                      <option value="Employment & Labor">Employment & Labor</option>
                      <option value="Tax & Financial Law">Tax & Financial Law</option>
                      <option value="General Practice">General Practice</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Years of Experience</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      min="0"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    />
                    {formErrors.experienceYears && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.2rem' }}>{formErrors.experienceYears}</div>}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Availability Status</label>
                    <select
                      className="admin-form-select"
                      value={formData.availabilityStatus}
                      onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {!isEditing && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Initial Password (Optional)</label>
                    <input
                      type="password"
                      className="admin-form-input"
                      placeholder="Leave blank for auto-generated secure password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}

                <div className="admin-form-group">
                  <label className="admin-form-label">Professional Bio / Overview</label>
                  <textarea
                    className="admin-form-textarea"
                    rows="3"
                    placeholder="Brief background summary of the attorney's qualifications and case background..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalOpen(false)} disabled={submitLoading}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-gold" disabled={submitLoading}>
                  {submitLoading ? 'Saving...' : isEditing ? 'Update Attorney' : 'Create Attorney'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {deactivateModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '420px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Deactivation</h3>
              <button className="admin-modal-close" onClick={() => setDeactivateModal({ open: false, lawyer: null })}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to deactivate attorney <strong>{deactivateModal.lawyer?.fullName}</strong>?
              </p>
              <p style={{ fontSize: '0.85rem', color: '#DC2626' }}>
                ⚠️ The attorney's status will be set to inactive and their availability set to 'On Leave'.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setDeactivateModal({ open: false, lawyer: null })}
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleConfirmDeactivate} disabled={submitLoading}>
                {submitLoading ? 'Processing...' : 'Confirm Deactivation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
