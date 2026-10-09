import type { RequestHandler } from './$types';
import { MODE_BETA } from '$lib/seo/mode-beta';
import { sitemapIndexXml } from '$lib/seo/sitemap';

// Fitxer estàtic generat al build (entrada de prerender a vite.config.ts). En beta, buit.
export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(sitemapIndexXml(MODE_BETA), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
