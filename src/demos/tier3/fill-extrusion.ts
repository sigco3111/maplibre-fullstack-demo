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
    countries: {
      type: 'geojson' as const,
      data: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
      attribution: 'Natural Earth',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: STYLE,
    center: [10, 20],
    zoom: 2,
    pitch: 60,
    projection: 'globe',
    onLoad: (m) => {
      m.addLayer({
        id: 'countries-extrude',
        type: 'fill-extrusion',
        source: 'countries',
        paint: { 'fill-extrusion-color': '#2c5fa3', 'fill-extrusion-height': 50000, 'fill-extrusion-opacity': 0.6 },
      });
      return () => {
        if (m.getLayer('countries-extrude')) m.removeLayer('countries-extrude');
      };
    },
  });
}
