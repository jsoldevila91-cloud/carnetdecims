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

export const LOCALES = ['ca', 'es'] as const;
export type AppLocale = (typeof LOCALES)[number];

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

	// Zona app (noindex): /app es manté igual en tots dos idiomes
	{ path: '/app/compte', localized: { ca: '/app/compte', es: '/app/cuenta' } },
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
		// La resta de camins (mapa, metodologia, app/registrar…) només afegeixen el prefix.
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

/** Pàgines públiques sense paràmetres que es prerenderitzen en tots dos idiomes. */
export const PRERENDER_PATHS = ['/', '/cims', '/mapa'] as const;

export function prerenderEntries(): `/${string}`[] {
	return PRERENDER_PATHS.flatMap((p) => LOCALES.map((l) => localizePath(p, l) as `/${string}`));
}
