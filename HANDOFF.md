# 🗺️ MapLibre 풀스택 데모 — 핸드오프

## 1. 한 줄 요약

**maplibre-gl-js v5 공식 예제 20+개 + 검증된 무료 공개 데이터 15+개** 통합 풀스택 데모. 3D 깊이·구도·재질·조명·인터랙티브 비주얼. Sigco3111 GitHub 공개 저장소, **비용 0 / API 키 0**.

## 2. 저장소 상태

| 항목 | 상태 |
|---|---|
| GitHub | https://github.com/sigco3111/maplibre-fullstack-demo (PUBLIC) |
| 로컬 | `/Users/mac/work/maplibre-demo` |
| 라이선스 | MIT |
| 첫 커밋 | README.md + LICENSE |
| 브랜치 | main (default) |
| 패키지 | ✅ 설치 완료 (maplibre-gl v5.24.0, three v0.160.1, vite v5.4.21, typescript v5.4+) |
| Vercel | ✅ 라이브: https://maplibre-demo-eight.vercel.app (최종 deploy: 2026-08-06) |
| 최신 태그 | v0.3.0-tier3 |

## 3. 완료된 작업

- ✅ GitHub 저장소 생성 (PUBLIC, MIT, description 명시)
- ✅ 로컬 clone 완료
- ✅ README.md 작성 (구조/티어/참고/라이선스)
- ✅ 작업 계획 (todo 10단계) - 본 문서
- ✅ A-1 프로젝트 셋업 (Vite + TS + maplibre-gl v5 + three + Vercel framework preset 마이그레이션)
- ✅ A-2 Tier 1 데모 5개 (globe+atmosphere, 3d-terrain, 3d-buildings, animate-camera, sky-fog-terrain)
- ✅ A-3 Tier 1 데이터 5개 (ISS, USGS, EONET, Open-Meteo, GBFS) — `Result<T,E>` envelope
- ✅ A-4 1차 Vercel 배포 (v0.1.0-tier3) — alias 200 + bundle SHA match
- ✅ B-1 Tier 2 데모 5개 (heatmap, hillshade, contours, custom-camera, sky-fog-terrain advanced)
- ✅ B-2 Tier 2 데이터 5개 (Wikipedia GeoSearch, OpenFlights, EONET categories, NOAA Solar, GeoNames)
- ✅ B-3 2차 Vercel 배포 (v0.2.0-tier3) — alias 200 + bundle SHA match
- ✅ C-1 Tier 3 데모 11개 (satellite, fill-extrusion, 3D-models, time-slider, clusters, popup, symbol, 360-photosphere, game-controls, live-realtime)
- ✅ C-2 Tier 3 데이터 5개 (한국 행정구역/시군구/POI CORS-fallback, Black Marble, GEBCO)
- ✅ C-3 3차 Vercel 배포 (v0.3.0-tier3) — alias 200 + bundle SHA match
- ✅ README 최종 갱신 (21 demos + 15 sources + live URL)

## 4. 다음 작업 + 검증 기준

### 🅰 A-1: 프로젝트 셋업 (먼저)

**파일**:
- `package.json` — vite + typescript + maplibre-gl + three
- `vite.config.ts` — base: './' (GitHub Pages 호환)
- `tsconfig.json`
- `index.html` — `<div id="map">` + css
- `src/main.ts` — bootstrap
- `src/styles.css`

**참고**: `vercel` 스킬로 배포 시 `base: '/'` 로 변경.

**검증 기준**:
```bash
cd /Users/mac/work/maplibre-demo
npm install
npm run build  # 0 에러
npm run dev    # http://localhost:5173 → 빈 지도
```

### 🅱 A-2: Tier 1 (5개 예제)

**위치**: `src/demos/tier1/`

| 예제 | slug | 비주얼 |
|---|---|---|
| 1 | `display-a-globe-with-an-atmosphere` | 글로브 + 대기 산란 |
| 2 | `3d-terrain` | OSM + AWS Terrarium DEM |
| 3 | `display-buildings-in-3d` | OSM 빌딩 3D extrusion |
| 4 | `animate-map-camera-around-a-point` | 자동 회전 카메라 |
| 5 | `sky-fog-terrain` | (Tier 2로 이동 가능) |

**검증**: 각 데모가 자체 URL `/tier1/<slug>` 라우트 + 사이드바 토글로 동작.

### 🅲 A-3: Tier 1 데이터 (5개)

**위치**: `src/data/sources.ts` + `src/core/data.ts`

| 데이터 | endpoint | 폴링 |
|---|---|---|
| ISS | http://api.open-notify.org/iss-now.json | 5초 |
| USGS 지진 | https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson | 5분 |
| NASA EONET | https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100 | 10분 |
| Open-Meteo | https://api.open-meteo.com/v1/forecast | 10분 |
| GBFS | https://gbfs.mobilitydata.org/ | 5분 |

**검증**: 5개 모두 200 OK, 사이드바에서 토글.

### 🅳 A-4: Vercel 1차 배포

**명령**:
```bash
cd /Users/mac/work/maplibre-demo
vercel --prod  # 1차
```
**검증**: Vercel URL → Tier 1 데모 + 데이터 5개 시각 확인.

### 🅴 B-1: Tier 2 (5개 예제)

| 예제 | slug |
|---|---|
| 6 | `create-a-heatmap-layer` |
| 7 | `sky-fog-terrain` |
| 8 | `add-a-hillshade-layer` |
| 9 | `add-contour-lines` |
| 10 | `customize-camera-animations` |

### 🅵 B-2: Tier 2 데이터 (5개)

| 데이터 | endpoint |
|---|---|
| Wikipedia GeoSearch | https://en.wikipedia.org/w/api.php?action=query&list=geosearch |
| OpenFlights | https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat |
| NASA EONET categories | https://eonet.gsfc.nasa.gov/api/v3/categories |
| NOAA Solar | https://services.swpc.noaa.gov/ |
| GeoNames | https://www.geonames.org/ (정적 다운로드) |

### 🅶 B-3: Vercel 2차 배포

### 🅷 C-1: Tier 3 (10+ 예제)

| # | 예제 | slug |
|---|---|---|
| 11 | Satellite Map | `display-a-satellite-map` |
| 12 | Fill Extrusion | `display-a-globe-with-a-fill-extrusion-layer` |
| 13 | 3D Model Three.js | `add-a-3d-model-using-threejs` |
| 14 | 3D Model with Shadow | `add-a-3d-model-with-shadow-using-threejs` |
| 15 | Time Slider | `create-a-time-slider` |
| 16 | Cluster | `create-and-style-clusters` |
| 17 | Popup on Click | `display-a-popup-on-click` |
| 18 | Symbol on Click | `center-the-map-on-a-clicked-symbol` |
| 19 | 360 Photosphere | `enter-a-360-photosphere` |
| 20 | Game-like Controls | `navigate-the-map-with-game-like-controls` |
| 21 | Live Realtime | `add-live-realtime-data` |

### 🅸 C-2: Tier 3 데이터 (5개)

- 한국 행정구역 (GeoJSON, data.go.kr)
- 시도 시군구 경계
- 전국 POI (카카오/네이버 공개)
- NASA Black Marble 야간 조명 raster
- GEBCO 해저 지형

### 🅹 C-3: Vercel 최종 배포 + 핸드오프

- Vercel 최종 URL
- README 갱신 (각 데모 스크린샷)
- 핸드오프 문서 본 파일 최종

## 5. Bite-sized Plan (Phase/Task + 복붙 코드)

### Phase A-1: package.json

```json
{
  "name": "maplibre-fullstack-demo",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "maplibre-gl": "^5.0.0",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "@types/three": "^0.160.0"
  }
}
```

### Phase A-1: vite.config.ts

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Vercel 배포 시
  build: {
    target: 'es2020',
    sourcemap: true,
  },
});
```

### Phase A-1: src/main.ts (Tier 1 starter)

```typescript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';

const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap',
      },
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
  },
  center: [127, 37.5],
  zoom: 2,
  pitch: 0,
  projection: 'globe',  // 3D 글로브
});

map.on('style.load', () => {
  map.setFog({
    color: 'rgb(186, 210, 235)',
    'high-color': 'rgb(36, 92, 223)',
    'horizon-blend': 0.02,
    'space-color': 'rgb(11, 11, 25)',
  });
});
```

### Phase A-1: src/core/data.ts (ISS fetcher)

```typescript
export async function fetchISS() {
  const r = await fetch('http://api.open-notify.org/iss-now.json');
  const { iss_position } = await r.json();
  return [+iss_position.longitude, +iss_position.latitude] as [number, number];
}
```

## 6. 알려진 함정

- **CORS**: OpenStreetMap / AWS Terrarium / ISS — 모두 CORS 허용. NASA EONET도 OK.
- **OpenSky**: 폐쇄/타임아웃 → 제외.
- **OpenAQ**: 410 Gone → 제외.
- **CartoDB / OpenTopoMap / OpenRailwayMap**: 403/400 → 베이스맵에서 제외, OSM만 사용.
- **maplibre-gl v5**: `projection: 'globe'` 필수 (구버전 `globeControl` 다름).
- **TypeScript**: `three` 타입은 `@types/three`로 명시 설치.
- **Vercel**: 첫 배포 시 `--yes` 플래그로 비대화형.

## 7. 핵심 결정 + 성공 지표

### 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 프레임워크 | Vite + TS | 빠른 빌드, Vercel 네이티브 |
| 스타일 | maplibre-gl v5 | 글롭/3D 기본 지원 |
| 데이터 | fetch + 캐시 | 외부 API 의존 0 |
| 배포 | Vercel | GitHub 자동 동기화 |
| 비주얼 | 글로브 + 대기 + 3D 빌딩 | 희정님 "3D 깊이·구도" |

### 성공 지표

- ✅ `npm run build` 0 에러
- ✅ `npm run dev` 빈 지도 정상
- ✅ Tier 1 (5 데모 + 5 데이터) 시각 동작
- ✅ Vercel 배포 URL → 외부 시각 확인 가능
- ✅ README 모든 Tier 스크린샷
- ✅ 핸드오프 (`HANDOFF.md`) 다음 세션에서 즉시 작업 가능

## 8. 다음 세션 시작 명령 (복붙)

전체 10단계 완료. 다음 worker는 다음 중 하나를 선택할 수 있음:
- **Tier 4**: 게임 엔진 연동, WebXR, 사용자 업로드 POI, i18n
- **React 마이그레이션**: vanilla TS → React 18 + react-router
- **데이터 소스 확장**: 더 많은 NASA / ESA / KMA 공공 데이터
- **i18n + l10n**: 한국어/영어 토글, 통화·단위 표시

빠른 재기동:
```bash
cd /Users/mac/work/maplibre-demo
npm run dev   # http://localhost:5173 → 글로벌 기본 지도 + 사이드바
git log --oneline -10   # 8개 main commit
git tag -l   # v0.1.0-tier1, v0.2.0-tier2, v0.3.0-tier3
```

## 9. 참고 자료

- 🔗 [maplibre-gl-js 공식 예제](https://maplibre.org/maplibre-gl-js/docs/examples/) — 137개
- 🔗 [maplibre-gl-js GitHub](https://github.com/maplibre/maplibre-gl-js)
- 🔗 [OpenFreeMap](https://openfreemap.org/) — API 키 0 베이스맵
- 🔗 [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) — DEM
- 🔗 [vercel 스킬](file:///Users/mac/.hermes/skills/devops/vercel/) — 배포
- 🔗 [github-pr-workflow 스킬](file:///Users/mac/.hermes/skills/devops/) — PR

## 10. Vercel 배포 가이드 (★★ 실측 완료)

### 현재 상태

- 🔗 **Live Demo**: https://maplibre-demo-eight.vercel.app (HTTP 200, 3431 bytes, bit-perfect)
- 🔗 **Production URL**: https://maplibre-demo-pdifj0ouc-sigco3111s-projects.vercel.app (team-scope, anon 302)
- 📦 **Vercel Project**: `maplibre-demo` (sigco3111s-projects scope)
- ✅ **첫 배포 완료**: 2026-08-06, `vercel --yes --prod --non-interactive --scope sigco3111s-projects`

### 3-파일 정형 (셋업 완료)

```
public/
└── index.html         # 빈 페이지 (3,431 bytes)

vercel.json            # @vercel/static 빌드
.vercelignore          # 배포 제외 (node_modules, .git, *.md, .omo/ 등)
```

`vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

### 표준 배포 명령 (복붙)

```bash
cd /Users/mac/work/maplibre-demo
TOK=$(cat ~/.hermes/secrets/vercel_token.txt)

# 1. 자동 검증 (배포 전)
[ -s ~/.hermes/secrets/vercel_token.txt ] && grep -q "^vcp_" ~/.hermes/secrets/vercel_token.txt || { echo "❌ 토큰 없음"; exit 1; }
vercel whoami --token "$TOK"  # sigco3111 출력 확인

# 2. 변경사항 커밋 + 푸시
git add -A
git commit -m "<commit message>"
git push origin main

# 3. 명시적 redeploy (안전망 — 자동배포 silent fail 대비)
vercel deploy --yes --prod --non-interactive --scope sigco3111s-projects --token "$TOK" 2>&1 | tail -15

# 4. 30초 대기 후 alias 검증
sleep 30
curl -sI https://maplibre-demo-eight.vercel.app | head -1   # → HTTP/2 200
curl -s https://maplibre-demo-eight.vercel.app | wc -c     # → 3,431 (bit-perfect)
```

### v0.2.0+ (Vite 마이그레이션 후) 변경점

| 변경 | 작업 |
|---|---|
| `vercel.json` | `builds.routes` 제거, `buildCommand: "npm run build"`, `outputDirectory: "dist"` 사용 |
| `base` (vite.config.ts) | `/` (Vercel) 또는 `/maplibre-fullstack-demo/` (GitHub Pages) |
| 검증 | 위 "4. 검증" 어서션 + 추가: `dist/assets/index-*.js` SHA == alias JS SHA |

Vite 마이그레이션 후 vercel.json 정형:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 자주 겪는 함정 (실측 4종)

| # | 문제 | 해결 |
|---|---|---|
| 1 | `non-interactive mode에서 scope 없음` 에러 | `--scope sigco3111s-projects` 명시 |
| 2 | team-scope URL 302 anon | README에 **alias** URL (`-eight.vercel.app`) 사용 |
| 3 | push 후 alias 옛 hash | `vercel deploy --prod --force` 강제 redeploy |
| 4 | `.gitignore` 차단 자산 push | `git add -f <path>` (옵션 A) |

### 4축 deploy 전 자기검증 (★ v6.5 패턴)

```bash
# grep + 사전 점검
vercel_cmd="vercel --yes --prod --non-interactive --scope sigco3111s-projects --token \"$TOK\""
grep -q -- '--name' <<<"$vercel_cmd" && echo "❌ --name deprecated" || echo "✓ --name 없음"
grep -q -- '--token' <<<"$vercel_cmd" || echo "❌ --token 없음"
grep -qE '^vcp_' <<<"$TOK" || echo "❌ TOK prefix 이상"
```
