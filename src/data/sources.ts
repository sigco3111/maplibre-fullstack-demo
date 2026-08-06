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
  ko: string;
  desc: string;
};

export const SOURCES: Record<DataSourceId, DataSource> = {
  iss: {
    id: 'iss',
    title: 'ISS Position',
    url: 'https://api.wheretheiss.at/v1/satellites/25544',
    pollMs: 5_000,
    tier: 1,
    attribution: 'ISS position © wheretheiss.at (HTTPS, CORS-enabled)',
    ko: 'ISS 위치',
    desc: '국제우주정거장 좌표를 5초마다 받아옵니다',
  },
  usgs: {
    id: 'usgs',
    title: 'USGS Earthquakes (past week)',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    pollMs: 300_000,
    tier: 1,
    attribution: 'USGS Earthquake Hazards Program',
    ko: 'USGS 지진',
    desc: '지난 주 전세계 지진을 원으로 표시합니다 (5분 갱신)',
  },
  eonet: {
    id: 'eonet',
    title: 'NASA EONET (open events)',
    url: 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=100',
    pollMs: 600_000,
    tier: 1,
    attribution: 'NASA Earth Observatory Natural Event Tracker',
    ko: 'NASA 자연재해',
    desc: 'NASA EONET의 진행 중 산불·폭풍·화산 이벤트를 마커로 표시합니다 (10분 갱신)',
  },
  openmeteo: {
    id: 'openmeteo',
    title: 'Open-Meteo (current weather)',
    url: 'https://api.open-meteo.com/v1/forecast',
    pollMs: 600_000,
    tier: 1,
    attribution: 'Open-Meteo (free weather API)',
    ko: 'Open-Meteo',
    desc: '지도 중심점의 현재 기온·풍속을 텍스트로 표시합니다 (10분 갱신)',
  },
  gbfs: {
    id: 'gbfs',
    title: 'GBFS (bikeshare)',
    url: 'https://gbfs.mobilitydata.org/',
    pollMs: 300_000,
    tier: 1,
    attribution: 'GBFS / MobilityData',
    ko: 'GBFS 자전거',
    desc: '전세계 공개 자전거 공유 시스템의 스테이션과 잔여 자전거 수 (5분 갱신)',
  },
  wikipedia: {
    id: 'wikipedia',
    title: 'Wikipedia GeoSearch',
    url: 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&origin=*',
    pollMs: 0,
    tier: 2,
    attribution: 'Wikipedia API',
    ko: 'Wikipedia 지오검색',
    desc: '지도 중심 반경 10km의 위키피디아 항목을 마커로 표시합니다 (1회)',
  },
  openflights: {
    id: 'openflights',
    title: 'OpenFlights airports',
    url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat',
    pollMs: 0,
    tier: 2,
    attribution: 'OpenFlights (jpatokal)',
    ko: 'OpenFlights 공항',
    desc: '전세계 공항 목록(약 8000개)을 작은 원으로 표시합니다 (1회)',
  },
  'eonet-categories': {
    id: 'eonet-categories',
    title: 'NASA EONET categories',
    url: 'https://eonet.gsfc.nasa.gov/api/v3/categories',
    pollMs: 3_600_000,
    tier: 2,
    attribution: 'NASA EONET',
    ko: 'EONET 카테고리',
    desc: '자연재해 카테고리(폭풍·화산 등) 필터 (60분 갱신)',
  },
  'noaa-solar': {
    id: 'noaa-solar',
    title: 'NOAA SWPC solar summary',
    url: 'https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json',
    pollMs: 1_800_000,
    tier: 2,
    attribution: 'NOAA Space Weather Prediction Center',
    ko: 'NOAA 태양',
    desc: '태양 흑점 수와 F10.7 전파 flux 수치를 헤더에 표시합니다 (30분 갱신)',
  },
  geonames: {
    id: 'geonames',
    title: 'GeoNames cities500',
    url: 'https://download.geonames.org/export/dump/cities500.zip',
    pollMs: 0,
    tier: 2,
    attribution: 'GeoNames (CC-BY 4.0)',
    ko: 'GeoNames 도시',
    desc: '전세계 인구 500명 이상 도시 약 200000개를 인구에 비례해 원으로 표시합니다 (1회)',
  },
  'kr-admin': {
    id: 'kr-admin',
    title: '한국 행정구역 (시도)',
    url: 'https://www.data.go.kr/dataset/15149541/fileData.do',
    pollMs: 0,
    tier: 3,
    attribution: 'data.go.kr (public, CORS-uncertain)',
    ko: '한국 시도',
    desc: '대한민국 17개 시·도를 면적·인구 색상 choropleth로 칠합니다 (1회)',
  },
  'kr-district': {
    id: 'kr-district',
    title: '시도 시군구 경계',
    url: 'https://www.data.go.kr/dataset/15149542/fileData.do',
    pollMs: 0,
    tier: 3,
    attribution: 'data.go.kr (public, CORS-uncertain)',
    ko: '한국 시군구',
    desc: '시·도 안의 시·군·구 경계와 이름 라벨 (1회)',
  },
  'kr-poi': {
    id: 'kr-poi',
    title: '전국 POI',
    url: 'https://www.data.go.kr/dataset/15021190/fileData.do',
    pollMs: 0,
    tier: 3,
    attribution: 'data.go.kr public POI (CORS-uncertain)',
    ko: '한국 POI',
    desc: '대한민국 주요 관광지·음식점·시설 등 포인트 (1회)',
  },
  'black-marble': {
    id: 'black-marble',
    title: 'NASA Black Marble (night lights)',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2024-01-01/250m/{z}/{y}/{x}.jpg',
    pollMs: 0,
    tier: 3,
    attribution: 'NASA EOSDIS GIBS',
    ko: 'NASA 야간 조명',
    desc: 'NASA Black Marble 야간 지구 사진 오버레이 (정적)',
  },
  gebco: {
    id: 'gebco',
    title: 'GEBCO seabed',
    url: 'https://www.gebco.net/data_and_products/gridded_bathymetry_data/',
    pollMs: 0,
    tier: 3,
    attribution: 'GEBCO Compilation Group',
    ko: 'GEBCO 해저',
    desc: 'GEBCO 해저 지형 오버레이 (정적)',
  },
};
