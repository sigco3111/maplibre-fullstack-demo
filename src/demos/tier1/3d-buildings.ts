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
    osmbuildings: {
      type: 'vector' as const,
      tiles: ['https://data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json'],
      maxzoom: 14,
      attribution: '© OSM Buildings',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [127.0, 37.55],
    zoom: 15,
    pitch: 60,
    bearing: 0,
  });
  map.on('load', () => {
    if (!map.getSource('osmbuildings')) return;
    map.addLayer({
      id: 'buildings-3d',
      type: 'fill-extrusion',
      source: 'osmbuildings',
      paint: {
        'fill-extrusion-color': '#b8c5d6',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.85,
      },
    });
  });
  return () => map.remove();
}
