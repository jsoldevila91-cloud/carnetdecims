import { describe, expect, it } from 'vitest';
import { distanciaKm } from '$lib/domain';
import {
	CIMS,
	COMARQUES,
	SLUGS_CIMS,
	cimPerSlug,
	cimsMateixaComarca,
	cimsPropers,
	comarcaPerSlug
} from './index';

const cim = (slug: string) => {
	const c = cimPerSlug(slug);
	if (!c) throw new Error(`No existeix ${slug}`);
	return c;
};

describe('consultes del catàleg', () => {
	it('cimPerSlug i comarcaPerSlug', () => {
		expect(cimPerSlug('pedraforca-pollego-superior')?.nom).toBe('Pedraforca');
		expect(cimPerSlug('no-existeix')).toBeUndefined();
		expect(cimPerSlug('')).toBeUndefined();
		expect(comarcaPerSlug('bergueda')?.nom).toBe('Berguedà');
		expect(comarcaPerSlug('andorra')?.zona).toBe('andorra');
		expect(comarcaPerSlug('no-existeix')).toBeUndefined();
		// Tots els cims resolen la seva comarca
		for (const c of CIMS) expect(comarcaPerSlug(c.comarca), c.slug).toBeDefined();
		expect(COMARQUES.every((c) => comarcaPerSlug(c.slug) === c)).toBe(true);
	});

	it('SLUGS_CIMS: 150 slugs únics en l’ordre del catàleg', () => {
		expect(SLUGS_CIMS).toHaveLength(150);
		expect(new Set(SLUGS_CIMS).size).toBe(150);
		expect(SLUGS_CIMS).toEqual(CIMS.map((c) => c.slug));
		expect(Object.isFrozen(SLUGS_CIMS)).toBe(true);
	});

	it('cimsPropers: 6 per defecte, sense el mateix cim, ordenats per distància', () => {
		for (const c of CIMS) {
			const propers = cimsPropers(c);
			expect(propers, c.slug).toHaveLength(6);
			expect(propers.some((p) => p.cim.id === c.id)).toBe(false);
			for (let i = 1; i < propers.length; i++)
				expect(propers[i].distanciaKm).toBeGreaterThanOrEqual(propers[i - 1].distanciaKm);
		}
		// Cap cim fora de la llista és més a prop que l'últim de la llista
		const comapedrosa = cim('comapedrosa');
		const propers = cimsPropers(comapedrosa, 3);
		expect(propers).toHaveLength(3);
		const llindar = propers.at(-1)!.distanciaKm;
		const ids = new Set(propers.map((p) => p.cim.id));
		for (const c of CIMS) {
			if (c.id === comapedrosa.id || ids.has(c.id)) continue;
			const d = distanciaKm(
				{ lat: comapedrosa.lat!, lon: comapedrosa.lon! },
				{ lat: c.lat!, lon: c.lon! }
			);
			expect(d, c.slug).toBeGreaterThanOrEqual(llindar);
		}
		// Del Comapedrosa: Monteixo ≈ 6,8 km, Tristaina ≈ 8,0 km, Pica d'Estats ≈ 9,2 km
		expect(propers.map((p) => p.cim.slug)).toEqual(['monteixo', 'tristaina', 'pica-d-estats']);
		expect(propers[0].distanciaKm).toBeCloseTo(6.8, 1);
		expect(propers[1].distanciaKm).toBeCloseTo(7.97, 1);
	});

	it('cimsPropers: n = 0 i cim sense coordenades', () => {
		const c = cim('canigo');
		expect(cimsPropers(c, 0)).toEqual([]);
		expect(cimsPropers({ ...c, lat: null, lon: null })).toEqual([]);
		expect(cimsPropers(c, 200)).toHaveLength(149);
	});

	it('cimsMateixaComarca: sense el mateix cim, per altitud descendent', () => {
		// Andorra: Comapedrosa 2942, Serrera 2912, Tristaina 2878, Pic Negre 2822, Casamanya 2750
		expect(cimsMateixaComarca(cim('comapedrosa')).map((c) => c.slug)).toEqual([
			'pic-de-la-serrera',
			'tristaina',
			'pic-negre-d-envalira'
		]);
		expect(cimsMateixaComarca(cim('tristaina'), 10).map((c) => c.slug)).toEqual([
			'comapedrosa',
			'pic-de-la-serrera',
			'pic-negre-d-envalira',
			'casamanya-nord'
		]);
		for (const c of CIMS) {
			const mateixa = cimsMateixaComarca(c);
			expect(mateixa.length).toBeLessThanOrEqual(3);
			expect(mateixa.every((x) => x.comarca === c.comarca && x.id !== c.id)).toBe(true);
			for (let i = 1; i < mateixa.length; i++)
				expect(mateixa[i].altitud).toBeLessThanOrEqual(mateixa[i - 1].altitud);
		}
		// Comarca amb un sol cim essencial (Garraf): cap altre
		const garraf = CIMS.find((c) => c.comarca === 'garraf')!;
		expect(cimsMateixaComarca(garraf)).toEqual([]);
		expect(cimsMateixaComarca(cim('comapedrosa'), 0)).toEqual([]);
	});
});
