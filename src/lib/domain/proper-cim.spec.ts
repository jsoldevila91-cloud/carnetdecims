import { describe, expect, it } from 'vitest';
import {
	DISTANCIA_ZERO_KM,
	N_PROPER_CIM,
	PUNTS,
	ajustarAmbMeteo,
	avaluarReptes,
	dificultatHabitual,
	estatMeteo,
	motiusEpoca,
	properCim,
	puntuarPendents,
	type Cim,
	type DiaMeteoMinim,
	type NivellDificultat,
	type RestriccioAcces
} from './index';

const AVUI = '2026-10-17';

function cim(id: number, over: Partial<Cim> = {}): Cim {
	return {
		id,
		slug: `cim-${id}`,
		nom: `Cim ${id}`,
		nom_amb_article: `el Cim ${id}`,
		nom_amb_de: `del Cim ${id}`,
		altitud: 2100, // a l'octubre (AVUI), sense motius d'època
		comarca: 'c',
		zona: 'catalunya',
		essencial: true,
		lat: 41.5,
		lon: 2,
		restriccions: [],
		...over
	};
}

const asc = (cimId: number, data = '2025-01-01', over = {}) => ({
	cimId,
	data,
	metode: 'a-peu' as const,
	...over
});

const ORIGEN = { lat: 41.5, lon: 2 };
const RESTRICCIO: RestriccioAcces = {
	tipus: 'fauna',
	periodeIniciMmdd: '10-01',
	periodeFiMmdd: '10-31',
	dataInici: null,
	dataFi: null,
	fontUrl: 'https://example.org'
};

describe('properCim', () => {
	it('catàleg buit o tot fet → cap recomanació', () => {
		expect(properCim({ ascensions: [], cataleg: [], avui: AVUI }).recomanacions).toEqual([]);
		const r = properCim({ ascensions: [asc(1)], cataleg: [cim(1)], avui: AVUI });
		expect(r.recomanacions).toEqual([]);
		expect(r.pendents).toBe(0);
	});

	it('només pendents; esborrades, futures i fora de catàleg no compten com a fetes', () => {
		const cat = [1, 2, 3, 4, 5].map((i) => cim(i));
		const r = properCim({
			ascensions: [asc(1), asc(2, '2025-01-01', { deletedAt: 'x' }), asc(3, '2026-12-01'), asc(99)],
			cataleg: cat,
			avui: AVUI,
			n: 10
		});
		expect(r.recomanacions.map((x) => x.cim.id)).toEqual([2, 3, 4, 5]);
		expect(r.pendents).toBe(4);
	});

	it('per defecte en dona 3; sense origen ho indica i desempata per id', () => {
		const cat = [5, 4, 3, 2, 1].map((i) => cim(i));
		const r = properCim({ ascensions: [], cataleg: cat, avui: AVUI });
		expect(N_PROPER_CIM).toBe(3);
		expect(r.senseOrigen).toBe(true);
		expect(r.recomanacions.map((x) => x.cim.id)).toEqual([1, 2, 3]);
		expect(r.recomanacions[0]).toMatchObject({
			distanciaKm: null,
			puntuacio: 0,
			motius: [{ clau: 'pendent', punts: 0 }]
		});
	});

	it('distància: més a prop puntua més; 0 punts a partir de DISTANCIA_ZERO_KM', () => {
		const cat = [
			cim(1, { lat: 42.5 }), // ~111 km
			cim(2, { lat: 41.6 }), // ~11 km
			cim(3, { lat: 43.5 }), // ~222 km
			cim(4, { lat: null, lon: null })
		];
		const r = properCim({ ascensions: [], cataleg: cat, avui: AVUI, origen: ORIGEN, n: 4 });
		expect(r.senseOrigen).toBe(false);
		expect(r.recomanacions.map((x) => x.cim.id)).toEqual([2, 1, 3, 4]);
		const m2 = r.recomanacions[0].motius[0];
		expect(m2).toMatchObject({ clau: 'distancia', km: 11 });
		expect(m2.punts).toBe(Math.round(PUNTS.distanciaMax * (1 - 11.1 / DISTANCIA_ZERO_KM)));
		expect(r.recomanacions[2].motius[0]).toMatchObject({ clau: 'distancia', punts: 0 });
		expect(r.recomanacions[3].distanciaKm).toBeNull();
	});

	it('dificultat habitual: mediana dels fets; premia el mateix nivell i penalitza > +1', () => {
		const cat = [1, 2, 3, 10, 11, 12, 13].map((i) => cim(i));
		const dif = new Map<number, NivellDificultat>([
			[1, 2],
			[2, 2],
			[3, 3],
			[10, 2],
			[11, 3],
			[12, 4],
			[13, 1]
		]);
		const r = properCim({
			ascensions: [asc(1), asc(2), asc(3)],
			cataleg: cat,
			avui: AVUI,
			dificultats: dif,
			n: 4
		});
		expect(r.dificultatHabitual).toBe(2);
		expect(r.recomanacions.map((x) => x.cim.id)).toEqual([10, 11, 13, 12]);
		expect(r.recomanacions[0].motius).toEqual([
			{ clau: 'dificultat-habitual', punts: PUNTS.dificultatIgual, nivell: 2 }
		]);
		expect(r.recomanacions[3].motius[0]).toMatchObject({ clau: 'dificultat-superior' });
	});

	it('dificultatHabitual: menys de 3 cims → null; mediana baixa', () => {
		expect(dificultatHabitual([1, 2])).toBeNull();
		expect(dificultatHabitual([4, 1, 2, 3])).toBe(2);
		expect(dificultatHabitual([3, 3, 1])).toBe(3);
	});

	it('restricció activa avui o en un dia de la sortida → fora', () => {
		const cat = [cim(1, { restriccions: [RESTRICCIO] }), cim(2)];
		const r = properCim({ ascensions: [], cataleg: cat, avui: AVUI });
		expect(r.recomanacions.map((x) => x.cim.id)).toEqual([2]);
		expect(r.exclosesPerRestriccio).toBe(1);
		const nov = properCim({
			ascensions: [],
			cataleg: cat,
			avui: '2026-09-29',
			diesSortida: ['2026-10-03', '2026-10-04']
		});
		expect(nov.exclosesPerRestriccio).toBe(1);
		const lliure = properCim({ ascensions: [], cataleg: cat, avui: '2026-09-29' });
		expect(lliure.exclosesPerRestriccio).toBe(0);
	});

	it('època: el mes de la sortida (no el d’avui) decideix', () => {
		const cat = [cim(1, { altitud: 2900 }), cim(2, { altitud: 900 })];
		const hivern = properCim({ ascensions: [], cataleg: cat, avui: '2026-01-10' });
		expect(hivern.recomanacions.map((x) => x.cim.id)).toEqual([2, 1]);
		expect(hivern.recomanacions[1].motius[0].clau).toBe('neu-probable');
		const estiu = properCim({
			ascensions: [],
			cataleg: cat,
			avui: '2026-05-30',
			diesSortida: ['2026-07-04']
		});
		expect(estiu.recomanacions.map((x) => x.cim.id)).toEqual([1, 2]);
	});

	it('motiusEpoca a les vores', () => {
		const c = (alt: number, mes: number) => motiusEpoca(alt, mes).map((m) => m.clau);
		expect(c(2000, 4)).toEqual(['neu-probable']);
		expect(c(1999, 4)).toEqual(['bona-epoca']);
		expect(c(2500, 5)).toEqual(['neu-possible']);
		expect(c(2499, 11)).toEqual([]);
		expect(c(1999, 11)).toEqual(['bona-epoca']);
		expect(c(1500, 10)).toEqual(['bona-epoca']);
		expect(motiusEpoca(1500, 9)[0].punts).toBe(PUNTS.bonaEpocaMitjana);
		expect(c(1500, 7)).toEqual([]);
		expect(c(2000, 6)).toEqual(['bona-epoca']);
		expect(c(2000, 10)).toEqual([]);
		expect(c(799, 7)).toEqual(['calor']);
		expect(c(1199, 12)).toEqual(['hivern-baix']);
		expect(c(1200, 2)).toEqual([]);
	});

	it('bonus de repte a punt (falten ≤ 3) amb el repte que menys falta', () => {
		const cat = [
			cim(1, { slug: 'matagalls' }),
			cim(2, { slug: 'les-agudes' }),
			cim(3, { slug: 'tagamanent' }),
			cim(4)
		];
		const ascensions = [asc(1), asc(2)];
		const reptes = avaluarReptes(ascensions, cat, { avui: AVUI });
		const r = properCim({ ascensions, cataleg: cat, avui: AVUI, reptes });
		expect(r.recomanacions[0].cim.id).toBe(3);
		expect(r.recomanacions[0].motius).toContainEqual({
			clau: 'repte-a-punt',
			punts: PUNTS.repteAPunt,
			repteId: 'massis-montseny',
			falten: 1
		});
	});

	it('QA: 3 estacions en un any tancat no donen "repte a punt"; el massís sí', () => {
		const cat = [
			cim(1, { slug: 'matagalls' }),
			cim(2, { slug: 'les-agudes' }),
			cim(3, { slug: 'tagamanent' }),
			cim(4, { slug: 'turo-de-montsoriu' }),
			cim(5)
		];
		const avui = '2026-10-16';
		const ascensions = [asc(1, '2025-01-10'), asc(2, '2025-04-10'), asc(3, '2025-07-10')];
		const reptes = avaluarReptes(ascensions, cat, { avui });
		const est = reptes.find((r) => r.id === 'les-4-estacions')!;
		expect(est.fets).toBe(3);
		expect(est.aPunt).toBeNull(); // 2026: falta la primavera, que ja no es pot fer
		const r = properCim({ ascensions, cataleg: cat, avui, reptes, n: 5 });
		const ambBonus = r.recomanacions.filter((x) => x.motius.some((m) => m.clau === 'repte-a-punt'));
		expect(ambBonus.map((x) => x.cim.id)).toEqual([4]);
		expect(ambBonus[0].motius).toContainEqual({
			clau: 'repte-a-punt',
			punts: PUNTS.repteAPunt,
			repteId: 'massis-montseny',
			falten: 1
		});
	});

	it('Les 4 estacions a punt amb l’any en curs i estacions encara possibles', () => {
		const cat = [cim(1), cim(2), cim(3)];
		const ascensions = [asc(1, '2026-01-10'), asc(2, '2026-04-10'), asc(3, '2026-07-10')];
		const reptes = avaluarReptes(ascensions, cat, { avui: AVUI });
		expect(reptes.find((r) => r.id === 'les-4-estacions')!.aPunt).toEqual({
			falten: 1,
			fraccio: 0.75
		});
	});

	it('empat de falten: guanya la fracció més alta, no l’ordre de la llista', () => {
		const base = {
			progres: 0,
			fets: 0,
			nivell: 0,
			nivellMaxim: 1,
			assoliments: [],
			completat: false,
			dataCompletat: null,
			pendents: { tipus: 'cims' as const, cimIds: [] },
			cimsQueSumen: [1]
		};
		const reptes = [
			{ ...base, id: 'a', fets: 2, objectiu: 3, fraccio: 2 / 3 },
			{ ...base, id: 'b', fets: 9, objectiu: 10, fraccio: 0.9 },
			{ ...base, id: 'c', fets: 1, objectiu: 2, fraccio: 0.5, aPunt: null }
		];
		const r = properCim({ ascensions: [], cataleg: [cim(1)], avui: AVUI, reptes });
		expect(r.recomanacions[0].motius).toContainEqual(
			expect.objectContaining({ clau: 'repte-a-punt', repteId: 'b', falten: 1 })
		);
	});

	it('cada recomanació té almenys un motiu', () => {
		const r = properCim({
			ascensions: [],
			cataleg: [cim(1), cim(2, { altitud: 1200 })],
			avui: AVUI
		});
		for (const x of r.recomanacions) expect(x.motius.length).toBeGreaterThan(0);
	});

	it('avui o dia de sortida invàlids llancen', () => {
		expect(() => properCim({ ascensions: [], cataleg: [], avui: '2026-02-30' })).toThrow(
			RangeError
		);
		expect(() =>
			puntuarPendents({ ascensions: [], cataleg: [], avui: AVUI, diesSortida: ['x'] })
		).toThrow(RangeError);
	});
});

describe('meteo', () => {
	const dia = (data: string, over: Partial<DiaMeteoMinim> = {}): DiaMeteoMinim => ({
		data,
		precipitacio: 0,
		probPrecipitacio: 10,
		ratxaMax: 20,
		codi: 1,
		...over
	});
	const SORTIDA = ['2026-10-17', '2026-10-18'];

	it('estatMeteo: el pitjor dia de la sortida', () => {
		expect(estatMeteo([dia('2026-10-17'), dia('2026-10-18')], SORTIDA)).toBe('bona');
		expect(
			estatMeteo([dia('2026-10-17'), dia('2026-10-18', { probPrecipitacio: 60 })], SORTIDA)
		).toBe('variable');
		expect(estatMeteo([dia('2026-10-17', { codi: 95 })], SORTIDA)).toBe('dolenta');
		expect(estatMeteo([dia('2026-10-17', { codi: 73 })], SORTIDA)).toBe('dolenta');
		expect(estatMeteo([dia('2026-10-17', { ratxaMax: 70 })], SORTIDA)).toBe('dolenta');
		expect(estatMeteo([dia('2026-10-17', { precipitacio: 1 })], SORTIDA)).toBe('variable');
		expect(estatMeteo([dia('2026-10-19', { codi: 95 })], SORTIDA)).toBeNull();
		expect(estatMeteo([], SORTIDA)).toBeNull();
	});

	it('ajustarAmbMeteo reordena i és idempotent', () => {
		const base = properCim({
			ascensions: [],
			cataleg: [cim(1), cim(2), cim(3)],
			avui: AVUI
		}).recomanacions;
		const meteo = new Map([
			[1, [dia('2026-10-17', { codi: 95 })]],
			[3, [dia('2026-10-17')]]
		]);
		const a = ajustarAmbMeteo(base, meteo, SORTIDA);
		expect(a.map((r) => r.cim.id)).toEqual([3, 2, 1]);
		expect(a[0].motius).toEqual([{ clau: 'meteo-bona', punts: PUNTS.meteoBona }]);
		expect(a[2].puntuacio).toBe(PUNTS.meteoDolenta);
		const b = ajustarAmbMeteo(a, meteo, SORTIDA, 2);
		expect(b.map((r) => r.cim.id)).toEqual([3, 2]);
		expect(b[0].motius).toHaveLength(1);
	});
});
