import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../providers/I18nProvider';
import { AuthContext } from '../providers/AuthProvider';
import { useContext } from 'react';

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-content">
        <Link to="/" aria-label={t('app_title')} style={{ fontWeight: 800 }}>
          🍳 {t('app_title')}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/recipes" end>{t('recipes')}</NavLink>
          <NavLink to="/planner">{t('meal_planner')}</NavLink>
          <NavLink to="/community">{t('community')}</NavLink>
          <NavLink to="/premium">{t('premium')}</NavLink>
          {user ? (
            <>
              <NavLink to="/saved">{t('saved')}</NavLink>
              <NavLink to="/profile">{t('profile')}</NavLink>
              <button className="btn secondary" onClick={logout} aria-label="Logout">{t('logout')}</button>
            </>
          ) : (
            <>
              <NavLink to="/login">{t('login')}</NavLink>
              <NavLink to="/register">{t('register')}</NavLink>
            </>
          )}
          <select
            aria-label="Language"
            className="select"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            style={{ marginLeft: '0.75rem' }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
