# Design spec

## Foundations

| | Value |
| --- | --- |
| Content width | 1200px max, centred |
| Page gutter | 16px under 640px, 32px from 640px, 0 from 1264px (content hits 1200px) |
| Breakpoints | `sm` 640px, `lg` 1024px (layout switches from stacked to multi-column at `lg`) |
| Section padding | 64px top/bottom on mobile, 96px from `lg` (privacy band: 112px) |
| Headline to content gap | 40px mobile, 48px desktop |
| Spacing scale | 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| Radii | sm 6px (badges), md 10px (buttons, inputs), lg 16px (cards), xl 24px (large cards, calculator), full (pills) |
| Shadows | `--shadow-card` on the calculator only; `--shadow-pop` on card hover |
| Focus ring | 2px solid `--focus`, 2px offset, on every interactive element |

## Type

| Style | Font | Size / line height | Weight | Tracking | Used for |
| --- | --- | --- | --- | --- | --- |
| Hero | Bricolage Grotesque | 88/90 desktop, 48/50 mobile | 700 | -0.04em | Hero headline only |
| h2 | Bricolage Grotesque | 52/56 desktop, 34/38 mobile | 700 | -0.025em | Section headlines |
| Card title (large) | Bricolage Grotesque | 32/38 desktop, 26/30 mobile | 600 | -0.02em | Platform pillars |
| Card title | Geist | 20/28 | 600 | -0.01em | Feature, use-case cards |
| Lead | Geist | 18/28 (21/32 in hero) | 400 | 0 | Section intros |
| Body | Geist | 15/24 | 400 | 0 | Default |
| Label | Geist | 14/20 | 500 | 0 | Buttons, nav |
| Caption | Geist | 13/18, 12/18 | 400 | 0 | Hints, footnotes |
| Eyebrow | Geist Mono | 12/16 | 500 | 0.08em, uppercase | Above h2 |
| Figures | Geist Mono | 40/44 | 500 | 0 | Step numbers |

## Colour usage

- Page ground `surface-100`; raised sections and cards `surface-200`; wells `surface-300`.
- Dark bands use `night` with `on-night` / `on-night-muted` text: nav, hero, privacy, footer, the middle platform pillar.
- `brand` (green) for primary actions, links, ticks and figures on light grounds.
- `signal` (lime) as a fill only, with `on-signal` text: hero CTA, nav CTA, final CTA panel, privacy icon tiles, logo dot. Never lime text on light grounds.

## Sections (top to bottom)

1. **Nav** (sticky, `night`): 80px tall desktop, 64px mobile; shrinks to 64/56px after 40px scroll. Logo left, 5 links (desktop), right: Log in (ghost), Become a merchant (signal). Mobile: Log in + menu button (44px), full-height menu panel.
2. **Hero** (`night`): centred on desktop, left-aligned on mobile. Headline (accent phrase in `signal`), one-line sub, Become a merchant (signal, lg). Padding 128/128 desktop, 72/72 mobile.
3. **Supported assets** (`surface-200`, bottom border): eyebrow + marquee of AssetPills, edge fade mask.
4. **Platform**: header with aside paragraph; 3 pillars (middle one dark), each with number, title, body, three ticks.
5. **Exchange** (`surface-200`, top and bottom borders): text column (eyebrow, h2, lead, four ticks, Request a quote + See supported pairs) and the Rate calculator (max 460px).
6. **Privacy** (`night`): header with aside; four cards (`night-raised`, `line-night` border) with lime icon tile.
7. **What you get**: six feature cards, 3 columns desktop, 2 at `sm`, 1 on mobile.
8. **Getting started** (`surface-200`): "Approved fast. Live the same day." Three steps in a row with a green progress line that fills on reveal.
9. **Developers**: 5/7 split; text + two buttons left, four API capability cards right.
10. **Use cases** (`surface-200`): four link columns over a top rule.
11. **Final CTA**: lime panel (radius xl), headline + line, Become a merchant (night fill).
12. **Footer** (`night`): logo + blurb, four link columns, legal line and disclosure.

## Responsive rules

- Everything stacks to one column under `lg`, except feature and privacy cards (2 columns from `sm`).
- CTA pairs stack full-width on mobile.
- No horizontal scroll at 360px. The calculator figures drop to 26px under `sm`.
- Touch targets at least 44px.
