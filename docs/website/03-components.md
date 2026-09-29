# Components

All live in `components/ui` and `components/sections`. They match the CryptoFlow design system components of the same name.

## Button (`components/ui/Button.tsx`)

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary`, `signal`, `secondary`, `ghost` | `primary` | `signal` only on dark bands, one per view |
| `size` | `sm` 36px, `md` 44px, `lg` 52px | `md` | |
| `onNight` | boolean | false | Light text and borders for `secondary` / `ghost` on `night` |
| `block` | boolean | false | Full width |
| `href` | string | | Renders a Next `Link`; otherwise a `<button type="button">` |

States: hover (fill darkens or lightens), active (scale 0.98), focus-visible (2px focus ring), disabled (45% opacity). Copy: verb first, sentence case ("Become a merchant", "Log in").

## Badge (`components/ui/Badge.tsx`)

`tone`: `neutral`, `positive`, `negative`, `warning`, `info`, `brand`. Always a word plus a dot; never colour alone.

## AssetPill (`components/ui/AssetPill.tsx`)

`symbol` (ticker, uppercase), optional `network`. Replace the letter mark with the issuer's official SVG icon.

## Reveal (`components/ui/Reveal.tsx`)

Wraps content that fades up when first scrolled into view. Props: `as` (element, default `div`), `delay` (seconds), `className`. Uses IntersectionObserver, runs once, shows immediately without JS support or with reduced motion.

## Icon (`components/ui/icons.tsx`)

Outline icons with `pathLength=1` so they can line-draw. Names: check, shield, wallet, lock, eye, menu, close, swap, chevron. Swap in `lucide-react` if you need more; keep stroke 1.75 to 2px.

## Nav (`components/site/Nav.tsx`)

Client component. Sticky; `scrolled` state after 40px changes height and background. Mobile menu: `aria-expanded`, `aria-controls`, locks body scroll while open.

## RateCalculator (`components/sections/RateCalculator.tsx`)

See `05-rate-calculator.md`.

## Section components (`components/sections/*`)

One per homepage section. They read copy from `lib/content.ts`. `SectionHeader` gives the eyebrow + h2 (+ optional aside) pattern used by most sections; pass `onNight` on dark bands.
