# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A CSS design token system for e-commerce storefronts. One seller-defined base size (`--user-base-size`, clamped 14-18px) drives all computed type and spacing tokens. No build tools, no frameworks — static HTML/CSS/JS.

## Development

Open `index.html` in a browser (or use a local server). There is no build step, no package manager, and no test suite. Deploys as a static site on Vercel.

## Architecture

### Token system (`cms-design-system.css`)

The token hierarchy flows: **user input -> clamped base -> primitive tokens -> semantic aliases**.

- `--user-base-size` is set by JavaScript from the preview slider (or by a CMS in production)
- `--store-base-size` clamps it to the 14-18px safe range
- **UI ramp** (`--font-ui-2xs` through `--font-ui-xl`): compact sizes for product titles, prices, filters, forms, nav, cart
- **Display ramp** (`--font-display-sm/md/lg`): larger sizes for hero messaging and section headings. `--font-display-sm` aliases `--font-ui-xl` as the bridge between ramps
- **Spacing tokens** (`--space-2xs` through `--space-2xl`): all derived from the same base
- **Semantic aliases** map primitives to usage contexts (e.g., `--product-price: var(--font-ui-lg)`, `--hero-title: var(--font-display-lg)`)

All type and spacing tokens use `clamp()` for fluid sizing (viewport-responsive). The `[data-preview-sizing="fixed"]` override removes viewport contribution and uses pure multipliers.

### Layout system

- `.section-container` provides a max-width wrapper with `--container-padding`
- `.storefront-grid` is a 6-column grid (expands to 12 at `56rem` breakpoint) with `.span-*` and `.span-lg-*` utilities
- `.storefront-flow` is a prose wrapper for CMS content — applies appropriate heading/body styles and vertical rhythm to unknown markup

### Preview controls (`preview.js`)

Vanilla JS. The base-size slider sets `--user-base-size` on `:root`. Token readouts use a probe element technique (`getComputedPixels`) to resolve computed `font-size` from CSS custom properties. The fluid/fixed toggle swaps `data-preview-sizing` on `<body>`.

## Key Conventions

- Display headings use serif stack (`Iowan Old Style`, `Palatino Linotype`, Georgia)
- UI text uses sans-serif stack (`Avenir Next`, `Segoe UI`, `Helvetica Neue`)
- Measure tokens (`--measure-body`, `--measure-display`) constrain line lengths; `overflow-wrap: anywhere` handles long strings
- Container queries (not just media queries) control toolbar layout at `34rem`, `40rem`, `52rem`, `72rem` breakpoints
- Product images use `.preview-media-image` with `object-fit: cover` and aspect-ratio containers
