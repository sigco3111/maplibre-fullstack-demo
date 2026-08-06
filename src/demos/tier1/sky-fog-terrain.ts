import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';

const STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
    terrain: {
      type: 'raster-dem' as const,
      tiles: ['https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      encoding: 'terrarium' as const,
      maxzoom: 15,
      attribution: 'Terrain © AWS',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 10,
    pitch: 50,
    bearing: 0,
  });
  map.on('load', () => {
    map.setTerrain({ source: 'terrain', exaggeration: 1.0 });
  });
  map.on('style.load', () => {
    (map as unknown as { setFog: (fog: Record<string, unknown>) => void }).setFog({
      color: 'rgb(186, 210, 235)',
      'high-color': 'rgb(36, 92, 223)',
      'horizon-blend': 0.02,
      'space-color': 'rgb(11, 11, 25)',
    });
  });
  return () => map.remove();
}
