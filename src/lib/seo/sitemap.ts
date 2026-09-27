/**
 * Sitemaps (docs/02-arquitectura-seo.md §6): `/sitemap-index.xml` → un sitemap per
 * secció i idioma (`sitemap-ca-pagines.xml`, `sitemap-es-paginas.xml`…).
 *
 * - Només URL indexables, amb estat 200 i canonical propi (mai `/app`).
 * - `lastmod` només si hi ha la data real de revisió del contingut (mai la del build).
 * - Fases 2–3: afegir seccions `cims`/`cimas` i `comarques`/`comarcas` a `SITEMAP_SECTIONS`
 *   a partir del catàleg (només fitxes `revisat` i indexables en aquell idioma).
 *
 * El fa servir `vite.config.ts` (entrades de prerender), per això no depèn de `$lib` ni del runtime.
 */
import {
	LOCALES,
	PRERENDER_PATHS,
	SITE_ORIGIN,
	localizePath,
	type AppLocale
} from '../i18n/routes.ts';

export type SitemapUrl = { loc: string; lastmod?: string };

type SitemapSection = {
	/** Nom del fitxer per idioma: `sitemap-{locale}-{name}.xml`. */
	name: Record<AppLocale, string>;
	urls: (locale: AppLocale) => SitemapUrl[];
};

export const SITEMAP_SECTIONS: readonly SitemapSection[] = [
	{
		name: { ca: 'pagines', es: 'paginas' },
		urls: (locale) => PRERENDER_PATHS.map((p) => ({ loc: SITE_ORIGIN + localizePath(p, locale) }))
	}
];

export const SITEMAP_INDEX_PATH = '/sitemap-index.xml';

type SitemapFile = { name: string; locale: AppLocale; section: SitemapSection };

/** Tots els sitemaps de secció (`ca-pagines`, `es-paginas`…), sense els buits. */
export function sitemapFiles(): SitemapFile[] {
	return SITEMAP_SECTIONS.flatMap((section) =>
		LOCALES.map((locale) => ({ name: `${locale}-${section.name[locale]}`, locale, section }))
	).filter((file) => file.section.urls(file.locale).length > 0);
}

/** Camins a prerenderitzar: l'índex i cada sitemap de secció. */
export function sitemapEntries(): `/${string}`[] {
	return [SITEMAP_INDEX_PATH, ...sitemapFiles().map((f) => `/sitemap-${f.name}.xml` as const)];
}

const escapeXml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n';
const NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

export function sitemapIndexXml(): string {
	const items = sitemapFiles()
		.map(
			(f) => `\t<sitemap><loc>${escapeXml(`${SITE_ORIGIN}/sitemap-${f.name}.xml`)}</loc></sitemap>`
		)
		.join('\n');
	return `${XML_HEAD}<sitemapindex xmlns="${NS}">\n${items}\n</sitemapindex>\n`;
}

/** XML d'un sitemap de secció, o `undefined` si el nom no existeix. */
export function sitemapXml(name: string): string | undefined {
	const file = sitemapFiles().find((f) => f.name === name);
	if (!file) return undefined;
	const items = file.section
		.urls(file.locale)
		.map(({ loc, lastmod }) => {
			const mod = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '';
			return `\t<url><loc>${escapeXml(loc)}</loc>${mod}</url>`;
		})
		.join('\n');
	return `${XML_HEAD}<urlset xmlns="${NS}">\n${items}\n</urlset>\n`;
}
