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
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

function makeSyntheticFeatures(center: [number, number], count: number): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  let seed = 1;
  const rand = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const dx = (rand() - 0.5) * 4;
    const dy = (rand() - 0.5) * 2;
    features.push({
      type: 'Feature',
      properties: { mag: 1 + rand() * 5 },
      geometry: { type: 'Point', coordinates: [center[0] + dx, center[1] + dy] },
    });
  }
  return { type: 'FeatureCollection', features };
}

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 4,
  });
  map.on('load', () => {
    map.addSource('heat-points', { type: 'geojson', data: makeSyntheticFeatures([127, 37.5], 800) });
    map.addLayer({
      id: 'heat',
      type: 'heatmap',
      source: 'heat-points',
      paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
        'heatmap-intensity': 1,
        'heatmap-radius': 20,
        'heatmap-opacity': 0.8,
      },
    });
  });
  return () => map.remove();
}
