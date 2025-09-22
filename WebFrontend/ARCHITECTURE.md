# Web Frontend Architecture

This React PWA implements the Recipe App frontend. All persistent data and business logic are accessed through the backend REST API, never directly through external services.

## Key Decisions

- React with React Router v6 for routing.
- Centralized Axios client with JWT auth interceptor (`src/api/client.js`).
- `AuthProvider` maintains token and `me` profile. Token is stored in `localStorage`.
- Accessibility (WCAG 2.1 AA):
  - Keyboard focus styles, aria labels, readable contrast, screen reader text.
  - Cooking Mode supports voice (speechSynthesis) and large touch targets.
- i18n:
  - Lightweight provider (`I18nProvider`) with EN/ES examples; can swap to i18next easily.
- PWA:
  - CRA service worker registration (`serviceWorkerRegistration.js`), `manifest.json`, icons directory placeholder.
- Pages cover: authentication, profile/preferences, recipes (search/list/detail/edit), meal planner, saved, cooking mode, community, premium.
- Security:
  - JWT in Authorization header; `withCredentials` enabled for backends using cookies.
  - No secrets in code; `.env.example` lists required variables.
  - Sanitized rendering: minimal dangerous HTML. All external actions go via backend.

## Backend Interfaces

Endpoints are defined in `src/api/client.js`. Adjust the paths to match the backend container's actual API routes. All integrations (social login, sharing, subscription) are routed through backend endpoints.

## Extensibility

- Add analytics by instrumenting route changes and API responses (via Axios interceptors).
- Add offline caching strategies by customizing service worker.

