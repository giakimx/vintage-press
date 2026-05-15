# Vintage Press

**The Vintage Specimen Press** — a small web app that turns photos into print-inspired artwork. Drop in a PNG or JPEG, pick a style, tune the sliders, and download a PNG that looks like newsprint, engraving, lithography, or a soft carbon print.

Effects run entirely in the browser on an HTML canvas: each style is a pixel-level treatment (halftone dots, grain, dithering, duotone, and similar) with a cream-and-ink palette tuned for a vintage press look.

## Features

- **Styles**: Halftone plate, engraving, threshold scatter, stippled litho, carbon print
- **Controls**: Per-style sliders (dot size, contrast, threshold, grain, density — depending on preset)
- **Workflow**: Drag-and-drop or file picker, live preview, one-click PNG export

## Prerequisites

[Bun](https://bun.com) — the runtime and package manager used for dev, prod, and builds.

## Setup

```bash
bun install
```

## Development

Starts the Bun server with hot module reload:

```bash
bun dev
```

Open the URL printed in the terminal (Vintage Press logs `Vintage Press → http://…`).

## Production

```bash
bun start
```

Runs `src/index.ts` with `NODE_ENV=production`.

## Static build

Outputs a bundled site under `dist/` (HTML entrypoints come from `src/**/*.html`, Tailwind via `bun-plugin-tailwind`):

```bash
bun run build
```

Pass extra options to forward to `Bun.build` (see `build.ts --help`).

## Tech stack

- **Server**: Bun `serve()` with SPA-style routing and optional dev HMR
- **UI**: React 19, Tailwind CSS 4
- **Icons**: lucide-react

## Project layout

- `src/index.ts` — HTTP server entry
- `src/index.html` / `src/frontend.tsx` — shell and React mount
- `src/vintage-press/` — app UI, canvas pipeline (`useVintageRender`, `effects.ts`), presets and types
