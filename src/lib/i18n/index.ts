import { resolve } from '$app/paths';
import type { Pathname } from '$app/types';
import {
	deLocalizeHref,
	getLocale,
	localizeHref,
	locales,
	type Locale
} from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages';

export { getLocale, locales, type Locale };
export { SITE_ORIGIN } from './routes';

/**
 * Camins de pàgina. S'exclouen els sitemaps, els manifests i l'API: SvelteKit genera el
 * `Pathname` de `/sitemap-[name].xml` (i `/manifest-[lang].webmanifest`, `/api/meteo/[slug]`) com
 * a literal igual al `RouteId` (amb paràmetres) i trenca `resolve()`.
 */
type PagePathname = Exclude<
	Pathname,
	`/sitemap-${string}` | `/manifest-${string}` | `/api/${string}`
>;

/**
 * Enllaç intern localitzat a partir del camí intern (el de `src/routes`).
 * `href('/cims')` → `/ca/cims` o `/es/cimas`, amb `base` aplicat via `resolve()`.
 */
export function href(path: string, locale?: Locale): string {
	return resolve(localizeHref(path, locale ? { locale } : undefined) as PagePathname);
}

/** Camí intern (deslocalitzat) a partir de l'URL actual: `/es/cimas` → `/cims`. */
export function internalPath(pathname: string): string {
	return deLocalizeHref(pathname);
}

/** Nom de l'idioma en la seva pròpia llengua (per al selector). */
export function endonym(locale: Locale): string {
	return locale === 'es' ? m.lang_endonym_es() : m.lang_endonym_ca();
}
