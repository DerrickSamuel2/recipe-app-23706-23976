# Security Notes

- Do not commit real secrets. Configure environment variables via `.env` (see `.env.example`).
- Authentication:
  - JWT stored in localStorage for demo simplicity. Consider using `HttpOnly` secure cookies for production to mitigate XSS token theft.
  - Axios attaches token in `Authorization: Bearer` header.
- Transport security:
  - Use HTTPS and HSTS in production.
- Content Security Policy (CSP):
  - Configure CSP headers at hosting layer to restrict script sources. Example:
    `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.example.com;`
- Privacy:
  - Provide GDPR/CCPA user controls via backend endpoints (data export/delete).
