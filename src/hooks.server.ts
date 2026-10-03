import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { baseLocale, getTextDirection, localizeHref, locales } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { esRutaNoindexShell, injectarNoindexShell } from '$lib/seo/robots-shell';

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

/**
 * La zona `/app` (dades personals) no s'indexa: capçalera `X-Robots-Tag` i, com que és SPA
 * (`ssr = false`), meta robots injectat al shell HTML (`seo/robots-shell.ts`).
 */
const handleNoindex: Handle = async ({ event, resolve }) => {
	const noindex = esRutaNoindexShell(event.route.id);
	const response = await resolve(
		event,
		noindex ? { transformPageChunk: ({ html }) => injectarNoindexShell(html) } : undefined
	);
	if (noindex) response.headers.set('X-Robots-Tag', 'noindex');
	return response;
};

export const handle: Handle = sequence(handleLocaleRedirect, handleParaglide, handleNoindex);
