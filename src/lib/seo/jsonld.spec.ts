import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug, comarcaPerSlug } from '$lib/data/catalog';
import { WEBSITE_ID, cimGraph } from './jsonld';

const BREADCRUMB = { inici: 'Inici', cims: 'Cims' };
const ESSENCIAL = 'Cim essencial del repte 100 Cims';

function graf(slug: string, locale: 'ca' | 'es' = 'ca') {
	const cim = cimPerSlug(slug)!;
	return cimGraph({
		cim,
		comarca: comarcaPerSlug(cim.comarca)!,
		locale,
		title: `${cim.nom} (${cim.altitud} m)`,
		description: 'Descripció de prova',
		breadcrumbNames: BREADCRUMB,
		essencialLabel: ESSENCIAL
	});
}

const node = (g: ReturnType<typeof graf>, type: string) =>
	g['@graph'].find((n) => n['@type'] === type) as Record<string, unknown>;

describe('cimGraph (JSON-LD de la fitxa de cim)', () => {
	it('Mountain amb nom visible, noms alternatius, geo i comarca sense URL', () => {
		const g = graf('pedraforca-pollego-superior');
		expect(g['@context']).toBe('https://schema.org');
		expect(g['@graph'].map((n) => n['@type'])).toEqual(['Mountain', 'WebPage', 'BreadcrumbList']);
		const url = 'https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior';
		expect(node(g, 'Mountain')).toEqual({
			'@type': 'Mountain',
			'@id': `${url}#cim`,
			name: 'Pedraforca',
			// Àlies del catàleg + nom de la llista oficial, sense duplicats
			alternateName: [
				'Pollegó Superior',
				'Pollegó Superior del Pedraforca',
				'Pollegó Superior (Pedraforca)'
			],
			geo: {
				'@type': 'GeoCoordinates',
				latitude: expect.any(Number),
				longitude: expect.any(Number),
				elevation: expect.any(Number)
			},
			containedInPlace: { '@type': 'AdministrativeArea', name: 'Berguedà' },
			additionalProperty: [{ '@type': 'PropertyValue', name: ESSENCIAL, value: true }]
		});
		const geo = node(g, 'Mountain').geo as Record<string, number>;
		expect(geo.elevation).toBe(cimPerSlug('pedraforca-pollego-superior')!.altitud);
	});

	it('WebPage i BreadcrumbList enllaçats, amb URL absolutes localitzades', () => {
		const g = graf('canigo', 'es');
		const url = 'https://carnetdecims.cat/es/cimas/canigo';
		expect(node(g, 'WebPage')).toEqual({
			'@type': 'WebPage',
			'@id': url,
			url,
			name: 'Canigó (2784 m)',
			description: 'Descripció de prova',
			inLanguage: 'es',
			isPartOf: { '@id': WEBSITE_ID },
			about: { '@id': `${url}#cim` },
			breadcrumb: { '@id': `${url}#breadcrumb` }
		});
		expect(node(g, 'BreadcrumbList')).toEqual({
			'@type': 'BreadcrumbList',
			'@id': `${url}#breadcrumb`,
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Inici', item: 'https://carnetdecims.cat/es' },
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Cims',
					item: 'https://carnetdecims.cat/es/cimas'
				},
				{ '@type': 'ListItem', position: 3, name: 'Canigó' }
			]
		});
	});

	it('sense alternateName si el nom oficial coincideix i no hi ha àlies', () => {
		const g = graf('comapedrosa');
		expect(node(g, 'Mountain')).not.toHaveProperty('alternateName');
	});

	it('la propietat "essencial" només surt als cims essencials', () => {
		const cim = { ...cimPerSlug('canigo')!, essencial: false };
		const g = cimGraph({
			cim,
			comarca: comarcaPerSlug(cim.comarca)!,
			locale: 'ca',
			title: cim.nom,
			description: cim.nom,
			breadcrumbNames: BREADCRUMB,
			essencialLabel: ESSENCIAL
		});
		expect(node(g, 'Mountain')).not.toHaveProperty('additionalProperty');
	});

	it('cap cim no suggereix vincle amb la FEEC ni repeteix el nom visible', () => {
		for (const cim of CIMS) {
			const g = cimGraph({
				cim,
				comarca: comarcaPerSlug(cim.comarca)!,
				locale: 'ca',
				title: cim.nom,
				description: cim.nom,
				breadcrumbNames: BREADCRUMB,
				essencialLabel: ESSENCIAL
			});
			const json = JSON.stringify(g);
			expect(json, cim.slug).not.toMatch(/feec/i);
			const m = node(g, 'Mountain');
			expect(m.alternateName ?? [], cim.slug).not.toContain(cim.nom);
			expect(json, cim.slug).not.toContain('"url":"https://carnetdecims.cat/ca/comarques');
		}
	});
});
