import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CaptchaWidget from '../../components/CaptchaWidget';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSubmitting(true);
      await register({ fullName, email, password, confirmPassword, captchaToken });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1>Client Registration</h1>
          <p>Create your private account to manage legal consultations & documentation</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '550px', margin: '0 auto' }}>
          <div style={{
            background: 'var(--off-white)',
            padding: '40px',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderTop: '4px solid var(--gold-accent)'
          }}>
            <h2 style={{ fontSize: '28px', color: 'var(--navy-primary)', marginBottom: '8px', textAlign: 'center' }}>
              Create Your Client Account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-pillar)', marginBottom: '30px', textAlign: 'center' }}>
              Register below for secure access to our legal portal.
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
                <label htmlFor="fullName" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  required
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                  Password * (Min 8 characters)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>

              <CaptchaWidget onVerify={(token) => setCaptchaToken(token)} />

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                {submitting ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>

            <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'var(--gray-pillar)' }}>
              Already have an account?{' '}
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
