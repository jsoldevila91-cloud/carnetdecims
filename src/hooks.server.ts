import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { baseLocale, getTextDirection, localizeHref, locales } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { MODE_BETA, ROBOTS_BETA } from '$lib/seo/mode-beta';
import { m } from '$lib/paraglide/messages';
import {
	esRutaNoindexShell,
	injectarAvisNoscript,
	injectarNoindexShell
} from '$lib/seo/robots-shell';

const LOCALE_PREFIX = new RegExp(`^/(${locales.join('|')})(/|$)`);
/**
 * Fitxers (`/sitemap-index.xml`, `/favicon.ico`…), rutes internes de SvelteKit i l'API
 * (`/api/meteo/{slug}`): sense idioma.
 */
const esApi = (pathname: string) => pathname.startsWith('/api/');
const isUnlocalized = (pathname: string) =>
	/\.[a-z0-9]+$/i.test(pathname) ||
	esApi(pathname) ||
	pathname.startsWith('/_app/') ||
	pathname.startsWith('/.well-known/');

/**
 * Tota URL de pàgina sense prefix d'idioma → 301 a la versió en català, sempre
 * (sense mirar `Accept-Language`), perquè Googlebot i qualsevol visitant vegin el
 * mateix i no hi hagi contingut duplicat sense prefix: `/` → `/ca`, `/cims` → `/ca/cims`.
 * Es fa abans de Paraglide, que només redirigiria documents i amb un 307.
 */
const handleLocaleRedirect: Handle = ({ event, resolve }) => {
	// `url.search` només es llegeix si cal redirigir: en prerender no és accessible.
	const { pathname } = event.url;
	if (!LOCALE_PREFIX.test(pathname) && !isUnlocalized(pathname)) {
		redirect(301, localizeHref(pathname, { locale: baseLocale }) + event.url.search);
	}
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) => {
	// Els sitemaps viuen a l'arrel i no porten idioma: sense redirecció de Paraglide.
	// L'API tampoc: respon JSON, sense pàgina ni idioma.
	if (/^\/sitemap-[\w-]+\.xml$/.test(event.url.pathname) || esApi(event.url.pathname)) {
		return resolve(event);
	}

	return paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				// `replaceAll`: l'idioma surt a `<html lang>` i a l'enllaç del manifest (app.html).
				html
					.replaceAll('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});
};

/** Posa una capçalera; si la resposta té capçaleres immutables (p. ex. de `fetch`), la copia. */
function ambCapcalera(response: Response, nom: string, valor: string): Response {
	try {
		response.headers.set(nom, valor);
		return response;
	} catch {
		const copia = new Response(response.body, response);
		copia.headers.set(nom, valor);
		return copia;
	}
}

/**
 * - La zona `/app` (dades personals) no s'indexa: capçalera `X-Robots-Tag` i, com que és SPA
 *   (`ssr = false`), meta robots injectat al shell HTML (`seo/robots-shell.ts`).
 * - **Mode beta** (`PUBLIC_MODE_BETA`, docs/02 §7.1): `X-Robots-Tag: noindex, nofollow` a totes
 *   les respostes del Worker i meta robots a tot HTML que no en porti (el de `PageMeta` ja hi és).
 *   Les pàgines prerenderitzades no passen pel Worker: la capçalera els arriba pel `_headers`
 *   (`seo/plugin-mode-beta.ts`) i el meta, de `PageMeta`.
 */
const handleNoindex: Handle = async ({ event, resolve }) => {
	const app = esRutaNoindexShell(event.route.id);
	const robots = MODE_BETA ? ROBOTS_BETA : app ? 'noindex' : undefined;
	const response = await resolve(
		event,
		robots
			? {
					transformPageChunk: ({ html }) => {
						const ambRobots = injectarNoindexShell(html, robots);
						// Shell SPA de /app: avís per a qui no té JavaScript (compte, registre, carnet).
						return app ? injectarAvisNoscript(ambRobots, m.app_noscript()) : ambRobots;
					}
				}
			: undefined
	);
	return robots ? ambCapcalera(response, 'X-Robots-Tag', robots) : response;
};

export const handle: Handle = sequence(handleLocaleRedirect, handleParaglide, handleNoindex);
