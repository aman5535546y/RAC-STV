import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { useMembers } from '../context/MembersContext';
import './Navbar.css';

export default function Navbar() {
  const { content, toggleThemeMode } = useSiteContent();
  const { loggedInMember, logout, authenticatedAdmin, setAuthenticatedAdmin, adminLogout, setAdminActiveSection, openLoginModal } = useMembers();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleGoToDashboard = () => {
    setShowDropdown(false);
    closeMenu();

    const isPrivileged = authenticatedAdmin || (
      loggedInMember && (
        loggedInMember.userRole === 'admin' ||
        loggedInMember.userRole === 'manager' ||
        ['PRESIDENT', 'PRESIDENT ELECT', 'OVERALL MANAGER', 'TECHNICAL HEAD'].includes((loggedInMember.role || '').toUpperCase())
      )
    );

    if (isPrivileged) {
      if (!authenticatedAdmin && loggedInMember) {
        const uRole = loggedInMember.userRole || (
          loggedInMember.role === 'PRESIDENT' || loggedInMember.role === 'PRESIDENT ELECT' ? 'admin' : 'manager'
        );
        const adminObj = {
          id: loggedInMember.id,
          name: loggedInMember.name,
          role: loggedInMember.role,
          userRole: uRole,
          passcode: loggedInMember.password || 'password123'
        };
        setAuthenticatedAdmin(adminObj);
        try { localStorage.setItem('rotaract_stv_auth_admin', JSON.stringify(adminObj)); } catch {}
      }
      navigate('/admin');
    } else {
      navigate('/members');
    }
  };

  const handleAdminSelectSection = (sec) => {
    setAdminActiveSection(sec);
    setShowDropdown(false);
    closeMenu();
    if (window.location.pathname !== '/admin') {
      navigate('/admin');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const isLight = content.theme && content.theme.mode === 'light';

  const toggleMenu = () => setMobileOpen(!mobileOpen);
  const closeMenu = () => {
    setMobileOpen(false);
    setShowDropdown(false);
  };

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.trim().split(/\s+/)[0];
  };

  const handleMemberLoginClick = () => {
    setShowLoginModal(false);
    closeMenu();
    navigate('/members');
  };

  const handleAdminLoginClick = () => {
    setShowLoginModal(false);
    closeMenu();
    navigate('/admin');
  };

  const handleMemberLogout = () => {
    logout();
    setShowDropdown(false);
    closeMenu();
    navigate('/');
  };

  const handleAdminLogout = () => {
    adminLogout();
    setShowDropdown(false);
    closeMenu();
    navigate('/');
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="container navbar-container">
          <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
            <img
              src="/rotary_official_wheel.png"
              alt="Rotary International Wheel"
              className="nav-logo"
              draggable="false"
            />
            <div className="brand-text">
              <span className="brand-title">ROTARACT</span>
              <span className="brand-sub">CLUB OF STV</span>
            </div>
          </NavLink>

          <button 
            className="mobile-toggle" 
            onClick={toggleMenu} 
            aria-label="Toggle Navigation Menu"
          >
            <i className={mobileOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>

          <nav>
            <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
              {/* HOME LINK */}
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                  end
                >
                  Home
                </NavLink>
              </li>

              {/* PROJECTS LINK */}
              <li>
                <NavLink 
                  to="/projects" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Projects
                </NavLink>
              </li>

              {/* THEME TOGGLE (PLACED IMMEDIATELY BEFORE LOGIN/PROFILE) */}
              <li>
                <button 
                  type="button"
                  className="theme-mode-toggle" 
                  onClick={toggleThemeMode}
                  aria-label="Toggle Dark and Light Mode"
                  title={isLight ? "Switch to Dark Theme" : "Switch to Light Theme"}
                >
                  <i className={`ti ${isLight ? 'ti-moon-stars' : 'ti-sun'}`}></i>
                  <span className="theme-toggle-label">{isLight ? 'Dark' : 'Light'}</span>
                </button>
              </li>

              {/* THIRD ITEM: LOGIN / MEMBER PROFILE DROPDOWN / ADMIN PROFILE DROPDOWN */}
              {loggedInMember ? (
                /* MEMBER / MANAGER / ADMIN LOGGED IN DROPDOWN */
                (() => {
                  const mRole = (loggedInMember.userRole || '').toLowerCase();
                  const roleBadge = mRole === 'admin' ? '👑 Admin' : mRole === 'manager' ? '🛠 Manager' : '👤 Member';
                  const roleTag = mRole === 'admin' ? '👑 ADMIN' : mRole === 'manager' ? '🛠 MANAGER' : '👤 MEMBER';

                  return (
                    <li className="nav-profile-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="nav-profile-btn"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {roleBadge} <i className="ti ti-chevron-down" style={{ fontSize: '0.85rem' }}></i>
                      </button>

                      {showDropdown && (
                        <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {loggedInMember.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span style={{ padding: '1px 5px', borderRadius: '3px', background: mRole === 'admin' ? 'rgba(90, 15, 45, 0.3)' : mRole === 'manager' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)' }}>
                                {roleTag}
                              </span>
                              <span>• {loggedInMember.role}</span>
                            </div>
                          </div>

                          <button 
                            className="dropdown-item" 
                            onClick={() => { setShowDropdown(false); closeMenu(); navigate('/members'); }}
                          >
                            <i className="ti ti-user" style={{ color: 'var(--accent-primary)' }}></i> My Profile
                          </button>

                          <button 
                            className="dropdown-item" 
                            onClick={handleGoToDashboard}
                          >
                            <i className="ti ti-dashboard" style={{ color: 'var(--accent-primary)' }}></i> My Dashboard
                          </button>

                          <button 
                            className="dropdown-item" 
                            onClick={() => { setShowDropdown(false); closeMenu(); setShowAttendanceModal(true); }}
                          >
                            <i className="ti ti-calendar-check" style={{ color: 'var(--accent-primary)' }}></i> My Attendance
                          </button>

                          <div className="dropdown-divider"></div>

                          <button 
                            className="dropdown-item" 
                            onClick={handleMemberLogout}
                            style={{ color: '#FF4D4D' }}
                          >
                            <i className="ti ti-logout"></i> Logout
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })()
              ) : authenticatedAdmin ? (
                /* ADMIN / MANAGER LOGGED IN DROPDOWN */
                (() => {
                  const uRole = (authenticatedAdmin?.userRole || (authenticatedAdmin?.role === 'OVERALL MANAGER' || authenticatedAdmin?.role === 'TECHNICAL HEAD' ? 'manager' : 'admin')).toLowerCase();
                  const isMgr = uRole === 'manager';

                  return (
                    <li className="nav-profile-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="nav-profile-btn"
                        style={{ borderColor: isMgr ? '#3B82F6' : 'var(--accent-primary)', color: isMgr ? '#60A5FA' : 'var(--accent-primary)' }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {isMgr ? '🛠 Manager ▼' : '👑 Admin ▼'}
                      </button>

                      {showDropdown && (
                        <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                              {authenticatedAdmin?.name || 'User'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: isMgr ? '#60A5FA' : 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span style={{ padding: '1px 5px', borderRadius: '3px', background: isMgr ? 'rgba(59, 130, 246, 0.2)' : 'rgba(90, 15, 45, 0.3)' }}>
                                {isMgr ? '🛠 MANAGER' : '👑 ADMIN'}
                              </span>
                              <span>• {authenticatedAdmin?.role}</span>
                            </div>
                          </div>

                          <button 
                            className="dropdown-item" 
                            onClick={() => handleAdminSelectSection('dashboard')}
                          >
                            📊 Dashboard
                          </button>

                          <button 
                            className="dropdown-item" 
                            onClick={() => handleAdminSelectSection('member-management')}
                          >
                            👥 Member Management
                          </button>

                          <button 
                            className="dropdown-item" 
                            onClick={() => handleAdminSelectSection('projects')}
                          >
                            📅 Upcoming Events & Meetings
                          </button>

                          <button 
                            className="dropdown-item" 
                            onClick={() => handleAdminSelectSection('bento-grid')}
                          >
                            🧩 Edit Bento Grid
                          </button>

                          {!isMgr && (
                            <>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleAdminSelectSection('hero')}
                              >
                                📝 Edit Hero Section
                              </button>

                              <button 
                                className="dropdown-item" 
                                onClick={() => handleAdminSelectSection('about')}
                              >
                                ℹ️ Edit About
                              </button>

                              <button 
                                className="dropdown-item" 
                                onClick={() => handleAdminSelectSection('executive-board')}
                              >
                                👨💼 Edit Executive Board
                              </button>

                              <button 
                                className="dropdown-item" 
                                onClick={() => handleAdminSelectSection('logos')}
                              >
                                🖼️ Edit Logos
                              </button>
                            </>
                          )}

                          <div className="dropdown-divider"></div>

                          <button 
                            className="dropdown-item" 
                            onClick={handleAdminLogout}
                            style={{ color: '#FF4D4D' }}
                          >
                            🚪 Logout
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })()
              ) : (
                /* BEFORE LOGIN: LOGIN BUTTON */
                <li>
                  <button
                    type="button"
                    className="nav-link"
                    onClick={() => {
                      closeMenu();
                      openLoginModal('select');
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* OPTIONAL ATTENDANCE STATS MODAL FOR MEMBERS */}
      {showAttendanceModal && loggedInMember && (
        <div className="bento-modal-overlay" onClick={() => setShowAttendanceModal(false)}>
          <div 
            className="bento-modal-content" 
            style={{ maxWidth: '520px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="bento-modal-close" onClick={() => setShowAttendanceModal(false)}>
              <i className="ti ti-x"></i>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="badge-mono" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                <i className="ti ti-calendar-check"></i> ROTARACT STV MEMBER RECORD
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: 0, textTransform: 'uppercase' }}>
                MY ATTENDANCE & STATS
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {loggedInMember.name} • {loggedInMember.role}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface-light)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Official Meeting Attendance
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-light)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFB800', fontFamily: 'var(--font-heading)' }}>
                  {loggedInMember.points}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Total Earned Points
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Recent Activities Attended
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>SkillTech Empowerment Summit (Jul 2026)</li>
                <li>Youth Health & Blood Donation Camp (Jun 2026)</li>
                <li>Annual Youth Assembly & Delegation (May 2026)</li>
              </ul>
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setShowAttendanceModal(false)}>
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
