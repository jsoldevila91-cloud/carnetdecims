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
 * - Comarques (`sitemap-ca-comarques.xml`, `sitemap-es-comarcas.xml`): l'índex `/comarques` i les
 *   pàgines de comarca indexables (`comarcaIndexable`: almenys 3 cims; docs/02 §4.2).
 * - Llistats curats (`sitemap-ca-llistats.xml`, `sitemap-es-listados.xml`): `LLISTAT_PATHS`.
 * - Contingut editorial (`sitemap-ca-contingut.xml`, `sitemap-es-contenido.xml`): les pàgines de
 *   `PAGINES_CONTINGUT` indexables en tots dos idiomes, amb `lastmod` = `actualitzat` de cada
 *   idioma (data real de revisió del text). Les legals (`CONTINGUT_FORA_SITEMAP`) en queden fora.
 * - Pàgines: la resta de `PRERENDER_PATHS` (sense l'índex de comarques, els llistats ni el contingut).
 *
 * El fa servir `vite.config.ts` (entrades de prerender), per això no depèn de `$lib` ni del runtime.
 */
import cimsJson from '../data/catalog/cims.json' with { type: 'json' };
import {
	CONTINGUTS,
	PAGINES_CONTINGUT,
	type ClauPagina,
	type Contingut
} from '../content/index.ts';
import {
	COMARQUES_PATH,
	CONTINGUT_PATHS,
	LLISTAT_PATHS,
	LOCALES,
	PRERENDER_PATHS,
	SITE_ORIGIN,
	localizeCimPath,
	localizeComarcaPath,
	localizePath,
	slugsComarquesAmbCims,
	type AppLocale
} from '../i18n/routes.ts';
import { PAGINES_NOINDEX, comarcaIndexable } from './indexabilitat.ts';

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

/** Camins de `PRERENDER_PATHS` que tenen secció pròpia (o cap) i no van a `pagines`. */
const AMB_SECCIO_PROPIA: ReadonlySet<string> = new Set([
	COMARQUES_PATH,
	...LLISTAT_PATHS,
	...CONTINGUT_PATHS
]);

/**
 * Pàgines de contingut indexables que NO entren al sitemap: l'avís legal i la privadesa.
 * Són indexables (senyal de confiança, enllaçades des del peu de totes les pàgines), però no
 * responen cap cerca que ens interessi i el protocol de sitemaps no permet marcar-les com a
 * poc prioritàries de manera útil (Google ignora `priority`). Decisió del bloc 3c (docs/02 §6).
 */
export const CONTINGUT_FORA_SITEMAP: readonly ClauPagina[] = ['avisLegal', 'privacitat'];

/**
 * URL de les pàgines de contingut en un idioma: indexables en ca i es (hreflang només entre
 * versions indexables, docs/02 §6), sense les legals, amb `lastmod` = `actualitzat` si és una
 * data ISO vàlida.
 */
export function contingutSitemapUrls(
	locale: AppLocale,
	continguts: Readonly<Record<ClauPagina, Contingut>> = CONTINGUTS
): SitemapUrl[] {
	return (Object.keys(PAGINES_CONTINGUT) as ClauPagina[])
		.filter((clau) => !CONTINGUT_FORA_SITEMAP.includes(clau))
		.filter((clau) => LOCALES.every((l) => !continguts[clau][l].noindex))
		.map((clau) => {
			const actualitzat = continguts[clau][locale].actualitzat;
			return urlAmbAlternates(
				(l) => localizePath(PAGINES_CONTINGUT[clau], l),
				locale,
				DATA_ISO.test(actualitzat) ? actualitzat : undefined
			);
		});
}

/** Nombre de cims del catàleg per comarca (slug). */
function cimsPerComarca(): Map<string, number> {
	const n = new Map<string, number>();
	for (const c of cimsJson as ReadonlyArray<{ comarca: string }>) {
		n.set(c.comarca, (n.get(c.comarca) ?? 0) + 1);
	}
	return n;
}

/**
 * Índex de comarques + pàgines de comarca indexables, en un idioma: les que tenen almenys
 * `MIN_CIMS_COMARCA_INDEXABLE` cims (`comarcaIndexable`, el mateix criteri que el `noindex`
 * de la pàgina). Les altres es prerenderitzen igualment, però amb `noindex`.
 */
export function comarcaSitemapUrls(locale: AppLocale): SitemapUrl[] {
	const n = cimsPerComarca();
	return [
		urlAmbAlternates((l) => localizePath(COMARQUES_PATH, l), locale),
		...slugsComarquesAmbCims()
			.filter((slug) => comarcaIndexable(n.get(slug) ?? 0))
			.map((slug) => urlAmbAlternates((l) => localizeComarcaPath(slug, l), locale))
	];
}

export const SITEMAP_SECTIONS: readonly SitemapSection[] = [
	{
		name: { ca: 'pagines', es: 'paginas' },
		urls: (locale) =>
			PRERENDER_PATHS.filter((p) => !AMB_SECCIO_PROPIA.has(p) && !PAGINES_NOINDEX.has(p)).map((p) =>
				urlAmbAlternates((l) => localizePath(p, l), locale)
			)
	},
	{
		name: { ca: 'comarques', es: 'comarcas' },
		urls: comarcaSitemapUrls
	},
	{
		name: { ca: 'llistats', es: 'listados' },
		urls: (locale) => LLISTAT_PATHS.map((p) => urlAmbAlternates((l) => localizePath(p, l), locale))
	},
	{
		name: { ca: 'contingut', es: 'contenido' },
		urls: (locale) => contingutSitemapUrls(locale)
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
