# CryptoFlow — Frontend

A React + Vite + TypeScript + Tailwind implementation of the CryptoFlow UI/UX PRD:
a multi-chain anonymous exchange + merchant payments dashboard.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production bundle in `dist/`.

## Design system

- **Palette:** deep navy "ink" chrome, cobalt blue primary, teal reserved exclusively
  for sandbox mode (persistent, non-dismissable banner), green/amber/red for
  success/warning/danger, per-chain accent colors for badges.
- **Type:** Sora for display/headings, Manrope for UI text, IBM Plex Mono for every
  balance, address, transaction ID, and recovery code (tabular numerals).
- **Motion:** restrained — a hero mesh gradient, rise-in on modals/toasts, a soft
  pulse on the active step of a stepper. No per-card hover choreography.

## What's implemented

**Public / anonymous exchange**
- Landing page with live Swap / Buy / Sell widget, bidirectional amount calc
- Order creation wizard (pair → destination → refund → review with rate-lock
  countdown → recovery-code capture, gated behind a confirmation checkbox)
- Deposit & status page with full status stepper, rate-lock + deposit-window
  countdowns, and a sandbox devtools panel to simulate underpayment, overpayment,
  rate expiry, and state advancement
- Recovery-code lookup with intentionally generic "not found" messaging
- Public invoice payment page

**Merchant onboarding**
- Sign up, email verification, multi-step KYB submission (business info,
  beneficial owners, documents, review)
- Verification status page with all five states, switchable via sandbox devtools

**Merchant dashboard**
- Home: balance summary, wallet list, activity feed, quick actions
- Per-chain wallet detail with testnet faucet action and transaction history
- Invoices: list with filters + empty state, multi-step creation, detail view
- Payouts: single-payout form with fee estimate and confirmation modal;
  bulk payout with CSV upload → validation table → confirmation → progress →
  results; payout history
- Developers: onboarding checklist, API key management (one-time reveal),
  webhook list, in-browser signature verifier
- Analytics: volume-over-time area chart, top currencies, top recipients

**Global**
- Persistent sandbox banner and environment toggle
- Context-aware floating support chat with proactive prompts tied to route
- Toast notifications, confirmation modals, chain badges, status pills,
  countdowns, and a reusable status stepper

## Scope notes

This covers the primary flow and representative states for every screen in the
PRD rather than every listed edge case (e.g. not every error/loading permutation
is wired up, and data is mocked in `src/lib/data.ts` rather than fetched from a
real API). It's built to be a realistic, extensible starting point — the
component structure (ChainBadge, StatusStepper, ConfirmModal, etc.) mirrors the
"design once, reuse everywhere" components called out in the PRD, so wiring in
real data or adding more states should mostly mean extending existing files
rather than restructuring them.
