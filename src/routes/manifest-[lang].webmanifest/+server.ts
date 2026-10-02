import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';
import { LOCALES, type AppLocale } from '$lib/i18n/routes';
import { webManifest } from '$lib/platform/manifest';

// Un manifest per idioma (`/manifest-ca.webmanifest`, `/manifest-es.webmanifest`), generat al build.
export const prerender = true;

export const entries: EntryGenerator = () => LOCALES.map((lang) => ({ lang }));

export const GET: RequestHandler = ({ params }) => {
	if (!(LOCALES as readonly string[]).includes(params.lang)) error(404);
	return new Response(JSON.stringify(webManifest(params.lang as AppLocale), null, '\t'), {
		headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' }
	});
};
