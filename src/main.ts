import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';

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

const map = new maplibregl.Map({
  container: 'map',
  style: OSM_STYLE,
  center: [127, 37.5],
  zoom: 2,
  pitch: 0,
  ...({ projection: 'globe' } as { projection: string }),
});

map.on('style.load', () => {
  (map as unknown as { setFog: (fog: Record<string, unknown>) => void }).setFog({
    color: 'rgb(186, 210, 235)',
    'high-color': 'rgb(36, 92, 223)',
    'horizon-blend': 0.02,
    'space-color': 'rgb(11, 11, 25)',
  });
});

function handleRoute(): void {
  const hash = window.location.hash;
  if (hash.startsWith('#/tier1/') || hash.startsWith('#/tier2/') || hash.startsWith('#/tier3/')) {
    console.log(`[router] route: ${hash}`);
  } else {
    console.log('[router] no tier route active (will activate in task #8)');
  }
}

window.addEventListener('hashchange', handleRoute);
handleRoute();
