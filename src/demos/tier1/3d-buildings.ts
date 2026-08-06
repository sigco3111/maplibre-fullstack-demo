import type { Map as MaplibreMap } from 'maplibre-gl';
import { applyDemo } from '../../core/demoEngine';

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [127.005, 37.56],
    zoom: 15.5,
    pitch: 60,
    bearing: -20,
    onLoad: (m) => {
      const layers = m.getStyle()?.layers ?? [];
      if (!layers.some((l) => l.id === 'building' || l.id === 'building-3d')) {
        console.warn('[3d-buildings] OpenFreeMap style does not expose a building layer (available:', layers.map((l) => l.id).join(', '), ')');
        return;
      }
      if (!m.getLayer('building-3d') && m.getLayer('building')) {
        m.setPaintProperty('building', 'fill-extrusion-color', '#b8c5d6');
        m.setPaintProperty('building', 'fill-extrusion-height', 12);
        m.setPaintProperty('building', 'fill-extrusion-base', 0);
        m.setPaintProperty('building', 'fill-extrusion-opacity', 0.85);
      }
    },
  });
}
