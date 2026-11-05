import React from 'react';
import { WolfLogo } from './WolfLogo';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#07080c',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: '"Orbitron", sans-serif',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <WolfLogo size={64} style={{ filter: 'drop-shadow(0 0 20px rgba(230,0,0,0.6))' }} />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            letterSpacing: '1px',
            color: '#ff4d4d',
            marginBottom: '12px'
          }}>
            OUPS • UNE ERREUR EST SURVENUE
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#94a3b8',
            maxWidth: '500px',
            lineHeight: '1.6',
            marginBottom: '28px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            L'affichage a rencontré un problème inattendu. Cliquez ci-dessous pour actualiser la plateforme Dark Wolf Team.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '12px 28px',
              fontSize: '13px',
              fontWeight: '800',
              letterSpacing: '1px',
              color: '#ffffff',
              background: '#e60000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(230,0,0,0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            RECHARGER LE SITE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
