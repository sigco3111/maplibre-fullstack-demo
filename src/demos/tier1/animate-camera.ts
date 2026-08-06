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
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

const CENTER: [number, number] = [127, 37.5];
const RADIUS = 5;

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  let raf = 0;
  let running = true;
  let bearing = 0;
  const stop = (): void => {
    running = false;
    window.clearTimeout(raf);
  };
  const onDown = (): void => stop();
  const onWheel = (): void => stop();

  return applyDemo(map, {
    style: STYLE,
    center: CENTER,
    zoom: 4,
    pitch: 0,
    onLoad: (m) => {
      const tick = (): void => {
        if (!running) return;
        bearing = (bearing + 0.2) % 360;
        const rad = (bearing * Math.PI) / 180;
        const center: [number, number] = [
          CENTER[0] + RADIUS * Math.cos(rad) / 4,
          CENTER[1] + RADIUS * Math.sin(rad) / 4,
        ];
        m.easeTo({ center, duration: 0 });
        m.setBearing(bearing);
        raf = window.setTimeout(tick, 50) as unknown as number;
      };
      tick();
      m.once('mousedown', onDown);
      m.once('wheel', onWheel);
      return () => {
        stop();
        m.off('mousedown', onDown);
        m.off('wheel', onWheel);
      };
    },
  });
}
