import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../context/MembersContext';
import { loginWithGoogleAuth } from '../firebase';

export default function LoginModal() {
  const navigate = useNavigate();
  const { 
    showLoginModal, 
    closeLoginModal, 
    login,
    loginWithGoogle 
  } = useMembers();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginErrorTitle, setLoginErrorTitle] = useState('');
  const [loginErrorCode, setLoginErrorCode] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginErrorTitle('');
    setLoginErrorCode('');
    const res = login(email, password);
    if (!res.success) {
      setLoginError(res.error);
    } else {
      setLoginError('');
      setEmail('');
      setPassword('');
      closeLoginModal();
      navigate(res.targetUrl || '/members');
    }
  };

  const handleGoogleClick = async () => {
    setLoginError('');
    setLoginErrorTitle('');
    setLoginErrorCode('');
    setIsGoogleLoading(true);

    try {
      const authRes = await loginWithGoogleAuth();
      setIsGoogleLoading(false);

      if (authRes.success && authRes.email) {
        console.log('[Google OAuth] Successfully authenticated email from Google popup:', authRes.email);
        const res = loginWithGoogle(authRes.email);
        if (!res.success) {
          setLoginErrorTitle(res.errorTitle || '');
          setLoginError(res.error || 'Your account is not registered with the RAC STV Portal.');
          setLoginErrorCode('');
        } else {
          setLoginError('');
          setLoginErrorTitle('');
          setLoginErrorCode('');
          closeLoginModal();
          navigate(res.targetUrl || '/members');
        }
      } else if (!authRes.success && authRes.error) {
        console.error('[Google OAuth Root Cause Diagnostic]', authRes);
        setLoginErrorTitle('Google OAuth Error');
        setLoginErrorCode(authRes.code || 'OAUTH_ERROR');
        setLoginError(authRes.error);
      }
    } catch (err) {
      console.error('[Google OAuth Uncaught Diagnostic Error]', err);
      setIsGoogleLoading(false);
      setLoginErrorTitle('Google Sign-In Error');
      setLoginErrorCode('UNCAUGHT_OAUTH_EXCEPT');
      setLoginError(err.message || 'Failed to launch Google OAuth popup window.');
    }
  };

  return (
    <div 
      className="bento-modal-overlay" 
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}
      onClick={closeLoginModal}
    >
      <div 
        className="bento-modal-content" 
        style={{ 
          maxWidth: '460px', 
          width: '100%', 
          background: 'var(--bg-surface)', 
          borderRadius: '16px', 
          border: '1px solid var(--border-subtle)', 
          padding: '2.25rem 2rem', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button 
          type="button"
          onClick={closeLoginModal}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
          title="Close Modal"
        >
          <i className="ti ti-x"></i>
        </button>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(211, 43, 105, 0.12)',
            color: '#d32b69',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 1rem auto',
            border: '2px solid rgba(211, 43, 105, 0.35)'
          }}>
            <i className="ti ti-shield-lock"></i>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ROTARACT PORTAL LOGIN
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Sign in with Google OAuth or enter member credentials
          </p>
        </div>

        {/* GOOGLE OAUTH OFFICIAL BUTTON */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button 
            type="button" 
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: 'var(--bg-surface-light)',
              border: '1.5px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              cursor: isGoogleLoading ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'all 0.25s ease',
              opacity: isGoogleLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isGoogleLoading) {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isGoogleLoading) {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-surface-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            {isGoogleLoading ? 'Connecting to Google OAuth...' : 'Continue with Google'}
          </button>
        </div>

        {/* DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: '600' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
          <span style={{ padding: '0 0.75rem', letterSpacing: '0.05em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
        </div>

        {/* DETAILED DIAGNOSTIC ERROR DISPLAY */}
        {loginError && (
          <div className="error-banner" style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', fontSize: '0.85rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }}></i>
            <div style={{ width: '100%' }}>
              {loginErrorTitle && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: '#EF4444', fontSize: '0.9rem' }}>{loginErrorTitle}</strong>
                  {loginErrorCode && <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(239,68,68,0.2)', padding: '2px 6px', borderRadius: '4px', color: '#FCA5A5' }}>{loginErrorCode}</span>}
                </div>
              )}
              <span style={{ lineHeight: '1.45', display: 'block' }}>{loginError}</span>
            </div>
          </div>
        )}

        {/* STANDARD EMAIL FORM */}
        <form onSubmit={handleSubmit} className="login-form" style={{ gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="modal-user-email" style={{ fontSize: '0.82rem', fontWeight: '600' }}>
              Registered Email Address
            </label>
            <input 
              id="modal-user-email"
              type="email" 
              className="form-input" 
              placeholder="e.g. email@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (loginError) { setLoginError(''); setLoginErrorTitle(''); setLoginErrorCode(''); } }}
              required
              style={{ fontSize: '0.9rem', padding: '0.7rem 0.85rem' }}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="modal-user-password" style={{ fontSize: '0.82rem', fontWeight: '600', margin: 0 }}>
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowForgotPasswordModal(true)}
                style={{ background: 'none', border: 'none', color: '#d32b69', fontSize: '0.78rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                id="modal-user-password"
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="Enter Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (loginError) { setLoginError(''); setLoginErrorTitle(''); setLoginErrorCode(''); } }}
                required
                style={{ fontSize: '0.9rem', padding: '0.7rem 2.5rem 0.7rem 0.85rem', width: '100%' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem', fontSize: '0.95rem', background: '#d32b69', borderColor: '#d32b69', fontWeight: '700', borderRadius: '8px' }}
          >
            <i className="ti ti-login"></i> Log In
          </button>
        </form>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotPasswordModal && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setShowForgotPasswordModal(false)}
          >
            <div 
              style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '1.5rem', textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
              <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem 0' }}>Password Reset Notice</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Passwords for member and admin accounts are managed via Google OAuth or Rotaract Club Administration. Please sign in with your official Google Account or contact President Aman Yadav to reset credentials.
              </p>
              <button className="btn btn-primary" onClick={() => setShowForgotPasswordModal(false)} style={{ width: '100%' }}>
                Got It
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
