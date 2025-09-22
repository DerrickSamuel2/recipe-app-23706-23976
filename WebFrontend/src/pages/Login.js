import React, { useContext, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthAPI } from '../api/client';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login via email/password; supports link to password reset and social login. */
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const socialStart = (provider) => {
    // Redirect to backend OAuth provider start
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/${provider}?redirect_uri=${encodeURIComponent(process.env.REACT_APP_OAUTH_REDIRECT_URI || window.location.origin + '/auth/callback')}`;
  };

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="card" role="form" aria-label="Login form">
          <h1>Login</h1>
          {err && <div role="alert" style={{ color: '#ef4444' }}>{err}</div>}
          <form onSubmit={onSubmit}>
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />

            <label htmlFor="password" style={{ marginTop: 8 }}>Password</label>
            <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn" type="submit" disabled={loading} aria-busy={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
              <a className="btn secondary" href="/reset">Forgot password?</a>
            </div>
          </form>

          <hr style={{ margin: '1rem 0' }} />

          <div>
            <p>Or continue with</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn secondary" onClick={() => socialStart('google')} aria-label="Continue with Google">Google</button>
              <button className="btn secondary" onClick={() => socialStart('apple')} aria-label="Continue with Apple">Apple</button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
