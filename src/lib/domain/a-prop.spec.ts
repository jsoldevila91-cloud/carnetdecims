import { describe, expect, it } from 'vitest';
import { CIMS } from '$lib/data/catalog';
import { RUMBS, azimut, cimsAProp, estatCims, estatDe, rumbDe, type EstatCim } from './a-prop';
import { distanciaKm } from './geo';
import type { Cim } from './types';

const BARCELONA = { lat: 41.3874, lon: 2.1686 };
const BERGA = { lat: 42.1037, lon: 1.8451 };
const VIELHA = { lat: 42.7017, lon: 0.7956 };
const PERPINYA = { lat: 42.6986, lon: 2.8954 };

const slugs = (r: { cim: { slug: string } }[]) => r.map((x) => x.cim.slug);
const idDe = (slug: string) => CIMS.find((c) => c.slug === slug)!.id;

function cim(id: number, lat: number | null, lon: number | null): Cim {
	return {
		id,
		slug: `cim-${id}`,
		nom: `Cim ${id}`,
		nom_amb_article: `el Cim ${id}`,
		nom_amb_de: `del Cim ${id}`,
		altitud: 1000 + id,
		comarca: 'bergueda',
		zona: 'catalunya',
		essencial: true,
		lat,
		lon,
		restriccions: []
	};
}

describe('azimut i rumb', () => {
	const o = { lat: 42, lon: 2 };
	it('punts cardinals', () => {
		expect(azimut(o, { lat: 42.1, lon: 2 })).toBeCloseTo(0, 5);
		expect(azimut(o, { lat: 42, lon: 2.1 })).toBeCloseTo(90, 0);
		expect(azimut(o, { lat: 41.9, lon: 2 })).toBeCloseTo(180, 5);
		expect(azimut(o, { lat: 42, lon: 1.9 })).toBeCloseTo(270, 0);
	});

	it('rumbDe: sectors de 45° centrats i valors fora de rang', () => {
		expect(rumbDe(0)).toBe('N');
		expect(rumbDe(22.4)).toBe('N');
		expect(rumbDe(22.6)).toBe('NE');
		expect(rumbDe(90)).toBe('E');
		expect(rumbDe(135)).toBe('SE');
		expect(rumbDe(180)).toBe('S');
		expect(rumbDe(225)).toBe('SO');
		expect(rumbDe(270)).toBe('O');
		expect(rumbDe(315)).toBe('NO');
		expect(rumbDe(337.6)).toBe('N');
		expect(rumbDe(359.9)).toBe('N');
		expect(rumbDe(360)).toBe('N');
		expect(rumbDe(-90)).toBe('O');
		expect(rumbDe(450)).toBe('E');
	});

	it('els 8 rumbs, un per sector', () => {
		expect([0, 45, 90, 135, 180, 225, 270, 315].map(rumbDe)).toEqual([...RUMBS]);
	});

	it('el rumb va de la posició cap al cim (cim al nord-est → NE)', () => {
		const [r] = cimsAProp(o, [cim(1, 42.1, 2.135)]);
		expect(r.rumb).toBe('NE');
		const [s] = cimsAProp({ lat: 42.1, lon: 2.135 }, [cim(1, 42, 2)]);
		expect(s.rumb).toBe('SO');
	});
});

describe('cimsAProp amb posicions conegudes', () => {
	it('Barcelona: Sant Pere Màrtir és el més proper (~6 km a l’oest)', () => {
		const r = cimsAProp(BARCELONA, CIMS, undefined, { n: 3 });
		expect(slugs(r)).toEqual(['sant-pere-martir', 'turo-de-la-magarola', 'puig-castellar']);
		expect(r[0].distanciaKm).toBeCloseTo(5.94, 1);
		expect(r[0].rumb).toBe('O');
		expect(r[1].rumb).toBe('NO');
		expect(r[2].rumb).toBe('N');
		expect(r.every((x) => x.estat === 'pendent')).toBe(true);
	});

	it('Berga: el Cogulló d’Estela (~5 km, azimut ~293° → NO)', () => {
		const r = cimsAProp(BERGA, CIMS, undefined, { n: 2 });
		expect(slugs(r)).toEqual(['cogullo-d-estela', 'cap-de-la-gallina-pelada']);
		expect(r[0].distanciaKm).toBeCloseTo(5.18, 1);
		expect(r[0].azimut).toBeCloseTo(292.6, 0);
		expect(r[0].rumb).toBe('NO');
		expect(r[1].rumb).toBe('NO');
	});

	it('Vielha: el Montcorbison (~3 km)', () => {
		const r = cimsAProp(VIELHA, CIMS, undefined, { n: 2 });
		expect(slugs(r)).toEqual(['montcorbison', 'tuc-deth-port-de-vielha']);
		expect(r[0].distanciaKm).toBeCloseTo(3.09, 1);
		expect(r[0].rumb).toBe('O');
		expect(r[1].rumb).toBe('S');
	});

	it('Perpinyà: el Puig Neulós (~24 km al sud) i la Torre de Madeloc', () => {
		const r = cimsAProp(PERPINYA, CIMS, undefined, { n: 2 });
		expect(slugs(r)).toEqual(['puig-neulos', 'torre-de-madeloc']);
		expect(r[0].distanciaKm).toBeCloseTo(24.44, 1);
		expect(r[0].rumb).toBe('S');
		expect(r[1].rumb).toBe('SE');
	});

	it('ordenat per distància i coherent amb distanciaKm', () => {
		const r = cimsAProp(BERGA, CIMS, undefined, { n: Infinity });
		expect(r).toHaveLength(CIMS.length);
		for (let i = 1; i < r.length; i++)
			expect(r[i].distanciaKm).toBeGreaterThanOrEqual(r[i - 1].distanciaKm);
		for (const x of r)
			expect(x.distanciaKm).toBe(distanciaKm(BERGA, { lat: x.cim.lat!, lon: x.cim.lon! }));
	});
});

describe('cimsAProp: opcions i estat', () => {
	it('n per defecte = 10', () => {
		expect(cimsAProp(BARCELONA, CIMS)).toHaveLength(10);
		expect(cimsAProp(BARCELONA, CIMS, undefined, { n: 0 })).toEqual([]);
	});

	it('radiKm limita (inclòs) i pot deixar la llista buida', () => {
		const r = cimsAProp(BARCELONA, CIMS, undefined, { n: Infinity, radiKm: 10 });
		expect(slugs(r)).toEqual(['sant-pere-martir', 'turo-de-la-magarola', 'puig-castellar']);
		expect(cimsAProp(PERPINYA, CIMS, undefined, { radiKm: 20 })).toEqual([]);
		const exacte = cimsAProp(BARCELONA, CIMS, undefined, { radiKm: r[0].distanciaKm });
		expect(slugs(exacte)).toEqual(['sant-pere-martir']);
	});

	it('injecta l’estat i nomesPendents salta els fets', () => {
		const estat = new Map<number, EstatCim>([[idDe('puig-neulos'), 'fet']]);
		const tots = cimsAProp(PERPINYA, CIMS, estat, { n: 2 });
		expect(tots.map((x) => [x.cim.slug, x.estat])).toEqual([
			['puig-neulos', 'fet'],
			['torre-de-madeloc', 'pendent']
		]);
		const pendents = cimsAProp(PERPINYA, CIMS, estat, { n: 2, nomesPendents: true });
		expect(slugs(pendents)).toEqual(['torre-de-madeloc', 'roc-del-comptador']);
	});

	it('ignora cims sense coordenades i desempata per id', () => {
		const r = cimsAProp({ lat: 42, lon: 2 }, [
			cim(3, 42.1, 2),
			cim(2, null, null),
			cim(1, 42.1, 2)
		]);
		expect(r.map((x) => x.cim.id)).toEqual([1, 3]);
	});

	it('posició o opcions invàlides → RangeError', () => {
		expect(() => cimsAProp({ lat: NaN, lon: 2 }, CIMS)).toThrow(RangeError);
		expect(() => cimsAProp({ lat: 91, lon: 2 }, CIMS)).toThrow(RangeError);
		expect(() => cimsAProp({ lat: 42, lon: 181 }, CIMS)).toThrow(RangeError);
		expect(() => cimsAProp(BERGA, CIMS, undefined, { n: -1 })).toThrow(RangeError);
		expect(() => cimsAProp(BERGA, CIMS, undefined, { n: 1.5 })).toThrow(RangeError);
		expect(() => cimsAProp(BERGA, CIMS, undefined, { radiKm: -1 })).toThrow(RangeError);
		expect(() => cimsAProp(BERGA, CIMS, undefined, { radiKm: NaN })).toThrow(RangeError);
	});
});

describe('estatCims', () => {
	const avui = '2026-09-30';
	it('fet només amb ascensions vàlides; la resta pendent', () => {
		const pedraforca = idDe('pedraforca-pollego-superior');
		const canigo = idDe('canigo');
		const tormo = idDe('lo-tormo');
		const estat = estatCims(
			[
				{ cimId: pedraforca, data: '2020-05-01', metode: 'a-peu' },
				{ cimId: canigo, data: '2005-01-01', metode: 'a-peu' }, // abans del repte
				{ cimId: tormo, data: '2021-01-01', metode: 'a-peu', deletedAt: '2021-02-01' }
			],
			CIMS,
			avui
		);
		expect(estat.size).toBe(CIMS.length);
		expect(estat.get(pedraforca)).toBe('fet');
		expect(estat.get(canigo)).toBe('pendent');
		expect(estat.get(tormo)).toBe('pendent');
		expect([...estat.values()].filter((e) => e === 'fet')).toHaveLength(1);
	});

	it('estatDe: absent = pendent', () => {
		expect(estatDe(undefined, 1)).toBe('pendent');
		expect(estatDe(new Map([[1, 'fet']]), 1)).toBe('fet');
		expect(estatDe(new Map([[1, 'fet']]), 2)).toBe('pendent');
	});
});
