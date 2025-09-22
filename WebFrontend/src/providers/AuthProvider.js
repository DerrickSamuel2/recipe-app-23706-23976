import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthAPI } from '../api/client';

export const AuthContext = createContext(null);

function getStoredToken() {
  return localStorage.getItem('auth_token') || null;
}

function storeToken(token) {
  if (token) localStorage.setItem('auth_token', token);
  else localStorage.removeItem('auth_token');
}

function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return !exp || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

/**
 * AuthProvider wraps app to provide authentication state and helpers.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    let isMounted = true;
    async function loadMe() {
      if (token && !isTokenExpired(token)) {
        try {
          const data = await AuthAPI.me();
          if (isMounted) setUser(data);
        } catch {
          if (isMounted) {
            setUser(null);
            setToken(null);
            storeToken(null);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadMe();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (email, password) => {
    /** Authenticate and persist token; loads user profile. */
    const { token: t, user: u } = await AuthAPI.loginEmail({ email, password });
    setToken(t);
    storeToken(t);
    setUser(u);
    return u;
  }, []);

  // PUBLIC_INTERFACE
  const register = useCallback(async (name, email, password) => {
    /** Register a user and persist session. */
    const { token: t, user: u } = await AuthAPI.registerEmail({ name, email, password });
    setToken(t);
    storeToken(t);
    setUser(u);
    return u;
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(async () => {
    /** Invalidate session and clear token. */
    try {
      await AuthAPI.logout();
    } catch { /* ignore */ }
    setUser(null);
    setToken(null);
    storeToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user && !!token && !isTokenExpired(token),
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
