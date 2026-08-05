import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../context/MembersContext';
import { useSiteContent } from '../context/SiteContentContext';
import './Members.css';

const MANAGERS_LIST = [
  { id: 'a3', name: 'Vishatan', label: '1', role: 'OVERALL MANAGER', userRole: 'manager', passcode: 'vishatan2026', icon: 'ti-briefcase' },
  { id: 'a4', name: 'Adwait', label: '2', role: 'TECHNICAL HEAD', userRole: 'manager', passcode: 'adwait2026', icon: 'ti-code' }
];

const ADMINS_LIST = [
  { id: 'a1', name: 'Aman Yadav', role: 'PRESIDENT', userRole: 'admin', passcode: 'aman2026', icon: 'ti-crown' },
  { id: 'a2', name: 'Falgun Bodele', role: 'PRESIDENT ELECT', userRole: 'admin', passcode: 'falgun2026', icon: 'ti-star' }
];

export default function Members() {
  const navigate = useNavigate();
  const { members, loggedInMember, login, logout, adminLogin, openLoginModal } = useMembers();
  const { content } = useSiteContent();
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Login Mode Tab: 'member' | 'manager' | 'admin'
  const [activeLoginTab, setActiveLoginTab] = useState('member');

  // Privileged Auth state
  const [selectedPrivilegedUser, setSelectedPrivilegedUser] = useState(MANAGERS_LIST[0]);
  const [privilegedPasscode, setPrivilegedPasscode] = useState('');

  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Compute member attendance statistics (Admin-controlled or defaulted)
  const totalEventsCount = loggedInMember?.totalEvents ?? (loggedInMember?.history ? Math.max(10, loggedInMember.history.length + 2) : 10);
  const attendedEventsCount = loggedInMember?.attendedEvents ?? (loggedInMember?.history ? Math.max(8, loggedInMember.history.length) : 8);
  const missedEventsCount = Math.max(0, totalEventsCount - attendedEventsCount);
  const attendanceRate = totalEventsCount > 0 ? Math.round((attendedEventsCount / totalEventsCount) * 100) : 0;
  const attendanceStatus = attendanceRate >= 90 ? 'EXCELLENT' : attendanceRate >= 75 ? 'GOOD' : attendanceRate >= 60 ? 'AVERAGE' : 'POOR';
  const attendanceStatusColor = attendanceRate >= 90 ? '#10B981' : attendanceRate >= 75 ? '#3B82F6' : attendanceRate >= 60 ? '#F59E0B' : '#EF4444';

  // Sort members by points descending for leaderboard
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);

  // Compute rank of logged in member
  const getRank = (memberId) => {
    const idx = sortedMembers.findIndex(m => m.id === memberId);
    return idx !== -1 ? idx + 1 : '-';
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.success) {
      setLoginError(res.error);
    } else {
      setLoginError('');
      setEmail('');
      setPassword('');
    }
  };

  React.useEffect(() => {
    if (!loggedInMember) {
      openLoginModal('select');
    }
  }, [loggedInMember]);

  return (
    <div className="members-page">
      <div className="container">
        
        {/* IF NOT LOGGED IN: PROMPT TO OPEN MODAL */}
        {!loggedInMember ? (
          <div style={{ margin: '3rem auto', maxWidth: '450px', textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-surface-light)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              AUTHENTICATION REQUIRED
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Please choose your role in the login modal to proceed.
            </p>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', background: '#d32b69', borderColor: '#d32b69', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => openLoginModal('select')}
            >
              <i className="ti ti-key"></i> Open Login Modal →
            </button>
          </div>
        ) : (
          /* IF LOGGED IN: OFFICIAL MEMBER DASHBOARD & LEADERBOARD */
          <div>
            {/* Dashboard Header with Circular Attendance Gauge */}
            <div className="dashboard-header">
              <div className="user-welcome-info">
                <div className="user-avatar">
                  {loggedInMember.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="user-title-box">
                  <span className="badge-mono">{loggedInMember.role}</span>
                  <h2>WELCOME BACK, {loggedInMember.name.toUpperCase()}!</h2>
                  <p>Rotaract STV Verified Official Member</p>
                </div>
              </div>

              {/* MODERN CIRCULAR ATTENDANCE PROGRESS INDICATOR */}
              <div className="modern-attendance-card">
                {/* LEFT SIDE: CIRCULAR PROGRESS RING (PURPLE -> PINK -> BLUE, 8PX THICKNESS, GLOW EFFECT) */}
                <div 
                  className="modern-circle-wrapper" 
                  onClick={() => setShowAttendanceModal(true)} 
                  title="Click to view detailed attendance breakdown"
                >
                  <svg className="modern-circle-svg" viewBox="0 0 100 100">
                    <defs>
                      {/* Purple -> Maroon -> Blue Gradient */}
                      <linearGradient id="purplePinkBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="50%" stopColor="#5A0F2D" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>

                      {/* Subtle Glow Effect */}
                      <filter id="purplePinkBlueGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#5A0F2D" floodOpacity="0.6" />
                      </filter>
                    </defs>

                    {/* Background Track Circle (8px thickness) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="8"
                    />

                    {/* Animated Gradient Progress Ring (8px thickness with glow) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="url(#purplePinkBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={238.76}
                      strokeDashoffset={238.76 * (1 - attendanceRate / 100)}
                      filter="url(#purplePinkBlueGlow)"
                      className="animated-progress-ring"
                    />
                  </svg>

                  {/* Center Display: Percentage Number + "Good" Text */}
                  <div className="modern-circle-center-content">
                    <span className="modern-percent-val">{attendanceRate}%</span>
                    <span className="modern-status-text">Good</span>
                  </div>
                </div>

                {/* RIGHT SIDE: ATTENDANCE OVERVIEW & 8 / 10 EVENT */}
                <div className="modern-attendance-right">
                  <div className="modern-overview-title">
                    <i className="ti ti-chart-donut" style={{ color: '#5A0F2D' }}></i> Attendance Overview
                  </div>
                  <div className="modern-event-stats">
                    <span className="event-count-highlight">{attendedEventsCount} / {totalEventsCount}</span>
                    <span className="event-label-text">EVENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reduced Dashboard Stats Grid (40-50% Smaller Padding & Height) */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="dash-stat-icon">
                  <i className="ti ti-star"></i>
                </div>
                <div>
                  <div className="dash-stat-val">{loggedInMember.points}</div>
                  <div className="dash-stat-lbl">Total Earned Points</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-icon">
                  <i className="ti ti-trophy"></i>
                </div>
                <div>
                  <div className="dash-stat-val">#{getRank(loggedInMember.id)}</div>
                  <div className="dash-stat-lbl">Leaderboard Rank</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-icon">
                  <i className="ti ti-list-check"></i>
                </div>
                <div>
                  <div className="dash-stat-val">{loggedInMember.history ? loggedInMember.history.length : 0}</div>
                  <div className="dash-stat-lbl">Recorded Activities</div>
                </div>
              </div>
            </div>

            {/* Points History Collapsible Card */}
            <div className={`history-card ${isHistoryOpen ? 'is-open' : ''}`}>
              <button 
                type="button"
                className="history-card-header"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                aria-expanded={isHistoryOpen}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <i className="ti ti-history" style={{ color: 'var(--accent-primary)', fontSize: '1.25rem' }}></i>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.02em' }}>YOUR POINTS BREAKDOWN & HISTORY</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge-mono" style={{ fontSize: '0.68rem', padding: '0.22rem 0.6rem' }}>ACTIVITY LOG</span>
                  <i className={`ti ti-chevron-down accordion-chevron ${isHistoryOpen ? 'open' : ''}`}></i>
                </div>
              </button>

              <div className={`history-accordion-content ${isHistoryOpen ? 'open' : ''}`}>
                <div className="history-accordion-inner">
                  {!loggedInMember.history || loggedInMember.history.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No point activities recorded yet.</p>
                  ) : (
                    <div className="history-list">
                      {loggedInMember.history.map((item) => (
                        <div key={item.id} className="history-item">
                          <div className="history-left">
                            <div className="history-icon">
                              <i className="ti ti-award"></i>
                            </div>
                            <div>
                              <div className="history-title">{item.title}</div>
                              <div className="history-date">
                                <i className="ti ti-calendar"></i> {item.date} &bull; {item.category || 'General'}
                              </div>
                            </div>
                          </div>
                          <div className="history-pts">
                            +{item.points} PTS
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* INTERACTIVE EVENTS & MEETINGS CARDS SYSTEM */}
            <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <i className="ti ti-calendar-event" style={{ color: 'var(--accent-primary)' }}></i> UPCOMING EVENTS & MEETINGS
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Interactive schedule, meeting briefings, venue details, and instant RSVP
                  </p>
                </div>
                <span className="badge-mono" style={{ padding: '0.35rem 0.75rem', background: 'rgba(211, 43, 105, 0.12)', color: '#d32b69', borderColor: 'rgba(211, 43, 105, 0.3)' }}>
                  {(content?.events || []).length} SCHEDULED
                </span>
              </div>

              <div className="events-cards-grid">
                {(content?.events || []).map((evt) => {
                  const isExpanded = expandedEventId === evt.id;
                  const isMeeting = (evt.category || '').toLowerCase().includes('meeting');

                  return (
                    <div key={evt.id} className="interactive-event-card">
                      {/* Card Top Category Pill & Featured Badge */}
                      <div className="event-card-header-bar">
                        <span className={`event-type-badge ${isMeeting ? 'type-meeting' : 'type-event'}`}>
                          <i className={`ti ${isMeeting ? 'ti-video' : 'ti-calendar'}`}></i>
                          {evt.category || (isMeeting ? 'Upcoming Meeting' : 'Upcoming Event')}
                        </span>
                        {evt.isFeatured && (
                          <span className="event-featured-badge">⭐ FEATURED</span>
                        )}
                      </div>

                      {/* 4:5 Card Aspect Cover Image */}
                      <div className="event-cover-wrapper">
                        <img src={evt.coverImage || '/hero_team_1.jpg'} alt={evt.title} className="event-cover-img" />
                      </div>

                      {/* Card Body Details */}
                      <div className="event-card-body">
                        <h4 className="event-card-title">{evt.title}</h4>

                        <div className="event-meta-list">
                          <div className="event-meta-row">
                            <i className="ti ti-calendar-stats" style={{ color: 'var(--accent-primary)' }}></i>
                            <span><strong>Date:</strong> {evt.date} {evt.time ? `(${evt.time})` : ''}</span>
                          </div>
                          <div className="event-meta-row">
                            <i className="ti ti-map-pin" style={{ color: '#3B82F6' }}></i>
                            <span><strong>Venue:</strong> {evt.venue}</span>
                          </div>
                        </div>

                        {/* 300ms Smooth Expand / Collapse Container */}
                        <div className={`event-expandable-content ${isExpanded ? 'open' : ''}`}>
                          <p className="event-full-desc">{evt.fullDesc || evt.shortDesc}</p>
                          
                          {evt.registrationUrl && (
                            <a 
                              href={evt.registrationUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-primary event-rsvp-btn"
                            >
                              <i className="ti ti-external-link"></i> Register / RSVP Now
                            </a>
                          )}
                        </div>

                        {/* Read More / Read Less Interactive Toggle Button */}
                        <button 
                          type="button" 
                          className="event-toggle-btn"
                          onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        >
                          <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                          <i className={`ti ti-chevron-down toggle-icon ${isExpanded ? 'rotated' : ''}`}></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PRIVATE OFFICIAL LEADERBOARD TABLE (VISIBLE ONLY TO LOGGED-IN MEMBERS) */}
            <div className="leaderboard-card">
              <div className="card-title-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="ti ti-crown" style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}></i>
                  <h3 style={{ margin: 0 }}>ROTARACT STV OFFICIAL LEADERBOARD</h3>
                </div>
                <span className="badge-mono">{sortedMembers.length} MEMBERS RANKED</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Member Name</th>
                      <th>Role</th>
                      <th style={{ textAlign: 'right' }}>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMembers.map((member, index) => {
                      const rank = index + 1;
                      const isCurrent = loggedInMember && loggedInMember.id === member.id;
                      return (
                        <tr 
                          key={member.id} 
                          className={`leaderboard-row ${isCurrent ? 'logged-in-highlight' : ''}`}
                        >
                          <td>
                            <span className={`rank-badge ${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''}`}>
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <strong style={{ color: 'var(--text-primary)' }}>{member.name}</strong>
                              {isCurrent && (
                                <span style={{ 
                                  marginLeft: '8px', 
                                  fontSize: '0.7rem', 
                                  background: 'var(--accent-primary)', 
                                  color: '#FFF', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                  fontWeight: '600'
                                }}>YOU</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge-mono" style={{ fontSize: '0.7rem' }}>{member.role}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="points-pill">{member.points} PTS</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FORGOT PASSWORD ASSISTANCE MODAL */}
      {showForgotPasswordModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setShowForgotPasswordModal(false)}
        >
          <div 
            style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '1.75rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="ti ti-help-circle" style={{ color: '#d32b69' }}></i> Forgot Member Password?
              </h3>
              <button className="btn-xs btn-xs-del" onClick={() => setShowForgotPasswordModal(false)}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              For security compliance, member accounts and passwords are admin-controlled.
            </p>
            
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(211, 43, 105, 0.1)', border: '1px solid rgba(211, 43, 105, 0.25)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              <strong><i className="ti ti-mail"></i> Contact Club Administration:</strong><br/>
              Please email <strong>admin@rotaractstv.org</strong> or reach out to the Executive Board with your <strong>Registration Number</strong> and <strong>Registered Gmail Address</strong> to reset your credential password.
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => setShowForgotPasswordModal(false)}
              style={{ width: '100%', background: '#d32b69', borderColor: '#d32b69' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ATTENDANCE DETAILED ANALYTICS MODAL */}
      {showAttendanceModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setShowAttendanceModal(false)}
        >
          <div 
            style={{ maxWidth: '520px', width: '100%', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '1.75rem', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="ti ti-chart-donut" style={{ color: '#d32b69' }}></i> Member Attendance Analytics
              </h3>
              <button className="btn-xs btn-xs-del" onClick={() => setShowAttendanceModal(false)}>
                <i className="ti ti-x"></i> Close
              </button>
            </div>

            {/* Gauge Semi-Circle Arc Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0 1.5rem' }}>
              <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="modalAttendanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32b69" />
                      <stop offset="100%" stopColor={attendanceStatusColor} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#modalAttendanceGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={263.89}
                    strokeDashoffset={263.89 * (1 - attendanceRate / 100)}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', lineHeight: 1 }}>
                    {attendanceRate}%
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: attendanceStatusColor, marginTop: '0.2rem', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                    {attendanceStatus}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', textAlign: 'center' }}>
                Official RAC STV Meeting & Activity Attendance Rating for <strong>{loggedInMember?.name}</strong>
              </p>
            </div>

            {/* Attendance Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#10B981', fontFamily: 'var(--font-heading)' }}>{attendedEventsCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ATTENDED</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#EF4444', fontFamily: 'var(--font-heading)' }}>{missedEventsCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MISSED</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#3B82F6', fontFamily: 'var(--font-heading)' }}>{totalEventsCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TOTAL HELD</div>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => setShowAttendanceModal(false)}
              style={{ width: '100%', background: '#d32b69', borderColor: '#d32b69' }}
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
