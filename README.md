# CryptoFlow

One Next.js app containing both the **marketing website** and the signed-in **merchant dashboard**. Secure, privacy-conscious infrastructure for businesses to exchange, collect, pay out and settle digital assets.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS 4**, on one shared set of CryptoFlow design tokens.

## Quick start

```bash
cp .env.example .env.local   # then fill in HMAC_SIGNATURE_SECRET (already filled if you received .env.local)
npm install
npm run dev        # http://localhost:3000            -> website
                   # http://localhost:3000/dashboard  -> dashboard (redirects to /dashboard/overview)
npm run build
npm run start
npm run typecheck
```

Requires Node.js 20.9 or later. Fonts load through `next/font/google`, so the build machine needs access to fonts.googleapis.com.

## Routes

| URL | What |
| --- | --- |
| `/` | Homepage |
| `/platform` `/exchange` `/security` `/developers` `/use-cases` | Website placeholder pages |
| `/create-merchant` | Create a merchant account (email OTP, then `POST /merchants`) |
| `/login` | Log in (password, then email OTP to verify the session) |
| `/forgot-password` | Reset password by email OTP |
| `/accept-invite?token=…` | Team member sets a password and joins |
| `/signup`, `/demo` | Redirect to `/create-merchant` |
| `/dashboard` | Redirects to `/dashboard/overview` |
| `/dashboard/overview` `/payments` `/payouts` `/exchange` `/settlements` `/developers` | Dashboard screens (sample data) |
| `/dashboard/settings` `/roles` `/audit-log` `/profile` | Dashboard screens (live API) |

The dashboard moved from the site root to `/dashboard/*` because both projects had `/exchange` and `/developers` routes.

## API

The browser never talks to the CryptoFlow API directly. Every call goes to this app's own `/api/v1/*`, handled by `app/api/[...path]/route.ts`, which:

1. adds the HMAC request signature (`x-signature`, `x-timestamp`, `x-nonce`) on the server, using `HMAC_SIGNATURE_SECRET`, so the secret is never in the browser bundle;
2. forwards to `CRYPTOFLOW_API_URL`, passing through the bearer token, cookies and `x-device-id`;
3. returns the response, rewriting `Set-Cookie` so the `refresh_token` cookie lands on this origin.

The signature format is unchanged from the original Vite client, so the backend needs no changes.

Client side, endpoints are RTK Query slices in `lib/api/` (`auth`, `merchant`, `rbac`, `audit`, `user`), ported from the `cryptoflow-src` app. `lib/api/base.ts` refreshes the access token once on a 401 and retries. The access token stays in memory; the refresh token is kept in `sessionStorage` so a reload in the same tab stays signed in. `AuthGate` (in the dashboard shell) guards every `/dashboard` route.

| Screen | Endpoints |
| --- | --- |
| Become a merchant | `GET /location/country`, `POST /account/otp/send`, `POST /account/otp/verify`, `POST /merchants` |
| Log in | `POST /account/login`, `POST /account/otp/send` + `verify`, `GET /merchants` |
| Forgot password | `POST /account/otp/send` + `verify`, `POST /account/reset-password` |
| Accept invite | `POST /merchants/invites/accept` |
| Dashboard shell | `POST /account/refresh`, `GET /user`, `GET /merchants` |
| Business and team | `GET /merchants/:id/details`, `GET /merchants/:id/accounts`, `POST …/invites`, `…/invites/:id/reinvite`, `…/accounts/:id/suspend` and `activate`, merchant RBAC assign/remove/permissions |
| Roles | `GET/POST /rbac/roles`, `PUT/DELETE /rbac/roles/:id`, `GET /rbac/permissions` |
| Audit log | `GET /audit/merchants/:id` |
| Profile | `GET/PUT /user`, `GET /account/sessions`, member roles |

Overview, Payments, Payouts, Exchange, Settlements and Developers still use `lib/dashboard/mock-data.ts`, because `cryptoflow-src` has no endpoints for them yet. The KYB and approval-rule cards on Business and team are also still sample data and are labelled that way.

## Structure

```
app/
  layout.tsx              Root layout: fonts + website metadata
  globals.css             Design tokens, Tailwind theme mapping, website + dashboard motion
  page.tsx                Homepage
  api/[...path]/route.ts  Signing proxy to the CryptoFlow API
  create-merchant/ login/ forgot-password/ accept-invite/
  platform/ exchange/ security/ developers/ use-cases/
  dashboard/
    layout.tsx            App shell (sidebar, top bar, modals, AuthGate) + noindex metadata
    page.tsx              Redirects to /dashboard/overview
    overview|payments|payouts|exchange|settlements|developers|settings|roles|audit-log|profile/page.tsx
components/
  auth/                   AuthShell, form fields, OTP step, and the four auth forms
  providers/              StoreProvider (Redux), Toaster
  ui/                     Website primitives: Button, Badge, AssetPill, Reveal, icons
  site/                   Nav, Footer, Logo, PageStub
  sections/               Homepage sections + RateCalculator
  dashboard/
    shell/                AppShell, AuthGate, useSession, Sidebar, Topbar, TestModeBanner, DashboardContext
    team/                 InviteModal, MemberRolesModal, PermissionPicker
    screens/              One component per dashboard screen
    modals/               Modal, InvoiceModal, PayoutModal
    ui/                   Badge, Button (+ ButtonLink), DataTable, Icon, PageHeader, Segmented, StatCard, Switch
lib/
  api/                    RTK Query endpoints (base, auth, merchant, rbac, audit, user)
  store/                  Redux store and auth slice
  toast.ts, cookie.ts, device-id.ts
  content.ts              ALL homepage copy
  rates.ts                Indicative rates and quote maths (replace with live pricing API)
  dashboard/
    types.ts              Domain types, mirroring docs/dashboard/04-api-contract.md
    mock-data.ts          [SAMPLE DATA] replace with API calls
    format.ts             Status labels, badge tones, dates, money
docs/
  website/                Website handoff docs (start with 01-handoff-overview.md)
  dashboard/              Dashboard handoff docs (start with 01-handoff-overview.md)
  tokens/                 Shared design tokens (tokens.json, tokens.css)
```

The website and dashboard each keep their own `ui/` primitives. Their `Button` components have different sizing and APIs (the website's takes `href`/`onNight`; the dashboard's has a separate `ButtonLink`), so they were kept apart rather than forced into one. Import dashboard pieces from `@/components/dashboard/...` and `@/lib/dashboard/...`.

## Using the design tokens

Tokens are CSS variables in `app/globals.css`, mapped to Tailwind utilities, so use them by name (`bg-night`, `text-ink-muted`, `rounded-lg`). Never hard-code hex values in components.

## Before launch

Website (see `docs/website/06-content.md`):

1. Replace every `[PLACEHOLDER]` in `lib/content.ts` and `lib/rates.ts`.
2. Connect the rate calculator to the live pricing API (`docs/website/05-rate-calculator.md`).
3. Point `CRYPTOFLOW_API_URL` at production and set the production `HMAC_SIGNATURE_SECRET` on the host (server env vars, never `NEXT_PUBLIC_`).
4. Replace the temporary wordmark and the AssetPill letter marks with real brand assets.
5. Confirm every security and compliance statement with legal.

Dashboard (see `docs/dashboard/`):

1. As the API adds payments, payouts, exchange and settlement endpoints, add them under `lib/api/` and swap each `mock-data` import. Search for `TODO:` to find every integration point.

## Conventions

- Colours, radii and fonts only through tokens.
- Dashboard status labels and tones come from `statusMeta` in `lib/dashboard/format.ts`, never inline.
- Amounts arrive from the API as decimal strings. Never do money maths with floats in production.
- No em dashes in UI copy.

## Deploying

Any Node host works (the API proxy needs a server, so not a static export). On Vercel: import the repo, add `CRYPTOFLOW_API_URL` and `HMAC_SIGNATURE_SECRET` as environment variables, and deploy.
