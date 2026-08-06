import { ok, err, type Result, type FetchError } from './result';
import { log } from './log';

type USGSEarthquakeFeature = {
  type: 'Feature';
  properties: { mag: number; place: string; time: number; url: string };
  geometry: { type: 'Point'; coordinates: [number, number, number] };
  id: string;
};

export type USGSFeatureCollection = {
  type: 'FeatureCollection';
  features: USGSEarthquakeFeature[];
};

export type EONETEvent = {
  id: string;
  title: string;
  geometry: { coordinates: [number, number] };
  categories: Array<{ id: string; title: string }>;
};

export type OpenMeteoCurrent = {
  temperature: number;
  windSpeed: number;
  time: string;
};

export type GBFSStation = {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  num_bikes_available: number;
};

export type WikiGeoResult = {
  pageid: number;
  title: string;
  lat: number;
  lon: number;
  dist: number;
};

export type EONETCategory = {
  id: string;
  title: string;
  description?: string;
};

export type NOAAF107 = {
  time_tag: string;
  f10_7: number;
  ssn: number;
};

export type GeoName = {
  geonameId: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
  population: number;
};

export async function fetchISS(): Promise<Result<[number, number], FetchError>> {
  const url = 'http://api.open-notify.org/iss-now.json';
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as { iss_position?: { longitude: string; latitude: string } };
    if (!j.iss_position) return err({ code: 'parse', message: 'missing iss_position', url });
    return ok([+j.iss_position.longitude, +j.iss_position.latitude]);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export function startISSPolling(
  onUpdate: (r: Result<[number, number], FetchError>) => void,
  intervalMs = 5_000,
): () => void {
  let cancelled = false;
  const tick = async (): Promise<void> => {
    if (cancelled) return;
    const r = await fetchISS();
    if (cancelled) return;
    onUpdate(r);
    if (!r.ok) log.warn('[ISS]', r.error.code, r.error.message);
  };
  void tick();
  const id = window.setInterval(() => { void tick(); }, intervalMs);
  return () => { cancelled = true; window.clearInterval(id); };
}

export async function fetchUSGS(): Promise<Result<USGSFeatureCollection, FetchError>> {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as USGSFeatureCollection;
    return ok(j);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export function startUSGSPolling(
  onUpdate: (r: Result<USGSFeatureCollection, FetchError>) => void,
  intervalMs = 300_000,
): () => void {
  let cancelled = false;
  const tick = async (): Promise<void> => {
    if (cancelled) return;
    const r = await fetchUSGS();
    if (cancelled) return;
    onUpdate(r);
    if (!r.ok) log.warn('[USGS]', r.error.code, r.error.message);
  };
  void tick();
  const id = window.setInterval(() => { void tick(); }, intervalMs);
  return () => { cancelled = true; window.clearInterval(id); };
}

export async function fetchEONET(): Promise<Result<EONETEvent[], FetchError>> {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100';
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as { events: EONETEvent[] };
    return ok(j.events);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export function startEONETPolling(
  onUpdate: (r: Result<EONETEvent[], FetchError>) => void,
  intervalMs = 600_000,
): () => void {
  let cancelled = false;
  const tick = async (): Promise<void> => {
    if (cancelled) return;
    const r = await fetchEONET();
    if (cancelled) return;
    onUpdate(r);
    if (!r.ok) log.warn('[EONET]', r.error.code, r.error.message);
  };
  void tick();
  const id = window.setInterval(() => { void tick(); }, intervalMs);
  return () => { cancelled = true; window.clearInterval(id); };
}

export async function fetchOpenMeteo(lat: number, lon: number): Promise<Result<OpenMeteoCurrent, FetchError>> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=auto`;
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as { current?: { temperature_2m?: number; wind_speed_10m?: number; time?: string } };
    if (!j.current || j.current.temperature_2m === undefined) return err({ code: 'parse', message: 'missing current.temperature_2m', url });
    return ok({ temperature: j.current.temperature_2m, windSpeed: j.current.wind_speed_10m ?? 0, time: j.current.time ?? '' });
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export function startOpenMeteoPolling(
  onUpdate: (r: Result<OpenMeteoCurrent, FetchError>) => void,
  lat: number,
  lon: number,
  intervalMs = 600_000,
): () => void {
  let cancelled = false;
  const tick = async (): Promise<void> => {
    if (cancelled) return;
    const r = await fetchOpenMeteo(lat, lon);
    if (cancelled) return;
    onUpdate(r);
    if (!r.ok) log.warn('[OpenMeteo]', r.error.code, r.error.message);
  };
  void tick();
  const id = window.setInterval(() => { void tick(); }, intervalMs);
  return () => { cancelled = true; window.clearInterval(id); };
}

export async function fetchGBFS(): Promise<Result<GBFSStation[], FetchError>> {
  const infoUrl = 'https://gbfs.mobilitydata.org/system_information.json';
  const stationInfoUrl = 'https://gbfs.mobilitydata.org/station_information.json';
  const stationStatusUrl = 'https://gbfs.mobilitydata.org/station_status.json';
  try {
    const [infoR, stationR, statusR] = await Promise.all([
      fetch(infoUrl),
      fetch(stationInfoUrl),
      fetch(stationStatusUrl),
    ]);
    if (!infoR.ok || !stationR.ok || !statusR.ok) {
      return err({ code: 'http', message: `GBFS HTTP ${infoR.status}/${stationR.status}/${statusR.status}` });
    }
    const stations = (await stationR.json()) as { data: { stations: Array<Omit<GBFSStation, 'num_bikes_available'>> } };
    const status = (await statusR.json()) as { data: { stations: Array<{ station_id: string; num_bikes_available: number }> } };
    const bikesById = new Map<string, number>();
    for (const s of status.data.stations) bikesById.set(s.station_id, s.num_bikes_available);
    const merged: GBFSStation[] = stations.data.stations.map((s) => ({
      ...s,
      num_bikes_available: bikesById.get(s.station_id) ?? 0,
    }));
    return ok(merged);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message });
  }
}

export function startGBFSPolling(
  onUpdate: (r: Result<GBFSStation[], FetchError>) => void,
  intervalMs = 300_000,
): () => void {
  let cancelled = false;
  const tick = async (): Promise<void> => {
    if (cancelled) return;
    const r = await fetchGBFS();
    if (cancelled) return;
    onUpdate(r);
    if (!r.ok) log.warn('[GBFS]', r.error.code, r.error.message);
  };
  void tick();
  const id = window.setInterval(() => { void tick(); }, intervalMs);
  return () => { cancelled = true; window.clearInterval(id); };
}

export async function fetchWikipediaGeoSearch(
  lat: number,
  lon: number,
  radiusM = 10_000,
): Promise<Result<WikiGeoResult[], FetchError>> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radiusM}&gslimit=20&format=json&origin=*`;
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as { query?: { geosearch?: WikiGeoResult[] } };
    return ok(j.query?.geosearch ?? []);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export async function fetchEONETCategories(): Promise<Result<EONETCategory[], FetchError>> {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/categories';
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as { categories?: EONETCategory[] };
    return ok(j.categories ?? []);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export async function fetchNOAASolar(): Promise<Result<NOAAF107, FetchError>> {
  const url = 'https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json';
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as Array<{ 'time-tag'?: string; 'f10.7'?: number; ssn?: number }>;
    if (!Array.isArray(j) || j.length === 0) return err({ code: 'parse', message: 'empty NOAA solar response', url });
    const last = j[j.length - 1]!;
    return ok({ time_tag: last['time-tag'] ?? '', f10_7: last['f10.7'] ?? 0, ssn: last.ssn ?? 0 });
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export type OpenFlightsAirport = {
  id: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  lat: number;
  lon: number;
  alt: number;
};

const OPENFLIGHTS_CSV_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat';

export async function fetchOpenFlights(): Promise<Result<OpenFlightsAirport[], FetchError>> {
  try {
    const r = await fetch(OPENFLIGHTS_CSV_URL);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url: OPENFLIGHTS_CSV_URL });
    const csv = await r.text();
    const lines = csv.split('\n').filter((l) => l.length > 0);
    const airports: OpenFlightsAirport[] = [];
    for (const line of lines) {
      const cols = line.split(',').map((c) => c.replace(/^"|"$/g, ''));
      if (cols.length < 14) continue;
      const lat = parseFloat(cols[6] ?? '');
      const lon = parseFloat(cols[7] ?? '');
      if (Number.isNaN(lat) || Number.isNaN(lon)) continue;
      airports.push({
        id: cols[0] ?? '',
        name: cols[1] ?? '',
        city: cols[2] ?? '',
        country: cols[3] ?? '',
        iata: cols[4] ?? '',
        icao: cols[5] ?? '',
        lat,
        lon,
        alt: parseInt(cols[8] ?? '0', 10) || 0,
      });
    }
    return ok(airports);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message });
  }
}

export async function fetchGeoNames(): Promise<Result<GeoName[], FetchError>> {
  const url = '/geonames/cities.json';
  try {
    const r = await fetch(url);
    if (!r.ok) return err({ code: 'http', message: `HTTP ${r.status}`, url });
    const j = (await r.json()) as GeoName[];
    return ok(j);
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url });
  }
}

export type KRAdminFeature = {
  type: 'Feature';
  properties: { name: string; code?: string };
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] };
};

export type KRAdminFeatureCollection = {
  type: 'FeatureCollection';
  features: KRAdminFeature[];
};

export type BlackMarbleConfig = {
  url: string;
  attribution: string;
  maxzoom: number;
};

const BLACK_MARBLE_TIME = '2024-01-01';

export const BLACK_MARBLE: BlackMarbleConfig = {
  url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/${BLACK_MARBLE_TIME}/250m/{z}/{y}/{x}.jpg`,
  attribution: 'NASA EOSDIS GIBS',
  maxzoom: 8,
};

export type GebcoConfig = {
  url: string;
  attribution: string;
  maxzoom: number;
};

export const GEBCO: GebcoConfig = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Imagery © Esri / GEBCO',
  maxzoom: 13,
};

export async function fetchKRAdmin(): Promise<Result<KRAdminFeatureCollection, FetchError>> {
  const remoteUrl = 'https://www.data.go.kr/dataset/15149541/fileData.do';
  const localUrl = '/kr/admin.json';
  try {
    const r = await fetch(localUrl);
    if (r.ok) {
      const j = (await r.json()) as KRAdminFeatureCollection;
      return ok(j);
    }
    log.warn('[KR-Admin] local file missing; remote CORS will likely fail (data.go.kr CORS-uncertain)');
    const remote = await fetch(remoteUrl);
    if (!remote.ok) return err({ code: 'http', message: `KR-Admin HTTP ${remote.status} (remote)`, url: remoteUrl });
    return err({ code: 'parse', message: 'KR-Admin remote HTML not parseable; provide public/kr/admin.json', url: remoteUrl });
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url: localUrl });
  }
}

export async function fetchKRDistrict(): Promise<Result<KRAdminFeatureCollection, FetchError>> {
  const localUrl = '/kr/district.json';
  try {
    const r = await fetch(localUrl);
    if (r.ok) {
      const j = (await r.json()) as KRAdminFeatureCollection;
      return ok(j);
    }
    return err({ code: 'http', message: `KR-District HTTP ${r.status}`, url: localUrl });
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url: localUrl });
  }
}

export async function fetchKRPOI(): Promise<Result<KRAdminFeatureCollection, FetchError>> {
  const localUrl = '/kr/poi.json';
  try {
    const r = await fetch(localUrl);
    if (r.ok) {
      const j = (await r.json()) as KRAdminFeatureCollection;
      return ok(j);
    }
    return err({ code: 'http', message: `KR-POI HTTP ${r.status}`, url: localUrl });
  } catch (e) {
    return err({ code: 'cors', message: (e as Error).message, url: localUrl });
  }
}
