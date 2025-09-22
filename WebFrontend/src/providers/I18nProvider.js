import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Simple in-app i18n provider; can be swapped with i18next if desired.
 * This minimal solution loads string maps and exposes t() and setLocale().
 */
const dictionaries = {
  en: {
    app_title: 'Recipe App',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    search: 'Search',
    saved: 'Saved',
    profile: 'Profile',
    recipes: 'Recipes',
    meal_planner: 'Meal Planner',
    cooking_mode: 'Cooking Mode',
    community: 'Community',
    premium: 'Premium',
  },
  es: {
    app_title: 'Aplicación de Recetas',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    register: 'Registrarse',
    email: 'Correo',
    password: 'Contraseña',
    name: 'Nombre',
    search: 'Buscar',
    saved: 'Guardado',
    profile: 'Perfil',
    recipes: 'Recetas',
    meal_planner: 'Planificador',
    cooking_mode: 'Modo Cocina',
    community: 'Comunidad',
    premium: 'Premium',
  },
};

const I18nContext = createContext({
  locale: 'en',
  t: (key) => key,
  setLocale: () => {},
});

// PUBLIC_INTERFACE
export function I18nProvider({ children }) {
  /** Provide translation helpers and locale management. */
  const [locale, setLocaleState] = useState(process.env.REACT_APP_I18N_DEFAULT || 'en');

  const setLocale = useCallback((l) => setLocaleState(l), []);

  const t = useCallback(
    (key) => (dictionaries[locale] && dictionaries[locale][key]) || key,
    [locale]
  );

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// PUBLIC_INTERFACE
export function useI18n() {
  /** Access i18n context (t, setLocale, locale). */
  return useContext(I18nContext);
}
