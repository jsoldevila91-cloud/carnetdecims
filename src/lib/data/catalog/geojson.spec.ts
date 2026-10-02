import { describe, expect, it } from 'vitest';
import type { EstatCim } from '$lib/domain';
import {
	FILTRES_BUITS,
	filtresDesDeUrl,
	passaFiltres,
	textCerca,
	type FiltresCims
} from '$lib/domain/filtres-cims';
import { CIMS, COMARQUES } from './cataleg';
import {
	filtrarCims,
	filtresAQuery,
	filtresDesDeQuery,
	filtresMapaActius,
	filtresMapaDesDeFiltresCims,
	geojsonCims,
	type FiltresMapa
} from './geojson';
import { cimPerSlug, comarcaPerSlug } from './queries';

const slugs = (cims: readonly { slug: string }[]) => cims.map((c) => c.slug);
const id = (slug: string) => cimPerSlug(slug)!.id;
/** Resultat del filtre de `/cims` per a una query (la referència). */
const resultatCims = (query: string) => {
	const f = filtresDesDeUrl(new URLSearchParams(query));
	return CIMS.filter((c) => passaFiltres(c, textCerca(c, comarcaPerSlug(c.comarca)?.nom), f));
};

describe('filtrarCims: mateix filtre que /cims', () => {
	it.each([
		'',
		'q=canigo',
		"q=PICA+D'ESTATS",
		'q=pica%E2%80%99estats',
		'q=bergueda',
		'q=xyzzy',
		'zona=andorra',
		'zona=catalunya-nord',
		'alt=fins-1000',
		'alt=1000-2000',
		'alt=2000-3000',
		'alt=des-3000',
		'essencials=1',
		'q=puig&zona=catalunya&alt=1000-2000&essencials=1',
		'zona=lluna&alt=9999&essencials=si'
	])('query "%s"', (query) => {
		expect(slugs(filtrarCims(CIMS, filtresDesDeQuery(query)))).toEqual(slugs(resultatCims(query)));
	});

	it('sense filtres retorna tots els cims (còpia)', () => {
		const r = filtrarCims(CIMS);
		expect(r).toHaveLength(CIMS.length);
		expect(r).not.toBe(CIMS);
		expect(filtresMapaActius({})).toBe(false);
		expect(filtresMapaActius({ estat: 'tots', q: '  ' })).toBe(false);
	});

	it('filtresMapaDesDeFiltresCims dona el mateix resultat que passaFiltres', () => {
		const casos: Partial<FiltresCims>[] = [
			{ text: 'puig', altitud: '1000-2000' },
			{ zona: 'andorra', nomesEssencials: true },
			{ altitud: 'des-3000' },
			{ altitud: 'fins-1000' }
		];
		for (const parcial of casos) {
			const f = { ...FILTRES_BUITS, ...parcial };
			const esperat = CIMS.filter((c) =>
				passaFiltres(c, textCerca(c, comarcaPerSlug(c.comarca)?.nom), f)
			);
			expect(slugs(filtrarCims(CIMS, filtresMapaDesDeFiltresCims(f)))).toEqual(slugs(esperat));
		}
	});
});

describe('filtrarCims: filtres propis del mapa', () => {
	it('comarca', () => {
		const r = filtrarCims(CIMS, { comarca: 'bergueda' });
		expect(r.length).toBeGreaterThan(0);
		expect(r.every((c) => c.comarca === 'bergueda')).toBe(true);
		expect(r).toHaveLength(CIMS.filter((c) => c.comarca === 'bergueda').length);
	});

	it('altMin inclòs i altMax exclòs', () => {
		const alt = cimPerSlug('canigo')!.altitud;
		expect(slugs(filtrarCims(CIMS, { altMin: alt, altMax: alt + 1 }))).toContain('canigo');
		expect(slugs(filtrarCims(CIMS, { altMin: alt + 1 }))).not.toContain('canigo');
		expect(slugs(filtrarCims(CIMS, { altMax: alt }))).not.toContain('canigo');
		const r = filtrarCims(CIMS, { altMin: 1500, altMax: 2500 });
		expect(r.every((c) => c.altitud >= 1500 && c.altitud < 2500)).toBe(true);
	});

	it('essencial true / false', () => {
		expect(filtrarCims(CIMS, { essencial: true })).toHaveLength(
			CIMS.filter((c) => c.essencial).length
		);
		expect(filtrarCims(CIMS, { essencial: false })).toHaveLength(
			CIMS.filter((c) => !c.essencial).length
		);
	});

	it('estat fet/pendent/tots amb l’estat injectat (absent = pendent)', () => {
		const estat = new Map<number, EstatCim>([
			[id('canigo'), 'fet'],
			[id('carlit'), 'fet'],
			[id('comapedrosa'), 'pendent']
		]);
		expect(slugs(filtrarCims(CIMS, { estat: 'fet' }, estat)).sort()).toEqual(['canigo', 'carlit']);
		expect(filtrarCims(CIMS, { estat: 'pendent' }, estat)).toHaveLength(CIMS.length - 2);
		expect(filtrarCims(CIMS, { estat: 'tots' }, estat)).toHaveLength(CIMS.length);
		expect(filtrarCims(CIMS, { estat: 'fet' })).toEqual([]);
		expect(
			slugs(filtrarCims(CIMS, { estat: 'fet', zona: 'catalunya-nord', q: 'canigo' }, estat))
		).toEqual(['canigo']);
	});
});

describe('geojsonCims', () => {
	it('un punt [lon, lat] per cim amb les propietats i l’estat', () => {
		const estat = new Map<number, EstatCim>([[id('canigo'), 'fet']]);
		const fc = geojsonCims(CIMS, estat);
		expect(fc.type).toBe('FeatureCollection');
		expect(fc.features).toHaveLength(CIMS.length);
		const canigo = cimPerSlug('canigo')!;
		const f = fc.features.find((x) => x.properties.slug === 'canigo')!;
		expect(f).toEqual({
			type: 'Feature',
			id: canigo.id,
			geometry: { type: 'Point', coordinates: [canigo.lon, canigo.lat] },
			properties: {
				id: canigo.id,
				slug: 'canigo',
				nom: canigo.nom,
				altitud: canigo.altitud,
				comarca: canigo.comarca,
				zona: 'catalunya-nord',
				essencial: true,
				estat: 'fet'
			}
		});
		expect(fc.features.filter((x) => x.properties.estat === 'fet')).toHaveLength(1);
		expect(JSON.parse(JSON.stringify(fc))).toEqual(fc);
	});

	it('sense estat, tots pendents; amb filtres, només els que passen', () => {
		expect(geojsonCims(CIMS).features.every((f) => f.properties.estat === 'pendent')).toBe(true);
		const fc = geojsonCims(CIMS, undefined, { zona: 'andorra' });
		expect(fc.features.map((f) => f.properties.slug)).toEqual(
			slugs(CIMS.filter((c) => c.zona === 'andorra'))
		);
	});

	it('omet els cims sense coordenades', () => {
		const sense = { ...CIMS[0], lat: null, lon: null };
		expect(geojsonCims([sense, CIMS[1]]).features.map((f) => f.id)).toEqual([CIMS[1].id]);
	});
});

describe('query string', () => {
	it('noms compatibles amb /cims', () => {
		const f: FiltresMapa = {
			q: 'pica',
			zona: 'andorra',
			altMin: 2000,
			altMax: 3000,
			essencial: true
		};
		const qs = filtresAQuery(f);
		expect(qs).toBe('q=pica&zona=andorra&alt=2000-3000&essencials=1');
		expect(filtresDesDeUrl(new URLSearchParams(qs))).toEqual({
			text: 'pica',
			zona: 'andorra',
			altitud: '2000-3000',
			nomesEssencials: true
		});
		expect(filtresAQuery({ altMax: 1000 })).toBe('alt=fins-1000');
		expect(filtresAQuery({ altMin: 3000 })).toBe('alt=des-3000');
		expect(filtresAQuery({})).toBe('');
		expect(filtresAQuery({ estat: 'tots', q: '  ' })).toBe('');
	});

	it('paràmetres propis: comarca, altmin/altmax i estat', () => {
		const f: FiltresMapa = {
			comarca: 'bergueda',
			altMin: 1500,
			altMax: 2400,
			estat: 'pendent',
			essencial: false
		};
		const qs = filtresAQuery(f);
		expect(qs).toBe('essencials=0&comarca=bergueda&altmin=1500&altmax=2400&estat=pendent');
		expect(filtresDesDeQuery(qs)).toEqual(f);
		expect(filtresAQuery({ altMin: 1200 })).toBe('altmin=1200');
	});

	it('anada i tornada', () => {
		const casos: FiltresMapa[] = [
			{},
			{ q: "pica d'estats" },
			{ zona: 'catalunya-nord', estat: 'fet' },
			{ altMin: 1000, altMax: 2000 },
			{ altMin: 3000 },
			{ altMax: 1000 },
			{ comarca: COMARQUES[0].slug, essencial: true }
		];
		for (const f of casos) expect(filtresDesDeQuery(filtresAQuery(f))).toEqual(f);
	});

	it('accepta "?" i URLSearchParams; ignora valors invàlids', () => {
		expect(filtresDesDeQuery('?zona=andorra')).toEqual({ zona: 'andorra' });
		expect(filtresDesDeQuery(new URLSearchParams('estat=fet'))).toEqual({ estat: 'fet' });
		expect(
			filtresDesDeQuery(
				'zona=lluna&comarca=inventada&alt=9000&altmin=-5&altmax=1e3&essencials=si&estat=tots&q=%20%20'
			)
		).toEqual({});
		expect(filtresDesDeQuery('altmin=12345')).toEqual({});
		expect(filtresDesDeQuery(`q=${'a'.repeat(200)}`).q).toHaveLength(80);
	});

	it('altmin/altmax explícits tenen prioritat sobre alt', () => {
		expect(filtresDesDeQuery('alt=1000-2000&altmax=1500')).toEqual({ altMin: 1000, altMax: 1500 });
	});
});
