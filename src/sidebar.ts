import type { DataSourceId } from './data/sources';
import { SOURCES } from './data/sources';

export type SidebarEntry = {
  tier: 'tier1' | 'tier2' | 'tier3';
  slug: string;
  title: string;
};

const TIER_LABELS: Record<SidebarEntry['tier'], string> = {
  tier1: 'Tier 1 — 글로브·지형·건물',
  tier2: 'Tier 2 — 히트맵·하늘·안개',
  tier3: 'Tier 3 — 위성·모델·시계열',
};

const DATA_TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Tier 1 데이터',
  2: 'Tier 2 데이터',
  3: 'Tier 3 데이터',
};

export type DataToggleHandler = (id: DataSourceId, enabled: boolean) => void;

export function renderSidebar(
  root: HTMLElement,
  entries: SidebarEntry[],
  onDataToggle: DataToggleHandler,
): void {
  root.innerHTML = '';
  const aside = document.createElement('aside');
  aside.id = 'sidebar';
  const grouped: Record<SidebarEntry['tier'], SidebarEntry[]> = { tier1: [], tier2: [], tier3: [] };
  for (const e of entries) grouped[e.tier].push(e);
  for (const tier of ['tier1', 'tier2', 'tier3'] as const) {
    if (grouped[tier].length === 0) continue;
    const details = document.createElement('details');
    details.open = true;
    const summary = document.createElement('summary');
    summary.textContent = TIER_LABELS[tier];
    details.appendChild(summary);
    const list = document.createElement('ul');
    for (const entry of grouped[tier]) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#/${tier}/${entry.slug}`;
      a.textContent = entry.title;
      a.dataset.tier = tier;
      a.dataset.slug = entry.slug;
      li.appendChild(a);
      list.appendChild(li);
    }
    details.appendChild(list);
    aside.appendChild(details);
  }

  const dataDetails = document.createElement('details');
  dataDetails.open = true;
  const dataSummary = document.createElement('summary');
  dataSummary.textContent = '실시간 데이터';
  dataDetails.appendChild(dataSummary);
  const dataByTier: Record<1 | 2 | 3, DataSourceId[]> = { 1: [], 2: [], 3: [] };
  for (const id of Object.keys(SOURCES) as DataSourceId[]) {
    dataByTier[SOURCES[id].tier].push(id);
  }
  for (const tier of [1, 2, 3] as const) {
    if (dataByTier[tier].length === 0) continue;
    const tierHeader = document.createElement('div');
    tierHeader.textContent = DATA_TIER_LABELS[tier];
    tierHeader.style.cssText = 'margin: 8px 0 4px 0; font-weight: 600; font-size: 12px; opacity: 0.7;';
    dataDetails.appendChild(tierHeader);
    const list = document.createElement('ul');
    for (const id of dataByTier[tier]) {
      const li = document.createElement('li');
      const label = document.createElement('label');
      label.style.cssText = 'display: flex; align-items: center; gap: 6px; padding: 2px 0; cursor: pointer;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.dataSource = id;
      cb.addEventListener('change', () => onDataToggle(id, cb.checked));
      const span = document.createElement('span');
      span.textContent = SOURCES[id].title;
      label.appendChild(cb);
      label.appendChild(span);
      li.appendChild(label);
      list.appendChild(li);
    }
    dataDetails.appendChild(list);
  }
  aside.appendChild(dataDetails);

  root.appendChild(aside);
}
