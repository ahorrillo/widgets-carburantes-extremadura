---
name: Widgets Carburantes Extremadura
description: Embeddable fuel-price charts and tables for Vocento news articles in Extremadura.
colors:
  gas-ink: "#1e40af"
  gas-wash: "rgba(30, 64, 175, 0.1)"
  diesel-ink: "#166534"
  diesel-wash: "rgba(22, 101, 52, 0.1)"
  card-surface: "#ffffff"
  headline-ink: "#0f172a"
  body-ink: "#475569"
  muted-ink: "#64748b"
  hairline: "#e2e8f0"
  row-hairline: "#f1f5f9"
  header-tint: "#f8fafc"
typography:
  display:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.3
  stat:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
  label:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  card: "8px"
spacing:
  inset: "16px"
  cell: "8px 10px"
  heading-gap: "12px"
components:
  data-card:
    backgroundColor: "{colors.card-surface}"
    rounded: "{rounded.card}"
    padding: "16px"
  card-heading:
    textColor: "{colors.headline-ink}"
    typography: "{typography.display}"
  table-header:
    backgroundColor: "{colors.header-tint}"
    textColor: "{colors.muted-ink}"
  table-value-gas:
    textColor: "{colors.gas-ink}"
  table-value-diesel:
    textColor: "{colors.diesel-ink}"
---

# Design System: Widgets Carburantes Extremadura

## Overview

**Creative North Star: "The Editorial Data Card"**

The widget system behaves like a well-set data card in a regional newspaper: flat white surfaces, hairline rules, and two dark, print-like inks carrying the fuel series. It never reaches for dashboard flair or decorative data-viz; it states numbers plainly, the way a chart desk would set them for a broadsheet page.

The personality is calm and editorial. Density is light — one card, one message, generous padding — so the widget holds its own inside a busy news article without shouting at the reader or fighting the surrounding typography. Everything is self-contained: inline styles only, system-ui type, zero dependence on the host page's CSS.

**Key Characteristics:**
- Flat, shadow-free white cards separated by 1px slate hairlines.
- Exactly two chromatic inks: dark blue for Gasolina 95, dark green for Gasóleo A — both muted print inks, never neon.
- system-ui type only; the widget never loads a font of its own.
- Fully self-contained: stylesheet bundled and injected (`wc-` classes), Chart.js bundled, no reliance on host CSS.
- Restrained interaction: legend top, responsive canvas, no decorative motion.

## Colors

A near-monochrome slate system with two dark fuel inks that read like print rather than screen.

### Primary
- **Gasoline Ink** (#1e40af): Gasolina 95 E5. The line color, the base of the area wash, and the bold value text in tables. Dark enough to print well; deliberately restrained, never a saturated display blue.
- **Gasoline Wash** (rgba(30, 64, 175, 0.1)): the 10% area fill beneath the gasoline line. Adds presence without weight.

### Secondary
- **Diesel Ink** (#166534): Gasóleo A. The green counterpart to Gasoline Ink, holding the same discipline: dark, muted, print-like.
- **Diesel Wash** (rgba(22, 101, 52, 0.1)): the 10% area fill beneath the diesel line.

### Neutral
- **Card Surface** (#ffffff): every widget surface.
- **Headline Ink** (#0f172a): card titles (h4).
- **Body Ink** (#475569): table row labels and descriptive text.
- **Muted Ink** (#64748b): table column headers.
- **Hairline** (#e2e8f0): card borders and the table-header underline.
- **Row Hairline** (#f1f5f9): inner table row separators.
- **Header Tint** (#f8fafc): the table header background.

### Named Rules
**The Two-Ink Rule.** Blue means Gasolina 95; green means Gasóleo A. They are the only chromatic inks in the system — never introduce a third series color, chart accent, or status tint.
**The Ink-Not-Neon Rule.** Both fuel colors stay at dark, print-like tones. Never brighten them into saturated display hues or neon fills; the washes stay at 10% opacity.
**The Derived-Series Rule.** A series that is neither fuel (e.g. the gasóleo−gasolina differential) is drawn in neutral Body Ink (#475569), never in a new chromatic ink. Province identity within a fuel is encoded by line pattern and a lighter shade of the same hue — never a new hue.

## Typography

**Display Font:** system-ui (inherits the host OS sans)
**Body Font:** system-ui

**Character:** A calm newsroom sans. The widget borrows the article's OS type instead of importing its own, so it can never clash with the surrounding copy.

### Hierarchy
- **Title** (700, 1rem, line-height 1.3): the card heading, e.g. "Evolución de carburantes en Extremadura". Appears once per card, directly above the content.
- **Stat** (700, 1.5rem, line-height 1.1): the big price values in the Situación widget ("el precio hoy").
- **Body** (400, 0.9rem): table cell text — month labels and price values.
- **Label** (500, 0.75rem): table column headers, set in Muted Ink.

### Named Rules
**The No-Imported-Type Rule.** Only system-ui, ever. Loading a webfont inside the widget is prohibited — the host article's typography must win.

## Layout

Each widget renders as a single self-contained block that fills the width of the CMS module that hosts it (no fixed width; `box-sizing: border-box` so padding never overflows). Content sits on a 16px inset; table cells use 8px 10px padding; a 12px gap separates the heading from the content below it. The table keeps readable rows on narrow embeds and expands gracefully on wide ones.

Tables use `border-collapse` with a tinted header row and hairline row separators. Charts render `responsive: true` and re-flow with the container on resize. There is no page-level grid or multi-card composition — each card stands alone inside an article.

## Elevation & Depth

No shadows anywhere. Depth is conveyed purely by 1px slate hairlines and the white-on-light-gray separation of the table's tinted header row. The system is flat at rest and stays flat on interaction.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest and remain flat on hover. If micro-lift is ever considered, it must be a border or background shift — never a shadow.

## Shapes

Gently curved cards (8px radius) with a 1px hairline border. Tables collapse their borders and use hairline rules only: no vertical borders, no zebra striping, no cell outlines beyond the row separators.

## Components

### Cards / Containers
- **Corner Style:** gently curved (8px radius).
- **Background:** Card Surface (white).
- **Shadow:** none — flat by default.
- **Border:** 1px Hairline (#e2e8f0).
- **Internal Padding:** 16px inset.

### Chart (signature component)
- Two line datasets on one canvas: Gasolina 95 E5 in Gasoline Ink, Gasóleo A in Diesel Ink, `tension: 0.3`.
- Each line carries a same-hue 10% area wash beneath it (Gasoline Wash / Diesel Wash).
- Legend at top; canvas id `${containerId}-chart`; `responsive: true`.
- The h4 title sits inside the card, above the canvas.

### Table (signature component)
- Groups daily records into monthly averages (media mensual) at 3-decimal precision.
- Header row: Muted Ink on Header Tint, with a 1px Hairline underline.
- Month cells: Body Ink, weight 500. Value cells bold: Gasolina in Gasoline Ink, Gasóleo in Diesel Ink.
- Row separators: 1px Row Hairline (#f1f5f9).

### Situación / "El precio hoy" (signature component)
- Two stat boxes side by side (single column on mobile), one per fuel: the latest daily average in the fuel's ink at Stat size, with a neutral ▲/▼ delta below showing the variation vs. the previous month's average (Δ €/l and %).
- Deltas are monochrome (Body Ink) — direction is carried by the arrow and sign, never by a new color.
- Footer carries the last data date.

### Comparativa Badajoz vs. Cáceres (signature component)
- One line chart for a single fuel (`data-producto`): Badajoz solid in a lighter shade, Cáceres dotted in the fuel's full ink (Gasolina: #8ba3e0 vs. #1e40af; Gasóleo: #7fb28e vs. #166534) — the dotted province carries the stronger tone so it reads as the accent. Province is encoded by line pattern **and** by tone within the same hue family — never by a new hue, preserving the Two-Ink Rule. Both curves are un-filled so the two never blend.

### Barras de medias mensuales
- Bar chart with the monthly averages (Gasolina in Gasoline Ink, Gasóleo in Diesel Ink), 3px rounded tops, slim bars (max 18px), legend top.

### Récords del año
- Compact list card: mes más caro, mes más barato, mayor subida mensual (gasolina). Rows on hairline separators; value bold in Headline Ink with a muted detail.

### Diferencial gasóleo − gasolina
- Single derived series (gasóleo − gasolina), drawn in Body Ink (neutral) so a third chromatic ink is never introduced. Line treatment matches the fuel charts.

## Do's and Don'ts

### Do:
- **Do** keep every widget a flat white card: 8px radius, 1px #e2e8f0 hairline, 16px inset.
- **Do** use Gasoline Ink (#1e40af) for Gasolina 95 data and Diesel Ink (#166534) for Gasóleo A data — everywhere, without exception.
- **Do** render all text in system-ui and let the host page's type win.
- **Do** use 3-decimal precision for monthly average prices.

### Don't:
- **Don't** add shadows, gradients, or depth effects — the system is flat by design.
- **Don't** introduce a third series color or chart accent; the Two-Ink Rule holds.
- **Don't** load webfonts or external CSS inside the widget.
- **Don't** add vertical table borders, zebra stripes, or cell outlines beyond the row hairlines.
- **Don't** state a price the data does not support — all values come from the MITECO extraction.
