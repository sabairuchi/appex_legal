import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    practiceArea: '',
    message: ''
  });
  const [status, setStatus] = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ message: 'Please fill out all required fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setStatus({ message: '', type: '' });

    setTimeout(() => {
      setStatus({
        message: 'Thank you! Your message has been sent successfully. We will contact you shortly.',
        type: 'success'
      });
      setFormData({ name: '', email: '', phone: '', practiceArea: '', message: '' });
      setSubmitting(false);

      setTimeout(() => {
        setStatus({ message: '', type: '' });
      }, 5000);
    }, 1500);
  };

  return (
    <main id="main">
      {/* Page Hero */}
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        background: "linear-gradient(135deg, rgba(27, 42, 74, 0.95) 0%, rgba(13, 27, 42, 0.95) 100%), url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat",
        padding: '160px 0 100px',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container reveal">
          <h1>Get in Touch</h1>
          <p>Schedule a confidential consultation with our attorneys.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" style={{ padding: '100px 0', backgroundColor: 'var(--white)' }}>
        <div className="container contact-container reveal" style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div className="contact-info" style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '36px', color: 'var(--navy-primary)', marginBottom: '25px' }}>We Are Here to Help</h2>
            <p style={{ fontSize: '16px', color: 'var(--gray-pillar)', marginBottom: '30px', lineHeight: '1.8' }}>
              Whether you're facing a complex corporate dispute or need personal legal guidance, our team is ready to listen. Contact us today to discuss how we can assist you.
            </p>
            
            <div className="contact-details" style={{ marginBottom: '40px' }}>
              <div className="contact-item" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px', gap: '15px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px', color: 'var(--gold-accent)', flexShrink: 0, marginTop: '5px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--navy-primary)', marginBottom: '5px' }}>Office Location</h4>
                  <p style={{ margin: 0, fontSize: '15px', color: 'var(--gray-pillar)' }}>123 Justice Ave, Suite 900<br />New York, NY 10001</p>
                </div>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px', gap: '15px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px', color: 'var(--gold-accent)', flexShrink: 0, marginTop: '5px' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--navy-primary)', marginBottom: '5px' }}>Phone</h4>
                  <p style={{ margin: 0, fontSize: '15px', color: 'var(--gray-pillar)' }}>+1 (800) APEX-LAW<br />+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="contact-item" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px', gap: '15px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px', color: 'var(--gold-accent)', flexShrink: 0, marginTop: '5px' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--navy-primary)', marginBottom: '5px' }}>Email</h4>
                  <p style={{ margin: 0, fontSize: '15px', color: 'var(--gray-pillar)' }}>consultations@apexlegal.com<br />info@apexlegal.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container" style={{ flex: 1, minWidth: '300px', background: 'var(--off-white)', padding: '40px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="practice-area" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>Area of Interest</label>
                <select
                  id="practice-area"
                  name="practiceArea"
                  className="form-control"
                  value={formData.practiceArea}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px' }}
                >
                  <option value="">Select a practice area...</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="litigation">Litigation</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="family">Family Law</option>
                  <option value="criminal">Criminal Defense</option>
                  <option value="estate">Estate Planning</option>
                  <option value="other">Other / Not Sure</option>
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="message" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '8px' }}>How can we help you?</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  required
                  placeholder="Briefly describe your situation..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px', minHeight: '120px' }}
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {status.message && (
                <div
                  className={`form-message ${status.type}`}
                  style={{
                    padding: '15px',
                    marginTop: '20px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    backgroundColor: status.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                    color: status.type === 'success' ? '#065F46' : '#991B1B',
                    border: `1px solid ${status.type === 'success' ? '#34D399' : '#F87171'}`
                  }}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
