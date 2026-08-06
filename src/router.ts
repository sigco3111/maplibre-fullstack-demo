import type { Map as MaplibreMap } from 'maplibre-gl';

type UnmountFn = () => void;
type MountFn = (container: HTMLElement, map: MaplibreMap) => UnmountFn;

let currentUnmount: UnmountFn | null = null;
let currentDemoKey: string | null = null;

export type DemoEntry = {
  tier: 'tier1' | 'tier2' | 'tier3';
  slug: string;
  title: string;
  load: () => Promise<{ mount: MountFn }>;
};

export async function navigateTo(map: MaplibreMap, hash: string): Promise<void> {
  if (currentUnmount) {
    try { currentUnmount(); } catch (err) { console.warn('[router] unmount error', err); }
    currentUnmount = null;
    currentDemoKey = null;
  }
  const m = hash.match(/^#\/(tier[123])\/([a-z0-9-]+)$/);
  if (!m) return;
  const [, tier, slug] = m;
  const key = `${tier}/${slug}`;
  const mod = await import(
    tier === 'tier1'
      ? /* @vite-ignore */ `./demos/${tier}/${slug}.ts`
      : tier === 'tier2'
      ? /* @vite-ignore */ `./demos/${tier}/${slug}.ts`
      : /* @vite-ignore */ `./demos/${tier}/${slug}.ts`
  );
  if (typeof mod.mount !== 'function') {
    console.error(`[router] demo ${key} has no mount() export`);
    return;
  }
  const container = document.getElementById('map');
  if (!container) return;
  currentUnmount = mod.mount(container, map);
  currentDemoKey = key;
  console.log(`[router] mounted ${key}`);
}

export function currentDemo(): string | null {
  return currentDemoKey;
}
