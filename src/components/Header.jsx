import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MobileNav from './MobileNav';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <svg className="logo-img" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 100 L95 20 L115 55" stroke="currentColor" strokeWidth="12" fill="none" strokeLinejoin="miter"/>
                <path d="M70 65 L105 65" stroke="currentColor" strokeWidth="12"/>
                <path d="M40 100 L60 100" stroke="currentColor" strokeWidth="4"/>
                
                <polygon points="120,40 140,20 160,40" fill="#6B7280"/>
                <rect x="115" y="42" width="50" height="6" fill="#6B7280"/>
                <rect x="120" y="50" width="40" height="6" fill="#6B7280"/>
                
                <rect x="125" y="58" width="6" height="34" fill="#9CA3AF"/>
                <rect x="137" y="58" width="6" height="34" fill="#9CA3AF"/>
                <rect x="149" y="58" width="6" height="34" fill="#9CA3AF"/>
                
                <rect x="120" y="94" width="40" height="6" fill="#6B7280"/>
                
                <text x="180" y="80" fontFamily="'Playfair Display', serif" fontSize="64" fill="currentColor" fontWeight="bold" letterSpacing="2">APEX</text>
                
                <line x1="175" y1="115" x2="195" y2="115" stroke="#9CA3AF" strokeWidth="2"/>
                <text x="205" y="119" fontFamily="'Cormorant Garamond', serif" fontSize="16" fill="#6B7280" letterSpacing="3">LEGAL PARTNER</text>
                <line x1="360" y1="115" x2="380" y2="115" stroke="#9CA3AF" strokeWidth="2"/>
                
                <text x="265" y="140" fontFamily="'Inter', sans-serif" fontSize="8" fill="currentColor" letterSpacing="2" textAnchor="middle">ADVICE. ADVOCACY. RESULTS.</text>
              </svg>
            </Link>
          </div>
          
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li><Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link></li>
              <li className="has-dropdown">
                <Link to="/practice-areas" className={`nav-link ${isActive('/practice-areas')}`}>Practice Areas</Link>
                <ul className="dropdown-menu">
                  <li><Link to="/practice-areas#corporate">Corporate Law</Link></li>
                  <li><Link to="/practice-areas#litigation">Litigation</Link></li>
                  <li><Link to="/practice-areas#real-estate">Real Estate</Link></li>
                  <li><Link to="/practice-areas#family">Family Law</Link></li>
                  <li><Link to="/practice-areas#criminal">Criminal Defense</Link></li>
                  <li><Link to="/practice-areas#estate">Estate Planning</Link></li>
                </ul>
              </li>
              <li><Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link></li>
              <li><Link to="/attorneys" className={`nav-link ${isActive('/attorneys')}`}>Attorneys</Link></li>
              <li><Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link></li>
              
              {isAuthenticated ? (
                <>
                  <li><Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Client Portal</Link></li>
                  {user?.role === 'admin' && (
                    <li><Link to="/admin" className={`nav-link ${isActive('/admin')}`} style={{ color: '#D4AF37', fontWeight: 600 }}>Admin Console</Link></li>
                  )}
                </>
              ) : (
                <li><Link to="/login" className={`nav-link nav-link-signin ${isActive('/login')}`}>Sign In</Link></li>
              )}
            </ul>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="btn btn-outline"
                style={{ padding: '10px 20px', fontSize: '13px', borderColor: 'var(--gold-accent)', color: 'var(--gold-accent)' }}
              >
                Log Out
              </button>
            ) : (
              <Link to="/contact" className="btn btn-primary">📞 Schedule Now</Link>
            )}
          </nav>

          <button
            className={`mobile-nav-toggle ${mobileOpen ? 'open' : ''}`}
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </header>
    </>
  );
}
