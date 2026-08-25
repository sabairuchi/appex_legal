import React from 'react';

export default function TermsOfService() {
  return (
    <main id="main">
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        padding: '160px 0 100px',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container reveal">
          <h1>Terms of Service</h1>
          <p>Last Updated: October 2024</p>
        </div>
      </section>

      <section className="legal-content" style={{ padding: '100px 0', backgroundColor: 'var(--white)' }}>
        <div className="container legal-content-container reveal" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>2. No Attorney-Client Relationship</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            The materials on this website are provided for informational purposes only and do not constitute legal advice. Transmitting information through this site or communicating with Apex LEGAL PARTNER via email does not create an attorney-client relationship.
          </p>

          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>3. Intellectual Property Rights</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            All content, trademarks, logos, and graphics on this website are the property of Apex LEGAL PARTNER or its content suppliers and are protected by applicable copyright and intellectual property laws.
          </p>

          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>4. Limitation of Liability</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            In no event shall Apex LEGAL PARTNER be liable for any damages arising out of the use or inability to use the materials on this website, even if notified orally or in writing of the possibility of such damage.
          </p>
        </div>
      </section>
    </main>
  );
}
