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

Then open http://localhost:5173.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build
```

## Files

- `public/data/projects.json` — project data and case-study content
- `public/data/writing.json` — draft writing content; not publicly routed until its claims are verified
- `public/data/now.json` — draft activity content; not publicly routed until its claims are verified
- `src/pages/Portfolio.jsx` — homepage layout and selected-project count
- `src/components/` — shared UI controls
- `src/index.css` — global base
