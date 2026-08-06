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
    points: {
      type: 'geojson' as const,
      data: {
        type: 'FeatureCollection' as const,
        features: Array.from({ length: 200 }, () => ({
          type: 'Feature' as const,
          properties: {},
          geometry: { type: 'Point' as const, coordinates: [125 + Math.random() * 4, 35 + Math.random() * 5] },
        })),
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 5,
  });
  map.on('load', () => {
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'points',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 5, '#f1f075', 10, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 15, 5, 22, 10, 30],
      },
    });
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'points',
      filter: ['has', 'point_count'],
      layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
    });
    map.addLayer({
      id: 'unclustered',
      type: 'circle',
      source: 'points',
      filter: ['!', ['has', 'point_count']],
      paint: { 'circle-color': '#11b4da', 'circle-radius': 4 },
    });
  });
  return () => map.remove();
}
