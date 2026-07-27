# Portfolio Package

This is the hiring-facing packaging for the five finished projects. Use these five as the public portfolio set; keep everything else as archive material.

## GitHub Pin Order

1. ReliableFlow
2. AI Assistant Across Websites
3. AIHL Secure Service Booking
4. Error Monitoring System
5. Crypto Market Data Pipeline

If GitHub only gives six pinned slots, leave the sixth empty or use one small systems/tooling project only if it is clean and finished. Do not pin in-progress projects.

## Public Selection

The portfolio uses these five projects as the public hiring set. The homepage
leads with the first three; the selected-work page presents all five before the
optional full archive.

| Rank | Project | Portfolio Role |
| --- | --- | --- |
| 1 | ReliableFlow | Flagship backend systems project: queueing, retries, webhooks, Docker, CI, docs |
| 2 | AI Assistant Across Websites | AI product/tooling project: browser extension, provider fallback, local memory |
| 3 | AIHL Secure Service Booking | Full-stack product workflow: roles, booking, payments seam, mobile client |
| 4 | Error Monitoring System | Observability/backend project: ingestion, alert rules, dashboard, indexing |
| 5 | Crypto Market Data Pipeline | Data engineering project: ETL, raw lake, validation, warehouse, CLI/API |

## Resume Bullets

- Built ReliableFlow, a FastAPI/PostgreSQL background-job and webhook-delivery platform with API-key auth, idempotent job creation, worker retries, dead-letter replay, cron schedules, metrics, Docker Compose, GitHub Actions CI, and a React admin dashboard.
- Built an AI browser assistant using a Chrome MV3 extension and local Node backend, with page summarization/extraction, saved notes, keyword plus embedding-style memory search, filesystem note mirroring, and multi-provider LLM fallback.
- Built a secure service-booking platform with Laravel, React Native/Expo, role-based customer/provider/admin workflows, slot validation, Stripe-ready payment abstraction, reviews gated by completed bookings, and CI-backed staged delivery.
- Built an ASP.NET Core error-monitoring platform with per-application ingestion keys, JWT auth, EF Core persistence, rolling-window alert evaluation, log-retention workers, dashboard filtering, and query-aware indexing.
- Built a crypto market ETL pipeline that ingests CoinGecko snapshots, lands raw JSON in partitioned storage, validates row and batch rules, loads SQLite warehouse tables, and exposes both CLI and Flask API surfaces.

## Interview Positioning

Lead with ReliableFlow. It gives you the strongest engineering conversation: concurrency, transaction boundaries, retries, idempotency, dead-letter recovery, CI, Docker, and honest limitations.

Use AI Assistant Across Websites when the interviewer wants AI/product experience. Emphasize provider fallback, extension messaging boundaries, local persistence, and privacy-conscious local notes.

Use AIHL Secure Service Booking when the interviewer wants product/full-stack range. Emphasize role-specific workflows, server-side booking invariants, payment abstraction, and mobile token storage.

Use Error Monitoring System when the interviewer wants backend or observability. Emphasize ingestion auth, alert evaluation, retention, dashboard query shape, and why the composite index matters.

Use Crypto Market Data Pipeline when the interviewer wants data engineering. Emphasize raw replayability, validation before warehouse load, fact/dimension modeling, and why the CLI/API share the same pipeline core.

## One-Line Project Pitches

- ReliableFlow: "A production-shaped job queue and webhook platform built around Postgres transactions, retries, dead letters, and operational visibility."
- AI Assistant Across Websites: "A local-first browser assistant that turns supported webpages into summarizable, extractable, searchable notes."
- AIHL Secure Service Booking: "A three-role service marketplace with booking invariants, provider workflow, admin reporting, and payment integration kept behind a driver seam."
- Error Monitoring System: "A Sentry-style monitoring app with authenticated ingestion, alert rules, retention workers, and a query-aware composite index for common dashboard filters."
- Crypto Market Data Pipeline: "A replayable ETL pipeline that keeps raw API payloads, validates records, and loads analytics-ready crypto market facts."

## Gaps To Avoid Overclaiming

- ReliableFlow has no production deployment, no exactly-once guarantee, no live multi-process concurrency proof, and no automatic webhook dispatcher poller.
- AI Assistant Across Websites is a personal local tool, not a published Chrome Web Store product.
- AIHL Secure Service Booking is Stripe-ready but not used for real charges.
- Error Monitoring System has deploy targets documented, but no public live service.
- Crypto Market Data Pipeline is single-machine SQLite, not a distributed warehouse.
