import { describe, expect, it } from 'vitest';
import { distanciaKm } from '$lib/domain';
import { LLISTAT_PATHS, slugsComarquesAmbCims } from '$lib/i18n/routes';
import {
	ALTITUD_TRESMIL,
	CIMS,
	COMARQUES,
	LLISTATS,
	LLISTAT_IDS,
	SLUGS_CIMS,
	agruparPerComarca,
	cimPerSlug,
	cimsDelLlistat,
	cimsMateixaComarca,
	cimsPerComarca,
	cimsPropers,
	comarcaPerSlug,
	comarquesAmbCims,
	type LlistatId
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

describe('comarques', () => {
	it('cimsPerComarca: tots els de la comarca, per altitud descendent', () => {
		const andorra = cimsPerComarca('andorra');
		expect(andorra.map((c) => c.slug)).toEqual([
			'comapedrosa',
			'pic-de-la-serrera',
			'tristaina',
			'pic-negre-d-envalira',
			'casamanya-nord'
		]);
		expect(cimsPerComarca('bergueda')).toHaveLength(6);
		expect(cimsPerComarca('bergueda').every((c) => c.comarca === 'bergueda')).toBe(true);
		expect(cimsPerComarca('segarra')).toEqual([]);
		expect(cimsPerComarca('no-existeix')).toEqual([]);
		// Cada cim és exactament en una comarca
		const total = COMARQUES.reduce((n, c) => n + cimsPerComarca(c.slug).length, 0);
		expect(total).toBe(CIMS.length);
		for (const c of COMARQUES) {
			const cims = cimsPerComarca(c.slug);
			for (let i = 1; i < cims.length; i++)
				expect(cims[i].altitud, c.slug).toBeLessThanOrEqual(cims[i - 1].altitud);
		}
	});

	it('comarquesAmbCims: sense les buides, alfabètic català i Andorra i Catalunya Nord al final', () => {
		const comarques = comarquesAmbCims();
		const slugs = comarques.map((c) => c.slug);
		expect(slugs).not.toContain('segarra');
		expect(comarques).toHaveLength(43);
		expect(comarques.every((c) => cimsPerComarca(c.slug).length > 0)).toBe(true);
		expect(slugs.slice(-2)).toEqual(['andorra', 'catalunya-nord']);
		expect(comarques.slice(0, -2).every((c) => c.zona === 'catalunya')).toBe(true);
		// Collation catalana: els accents no alteren l'ordre ("Alt Empordà" < "Alt Penedès" < "Alt Urgell")
		expect(slugs.slice(0, 5)).toEqual([
			'alt-camp',
			'alt-emporda',
			'alt-penedes',
			'alt-urgell',
			'alta-ribagorca'
		]);
		expect(slugs.indexOf('selva')).toBeLessThan(slugs.indexOf('solsones'));
		expect(slugs.indexOf('urgell')).toBeLessThan(slugs.indexOf('val-d-aran'));
		// Mateix conjunt que les entrades de prerender (routes.ts, sense $lib)
		expect(new Set(slugs)).toEqual(new Set(slugsComarquesAmbCims()));
	});

	it('agruparPerComarca: ordre de comarquesAmbCims i ordre intern conservat', () => {
		const grups = agruparPerComarca(cimsDelLlistat('tresmils'));
		expect(grups.map((g) => g.comarca.slug)).toEqual(
			comarquesAmbCims()
				.map((c) => c.slug)
				.filter((s) => grups.some((g) => g.comarca.slug === s))
		);
		expect(grups.flatMap((g) => g.cims)).toHaveLength(cimsDelLlistat('tresmils').length);
		expect(agruparPerComarca([])).toEqual([]);
	});
});

describe('llistats curats', () => {
	it('només els llistats que es poden fer sense MIDE, amb camins de routes.ts', () => {
		expect([...LLISTAT_IDS].sort()).toEqual(['essencials', 'mes-alts', 'tresmils']);
		expect(LLISTAT_IDS.map((id) => LLISTATS[id].path)).toEqual([...LLISTAT_PATHS]);
		for (const id of LLISTAT_IDS) expect(LLISTATS[id].id).toBe(id);
	});

	it('essencials: tots els essencials, agrupats per comarca i per altitud dins de cada una', () => {
		const cims = cimsDelLlistat('essencials');
		expect(cims).toHaveLength(CIMS.filter((c) => c.essencial).length);
		expect(cims.every((c) => c.essencial)).toBe(true);
		const ordreComarca = comarquesAmbCims().map((c) => c.slug);
		for (let i = 1; i < cims.length; i++) {
			const a = ordreComarca.indexOf(cims[i - 1].comarca);
			const b = ordreComarca.indexOf(cims[i].comarca);
			expect(b).toBeGreaterThanOrEqual(a);
			if (a === b) expect(cims[i].altitud).toBeLessThanOrEqual(cims[i - 1].altitud);
		}
		expect(cims[0].comarca).toBe('alt-camp');
		expect(cims.at(-1)!.comarca).toBe('catalunya-nord');
	});

	it('tresmils: tots els ≥ 3.000 m, de més alt a més baix', () => {
		const cims = cimsDelLlistat('tresmils');
		expect(ALTITUD_TRESMIL).toBe(3000);
		expect(cims).toEqual(
			CIMS.filter((c) => c.altitud >= 3000).sort((a, b) => b.altitud - a.altitud || a.id - b.id)
		);
		expect(cims.length).toBeGreaterThan(0);
		expect(cims[0].slug).toBe('pica-d-estats');
	});

	it('mes-alts: rànquing dels 25 més alts', () => {
		const cims = cimsDelLlistat('mes-alts');
		expect(cims).toHaveLength(25);
		for (let i = 1; i < cims.length; i++)
			expect(cims[i].altitud).toBeLessThanOrEqual(cims[i - 1].altitud);
		const llindar = cims.at(-1)!.altitud;
		const ids = new Set(cims.map((c) => c.id));
		expect(CIMS.filter((c) => !ids.has(c.id)).every((c) => c.altitud <= llindar)).toBe(true);
		// Els tresmils en són el començament
		const tresmils = cimsDelLlistat('tresmils');
		expect(cims.slice(0, tresmils.length)).toEqual(tresmils);
	});

	it('id desconegut → RangeError; el resultat és una còpia', () => {
		expect(() => cimsDelLlistat('cims-facils' as LlistatId)).toThrow(RangeError);
		expect(() => cimsDelLlistat('toString' as LlistatId)).toThrow(RangeError);
		const a = cimsDelLlistat('tresmils');
		a.pop();
		expect(cimsDelLlistat('tresmils')).toHaveLength(a.length + 1);
	});
});
