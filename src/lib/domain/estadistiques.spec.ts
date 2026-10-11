import { describe, expect, it } from 'vitest';
import {
	MIN_ASCENSIONS_CIM_MES_FET,
	REPTE_CENT_CIMS,
	REPTE_INFANTIL,
	calcularEstadistiques,
	cimMesFet,
	cimMesLlunya,
	distanciaKm,
	millorAny,
	progresComarques,
	rankingCims,
	ratxaMesos,
	resumCarnet,
	type Ascensio,
	type Cim,
	type DataISO,
	type OpcionsEstadistiques
} from './index';

// ---------------------------------------------------------------------------
// Utilitats
// ---------------------------------------------------------------------------

const AVUI = '2026-09-27';
const OP: OpcionsEstadistiques = { avui: AVUI };

function cim(id: number, over: Partial<Cim> = {}): Cim {
	return {
		id,
		slug: `cim-${id}`,
		nom: `Cim ${id}`,
		nom_amb_article: `el Cim ${id}`,
		nom_amb_de: `del Cim ${id}`,
		altitud: 1000 + id,
		comarca: `comarca-${id % 5}`,
		zona: 'catalunya',
		essencial: false,
		lat: 42,
		lon: 1.5,
		restriccions: [],
		...over
	};
}

/** 1..150 essencials, 151..600 no essencials; 5 comarques de 120 cims. */
const CATALEG: Cim[] = Array.from({ length: 600 }, (_, i) =>
	cim(i + 1, { essencial: i + 1 <= 150 })
);

function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

let seq = 0;
function asc(cimId: number, data: DataISO, over: Partial<Ascensio> = {}): Ascensio {
	seq++;
	return {
		id: `a-${String(seq).padStart(6, '0')}`,
		cimId,
		data,
		metode: 'a-peu',
		nota: null,
		companys: [],
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		...over
	};
}

const ids = (n: number, desDe = 1) => Array.from({ length: n }, (_, i) => desDe + i);
const ascs = (cims: number[], inici: DataISO, pas = 1) =>
	cims.map((id, i) => asc(id, sumarDies(inici, i * pas)));

// ---------------------------------------------------------------------------
// Sense dades
// ---------------------------------------------------------------------------

describe('sense ascensions', () => {
	it('tot a zero o null, sense dividir per zero', () => {
		const e = calcularEstadistiques([], CATALEG, OP);
		expect(e.totals).toEqual({
			ascensions: 0,
			cimsDiferents: 0,
			repeticions: 0,
			foraRepte: 0,
			perMetode: { 'a-peu': 0, btt: 0, esqui: 0, raquetes: 0 }
		});
		expect(e.rankingCims).toEqual([]);
		expect(e.cimMesFet).toBeNull();
		expect(e.cimMesLlunya).toBeNull();
		expect(e.cimMesAlt).toBeNull();
		expect(e.primeraAscensio).toBeNull();
		expect(e.ultimaAscensio).toBeNull();
		expect(e.ultimCimNou).toBeNull();
		expect(e.altitudAcumulada).toBe(0);
		expect(e.altitudAcumuladaAscensions).toBe(0);
		expect(e.perAny).toEqual([]);
		expect(e.millorAny).toBeNull();
		expect(e.ratxa).toEqual({
			actual: { mesos: 0, inici: null, fi: null },
			maxima: { mesos: 0, inici: null, fi: null },
			mesActualFet: false
		});
		expect(e.percentatges.cataleg).toEqual({ fets: 0, total: 600, fraccio: 0 });
		expect(e.percentatges.essencials).toEqual({ fets: 0, total: 150, fraccio: 0 });
		expect(e.percentatges.comarquesAmbCims).toEqual({ fets: 0, total: 5, fraccio: 0 });
		expect(e.percentatges.comarquesCompletes).toBe(0);
	});

	it('amb un catàleg buit tampoc no peta', () => {
		const e = calcularEstadistiques([asc(1, '2026-01-01')], [], OP);
		expect(e.totals).toMatchObject({ ascensions: 0, foraRepte: 1 });
		expect(e.percentatges.cataleg).toEqual({ fets: 0, total: 0, fraccio: 0 });
	});

	it('avui invàlid és un error de programació', () => {
		expect(() => calcularEstadistiques([], CATALEG, { avui: '27/09/2026' })).toThrow(RangeError);
		expect(() => ratxaMesos([], 'demà')).toThrow(RangeError);
	});
});

// ---------------------------------------------------------------------------
// Què compta
// ---------------------------------------------------------------------------

describe('quines ascensions compten', () => {
	const historial = [
		asc(1, '2024-05-10'),
		asc(1, '2025-06-01', { metode: 'btt' }), // repetició
		asc(2, '2025-07-01', { metode: 'esqui' }),
		asc(200, '2025-08-01'), // no essencial posterior al 2019: "en espera" al carnet, però compta aquí
		asc(3, '2005-01-01'), // abans de l'inici del repte → fora
		asc(4, '2027-01-01'), // futura → fora
		asc(5, '2025-01-01', { metode: 'cotxe' as never }), // mètode no admès → fora
		asc(9999, '2025-01-01'), // cim que no és al catàleg → fora
		asc(6, '2025-02-02', { deletedAt: '2025-02-03T00:00:00.000Z' }) // làpida: ni tan sols "fora"
	];
	const e = calcularEstadistiques(historial, CATALEG, OP);

	it('només les vàlides; les "fora del repte" es compten a part i no entren enlloc', () => {
		expect(e.totals).toEqual({
			ascensions: 4,
			cimsDiferents: 3,
			repeticions: 1,
			foraRepte: 4,
			perMetode: { 'a-peu': 2, btt: 1, esqui: 1, raquetes: 0 }
		});
		expect(e.rankingCims.map((r) => r.cim.id).sort((a, b) => a - b)).toEqual([1, 2, 200]);
		expect(e.primeraAscensio?.data).toBe('2024-05-10');
		expect(e.perAny.map((a) => a.any)).toEqual([2024, 2025]);
	});

	it('les no essencials "en espera" compten per a l’historial però no per al repte', () => {
		expect(e.percentatges.cataleg.fets).toBe(3);
		expect(e.percentatges.essencials).toMatchObject({ fets: 2, total: 150 });
		const cent = e.percentatges.reptes.find((r) => r.id === REPTE_CENT_CIMS)!;
		expect(cent.fets).toBe(2);
	});

	it('altitud acumulada: cims diferents (i, a part, per ascensions)', () => {
		expect(e.altitudAcumulada).toBe(1001 + 1002 + 1200);
		expect(e.altitudAcumuladaAscensions).toBe(1001 * 2 + 1002 + 1200);
	});

	it('accepta el catàleg com a mapa i conserva el tipus de cim', () => {
		const mapa = new Map(CATALEG.map((c) => [c.id, { ...c, extra: `x${c.id}` }]));
		const m = calcularEstadistiques(historial, mapa, OP);
		expect(m.totals).toEqual(e.totals);
		expect(m.cimMesAlt?.cim.extra).toBe('x200');
	});
});

// ---------------------------------------------------------------------------
// Rànquing i "el cim que més has fet"
// ---------------------------------------------------------------------------

describe('rankingCims i cimMesFet', () => {
	it('compta ascensions per cim (dues el mateix dia són dues)', () => {
		const r = rankingCims(
			[asc(7, '2024-01-01'), asc(7, '2024-01-01'), asc(7, '2025-03-03'), asc(8, '2025-01-01')],
			CATALEG,
			OP
		);
		expect(r).toEqual([
			{ cim: CATALEG[6], ascensions: 3, primera: '2024-01-01', ultima: '2025-03-03' },
			{ cim: CATALEG[7], ascensions: 1, primera: '2025-01-01', ultima: '2025-01-01' }
		]);
		expect(cimMesFet(r)?.cim.id).toBe(7);
	});

	it('desempat: més recent (última ascensió), després la primera més antiga, després id', () => {
		const r = rankingCims(
			[
				// 10 i 11: dues ascensions cadascun; l'11 s'ha fet més recentment.
				asc(10, '2020-01-01'),
				asc(10, '2024-01-01'),
				asc(11, '2021-01-01'),
				asc(11, '2025-01-01'),
				// 12 i 13: mateixa última; el 13 es va fer abans per primera vegada.
				asc(12, '2019-06-01'),
				asc(12, '2023-01-01'),
				asc(13, '2018-06-01'),
				asc(13, '2023-01-01'),
				// 15 i 14: idèntics → per id.
				asc(15, '2017-01-01'),
				asc(15, '2022-01-01'),
				asc(14, '2017-01-01'),
				asc(14, '2022-01-01')
			],
			CATALEG,
			OP
		);
		expect(r.map((x) => x.cim.id)).toEqual([11, 10, 13, 12, 14, 15]);
	});

	it('el resultat no depèn de l’ordre d’entrada', () => {
		const llista = [
			asc(10, '2020-01-01'),
			asc(10, '2024-01-01'),
			asc(11, '2021-01-01'),
			asc(11, '2025-01-01'),
			asc(12, '2025-01-01')
		];
		const a = calcularEstadistiques(llista, CATALEG, OP);
		const b = calcularEstadistiques([...llista].reverse(), CATALEG, OP);
		expect(b).toEqual(a);
	});

	it(`sense cap cim repetit (menys de ${MIN_ASCENSIONS_CIM_MES_FET} ascensions) no hi ha "cim que més has fet"`, () => {
		const e = calcularEstadistiques(ascs(ids(5), '2025-01-01'), CATALEG, OP);
		expect(e.rankingCims).toHaveLength(5);
		expect(e.cimMesFet).toBeNull();
		const ambRepeticio = calcularEstadistiques(
			[...ascs(ids(5), '2025-01-01'), asc(3, '2025-06-01')],
			CATALEG,
			OP
		);
		expect(ambRepeticio.cimMesFet).toMatchObject({ ascensions: 2, ultima: '2025-06-01' });
		expect(ambRepeticio.cimMesFet?.cim.id).toBe(3);
	});
});

// ---------------------------------------------------------------------------
// "El cim més llunyà"
// ---------------------------------------------------------------------------

describe('cimMesLlunya', () => {
	const BARCELONA = { lat: 41.3827, lon: 2.177 };
	const cims = [
		cim(1, { lat: 41.64, lon: 2.02, altitud: 1104 }), // a prop
		cim(2, { lat: 42.67, lon: 1.4, altitud: 3143 }), // Pirineu
		cim(3, { lat: 40.8, lon: 0.34, altitud: 1441 }), // Ports
		cim(4, { lat: null, lon: null }) // sense coordenades
	];

	it('el cim fet més lluny de l’origen, amb la distància de gran cercle', () => {
		const e = calcularEstadistiques(
			[asc(1, '2025-01-01'), asc(2, '2025-02-01'), asc(4, '2025-03-01')],
			cims,
			{ ...OP, origen: BARCELONA }
		);
		expect(e.cimMesLlunya?.cim.id).toBe(2);
		expect(e.cimMesLlunya?.distanciaKm).toBeCloseTo(
			distanciaKm(BARCELONA, { lat: 42.67, lon: 1.4 }),
			9
		);
		expect(e.cimMesLlunya!.distanciaKm).toBeGreaterThan(140);
		expect(e.cimMesLlunya!.distanciaKm).toBeLessThan(170);
	});

	it('només compten els cims fets (un de pendent més llunyà no hi surt)', () => {
		const e = calcularEstadistiques([asc(1, '2025-01-01')], cims, { ...OP, origen: BARCELONA });
		expect(e.cimMesLlunya?.cim.id).toBe(1);
	});

	it('sense origen, amb origen invàlid o sense cims amb coordenades → null', () => {
		const fets = [asc(1, '2025-01-01'), asc(2, '2025-02-01')];
		expect(calcularEstadistiques(fets, cims, OP).cimMesLlunya).toBeNull();
		expect(calcularEstadistiques(fets, cims, { ...OP, origen: null }).cimMesLlunya).toBeNull();
		expect(
			calcularEstadistiques(fets, cims, { ...OP, origen: { lat: NaN, lon: 2 } }).cimMesLlunya
		).toBeNull();
		expect(
			calcularEstadistiques(fets, cims, { ...OP, origen: { lat: 95, lon: 2 } }).cimMesLlunya
		).toBeNull();
		expect(
			calcularEstadistiques([asc(4, '2025-01-01')], cims, { ...OP, origen: BARCELONA }).cimMesLlunya
		).toBeNull();
	});

	it('empat de distància: el més alt; després, l’id més baix', () => {
		const origen = { lat: 42, lon: 1 };
		const iguals = [
			cim(21, { lat: 42.5, lon: 1, altitud: 2000 }),
			cim(22, { lat: 42.5, lon: 1, altitud: 2500 }),
			cim(23, { lat: 42.5, lon: 1, altitud: 2500 })
		];
		expect(cimMesLlunya(iguals, origen)?.cim.id).toBe(22);
		expect(cimMesLlunya([...iguals].reverse(), origen)?.cim.id).toBe(22);
	});
});

// ---------------------------------------------------------------------------
// Percentatges
// ---------------------------------------------------------------------------

describe('percentatges', () => {
	it('catàleg, essencials i comarques (el mateix que progresComarques)', () => {
		// 30 essencials (1..30) i 10 no essencials (151..160) fetes abans del 2019.
		const historial = [...ascs(ids(30), '2018-01-01'), ...ascs(ids(10, 151), '2018-06-01')];
		const e = calcularEstadistiques(historial, CATALEG, OP);
		expect(e.percentatges.cataleg).toEqual({ fets: 40, total: 600, fraccio: 40 / 600 });
		expect(e.percentatges.essencials).toEqual({ fets: 30, total: 150, fraccio: 0.2 });
		expect(e.percentatges.comarques).toEqual(progresComarques(historial, CATALEG, OP));
		expect(e.percentatges.comarques.reduce((s, c) => s + c.fets, 0)).toBe(40);
		expect(e.percentatges.comarquesAmbCims).toEqual({ fets: 5, total: 5, fraccio: 1 });
		expect(e.percentatges.comarquesCompletes).toBe(0);
	});

	it('comarques completes i comarques sense cap cim', () => {
		const petit = [
			cim(1, { comarca: 'a', essencial: true }),
			cim(2, { comarca: 'a' }),
			cim(3, { comarca: 'b' }),
			cim(4, { comarca: 'c' })
		];
		const e = calcularEstadistiques(
			[asc(1, '2025-01-01'), asc(2, '2025-01-02'), asc(2, '2025-01-03')],
			petit,
			OP
		);
		expect(e.percentatges.comarquesAmbCims).toEqual({ fets: 1, total: 3, fraccio: 1 / 3 });
		expect(e.percentatges.comarquesCompletes).toBe(1);
		expect(e.percentatges.cataleg).toEqual({ fets: 2, total: 4, fraccio: 0.5 });
		expect(e.percentatges.essencials).toEqual({ fets: 1, total: 1, fraccio: 1 });
	});

	describe('repte 100 Cims: el mateix marcador que el carnet', () => {
		const casos: [string, Ascensio[]][] = [
			['començant', ascs(ids(12), '2020-01-01')],
			[
				'amb no essencials en espera',
				[...ascs(ids(40), '2020-01-01'), ...ascs(ids(20, 151), '2021-01-01')]
			],
			['amb el 100 fet', ascs(ids(100), '2020-01-01')],
			[
				'amb el 100 i 37 més',
				[...ascs(ids(110), '2020-01-01'), ...ascs(ids(27, 151), '2021-01-01')]
			],
			['amb repeticions', [...ascs(ids(100), '2020-01-01'), ...ascs(ids(100), '2021-01-01')]],
			['5×100 i escaig', [...ascs(ids(150), '2010-01-01'), ...ascs(ids(380, 151), '2011-01-01')]]
		];
		for (const [nom, historial] of casos) {
			it(nom, () => {
				const cent = calcularEstadistiques(historial, CATALEG, OP).percentatges.reptes[0];
				const resum = resumCarnet(historial, CATALEG, OP);
				expect(cent.id).toBe(REPTE_CENT_CIMS);
				expect(cent.fets).toBe(resum.total);
				expect(cent.objectiu).toBe(resum.objectiuActual);
				expect(cent.nivell).toBe(resum.nivell);
				expect(cent.nivellMaxim).toBe(5);
				expect(cent.fraccio).toBe(Math.min(1, resum.total / resum.objectiuActual));
				expect(cent.assoliments).toHaveLength(resum.nivell);
			});
		}

		it('exemples concrets: 12/100, 137/200 i el carnet ple', () => {
			const de = (h: Ascensio[]) => calcularEstadistiques(h, CATALEG, OP).percentatges.reptes[0];
			expect(de(casos[0][1])).toMatchObject({ fets: 12, objectiu: 100, fraccio: 0.12, nivell: 0 });
			expect(de(casos[1][1])).toMatchObject({ fets: 40, objectiu: 100, nivell: 0 });
			const c137 = de(casos[3][1]);
			expect(c137).toMatchObject({ fets: 137, objectiu: 200, fraccio: 0.685, nivell: 1 });
			expect(c137.assoliments).toEqual([{ nivell: 1, data: '2020-04-09' }]);
			// Les repeticions no sumen per als nivells (§3.3.1), encara que es demani.
			expect(
				calcularEstadistiques(casos[4][1], CATALEG, { ...OP, comptarRepeticions: true })
					.percentatges.reptes[0]
			).toMatchObject({ fets: 100, objectiu: 200, nivell: 1 });
			expect(de(casos[5][1])).toMatchObject({ fets: 530, objectiu: 500, fraccio: 1, nivell: 5 });
		});
	});

	it('repte infantil: 50 cims diferents des del 2026-07-01 (sense filtrar per edat)', () => {
		const abans = ascs(ids(30), '2025-01-01');
		const despres = ascs(ids(20, 301), '2026-07-01');
		const inf = (h: Ascensio[], o: OpcionsEstadistiques = OP) =>
			calcularEstadistiques(h, CATALEG, o).percentatges.reptes[1];
		expect(inf([...abans, ...despres])).toEqual({
			id: REPTE_INFANTIL,
			fets: 20,
			objectiu: 50,
			fraccio: 0.4,
			nivell: 0,
			nivellMaxim: 1,
			assoliments: []
		});
		// Amb la data d'inici oberta (opció de `OpcionsRepte`), compten totes.
		expect(inf([...abans, ...despres], { ...OP, dataIniciInfantil: null })).toMatchObject({
			fets: 50,
			fraccio: 1,
			nivell: 1,
			assoliments: [{ nivell: 1, data: '2026-07-20' }]
		});
	});

	it('els reptes de R1 són el 100 Cims i l’infantil, en aquest ordre', () => {
		const e = calcularEstadistiques([], CATALEG, OP);
		expect(e.percentatges.reptes.map((r) => r.id)).toEqual([REPTE_CENT_CIMS, REPTE_INFANTIL]);
	});
});

// ---------------------------------------------------------------------------
// Fites: cim més alt, primera i última ascensió, últim cim nou
// ---------------------------------------------------------------------------

describe('fites', () => {
	it('cim més alt (amb la seva primera ascensió), primera i última ascensió, últim cim nou', () => {
		const a1 = asc(10, '2019-05-01');
		const a2 = asc(300, '2021-08-15'); // el més alt (1300 m)
		const a3 = asc(300, '2023-08-15'); // repetició del més alt
		const a4 = asc(20, '2022-03-03'); // l'últim cim nou
		const a5 = asc(10, '2025-09-09'); // l'última ascensió és una repetició
		const e = calcularEstadistiques([a5, a3, a1, a4, a2], CATALEG, OP);
		expect(e.cimMesAlt).toEqual({ cim: CATALEG[299], data: '2021-08-15', ascensioId: a2.id });
		expect(e.primeraAscensio).toEqual({ cim: CATALEG[9], data: '2019-05-01', ascensioId: a1.id });
		expect(e.ultimaAscensio).toEqual({ cim: CATALEG[9], data: '2025-09-09', ascensioId: a5.id });
		expect(e.ultimCimNou).toEqual({ cim: CATALEG[19], data: '2022-03-03', ascensioId: a4.id });
	});

	it('el mateix dia: desempat per createdAt i després per id', () => {
		const mati = asc(1, '2025-06-01', { createdAt: '2025-06-01T09:00:00.000Z' });
		const tarda = asc(2, '2025-06-01', { createdAt: '2025-06-01T17:00:00.000Z' });
		const e = calcularEstadistiques([tarda, mati], CATALEG, OP);
		expect(e.primeraAscensio?.ascensioId).toBe(mati.id);
		expect(e.ultimaAscensio?.ascensioId).toBe(tarda.id);
		expect(e.ultimCimNou?.ascensioId).toBe(tarda.id);
	});

	it('cim més alt amb empat d’altitud: el que es va fer abans; després, per id', () => {
		const iguals = [
			cim(1, { altitud: 2000 }),
			cim(2, { altitud: 2000 }),
			cim(3, { altitud: 2000 })
		];
		const e = calcularEstadistiques(
			[asc(1, '2025-06-01'), asc(2, '2024-06-01'), asc(3, '2025-01-01')],
			iguals,
			OP
		);
		expect(e.cimMesAlt?.cim.id).toBe(2);
		const mateixInstant = { createdAt: '2025-01-01T00:00:00.000Z' };
		const f = calcularEstadistiques(
			[
				asc(3, '2025-06-01', { id: 'z', ...mateixInstant }),
				asc(1, '2025-06-01', { id: 'z', ...mateixInstant })
			],
			iguals,
			OP
		);
		expect(f.cimMesAlt?.cim.id).toBe(1);
	});
});

// ---------------------------------------------------------------------------
// Anys i ratxes
// ---------------------------------------------------------------------------

describe('perAny i millorAny', () => {
	it('ascensions i cims nous per any (la repetició no és un cim nou)', () => {
		const e = calcularEstadistiques(
			[
				asc(1, '2023-01-01'),
				asc(2, '2023-02-01'),
				asc(3, '2024-01-01'),
				asc(1, '2024-05-01'),
				asc(2, '2024-06-01'),
				asc(1, '2025-05-01')
			],
			CATALEG,
			OP
		);
		expect(e.perAny).toEqual([
			{ any: 2023, ascensions: 2, cimsNous: 2 },
			{ any: 2024, ascensions: 3, cimsNous: 1 },
			{ any: 2025, ascensions: 1, cimsNous: 0 }
		]);
		// El millor any és el de més cims nous, no el de més ascensions.
		expect(e.millorAny).toEqual({ any: 2023, ascensions: 2, cimsNous: 2 });
	});

	it('desempat: més ascensions; després, l’any més recent', () => {
		expect(
			millorAny([
				{ any: 2020, ascensions: 5, cimsNous: 3 },
				{ any: 2021, ascensions: 7, cimsNous: 3 },
				{ any: 2022, ascensions: 9, cimsNous: 2 }
			])?.any
		).toBe(2021);
		expect(
			millorAny([
				{ any: 2020, ascensions: 4, cimsNous: 3 },
				{ any: 2021, ascensions: 4, cimsNous: 3 }
			])?.any
		).toBe(2021);
		expect(millorAny([])).toBeNull();
	});
});

describe('ratxaMesos', () => {
	it('mesos seguits, travessant el canvi d’any; la màxima i l’actual', () => {
		const r = ratxaMesos(
			['2024-11-03', '2024-12-25', '2025-01-01', '2025-01-30', '2025-02-14', '2025-06-01'],
			'2025-06-15'
		);
		expect(r.maxima).toEqual({ mesos: 4, inici: '2024-11', fi: '2025-02' });
		expect(r.actual).toEqual({ mesos: 1, inici: '2025-06', fi: '2025-06' });
		expect(r.mesActualFet).toBe(true);
	});

	it('si aquest mes encara no hi ha cap ascensió, la ratxa segueix viva fins al mes anterior', () => {
		const dates = ['2025-03-10', '2025-04-10', '2025-05-10'];
		expect(ratxaMesos(dates, '2025-06-02')).toEqual({
			actual: { mesos: 3, inici: '2025-03', fi: '2025-05' },
			maxima: { mesos: 3, inici: '2025-03', fi: '2025-05' },
			mesActualFet: false
		});
		// Un mes sencer sense cap ascensió la trenca.
		expect(ratxaMesos(dates, '2025-07-01').actual).toEqual({ mesos: 0, inici: null, fi: null });
		expect(ratxaMesos(dates, '2025-07-01').maxima.mesos).toBe(3);
	});

	it('gener: el mes anterior és el desembre de l’any passat', () => {
		expect(ratxaMesos(['2024-11-20', '2024-12-20'], '2025-01-05').actual).toEqual({
			mesos: 2,
			inici: '2024-11',
			fi: '2024-12'
		});
	});

	it('diverses ascensions el mateix mes compten un sol mes; empat de màxima → la més recent', () => {
		const r = ratxaMesos(
			['2023-01-01', '2023-01-15', '2023-02-01', '2024-05-01', '2024-06-01'],
			'2026-01-01'
		);
		expect(r.maxima).toEqual({ mesos: 2, inici: '2024-05', fi: '2024-06' });
		expect(r.actual.mesos).toBe(0);
	});

	it('dins de calcularEstadistiques: les repeticions també mantenen la ratxa', () => {
		const e = calcularEstadistiques(
			[asc(1, '2026-07-04'), asc(1, '2026-08-15'), asc(1, '2026-09-01'), asc(2, '2025-01-01')],
			CATALEG,
			OP
		);
		expect(e.ratxa.actual).toEqual({ mesos: 3, inici: '2026-07', fi: '2026-09' });
		expect(e.ratxa.maxima.mesos).toBe(3);
		expect(e.ratxa.mesActualFet).toBe(true);
	});
});
