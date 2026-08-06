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

export function mount(container: HTMLElement, map: MaplibreMap): () => void {
  let slider: HTMLInputElement | null = null;
  return applyDemo(map, {
    style: STYLE,
    center: [127, 37.5],
    zoom: 6,
    onLoad: (m) => {
      m.addLayer({
        id: 'time-circles',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 't'], 0, 3, 50, 12],
          'circle-color': ['interpolate', ['linear'], ['get', 't'], 0, '#8888ff', 50, '#ff8888'],
          'circle-opacity': 0.7,
        },
      });
      slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '50';
      slider.value = '50';
      slider.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);width:300px;z-index:1;';
      const onInput = (): void => {
        const v = parseInt(slider!.value, 10);
        m.setFilter('time-circles', ['<=', ['get', 't'], v]);
      };
      slider.addEventListener('input', onInput);
      container.parentElement?.appendChild(slider);
      return () => {
        slider?.removeEventListener('input', onInput);
        slider?.remove();
        slider = null;
        if (m.getLayer('time-circles')) m.removeLayer('time-circles');
      };
    },
  });
}
