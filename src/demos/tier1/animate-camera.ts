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
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

const CENTER: [number, number] = [127, 37.5];
const RADIUS = 5;
const DURATION_MS = 50;

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: CENTER,
    zoom: 4,
    pitch: 0,
  });

  let raf = 0;
  let running = true;
  let bearing = 0;

  const tick = (): void => {
    if (!running) return;
    bearing = (bearing + 0.2) % 360;
    const rad = (bearing * Math.PI) / 180;
    const center: [number, number] = [
      CENTER[0] + RADIUS * Math.cos(rad) / 4,
      CENTER[1] + RADIUS * Math.sin(rad) / 4,
    ];
    map.easeTo({ center, duration: 0 });
    map.setBearing(bearing);
    raf = window.setTimeout(tick, DURATION_MS) as unknown as number;
  };
  tick();

  const stop = (): void => {
    running = false;
    window.clearTimeout(raf);
  };
  map.once('mousedown', stop);
  map.once('wheel', stop);

  return () => {
    stop();
    map.remove();
  };
}
