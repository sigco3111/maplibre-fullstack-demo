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
    cities: {
      type: 'geojson' as const,
      data: {
        type: 'FeatureCollection' as const,
        features: [
          { type: 'Feature' as const, properties: { name: 'Seoul' }, geometry: { type: 'Point' as const, coordinates: [127.0, 37.55] } },
          { type: 'Feature' as const, properties: { name: 'Busan' }, geometry: { type: 'Point' as const, coordinates: [129.08, 35.18] } },
          { type: 'Feature' as const, properties: { name: 'Incheon' }, geometry: { type: 'Point' as const, coordinates: [126.7, 37.46] } },
        ],
      },
    },
  },
  layers: [
    { id: 'osm', type: 'raster' as const, source: 'osm' },
    { id: 'cities', type: 'circle' as const, source: 'cities', paint: { 'circle-radius': 8, 'circle-color': '#5050ff' } },
  ],
};

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: STYLE,
    center: [127.5, 36.5],
    zoom: 6,
    onLoad: (m) => {
      const onClick = (e: maplibregl.MapLayerMouseEvent): void => {
        const f = e.features?.[0];
        if (!f) return;
        const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
        m.easeTo({ center: coords, zoom: 12, duration: 1500 });
      };
      m.on('click', 'cities', onClick);
      return () => { m.off('click', 'cities', onClick); };
    },
  });
}
