import React from 'react';
import { Link } from 'react-router-dom';
import StatCounter from '../../components/StatCounter';

export default function Home() {
  return (
    <main id="main">
      {/* Hero Section */}
      <section className="hero">
        <div className="container reveal">
          <div className="eyebrow">Advice. Advocacy. Results.</div>
          <h1>Trusted Legal Representation When It Matters Most</h1>
          <p>At Apex LEGAL PARTNER, we combine decades of courtroom experience with personalized counsel to protect what matters to you.</p>
          <div className="hero-cta">
            <Link to="/contact" className="btn btn-primary">Schedule a Consultation</Link>
            <Link to="/practice-areas" className="btn btn-outline">Our Practice Areas</Link>
          </div>
        </div>
        <div className="scroll-indicator">
          ↓ Scroll to Discover
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats">
        <div className="container reveal">
          <StatCounter value="25+" label="Years Experience" />
          <StatCounter value="1200+" label="Cases Handled" />
          <StatCounter value="98%" label="Success Rate" />
          <StatCounter value="50+" label="Practice Areas" />
        </div>
      </section>

      {/* About Section */}
      <section className="section about">
        <div className="container reveal">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop" alt="Apex LEGAL PARTNER Attorneys" loading="lazy" />
          </div>
          <div className="about-content">
            <div className="eyebrow">Who We Are</div>
            <h2>Excellence in Legal Practice Since 1999</h2>
            <p>Apex LEGAL PARTNER is a premier full-service law firm dedicated to providing exceptional representation across a wide spectrum of legal disciplines.</p>
            <ul>
              <li>Client-First Approach</li>
              <li>Proven Track Record</li>
              <li>Tailored Legal Strategy</li>
            </ul>
            <Link to="/about" className="btn-link">Learn More About Us →</Link>
          </div>
        </div>
      </section>

      {/* Practice Areas Preview */}
      <section className="section practice-preview">
        <div className="container">
          <div className="eyebrow reveal">Our Practice Areas</div>
          <h2 className="reveal">Our Areas of Legal Expertise</h2>
          <div className="divider reveal"></div>
          
          <div className="grid reveal">
            {/* Card 1 */}
            <div className="card reveal">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3>Corporate Law</h3>
              <p>We provide comprehensive corporate legal services from formation to complex mergers and acquisitions.</p>
              <Link to="/practice-areas#corporate" className="btn-link">Learn More →</Link>
            </div>
            {/* Card 2 */}
            <div className="card reveal">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 13.5V16.5l-4 4-4-4v-3L10 9.5l4 4z"></path><path d="M14 13.5l4-4 4 4-4 4-4-4z"></path><path d="M2.5 21.5l3.5-3.5"></path></svg>
              </div>
              <h3>Litigation</h3>
              <p>Fierce advocacy and strategic dispute resolution in state and federal courts nationwide.</p>
              <Link to="/practice-areas#litigation" className="btn-link">Learn More →</Link>
            </div>
            {/* Card 3 */}
            <div className="card reveal">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v20"></path><path d="M2 22h20"></path><path d="M10 12v10"></path></svg>
              </div>
              <h3>Real Estate</h3>
              <p>Guiding clients through commercial and residential transactions, zoning, and title disputes.</p>
              <Link to="/practice-areas#real-estate" className="btn-link">Learn More →</Link>
            </div>
            {/* Card 4 */}
            <div className="card reveal">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <h3>Family Law</h3>
              <p>Compassionate and discreet representation in divorce, custody, and high-net-worth matters.</p>
              <Link to="/practice-areas#family" className="btn-link">Learn More →</Link>
            </div>
            {/* Card 5 */}
            <div className="card reveal">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3>Criminal Defense</h3>
              <p>Vigorous defense against white-collar and serious federal or state criminal charges.</p>
              <Link to="/practice-areas#criminal" className="btn-link">Learn More →</Link>
            </div>
            {/* Card 6 */}
            <div className="card reveal">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3>Estate Planning</h3>
              <p>Securing your legacy through comprehensive wills, trusts, and strategic probate administration.</p>
              <Link to="/practice-areas#estate" className="btn-link">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose">
        <div className="container">
          <h2 className="reveal">Why Choose Apex</h2>
          <div className="why-grid reveal">
            <div className="why-item reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3>Proven Results</h3>
              <p>We've secured favorable outcomes in over 1,200 complex cases.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18"></path><path d="M3 9l9-5 9 5"></path><path d="M6 14v4"></path><path d="M18 14v4"></path><path d="M2 18h20"></path></svg>
              </div>
              <h3>Strategic Defense</h3>
              <p>Every case is approached with meticulous legal strategy & depth.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Client Partnership</h3>
              <p>You're never a case number. We build relationships built on trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <div className="eyebrow reveal">Client Reviews</div>
          <h2 className="reveal">What Our Clients Say</h2>
          
          <div className="testimonial-grid reveal">
            <div className="testimonial-card reveal">
              <div className="quote-mark">"</div>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">Apex LEGAL PARTNER helped us navigate a complex corporate dispute with exceptional skill and care.</p>
              <div className="client-name">— James T., CEO, Meridian Group</div>
            </div>
            <div className="testimonial-card reveal">
              <div className="quote-mark">"</div>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">Their strategic approach to our real estate transaction saved us millions. True professionals.</p>
              <div className="client-name">— Sarah W., Developer</div>
            </div>
            <div className="testimonial-card reveal">
              <div className="quote-mark">"</div>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">During a difficult family transition, they provided compassionate yet fierce representation.</p>
              <div className="client-name">— Michael R., Private Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section cta-banner">
        <div className="container reveal">
          <h2>Ready to Protect Your Legal Rights?</h2>
          <p>Schedule a confidential consultation with our experienced attorneys today.</p>
          <Link to="/contact" className="btn btn-primary">SCHEDULE FREE CONSULTATION</Link>
          <a href="tel:+1800APEXLAW" className="cta-phone">📞 +1 (800) APEX-LAW</a>
        </div>
      </section>
    </main>
  );
}
