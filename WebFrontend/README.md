# Recipe App Web Frontend (React PWA)

A production-ready Progressive Web App for discovering, saving, and cooking recipes. All data and business logic are accessed via the backend REST API.

## Features

- Authentication: email/social login, password reset
- Profile and dietary preferences
- Recipe search, filtering, CRUD, saving, rating/review
- Meal planner with grocery list generation
- Cooking mode with timers and text-to-speech
- Community feed and communities
- Premium subscription management
- Accessibility (WCAG 2.1 AA) and i18n (EN/ES)
- PWA: offline support, installable

## Getting Started

1. Copy and configure environment variables:
   - See `.env.example` and create a `.env` file with real values.

2. Install dependencies and start:
   - `npm install`
   - `npm start`

3. Build for production:
   - `npm run build`

## Configuration

- REACT_APP_API_BASE_URL: Backend API base URL
- REACT_APP_OAUTH_REDIRECT_URI: Redirect URI for social logins (must match backend)
- REACT_APP_SITE_URL: Site URL for email links used by backend
- REACT_APP_I18N_DEFAULT: Default locale (`en` or `es`)

## Code Map

- `src/api/client.js`: Backend API client (Axios)
- `src/providers/AuthProvider.js`: Auth context and session handling
- `src/providers/I18nProvider.js`: i18n strings and locale switching
- `src/router/AppRouter.js`: Client-side routes
- `src/pages/*`: UI pages for app features
- `src/components/*`: Shared UI components
- `public/manifest.json`: Web app manifest
- `src/serviceWorkerRegistration.js`: PWA service worker hook

See `ARCHITECTURE.md` for more details.
