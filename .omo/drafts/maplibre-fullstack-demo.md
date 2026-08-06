---
slug: maplibre-fullstack-demo
status: review_approved
intent: clear
review_required: true  # user opted in after plan delivery
classification: architecture  # 10 phases, 21 demos, 15 data sources, 3 deploys, multi-module SPA
pending-action: none — plan approved, awaiting start-work
approach: Operationalize HANDOFF.md into a decision-complete plan covering Vite+TS bootstrap (which also migrates the live `@vercel/static` deployment to the Vite framework preset per HANDOFF §10), Tier 1/2/3 demos with MapLibre v5 official examples, 15 free public data sources, and three Vercel deploys using the documented deploy command pattern. QA = build smoke + curl 200 (no Playwright per user choice). Atomic commits per logical change within each phase.
delivered_plan: .omo/plans/maplibre-fullstack-demo.md (656 lines after fix, 55 implementation todos + 4 final-verifier tasks)
structural_self_check: 21/21 passed (TL;DR leads, header order, row format, every required field present)
executor_category_mix: 26 visual-engineering, 24 quick, 3 unspecified-low, 2 writing
metis_outcome: not run (subagent auth failure); self-metis folded silently — sky-fog-terrain base/advanced split across tier 1#5 and tier 2#7; 4-axis grep + bundle SHA match baked into deploy tasks #21/#34/#53; Korean data CORS fallback pattern in #48-50

# Review round state (M3 momus-equivalent)
review_round_id: momus-round-20260806-015352-10666
plan_sha256_pre_fix: 628f3af724f857bd4d47ce50f4868fc4962bca2a09e5454564078452390c41b2
plan_sha256_post_fix: 3be6c34884135e622491450653d459e34784abb80fd12395f75daf0b5dd69cc7
plan_path: .omo/plans/maplibre-fullstack-demo.md
workspace_root: /Users/mac/work/maplibre-demo
launch_id: launch-4013-35231
runner: minimax/M3 (user lacks Claude Code subscription; subagent auth failed; in-process review per user explicit consent)
review:
  momus:
    status: approved
    target: .omo/plans/maplibre-fullstack-demo.md
    round_id: momus-round-20260806-015352-10666
    plan_sha256_post_fix: 3be6c34884135e622491450653d459e34784abb80fd12395f75daf0b5dd69cc7
    launch_id: launch-4013-35231
    runner: minimax/M3
    verdict_summary: APPROVED — 1 BLOCKER (deploy #53 missing SHA match) found and fixed; remaining items were false positives (legitimate negative mentions in Must NOT have + TL;DR guardrails + dep matrix range rows)
    findings_applied:
      - E.deploy53-missing-sha (BLOCKER) — added sha256sum bundle SHA match assertion to task #53 (now consistent with tasks #21 and #34). New SHA = 3be6c34884135e622491450653d459e34784abb80fd12395f75daf0b5dd69cc7.
    false_positives:
      - D.playwright mentions at offsets 1085, 2592, 3814, 4546, 76222 — all in legitimate negative contexts (TL;DR What it will NOT do, Must NOT have section, QA option 3B descriptions).
      - C.ref-OpenSky/OpenAQ/CartoDB/OpenTopoMap/OpenRailwayMap — all in legitimate Must NOT add / Must NOT have / scope fidelity audit contexts.
      - F.dep-row-missing for 8/14/21/22/28/34/35/47/53/54/55 — all rows ARE in dep matrix; audit regex only matched exact "| N |" not "| N–M |" range rows.
    notes:
      - executor category mix: {quick: 24, visual-engineering: 26, unspecified-low: 3, writing: 2}
      - All HANDOFF §4 demo slugs present (5 tier 1 + 5 tier 2 + 11 tier 3 = 21 demos)
      - All HANDOFF §10 deploy gate items present in all 3 deploy tasks after fix
      - Korean data CORS fallback pattern (#47–50) consistent
      - TypeScript strict flags + Result envelope + attribution baked = consistent with adopted defaults
---

# Draft: maplibre-fullstack-demo

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->

| id | outcome | status | evidence |
|----|---------|--------|----------|
| C1 | Vite+TS+MapLibre v5+three shell — `npm run dev` serves an empty 3D globe on `:5173`, `npm run build` exit-0, AND existing Vercel alias serves the new build (not the old `public/index.html`) | active | HANDOFF.md §5 (Phase A-1 starter), §10 (Vercel migration), .omo/drafts only |
| C2 | Tier 1 demos (5): globe+atmosphere, 3D terrain, 3D buildings, animate camera, sky+fog+terrain — each routed at `#/tier1/<slug>` and listed in sidebar | active | HANDOFF.md §4 A-2 |
| C3 | Tier 1 data sources (5): ISS, USGS quakes, NASA EONET, Open-Meteo, GBFS — typed `Result<T, E>` fetchers with poll intervals and sidebar toggles | active | HANDOFF.md §4 A-3 |
| C4 | Vercel deploy #1 (after A-1..A-3) — alias URL serves Vite-built Tier 1 SPA; curl 200; HTML references `dist/assets/index-*.js` whose SHA matches the deployed bundle (per HANDOFF §10 "Vite 마이그레이션 후 검증") | active | HANDOFF.md §4 A-4 + §10 |
| C5 | Tier 2 demos (5): heatmap, sky+fog, hillshade, contour, custom camera animation | active | HANDOFF.md §4 B-1 |
| C6 | Tier 2 data sources (5): Wikipedia GeoSearch, OpenFlights, NASA categories, NOAA Solar, GeoNames | active | HANDOFF.md §4 B-2 |
| C7 | Vercel deploy #2 (after B-1..B-2) | active | HANDOFF.md §4 B-3 + §10 |
| C8 | Tier 3 demos (11): satellite, fill extrusion, 3D models (Three.js ×2), time slider, cluster, popup, symbol, 360 photosphere, game-like controls, live realtime | active | HANDOFF.md §4 C-1 |
| C9 | Tier 3 data sources (5): 한국 행정구역 GeoJSON, 시도 시군구 경계, 전국 POI, NASA Black Marble raster, GEBCO seabed | active | HANDOFF.md §4 C-2 |
| C10 | Vercel deploy #3 + README updates + final HANDOFF reconciliation (final URLs, outcome summary, "다음 세션 시작" section) | active | HANDOFF.md §4 C-3 + §10 |
| C11 | QA harness — per phase: `npm run build` exit-0 + `curl http://localhost:5173/<route>` HTTP 200 + (deploy phase) alias URL curl 200 + (deploy phase) `dist/assets/index-*.js` SHA matches deployed JS bundle | active | user answer 3B + HANDOFF §10 |
| C12 | Documentation — README update with per-tier screenshots (manual capture, link-only) + HANDOFF.md final reconciliation | active | HANDOFF.md §3, §8, §10 |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->

| assumption | adopted default | rationale | reversible? |
|------------|-----------------|-----------|-------------|
| Scope | All 10 phases A-1..C-3 in one plan | User answer 1A; HANDOFF §4 lists all 10 phases explicitly | YES (split into two plans) |
| Vercel deploy | Real `vercel deploy --yes --prod --non-interactive --scope sigco3111s-projects --token "$TOK"` per deploy phase (A-4/B-3/C-3) using HANDOFF §10 command pattern | User answer "갱신한 핸드오프 확인" + §10 documents real commands + project/scope/token already exist | YES (skip commands) |
| QA depth | Build smoke (`npm run build` exit-0) + curl HTTP 200 on dev route + Vercel alias HTTP 200 + deployed JS bundle SHA match | User answer 3B; HANDOFF §10 documents the SHA-equality check | YES (add Playwright later) |
| Commit cadence | Atomic per logical change within each phase (3-7 commits per A/B/C), message format `<phase-id>: <what>`, push to `main` directly | HANDOFF §8 shows one example commit; git-master prefers smaller atoms | YES (squash/rebase) |
| TypeScript strictness | `strict: true` + `noUncheckedIndexedAccess: true` + `exactOptionalPropertyTypes: true` | Standard for new TS projects; surfaces fetcher errors at compile time | YES (tsconfig only) |
| Map style base | OSM raster tiles (per HANDOFF §5 main.ts sample); OpenFreeMap optional upgrade later | HANDOFF explicit, OSM is CORS-OK | YES (config swap) |
| Three.js integration | Single `three` dep + `@types/three`; per-demo loader in `src/demos/tier3/`; no global Three scene | Per-demo isolation, minimal blast radius | YES (refactor only) |
| Routing | Hash-based router (`#/tier1/<slug>`, `#/tier2/<slug>`, `#/tier3/<slug>`) — no `react-router`, no extra dep | Vite+TS shell with minimal deps; Vercel static SPA friendly; deep links work without server rewrites | YES (refactor only) |
| Sidebar UI | Vanilla DOM (no framework); CSS grid layout, `<details>` collapse per tier, checkboxes for data layer toggles | HANDOFF README "구조" shows vanilla approach | YES (refactor only) |
| Data fetcher error model | Each fetcher returns `Result<T, { code: 'cors'\|'http'\|'parse', message: string }>`; logger.warn on failure, last successful value retained in store; UI keeps showing last good state | No silent swallowing; data is decorative so partial failure is OK | YES (refactor only) |
| Attribution | OSM `© OpenStreetMap contributors` baked into map style; per-data-source attribution in `src/data/sources.ts` | Legal compliance for OSM/NASA/USGS | YES (config swap) |
| MapLibre API version | v5+ (current major); verify `projection: 'globe'` works in installed version at A-1 step | HANDOFF §6 calls out v5 specifics | YES (bump) |
| Demo gate per tier | Tier N demos unlock only after Tier N-1 Vercel deploy succeeds (curl 200 verified) | Mirrors HANDOFF "A-4 → B-1 → B-3 → C-1 → C-3" sequencing; deploy success is the gate | YES (worker choice) |
| Build target | `es2020` per HANDOFF §5 vite.config.ts | Modern browser baseline, broad Vercel support | YES (config) |
| Vercel.json migration | A-1 replaces existing `@vercel/static` builds/routes with `buildCommand: "npm run build"` + `outputDirectory: "dist"` + `framework: "vite"` (per HANDOFF §10 "Vite 마이그레이션 후") | HANDOFF §10 documents the exact JSON shape; existing vercel.json must be replaced not augmented | YES (revert) |
| `public/index.html` removal | A-1 deletes `public/index.html` since Vite serves root `index.html` | HANDOFF §10 implicitly assumes Vite serves from root | YES (restore + change route) |
| `vite.config.ts` base | `/` (Vercel subpath-free) per HANDOFF §10 "Vite 마이그레이션 후 변경점" | Production deploys go to root; GitHub Pages subpath not the current target | YES (config) |
| `.vercelignore` | KEEP existing (correctly excludes `.omo/`, `.senpi/`, `.hermes/`, `*.md` with `!README.md` exception, `HANDOFF.md` excluded, `screenshots/` excluded); drop `screenshots/` line since we chose curl-only QA | User answer 3B; we won't produce screenshots | YES (edit) |
| Worker category routing | Tier 1/2/3 demo tasks → `visual-engineering`; data fetcher tasks → `quick`; deploy tasks → `unspecified-low`; QA harness tasks → `quick`; README/HANDOFF docs → `writing`; bootstrap → `unspecified-high` | Per skill executor router | YES |
| Korean geo data (Tier 3) | Worker must verify CORS or fall back to local file fetch for data.go.kr / 카카오 / 네이버 at C-2 step | HANDOFF §4 C-2 lists sources without CORS confirmation; CORS may be missing | YES (different source) |
| Vercel CLI prerequisite check | A-1 first task verifies `vercel whoami --token "$TOK"` returns `sigco3111` and `~/.hermes/secrets/vercel_token.txt` exists with `vcp_` prefix | Per HANDOFF §10 "표준 배포 명령 1. 자동 검증"; fail fast if not authenticated | YES |

## Findings (cited - path:lines)

- **Repo state** (re-checked at 2026-08-06): `/Users/mac/work/maplibre-demo` — 5 commits on main, head `049b674`. Working tree clean. Files: `README.md`, `HANDOFF.md`, `LICENSE`, `.gitignore`, `public/index.html`, `vercel.json`, `.vercelignore`. No `package.json`, no `node_modules`, no `src/`. (HANDOFF.md §2, git log)
- **HANDOFF 10-phase roadmap is explicit and complete**: §4 enumerates A-1..C-3 with verification commands for A-1..A-4. §5 provides copy-paste starter code (package.json, vite.config.ts, main.ts, core/data.ts). §6 enumerates CORS/API-key pitfalls. §10 documents the real Vercel deploy pattern. (HANDOFF.md §4, §5, §6, §10)
- **Vercel is already 1차 deployed (minimal)**: alias `https://maplibre-demo-eight.vercel.app` serves `public/index.html` (3,431 bytes), team-scope URL `https://maplibre-demo-pdifj0ouc-sigco3111s-projects.vercel.app` returns 302 anon. Token at `~/.hermes/secrets/vercel_token.txt` (prefix `vcp_`). Project `maplibre-demo`, scope `sigco3111s-projects`. (HANDOFF.md §10)
- **Standard deploy command pattern documented**: `vercel deploy --yes --prod --non-interactive --scope sigco3111s-projects --token "$TOK" 2>&1 | tail -15` followed by `sleep 30` and `curl -sI https://maplibre-demo-eight.vercel.app | head -1`. (HANDOFF.md §10 "표준 배포 명령")
- **Vite 마이그레이션 후 vercel.json 정형 documented**: `{ "version": 2, "buildCommand": "npm run build", "outputDirectory": "dist", "framework": "vite" }`. (HANDOFF.md §10)
- **Vite 마이그레이션 후 검증 추가 어서션**: `dist/assets/index-*.js` SHA == alias JS bundle SHA. (HANDOFF.md §10)
- **4 pitfalls documented**: (1) `--scope` missing in non-interactive, (2) team-scope URL 302, (3) auto-deploy silent fail on push → use explicit `vercel deploy --prod --force`, (4) `.gitignore` blocked asset push → `git add -f`. (HANDOFF.md §10)
- **4-axis self-validation grep pattern documented**: `--name` deprecated check, `--token` present check, `vcp_` prefix check. (HANDOFF.md §10)
- **Tier 1 data CORS profile**: OSM, AWS Terrarium, ISS, NASA EONET all CORS-OK. OpenSky/OpenAQ excluded. (HANDOFF.md §6)
- **maplibre-gl v5 specifics**: `projection: 'globe'` required; older `globeControl` API differs. (HANDOFF.md §6)
- **README updated to reflect live demo**: new "🌐 Live Demo" section points to alias URL with note "Tier 1 작업 완료 시 Vercel 자동 재배포 (5-30초)". (README.md, git log `049b674`)
- **`.gitignore` updated to exclude `.vercel` and `.omo`**: now `node_modules/`, `dist/`, `.vercel/`, `*.log`, `.DS_Store`, `.env`, `.env.local`, `.vscode/`, `.idea/`, `.vercel`. (git log `7440db1`)
- **`.vercelignore` excludes `.omo/`, `.senpi/`, `.hermes/`, `HANDOFF.md`, `*.md` (with `!README.md` exception), `screenshots/`.** (`.vercelignore`)
- **GitHub repo public, MIT**: https://github.com/sigco3111/maplibre-fullstack-demo (HANDOFF.md §2)
- **Korean geo data (Tier 3)** requires CORS or local-file fallback verification at C-2: data.go.kr, 카카오/네이버 public POI (HANDOFF.md §4 C-2)
- **No local vercel skill**: HANDOFF §9 references `file:///Users/mac/.hermes/skills/devops/vercel/` but no such skill exists locally. Plain shell commands suffice.

## Decisions (with rationale)

1. **Plan all 10 phases A-1..C-3 in one plan artifact** (user answer 1A). HANDOFF explicitly lists all 10; one plan keeps dependencies (T2 builds on T1 shell, T3 builds on T2 patterns) explicit and prevents scope drift.
2. **A-1 includes Vercel config migration** as part of bootstrap, not deferred to A-4. Rationale: per HANDOFF §10, the existing `vercel.json` (`@vercel/static`) must be replaced with the Vite framework preset before any demo can deploy; doing it at A-1 means C4 (first real deploy) is a single-command deploy, not a deploy + migrate step.
3. **A-1 deletes `public/index.html`** since Vite serves root `index.html`. Rationale: HANDOFF §10 "Vite 마이그레이션 후" implicitly assumes Vite's standard layout. Keeping `public/index.html` would confuse Vite's `index.html` resolver and the bundle would not be the one served.
4. **Hash-based router (no react-router)** for `#/tier<n>/<slug>` deep links. Rationale: Vite+TS shell with minimal deps; Vercel static SPA; deep links work without server rewrites (which Vercel's static preset doesn't provide without `_redirects`).
5. **Vercel deploys use the documented `vercel deploy --yes --prod --non-interactive --scope sigco3111s-projects --token "$TOK"` command pattern from HANDOFF §10**, with the 4-axis grep self-validation gate and `dist/assets/index-*.js` SHA-equality assertion after each redeploy. Rationale: §10 is real, battle-tested command sequence with known pitfalls documented.
6. **QA per phase = `npm run build` exit-0 + `curl http://localhost:5173/<route>` 200 + (deploy phase) alias 200 + (deploy phase) bundle SHA match**. No Playwright. Rationale: user answer 3B; bundle SHA match is a strong structural assertion that catches broken bundling without browser automation.
7. **Atomic commits per logical change within each phase**, not strictly one commit per phase. Rationale: git-master discipline; smaller atoms make revert and review cheaper.
8. **`dist/assets/index-*.js` SHA equivalence check** is the deploy-success assertion. Rationale: per HANDOFF §10, this catches "alias shows old hash" pitfall #3 directly.

## Scope IN

- All 10 phases per HANDOFF.md §4
- A-1 also migrates `vercel.json` from `@vercel/static` to Vite framework preset and deletes `public/index.html` (per HANDOFF §10)
- Tier 1: 5 demos + 5 data sources (globe+atmosphere, 3D terrain, 3D buildings, animate camera, sky+fog+terrain × ISS, USGS, EONET, Open-Meteo, GBFS)
- Tier 2: 5 demos + 5 data sources (heatmap, sky+fog, hillshade, contour, custom camera × Wikipedia GeoSearch, OpenFlights, NASA categories, NOAA Solar, GeoNames)
- Tier 3: 11 demos + 5 data sources (satellite, fill extrusion, 3D models ×2, time slider, cluster, popup, symbol, 360 photosphere, game-like controls, live realtime × Korean 행정구역, 시군구 경계, POI, NASA Black Marble, GEBCO)
- Three Vercel production deploys using HANDOFF §10 command pattern
- Vite framework preset migration in A-1
- 4-axis self-validation grep gate before every deploy
- `dist/assets/index-*.js` SHA-equality assertion after every deploy
- Build smoke + curl 200 per route per phase
- README update with per-tier manual-screenshot placeholders (links, not images, since no Playwright)
- HANDOFF.md final reconciliation after C-3 (final URLs, outcomes, "다음 세션 시작" section rewritten)

## Scope OUT (Must NOT have)

- React / Vue / Svelte UI frameworks (vanilla TS only per HANDOFF §README)
- External paid tile providers or API keys (HANDOFF §README "비용 0 / API 키 0")
- OpenSky, OpenAQ (excluded per HANDOFF §6)
- CartoDB, OpenTopoMap, OpenRailwayMap as basemap (excluded per HANDOFF §6)
- Playwright / visual regression QA (user answer 3B; bundle SHA + curl are the verification surface)
- Backend service / DB / auth layer (HANDOFF is client-only static SPA)
- CI/CD beyond Vercel's built-in GitHub integration
- Mobile-app packaging, native shells
- i18n / l10n (Korean + English in source comments only)
- GitHub Pages deployment (HANDOFF §5 "vite.config.ts base: '/'" is Vercel-only)
- Screenshots/ directory automation (we don't capture screenshots in this plan)
- C-3 Korean data CORS workaround engineering beyond what's needed (fall back to local files if CORS missing; don't build a proxy)

## Open questions

(All resolved; awaiting approval.)

## Approval gate
status: awaiting-approval
approach: Operationalize HANDOFF.md into a decision-complete plan covering Vite+TS bootstrap (with Vercel framework preset migration in A-1), Tier 1/2/3 demos, 15 typed data fetchers, three Vercel deploys using HANDOFF §10 command pattern with bundle SHA assertion, build+curl QA (no Playwright). Plan will be `.omo/plans/maplibre-fullstack-demo.md`.
pending_action_policy: write .omo/plans/maplibre-fullstack-demo.md
next_workflow_action: Wait for user approval, then run scaffold (without --draft-only) + append task batches into `## Todos`, fill `## TL;DR (For humans)` last, deliver Phase 4 handoff.
<!-- This durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->