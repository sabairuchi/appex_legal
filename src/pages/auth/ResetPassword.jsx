import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CaptchaWidget from '../../components/CaptchaWidget';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing from URL.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword({ token, password, confirmPassword, captchaToken });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Password reset failed. Token may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="main">
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        padding: '140px 0 80px',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container reveal">
          <h1>Set New Password</h1>
          <p>Establish a new password for your Apex Legal account</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{
            background: 'var(--off-white)',
            padding: '40px',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderTop: '4px solid var(--gold-accent)'
          }}>
            <h2 style={{ fontSize: '26px', color: 'var(--navy-primary)', marginBottom: '10px', textAlign: 'center' }}>
              Create New Password
            </h2>

            {!token && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                border: '1px solid #F87171',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ⚠️ Invalid Security Link: No password reset token was provided in the URL address.
              </div>
            )}

            {success ? (
              <div style={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                border: '1px solid #34D399',
                padding: '20px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#065F46' }}>✓ Password Reset Complete</h3>
                <p style={{ fontSize: '14px', marginBottom: '15px' }}>
                  Your password has been updated successfully. Redirecting you to sign in...
                </p>
                <Link to="/login" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  Sign In Now
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div style={{
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #F87171',
                    padding: '12px 15px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                      New Password * (Min 8 characters)
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                    />
                  </div>

                  <CaptchaWidget onVerify={(t) => setCaptchaToken(t)} />

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting || !token}>
                    {submitting ? 'Updating Password...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}

            <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'var(--gray-pillar)' }}>
              Back to{' '}
              <Link to="/login" style={{ color: 'var(--gold-accent)', fontWeight: '600' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
