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
        features: Array.from({ length: 50 }, (_, i) => ({
          type: 'Feature' as const,
          properties: { t: i },
          geometry: { type: 'Point' as const, coordinates: [125 + Math.random() * 4, 35 + Math.random() * 5] },
        })),
      },
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 6,
  });
  map.on('load', () => {
    map.addLayer({
      id: 'time-circles',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['get', 't'], 0, 3, 50, 12],
        'circle-color': ['interpolate', ['linear'], ['get', 't'], 0, '#8888ff', 50, '#ff8888'],
        'circle-opacity': 0.7,
      },
    });
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '50';
    slider.value = '50';
    slider.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:300px;z-index:1;';
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      map.setFilter('time-circles', ['<=', ['get', 't'], v]);
    });
    container.parentElement?.appendChild(slider);
  });
  return () => map.remove();
}
