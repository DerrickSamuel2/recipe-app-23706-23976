import React, { useContext, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Register() {
  /** Register a new account and redirect to home. */
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      nav('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="card">
          <h1>Create account</h1>
          {err && <div role="alert" style={{ color: '#ef4444' }}>{err}</div>}
          <form onSubmit={onSubmit}>
            <label htmlFor="name">Name</label>
            <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

            <label htmlFor="email" style={{ marginTop: 8 }}>Email</label>
            <input id="email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

            <label htmlFor="password" style={{ marginTop: 8 }}>Password</label>
            <input id="password" className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />

            <button className="btn" type="submit" style={{ marginTop: 12 }} disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
          </form>
        </div>
      </main>
    </AppShell>
  );
}
