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

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 5,
  });

  const keys: Record<string, boolean> = {};
  let bearing = 0;
  const speed = 0.5;

  const hud = document.createElement('div');
  hud.style.cssText = 'position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.7);color:#fff;padding:8px 12px;font:12px monospace;z-index:1;';
  container.parentElement?.appendChild(hud);

  const onKey = (down: boolean) => (e: KeyboardEvent) => {
    if (['w', 'a', 's', 'd', 'q', 'e', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      keys[e.key] = down;
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', onKey(true));
  window.addEventListener('keyup', onKey(false));

  let raf = 0;
  const tick = (): void => {
    const c = map.getCenter();
    let [lng, lat] = [c.lng, c.lat];
    if (keys['w'] || keys['ArrowUp']) lat += speed;
    if (keys['s'] || keys['ArrowDown']) lat -= speed;
    if (keys['a'] || keys['ArrowLeft']) lng -= speed;
    if (keys['d'] || keys['ArrowRight']) lng += speed;
    if (keys['q']) bearing = (bearing - 5) % 360;
    if (keys['e']) bearing = (bearing + 5) % 360;
    map.setCenter([lng, lat]);
    map.setBearing(bearing);
    hud.textContent = `center: ${lng.toFixed(2)}, ${lat.toFixed(2)}  bearing: ${bearing.toFixed(0)}°`;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey(true));
    window.removeEventListener('keyup', onKey(false));
    hud.remove();
    map.remove();
  };
}
