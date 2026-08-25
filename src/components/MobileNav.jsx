import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MobileNav({ isOpen, onClose }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogoutClick = async () => {
    onClose();
    await logout();
  };

  return (
    <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link>
        </li>
        <li className={`has-dropdown ${dropdownOpen ? 'active' : ''}`}>
          <a
            href="#practice-areas"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }}
          >
            Practice Areas {dropdownOpen ? '‹' : '›'}
          </a>
          <ul className="dropdown-menu">
            <li><Link to="/practice-areas#corporate" onClick={handleLinkClick}>Corporate Law</Link></li>
            <li><Link to="/practice-areas#litigation" onClick={handleLinkClick}>Litigation</Link></li>
            <li><Link to="/practice-areas#real-estate" onClick={handleLinkClick}>Real Estate</Link></li>
            <li><Link to="/practice-areas#family" onClick={handleLinkClick}>Family Law</Link></li>
            <li><Link to="/practice-areas#criminal" onClick={handleLinkClick}>Criminal Defense</Link></li>
            <li><Link to="/practice-areas#estate" onClick={handleLinkClick}>Estate Planning</Link></li>
          </ul>
        </li>
        <li>
          <Link to="/about" className="nav-link" onClick={handleLinkClick}>About Us</Link>
        </li>
        <li>
          <Link to="/attorneys" className="nav-link" onClick={handleLinkClick}>Our Attorneys</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link" onClick={handleLinkClick}>Contact</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <Link to="/dashboard" className="nav-link" onClick={handleLinkClick}>Client Portal</Link>
          </li>
        ) : (
          <li>
            <Link to="/login" className="nav-link" onClick={handleLinkClick}>Sign In</Link>
          </li>
        )}
      </ul>

      {isAuthenticated ? (
        <button className="btn btn-outline" onClick={handleLogoutClick} style={{ color: 'var(--gold-accent)', borderColor: 'var(--gold-accent)' }}>
          Log Out
        </button>
      ) : (
        <Link to="/contact" className="btn btn-primary" onClick={handleLinkClick}>
          Schedule Consultation
        </Link>
      )}

      <div className="mobile-contact">📞 +1 (800) APEX-LAW</div>
    </div>
  );
}
