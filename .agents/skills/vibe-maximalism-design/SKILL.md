---
name: vibe-maximalism-design
description: Design system and build recipe for the "Vibe Coding Maximalism" visual style — a loud, sticker-covered, neo-brutalist-meets-maximalist look with thick black borders, hard drop shadows, rotated cards, grain texture, gradient blobs, and dual-direction marquees, built on Nuxt 3 + Tailwind CSS + daisyUI. Use this skill whenever the user asks to build a landing page, marketing site, or UI "in this style", "like the vibe coding page", "maximalism style", "neo-brutalist but colorful", or references chunky borders/sticker cards/marquee bands — even if they don't name the skill directly. Also use when extending, cloning, or restyling an existing page that already uses this system (chunky borders, volt/magenta/violet palette, Unbounded font) to keep new sections consistent with it.
---

# Vibe Coding Maximalism

A reusable design system extracted from a Nuxt + Tailwind + daisyUI landing page. It is a specific point of view, not a generic "make it maximalist" instruction — follow the tokens below exactly so new pages/sections feel like they belong to the same family. Don't reintroduce generic AI-design defaults (cream background + serif + terracotta; near-black + one acid accent; broadsheet hairline layout) — this system replaces all three with its own palette and shapes.

## When to deviate

This skill is a starting point, not a cage. If the user gives a different subject/brand with its own palette or voice, adapt the *mechanics* (chunky borders, rotation, marquee, sticker cards, grain) to their content and colors rather than copy-pasting these exact hexes. Keep the structural language; swap the surface.

## Design tokens

### Color
Six named colors, used as flat fields — no gradients on shapes themselves (gradients are reserved for the ambient background blobs only).

| Token | Hex | Role |
|---|---|---|
| `void` | `#14092B` | Primary dark background, all borders, all body text on light surfaces |
| `paper` | `#FFF9EF` | Primary light background / card surface, text on dark surfaces |
| `volt` | `#CCFF00` | Loudest accent — CTAs' outline, key stat numbers, sticker fills |
| `magenta` | `#FF2D87` | Second accent — primary buttons, alternating cards |
| `violet` | `#7C3AED` | Third accent — blobs, secondary cards, brand mark |
| `cyan` | `#00E5FF` | Fourth accent — tertiary cards, small badges |

Rule of thumb: **void + paper carry the page**; volt/magenta/violet/cyan are rationed across cards/badges/blobs so no single accent dominates. Every colored card still gets a 3px `void` border — color never replaces the border.

### Type
Three roles, never interchanged:
- **Display** — `Unbounded` (Google Fonts), weights 400–900. Headlines, card titles, buttons, stat numbers. Always `font-black` or `font-bold`, tight tracking, tight leading (`leading-[0.95]` to `leading-[1.02]`) on headlines.
- **Body** — `Plus Jakarta Sans`. Paragraphs, nav links on desktop, form copy.
- **Mono** — `JetBrains Mono`. Terminal content, eyebrows/labels (uppercase, `tracking-widest`), timestamps, footer meta.

### Shape language
- Borders: `border-[3px] border-void` on nearly everything that reads as a "card" — buttons, badges, panels, inputs. Thin default Tailwind borders don't appear anywhere.
- Shadows: hard offset shadows, no blur — `shadow-chunky` (`8px 8px 0 0 #14092B`), `shadow-chunky-sm` (`4px 4px 0 0`), and colored variants (`shadow-chunky-volt`, `shadow-chunky-magenta`) for elements sitting on a dark background where a void shadow would disappear.
- Radius: generous but not pill-everywhere — `rounded-2xl` (cards, panels), `rounded-xl` (small badges/icons), `rounded-full` (buttons, pills, inputs only).
- Rotation: small cards and badges sit at `-rotate-2` to `rotate-2` or `-rotate-12` to `rotate-12` for stickers, never perfectly square to the grid. Alternate rotation direction between siblings (`i % 2 === 0 ? 'rotate-1' : '-rotate-1'`) so a grid doesn't read as one tilted block.
- Hover: interactive chunky elements lift and grow their shadow together — `hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#14092B]` (or the volt variant on dark bg). Never lift without also growing the shadow, or the offset illusion breaks.

### Texture & atmosphere
- **Grain**: a fixed, full-viewport SVG turbulence overlay at very low opacity (`0.06`) with `mix-blend-mode: overlay`, `pointer-events: none`, `z-index` above content. One instance per page, not per section.
- **Blobs**: large (`h-72 w-72` to `h-96 w-96`) soft-edged shapes using `violet/40` or `magenta/30` at heavy `blur-3xl`, animated with a slow `border-radius` morph (12s ease-in-out). Positioned absolute, bleeding off the section edge, `pointer-events-none`. 1–2 per section max, never on every section.
- **Dot grid**: optional `radial-gradient` dot pattern (`22px 22px` cells, low-opacity white dots) layered over dark hero sections only, under the blobs.

### Motion
- `marquee` / `marquee-reverse`: two full-width bands scrolling opposite directions (22s and 26s linear infinite), each rotated slightly off-axis (`-rotate-1`) relative to the page grid. Use for taglines/quotes, not for navigation.
- `float`: gentle vertical bob (6s ease-in-out) with staggered negative `animation-delay` per sticker so they don't move in sync.
- Always wrap animations in a `prefers-reduced-motion` guard that collapses durations to ~0.

## Component recipes

These are the load-bearing patterns — reuse them rather than inventing new ones per page:

1. **Sticker badge** — small pill or rounded-xl block, 3px void border, one flat accent fill, rotated, `shadow-chunky-sm`, short mono or display micro-copy (2–4 words). Used for eyebrows, floating hero decorations, tag lists.
2. **Chunky card** — `rounded-2xl border-[3px] border-void`, flat accent or void/paper fill, `shadow-chunky` (or `-sm`), slight rotation, hover lift. This is the default "feature/benefit" container — used in bento grids, toolkit grids, pricing, etc.
3. **Terminal/console mockup** — dark panel (`#0B0518`), 3px paper border, traffic-light dots header, mono body text with a blinking cursor span, sits at a slight rotation as the hero's signature element. Reserve this pattern for one hero per page — don't repeat it as a generic decorative box elsewhere.
4. **Marquee band** — full-bleed strip, flat accent background, 3–6 short mono/display phrases repeated twice back-to-back for seamless looping, border-y 4px void.
5. **Numbered step list** (only when content is truly sequential) — big display-weight number in `volt/80`→`volt` on hover, void/5% translucent panel, hover border shifts to volt. Don't force numbering onto content that isn't actually ordered — use the chunky card grid instead.
6. **Stat block** — display-black number in one accent color per stat (cycle through the four accents), mono label underneath, inside a bordered panel — no icon needed, the number carries it.

## Copy voice

Vietnamese-first if the source page is (mirror whichever language the user's brief uses). Register: confident, playful, a little slangy — short sentences, occasional emoji used as punctuation not decoration (✨🚀🌊), active voice, no corporate hedging. Headlines lead with a plain claim, then one supporting sentence in body type. Avoid numbered markers on content that isn't a real sequence (see step 5 above).

## Build recipe (Nuxt + Tailwind + daisyUI)

1. Register Google Fonts (`Unbounded`, `Plus Jakarta Sans`, `JetBrains Mono`) via `app.head.link` in `nuxt.config.ts`.
2. In `tailwind.config.ts`, extend `fontFamily` with the three roles, add the `void/paper/volt/magenta/violet/cyan` colors, add the `chunky*` box-shadow tokens, and add `marquee`, `marquee-reverse`, `float`, `blob` keyframes/animations. Register a daisyUI custom theme mapping `primary→violet`, `secondary→magenta`, `accent→volt`, `neutral→void`, `base-100→paper`, `info→cyan`.
3. Add grain/dot-grid/noise-paper utility classes in `assets/css/main.css`, plus a `prefers-reduced-motion` block.
4. Build each section as its own component in `components/`, composed in order inside `app.vue` under `<div data-theme="your-theme">`. Keep one signature element (usually in the hero) and ration boldness elsewhere per the frontend-design principle of restraint — not every section needs blobs, stickers, *and* rotation at once.
5. Before shipping: verify keyboard focus is visible on chunky buttons/inputs, confirm reduced-motion collapses the marquees/float/blob animations, and check that no two adjacent cards share the same rotation direction or accent color.

## Reference implementation

A full working example (Nuxt 3, all components, tailwind/nuxt config) built with this system lives in the conversation history as the "vibe coding" landing page — reuse its `tailwind.config.ts` color/shadow/animation tokens and `assets/css/main.css` texture utilities verbatim as a starting point, then swap copy and section content per the new brief.
