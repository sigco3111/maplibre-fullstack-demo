import type { Map as MaplibreMap } from 'maplibre-gl';
import { applyDemo } from '../../core/demoEngine';

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
  fog: {
    color: 'rgb(170, 200, 230)',
    'high-color': 'rgb(20, 70, 180)',
    'horizon-blend': 0.05,
    'space-color': 'rgb(8, 8, 20)',
    range: [0.5, 12],
  } as never,
};

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: STYLE,
    center: [127.005, 37.56],
    zoom: 16,
    pitch: 70,
    bearing: 30,
    onLoad: (m) => {
      m.setTerrain({ source: 'terrain', exaggeration: 1.5 });
    },
  });
}
