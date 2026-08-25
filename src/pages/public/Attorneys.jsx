import React from 'react';
import { Link } from 'react-router-dom';

export default function Attorneys() {
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
          <h1>Meet Our Legal Team</h1>
          <p>Unmatched expertise and steadfast dedication.</p>
        </div>
      </section>

      {/* Attorneys Section */}
      <section className="attorneys-section" style={{ padding: '100px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container reveal">
          <div className="attorneys-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            
            <div className="attorney-card" style={{ background: 'var(--white)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <img className="attorney-image" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Matt Ridley" loading="lazy" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              <div className="attorney-info" style={{ padding: '30px 20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-primary)', fontSize: '24px', marginBottom: '5px' }}>Matt Ridley</h3>
                <div className="title" style={{ color: 'var(--gold-accent)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontWeight: '600' }}>Managing Partner</div>
                <p style={{ color: 'var(--gray-pillar)', fontSize: '15px', marginBottom: '20px', lineHeight: '1.6' }}>With over 20 years of experience in corporate litigation, Matt has successfully led Apex LEGAL PARTNER to numerous landmark victories. He focuses on complex commercial disputes.</p>
                <Link to="/contact" className="btn-link">Contact Matt →</Link>
              </div>
            </div>

            <div className="attorney-card" style={{ background: 'var(--white)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <img className="attorney-image" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Sarah Jenkins" loading="lazy" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              <div className="attorney-info" style={{ padding: '30px 20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-primary)', fontSize: '24px', marginBottom: '5px' }}>Sarah Jenkins</h3>
                <div className="title" style={{ color: 'var(--gold-accent)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontWeight: '600' }}>Senior Partner</div>
                <p style={{ color: 'var(--gray-pillar)', fontSize: '15px', marginBottom: '20px', lineHeight: '1.6' }}>Sarah is a recognized expert in family law and estate planning. Her compassionate approach and fierce advocacy ensure clients receive the best possible outcomes.</p>
                <Link to="/contact" className="btn-link">Contact Sarah →</Link>
              </div>
            </div>

            <div className="attorney-card" style={{ background: 'var(--white)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <img className="attorney-image" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" alt="James Lawson" loading="lazy" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              <div className="attorney-info" style={{ padding: '30px 20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-primary)', fontSize: '24px', marginBottom: '5px' }}>James Lawson</h3>
                <div className="title" style={{ color: 'var(--gold-accent)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontWeight: '600' }}>Partner</div>
                <p style={{ color: 'var(--gray-pillar)', fontSize: '15px', marginBottom: '20px', lineHeight: '1.6' }}>James leads our criminal defense practice. A former state prosecutor, he brings invaluable insight into the justice system and relentlessly defends his clients' rights.</p>
                <Link to="/contact" className="btn-link">Contact James →</Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
