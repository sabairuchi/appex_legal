import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CaptchaWidget from '../../components/CaptchaWidget';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password, captchaToken });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
          <h1>Client Portal Login</h1>
          <p>Access your confidential legal dashboard & case communications</p>
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
            <h2 style={{ fontSize: '28px', color: 'var(--navy-primary)', marginBottom: '8px', textAlign: 'center' }}>
              Sign In to Your Account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-pillar)', marginBottom: '30px', textAlign: 'center' }}>
              Enter your credentials to manage your legal matters safely.
            </p>

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

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor="password" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', margin: 0 }}>
                    Password
                  </label>
                  <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--gold-accent)', fontWeight: '600' }}>
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>

              <CaptchaWidget onVerify={(token) => setCaptchaToken(token)} />

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                {submitting ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'var(--gray-pillar)' }}>
              Don't have a client account?{' '}
              <Link to="/register" style={{ color: 'var(--gold-accent)', fontWeight: '600' }}>
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
