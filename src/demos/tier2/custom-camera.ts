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
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

const CITIES: Array<{ name: string; coord: [number, number] }> = [
  { name: 'Seoul', coord: [127.0, 37.55] },
  { name: 'Tokyo', coord: [139.7, 35.7] },
  { name: 'Beijing', coord: [116.4, 39.9] },
  { name: 'Sydney', coord: [151.2, -33.9] },
];

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 3,
  });

  map.on('load', () => {
    for (const city of CITIES) {
      const el = document.createElement('button');
      el.textContent = city.name;
      el.style.cssText = 'background:#222;color:#fff;border:1px solid #555;padding:4px 8px;border-radius:3px;cursor:pointer;';
      el.addEventListener('click', () => {
        map.flyTo({ center: city.coord, zoom: 9, speed: 1.5, essential: true });
      });
      new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Marker({ element: el })
        .setLngLat(city.coord)
        .addTo(map);
    }
  });

  return () => map.remove();
}
