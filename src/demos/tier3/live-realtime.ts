import type { Map as MaplibreMap } from 'maplibre-gl';
import { applyDemo } from '../../core/demoEngine';
import { fetchISS, startISSPolling } from '../../core/data';
import type { Result, FetchError } from '../../core/result';

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

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  const trail: Array<[number, number]> = [];
  const TRAIL_MAX = 60;
  return applyDemo(map, {
    style: STYLE,
    center: [127, 37.5],
    zoom: 2,
    onLoad: (m) => {
      m.addSource('iss', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      m.addLayer({
        id: 'iss-dot',
        type: 'circle',
        source: 'iss',
        paint: { 'circle-radius': 8, 'circle-color': '#ff0000', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 },
      });
      m.addLayer({
        id: 'iss-trail',
        type: 'line',
        source: 'iss',
        paint: { 'line-color': '#ff8888', 'line-width': 2 },
        filter: ['==', '$type', 'LineString'],
      });
      void (async (): Promise<void> => {
        const initial = await fetchISS();
        if (initial.ok) {
          const [lon, lat] = initial.value;
          trail.push([lon, lat]);
          m.jumpTo({ center: [lon, lat], zoom: 3 });
        }
      })();
      const cancel = startISSPolling((r: Result<[number, number], FetchError>) => {
        if (!r.ok) return;
        const [lon, lat] = r.value;
        trail.push([lon, lat]);
        while (trail.length > TRAIL_MAX) trail.shift();
        const data: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [lon, lat] } },
            { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: trail } },
          ],
        };
        const src = m.getSource('iss') as maplibregl.GeoJSONSource | undefined;
        if (src) src.setData(data);
        m.setFilter('iss-trail', ['==', '$type', 'LineString']);
        m.panTo([lon, lat], { duration: 4000 });
      });
      return () => {
        cancel();
        if (m.getLayer('iss-trail')) m.removeLayer('iss-trail');
        if (m.getLayer('iss-dot')) m.removeLayer('iss-dot');
        if (m.getSource('iss')) m.removeSource('iss');
      };
    },
  });
}
