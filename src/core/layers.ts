import type { Map as MaplibreMap } from 'maplibre-gl';
import type { DataSourceId } from '../data/sources';
import { SOURCES } from '../data/sources';

type LayerSetter = (map: MaplibreMap | null, enabled: boolean) => void;

const registry = new Map<DataSourceId, { cancel: () => void; set: LayerSetter }>();

export function registerDataLayer(
  id: DataSourceId,
  set: LayerSetter,
): { cancel: () => void } {
  const cancel = (): void => set(null, false);
  registry.set(id, { cancel, set });
  return { cancel };
}

export function enableLayer(map: MaplibreMap, id: DataSourceId): void {
  const entry = registry.get(id);
  if (!entry) return;
  entry.cancel();
  entry.set(map, true);
}

export function disableLayer(id: DataSourceId): void {
  const entry = registry.get(id);
  if (!entry) return;
  entry.set(null, false);
}

export function cleanupAllLayers(): void {
  for (const [, entry] of registry) {
    try { entry.set(null, false); } catch (err) { console.warn('[layers] cleanup error', err); }
  }
}

export function listDataSources(): DataSourceId[] {
  return Object.keys(SOURCES) as DataSourceId[];
}
