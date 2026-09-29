import { describe, expect, it } from 'vitest';
import {
	CIMS,
	LLISTATS,
	cimPerSlug,
	cimsDelLlistat,
	cimsPerComarca,
	comarcaPerSlug,
	comarquesAmbCims,
	type LlistatId
} from '$lib/data/catalog';
import {
	LLISTAT_PATH,
	WEBSITE_ID,
	cimGraph,
	cimsGraph,
	comarcaGraph,
	comarcaPlace,
	comarquesGraph,
	llistatGraph
} from './jsonld';

const BREADCRUMB = { inici: 'Inici', comarques: 'Comarques' };
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
	it('Mountain amb nom visible, noms alternatius, geo i comarca amb URL', () => {
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
			containedInPlace: {
				'@type': 'AdministrativeArea',
				'@id': 'https://carnetdecims.cat/ca/comarques/bergueda#comarca',
				name: 'Berguedà',
				url: 'https://carnetdecims.cat/ca/comarques/bergueda'
			},
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
					name: 'Comarques',
					item: 'https://carnetdecims.cat/es/comarcas'
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Catalunya Nord',
					item: 'https://carnetdecims.cat/es/comarcas/catalunya-nord'
				},
				{ '@type': 'ListItem', position: 4, name: 'Canigó' }
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
			expect(m.containedInPlace, cim.slug).toMatchObject({
				url: `https://carnetdecims.cat/ca/comarques/${cim.comarca}`
			});
		}
	});

	it('tipus de lloc: Country per a Andorra i Place per a la Catalunya Nord', () => {
		expect(node(graf('comapedrosa', 'es'), 'Mountain').containedInPlace).toEqual({
			'@type': 'Country',
			'@id': 'https://carnetdecims.cat/es/comarcas/andorra#comarca',
			name: 'Andorra',
			url: 'https://carnetdecims.cat/es/comarcas/andorra'
		});
		expect(comarcaPlace(comarcaPerSlug('catalunya-nord')!, 'ca')['@type']).toBe('Place');
	});

	it('format antic del breadcrumb ({ inici, cims }) encara compatible', () => {
		const cim = cimPerSlug('canigo')!;
		const g = cimGraph({
			cim,
			comarca: comarcaPerSlug(cim.comarca)!,
			locale: 'ca',
			title: cim.nom,
			description: cim.nom,
			breadcrumbNames: { inici: 'Inici', cims: 'Cims' },
			essencialLabel: ESSENCIAL
		});
		const items = (node(g, 'BreadcrumbList').itemListElement as { name: string }[]).map(
			(i) => i.name
		);
		expect(items).toEqual(['Inici', 'Cims', 'Canigó']);
	});
});

const BC_COMARQUES = { inici: 'Inici', comarques: 'Comarques' };

describe('comarcaGraph (JSON-LD de la pàgina de comarca)', () => {
	const bergueda = comarcaPerSlug('bergueda')!;
	const cims = cimsPerComarca('bergueda');
	const g = comarcaGraph({
		comarca: bergueda,
		cims,
		locale: 'ca',
		title: 'Cims del Berguedà',
		description: 'Descripció',
		breadcrumbNames: BC_COMARQUES
	});
	const url = 'https://carnetdecims.cat/ca/comarques/bergueda';

	it('CollectionPage sobre la comarca amb ItemList de fitxes', () => {
		expect(g['@graph'].map((n) => n['@type'])).toEqual(['CollectionPage', 'BreadcrumbList']);
		const page = node(g, 'CollectionPage');
		expect(page).toMatchObject({
			'@id': url,
			url,
			name: 'Cims del Berguedà',
			description: 'Descripció',
			inLanguage: 'ca',
			isPartOf: { '@id': WEBSITE_ID },
			about: {
				'@type': 'AdministrativeArea',
				'@id': `${url}#comarca`,
				name: 'Berguedà',
				url
			},
			breadcrumb: { '@id': `${url}#breadcrumb` }
		});
		const list = page.mainEntity as { numberOfItems: number; itemListElement: unknown[] };
		expect(list.numberOfItems).toBe(cims.length);
		expect(list.itemListElement[0]).toEqual({
			'@type': 'ListItem',
			position: 1,
			url: `https://carnetdecims.cat/ca/cims/${cims[0].slug}`,
			name: cims[0].nom
		});
		expect(list.itemListElement).toHaveLength(cims.length);
	});

	it('el @id de la comarca coincideix amb el containedInPlace de les fitxes', () => {
		const about = node(g, 'CollectionPage').about as { '@id': string };
		expect(node(graf('pedraforca-pollego-superior'), 'Mountain').containedInPlace).toMatchObject({
			'@id': about['@id']
		});
	});

	it('BreadcrumbList Inici › Comarques › {comarca} en castellà', () => {
		const es = comarcaGraph({
			comarca: comarcaPerSlug('val-d-aran')!,
			cims: cimsPerComarca('val-d-aran'),
			locale: 'es',
			title: 'Cimas de la Val d’Aran',
			description: 'Descripción',
			breadcrumbNames: { inici: 'Inicio', comarques: 'Comarcas' }
		});
		expect(node(es, 'BreadcrumbList')).toEqual({
			'@type': 'BreadcrumbList',
			'@id': 'https://carnetdecims.cat/es/comarcas/val-d-aran#breadcrumb',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://carnetdecims.cat/es' },
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Comarcas',
					item: 'https://carnetdecims.cat/es/comarcas'
				},
				{ '@type': 'ListItem', position: 3, name: comarcaPerSlug('val-d-aran')!.nom }
			]
		});
	});

	it('cap comarca no menciona la FEEC', () => {
		for (const c of comarquesAmbCims()) {
			const json = JSON.stringify(
				comarcaGraph({
					comarca: c,
					cims: cimsPerComarca(c.slug),
					locale: 'ca',
					title: c.nom,
					description: c.nom,
					breadcrumbNames: BC_COMARQUES
				})
			);
			expect(json, c.slug).not.toMatch(/feec/i);
		}
	});
});

describe('comarquesGraph (índex de comarques)', () => {
	it('ItemList de les pàgines de comarca + breadcrumb Inici › Comarques', () => {
		const comarques = comarquesAmbCims();
		const g = comarquesGraph({
			comarques,
			locale: 'es',
			title: 'Comarcas',
			description: 'Descripción',
			breadcrumbNames: { inici: 'Inicio', comarques: 'Comarcas' }
		});
		const page = node(g, 'CollectionPage');
		expect(page['@id']).toBe('https://carnetdecims.cat/es/comarcas');
		const list = page.mainEntity as { numberOfItems: number; itemListElement: unknown[] };
		expect(list.numberOfItems).toBe(comarques.length);
		expect(list.itemListElement.at(-1)).toEqual({
			'@type': 'ListItem',
			position: comarques.length,
			url: 'https://carnetdecims.cat/es/comarcas/catalunya-nord',
			name: 'Catalunya Nord'
		});
		expect((node(g, 'BreadcrumbList').itemListElement as unknown[]).at(-1)).toEqual({
			'@type': 'ListItem',
			position: 2,
			name: 'Comarcas'
		});
	});
});

describe('llistatGraph (JSON-LD dels llistats curats)', () => {
	it('camins iguals que LLISTATS', () => {
		for (const id of Object.keys(LLISTATS) as LlistatId[])
			expect(LLISTAT_PATH[id]).toBe(LLISTATS[id].path);
	});

	it('CollectionPage + ItemList en l’ordre del llistat + breadcrumb Inici › {llistat}', () => {
		const cims = cimsDelLlistat('tresmils');
		const g = llistatGraph({
			id: 'tresmils',
			cims,
			locale: 'es',
			title: 'Los tresmiles del reto 100 Cims',
			description: 'Descripción',
			breadcrumbNames: { inici: 'Inicio', llistat: 'Tresmiles' }
		});
		const url = 'https://carnetdecims.cat/es/tresmiles';
		const page = node(g, 'CollectionPage');
		expect(page).toMatchObject({ '@id': url, url, inLanguage: 'es' });
		expect(page).not.toHaveProperty('about');
		const list = page.mainEntity as { itemListElement: { url: string }[] };
		expect(list.itemListElement.map((i) => i.url)).toEqual(
			cims.map((c) => `https://carnetdecims.cat/es/cimas/${c.slug}`)
		);
		expect(node(g, 'BreadcrumbList').itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://carnetdecims.cat/es' },
			{ '@type': 'ListItem', position: 2, name: 'Tresmiles' }
		]);
	});

	it('sense nom curt, el breadcrumb fa servir el títol; id desconegut → RangeError', () => {
		const g = llistatGraph({
			id: 'mes-alts',
			cims: cimsDelLlistat('mes-alts'),
			locale: 'ca',
			title: 'Els cims més alts',
			description: 'D',
			breadcrumbNames: { inici: 'Inici' }
		});
		expect(node(g, 'CollectionPage')['@id']).toBe('https://carnetdecims.cat/ca/cims-mes-alts');
		expect((node(g, 'BreadcrumbList').itemListElement as { name: string }[])[1].name).toBe(
			'Els cims més alts'
		);
		expect(() =>
			llistatGraph({
				id: 'cims-facils' as LlistatId,
				cims: [],
				locale: 'ca',
				title: 'x',
				description: 'x',
				breadcrumbNames: { inici: 'Inici' }
			})
		).toThrow(RangeError);
	});
});

describe('cimsGraph (llista completa /cims)', () => {
	it('CollectionPage + ItemList sencer en l’ordre donat + breadcrumb Inici › {llista}', () => {
		const g = cimsGraph({
			cims: CIMS,
			locale: 'es',
			title: 'Lista de cimas',
			description: 'D',
			breadcrumbNames: { inici: 'Inicio', cims: 'Lista de cimas' }
		});
		const col = node(g, 'CollectionPage');
		expect(col['@id']).toBe('https://carnetdecims.cat/es/cimas');
		expect(col.isPartOf).toEqual({ '@id': WEBSITE_ID });
		const llista = col.mainEntity as { numberOfItems: number; itemListElement: { url: string }[] };
		expect(llista.numberOfItems).toBe(CIMS.length);
		expect(llista.itemListElement[0].url).toBe(`https://carnetdecims.cat/es/cimas/${CIMS[0].slug}`);
		expect(
			(node(g, 'BreadcrumbList').itemListElement as { name: string; item?: string }[]).map((i) => [
				i.name,
				i.item
			])
		).toEqual([
			['Inicio', 'https://carnetdecims.cat/es'],
			['Lista de cimas', undefined]
		]);
	});
});
