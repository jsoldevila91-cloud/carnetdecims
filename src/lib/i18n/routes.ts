/**
 * Taula de rutes localitzades (font única) → `urlPatterns` de Paraglide 2.
 *
 * - Els fitxers de `src/routes` fan servir el camí "intern" (deslocalitzat), que
 *   coincideix amb el català sense prefix: `/cims/[slug]`, `/comarques`, `/app/compte`…
 * - Tots dos idiomes porten prefix: `/ca/...` i `/es/...` (vegeu docs/02-arquitectura-seo.md §3).
 * - Els slugs de cim i comarca són iguals en ca i es; només es tradueix el segment de secció.
 *
 * Aquest fitxer l'importa `vite.config.ts`, per això no pot dependre de `$lib` ni del runtime.
 */
// Imports relatius (sense `$lib`): només per als slugs de `cimEntries()` i `comarcaEntries()`.
import cimsJson from '../data/catalog/cims.json' with { type: 'json' };
import comarquesJson from '../data/catalog/comarques.json' with { type: 'json' };
// Només la taula de camins de les pàgines de contingut (`types.ts` només hi té imports de tipus).
import { PAGINES_CONTINGUT } from '../content/types.ts';

export const LOCALES = ['ca', 'es'] as const;
export type AppLocale = (typeof LOCALES)[number];

/** Origen canònic del web (sense barra final). Canonical, hreflang, sitemap i JSON-LD. */
export const SITE_ORIGIN = 'https://carnetdecims.cat';

type Localized = Record<AppLocale, string>;

/**
 * Segments traduïts. L'ordre importa: els patrons més específics primer
 * (Paraglide aplica el primer que coincideix).
 */
export const LOCALIZED_ROUTES: ReadonlyArray<{ path: string; localized: Localized }> = [
	// Hub del repte
	{
		path: '/repte-100-cims/normativa',
		localized: { ca: '/repte-100-cims/normativa', es: '/reto-100-cims/normativa' }
	},
	{
		path: '/repte-100-cims/com-validar',
		localized: { ca: '/repte-100-cims/com-validar', es: '/reto-100-cims/como-validar' }
	},
	{
		path: '/repte-100-cims/repte-infantil',
		localized: { ca: '/repte-100-cims/repte-infantil', es: '/reto-100-cims/reto-infantil' }
	},
	{ path: '/repte-100-cims', localized: { ca: '/repte-100-cims', es: '/reto-100-cims' } },

	// Catàleg
	{ path: '/cims/:slug', localized: { ca: '/cims/:slug', es: '/cimas/:slug' } },
	{ path: '/cims', localized: { ca: '/cims', es: '/cimas' } },
	{ path: '/cims-essencials', localized: { ca: '/cims-essencials', es: '/cimas-esenciales' } },
	{ path: '/cims-facils', localized: { ca: '/cims-facils', es: '/cimas-faciles' } },
	{ path: '/cims-amb-nens', localized: { ca: '/cims-amb-nens', es: '/cimas-con-ninos' } },
	{ path: '/cims-mes-alts', localized: { ca: '/cims-mes-alts', es: '/cimas-mas-altas' } },
	{ path: '/tresmils', localized: { ca: '/tresmils', es: '/tresmiles' } },
	{ path: '/comarques/:slug', localized: { ca: '/comarques/:slug', es: '/comarcas/:slug' } },
	{ path: '/comarques', localized: { ca: '/comarques', es: '/comarcas' } },
	{ path: '/guies/:slug', localized: { ca: '/guies/:slug', es: '/guias/:slug' } },

	// Pàgines estàtiques
	{
		path: '/sobre-el-projecte',
		localized: { ca: '/sobre-el-projecte', es: '/sobre-el-proyecto' }
	},
	{ path: '/avis-legal', localized: { ca: '/avis-legal', es: '/aviso-legal' } },
	{ path: '/privacitat', localized: { ca: '/privacitat', es: '/privacidad' } },
	{ path: '/metodologia', localized: { ca: '/metodologia', es: '/metodologia' } },

	// Zona app (noindex): /app es manté igual en tots dos idiomes
	{ path: '/app/compte', localized: { ca: '/app/compte', es: '/app/cuenta' } },
	{ path: '/app/essencials', localized: { ca: '/app/essencials', es: '/app/esenciales' } },
	{ path: '/app/comarques', localized: { ca: '/app/comarques', es: '/app/comarcas' } },
	{ path: '/app/a-prop', localized: { ca: '/app/a-prop', es: '/app/cerca' } },
	{ path: '/app/progres', localized: { ca: '/app/progres', es: '/app/progreso' } }
];

type UrlPattern = { pattern: string; localized: Array<[AppLocale, string]> };

/** `urlPatterns` per a `paraglideVitePlugin` (estratègia `url`). */
export function buildUrlPatterns(): UrlPattern[] {
	return [
		// L'arrel ha d'anar abans del comodí (genera `/ca` i no `/ca/`).
		{ pattern: '/', localized: LOCALES.map((l) => [l, `/${l}`]) },
		...LOCALIZED_ROUTES.map(({ path, localized }) => ({
			pattern: path,
			localized: LOCALES.map((l): [AppLocale, string] => [l, `/${l}${localized[l]}`])
		})),
		// La resta de camins (mapa, app/registrar…) només afegeixen el prefix.
		{
			pattern: '/:path(.*)?',
			localized: LOCALES.map((l): [AppLocale, string] => [l, `/${l}/:path(.*)?`])
		}
	];
}

/**
 * Camí localitzat sense runtime (per a `prerender.entries` al build).
 * Només suporta camins sense paràmetres.
 */
export function localizePath(path: string, locale: AppLocale): string {
	if (path === '/') return `/${locale}`;
	const route = LOCALIZED_ROUTES.find((r) => r.path === path);
	return `/${locale}${route ? route.localized[locale] : path}`;
}

/** Llistats curats (vegeu `LLISTATS` a `$lib/data/catalog/queries.ts`). Sitemap: secció `llistats`. */
export const LLISTAT_PATHS = ['/cims-essencials', '/tresmils', '/cims-mes-alts'] as const;

/** Índex de comarques. Sitemap: secció `comarques`, amb les pàgines de comarca. */
export const COMARQUES_PATH = '/comarques';

/**
 * Pàgines de contingut editorial (hub del repte, metodologia, legals…): `PAGINES_CONTINGUT` de
 * `$lib/content/types.ts`. Sitemap: secció `contingut`, amb `lastmod` = `actualitzat`
 * (les legals en queden fora; vegeu `$lib/seo/sitemap.ts`).
 */
export const CONTINGUT_PATHS = Object.values(PAGINES_CONTINGUT);

/**
 * Pàgines públiques sense paràmetres que es prerenderitzen en tots dos idiomes.
 * Totes són indexables; el sitemap (`$lib/seo/sitemap.ts`) decideix en quina secció van i
 * quines en queden fora (les de `noindex` i les legals).
 */
export const PRERENDER_PATHS = [
	'/',
	'/cims',
	'/mapa',
	COMARQUES_PATH,
	...LLISTAT_PATHS,
	...CONTINGUT_PATHS
] as const;

export function prerenderEntries(): `/${string}`[] {
	return PRERENDER_PATHS.flatMap((p) => LOCALES.map((l) => localizePath(p, l) as `/${string}`));
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Camí localitzat d'una fitxa de cim: `/ca/cims/{slug}` o `/es/cimas/{slug}`
 * (a partir del patró `/cims/:slug` de `LOCALIZED_ROUTES`).
 * @throws RangeError si el slug no té un format vàlid.
 */
export function localizeCimPath(slug: string, locale: AppLocale): `/${string}` {
	if (!SLUG_RE.test(slug)) throw new RangeError(`Slug invàlid: ${slug}`);
	const route = LOCALIZED_ROUTES.find((r) => r.path === '/cims/:slug')!;
	return `/${locale}${route.localized[locale].replace(':slug', slug)}`;
}

/**
 * Camí localitzat d'una pàgina de comarca: `/ca/comarques/{slug}` o `/es/comarcas/{slug}`
 * (a partir del patró `/comarques/:slug` de `LOCALIZED_ROUTES`).
 * @throws RangeError si el slug no té un format vàlid.
 */
export function localizeComarcaPath(slug: string, locale: AppLocale): `/${string}` {
	if (!SLUG_RE.test(slug)) throw new RangeError(`Slug invàlid: ${slug}`);
	const route = LOCALIZED_ROUTES.find((r) => r.path === '/comarques/:slug')!;
	return `/${locale}${route.localized[locale].replace(':slug', slug)}`;
}

/**
 * Slugs de les comarques amb almenys un cim, en l'ordre de `comarques.json`
 * (el mateix criteri que `comarquesAmbCims()`; aquí sense `$lib`).
 */
export function slugsComarquesAmbCims(): string[] {
	const ambCims = new Set((cimsJson as ReadonlyArray<{ comarca: string }>).map((c) => c.comarca));
	return (comarquesJson as ReadonlyArray<{ slug: string }>)
		.map((c) => c.slug)
		.filter((slug) => ambCims.has(slug));
}

/** Les URL localitzades de les pàgines de comarca amb cims (ca i es), per a `prerender.entries`. */
export function comarcaEntries(): `/${string}`[] {
	return slugsComarquesAmbCims().flatMap((slug) =>
		LOCALES.map((l) => localizeComarcaPath(slug, l))
	);
}

/** Les URL localitzades de totes les fitxes de cim (ca i es), per a `prerender.entries`. */
export function cimEntries(): `/${string}`[] {
	return (cimsJson as ReadonlyArray<{ slug: string }>).flatMap(({ slug }) =>
		LOCALES.map((l) => localizeCimPath(slug, l))
	);
}
