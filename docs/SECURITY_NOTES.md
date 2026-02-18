# Security Notes

## Principles
1. **No Shared Secrets**: Secrets must never be committed to the repository.
2. **Environment Scoping**: Use `.env` for local and `.env.production` for VPS.
3. **Audit Trails**: All sensitive actions are logged (via Winston/Sentry).

## Secret Management
- **Local Dev**: Use `.env.example` as a template.
- **Production**:
    - Secrets are injected via the host OS or a secure vault.
    - Infrastructure passwords (DB, Redis) must be rotated periodically.
    - Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`.

## Auth Security
- **Auth Bypass**: `ORI_AUTH_BYPASS` is strictly disabled in production via code-level guards in `JwtAuthGuard`.
- **JWT**: Tokens include `organizationId` for strict data isolation.
- **Password Hashing**: Always use `bcrypt` with appropriate salt rounds (default 10).

## Rotation Schedule
- **API Keys (OpenAI, Resend)**: Every 90 days.
- **DB Passwords**: Every 180 days.
- **SSL Certificates**: Auto-renewed via Let's Encrypt (Nginx Proxy Manager).
