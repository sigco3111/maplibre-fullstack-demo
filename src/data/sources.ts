export type DataSourceId =
  | 'iss'
  | 'usgs'
  | 'eonet'
  | 'openmeteo'
  | 'gbfs'
  | 'wikipedia'
  | 'openflights'
  | 'eonet-categories'
  | 'noaa-solar'
  | 'geonames'
  | 'kr-admin'
  | 'kr-district'
  | 'kr-poi'
  | 'black-marble'
  | 'gebco';

export type DataSource = {
  id: DataSourceId;
  title: string;
  url: string;
  pollMs: number;
  tier: 1 | 2 | 3;
  attribution: string;
};

export const SOURCES: Record<DataSourceId, DataSource> = {
  iss: {
    id: 'iss',
    title: 'ISS Position',
    url: 'https://api.wheretheiss.at/v1/satellites/25544',
    pollMs: 5_000,
    tier: 1,
    attribution: 'ISS position © wheretheiss.at (HTTPS, CORS-enabled)',
  },
  usgs: {
    id: 'usgs',
    title: 'USGS Earthquakes (past week)',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    pollMs: 300_000,
    tier: 1,
    attribution: 'USGS Earthquake Hazards Program',
  },
  eonet: {
    id: 'eonet',
    title: 'NASA EONET (open events)',
    url: 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100',
    pollMs: 600_000,
    tier: 1,
    attribution: 'NASA Earth Observatory Natural Event Tracker',
  },
  openmeteo: {
    id: 'openmeteo',
    title: 'Open-Meteo (current weather)',
    url: 'https://api.open-meteo.com/v1/forecast',
    pollMs: 600_000,
    tier: 1,
    attribution: 'Open-Meteo (free weather API)',
  },
  gbfs: {
    id: 'gbfs',
    title: 'GBFS (bikeshare)',
    url: 'https://gbfs.mobilitydata.org/',
    pollMs: 300_000,
    tier: 1,
    attribution: 'GBFS / MobilityData',
  },
  wikipedia: {
    id: 'wikipedia',
    title: 'Wikipedia GeoSearch',
    url: 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&origin=*',
    pollMs: 0,
    tier: 2,
    attribution: 'Wikipedia API',
  },
  openflights: {
    id: 'openflights',
    title: 'OpenFlights airports',
    url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat',
    pollMs: 0,
    tier: 2,
    attribution: 'OpenFlights (jpatokal)',
  },
  'eonet-categories': {
    id: 'eonet-categories',
    title: 'NASA EONET categories',
    url: 'https://eonet.gsfc.nasa.gov/api/v3/categories',
    pollMs: 3_600_000,
    tier: 2,
    attribution: 'NASA EONET',
  },
  'noaa-solar': {
    id: 'noaa-solar',
    title: 'NOAA SWPC solar summary',
    url: 'https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json',
    pollMs: 1_800_000,
    tier: 2,
    attribution: 'NOAA Space Weather Prediction Center',
  },
  geonames: {
    id: 'geonames',
    title: 'GeoNames cities500',
    url: 'https://download.geonames.org/export/dump/cities500.zip',
    pollMs: 0,
    tier: 2,
    attribution: 'GeoNames (CC-BY 4.0)',
  },
  'kr-admin': {
    id: 'kr-admin',
    title: '한국 행정구역 (시도)',
    url: 'https://www.data.go.kr/dataset/15149541/fileData.do',
    pollMs: 0,
    tier: 3,
    attribution: 'data.go.kr (public, CORS-uncertain)',
  },
  'kr-district': {
    id: 'kr-district',
    title: '시도 시군구 경계',
    url: 'https://www.data.go.kr/dataset/15149542/fileData.do',
    pollMs: 0,
    tier: 3,
    attribution: 'data.go.kr (public, CORS-uncertain)',
  },
  'kr-poi': {
    id: 'kr-poi',
    title: '전국 POI',
    url: 'https://www.data.go.kr/dataset/15021190/fileData.do',
    pollMs: 0,
    tier: 3,
    attribution: 'data.go.kr public POI (CORS-uncertain)',
  },
  'black-marble': {
    id: 'black-marble',
    title: 'NASA Black Marble (night lights)',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2024-01-01/250m/{z}/{y}/{x}.jpg',
    pollMs: 0,
    tier: 3,
    attribution: 'NASA EOSDIS GIBS',
  },
  gebco: {
    id: 'gebco',
    title: 'GEBCO seabed',
    url: 'https://www.gebco.net/data_and_products/gridded_bathymetry_data/',
    pollMs: 0,
    tier: 3,
    attribution: 'GEBCO Compilation Group',
  },
};
