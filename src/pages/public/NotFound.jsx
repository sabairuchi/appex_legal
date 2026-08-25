import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="main">
      <section className="page-hero" style={{
        backgroundColor: 'var(--navy-primary)',
        padding: '160px 0 100px',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container reveal">
          <h1 style={{ fontSize: '72px', color: 'var(--gold-accent)', marginBottom: '10px' }}>404</h1>
          <h2>Page Not Found</h2>
          <p style={{ marginTop: '15px' }}>The page you are looking for does not exist or has been moved.</p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/" className="btn btn-primary">Return to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
