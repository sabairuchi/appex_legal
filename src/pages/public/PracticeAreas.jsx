import React from 'react';
import { Link } from 'react-router-dom';

export default function PracticeAreas() {
  return (
    <main id="main">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container reveal">
          <h1>Our Practice Areas</h1>
          <p>Comprehensive legal solutions across all disciplines</p>
        </div>
      </section>

      {/* 1. Corporate Law */}
      <section id="corporate" className="practice-detail-section">
        <div className="container practice-detail-container reveal">
          <div className="practice-image">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" alt="Corporate Law" loading="lazy" />
          </div>
          <div className="practice-content">
            <div className="practice-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <h2>Corporate Law</h2>
            </div>
            <p>We provide comprehensive corporate legal services, offering strategic counsel to businesses of all sizes. From initial formation and structure to complex mergers and acquisitions, our team acts as trusted advisors.</p>
            <div className="what-we-handle">
              <h4>What We Handle:</h4>
              <ul>
                <li>Business Formation</li>
                <li>Mergers & Acquisitions</li>
                <li>Contract Drafting</li>
                <li>Regulatory Compliance</li>
                <li>Board Advisory</li>
              </ul>
            </div>
            <Link to="/contact" className="btn-link">Consult on This Matter →</Link>
          </div>
        </div>
      </section>

      {/* 2. Litigation */}
      <section id="litigation" className="practice-detail-section">
        <div className="container practice-detail-container reveal">
          <div className="practice-image">
            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" alt="Litigation" loading="lazy" />
          </div>
          <div className="practice-content">
            <div className="practice-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 13.5V16.5l-4 4-4-4v-3L10 9.5l4 4z"></path><path d="M14 13.5l4-4 4 4-4 4-4-4z"></path><path d="M2.5 21.5l3.5-3.5"></path></svg>
              <h2>Litigation & Dispute Resolution</h2>
            </div>
            <p>When disputes arise, our litigators provide aggressive, strategic representation. We handle high-stakes commercial disputes in federal and state courts, as well as alternative dispute resolution.</p>
            <div className="what-we-handle">
              <h4>What We Handle:</h4>
              <ul>
                <li>Commercial Litigation</li>
                <li>Arbitration</li>
                <li>Mediation</li>
                <li>Appeals</li>
                <li>Class Actions</li>
              </ul>
            </div>
            <Link to="/contact" className="btn-link">Consult on This Matter →</Link>
          </div>
        </div>
      </section>

      {/* 3. Real Estate */}
      <section id="real-estate" className="practice-detail-section">
        <div className="container practice-detail-container reveal">
          <div className="practice-image">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" alt="Real Estate" loading="lazy" />
          </div>
          <div className="practice-content">
            <div className="practice-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v20"></path><path d="M2 22h20"></path><path d="M10 12v10"></path></svg>
              <h2>Real Estate Law</h2>
            </div>
            <p>Our real estate attorneys navigate the complexities of commercial and residential property law, ensuring seamless transactions and robust protection in land disputes.</p>
            <div className="what-we-handle">
              <h4>What We Handle:</h4>
              <ul>
                <li>Property Transactions</li>
                <li>Title Disputes</li>
                <li>Zoning & Land Use</li>
                <li>Commercial Leasing</li>
                <li>HOA Disputes</li>
              </ul>
            </div>
            <Link to="/contact" className="btn-link">Consult on This Matter →</Link>
          </div>
        </div>
      </section>

      {/* 4. Family Law */}
      <section id="family" className="practice-detail-section">
        <div className="container practice-detail-container reveal">
          <div className="practice-image">
            <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop" alt="Family Law" loading="lazy" />
          </div>
          <div className="practice-content">
            <div className="practice-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <h2>Family Law</h2>
            </div>
            <p>We handle sensitive family matters with discretion, empathy, and strong advocacy, protecting your rights and your family's future during critical transitions.</p>
            <div className="what-we-handle">
              <h4>What We Handle:</h4>
              <ul>
                <li>Divorce & Separation</li>
                <li>Child Custody</li>
                <li>Alimony</li>
                <li>Adoption</li>
                <li>Prenuptial Agreements</li>
              </ul>
            </div>
            <Link to="/contact" className="btn-link">Consult on This Matter →</Link>
          </div>
        </div>
      </section>

      {/* 5. Criminal Defense */}
      <section id="criminal" className="practice-detail-section">
        <div className="container practice-detail-container reveal">
          <div className="practice-image">
            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" alt="Criminal Defense" loading="lazy" />
          </div>
          <div className="practice-content">
            <div className="practice-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <h2>Criminal Defense</h2>
            </div>
            <p>Facing criminal charges requires immediate, powerful representation. Our experienced defense attorneys protect your constitutional rights and vigorously fight for your freedom.</p>
            <div className="what-we-handle">
              <h4>What We Handle:</h4>
              <ul>
                <li>Federal Defense</li>
                <li>White Collar Crime</li>
                <li>DUI/DWI</li>
                <li>Appeals</li>
                <li>Juvenile Defense</li>
              </ul>
            </div>
            <Link to="/contact" className="btn-link">Consult on This Matter →</Link>
          </div>
        </div>
      </section>

      {/* 6. Estate Planning */}
      <section id="estate" className="practice-detail-section">
        <div className="container practice-detail-container reveal">
          <div className="practice-image">
            <img src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop" alt="Estate Planning" loading="lazy" />
          </div>
          <div className="practice-content">
            <div className="practice-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h2>Estate Planning & Probate</h2>
            </div>
            <p>Securing your legacy requires careful planning. We assist individuals and families in creating comprehensive estate plans that protect assets and provide peace of mind for future generations.</p>
            <div className="what-we-handle">
              <h4>What We Handle:</h4>
              <ul>
                <li>Wills & Trusts</li>
                <li>Probate Administration</li>
                <li>Power of Attorney</li>
                <li>Asset Protection</li>
                <li>Living Wills</li>
              </ul>
            </div>
            <Link to="/contact" className="btn-link">Consult on This Matter →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
