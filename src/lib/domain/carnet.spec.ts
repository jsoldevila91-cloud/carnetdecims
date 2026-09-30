import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	CASELLES_CARNET,
	calcularEstatRepte,
	essencialsPendentsOrdenades,
	paginesCarnet,
	progresComarques,
	resumCarnet,
	type Ascensio,
	type Carnet,
	type Cim,
	type DataISO,
	type OpcionsCarnet,
	type RestriccioAcces
} from './index';

// ---------------------------------------------------------------------------
// Utilitats
// ---------------------------------------------------------------------------

const AVUI = '2026-09-27';
const OP: OpcionsCarnet = { avui: AVUI };

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

/**
 * Catàleg sintètic més gran que el real (522) per provar > 500 segells:
 * 1..150 essencials, 151..600 no essencials.
 */
const CATALEG: Cim[] = Array.from({ length: 600 }, (_, i) =>
	cim(i + 1, { essencial: i + 1 <= 150 })
);
const ESS = (n: number, desDe = 1) => Array.from({ length: n }, (_, i) => desDe + i);
const NO_ESS = (n: number, desDe = 151) => Array.from({ length: n }, (_, i) => desDe + i);

function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function asc(cimId: number, data: DataISO, over: Partial<Ascensio> = {}): Ascensio {
	return {
		id: `a-${cimId}-${data}`,
		cimId,
		data,
		metode: 'a-peu',
		nota: null,
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		...over
	};
}

/** Una ascensió per cim; la i-èsima `inici + i*pas` dies. */
function ascs(ids: number[], inici: DataISO, pas = 1): Ascensio[] {
	return ids.map((id, i) => asc(id, sumarDies(inici, i * pas)));
}

const totsSegells = (c: Carnet) => c.pagines.flatMap((p) => p.segells);

/**
 * Invariants del carnet: posicions derivades de l'ordre, cims únics, pàgina I només amb
 * cims que compten per al 100, i coherència amb `calcularEstatRepte` (total = progrés).
 */
function comprovarCoherencia(ascensions: Ascensio[], opcions: OpcionsCarnet = OP) {
	const carnet = paginesCarnet(ascensions, CATALEG, opcions);
	const resum = resumCarnet(ascensions, CATALEG, opcions);
	const { avui = AVUI, ...o } = opcions;
	const estat = calcularEstatRepte(ascensions, CATALEG, avui, { ...o, comptarRepeticions: false });

	const segells = totsSegells(carnet);
	const foraCompten = carnet.fora.filter((s) => s.comptaPerRepte);
	const total = segells.length + foraCompten.length;
	const progres = estat.nivell.nivell === 0 ? estat.progres100.comptador : estat.nivell.comptador;
	expect(total).toBe(progres);
	expect(resum.total).toBe(progres);
	expect(resum.nivell).toBe(estat.nivell.nivell);

	segells.forEach((s, i) => {
		expect(s.ordre).toBe(i + 1);
		expect(s.pagina).toBe(Math.ceil(s.ordre / 100));
		expect(s.casella).toBe(((s.ordre - 1) % 100) + 1);
		expect(s.comptaPerRepte).toBe(true);
	});
	for (const s of carnet.enEspera) {
		expect(s.comptaPerRepte).toBe(false);
		expect(s.ordre).toBeGreaterThan(100);
		expect(s.pagina).toBe(Math.ceil(s.ordre / 100));
	}
	foraCompten.forEach((s, i) => expect(s.ordre).toBe(CASELLES_CARNET + i + 1));

	const ids = [...segells, ...carnet.enEspera, ...carnet.fora].map((s) => s.cimId);
	expect(new Set(ids).size).toBe(ids.length);
	expect(ids.length).toBe(estat.primeres.size);

	const tall = o.diaTallEsNormativaAntiga ? '2019-07-02' : '2019-07-01';
	for (const s of carnet.pagines[0].segells) expect(s.essencial || s.data < tall).toBe(true);

	carnet.pagines.forEach((p, k) => {
		expect(p.numero).toBe(k + 1);
		expect(p.completa).toBe(p.segells.length === 100);
		expect(p.dataCompletada).toBe(p.completa ? estat.nivell.assoliments[k].data : null);
	});
	return { carnet, resum, estat };
}

afterEach(() => {
	vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// paginesCarnet
// ---------------------------------------------------------------------------

describe('paginesCarnet', () => {
	it('0 ascensions: 5 pàgines buides, pàgina actual 1', () => {
		const { carnet } = comprovarCoherencia([]);
		expect(carnet.pagines).toHaveLength(5);
		expect(carnet.pagines.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5]);
		for (const p of carnet.pagines) {
			expect(p).toMatchObject({ segells: [], completa: false, dataCompletada: null });
		}
		expect(carnet.paginaActual).toBe(1);
		expect(carnet.enEspera).toEqual([]);
		expect(carnet.fora).toEqual([]);
	});

	it('un segell per cim en ordre cronològic de la 1a ascensió, amb tots els camps', () => {
		const llista = [asc(3, '2024-05-01'), asc(1, '2020-01-01'), asc(2, '2022-03-03')];
		const { carnet } = comprovarCoherencia(llista);
		expect(carnet.pagines[0].segells).toEqual([
			{
				cimId: 1,
				data: '2020-01-01',
				ascensioId: 'a-1-2020-01-01',
				ordre: 1,
				pagina: 1,
				casella: 1,
				essencial: true,
				comptaPerRepte: true
			},
			expect.objectContaining({ cimId: 2, ordre: 2, casella: 2 }),
			expect.objectContaining({ cimId: 3, ordre: 3, casella: 3 })
		]);
	});

	it('les repeticions no creen segell nou; el segell és la 1a ascensió', () => {
		const llista = [asc(1, '2023-08-01'), asc(1, '2021-08-01'), asc(1, '2025-08-01')];
		const { carnet } = comprovarCoherencia(llista);
		expect(totsSegells(carnet)).toHaveLength(1);
		expect(totsSegells(carnet)[0]).toMatchObject({
			data: '2021-08-01',
			ascensioId: 'a-1-2021-08-01'
		});
	});

	it('comptarRepeticions: true s’ignora (el carnet sempre compta cims diferents, §3.3.1)', () => {
		const llista = [...ascs(ESS(100), '2020-01-01'), ...ascs(ESS(100), '2024-01-01')];
		const { carnet, resum } = comprovarCoherencia(llista, { ...OP, comptarRepeticions: true });
		expect(totsSegells(carnet)).toHaveLength(100);
		expect(resum).toMatchObject({ total: 100, nivell: 1 });
	});

	it('ascensions esborrades (tombstone) no segellen; la següent vàlida pren el relleu', () => {
		const llista = [
			asc(1, '2020-01-01', { deletedAt: '2026-02-01T00:00:00.000Z' }),
			asc(1, '2022-01-01'),
			asc(2, '2021-01-01', { deletedAt: '2026-02-01T00:00:00.000Z' })
		];
		const { carnet } = comprovarCoherencia(llista);
		expect(totsSegells(carnet)).toEqual([
			expect.objectContaining({ cimId: 1, data: '2022-01-01', ascensioId: 'a-1-2022-01-01' })
		]);
	});

	it('ignora ascensions invàlides: futures, anteriors al 2006-07-01, mètode, cim inexistent', () => {
		const llista = [
			asc(1, '2026-09-28'),
			asc(2, '2006-06-30'),
			asc(3, '2020-01-01', { metode: 'moto' as never }),
			asc(9999, '2020-01-01'),
			asc(4, '2006-07-01')
		];
		const { carnet } = comprovarCoherencia(llista);
		expect(totsSegells(carnet).map((s) => s.cimId)).toEqual([4]);
	});

	it('dates iguals: desempat per createdAt i després per id', () => {
		const llista = [
			asc(5, '2023-01-01', { id: 'z', createdAt: '2026-01-01T10:00:00.000Z' }),
			asc(6, '2023-01-01', { id: 'b', createdAt: '2026-01-01T09:00:00.000Z' }),
			asc(7, '2023-01-01', { id: 'a', createdAt: '2026-01-01T09:00:00.000Z' })
		];
		const { carnet } = comprovarCoherencia(llista);
		expect(totsSegells(carnet).map((s) => s.cimId)).toEqual([7, 6, 5]);
		// La 1a ascensió d'un cim amb dues el mateix dia també es tria per createdAt.
		const mateixDia = [
			asc(1, '2023-01-01', { id: 'tard', createdAt: '2026-03-01T00:00:00.000Z' }),
			asc(1, '2023-01-01', { id: 'aviat', createdAt: '2026-02-01T00:00:00.000Z' })
		];
		expect(totsSegells(paginesCarnet(mateixDia, CATALEG, OP))[0].ascensioId).toBe('aviat');
	});

	describe('regla d’essencials (§3.1, circular 63/2019)', () => {
		it('no essencials anteriors al 2019-07-01 compten a la pàgina I', () => {
			const llista = ascs(NO_ESS(3), '2019-06-28');
			const { carnet } = comprovarCoherencia(llista);
			expect(totsSegells(carnet).map((s) => [s.cimId, s.data])).toEqual([
				[151, '2019-06-28'],
				[152, '2019-06-29'],
				[153, '2019-06-30']
			]);
			// L'1 de juliol ja és normativa nova.
			const nou = paginesCarnet([asc(160, '2019-07-01')], CATALEG, OP);
			expect(totsSegells(nou)).toEqual([]);
			expect(nou.enEspera.map((s) => s.cimId)).toEqual([160]);
		});

		it('diaTallEsNormativaAntiga: true fa comptar el mateix 2019-07-01', () => {
			const o = { ...OP, diaTallEsNormativaAntiga: true };
			const { carnet } = comprovarCoherencia([asc(160, '2019-07-01')], o);
			expect(totsSegells(carnet).map((s) => s.cimId)).toEqual([160]);
		});

		it('no essencials posteriors sense el 100: a part (enEspera) amb posició provisional 101…', () => {
			const llista = [
				...ascs(ESS(10), '2020-01-01'),
				asc(200, '2021-05-01'),
				asc(151, '2020-06-01'),
				asc(151, '2024-06-01')
			];
			const { carnet, resum } = comprovarCoherencia(llista);
			expect(totsSegells(carnet)).toHaveLength(10);
			expect(carnet.enEspera).toEqual([
				{
					cimId: 151,
					data: '2020-06-01',
					ascensioId: 'a-151-2020-06-01',
					ordre: 101,
					pagina: 2,
					casella: 1,
					essencial: false,
					comptaPerRepte: false
				},
				expect.objectContaining({ cimId: 200, ordre: 102, pagina: 2, casella: 2 })
			]);
			expect(carnet.paginaActual).toBe(1);
			expect(resum).toMatchObject({ total: 10, objectiuActual: 100, nivell: 0 });
		});

		it('99 essencials + moltes no essencials: la pàgina I no es completa', () => {
			const llista = [...ascs(ESS(99), '2020-01-01'), ...ascs(NO_ESS(150), '2019-08-01')];
			const { carnet, resum } = comprovarCoherencia(llista);
			expect(carnet.pagines[0]).toMatchObject({ completa: false, dataCompletada: null });
			expect(carnet.pagines[0].segells).toHaveLength(99);
			expect(carnet.enEspera).toHaveLength(150);
			expect(carnet.enEspera.at(-1)).toMatchObject({ ordre: 250, pagina: 3, casella: 50 });
			expect(resum).toMatchObject({ total: 99, nivell: 0, objectiuActual: 100 });
		});

		it('exactament 100 essencials: pàgina I completa el dia de la 100a, nivell 1', () => {
			const llista = ascs(ESS(100), '2020-01-01');
			const { carnet, resum } = comprovarCoherencia(llista);
			expect(carnet.pagines[0].completa).toBe(true);
			expect(carnet.pagines[0].dataCompletada).toBe(sumarDies('2020-01-01', 99));
			expect(carnet.pagines[1].segells).toEqual([]);
			expect(carnet.paginaActual).toBe(2);
			expect(resum).toMatchObject({ total: 100, nivell: 1, objectiuActual: 200 });
		});

		it('antigues no essencials + essencials completen el 100 (60 + 40)', () => {
			const llista = [...ascs(NO_ESS(60), '2010-01-01'), ...ascs(ESS(40), '2020-01-01')];
			const { carnet } = comprovarCoherencia(llista);
			expect(carnet.pagines[0].completa).toBe(true);
			expect(carnet.pagines[0].segells.filter((s) => !s.essencial)).toHaveLength(60);
		});

		it('completat el 100, les no essencials anteriors passen a la pàgina II (retroactiu, §3.3.4)', () => {
			// No essencials del 2019-2020, essencials del 2021 en endavant.
			const noEss = ascs(NO_ESS(30), '2019-08-01');
			const ess = ascs(ESS(110), '2021-01-01');
			const { carnet, resum } = comprovarCoherencia([...noEss, ...ess]);
			const [p1, p2] = carnet.pagines;
			expect(p1.segells.every((s) => s.essencial)).toBe(true);
			expect(p1.dataCompletada).toBe(sumarDies('2021-01-01', 99));
			// Pàgina II: primer les no essencials (més antigues), després les essencials 101–110.
			expect(p2.segells.slice(0, 30).every((s) => !s.essencial)).toBe(true);
			expect(p2.segells[0]).toMatchObject({ cimId: 151, data: '2019-08-01', ordre: 101 });
			expect(p2.segells.slice(30).map((s) => s.cimId)).toEqual(ESS(10, 101));
			expect(carnet.enEspera).toEqual([]);
			expect(resum.total).toBe(140);
		});

		it('noEssencialsRetroactives: false: només compten amb una ascensió posterior al 100', () => {
			const o = { ...OP, noEssencialsRetroactives: false };
			const ess = ascs(ESS(100), '2021-01-01'); // 100 el 2021-04-10
			const llista = [
				...ess,
				asc(151, '2020-01-01'), // abans: no compta
				asc(152, '2020-01-01'),
				asc(152, '2021-04-10'), // mateix dia del 100: no compta (estrictament posterior)
				asc(153, '2020-01-01'),
				asc(153, '2022-02-02') // posterior: compta amb aquesta ascensió
			];
			const { carnet } = comprovarCoherencia(llista, o);
			expect(carnet.pagines[1].segells).toEqual([
				expect.objectContaining({
					cimId: 153,
					data: '2022-02-02',
					ascensioId: 'a-153-2022-02-02',
					ordre: 101,
					comptaPerRepte: true
				})
			]);
			expect(carnet.enEspera.map((s) => [s.cimId, s.ordre])).toEqual([
				[151, 102],
				[152, 103]
			]);
		});
	});

	it('150 essencials + 350 no essencials = 500: carnet ple, pàgines amb data de nivell', () => {
		const llista = [...ascs(ESS(150), '2019-08-01'), ...ascs(NO_ESS(350), '2020-06-01')];
		const { carnet, resum } = comprovarCoherencia(llista);
		expect(carnet.pagines.every((p) => p.completa)).toBe(true);
		expect(carnet.paginaActual).toBe(5);
		expect(carnet.fora).toEqual([]);
		expect(resum).toMatchObject({ total: 500, nivell: 5, objectiuActual: 500 });
		expect(resum.essencials).toEqual({ fetes: 150, total: 150 });
	});

	it('més de 500: els sobrants van a `fora` (ordre 501…) i compten en el total', () => {
		const llista = [...ascs(ESS(150), '2019-08-01'), ...ascs(NO_ESS(400), '2020-06-01')];
		const { carnet, resum } = comprovarCoherencia(llista);
		expect(totsSegells(carnet)).toHaveLength(500);
		expect(carnet.fora).toHaveLength(50);
		expect(carnet.fora[0]).toEqual({
			cimId: 501,
			data: sumarDies('2020-06-01', 350),
			ascensioId: expect.any(String),
			ordre: 501,
			essencial: false,
			comptaPerRepte: true
		});
		expect(carnet.fora[0]).not.toHaveProperty('pagina');
		expect(resum).toMatchObject({ total: 550, nivell: 5 });
	});

	it('enEspera més enllà de la casella 500 (catàleg sintètic) va a `fora` sense comptar', () => {
		const llista = ascs(NO_ESS(420), '2019-08-01');
		const { carnet } = comprovarCoherencia(llista);
		expect(carnet.enEspera).toHaveLength(400);
		expect(carnet.fora).toHaveLength(20);
		expect(carnet.fora.every((s) => !s.comptaPerRepte)).toBe(true);
	});

	it('ascensió en restricció d’accés: segella igual (només avís, §3.3.5)', () => {
		const picossa: RestriccioAcces = {
			tipus: 'fauna',
			periodeIniciMmdd: '01-15',
			periodeFiMmdd: '06-15',
			dataInici: null,
			dataFi: null,
			fontUrl: 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/'
		};
		const cataleg = CATALEG.map((c) => (c.id === 1 ? { ...c, restriccions: [picossa] } : c));
		const llista = [asc(1, '2024-03-01')];
		const carnet = paginesCarnet(llista, cataleg, OP);
		expect(totsSegells(carnet)).toEqual([
			expect.objectContaining({ cimId: 1, comptaPerRepte: true })
		]);
		expect(calcularEstatRepte(llista, cataleg, AVUI).enRestriccio).toHaveLength(1);
		expect(resumCarnet(llista, cataleg, OP).total).toBe(1);
	});

	it('accepta el catàleg com a Map', () => {
		const mapa = new Map(CATALEG.map((c) => [c.id, c]));
		const llista = ascs(ESS(5), '2020-01-01');
		expect(paginesCarnet(llista, mapa, OP)).toEqual(paginesCarnet(llista, CATALEG, OP));
	});

	it('sense `avui` fa servir la data local (les futures no compten)', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-09-27T12:00:00Z'));
		const llista = [asc(1, '2026-09-27'), asc(2, '2026-09-28')];
		expect(totsSegells(paginesCarnet(llista, CATALEG)).map((s) => s.cimId)).toEqual([1]);
		expect(resumCarnet(llista, CATALEG).anyActual.any).toBe(2026);
	});

	it('és pur: no modifica les ascensions rebudes', () => {
		const llista = [asc(2, '2022-01-01'), asc(1, '2021-01-01')];
		const copia = structuredClone(llista);
		paginesCarnet(llista, CATALEG, OP);
		resumCarnet(llista, CATALEG, OP);
		expect(llista).toEqual(copia);
	});
});

// ---------------------------------------------------------------------------
// resumCarnet
// ---------------------------------------------------------------------------

describe('resumCarnet', () => {
	it('0 ascensions', () => {
		expect(resumCarnet([], CATALEG, OP)).toEqual({
			total: 0,
			objectiuActual: 100,
			nivell: 0,
			essencials: { fetes: 0, total: 150 },
			anyActual: { any: 2026, cimsNous: 0, limit: 100, excedit: false },
			ultimSegell: null
		});
	});

	it('essencials fetes compten qualsevol data, també les que encara no són al 100', () => {
		const r = resumCarnet(
			[asc(1, '2010-01-01'), asc(2, '2024-01-01'), asc(151, '2024-01-01')],
			CATALEG,
			OP
		);
		expect(r.essencials).toEqual({ fetes: 2, total: 150 });
		expect(r.total).toBe(2);
	});

	it('últim segell: el de l’ascensió més recent, no el d’ordre més alt', () => {
		// 30 no essencials del 2019 i 100 essencials del 2021: l'ordre més alt (130) és una no
		// essencial del 2019 (pàgina II); l'ascensió més recent és l'essencial 100 (pàgina I).
		const llista = [...ascs(NO_ESS(30), '2019-08-01'), ...ascs(ESS(100), '2021-01-01')];
		const r = resumCarnet(llista, CATALEG, OP);
		expect(paginesCarnet(llista, CATALEG, OP).pagines[1].segells.at(-1)).toMatchObject({
			ordre: 130,
			cimId: 180
		});
		expect(r.ultimSegell).toMatchObject({ cimId: 100, data: sumarDies('2021-01-01', 99) });
		// Una repetició recent no canvia el segell (el segell és de la 1a ascensió).
		const r2 = resumCarnet([...llista, asc(1, '2026-01-01')], CATALEG, OP);
		expect(r2.ultimSegell?.cimId).toBe(100);
		// Mateixa data: guanya el createdAt posterior.
		const empat = [
			asc(1, '2025-01-01', { createdAt: '2026-01-02T00:00:00.000Z' }),
			asc(2, '2025-01-01', { createdAt: '2026-01-01T00:00:00.000Z' })
		];
		expect(resumCarnet(empat, CATALEG, OP).ultimSegell?.cimId).toBe(1);
	});

	it('l’últim segell no pot ser un d’enEspera', () => {
		const r = resumCarnet([asc(1, '2020-01-01'), asc(151, '2025-01-01')], CATALEG, OP);
		expect(r.ultimSegell?.cimId).toBe(1);
		expect(resumCarnet([asc(151, '2025-01-01')], CATALEG, OP).ultimSegell).toBeNull();
	});

	it('any actual: cims nous (1a ascensió) de l’any d’avui i avís de límit', () => {
		const llista = [
			...ascs(ESS(3), '2026-01-10'),
			asc(4, '2025-12-31'),
			asc(4, '2026-02-01'), // repetició: no és nou aquest any
			asc(151, '2026-03-01') // no essencial en espera: també és un cim nou
		];
		expect(resumCarnet(llista, CATALEG, OP).anyActual).toEqual({
			any: 2026,
			cimsNous: 4,
			limit: 100,
			excedit: false
		});
		expect(resumCarnet(llista, CATALEG, { ...OP, limitAnual: 3 }).anyActual).toMatchObject({
			limit: 3,
			excedit: true
		});
		const cent = ascs([...ESS(50), ...NO_ESS(51)], '2026-01-01', 0);
		expect(resumCarnet(cent, CATALEG, OP).anyActual).toMatchObject({
			cimsNous: 101,
			excedit: true
		});
	});

	it('objectiu actual per nivell', () => {
		const n2 = [...ascs(ESS(150), '2019-08-01'), ...ascs(NO_ESS(60), '2021-01-01')];
		expect(resumCarnet(n2, CATALEG, OP)).toMatchObject({
			total: 210,
			nivell: 2,
			objectiuActual: 300
		});
	});
});

// ---------------------------------------------------------------------------
// progresComarques
// ---------------------------------------------------------------------------

describe('progresComarques', () => {
	const cat: Cim[] = [
		cim(1, { comarca: 'berguedà', essencial: true }),
		cim(2, { comarca: 'berguedà' }),
		cim(3, { comarca: 'alt-urgell', essencial: true }),
		cim(4, { comarca: 'alt-urgell', essencial: true }),
		cim(5, { comarca: 'cerdanya' }),
		cim(6, { comarca: 'anoia', essencial: true }),
		cim(7, { comarca: 'osona' }),
		cim(8, { comarca: 'osona' }),
		cim(9, { comarca: 'osona' }),
		cim(10, { comarca: 'osona' })
	];

	it('0 ascensions: tot a zero, ordre alfabètic', () => {
		expect(progresComarques([], cat, OP)).toEqual([
			{ comarca: 'alt-urgell', fets: 0, total: 2, essencialsFets: 0, essencialsTotal: 2 },
			{ comarca: 'anoia', fets: 0, total: 1, essencialsFets: 0, essencialsTotal: 1 },
			{ comarca: 'berguedà', fets: 0, total: 2, essencialsFets: 0, essencialsTotal: 1 },
			{ comarca: 'cerdanya', fets: 0, total: 1, essencialsFets: 0, essencialsTotal: 0 },
			{ comarca: 'osona', fets: 0, total: 4, essencialsFets: 0, essencialsTotal: 0 }
		]);
	});

	it('ordre per progrés relatiu, després fets, després alfabètic; ignora tombstones i repeticions', () => {
		const llista = [
			asc(5, '2020-01-01'), // cerdanya 1/1
			asc(1, '2020-01-01'), // berguedà 1/2
			asc(1, '2021-01-01'),
			asc(7, '2020-01-01'), // osona 2/4
			asc(8, '2020-01-01'),
			asc(3, '2020-01-01'), // alt-urgell 1/2
			asc(6, '2020-01-01', { deletedAt: '2026-01-01T00:00:00.000Z' }) // anoia 0/1
		];
		const r = progresComarques(llista, cat, OP);
		expect(r.map((z) => [z.comarca, z.fets])).toEqual([
			['cerdanya', 1],
			['osona', 2],
			['alt-urgell', 1],
			['berguedà', 1],
			['anoia', 0]
		]);
		expect(r.find((z) => z.comarca === 'berguedà')).toEqual({
			comarca: 'berguedà',
			fets: 1,
			total: 2,
			essencialsFets: 1,
			essencialsTotal: 1
		});
	});

	it('amb el catàleg sintètic suma 150 essencials', () => {
		const r = progresComarques(ascs(ESS(10), '2020-01-01'), CATALEG, OP);
		expect(r.reduce((s, z) => s + z.essencialsTotal, 0)).toBe(150);
		expect(r.reduce((s, z) => s + z.essencialsFets, 0)).toBe(10);
		expect(r.reduce((s, z) => s + z.total, 0)).toBe(600);
	});
});

// ---------------------------------------------------------------------------
// essencialsPendentsOrdenades
// ---------------------------------------------------------------------------

describe('essencialsPendentsOrdenades', () => {
	const cat = [
		cim(1, { comarca: 'b', altitud: 1500, essencial: true, lat: 42.0, lon: 1.0 }),
		cim(2, { comarca: 'a', altitud: 900, essencial: true, lat: 42.5, lon: 1.0 }),
		cim(3, { comarca: 'a', altitud: 2000, essencial: true, lat: 42.2, lon: 1.0 }),
		cim(4, { comarca: 'a', altitud: 2500, essencial: true, lat: null, lon: null }),
		cim(5, { comarca: 'a', altitud: 3000, essencial: false, lat: 42.0, lon: 1.0 }),
		cim(6, { comarca: 'c', altitud: 1000, essencial: true, lat: 42.0, lon: 1.0 })
	];

	it('sense posició: per comarca, altitud descendent i id', () => {
		expect(essencialsPendentsOrdenades([], cat, OP).map((c) => c.id)).toEqual([4, 3, 2, 1, 6]);
	});

	it('amb posició: per distància; sense coordenades al final; empat per comarca', () => {
		const r = essencialsPendentsOrdenades([], cat, { ...OP, des: { lat: 42.45, lon: 1.0 } });
		// 2 (0,05°) < 3 (0,25°) < 1 i 6 (mateixa distància: comarca b abans que c) < 4 (sense coords)
		expect(r.map((c) => c.id)).toEqual([2, 3, 1, 6, 4]);
	});

	it('exclou les fetes (qualsevol data) i les no essencials; les esborrades segueixen pendents', () => {
		const llista = [
			asc(3, '2010-01-01'),
			asc(2, '2024-01-01', { deletedAt: '2026-01-01T00:00:00.000Z' }),
			asc(1, '2030-01-01') // futura: no compta
		];
		expect(essencialsPendentsOrdenades(llista, cat, OP).map((c) => c.id)).toEqual([4, 2, 1, 6]);
	});

	it('conserva el tipus i els objectes del catàleg; accepta Map; totes fetes → []', () => {
		const ambExtra = cat.map((c) => ({ ...c, extra: `x${c.id}` }));
		const r = essencialsPendentsOrdenades([], new Map(ambExtra.map((c) => [c.id, c])), OP);
		expect(r[0].extra).toBe('x4');
		expect(r[0]).toBe(ambExtra[3]);
		expect(essencialsPendentsOrdenades(ascs(ESS(150), '2020-01-01'), CATALEG, OP)).toEqual([]);
		expect(essencialsPendentsOrdenades([], CATALEG, OP)).toHaveLength(150);
	});
});
