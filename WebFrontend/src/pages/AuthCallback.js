import React, { useEffect, useState, useContext } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/client';
import { AuthContext } from '../providers/AuthProvider';

// PUBLIC_INTERFACE
export default function AuthCallback() {
  /** Handles OAuth/social provider callback; exchanges code for token via backend and logs the user in. */
  const location = useLocation();
  const navigate = useNavigate();
  const { } = useContext(AuthContext);
  const [message, setMessage] = useState('Completing sign-in...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const provider = params.get('provider') || 'google';
    if (!code) {
      setMessage('Missing authorization code.');
      return;
    }
    AuthAPI.socialLogin(provider, code)
      .then(({ token, user }) => {
        // Store token and redirect. Use localStorage to share with AuthProvider interceptor.
        localStorage.setItem('auth_token', token);
        setMessage(`Welcome back, ${user?.name || 'chef'}! Redirecting...`);
        setTimeout(() => navigate('/', { replace: true }), 800);
      })
      .catch(() => setMessage('Social login failed. Please try again.'));
  }, [location, navigate]);

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="card" role="status" aria-live="polite">
          {message}
        </div>
      </main>
    </AppShell>
  );
}
