import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [127.005, 37.56],
    zoom: 15.5,
    pitch: 60,
    bearing: -20,
  });
  map.on('load', () => {
    const layers = map.getStyle()?.layers ?? [];
    const hasBuildings = layers.some((l) => l.id === 'building' || l.id === 'building-3d');
    if (!hasBuildings) {
      console.warn('[3d-buildings] OpenFreeMap style does not expose a "building" layer (available:', layers.map((l) => l.id).join(', '), ')');
      return;
    }
    if (!map.getLayer('building-3d') && map.getLayer('building')) {
      map.setPaintProperty('building', 'fill-extrusion-color', '#b8c5d6');
      map.setPaintProperty('building', 'fill-extrusion-height', 12);
      map.setPaintProperty('building', 'fill-extrusion-base', 0);
      map.setPaintProperty('building', 'fill-extrusion-opacity', 0.85);
    }
  });
  return () => map.remove();
}
