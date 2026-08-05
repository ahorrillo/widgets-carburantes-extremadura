# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two equally important audiences for HOY.es / Vocento Extremadura:

- **Readers** — the public in Extremadura (and Badajoz/Cáceres provinces) reading fuel-price news who consume the rendered chart or table inside the article.
- **Editorial staff** — Vocento journalists/editors who choose the widget, drop the embed snippet (a container div with `data-*` attributes + one script tag) into a CMS article, and republish it.

Success means both are served: the widget loads fast and renders correctly across the CMS, devices, and news pages without breaking the article, and readers find the price information useful and engaging.

## Product Purpose

Provide self-contained, embeddable widgets showing the historical evolution of fuel prices (Gasolina 95 E5 and Gasóleo A) for Extremadura, Badajoz, and Cáceres, sourced from the official MITECO API, so a regional newsroom can publish current price data in articles with zero ongoing engineering work.

## Positioning

The data is official MITECO figures presented as a ready-to-publish, single-file widget. Any regional article can embed current, verifiable price history in one snippet with no build step on the newsroom side — no other tool in the article workflow delivers this without integration work.

## Operating Context

- Widgets run inside third-party CMS article pages; they must not depend on the host page's CSS or JS. All styling is inline, the bundle is a single self-contained IIFE, and Chart.js is bundled.
- Data JSONs and the built script are published to a CDN (jsDelivr) pinned to git tags; widgets fetch JSON at runtime from `data-data-url` (default `/datos`, trailing slash stripped).
- Data is regenerated monthly or per editorial need by running the extractor scripts against the MITECO API and re-publishing the JSONs (plus a rebuild of `dist/`).

## Capabilities and Constraints

- Two widget components: `grafico` (interactive line chart) and `tabla` (monthly average table); three regions: `extremadura`, `badajoz`, `caceres`.
- Auto-initialization on DOMContentLoaded by scanning `[data-componente]`, `[data-region]`, `[data-data-url]`; new widget types must be registered in `src/main.js`.
- Fuel types tracked: Gasolina 95 E5 and Gasóleo A, daily averages from MITECO.
- Single-vendor data source (MITECO REST API); price extraction is concurrency-limited and date ranges are hardcoded per year in the scripts and JSON filenames (`_2026`).
- Proprietary Vocento license; codebase, comments, and UI copy are Spanish-first.
- Releases are git tags (e.g. `v1.0.1`); `package.json` version is intentionally not kept in sync with tags.

## Brand Commitments

- Vocento proprietary software (internal use only), licensed to the Vocento Group's titles and services.
- Spanish as the language of the interface and codebase.
- Maintained by HOY.es (Antonio Horrillo Horrillo).

## Evidence on Hand

- Historical daily price data: `public/datos/historico_extremadura_2026.json` and `public/datos/historico_provincias_extremadura_2026.json` (also mirrored in `dist/datos/`).
- Build/embed integration docs in `README.md`; dev playground in `index.html`.
- Published versions tagged `v1.0.0` and `v1.0.1`.
- No testimonials, case studies, or press about the widgets exist — future work must not fabricate any.

## Product Principles

- **Zero-trust embedding:** never rely on the host page — inline styles, bundled dependencies, self-initialization.
- **Official numbers only:** all displayed prices come from MITECO; never invent or round beyond the extracted daily averages.
- **Readers first, editors close behind:** rendering must never break the surrounding article, and the embed must stay a two-snippet copy-paste for the newsroom.
- **Fresh when published:** data is regenerated monthly or per need, so a published widget reflects the latest extraction available.
- **Spanish-native:** copy, comments, and code read naturally in Spanish.
