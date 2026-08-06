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
    countries: {
      type: 'geojson' as const,
      data: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
      attribution: 'Natural Earth',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [10, 20],
    zoom: 2,
    pitch: 60,
    ...({ projection: 'globe' } as { projection: string }),
  });
  map.on('load', () => {
    map.addLayer({
      id: 'countries-extrude',
      type: 'fill-extrusion',
      source: 'countries',
      paint: { 'fill-extrusion-color': '#2c5fa3', 'fill-extrusion-height': 50000, 'fill-extrusion-opacity': 0.6 },
    });
  });
  return () => map.remove();
}
