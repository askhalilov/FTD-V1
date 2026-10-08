# FTD.LAB / Coming Soon v4

A self-contained, responsive HTML / CSS / vanilla JavaScript coming-soon website based on the FTD.LAB concept mockup.

## Changes in v4

- Designed for the browser's normal 100% zoom. A shared, centered container is capped at 1680 px; the main composition is capped at 980 px high on wide desktops.
- Two desktop columns keep the headline and mascot apart. The headline scales with its own column, and the scene stays attached to the adjacent column rather than the viewport edge.
- At 1000 px and below, the composition stacks vertically. Mobile gutters, typography, buttons and footer adapt down to 320 px. Short desktop windows use smaller vertical spacing to keep the CTA visible.
- The first screen reveals after the mascot and logo have loaded and decoded, with a subtle logo loader during the wait and staggered text/scene entrances. There is no minimum loading delay; a 2.5 second timeout prevents slow resources from blocking the page.
- The second section fades in when scrolled into view. Without JavaScript it stays visible; reduced motion disables the animated loader and entrances. A separate 4 second fallback reveals the page if the main script cannot run.
- Laptop artwork and live code still scale and animate together in one SVG.

## Changes in v3

- Solid page background `#050A0D`, sampled from the supplied color reference, across desktop, mobile and the second section. Background beams, ambient gradients and noise have been removed.
- The laptop artwork and live editor now share one SVG coordinate system, so they scale and float together.
- The animated code replaces the complete native code area, preserving the original title, sidebar, window controls and bezel. No baked code or second cursor remains visible.
- The editor uses a four-corner perspective projection rather than the smaller, skewed overlay from v2.

## Run it

Open `index.html` in any modern browser, or serve this directory using `python -m http.server 4173` and open http://localhost:4173/.

## Fonts

Font files are **not bundled**. If you have the FTD.LAB brand fonts, place these two files yourself in `assets/fonts/`:

- `drukwidecyr-bold.otf`
- `helveticaneuecyr-roman.ttf`

The website works with system fallbacks (Impact/Arial) until you add them. It uses real HTML text for the COMING SOON headline so it remains responsive and selectable.

## Live animations

- Letter-by-letter typing / looping erase on the laptop's screen, in brand cyan / white, with 3 real-looking FTD.LAB-themed snippets
- Live SVG code projected into the laptop's native editor area (not a static video)
- Glowing 'Website in progress' light, subtle breathing / floating, rising text and animated scroll mouse
- Reduced-motion accessibility (animation disables automatically when OS prefers reduced motion)

## Adjust

- To change the maximum layout width or gutters: `css/style.css` -> `--container-width` and `--page-gutter`
- To adjust responsive layout: `css/style.css` -> `.hero-inner` and the media queries
- To adjust page loading/reveal behavior: `js/main.js` -> `imageReady`, `ready` and `enableSectionReveals`
- To change the code: `js/main.js` -> `snippets` array
- To change Telegram: search for `https://t.me/artemftdlab` in `index.html`
- To change colors: `css/style.css` -> `:root` variables
- To adjust the laptop editor alignment: `css/style.css` -> `.screen-plane`. The source artwork is 1122 × 1402 and the editor corners are TL (685, 423), TR (979, 460), BR (943, 628), BL (653, 578). Recalculate the projective matrix if replacing the artwork.

No build dependencies. No external CDNs. No third-party tracking. All asset paths are relative.

Deployment update.
