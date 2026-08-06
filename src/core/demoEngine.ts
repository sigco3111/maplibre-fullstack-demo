import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMapType } from 'maplibre-gl';

export type DemoMount = (map: MaplibreMapType) => () => void;

export type DemoSpec = {
  style: maplibregl.StyleSpecification | string;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  projection?: 'globe' | 'mercator';
  onLoad?: (map: MaplibreMapType) => (() => void) | void;
};

let pendingUnmount: (() => void) | null = null;
let styleWaitToken = 0;
let maxWaitTimer: ReturnType<typeof setTimeout> | null = null;

const REVEAL_MAX_WAIT_MS = 2000;

export function applyDemo(map: MaplibreMapType, spec: DemoSpec): () => void {
  cancelPending();
  const token = ++styleWaitToken;

  const container = document.getElementById('map');
  if (container) container.style.visibility = 'hidden';

  if (pendingUnmount) {
    try { pendingUnmount(); } catch (e) { console.warn('[demo] unmount error', e); }
    pendingUnmount = null;
  }

  let cancelled = false;
  const performSwitch = (): void => {
    if (token !== styleWaitToken) return;
    if (cancelled) return;
    if (container) container.style.visibility = 'hidden';
    requestAnimationFrame(() => {
      if (token !== styleWaitToken || cancelled) return;
      try {
        map.setStyle(spec.style as never, { diff: false });
      } catch (e) {
        console.error('[demo] setStyle error', e);
      }
      if (spec.projection) {
        try { map.setProjection({ type: spec.projection } as never); } catch (e) { console.warn('[demo] setProjection', e); }
      }
      if (spec.center) map.setCenter(spec.center);
      if (spec.zoom !== undefined) map.setZoom(spec.zoom);
      if (spec.pitch !== undefined) map.setPitch(spec.pitch);
      if (spec.bearing !== undefined) map.setBearing(spec.bearing);
    });
  };

  if (map.loaded()) {
    performSwitch();
  } else {
    map.once('load', performSwitch);
  }

  let onLoadCleanup: (() => void) | void = undefined;
  let revealed = false;

  const reveal = (): void => {
    if (cancelled || revealed) return;
    if (token !== styleWaitToken) return;
    revealed = true;
    if (container) container.style.visibility = 'visible';
    requestAnimationFrame(() => {
      if (cancelled || token !== styleWaitToken) return;
      setTimeout(() => {
        if (cancelled || token !== styleWaitToken) return;
        if (spec.onLoad) {
        try {
          onLoadCleanup = spec.onLoad(map);
        } catch (e) {
          console.error('[demo] onLoad error', e);
        }
        }
      }, 0);
    });
    pendingUnmount = () => {
      try {
        if (typeof onLoadCleanup === 'function') onLoadCleanup();
      } catch (e) { console.warn('[demo] cleanup error', e); }
      try { map.off('idle', onIdle); } catch (e) { console.warn('[demo] off', e); }
    };
  };

  const onIdle = (): void => { reveal(); };
  map.once('idle', onIdle);

  maxWaitTimer = setTimeout(() => { reveal(); }, REVEAL_MAX_WAIT_MS);

  return () => {
    cancelled = true;
    if (maxWaitTimer) {
      clearTimeout(maxWaitTimer);
      maxWaitTimer = null;
    }
    if (pendingUnmount) {
      try { pendingUnmount(); } catch (e) { console.warn('[demo] unmount-cancel', e); }
      pendingUnmount = null;
    }
    try { map.off('idle', onIdle); } catch (e) { console.warn('[demo] off', e); }
  };
}

function cancelPending(): void {
  if (maxWaitTimer) {
    clearTimeout(maxWaitTimer);
    maxWaitTimer = null;
  }
  if (pendingUnmount) {
    try { pendingUnmount(); } catch (e) { console.warn('[demo] cancel', e); }
    pendingUnmount = null;
  }
}
