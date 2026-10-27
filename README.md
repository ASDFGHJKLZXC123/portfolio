# Richard Zhang · Portfolio (Vite + React)

Dark editorial portfolio for a recent UCI Informatics grad.

## Selected projects

The public hiring set is intentionally narrowed to five finished projects. The
homepage leads with the first three; the selected-work page presents all five
before offering the complete build archive.

1. ReliableFlow
2. AI Assistant Across Websites
3. AIHL Secure Service Booking
4. Error Monitoring System
5. Crypto Market Data Pipeline

See `PORTFOLIO_PACKAGE.md` for GitHub pin order, resume bullets, interview positioning, and honest limitations.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173/portfolio/ (the site is served under the
`/portfolio/` base path, matching GitHub Pages).

## Build and check

```bash
npm run build          # vite build, then prerender one index.html per route into dist/
npm run preview        # serve the production build
npm run check:render   # SSR smoke test of every case study, link safety, heading outline
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Editing content

- **Projects** — `src/data/projects.json`. `featured` + `featuredRank` choose
  the selected set; everything else goes to the archive. Links without an
  `href` are not rendered.
- **Screenshots** — WebP files in `public/assets/project-screenshots/`,
  referenced from a project's `img` / `media.src`.
- **Page titles and descriptions** — `src/lib/page-meta.js` (used at runtime
  and by the prerender step). The homepage's are also in `index.html`.
- **Link-preview image** — `public/og-image.png`, rendered from
  `scripts/og-image.html` (the regeneration command is in that file).

## Files

- `src/pages/` — the homepage, the selected-work/archive page and the case-study page
- `src/components/` — shared pieces (reveal, status pill, theme switch, card image, case-study sections, scroll manager)
- `src/lib/` — project data access, link/image helpers, theme, page metadata
- `src/index.css` — design tokens (light/dark) and layout
- `scripts/prerender-routes.mjs` — writes `dist/all-works/` and `dist/project/<slug>/` so deep links return 200 with their own title and preview
- `scripts/render-check.jsx` — the `check:render` suite
