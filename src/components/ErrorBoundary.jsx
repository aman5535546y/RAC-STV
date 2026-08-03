import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a runtime React error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/admin';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-surface, #121216)',
          color: 'var(--text-primary, #FFF)',
          borderRadius: '16px',
          margin: '2rem auto',
          maxWidth: '640px',
          border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))'
        }}>
          <div style={{
            fontSize: '3rem',
            color: '#EC4899',
            marginBottom: '1rem'
          }}>
            <i className="ti ti-alert-triangle"></i>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Admin Session Recovered
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            A temporary component error occurred, but the system recovered safely.
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: '#F87171',
            marginBottom: '1.5rem',
            wordBreak: 'break-word',
            maxWidth: '100%'
          }}>
            {this.state.error?.toString() || 'Unknown React Runtime Error'}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleReset}
            style={{ background: '#d32b69', borderColor: '#d32b69', padding: '0.65rem 1.4rem' }}
          >
            <i className="ti ti-refresh"></i> Reload Admin Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
