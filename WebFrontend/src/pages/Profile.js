import React, { useContext, useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { AuthContext } from '../providers/AuthProvider';
import { UserAPI } from '../api/client';
import ProtectedRoute from '../components/ProtectedRoute';

function ProfileInner() {
  const { user, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [prefs, setPrefs] = useState({ diets: user?.preferences?.diets || [], allergies: user?.preferences?.allergies || [] });
  const [message, setMessage] = useState('');

  const onSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await UserAPI.updateProfile(form);
      setMessage('Profile updated');
    } catch {
      setMessage('Update failed');
    }
  };

  const onSavePrefs = async (e) => {
    e.preventDefault();
    try {
      await UserAPI.setPreferences(prefs);
      setMessage('Preferences updated');
    } catch {
      setMessage('Update failed');
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Permanently delete your account?')) return;
    try {
      await UserAPI.deleteAccount();
      await logout();
    } catch {
      /* no-op */
    }
  };

  return (
    <main className="container">
      {message && <div role="status" aria-live="polite" className="card">{message}</div>}

      <div className="grid grid-2">
        <div className="card">
          <h2>Profile</h2>
          <form onSubmit={onSaveProfile}>
            <label htmlFor="name">Name</label>
            <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <label htmlFor="email" style={{ marginTop: 8 }}>Email</label>
            <input id="email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <button className="btn" type="submit" style={{ marginTop: 12 }}>Save</button>
          </form>
        </div>
        <div className="card">
          <h2>Preferences</h2>
          <form onSubmit={onSavePrefs}>
            <label>Dietary</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['vegetarian', 'vegan', 'gluten-free', 'keto'].map((d) => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={prefs.diets.includes(d)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...prefs.diets, d]
                        : prefs.diets.filter((x) => x !== d);
                      setPrefs({ ...prefs, diets: next });
                    }}
                  />
                  {d}
                </label>
              ))}
            </div>
            <label htmlFor="allergies" style={{ marginTop: 8 }}>Allergies (comma separated)</label>
            <input id="allergies" className="input" value={prefs.allergies.join(',')} onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            <button className="btn" type="submit" style={{ marginTop: 12 }}>Save</button>
          </form>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <button className="btn warn" onClick={onDelete}>Delete account</button>
      </div>
    </main>
  );
}

export default function Profile() {
  return (
    <AppShell>
      <Navbar />
      <ProtectedRoute>
        <ProfileInner />
      </ProtectedRoute>
    </AppShell>
  );
}
