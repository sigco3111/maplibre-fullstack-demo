import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import { renderSidebar, type SidebarEntry } from './sidebar';
import { navigateTo } from './router';

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

const TIER1_ENTRIES: SidebarEntry[] = [
  { tier: 'tier1', slug: 'globe-atmosphere', title: 'Globe + Atmosphere', ko: '3D 글로브 + 대기', desc: '지구를 둥근 구체로 보여주고 푸른 대기(하늘색 그라데이션) 효과를 줍니다' },
  { tier: 'tier1', slug: '3d-terrain', title: '3D Terrain (AWS DEM)', ko: '3D 지형', desc: 'AWS 위성 DEM 데이터로 산·계곡·평야를 입체적으로 보여줍니다' },
  { tier: 'tier1', slug: '3d-buildings', title: '3D Buildings (OpenFreeMap)', ko: '3D 건물', desc: 'OpenFreeMap 건물 레이어를 60도 기울여 추출해 도심 스카이라인을 만듭니다' },
  { tier: 'tier1', slug: 'animate-camera', title: 'Animate Camera', ko: '카메라 자동 회전', desc: '지도를 마우스로 멈출 때까지 자동으로 한 바퀴 돕니다' },
  { tier: 'tier1', slug: 'sky-fog-terrain', title: 'Sky + Fog + Terrain (base)', ko: '하늘 + 안개 + 지형', desc: '하늘색 그라데이션과 지평선 안개로 지형 위에 자연스러운 분위기를 입힙니다' },
];

const TIER2_ENTRIES: SidebarEntry[] = [
  { tier: 'tier2', slug: 'heatmap', title: 'Heatmap', ko: '히트맵', desc: '800개 무작위 점의 강도를 색 농도로 보여줘서 밀집 지역을 한눈에 봅니다' },
  { tier: 'tier2', slug: 'hillshade', title: 'Hillshade', ko: '음영기복', desc: '지형에 가상의 햇빛을 비춰 음영을 만들고 산의 형태를 또렷하게 보여줍니다' },
  { tier: 'tier2', slug: 'contours', title: 'Contour Lines', ko: '등고선', desc: 'AWS DEM으로 고도 기반 등고선 레이어를 그려 지형 높낮이를 선으로 나타냅니다' },
  { tier: 'tier2', slug: 'custom-camera', title: 'Custom Camera', ko: '도시 점프 버튼', desc: '서울·도쿄·베이징·시드니 4개 도시에 카메라를 날려 보내는 버튼을 추가합니다' },
  { tier: 'tier2', slug: 'sky-fog-terrain', title: 'Sky + Fog + Terrain (advanced)', ko: '하늘 + 안개 + 지형 (심화)', desc: 'Tier1 버전보다 안개 범위·하늘색·지구 굴절이 더 정교하게 표현됩니다' },
];

const TIER3_ENTRIES: SidebarEntry[] = [
  { tier: 'tier3', slug: 'satellite', title: 'Satellite Map (Esri)', ko: '위성 지도', desc: '에스리(Esri) 위성 이미지로 실제 지표면을 컬러 사진처럼 보여줍니다' },
  { tier: 'tier3', slug: 'fill-extrusion', title: 'Globe + Fill Extrusion', ko: '글로브 + 국가 추출', desc: '전 세계 국가 경계를 3D 입체로 띄워 대륙 형태를 입체감 있게 봅니다' },
  { tier: 'tier3', slug: '3d-model', title: '3D Model (three.js)', ko: '3D 모델 (three.js)', desc: 'three.js로 붉은 큐브를 지도 위에 띄우고 천천히 회전시킵니다' },
  { tier: 'tier3', slug: '3d-model-shadow', title: '3D Model w/ Shadow', ko: '3D 모델 + 그림자', desc: '큐브가 지면에 그림자를 드리워 시간대별 광원 변화처럼 보이게 합니다' },
  { tier: 'tier3', slug: 'time-slider', title: 'Time Slider', ko: '시간 슬라이더', desc: '50개 지점의 시간값(0~50)을 슬라이더로 조절해 마커 표시 범위를 실시간 변경합니다' },
  { tier: 'tier3', slug: 'clusters', title: 'Clusters', ko: '클러스터', desc: '200개 지점이 가까우면 자동으로 합쳐져 큰 원으로 카운트를 표시합니다' },
  { tier: 'tier3', slug: 'popup', title: 'Popup on Click', ko: '클릭 팝업', desc: '도시 마커를 클릭하면 도시에 이름이 적힌 팝업이 뜹니다' },
  { tier: 'tier3', slug: 'symbol-on-click', title: 'Symbol on Click', ko: '심볼 클릭', desc: '도시 마커 클릭 시 지도가 줌인 12레벨로 부드럽게 이동합니다' },
  { tier: 'tier3', slug: '360-photosphere', title: '360 Photosphere', ko: '360 사진천장', desc: '전후좌우 하늘색 그라데이션을 큰 구체로 펼쳐 천장처럼 둘러쌉니다' },
  { tier: 'tier3', slug: 'game-controls', title: 'Game-like Controls (WASD)', ko: '게임 조작 (WASD)', desc: 'W/A/S/D·Q/E 키로 지도를 평행이동하고 회전·줌 할 수 있는 HUD가 좌상단에 뜹니다' },
  { tier: 'tier3', slug: 'live-realtime', title: 'Live Realtime (ISS)', ko: 'ISS 실시간 위치', desc: '국제우주정거장 위치를 5초마다 갱신해 빨간 점 + 궤적선으로 표시합니다' },
];

const map = new maplibregl.Map({
  container: 'map',
  style: OSM_STYLE,
  center: [127, 37.5],
  zoom: 2,
  pitch: 0,
  ...({ projection: 'globe' } as { projection: string }),
});

const sidebarRoot = document.getElementById('sidebar-root');
if (sidebarRoot) renderSidebar(sidebarRoot, [...TIER1_ENTRIES, ...TIER2_ENTRIES, ...TIER3_ENTRIES], (id, enabled) => {
  console.log('[data toggle]', id, enabled);
});

map.on('load', () => {
  if (window.location.hash) {
    void navigateTo(map, window.location.hash);
  } else {
    console.log('[router] no route; sidebar shows Tier 1 entries');
  }
});

window.addEventListener('hashchange', () => { void navigateTo(map, window.location.hash); });
