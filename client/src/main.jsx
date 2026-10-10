import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import App from './StudioAppMain.jsx';
import './styles.css';
import './gallery.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: "'Poppins', sans-serif", maxWidth: 600, margin: '60px auto', background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#e11d48' }}>Something went wrong</h2>
          <p style={{ color: '#4b5563' }}>{this.state.error?.message || String(this.state.error)}</p>
          <button
            style={{ background: '#005b76', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            onClick={() => { localStorage.clear(); window.location.reload(); }}
          >
            Reload Studio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
