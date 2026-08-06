# 🗺️ MapLibre GL JS 풀스택 데모

> **maplibre-gl-js** v5 공식 예제 **20+개** + 검증된 무료 공개 데이터 **15+개** 통합.
> 3D 깊이 · 구도 · 재질 · 조명 · 인터랙티브 — 모든 비주얼 임팩트 카테고리.

## ✨ 무엇이 멋진가

- **🌍 3D 글로브** + 대기 산란 (Atmosphere) — 우주에서 본 지구
- **🏔️ 3D 지형** + 하늘 + 안개 — 광원 변화에 따른 명암
- **🏙️ 3D 건물** + 그림자 — OSM 건물 자동 추출
- **🌡️ 실시간 데이터** — ISS / 지진 / 자연재해 / 기상 / 자전거
- **🎬 애니메이션 카메라** — 자동 회전, 스크롤 비행, 점프 비행
- **📊 시각화** — 히트맵, 클러스터, 시계열 슬라이더

## 🚀 빠른 시작

```bash
npm install
npm run dev
# http://localhost:5173
```

## 🌐 Live Demo

🔗 **https://maplibre-demo-eight.vercel.app**

> 현재 상태: **모든 tier (1/2/3) 라이브** — 21 데모 + 15 데이터 소스
> Latest deploy: `v0.3.0-tier3` (SHA `21e4e4129d02427cab0a923517127b40b2e54f04984b2dd5170c33c0da81981a`)

## 🎯 데모 목록 (21 demos, 3 tiers)

### Tier 1 — 글로브·지형·건물 (5)
| Demo | Maplibre example | Source |
| --- | --- | --- |
| Globe + Atmosphere | `display-a-globe-with-an-atmosphere` | `src/demos/tier1/globe-atmosphere.ts` |
| 3D Terrain | `3d-terrain` (AWS Terrarium DEM) | `src/demos/tier1/3d-terrain.ts` |
| 3D Buildings | `display-buildings-in-3d` (OSM Buildings) | `src/demos/tier1/3d-buildings.ts` |
| Animate Camera | `animate-map-camera-around-a-point` (RAF orbit) | `src/demos/tier1/animate-camera.ts` |
| Sky + Fog + Terrain (base) | `sky-fog-terrain` | `src/demos/tier1/sky-fog-terrain.ts` |

### Tier 2 — 히트맵·하늘·안개 (5)
| Demo | Maplibre example | Source |
| --- | --- | --- |
| Heatmap | `create-a-heatmap-layer` | `src/demos/tier2/heatmap.ts` |
| Hillshade | `add-a-hillshade-layer` | `src/demos/tier2/hillshade.ts` |
| Contour Lines | `add-contour-lines` | `src/demos/tier2/contours.ts` |
| Custom Camera | `customize-camera-animations` | `src/demos/tier2/custom-camera.ts` |
| Sky + Fog + Terrain (advanced) | `sky-fog-terrain` (more params) | `src/demos/tier2/sky-fog-terrain.ts` |

### Tier 3 — 위성·모델·시계열 (11)
| Demo | Maplibre example | Source |
| --- | --- | --- |
| Satellite Map | `display-a-satellite-map` (Esri World Imagery) | `src/demos/tier3/satellite.ts` |
| Globe + Fill Extrusion | `display-a-globe-with-a-fill-extrusion-layer` (Natural Earth) | `src/demos/tier3/fill-extrusion.ts` |
| 3D Model (three.js) | `add-a-3d-model-using-threejs` | `src/demos/tier3/3d-model.ts` |
| 3D Model w/ Shadow | `add-a-3d-model-with-shadow-using-threejs` | `src/demos/tier3/3d-model-shadow.ts` |
| Time Slider | `create-a-time-slider` | `src/demos/tier3/time-slider.ts` |
| Clusters | `create-and-style-clusters` | `src/demos/tier3/clusters.ts` |
| Popup on Click | `display-a-popup-on-click` | `src/demos/tier3/popup.ts` |
| Symbol on Click | `center-the-map-on-a-clicked-symbol` | `src/demos/tier3/symbol-on-click.ts` |
| 360 Photosphere | `enter-a-360-photosphere` (gradient sky) | `src/demos/tier3/360-photosphere.ts` |
| Game-like Controls | `navigate-the-map-with-game-like-controls` (WASD) | `src/demos/tier3/game-controls.ts` |
| Live Realtime (ISS) | `add-live-realtime-data` (ISS polling + trail) | `src/demos/tier3/live-realtime.ts` |

## 📊 데이터 소스 (15 sources, 3 tiers)

| Tier | Source | Endpoint | Polling | Attribution |
| --- | --- | --- | --- | --- |
| 1 | ISS | `api.open-notify.org/iss-now.json` | 5s | Open Notify (HTTP) |
| 1 | USGS Earthquakes | `earthquake.usgs.gov/.../all_week.geojson` | 5m | USGS |
| 1 | NASA EONET | `eonet.gsfc.nasa.gov/api/v3/events` | 10m | NASA EONET |
| 1 | Open-Meteo | `api.open-meteo.com/v1/forecast` | 10m | Open-Meteo |
| 1 | GBFS (bikeshare) | `gbfs.mobilitydata.org` | 5m | MobilityData |
| 2 | Wikipedia GeoSearch | `en.wikipedia.org/w/api.php?geosearch` | one-shot | Wikipedia |
| 2 | OpenFlights | `raw.githubusercontent.com/.../airports.dat` | one-shot | OpenFlights (jpatokal) |
| 2 | NASA EONET categories | `eonet.gsfc.nasa.gov/api/v3/categories` | 60m | NASA EONET |
| 2 | NOAA Solar | `services.swpc.noaa.gov/.../observed-solar-cycle-indices.json` | 30m | NOAA SWPC |
| 2 | GeoNames cities | `public/geonames/cities.json` (static) | one-shot | GeoNames (CC-BY 4.0) |
| 3 | 한국 행정구역 (시도) | `public/kr/admin.json` (CORS-fallback) | one-shot | data.go.kr |
| 3 | 시도 시군구 경계 | `public/kr/district.json` (CORS-fallback) | one-shot | data.go.kr |
| 3 | 전국 POI | `public/kr/poi.json` (CORS-fallback) | one-shot | data.go.kr |
| 3 | NASA Black Marble | `gibs.earthdata.nasa.gov/.../VIIRS_Black_Marble/...` | static | NASA EOSDIS GIBS |
| 3 | GEBCO Seabed | `server.arcgisonline.com/.../World_Ocean_Base` | static | GEBCO / Esri |

## 📦 스택

- **Vite** + **TypeScript**
- **MapLibre GL JS** v5 (BSD 3-Clause)
- **Three.js** (3D 모델 통합)
- **Vercel** (배포)

## 💰 비용 / API 키

**0원**. 모든 데이터 소스는 무료 공개:
- OpenStreetMap · OpenFreeMap · AWS Terrarium DEM
- USGS 지진 · NASA EONET · Open-Meteo · Open Notify (ISS)
- OpenFlights · GBFS · Wikipedia GeoSearch

## 📂 구조 (예정)

```
src/
  ├── main.ts              # Bootstrap
  ├── styles.css
  ├── core/
  │   ├── map.ts           # MapLibre init
  │   └── data.ts          # 데이터 fetcher (JSON/GeoJSON)
  ├── demos/
  │   ├── tier1/           # 5개 — 글로브/지형/건물
  │   ├── tier2/           # 5개 — 히트맵/하늘/안개
  │   └── tier3/           # 10+개 — 위성/모델/시계열/클러스터
  └── data/
      └── sources.ts       # 15+ 데이터 소스 catalog
```

## 🎯 데모 티어

| Tier | 예제 | 데이터 |
|---|---|---|
| **A-1** | Globe + Atmosphere + 3D Terrain + 3D Buildings + Animate Camera | ISS + USGS + EONET + Open-Meteo + GBFS |
| **B-2** | Heatmap + Sky Fog + Hillshade + Contour + Custom Camera | Wikipedia + OpenFlights + NASA categories + NOAA + GeoNames |
| **C-3** | Satellite + Fill Extrusion + 3D Models + Time Slider + Cluster + Popup + Symbol + 360 Photosphere + Game-like + Realtime | 공공데이터 + 정적 자산 + POI |

## 📚 참고

- 🔗 [maplibre-gl-js 공식 예제 (137개)](https://maplibre.org/maplibre-gl-js/docs/examples/)
- 🔗 [maplibre-gl-js GitHub](https://github.com/maplibre/maplibre-gl-js)
- 🔗 [OpenFreeMap](https://openfreemap.org/) — API 키 0 베이스맵
- 🔗 [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) — 3D DEM

## 📜 라이선스

MIT — 본 저장소는 MIT. MapLibre GL JS는 BSD 3-Clause.
