# AGENTS.md

Library of embeddable fuel-price widgets (Vocento/HOY.es) for Extremadura, Badajoz, Cáceres. Vanilla JS + Chart.js, built with Vite as a **single self-contained IIFE** for CMS embedding.

## Commands

- `npm run dev` — local dev server (index.html loads data from `/datos`, i.e. your local `public/datos/`)
- `npm run build` — outputs `dist/widget-carburantes.js` + copies `public/datos/*.json` into `dist/datos/`
- No tests, no lint, no typecheck scripts exist.

## Build / dist gotchas

- `vite.config.js` uses lib mode (`formats: ['iife']`, entry `src/main.js`, output name `widget-carburantes.js`). Chart.js is intentionally bundled in (`external: []`). Keep it that way — the whole point is one embeddable script.
- **`dist/` is committed** (`.gitignore` explicitly permits it for CMS publishing). After any change, run `npm run build` and commit the regenerated `dist/widget-carburantes.js` and `dist/datos/*.json` so the CDN/CMS stays in sync. Never let dist drift from src.
- Widget styles live in `src/styles/widget.css` (classes prefixed `wc-`), imported in `src/main.js` via `?inline` and injected into a runtime `<style id="wc-estilos">` tag on init. The CSS is bundled **inside** `widget-carburantes.js` — never an external stylesheet dependency. Keep the `wc-` prefix to avoid collisions with the host CMS.

## Data files

- `public/datos/historico_extremadura_2026.json` — array of `{fecha: "DD-MM-YYYY", gasolina95_E5, gasoleoA, estacionesG95, estacionesGasA}`
- `public/datos/historico_provincias_extremadura_2026.json` — array of `{fecha, badajoz: {gasolina95_E5, gasoleoA, estaciones}, caceres: {...}}`
- Widgets fetch these at runtime via `data-data-url` (default `/datos`, trailing slash stripped). JSON filenames are hardcoded per widget, including the `_2026` year suffix — keep in sync when regenerating.

## Extractor scripts (`scripts/*.mjs`)

- Not wired into npm scripts — run directly: `node scripts/extractor_extremadura.mjs` (requires Node ≥ 18 for global `fetch`).
- Hit the MITECO REST API (CCAA "11" / provincias "06", "10"; Gasolina 95 "1", Gasóleo A "3") and take daily averages. Date range is hardcoded to `2026-01-01` to `2026-07-31`.
- They write the output JSON to the **current working directory** (not `public/datos/`), so after running, move the file into `public/datos/` and regenerate `dist/`.
- Concurrency-limited with 100ms delays; respect the API and keep the date ranges updated to the year in the filename.

## Widget architecture

- `src/main.js` auto-initializes on DOMContentLoaded: scans `[data-componente]`, `[data-region]`, `[data-data-url]` and dispatches via `renderizarPorElemento`. **New widget types must be registered there.**
- `data-componente`: `grafico` (default) | `tabla` | `situacion` | `comparativa` | `barras` | `records` | `diferencial`. `data-region`: `extremadura` | `badajoz` | `caceres`. `data-producto`: `gasolina` (default) | `gasoleo` (used by `comparativa` and `records`).
- Badajoz/Cáceres charts share `renderWidgetProvincial`; `widget_badajoz.js` / `widget_caceres.js` are thin wrappers. All line charts share `grafico_editorial.js` (editorial card shell + Chart.js config + data helpers `cargarDatos`/`agruparMensual` + bar/differential chart builders); the widget modules only fetch data and feed it in.
- `situacion`/`barras`/`records`/`diferencial` use the shared `cargarDatos(region, baseUrl)` + `agruparMensual()` helpers; `comparativa` fetches the provinces file directly (it inherently compares Badajoz vs Cáceres).
- Import Chart.js via `chart.js/auto`. Canvas id is `${containerId}-chart`.
- New widget ideas live in `docs/plans/widgets-reportaje-carburantes.md` (Group A implemented; Groups B/C need extractor/data extensions).

## Dev / release gotchas

- `index.html` (dev playground) points every widget at `data-data-url="/datos"`, so during `npm run dev` data comes from your local `public/datos/*.json`. For production embedding, the CMS must point `data-data-url` at the published jsDelivr CDN tag (see README).
- Releases are **git tags** (`v1.0.0`, `v1.0.4`); README/CDN URLs reference `@v1.x.y`. `package.json` `version` stays `0.0.0` and is not kept in sync with tags — the tag is the source of truth for publishing.
- Repo is Spanish-first (code, comments, UI copy); keep new UI copy in Spanish to match.
