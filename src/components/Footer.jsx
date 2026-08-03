import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import RotaryWheelIcon from './RotaryWheelIcon';
import './Footer.css';

export default function Footer() {
  const { content } = useSiteContent();
  const { contact } = content;
  const navigate = useNavigate();
  const location = useLocation();

  const [footerForm, setFooterForm] = useState({ name: '', email: '', message: '' });
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    if (!footerForm.name.trim() || !footerForm.email.trim() || !footerForm.message.trim()) return;
    setFooterSubmitted(true);
    setTimeout(() => {
      setFooterSubmitted(false);
      setFooterForm({ name: '', email: '', message: '' });
    }, 5000);
  };

  const handleQuickNav = (sectionId, targetPath) => {
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          {/* COLUMN 1: BRAND & TAGLINE (LEFT) */}
          <div className="footer-brand">
            <div className="footer-title">
              <img 
                src="/assets/output-onlinepngtools(2).png" 
                alt="Rotary International Wheel" 
                className="nav-logo" 
                draggable="false"
                style={{ width: '38px', height: '38px' }} 
              />
              ROTARACT CLUB OF STV
            </div>
            <p className="footer-tagline">
              Skill Tech Visionaries — Service Above Self. Empowering youth, driving innovation, and transforming our community through impactful action.
            </p>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION SECTION (CENTER) */}
          <div className="footer-nav-col footer-center-col">
            <h4 className="footer-heading">QUICK NAVIGATION</h4>
            <ul className="footer-quick-links">
              <li>
                <button type="button" className="footer-link-btn" onClick={() => handleQuickNav(null, '/')}>
                  <i className="ti ti-chevron-right"></i> Home
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => handleQuickNav('about', '/')}>
                  <i className="ti ti-chevron-right"></i> About
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => handleQuickNav(null, '/projects')}>
                  <i className="ti ti-chevron-right"></i> Projects
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" title="Redirects to Executive Board Members" onClick={() => handleQuickNav('board', '/')}>
                  <i className="ti ti-chevron-right"></i> Team
                </button>
              </li>
              <li>
                <a href={`mailto:${contact.email || 'rotaractclubofstv@gmail.com'}`} className="footer-link-btn" style={{ textDecoration: 'none' }}>
                  <i className="ti ti-chevron-right"></i> Contact Us
                </a>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => handleQuickNav(null, '/admin')}>
                  <i className="ti ti-chevron-right"></i> Login
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CONNECT WITH US (RIGHT - PHOTO 2 IN PLACE OF PHOTO 1) */}
          <div className="footer-connect-col">
            <h4 className="footer-heading">CONNECT WITH US</h4>
            <div className="social-icons">
              <a 
                href={contact.instagramUrl || 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon-btn" 
                aria-label="Instagram"
                title={`Official Instagram: ${contact.instagram || '@rotaractclubstv'}`}
              >
                <i className="ti ti-brand-instagram"></i>
              </a>

              <a 
                href={`mailto:${contact.email || 'rotaractclubofstv@gmail.com'}`} 
                className="social-icon-btn" 
                aria-label="Email"
                title={`Official Gmail: ${contact.email || 'rotaractclubofstv@gmail.com'}`}
              >
                <i className="ti ti-mail"></i>
              </a>

              <a 
                href={`tel:${contact.phone || '+919876543210'}`} 
                className="social-icon-btn" 
                aria-label="Phone"
                title={`Helpline: ${contact.phone || '+91 98765 43210'}`}
              >
                <i className="ti ti-phone"></i>
              </a>
            </div>
          </div>

        </div>

        {/* FOOTER BOTTOM & REVISED FOOTER CREDIT */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Rotaract Club of STV. All rights reserved.</span>
          <span className="footer-credit">
            Designed with Passion &amp; Love by <strong style={{ color: 'var(--accent-primary)' }}>CHARTER PRESIDENT Aman Yadav❤️</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
