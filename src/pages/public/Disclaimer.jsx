import React from 'react';

export default function Disclaimer() {
  return (
    <main id="main">
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        padding: '160px 0 100px',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container reveal">
          <h1>Disclaimer</h1>
          <p>Legal Notice & Attorney Advertising Disclosure</p>
        </div>
      </section>

      <section className="legal-content" style={{ padding: '100px 0', backgroundColor: 'var(--white)' }}>
        <div className="container legal-content-container reveal" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>Legal Notice</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            The information contained on this website is for general guidance on matters of interest only. The application and impact of laws can vary widely based on the specific facts involved. Given the changing nature of laws, rules, and regulations, there may be delays, omissions, or inaccuracies in information contained in this site.
          </p>
          
          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>Attorney Advertising</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            This website may contain attorney advertising. Prior results do not guarantee a similar outcome. Case results depicted on this website depend on a variety of factors unique to each case.
          </p>

          <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--navy-primary)' }}>Jurisdictional Statement</h2>
          <p style={{ marginBottom: '20px', color: 'var(--gray-pillar)', lineHeight: '1.8' }}>
            Our attorneys are licensed to practice law in specific jurisdictions as noted in their respective biographies. Apex LEGAL PARTNER does not seek to represent anyone desiring representation based upon viewing this website in a state where this site fails to comply with all laws and ethical rules of that state.
          </p>
        </div>
      </section>
    </main>
  );
}
