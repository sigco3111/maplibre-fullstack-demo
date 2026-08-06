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
  { tier: 'tier1', slug: 'globe-atmosphere', title: 'Globe + Atmosphere' },
  { tier: 'tier1', slug: '3d-terrain', title: '3D Terrain (AWS DEM)' },
  { tier: 'tier1', slug: '3d-buildings', title: '3D Buildings (OSM)' },
  { tier: 'tier1', slug: 'animate-camera', title: 'Animate Camera' },
  { tier: 'tier1', slug: 'sky-fog-terrain', title: 'Sky + Fog + Terrain (base)' },
];

const TIER2_ENTRIES: SidebarEntry[] = [
  { tier: 'tier2', slug: 'heatmap', title: 'Heatmap' },
  { tier: 'tier2', slug: 'hillshade', title: 'Hillshade' },
  { tier: 'tier2', slug: 'contours', title: 'Contour Lines' },
  { tier: 'tier2', slug: 'custom-camera', title: 'Custom Camera' },
  { tier: 'tier2', slug: 'sky-fog-terrain', title: 'Sky + Fog + Terrain (advanced)' },
];

const TIER3_ENTRIES: SidebarEntry[] = [
  { tier: 'tier3', slug: 'satellite', title: 'Satellite Map' },
  { tier: 'tier3', slug: 'fill-extrusion', title: 'Globe + Fill Extrusion' },
  { tier: 'tier3', slug: '3d-model', title: '3D Model (three.js)' },
  { tier: 'tier3', slug: '3d-model-shadow', title: '3D Model w/ Shadow' },
  { tier: 'tier3', slug: 'time-slider', title: 'Time Slider' },
  { tier: 'tier3', slug: 'clusters', title: 'Clusters' },
  { tier: 'tier3', slug: 'popup', title: 'Popup on Click' },
  { tier: 'tier3', slug: 'symbol-on-click', title: 'Symbol on Click' },
  { tier: 'tier3', slug: '360-photosphere', title: '360 Photosphere' },
  { tier: 'tier3', slug: 'game-controls', title: 'Game-like Controls' },
  { tier: 'tier3', slug: 'live-realtime', title: 'Live Realtime (ISS)' },
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

map.on('style.load', () => {
  (map as unknown as { setFog: (fog: Record<string, unknown>) => void }).setFog({
    color: 'rgb(186, 210, 235)',
    'high-color': 'rgb(36, 92, 223)',
    'horizon-blend': 0.02,
    'space-color': 'rgb(11, 11, 25)',
  });
});

map.on('load', () => {
  window.addEventListener('hashchange', () => { void navigateTo(map, window.location.hash); });
  if (window.location.hash) {
    void navigateTo(map, window.location.hash);
  } else {
    console.log('[router] no route; sidebar shows Tier 1 entries');
  }
});
