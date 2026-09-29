# Content and placeholders

All homepage copy is in `lib/content.ts`.

## Must replace or confirm before launch

| Item | Where | Owner |
| --- | --- | --- |
| Legal entity and registration line | `footer.legal` | Legal |
| Regulatory disclosure | `footer.disclosure` | Legal |
| Indicative prices and fee | `lib/rates.ts` | Product / pricing |
| "Approved fast. Live the same day." is a promise | `components/sections/GettingStarted.tsx`, `steps[0]` | Compliance / ops |
| Privacy and security claims (data minimisation, segregated addresses, least-privilege access, never sold) | `privacy` | Legal / security |
| "Quotes held for 30 seconds", "dedicated desk support", "on-chain hash" | `exchange.points` | Product |
| Supported assets and networks | `assets`, `features[5]` | Product |
| Logo | `components/site/Logo.tsx` | Brand |
| Token icons | `components/ui/AssetPill.tsx` | Brand |
| Routes for Log in and Become a merchant (both live, wired to the API) | `nav` | Engineering |

## What each inner page needs

**Platform**: full product list; supported assets per network; settlement banks, currencies and timings; pricing or "custom by volume"; account tiers and limits.

**Exchange**: live rate source and refresh interval; fee or spread model and volume tiers; rate-lock rules; min and max trade sizes and OTC handling; timing per stage.

**Security**: licences and registrations you may publish; custody model and wallet provider, cold and hot storage, multi-sig or MPC; KYB, AML screening provider, Travel Rule approach; data collection, storage location, retention, encryption, access; certifications and audits; security contact.

**Developers**: API reference link; sandbox access; authentication; webhook events and signing; idempotency and rate limits; SDKs; status page.

**Use cases**: three to five target segments, each with problem, solution, products used and flow; proof such as pilots or case studies, with permission.

## Voice rules (from the brand book)

- Direct and specific: say what happens to the money.
- Sentence case for headlines and buttons. Tickers uppercase.
- Always show unit and network for amounts ("250.00 USDT on Tron").
- No emoji, no hype words, no em dashes.
- Trust copy names the control rather than claiming "bank-grade security".
