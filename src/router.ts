import type { Map as MaplibreMap } from 'maplibre-gl';

type UnmountFn = () => void;
type MountFn = (container: HTMLElement, map: MaplibreMap) => UnmountFn;
type DemoModule = { mount: MountFn };

const DEMO_MODULES: Record<string, DemoModule> = Object.fromEntries(
  Object.entries(
    import.meta.glob<DemoModule>('./demos/**/*.ts', { eager: true }),
  ).map(([path, mod]) => {
    const m = path.match(/\/demos\/(tier[123])\/([a-z0-9-]+)\.ts$/);
    return m ? [`${m[1]}/${m[2]}`, mod] : [path, mod];
  }),
);

let currentUnmount: UnmountFn | null = null;
let currentDemoKey: string | null = null;

export function currentDemo(): string | null {
  return currentDemoKey;
}

export async function navigateTo(map: MaplibreMap, hash: string): Promise<void> {
  if (currentUnmount) {
    try { currentUnmount(); } catch (err) { console.warn('[router] unmount error', err); }
    currentUnmount = null;
    currentDemoKey = null;
  }
  const m = hash.match(/^#\/(tier[123])\/([a-z0-9-]+)$/);
  if (!m) {
    console.log('[router] no route match for', hash);
    return;
  }
  const key = `${m[1]}/${m[2]}`;
  const mod = DEMO_MODULES[key];
  if (!mod || typeof mod.mount !== 'function') {
    console.error(`[router] demo ${key} not found (have ${Object.keys(DEMO_MODULES).join(', ')})`);
    return;
  }
  const container = document.getElementById('map');
  if (!container) return;
  currentUnmount = mod.mount(container, map);
  currentDemoKey = key;
  console.log(`[router] mounted ${key}`);
}

export function listRegisteredDemos(): string[] {
  return Object.keys(DEMO_MODULES);
}
