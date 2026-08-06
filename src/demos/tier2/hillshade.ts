import type { Map as MaplibreMap } from 'maplibre-gl';
import { applyDemo } from '../../core/demoEngine';

const STYLE = {
  version: 8 as const,
  sources: {
    terrain: {
      type: 'raster-dem' as const,
      tiles: ['https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      encoding: 'terrarium' as const,
      maxzoom: 15,
      attribution: 'Terrain © AWS',
    },
  },
  layers: [],
};

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: STYLE,
    center: [127, 37.5],
    zoom: 10,
    pitch: 60,
    onLoad: (m) => {
      m.setTerrain({ source: 'terrain', exaggeration: 1.5 });
      m.addLayer({
        id: 'hillshade',
        type: 'hillshade',
        source: 'terrain',
        paint: {
          'hillshade-shadow-color': '#000',
          'hillshade-highlight-color': '#fff',
          'hillshade-accent-color': '#000',
        },
      });
      return () => {
        if (m.getLayer('hillshade')) m.removeLayer('hillshade');
      };
    },
  });
}
