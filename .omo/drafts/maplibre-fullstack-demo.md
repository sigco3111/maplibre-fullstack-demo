---
slug: maplibre-fullstack-demo
status: drafting
intent: clear
review_required: false
classification: architecture  # 10 phases, 21 demos, 15 data sources, 3 deploys, multi-module SPA
pending-action: write .omo/plans/maplibre-fullstack-demo.md
approach: Operationalize HANDOFF.md into a decision-complete plan covering Vite+TS bootstrap, Tier 1/2/3 demos with MapLibre v5 official examples, 15 free public data sources, and three Vercel deploys. Per-phase commits (atomic per the git-master discipline), tier-by-tier milestones, agent-executed build+visual QA, and TypeScript-strict typed data fetchers.
---

# Draft: maplibre-fullstack-demo

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->

| id | outcome | status | evidence |
|----|---------|--------|----------|
| C1 | Vite+TS+MapLibre v5+three shell — `npm run dev` serves an empty 3D globe on `:5173`, `npm run build` is exit-0 | active | HANDOFF.md §5 (Phase A-1 copy-paste code), .omo/drafts only |
| C2 | Tier 1 demos (5): globe+atmosphere, 3D terrain, 3D buildings, animate camera, sky+fog+terrain — each routed at `/tier1/<slug>` and listed in sidebar | active | HANDOFF.md §4 A-2 |
| C3 | Tier 1 data sources (5): ISS, USGS quakes, NASA EONET, Open-Meteo, GBFS — typed fetchers with poll intervals and sidebar toggles | active | HANDOFF.md §4 A-3 |
| C4 | Vercel deploy #1 (after A-1..A-3) — production URL serves Tier 1 | active | HANDOFF.md §4 A-4 |
| C5 | Tier 2 demos (5): heatmap, sky+fog, hillshade, contour, custom camera animation | active | HANDOFF.md §4 B-1 |
| C6 | Tier 2 data sources (5): Wikipedia GeoSearch, OpenFlights, NASA categories, NOAA Solar, GeoNames | active | HANDOFF.md §4 B-2 |
| C7 | Vercel deploy #2 (after B-1..B-2) | active | HANDOFF.md §4 B-3 |
| C8 | Tier 3 demos (11): satellite, fill extrusion, 3D models (Three.js ×2), time slider, cluster, popup, symbol, 360 photosphere, game-like controls, live realtime | active | HANDOFF.md §4 C-1 |
| C9 | Tier 3 data sources (5): 한국 행정구역 GeoJSON, 시도 시군구 경계, 전국 POI, NASA Black Marble raster, GEBCO seabed | active | HANDOFF.md §4 C-2 |
| C10 | Vercel deploy #3 + README updates + final HANDOFF reconciliation | active | HANDOFF.md §4 C-3 |
| C11 | QA harness — Playwright/headless screenshot per demo + curl smoke per route; build-exit-0 per phase | active | derived (no HANDOFF test infra; added) |
| C12 | Documentation — README with per-tier screenshots, HANDOFF.md reconciled with final URLs and outcomes | active | HANDOFF.md §3, §8 |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->

| assumption | adopted default | rationale | reversible? |
|------------|-----------------|-----------|-------------|
| Commit cadence | Atomic per phase (3-7 commits per A/B/C phase), message format `<phase-id>: <what>`, push to `main` directly via PR workflow optional | HANDOFF.md §8 shows one example commit per phase; git-master discipline prefers smaller atoms | YES (worker can squash or rebase) |
| TypeScript strictness | `strict: true` + `noUncheckedIndexedAccess: true` + `exactOptionalPropertyTypes: true` | Standard for new TS projects, surfaces data fetcher errors at compile time | YES (tsconfig only) |
| Map style base | OSM raster tiles as default base layer (per HANDOFF §5 main.ts sample); OpenFreeMap optional upgrade later | HANDOFF explicit, OSM is CORS-OK | YES (config swap) |
| Three.js integration | Single `three` dep + `@types/three`; per-demo loader in `src/demos/tier3/`; no global Three scene | Per-demo isolation, minimal blast radius | YES (refactor only) |
| Routing | Hash-based router (`#/tier1/<slug>`) — no `react-router`, no extra dep | Vite+TS shell with minimal deps; matches Vercel static SPA | YES (refactor only) |
| Sidebar UI | Vanilla DOM (no framework); CSS grid layout, `<details>` collapse per tier | HANDOFF §README "구조" shows vanilla approach | YES (refactor only) |
| Data fetcher error model | Each fetcher returns `Result<T, { code: 'cors'\|'http'\|'parse', message: string }>`; logger.warn on failure, last successful value retained | No silent swallowing; UI keeps showing last good state | YES (refactor only) |
| Attribution | OSM `© OpenStreetMap contributors` baked into map style; per-data-source attribution in data.ts | Legal compliance for OSM/NASA/USGS tiles | YES (config swap) |
| MapLibre API version | v5+ (current major); verify `projection: 'globe'` works in installed version at A-1 step | HANDOFF §6 calls out v5 specifics | YES (bump) |
| Demo gate per tier | Tier N demos unlock only after Tier N-1 Vercel deploy succeeds (manual smoke) | Mirrors HANDOFF "A-4 → B-1 → B-3 → C-1 → C-3" sequencing | YES (worker choice) |
| Build target | `es2020` per HANDOFF §5 vite.config.ts | Modern browser baseline, broad Vercel support | YES (config) |
| Test framework | Vitest for typed unit tests on data fetchers + Playwright for visual smoke (1 screenshot per demo + per-route curl 200) | Standard Vite ecosystem; matches HANDOFF "vercel --prod" verification pattern | YES (add/remove deps) |
| Worker category routing | Tier 1/2/3 demo tasks → `visual-engineering`; data fetcher tasks → `quick`; deploy tasks → `unspecified-low`; QA harness → `unspecified-high` | Per skill executor router | YES |

## Findings (cited - path:lines)

- **Repo state**: `/Users/mac/work/maplibre-demo` — clean, only `README.md`, `HANDOFF.md`, `LICENSE`, `.gitignore`. No `package.json`, no `node_modules`, no `src/`. Branch `main`, head `96f8c6c init: README + HANDOFF + .gitignore`. (HANDOFF.md §2, git log)
- **HANDOFF 10-phase roadmap is explicit and complete**: §4 enumerates A-1, A-2, A-3, A-4, B-1, B-2, B-3, C-1, C-2, C-3 with verification commands for A-1..A-4. §5 provides copy-paste starter code (package.json, vite.config.ts, main.ts, core/data.ts). §6 enumerates CORS/API-key pitfalls that must be respected. (HANDOFF.md §4, §5, §6)
- **Tier 1 data has known good CORS profile** per §6: OSM, AWS Terrarium, ISS, NASA EONET all CORS-OK. OpenSky/OpenAQ excluded. (HANDOFF.md §6)
- **maplibre-gl v5 specifics**: `projection: 'globe'` required for globe; older `globeControl` API differs. (HANDOFF.md §6)
- **Vercel CLI prerequisite**: `vercel --prod --yes` for non-interactive first deploy. No local vercel skill — plain shell suffices. (HANDOFF.md §4 A-4, §6)
- **GitHub repo public, MIT**: https://github.com/sigco3111/maplibre-fullstack-demo (HANDOFF.md §2)
- **LICENSE**: MIT for repo, BSD 3-Clause for MapLibre, public-domain/CC-BY for data sources (HANDOFF.md §2, README.md)
- **Korean geo data (Tier 3)**: data.go.kr, 카카오/네이버 public POI — requires confirming CORS or local file fallback (HANDOFF.md §4 C-2 — needs worker research)

## Decisions (with rationale)

1. **Plan all 10 phases A-1..C-3 in one plan artifact** (vs. splitting Tier 1 only). Rationale: HANDOFF explicitly lists all 10 phases; the user's "다음 세션 시작 명령" only shows A-1 because that's the immediate next step, not because scope ends there. One plan keeps dependencies (T2 builds on T1 shell, T3 builds on T2 patterns) explicit.
2. **Bootstrap phase includes typed data fetcher skeletons even for Tier 1 data** (not lazy-add at A-3). Rationale: data fetcher signatures should be defined once with shared `Result<T, E>` envelope to keep A-3 mechanical.
3. **Hash-based router (no react-router)**. Rationale: Vite+TS shell with minimal deps; matches Vercel static SPA; sidebar uses native `<details>` collapse.
4. **Vercel deploys are real commands in the plan** (not dry-run mocks). Rationale: HANDOFF explicitly schedules `vercel --prod` after each tier. Prerequisite: worker must verify `vercel` CLI auth at start of A-4 task.
5. **Visual QA via Playwright headless screenshot per demo + curl per route** (vs. manual-only). Rationale: 21 visual demos without automation leaves the "3D 깊이·구도" outcomes un-verified; visual-qa skill covers this.
6. **Atomic commits per logical change within a phase**, not strictly one commit per phase. Rationale: HANDOFF §8 shows one example commit, but git-master discipline prefers smaller atoms (e.g., `chore: vite+ts scaffold` separate from `feat(data): iss fetcher`).

## Scope IN

- All 10 phases per HANDOFF.md §4
- Tier 1: 5 demos + 5 data sources (globe+atmosphere, 3D terrain, 3D buildings, animate camera, sky+fog+terrain × ISS, USGS, EONET, Open-Meteo, GBFS)
- Tier 2: 5 demos + 5 data sources (heatmap, sky+fog, hillshade, contour, custom camera × Wikipedia GeoSearch, OpenFlights, NASA categories, NOAA Solar, GeoNames)
- Tier 3: 11 demos + 5 data sources (satellite, fill extrusion, 3D models ×2, time slider, cluster, popup, symbol, 360 photosphere, game-like controls, live realtime × Korean 행정구역, 시군구 경계, POI, NASA Black Marble, GEBCO)
- Three Vercel production deploys
- Visual QA harness (Playwright + curl)
- README update with per-tier screenshots
- HANDOFF.md reconciliation after final deploy

## Scope OUT (Must NOT have)

- React / Vue / Svelte UI frameworks (vanilla TS only per HANDOFF §README)
- External paid tile providers or API keys (HANDOFF §README "비용 0 / API 키 0")
- OpenSky, OpenAQ (excluded per HANDOFF §6)
- CartoDB, OpenTopoMap, OpenRailwayMap as basemap (excluded per HANDOFF §6)
- Test framework migration or replacement of Vitest
- Backend service / DB / auth layer (HANDOFF is client-only static SPA)
- CI/CD beyond Vercel's built-in GitHub integration
- Mobile-app packaging, native shells
- i18n / l10n (Korean + English in source comments only)

## Open questions

1. **(Scope) Plan all 10 phases (A-1..C-3) or stop at Tier 1 (A-1..A-4)?** Default: all 10 phases.
2. **(Vercel) Include real `vercel --prod` commands per tier or dry-run/skip deploy steps?** Default: include real commands with prerequisite that Vercel CLI auth is verified before A-4.
3. **(Visual QA) Per-demo Playwright screenshot + diff, or build smoke + curl 200 only?** Default: Playwright screenshot per demo + curl 200 per route (1 representative frame per demo, no pixel-diff against a frozen baseline — first pass establishes baseline).

## Approval gate
status: drafting
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->