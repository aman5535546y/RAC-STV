import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Members.css';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-gateway-page" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="photos-pill-badge">
            <i className="ti ti-key"></i> AUTHENTICATION GATEWAY
          </div>
          <h2>PORTAL LOGIN</h2>
          <p style={{ marginTop: '0.5rem' }}>
            Please select your authentication portal to access member stats or club administration
          </p>
        </div>

        {/* 2 Login Choices Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          
          {/* CHOICE 1: MEMBER LOGIN */}
          <div 
            className="cms-item-card"
            onClick={() => navigate('/members')}
            style={{ 
              background: 'var(--bg-card)', 
              border: '2px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(227, 27, 109, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: 'var(--accent-soft)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              marginBottom: '1.25rem',
              border: '2px solid var(--accent-primary)'
            }}>
              👤
            </div>

            <span className="badge-mono" style={{ marginBottom: '0.75rem' }}>
              <i className="ti ti-id-badge"></i> OFFICIAL MEMBERS PORTAL
            </span>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Member Login
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '2rem', flex: 1 }}>
              Authenticate with your registered member name to view your personal point statistics, club ranks, and member activity records.
            </p>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              <i className="ti ti-user-check"></i> Enter Member Portal →
            </button>
          </div>

          {/* CHOICE 2: ADMIN LOGIN */}
          <div 
            className="cms-item-card"
            onClick={() => navigate('/admin')}
            style={{ 
              background: 'var(--bg-card)', 
              border: '2px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d32b69';
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(211, 43, 105, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: 'rgba(211, 43, 105, 0.15)',
              color: '#d32b69',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              marginBottom: '1.25rem',
              border: '2px solid #d32b69'
            }}>
              🛠️
            </div>

            <span className="badge-mono" style={{ marginBottom: '0.75rem', background: 'rgba(211, 43, 105, 0.15)', color: '#d32b69', borderColor: '#d32b69' }}>
              <i className="ti ti-shield-lock"></i> EXECUTIVE CMS ACCESS
            </span>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Admin Login
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '2rem', flex: 1 }}>
              Authenticate with your executive passcode to upload photos/3s videos, update event redirect links, and manage member leaderboards.
            </p>

            <button className="btn btn-outline" style={{ width: '100%', padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderColor: '#d32b69', color: '#d32b69' }}>
              <i className="ti ti-key"></i> Enter Admin Portal →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
