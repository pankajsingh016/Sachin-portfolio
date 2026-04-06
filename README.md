# Sachin Prajapati — portfolio (static site)

Personal marketing portfolio: single-page site plus standalone case-study / data pages. No build step.

## Repository layout

| Path | Purpose |
|------|---------|
| **`index.html`** | Site entry (serve from repo root). |
| **`data/theme.json`** | Copy, navigation labels, metrics, asset paths, design tokens. Loaded by `theme-loader.js`. |
| **`assets/css/styles.css`** | Global styles. |
| **`assets/js/theme-loader.js`** | Fetches `data/theme.json` and applies content + CSS variables. |
| **`assets/js/main.js`** | Scroll reveals, phone copy-to-clipboard + toast. |
| **`assets/media/images/`** | Raster images (e.g. hero portrait). |
| **`assets/media/documents/`** | PDF proofs and source exports. |
| **`assets/other/`** | Non-public or miscellaneous binaries (e.g. encrypted payloads). |
| **`pages/`** | Standalone HTML documents (case study, spreadsheet view). |

## Local preview

From the **repository root** (so `/data/theme.json` resolves correctly):

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/`. Opening `index.html` via `file://` will usually break `fetch()` for `data/theme.json`.

## Changing content

Edit **`data/theme.json`**. Paths there are relative to the site root (same as `index.html`). After moving files, update both `theme.json` and any hardcoded fallbacks in `index.html` if needed.

## Deploy

Upload the whole repo (or the listed tree) preserving paths. Any static host that serves directories as-is works (GitHub Pages, Netlify, S3, etc.).
