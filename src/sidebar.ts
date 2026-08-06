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

export function renderSidebar(root: HTMLElement, entries: SidebarEntry[]): void {
  root.innerHTML = '';
  const aside = document.createElement('aside');
  aside.id = 'sidebar';
  const grouped: Record<SidebarEntry['tier'], SidebarEntry[]> = { tier1: [], tier2: [], tier3: [] };
  for (const e of entries) grouped[e.tier].push(e);
  for (const tier of ['tier1', 'tier2', 'tier3'] as const) {
    if (grouped[tier].length === 0) continue;
    const details = document.createElement('details');
    details.open = tier === 'tier1';
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
  root.appendChild(aside);
}
