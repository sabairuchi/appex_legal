import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main id="main">
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        padding: '160px 0 100px',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container reveal">
          <h1>Privacy Policy</h1>
          <p>Last Updated: October 2024</p>
        </div>
      </section>

      <section className="legal-content" style={{ padding: '100px 0', backgroundColor: 'var(--white)' }}>
        <div className="container legal-content-container reveal" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            Apex LEGAL PARTNER collects information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device ("personal information"). We collect personal information when you contact us, visit our website, or use our legal services.
          </p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            We may use or disclose the personal information we collect for one or more of the following business purposes:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>To fulfill or meet the reason you provided the information.</li>
            <li style={{ marginBottom: '10px' }}>To provide, support, personalize, and develop our Website, products, and services.</li>
            <li style={{ marginBottom: '10px' }}>To create, maintain, customize, and secure your account with us.</li>
            <li style={{ marginBottom: '10px' }}>To respond to law enforcement requests and as required by applicable law, court order, or governmental regulations.</li>
          </ul>

          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>3. Data Security</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Website.
          </p>

          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>4. Contact Information</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            If you have any questions or comments about this notice, the ways in which Apex LEGAL PARTNER collects and uses your information, your choices and rights regarding such use, or wish to exercise your rights under law, please do not hesitate to contact us at:
          </p>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            Email: privacy@apexlegal.com<br />
            Phone: +1 (800) APEX-LAW<br />
            Address: 123 Justice Ave, Suite 900, New York, NY 10001
          </p>
        </div>
      </section>
    </main>
  );
}
