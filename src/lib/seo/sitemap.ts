/**
 * Sitemaps (docs/02-arquitectura-seo.md §6): `/sitemap-index.xml` → un sitemap per
 * secció i idioma (`sitemap-ca-pagines.xml`, `sitemap-es-paginas.xml`, `sitemap-ca-cims.xml`…).
 *
 * - Només URL indexables, amb estat 200 i canonical propi (mai `/app`).
 * - Cada URL porta les alternates `hreflang` (ca, es i x-default → ca), recíproques.
 * - `lastmod` només si hi ha la data real de revisió del contingut (mai la del build).
 * - Fitxes de cim: només les `revisat` (la fitxa aplica el mateix criteri per al `noindex`).
 *   Els sitemaps buits no es publiquen: mentre no n'hi hagi cap de revisada no hi ha
 *   `sitemap-ca-cims.xml`.
 * - Pendent (bloc 3b): secció `comarques`/`comarcas`.
 *
 * El fa servir `vite.config.ts` (entrades de prerender), per això no depèn de `$lib` ni del runtime.
 */
import cimsJson from '../data/catalog/cims.json' with { type: 'json' };
import {
	LOCALES,
	PRERENDER_PATHS,
	SITE_ORIGIN,
	localizeCimPath,
	localizePath,
	type AppLocale
} from '../i18n/routes.ts';

export type SitemapAlternate = { hreflang: AppLocale | 'x-default'; href: string };
export type SitemapUrl = { loc: string; lastmod?: string; alternates?: SitemapAlternate[] };

type SitemapSection = {
	/** Nom del fitxer per idioma: `sitemap-{locale}-{name}.xml`. */
	name: Record<AppLocale, string>;
	urls: (locale: AppLocale) => SitemapUrl[];
};

/** Idioma de `x-default` (el mateix que a `PageMeta`). */
const X_DEFAULT: AppLocale = 'ca';

/** `loc` + alternates de totes les versions d'una pàgina indexable en tots dos idiomes. */
function urlAmbAlternates(
	cami: (locale: AppLocale) => string,
	locale: AppLocale,
	lastmod?: string
): SitemapUrl {
	const abs = (l: AppLocale) => SITE_ORIGIN + cami(l);
	return {
		loc: abs(locale),
		...(lastmod && { lastmod }),
		alternates: [
			...LOCALES.map((l) => ({ hreflang: l, href: abs(l) })),
			{ hreflang: 'x-default', href: abs(X_DEFAULT) }
		]
	};
}

/** Camps del catàleg que necessita el sitemap (`cims.json`). */
export type CimSitemap = {
	slug: string;
	estat_revisio: string;
	/** Data real de l'última revisió (AAAA-MM-DD). Pendent d'afegir al catàleg. */
	data_revisio?: string | null;
};

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** URL de les fitxes de cim indexables (`revisat`) en un idioma. */
export function cimSitemapUrls(cims: readonly CimSitemap[], locale: AppLocale): SitemapUrl[] {
	return cims
		.filter((c) => c.estat_revisio === 'revisat')
		.map((c) =>
			urlAmbAlternates(
				(l) => localizeCimPath(c.slug, l),
				locale,
				c.data_revisio && DATA_ISO.test(c.data_revisio) ? c.data_revisio : undefined
			)
		);
}

export const SITEMAP_SECTIONS: readonly SitemapSection[] = [
	{
		name: { ca: 'pagines', es: 'paginas' },
		urls: (locale) =>
			PRERENDER_PATHS.map((p) => urlAmbAlternates((l) => localizePath(p, l), locale))
	},
	{
		name: { ca: 'cims', es: 'cimas' },
		urls: (locale) => cimSitemapUrls(cimsJson as readonly CimSitemap[], locale)
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
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

export function sitemapIndexXml(): string {
	const items = sitemapFiles()
		.map(
			(f) => `\t<sitemap><loc>${escapeXml(`${SITE_ORIGIN}/sitemap-${f.name}.xml`)}</loc></sitemap>`
		)
		.join('\n');
	return `${XML_HEAD}<sitemapindex xmlns="${NS}">\n${items}\n</sitemapindex>\n`;
}

/** `<urlset>` amb `lastmod` i alternates `xhtml:link` (hreflang). */
export function urlsetXml(urls: readonly SitemapUrl[]): string {
	const items = urls
		.map(({ loc, lastmod, alternates = [] }) => {
			const mod = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '';
			const alts = alternates
				.map(
					(a) =>
						`<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(a.href)}"/>`
				)
				.join('');
			return `\t<url><loc>${escapeXml(loc)}</loc>${mod}${alts}</url>`;
		})
		.join('\n');
	return `${XML_HEAD}<urlset xmlns="${NS}" xmlns:xhtml="${NS_XHTML}">\n${items}\n</urlset>\n`;
}

/** XML d'un sitemap de secció, o `undefined` si el nom no existeix. */
export function sitemapXml(name: string): string | undefined {
	const file = sitemapFiles().find((f) => f.name === name);
	return file ? urlsetXml(file.section.urls(file.locale)) : undefined;
}
