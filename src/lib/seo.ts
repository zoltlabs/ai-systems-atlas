import { SITE } from '../site';
import { COLLECTIONS, PLATE_LOOKUP, COL_ORDER } from '../data/collections.js';

export type Plate = {
  slug: string; code: string; title: string; def: string; insight: string; failure: string;
  dg?: string; custom?: string; kw?: string;
  modes?: { id: string; label: string; cls?: string; dg: string }[];
  related?: [string, string][];
};
export type Collection = {
  title: string; short: string; prefix: string; intro: string; plates: Plate[];
  defenses?: [string, string][];
};

export const collections = COLLECTIONS as unknown as Record<string, Collection>;
export const colOrder = COL_ORDER as readonly string[];
export const plateLookup = PLATE_LOOKUP as Record<string, Plate>;

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '');

/** Meta description: the plate's one-line definition, extended with the insight when short, capped at ~160 chars. */
export function plateDescription(p: Plate): string {
  let d = stripTags(p.def).trim();
  if (d.length < 90) {
    const first = stripTags(p.insight).split(/(?<=[.!?])\s/)[0];
    d = `${d} ${first}`.trim();
  }
  if (d.length > 160) d = d.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return d;
}

export function collectionDescription(c: Collection): string {
  const d = stripTags(c.intro);
  return d.length > 160 ? d.slice(0, 157).replace(/\s+\S*$/, '') + '…' : d;
}

export function plateUrl(colId: string, slug: string) { return `/${colId}/${slug}`; }
export function ogImage(path: string) { return `/og${path === '/' ? '/home' : path}.png`; }
export function absolute(path: string) { return new URL(path, SITE.url).toString(); }

export function prevNext(colId: string, slug: string) {
  const plates = collections[colId].plates;
  const i = plates.findIndex(p => p.slug === slug);
  return { prev: i > 0 ? plates[i - 1] : null, next: i < plates.length - 1 ? plates[i + 1] : null, index: i, total: plates.length };
}

export function plateJsonLd(colId: string, p: Plate) {
  const col = collections[colId];
  const url = absolute(plateUrl(colId, p.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${p.title} (${p.code})`,
    alternativeHeadline: stripTags(p.def),
    description: plateDescription(p),
    url,
    mainEntityOfPage: url,
    image: absolute(ogImage(plateUrl(colId, p.slug))),
    articleSection: col.title,
    keywords: (p.kw || '').split(/\s+/).filter(Boolean).join(', '),
    isPartOf: { '@type': 'CollectionPage', name: col.title, url: absolute(`/${colId}`) },
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    proficiencyLevel: 'Expert',
    inLanguage: 'en',
  };
}

export function collectionJsonLd(colId: string) {
  const col = collections[colId];
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: col.title,
    description: collectionDescription(col),
    url: absolute(`/${colId}`),
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: col.plates.map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: `${p.code} ${p.title}`, url: absolute(plateUrl(colId, p.slug)),
      })),
    },
  };
}

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: SITE.tagline,
    description: SITE.description,
    url: SITE.url,
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}
