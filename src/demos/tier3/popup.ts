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
    cities: {
      type: 'geojson' as const,
      data: {
        type: 'FeatureCollection' as const,
        features: [
          { type: 'Feature' as const, properties: { name: 'Seoul' }, geometry: { type: 'Point' as const, coordinates: [127.0, 37.55] } },
          { type: 'Feature' as const, properties: { name: 'Tokyo' }, geometry: { type: 'Point' as const, coordinates: [139.7, 35.7] } },
          { type: 'Feature' as const, properties: { name: 'Beijing' }, geometry: { type: 'Point' as const, coordinates: [116.4, 39.9] } },
        ],
      },
    },
  },
  layers: [
    { id: 'osm', type: 'raster' as const, source: 'osm' },
    { id: 'cities', type: 'circle' as const, source: 'cities', paint: { 'circle-radius': 8, 'circle-color': '#ff5050' } },
  ],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 4,
  });
  map.on('load', () => {
    map.on('click', 'cities', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
      new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Popup({ closeButton: true })
        .setLngLat(coords)
        .setHTML(`<strong>${(f.properties as { name: string }).name}</strong>`)
        .addTo(map);
    });
  });
  return () => map.remove();
}
