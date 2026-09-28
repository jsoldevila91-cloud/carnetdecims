import { describe, expect, it } from 'vitest';
import { CIMS } from '$lib/data/catalog';
import { cimSitemapUrls, sitemapEntries, sitemapIndexXml, sitemapXml, urlsetXml } from './sitemap';

describe('sitemaps', () => {
	it('índex + un sitemap per secció i idioma (sense seccions buides)', () => {
		// Cap fitxa de cim revisada encara → no hi ha sitemap de cims.
		expect(CIMS.some((c) => c.estat_revisio === 'revisat')).toBe(false);
		expect(sitemapEntries()).toEqual([
			'/sitemap-index.xml',
			'/sitemap-ca-pagines.xml',
			'/sitemap-es-paginas.xml'
		]);
		const index = sitemapIndexXml();
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-ca-pagines.xml</loc>');
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-es-paginas.xml</loc>');
		expect(index).not.toContain('cims.xml');
	});

	it('URL absolutes, localitzades i sense barra final; mai /app', () => {
		const ca = sitemapXml('ca-pagines') ?? '';
		const es = sitemapXml('es-paginas') ?? '';
		expect(ca).toContain('<loc>https://carnetdecims.cat/ca</loc>');
		expect(ca).toContain('<loc>https://carnetdecims.cat/ca/cims</loc>');
		expect(es).toContain('<loc>https://carnetdecims.cat/es/cimas</loc>');
		expect(ca + es).not.toMatch(/\/app|<loc>[^<]*\/<\/loc>|lastmod/);
	});

	it('alternates hreflang recíproques amb x-default → ca', () => {
		const ca = sitemapXml('ca-pagines') ?? '';
		expect(ca).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
		expect(ca).toContain(
			'<url><loc>https://carnetdecims.cat/ca/cims</loc>' +
				'<xhtml:link rel="alternate" hreflang="ca" href="https://carnetdecims.cat/ca/cims"/>' +
				'<xhtml:link rel="alternate" hreflang="es" href="https://carnetdecims.cat/es/cimas"/>' +
				'<xhtml:link rel="alternate" hreflang="x-default" href="https://carnetdecims.cat/ca/cims"/>' +
				'</url>'
		);
	});

	it('nom desconegut → undefined (404)', () => {
		expect(sitemapXml('ca-res')).toBeUndefined();
	});
});

describe('sitemap de fitxes de cim', () => {
	const cims = [
		{ slug: 'pedraforca-pollego-superior', estat_revisio: 'revisat', data_revisio: '2026-10-15' },
		{ slug: 'pica-d-estats', estat_revisio: 'esborrany', data_revisio: '2026-10-01' },
		{ slug: 'canigo', estat_revisio: 'revisat' }
	];

	it('només les fitxes revisades, amb lastmod real i alternates', () => {
		const es = cimSitemapUrls(cims, 'es');
		expect(es).toEqual([
			{
				loc: 'https://carnetdecims.cat/es/cimas/pedraforca-pollego-superior',
				lastmod: '2026-10-15',
				alternates: [
					{
						hreflang: 'ca',
						href: 'https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior'
					},
					{
						hreflang: 'es',
						href: 'https://carnetdecims.cat/es/cimas/pedraforca-pollego-superior'
					},
					{
						hreflang: 'x-default',
						href: 'https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior'
					}
				]
			},
			{
				loc: 'https://carnetdecims.cat/es/cimas/canigo',
				alternates: [
					{ hreflang: 'ca', href: 'https://carnetdecims.cat/ca/cims/canigo' },
					{ hreflang: 'es', href: 'https://carnetdecims.cat/es/cimas/canigo' },
					{ hreflang: 'x-default', href: 'https://carnetdecims.cat/ca/cims/canigo' }
				]
			}
		]);
	});

	it('XML amb lastmod només si hi ha data (mai la del build)', () => {
		const xml = urlsetXml(cimSitemapUrls(cims, 'ca'));
		expect(xml).toContain(
			'<loc>https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior</loc><lastmod>2026-10-15</lastmod>'
		);
		expect(xml).toContain('<loc>https://carnetdecims.cat/ca/cims/canigo</loc><xhtml:link');
		expect(xml).not.toContain('pica-d-estats');
		expect(xml.match(/<lastmod>/g)).toHaveLength(1);
	});

	it('una data mal formada no es publica com a lastmod', () => {
		const [url] = cimSitemapUrls(
			[{ slug: 'canigo', estat_revisio: 'revisat', data_revisio: '15/10/2026' }],
			'ca'
		);
		expect(url).not.toHaveProperty('lastmod');
	});
});
