import { describe, expect, it } from 'vitest';
import { CIMS } from '$lib/data/catalog';
import {
	comarcaSitemapUrls,
	cimSitemapUrls,
	sitemapEntries,
	sitemapIndexXml,
	sitemapXml,
	urlsetXml
} from './sitemap';

describe('sitemaps', () => {
	it('índex + un sitemap per secció i idioma (sense seccions buides)', () => {
		// Cap fitxa de cim revisada encara → no hi ha sitemap de cims.
		expect(CIMS.some((c) => c.estat_revisio === 'revisat')).toBe(false);
		expect(sitemapEntries()).toEqual([
			'/sitemap-index.xml',
			'/sitemap-ca-pagines.xml',
			'/sitemap-es-paginas.xml',
			'/sitemap-ca-comarques.xml',
			'/sitemap-es-comarcas.xml',
			'/sitemap-ca-llistats.xml',
			'/sitemap-es-listados.xml'
		]);
		const index = sitemapIndexXml();
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-ca-pagines.xml</loc>');
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-es-paginas.xml</loc>');
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-es-comarcas.xml</loc>');
		expect(index).toContain('<loc>https://carnetdecims.cat/sitemap-ca-llistats.xml</loc>');
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

describe('sitemaps de comarques i llistats', () => {
	it('comarques: índex + les 43 comarques amb cims, amb alternates', () => {
		const ca = comarcaSitemapUrls('ca');
		expect(ca).toHaveLength(44);
		expect(ca[0].loc).toBe('https://carnetdecims.cat/ca/comarques');
		expect(ca.map((u) => u.loc)).not.toContain('https://carnetdecims.cat/ca/comarques/segarra');
		const es = comarcaSitemapUrls('es');
		expect(es.find((u) => u.loc.endsWith('/bergueda'))).toEqual({
			loc: 'https://carnetdecims.cat/es/comarcas/bergueda',
			alternates: [
				{ hreflang: 'ca', href: 'https://carnetdecims.cat/ca/comarques/bergueda' },
				{ hreflang: 'es', href: 'https://carnetdecims.cat/es/comarcas/bergueda' },
				{ hreflang: 'x-default', href: 'https://carnetdecims.cat/ca/comarques/bergueda' }
			]
		});
		const xml = sitemapXml('es-comarcas') ?? '';
		expect(xml).toContain('<loc>https://carnetdecims.cat/es/comarcas/catalunya-nord</loc>');
		expect(xml).not.toMatch(/lastmod|<loc>[^<]*\/<\/loc>/);
	});

	it('llistats: essencials, tresmils i més alts; sense fàcils ni amb nens', () => {
		const ca = sitemapXml('ca-llistats') ?? '';
		const locs = [...ca.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
		expect(locs).toEqual([
			'https://carnetdecims.cat/ca/cims-essencials',
			'https://carnetdecims.cat/ca/tresmils',
			'https://carnetdecims.cat/ca/cims-mes-alts'
		]);
		expect(sitemapXml('es-listados')).toContain(
			'hreflang="es" href="https://carnetdecims.cat/es/cimas-mas-altas"'
		);
	});

	it('cap URL repetida entre seccions; pàgines sense comarques ni llistats', () => {
		const pagines = sitemapXml('ca-pagines') ?? '';
		expect(pagines).not.toMatch(/comarques|essencials|tresmils|mes-alts/);
		const totes = ['ca-pagines', 'ca-comarques', 'ca-llistats'].flatMap((n) =>
			[...(sitemapXml(n) ?? '').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
		);
		expect(new Set(totes).size).toBe(totes.length);
	});
});
