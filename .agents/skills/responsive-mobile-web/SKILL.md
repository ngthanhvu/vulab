---
name: responsive-mobile-web
description: Guidance for building or fixing responsive web UI that works well on mobile devices, covering both CSS technique (breakpoints, fluid layout, units) and mobile UX (touch targets, thumb zones, performance, mobile-specific interaction patterns). Applies to plain HTML/CSS and to React/Tailwind projects alike. Use this skill whenever the user asks to make a page/site/component "responsive," "mobile-friendly," "mobile-first," fix layout issues on small screens, build a page meant to work on phones, or review/audit an existing UI for mobile usability — even if they don't say the word "responsive" explicitly (e.g. "this looks broken on my phone", "make this work on small screens", "optimize for mobile").
---

# Responsive Mobile Web Design

Act as a front-end engineer who specializes in shipping UI that actually works on real phones, not just at a resized desktop-browser width. Two things break most "responsive" pages: relying on breakpoints alone instead of fluid layout, and designing only for pointer/hover interaction instead of touch.

## Core approach: mobile-first, fluid by default

- Write base (unprefixed) CSS for the smallest screen, then layer up with `min-width` media queries for larger screens. Avoid `max-width`-only approaches that start desktop and shrink down — they fight the browser's natural flow.
- Prefer fluid techniques over fixed breakpoints wherever possible: `flex-wrap`, CSS Grid with `auto-fit`/`auto-fill` and `minmax()`, `clamp()` for font sizes and spacing, and percentage/`fr` units. A layout that flexes continuously survives odd viewport widths (foldables, split-screen, browser zoom) that fixed breakpoints miss.
- Only add explicit breakpoints when the fluid approach genuinely needs a structural change (e.g. nav collapses to a hamburger, a 3-column grid becomes 1-column). Common reference widths: `480px` (small phone), `768px` (tablet/phone landscape), `1024px` (small laptop) — but let the content dictate the actual breakpoint, not these numbers.
- Never hardcode pixel widths on containers that should flex. Use `max-width` + `width: 100%` instead of fixed `width`.
- Set the viewport meta tag on any raw HTML page: `<meta name="viewport" content="width=device-width, initial-scale=1">`. Without it, mobile browsers render at a fake desktop width and "responsive" CSS never engages.

## Layout primitives

- **Flexbox** for one-dimensional layouts (nav bars, button rows, card headers) that need to wrap or reflow. Use `flex-wrap: wrap` + `gap` instead of margin hacks.
- **CSS Grid** for two-dimensional layouts (card grids, dashboards). `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` gives a responsive grid with zero media queries.
- **Container queries** (`@container`) when a component's layout should respond to its own container width rather than the viewport — the right tool for reusable components (cards, widgets) used in varying contexts. Check browser support needs before relying on this as the only mechanism.
- Avoid nested fixed-height containers; let content determine height and use `min-height` sparingly. Fixed heights are the most common cause of mobile overflow/clipping bugs.

## Typography and spacing

- Base font size stays at or above `16px` for body text — anything smaller triggers automatic zoom-on-focus in iOS Safari on form inputs, and is genuinely hard to read on a phone at arm's length.
- Use `clamp(min, preferred, max)` for headline sizes so type scales with viewport instead of jumping at breakpoints, e.g. `font-size: clamp(1.5rem, 4vw + 1rem, 3rem)`.
- Line length: keep body text roughly 45–75 characters per line even on wide viewports — use `max-width: 65ch` on text containers rather than letting text stretch edge-to-edge.
- Respect safe areas on notched devices: `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` on full-bleed fixed elements (headers, bottom nav, modals).

## Touch and interaction (the part desktop-first thinking misses)

- Minimum touch target: **44×44px** (Apple HIG) or **48×48px** (Material Design) — treat 44px as the floor. This applies to the tappable hit area, not just the visible icon; pad a small icon button out to size with padding rather than shrinking the target.
- Keep at least 8px of spacing between adjacent tappable elements to prevent mis-taps.
- Never rely on `:hover` alone to reveal functionality (tooltips, dropdown menus, "reveal on hover" actions) — there is no hover on touch. Provide a tap-triggered or always-visible equivalent. `:hover` styles are fine as a *progressive enhancement* for devices that support it (`@media (hover: hover)`), never as the only path to a feature.
- Design for the thumb zone: put primary actions (submit, continue, add-to-cart) in the lower half of the screen or in a sticky bottom bar; put low-frequency/destructive actions (settings, delete) further from easy reach or behind confirmation. One-handed use is the common case, not the edge case.
- Avoid custom `onClick`-only interactive `<div>`s — use real `<button>`/`<a>` elements so they get correct touch behavior, focus handling, and no 300ms tap-delay quirks.
- Disable double-tap-to-zoom side effects only if you also provide an accessible alternative (pinch-zoom should generally stay enabled for accessibility — don't set `user-scalable=no` unless you have a strong reason).
- Forms: use the right `<input type>` and `inputmode` (`email`, `tel`, `numeric`, `decimal`) so mobile keyboards show the right layout. Use native `<select>`, date pickers, etc. over custom-built equivalents when possible — native controls are already touch-optimized.

## Images and performance

- Always set explicit `width`/`height` (or `aspect-ratio`) on images so the browser reserves space and avoids layout shift while loading.
- Use `srcset`/`sizes` or `<picture>` to serve smaller images to small viewports — don't ship a 2000px desktop hero image to a 375px-wide phone on cellular data.
- Lazy-load offscreen images (`loading="lazy"`) and defer non-critical JS/CSS.
- Mobile is disproportionately bandwidth- and CPU-constrained: prefer CSS transforms/opacity for animation (GPU-accelerated) over animating layout properties (`width`, `top`, `left`) which are expensive and janky on mobile hardware.

## Navigation patterns for small screens

- Collapse horizontal nav into a hamburger/drawer, bottom tab bar, or scrollable horizontal chip row — pick based on number of items and frequency of use (bottom tabs for 3–5 primary destinations, drawer for long/secondary lists).
- Sticky headers should stay short on mobile (large hero headers eat too much of a small viewport) — consider shrinking or hiding on scroll.
- Modals/sheets: prefer full-screen or bottom-sheet patterns over small centered desktop-style modals, which are cramped and hard to dismiss on a phone.

## Framework notes

**Plain HTML/CSS**: apply the above directly. Structure CSS mobile-first (base styles unprefixed, `min-width` queries layered on top).

**React/Tailwind**: Tailwind is mobile-first by default — unprefixed utilities apply to all sizes, and `sm:`/`md:`/`lg:`/`xl:` prefixes add overrides upward, so write the no-prefix classes for the mobile layout first, then layer breakpoint prefixes for larger screens (matches the mobile-first principle above, don't fight it by designing desktop classes first and trying to override them down). Use Tailwind's `gap-*`, `flex-wrap`, and `grid-cols-*` with `auto-fit`-style patterns via arbitrary values (`grid-cols-[repeat(auto-fit,minmax(240px,1fr))]`) when a fluid grid fits better than fixed breakpoint columns. For touch targets, size interactive elements with `min-h-11 min-w-11` (44px) or larger, not just `p-2` on an icon.

## Reviewing/auditing an existing page

When asked to fix or audit an existing UI for mobile, check in this order (most common real-world breakage first):
1. Missing/misconfigured viewport meta tag
2. Fixed-width elements wider than 375–390px causing horizontal scroll
3. Text below 16px in form inputs, or line lengths that are too long/short
4. Touch targets under 44px or crowded together
5. Hover-only affordances with no touch equivalent
6. Images without responsive sizing causing slow loads or layout shift
7. Fixed-height containers clipping content
8. Bottom-of-screen content hidden behind mobile browser chrome or notches (missing safe-area insets)

If you have browser/screenshot tooling available, actually render the page at a mobile viewport (375×667 or similar) rather than reasoning about it purely from the code.
