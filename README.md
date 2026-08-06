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

> 현재 상태: 빌드 셋업 완료, Tier 1 데모 작업 예정.
> Tier 1 작업 완료 시 Vercel 자동 재배포 (5-30초).

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
