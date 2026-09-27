import { describe, expect, it } from 'vitest';
import { sitemapEntries, sitemapIndexXml, sitemapXml } from './sitemap';

describe('sitemaps', () => {
	it('índex + un sitemap per secció i idioma', () => {
		expect(sitemapEntries()).toEqual([
			'/sitemap-index.xml',
			'/sitemap-ca-pagines.xml',
			'/sitemap-es-paginas.xml'
		]);
		const index = sitemapIndexXml();
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-ca-pagines.xml</loc>');
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-es-paginas.xml</loc>');
	});

	it('URL absolutes, localitzades i sense barra final; mai /app', () => {
		const ca = sitemapXml('ca-pagines') ?? '';
		const es = sitemapXml('es-paginas') ?? '';
		expect(ca).toContain('<loc>https://carnetdecims.cat/ca</loc>');
		expect(ca).toContain('<loc>https://carnetdecims.cat/ca/cims</loc>');
		expect(es).toContain('<loc>https://carnetdecims.cat/es/cimas</loc>');
		expect(ca + es).not.toMatch(/\/app|<loc>[^<]*\/<\/loc>|lastmod/);
	});

	it('nom desconegut → undefined (404)', () => {
		expect(sitemapXml('ca-res')).toBeUndefined();
	});
});
