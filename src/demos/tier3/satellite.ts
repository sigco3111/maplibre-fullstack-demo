import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';

const STYLE = {
  version: 8 as const,
  sources: {
    satellite: {
      type: 'raster' as const,
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Imagery © Esri',
    },
  },
  layers: [{ id: 'satellite', type: 'raster' as const, source: 'satellite' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 4,
  });
  return () => map.remove();
}
