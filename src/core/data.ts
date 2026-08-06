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
