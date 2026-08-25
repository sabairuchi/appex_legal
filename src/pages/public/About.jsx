import React from 'react';

export default function About() {
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
          <h1>Our History & Values</h1>
          <p>A legacy of excellence and relentless advocacy.</p>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" style={{ padding: '100px 0', backgroundColor: 'var(--white)' }}>
        <div className="container about-container reveal" style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
          <div className="about-image" style={{ flex: 1, position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=800&auto=format&fit=crop" alt="Law Firm Office" loading="lazy" style={{ borderRadius: '4px' }} />
          </div>
          <div className="about-content" style={{ flex: 1 }}>
            <h2 style={{ fontSize: '36px', color: 'var(--navy-primary)', marginBottom: '25px' }}>Committed to Justice, Dedicated to You</h2>
            <p style={{ fontSize: '16px', color: 'var(--gray-pillar)', marginBottom: '20px', lineHeight: '1.8' }}>
              Founded in 1999, Apex LEGAL PARTNER was built on a simple premise: provide top-tier legal representation with the personalized attention our clients deserve. For over two decades, our firm has successfully navigated complex legal landscapes, securing landmark victories and favorable settlements for individuals, families, and corporations.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--gray-pillar)', marginBottom: '20px', lineHeight: '1.8' }}>
              Our approach combines rigorous legal analysis with aggressive advocacy. We understand that every case is unique, and we tailor our strategies to meet the specific goals of each client. At Apex LEGAL PARTNER, you're not just another case file—you're a priority.
            </p>
            
            <div className="about-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '40px' }}>
              <div className="stat-box" style={{ borderLeft: '3px solid var(--gold-accent)', paddingLeft: '20px' }}>
                <div className="stat-number" style={{ fontSize: '36px', color: 'var(--navy-primary)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>25+</div>
                <div>Years of Excellence</div>
              </div>
              <div className="stat-box" style={{ borderLeft: '3px solid var(--gold-accent)', paddingLeft: '20px' }}>
                <div className="stat-number" style={{ fontSize: '36px', color: 'var(--navy-primary)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>$150M+</div>
                <div>Recovered for Clients</div>
              </div>
              <div className="stat-box" style={{ borderLeft: '3px solid var(--gold-accent)', paddingLeft: '20px' }}>
                <div className="stat-number" style={{ fontSize: '36px', color: 'var(--navy-primary)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>98%</div>
                <div>Success Rate</div>
              </div>
              <div className="stat-box" style={{ borderLeft: '3px solid var(--gold-accent)', paddingLeft: '20px' }}>
                <div className="stat-number" style={{ fontSize: '36px', color: 'var(--navy-primary)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>5k+</div>
                <div>Cases Handled</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
