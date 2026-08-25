import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CaptchaWidget from '../../components/CaptchaWidget';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your registered email address');
      return;
    }

    try {
      setSubmitting(true);
      const res = await forgotPassword({ email, captchaToken });
      setMessage(res.message || 'If an account exists for this email, password reset instructions have been sent.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Request failed. Please try again.');
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
          <h1>Account Recovery</h1>
          <p>Request a secure password reset link for your account</p>
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
              Forgot Your Password?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-pillar)', marginBottom: '25px', textAlign: 'center' }}>
              Enter your email address below. If your account exists, we will transmit a confidential reset token.
            </p>

            {message && (
              <div style={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                border: '1px solid #34D399',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '600',
                lineHeight: '1.5'
              }}>
                ✉️ {message}
              </div>
            )}

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
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  required
                  autoComplete="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>

              <CaptchaWidget onVerify={(token) => setCaptchaToken(token)} />

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                {submitting ? 'Transmitting Request...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'var(--gray-pillar)' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: 'var(--gold-accent)', fontWeight: '600' }}>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
