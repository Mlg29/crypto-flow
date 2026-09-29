# Developer handoff: overview

This pack has three parts. Use them together.

| Part | What it is | Use it for |
| --- | --- | --- |
| **1. Design artifacts** | The CryptoFlow website canvas (desktop and mobile artboards) and the CryptoFlow design system, both on claude.ai | Visual reference, clicking through interactions in Play mode, component previews, brand book |
| **2. Handoff docs** | This `docs/` folder | Exact specs: spacing, type, states, breakpoints, motion, calculator logic, content |
| **3. Starter codebase** | This Next.js + Tailwind repo | The production starting point. It already implements the homepage |

## 1. Design artifacts

Ask the product owner to share both links with you (they are private until shared from each page's Share menu):

- **CryptoFlow Website** (canvas): `Homepage · Desktop` (1440px) and `Homepage · Mobile` (390px). Press Play on an artboard to try the rate calculator and hover states.
- **CryptoFlow** (design system): tokens, brand book (voice, colour, type, spacing, iconography), and live component previews.

**Source of truth order:** design system tokens > this codebase > canvas artboards. If they disagree, the design system wins; raise it with design.

## 2. What is already built

- Homepage with all ten sections, responsive from 360px to 1440px+
- Sticky nav that shrinks on scroll, mobile menu, Log in / Become a merchant
- Working rate calculator with indicative rates, count-up, rate-lock countdown, validation
- All motion from the design, with `prefers-reduced-motion` support
- Placeholder routes for Platform, Exchange, Security, Developers, Use cases, Sign up, Demo, Log in. Each lists the content it still needs

## 3. What is left for engineering

1. Live pricing API for the calculator (`05-rate-calculator.md`)
2. Demo request form and CRM connection; sign-up and log-in routing to the app
3. Full designs for the inner pages (content list in `06-content.md`)
4. Real logo and official token icons
5. Analytics, cookie consent, SEO metadata per page, Open Graph images
6. Accessibility pass with real assistive tech (the build follows WCAG 2.1 AA patterns: labelled inputs, focus rings, 4.5:1 text contrast, reduced motion)

## Conventions

- Copy lives in `lib/content.ts`. Components only render it.
- Colours, radii and fonts only through tokens (`bg-brand`, `rounded-lg`, `font-display`).
- Animate only `transform` and `opacity` (plus the documented exceptions in `04-motion.md`).
- No em dashes in UI copy (brand rule).
