# Admin login and direct Google Ads connection

Implementation: 2026-10-13, read-only reporting and Google OAuth authorization.

## 1. Identity: protect /admin with a REAL login

Netlify Dashboard > tractariautofetesti > Identity > Enable Identity, if needed.
Registration -> Invite only. Users -> Invite the site administrator's own email.
After accepting the invitation, assign the 'admin' role in the Identity UI;
sign out and log in again to refresh role claims.
Enable Google under Identity > Registration > External providers if you
prefer 'Intră cu Google' instead of email and password. This identity provider
ONLY logs the user into /admin; it does NOT grant the Google Ads API scope.

Remove NEXT_PUBLIC_ADMIN_DEMO_ENABLED=true after confirming the real login.
Do not give dashboard access or Ads consent to demo account 1@1.com / 1234.

## 2. Google Cloud and Ads API

Google Cloud Console (https://console.cloud.google.com/) -> a project owned by
the business -> Enable the Google Ads API and apply for appropriate production
API access on the Google Ads API Overview page. Developer tokens were sunset
on 2026-09-09, so do not require or send one.

Google Auth Platform -> configure consent screen and add the authorized
admin's Google account as a test user when in Testing mode. Create an OAuth
Client ID of type 'Web application' with this exact Authorized redirect URI:

https://tractariautofetesti.netlify.app/api/admin/google-ads/callback

The OAuth client and its Cloud project must have production Google Ads API
access. A testing-mode Google consent screen can produce refresh tokens
with limited lifetime; move to the appropriate publishing/verification
status for stable automation.

Set Netlify Environment Variables as secret, functions scope, production:
- GOOGLE_ADS_CLIENT_ID
- GOOGLE_ADS_CLIENT_SECRET
- GOOGLE_ADS_OAUTH_REDIRECT_URI =
  https://tractariautofetesti.netlify.app/api/admin/google-ads/callback
- GOOGLE_ADS_OAUTH_ENCRYPTION_KEY = cryptographically random, 32 bytes base64
- GOOGLE_ADS_CUSTOMER_ID = numeric ID of approved customer account
- GOOGLE_ADS_LOGIN_CUSTOMER_ID = if access is through an MCC manager

Rebuild/deploy after setting variables, since functions read configuration at runtime.
Do not put keys, secrets, or refresh tokens into GitHub, URLs, client-side
NEXT_PUBLIC variables, chat messages or cookies.

## 3. Admin UI workflow

Authenticate as a real Netlify Identity admin. Open /admin, under
Google Ads click 'Conectează Google Ads'. Complete Google consent for
the Google Ads account and return to /admin. The function protects state
with a short-lived, encrypted, Secure, HttpOnly SameSite=Lax cookie;
uses PKCE S256, validates Identity 'admin' on both ends and checks state.
Only an encrypted refresh token is stored persistently in named Netlify
Blobs and can be revoked/deleted by 'Deconectează'.

The server refreshes tokens without repeating Google login, and the dashboard
uses GET /api/admin/google-ads and GET /api/admin/metrics independently.
The former stays read-only by default; the API scope Google provides is
adwords (capable of editing), so the application must enforce no write unless
the separate security approvals are explicitly enabled.

## Testing and operational limitations

Local builds cannot authenticate real Netlify Identity under netlify dev.
Unauthenticated calls must fail with 401 on both OAuth endpoints.
Google OAuth cannot be completed until the business owner configures their
Cloud OAuth client, consent screen, account permissions and secrets.
Metrics site are collected only after user consent. Demo data are not real.
Google Ads campaign changes were not made by this feature.
