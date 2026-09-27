import type { RequestHandler } from './$types';
import { sitemapIndexXml } from '$lib/seo/sitemap';

// Fitxer estàtic generat al build (entrada de prerender a vite.config.ts).
export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(sitemapIndexXml(), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
