import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { baseLocale, getTextDirection, localizeHref } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

/**
 * `/` → 301 a la portada en català, sempre (sense mirar `Accept-Language`),
 * perquè Googlebot i qualsevol visitant vegin el mateix. Es fa abans de
 * Paraglide, que per defecte redirigiria amb un 307.
 */
const handleRootRedirect: Handle = ({ event, resolve }) => {
	if (event.url.pathname === '/') {
		redirect(301, localizeHref('/', { locale: baseLocale }) + event.url.search);
	}
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

/** La zona `/app` (dades personals) no s'indexa: capçalera a més del meta robots. */
const handleNoindex: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (event.route.id?.startsWith('/app')) {
		response.headers.set('X-Robots-Tag', 'noindex');
	}
	return response;
};

export const handle: Handle = sequence(handleRootRedirect, handleParaglide, handleNoindex);
