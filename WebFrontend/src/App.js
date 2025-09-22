import React, { useEffect, useState } from 'react';
import './App.css';

/**
 * AppShell provides theme toggle and layout container.
 * Used by pages as a common wrapper.
 */
export default function AppShell({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="sr-only" aria-live="polite">
        Recipe App PWA
      </header>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      {children}
    </div>
  );
}
