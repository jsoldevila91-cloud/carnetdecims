import { describe, expect, it } from 'vitest';
import { CIMS, cimsPerComarca, comarquesAmbCims } from '$lib/data/catalog';
import { comarcaIndexable, llistatIndexable, MIN_CIMS_LLISTAT_INDEXABLE } from './indexabilitat';
import { slugsLlistatDificultat } from '$lib/content/fitxes';
import { CONTINGUTS, PAGINES_CONTINGUT, type Contingut, type ClauPagina } from '$lib/content';
import {
	CONTINGUT_FORA_SITEMAP,
	contingutSitemapUrls,
	comarcaSitemapUrls,
	cimSitemapUrls,
	llistatSitemapUrls,
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
			'/sitemap-es-listados.xml',
			'/sitemap-ca-contingut.xml',
			'/sitemap-es-contenido.xml'
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
	// Catàleg i contingut editorial han d'estar tots dos revisats (`fitxaIndexable`).
	const cims = [
		{ slug: 'pedraforca-pollego-superior', estat_revisio: 'revisat' },
		{ slug: 'pica-d-estats', estat_revisio: 'esborrany' },
		{ slug: 'canigo', estat_revisio: 'revisat' },
		{ slug: 'puigmal', estat_revisio: 'revisat' },
		{ slug: 'montcau', estat_revisio: 'revisat' }
	];
	const continguts: Record<string, { estat: string; actualitzat: string }> = {
		'pedraforca-pollego-superior': { estat: 'revisat', actualitzat: '2026-10-15' },
		'pica-d-estats': { estat: 'revisat', actualitzat: '2026-10-01' },
		canigo: { estat: 'revisat', actualitzat: '15/10/2026' },
		puigmal: { estat: 'verificat', actualitzat: '2026-10-01' }
		// montcau: sense contingut editorial
	};
	const contingut = (slug: string) => continguts[slug];

	it('només les fitxes amb catàleg i contingut revisats, amb lastmod = actualitzat', () => {
		const es = cimSitemapUrls(cims, 'es', contingut);
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

	it('XML amb lastmod només si hi ha data ISO (mai la del build)', () => {
		const xml = urlsetXml(cimSitemapUrls(cims, 'ca', contingut));
		expect(xml).toContain(
			'<loc>https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior</loc><lastmod>2026-10-15</lastmod>'
		);
		expect(xml).toContain('<loc>https://carnetdecims.cat/ca/cims/canigo</loc><xhtml:link');
		expect(xml).not.toMatch(/pica-d-estats|puigmal|montcau/);
		expect(xml.match(/<lastmod>/g)).toHaveLength(1);
	});

	it('amb el contingut real: avui cap fitxa és indexable', () => {
		expect(cimSitemapUrls(CIMS, 'ca')).toEqual([]);
	});
});

describe('sitemaps de comarques i llistats', () => {
	it('comarques: índex + només les comarques indexables (≥ 3 cims), amb alternates', () => {
		const ca = comarcaSitemapUrls('ca');
		const indexables = comarquesAmbCims().filter((c) =>
			comarcaIndexable(cimsPerComarca(c.slug).length)
		);
		expect(indexables.length).toBeGreaterThan(0);
		expect(indexables.length).toBeLessThan(comarquesAmbCims().length);
		expect(ca).toHaveLength(1 + indexables.length);
		expect(ca[0].loc).toBe('https://carnetdecims.cat/ca/comarques');
		const locs = ca.map((u) => u.loc);
		expect(locs).not.toContain('https://carnetdecims.cat/ca/comarques/segarra');
		// Comarques d'1 o 2 cims: `noindex` a la pàgina i fora del sitemap.
		expect(locs).not.toContain('https://carnetdecims.cat/ca/comarques/garraf');
		expect(locs).not.toContain('https://carnetdecims.cat/ca/comarques/maresme');
		expect(locs).toContain('https://carnetdecims.cat/ca/comarques/anoia');
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

	it('llistats: els de catàleg sempre; fàcils i amb nens només si tenen ≥ 3 cims', () => {
		const ca = sitemapXml('ca-llistats') ?? '';
		const locs = [...ca.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
		const dificultat = (['cims-facils', 'cims-amb-nens'] as const)
			.filter((id) => llistatIndexable(slugsLlistatDificultat(id).length))
			.map((id) => `https://carnetdecims.cat/ca/${id}`);
		expect(locs).toEqual([
			'https://carnetdecims.cat/ca/cims-essencials',
			'https://carnetdecims.cat/ca/tresmils',
			'https://carnetdecims.cat/ca/cims-mes-alts',
			...dificultat
		]);
		expect(sitemapXml('es-listados')).toContain(
			'hreflang="es" href="https://carnetdecims.cat/es/cimas-mas-altas"'
		);
	});

	it('llistatSitemapUrls: llindar de MIN_CIMS_LLISTAT_INDEXABLE (3) per als de dificultat', () => {
		expect(MIN_CIMS_LLISTAT_INDEXABLE).toBe(3);
		expect(llistatIndexable(2)).toBe(false);
		expect(llistatIndexable(3)).toBe(true);
		const locs = (n: (id: string) => number) =>
			llistatSitemapUrls('es', n).map((u) => u.loc.replace('https://carnetdecims.cat', ''));
		expect(locs(() => 2)).toEqual(['/es/cimas-esenciales', '/es/tresmiles', '/es/cimas-mas-altas']);
		expect(locs((id) => (id === 'cims-amb-nens' ? 3 : 0)).at(-1)).toBe('/es/cimas-con-ninos');
		expect(locs(() => 3).slice(3)).toEqual(['/es/cimas-faciles', '/es/cimas-con-ninos']);
		const nens = llistatSitemapUrls('ca', () => 5).at(-1)!;
		expect(nens.alternates?.map((a) => a.href)).toEqual([
			'https://carnetdecims.cat/ca/cims-amb-nens',
			'https://carnetdecims.cat/es/cimas-con-ninos',
			'https://carnetdecims.cat/ca/cims-amb-nens'
		]);
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

describe('sitemap de contingut editorial', () => {
	it('les pàgines de contingut no van a `pagines`, sinó a `contingut`', () => {
		const pagines = sitemapXml('ca-pagines') ?? '';
		expect(pagines).not.toMatch(
			/repte-100-cims|metodologia|sobre-el-projecte|avis-legal|privacitat/
		);
		const ca = sitemapXml('ca-contingut') ?? '';
		expect(ca).toContain('<loc>https://carnetdecims.cat/ca/repte-100-cims/normativa</loc>');
		expect(ca).toContain('<loc>https://carnetdecims.cat/ca/metodologia</loc>');
		const es = sitemapXml('es-contenido') ?? '';
		expect(es).toContain('<loc>https://carnetdecims.cat/es/reto-100-cims/como-validar</loc>');
		expect(es).toContain('<loc>https://carnetdecims.cat/es/sobre-el-proyecto</loc>');
	});

	it('lastmod = actualitzat de cada idioma, amb alternates recíproques', () => {
		for (const locale of ['ca', 'es'] as const) {
			const urls = contingutSitemapUrls(locale);
			expect(urls).toHaveLength(6);
			const metodologia = urls.find((u) => u.loc.endsWith('/metodologia'));
			expect(metodologia).toEqual({
				loc: `https://carnetdecims.cat/${locale}/metodologia`,
				lastmod: CONTINGUTS.metodologia[locale].actualitzat,
				alternates: [
					{ hreflang: 'ca', href: 'https://carnetdecims.cat/ca/metodologia' },
					{ hreflang: 'es', href: 'https://carnetdecims.cat/es/metodologia' },
					{ hreflang: 'x-default', href: 'https://carnetdecims.cat/ca/metodologia' }
				]
			});
			for (const u of urls) expect(u.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		}
	});

	it('les legals (avís legal i privadesa) en queden fora', () => {
		expect(CONTINGUT_FORA_SITEMAP).toEqual(['avisLegal', 'privacitat']);
		const xml = (sitemapXml('ca-contingut') ?? '') + (sitemapXml('es-contenido') ?? '');
		expect(xml).not.toMatch(/avis-legal|aviso-legal|privacitat|privacidad/);
	});

	it('una pàgina noindex en qualsevol idioma en queda fora; data invàlida → sense lastmod', () => {
		const copia = structuredClone(CONTINGUTS) as Record<ClauPagina, Contingut>;
		copia.normativa.es.noindex = true;
		copia.repte.ca.actualitzat = 'aviat';
		const ca = contingutSitemapUrls('ca', copia);
		expect(ca.some((u) => u.loc.endsWith(PAGINES_CONTINGUT.normativa))).toBe(false);
		const repte = ca.find((u) => u.loc === 'https://carnetdecims.cat/ca/repte-100-cims');
		expect(repte).toBeDefined();
		expect(repte).not.toHaveProperty('lastmod');
	});
});
