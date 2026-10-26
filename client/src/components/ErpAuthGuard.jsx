import { useState, useEffect } from 'react';

/**
 * Validates JWT without external dependencies
 */
function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ErpAuthGuard({ children }) {
  const [authStatus, setAuthStatus] = useState({
    checked: false,
    authorized: false,
    user: null,
    reason: '',
  });

  useEffect(() => {
    // 1. Localhost development bypass (allows local testing without blocking developer)
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('erp_token');
    const userFromUrl = params.get('erp_user');

    // On localhost, if no token is provided, allow developer access
    if (isLocal && !tokenFromUrl && !sessionStorage.getItem('erp_token')) {
      setAuthStatus({
        checked: true,
        authorized: true,
        user: { name: 'Local Developer', role: 'Dev' },
        reason: '',
      });
      return;
    }

    // 2. Token extraction (from URL on launch, or from this tab's sessionStorage)
    const token = tokenFromUrl || sessionStorage.getItem('erp_token');
    const user = userFromUrl || sessionStorage.getItem('erp_user');

    if (!token) {
      setAuthStatus({
        checked: true,
        authorized: false,
        reason: 'Direct access is blocked. Brochure Studio must be launched from Panther ERP.',
      });
      return;
    }

    // 3. Verify JWT token structure and expiration
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
      setAuthStatus({
        checked: true,
        authorized: false,
        reason: 'Invalid ERP authorization token.',
      });
      return;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (nowSeconds >= payload.exp) {
      setAuthStatus({
        checked: true,
        authorized: false,
        reason: 'Your Panther ERP session has expired. Please launch Brochure Studio again from Panther ERP.',
      });
      return;
    }

    // 4. Referrer & Opener Verification:
    // When opened from Panther ERP:
    // - document.referrer contains "pantherp.in"
    // - OR window.opener exists (opened via "Open in new tab" from Panther ERP)
    // - OR window.self !== window.top (embedded inside Panther ERP iframe)
    // - OR active tab session was already verified earlier
    const referrer = document.referrer || '';
    const hasPantherReferrer =
      referrer.includes('pantherp.in') ||
      referrer.includes('oneomics.in') ||
      referrer.includes('myomics.ai');
    const hasOpener = window.opener !== null;
    const isInIframe = window.self !== window.top;
    const isExistingSession = sessionStorage.getItem('erp_session_verified') === 'true';

    // If opened in a completely separate browser or pasted as a bare link without coming from Panther ERP
    if (!isLocal && !hasPantherReferrer && !hasOpener && !isInIframe && !isExistingSession) {
      setAuthStatus({
        checked: true,
        authorized: false,
        reason: 'Security violation: This link cannot be opened in an external or unauthorized browser. Please open directly from Panther ERP.',
      });
      return;
    }

    // 5. Authorized! Save session in this tab and SCRUB the URL immediately
    sessionStorage.setItem('erp_token', token);
    sessionStorage.setItem('erp_session_verified', 'true');
    if (user) sessionStorage.setItem('erp_user', user);

    // Remove token from browser address bar so users cannot copy-paste the token into other browsers
    if (tokenFromUrl) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    setAuthStatus({
      checked: true,
      authorized: true,
      user: { name: user || `User #${payload.user_id}`, role: payload.role },
      reason: '',
    });
  }, []);

  // While checking
  if (!authStatus.checked) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          fontFamily: "'Segoe UI', -apple-system, sans-serif",
          color: '#475569',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Verifying Panther ERP Authorization...</div>
        </div>
      </div>
    );
  }

  // If unauthorized / blocked
  if (!authStatus.authorized) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: "'Segoe UI', -apple-system, sans-serif",
          padding: 20,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            maxWidth: 480,
            width: '100%',
            padding: '36px 32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              margin: '0 auto 16px',
            }}
          >
            ✕
          </div>

          <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
            Access Restricted
          </h2>

          <p style={{ margin: '0 0 20px', fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>
            {authStatus.reason}
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: 12,
              color: '#475569',
              marginBottom: 24,
              textAlign: 'left',
              lineHeight: 1.5,
            }}
          >
            <b>Security Policy:</b> Brochure Studio is restricted to authorized sessions. It can only be accessed through your authenticated <b>Panther ERP</b> portal.
          </div>

          <a
            href="https://pantherp.in"
            style={{
              display: 'inline-block',
              background: '#005b76',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,91,118,0.3)',
            }}
          >
            Open Panther ERP
          </a>
        </div>
      </div>
    );
  }

  // Authorized: render the app!
  return children;
}
