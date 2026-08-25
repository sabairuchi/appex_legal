import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchProfile, updateProfile, uploadProfileImage } from '../../services/clientApi';

export default function Profile() {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: '',
    role: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfile();
      setProfileData({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        profileImage: data.profileImage || '',
        role: data.role || 'client',
      });
    } catch (err) {
      console.error('[Profile Load Error]:', err);
      setError(err.message || 'Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await updateProfile({
        fullName: profileData.fullName,
        phone: profileData.phone,
        bio: profileData.bio,
      });

      setMessage('Profile information updated successfully');
      setProfileData((prev) => ({ ...prev, ...res.user }));
      window.location.reload(); // Refresh auth context session state
    } catch (err) {
      console.error('[Profile Update Error]:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setMessage(null);
    setError(null);

    try {
      const res = await uploadProfileImage(file);
      setProfileData((prev) => ({ ...prev, profileImage: res.profileImage }));
      setMessage('Profile picture updated successfully');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('[Image Upload Error]:', err);
      setError(err.message || 'Failed to upload profile image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="portal-card" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '30px', width: '40%', marginBottom: '20px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '40px' }}></div>
        <div className="skeleton" style={{ height: '50px', width: '100%', marginBottom: '20px' }}></div>
        <div className="skeleton" style={{ height: '50px', width: '100%', marginBottom: '20px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="portal-card">
        <div className="portal-card-header">
          <h2 className="portal-card-title">Client Profile Settings</h2>
          <span className="status-pill active">Role: {profileData.role.toUpperCase()}</span>
        </div>

        {message ? (
          <div style={{ padding: '12px 16px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', border: '1px solid #A7F3D0' }}>
            ✓ {message}
          </div>
        ) : null}

        {error ? (
          <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', border: '1px solid #FCA5A5' }}>
            ⚠️ {error}
          </div>
        ) : null}

        {/* Profile Picture Upload Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '24px',
          backgroundColor: 'var(--off-white)',
          borderRadius: '6px',
          border: '1px solid #E2E8F0',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
              alt={profileData.fullName}
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold-accent)' }}
            />
          ) : (
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--navy-primary)',
              color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', fontWeight: 'bold', border: '3px solid var(--gold-accent)'
            }}>
              {profileData.fullName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '16px', color: 'var(--navy-primary)', marginBottom: '4px' }}>Profile Avatar</h3>
            <p style={{ fontSize: '13px', color: 'var(--gray-pillar)', marginBottom: '12px' }}>
              Upload a clear professional photo (JPG, PNG, WEBP - Max 5MB).
            </p>
            <label className="btn btn-outline" style={{
              padding: '8px 16px', fontSize: '13px', cursor: uploadingImage ? 'not-allowed' : 'pointer',
              borderColor: 'var(--navy-primary)', color: 'var(--navy-primary)', display: 'inline-block'
            }}>
              {uploadingImage ? 'Uploading Image...' : '📷 Choose New Picture'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploadingImage}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Personal Details Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '6px' }}>
              Full Legal Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #CBD5E1',
                fontSize: '15px', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '6px' }}>
              Account Email Address (Read-Only for Security)
            </label>
            <input
              type="email"
              value={profileData.email}
              disabled
              readOnly
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #E2E8F0',
                backgroundColor: '#F1F5F9', color: 'var(--gray-pillar)', fontSize: '15px', cursor: 'not-allowed'
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--gray-pillar)', marginTop: '4px', display: 'block' }}>
              🔒 Email changes require formal identity verification with Apex Legal administration.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '6px' }}>
              Contact Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={profileData.phone}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #CBD5E1',
                fontSize: '15px', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '6px' }}>
              Client Notes & Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              placeholder="Brief notes about your case preferences, preferred communication hours, or legal scope."
              value={profileData.bio}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #CBD5E1',
                fontSize: '15px', outline: 'none', fontFamily: 'var(--font-body)'
              }}
            />
          </div>

          <div style={{ paddingTop: '15px', borderTop: '1px solid var(--gray-bg)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              {saving ? 'Saving Changes...' : '💾 Save Profile Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
