import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';
import { MODE_BETA } from '$lib/seo/mode-beta';
import { sitemapFiles, sitemapXml } from '$lib/seo/sitemap';

// Un sitemap per secció i idioma (`/sitemap-ca-pagines.xml`…), generat al build.
// En mode beta es generen buits (sense URL): docs/02 §7.1.
export const prerender = true;

export const entries: EntryGenerator = () => sitemapFiles().map(({ name }) => ({ name }));

export const GET: RequestHandler = ({ params }) => {
	const xml = sitemapXml(params.name, MODE_BETA);
	if (!xml) error(404);
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
