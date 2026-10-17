import { describe, expect, it } from 'vitest';
import {
	ESTACIONS,
	GRUP_MASSISSOS,
	ID_REPTE_12_MESOS,
	ID_REPTE_CENT_CIMS,
	ID_REPTE_COMARQUES,
	ID_REPTE_ESTACIONS,
	ID_REPTE_INFANTIL,
	MASSISSOS,
	REPTES,
	REPTE_CENT_CIMS,
	REPTE_INFANTIL,
	avaluarRepte,
	avaluarReptes,
	calcularEstadistiques,
	cimsDelFiltre,
	clauMissatgeRepte,
	estacioDe,
	idRepteMassis,
	medalles,
	medallesDeResultats,
	repteDeId,
	repteDeSlug,
	type AscensioRepte,
	type Cim,
	type DataISO,
	type Repte,
	type ResultatRepte
} from './index';
import ca from '../../../messages/ca.json';
import es from '../../../messages/es.json';

const AVUI = '2026-10-17';
const OP = { avui: AVUI };

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
		essencial: id <= 150,
		lat: 42,
		lon: 1.5,
		restriccions: [],
		...over
	};
}

const CATALEG: Cim[] = Array.from({ length: 300 }, (_, i) => cim(i + 1));

function asc(cimId: number, data: DataISO, over: Partial<AscensioRepte> = {}): AscensioRepte {
	return { cimId, data, metode: 'a-peu', ...over };
}

function repte(condicio: Repte['condicio'], id = 'prova'): Repte {
	return { id, slug: { ca: id, es: id }, condicio };
}

function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

const per = (id: string, rs: ResultatRepte[]) => rs.find((r) => r.id === id)!;

// ---------------------------------------------------------------------------

describe('definició dels reptes', () => {
	it('ids únics, slugs únics per idioma i ids de R1', () => {
		const ids = REPTES.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const l of ['ca', 'es'] as const) {
			const s = REPTES.map((r) => r.slug[l]);
			expect(new Set(s).size).toBe(s.length);
			for (const x of s) expect(x).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		}
		expect(ID_REPTE_CENT_CIMS).toBe(REPTE_CENT_CIMS);
		expect(ID_REPTE_INFANTIL).toBe(REPTE_INFANTIL);
		expect(ids.slice(0, 5)).toEqual([
			ID_REPTE_CENT_CIMS,
			ID_REPTE_INFANTIL,
			ID_REPTE_COMARQUES,
			ID_REPTE_ESTACIONS,
			ID_REPTE_12_MESOS
		]);
		expect(REPTES.filter((r) => r.destacat).map((r) => r.id)).toEqual([ID_REPTE_CENT_CIMS]);
		expect(REPTES.filter((r) => r.grup === GRUP_MASSISSOS)).toHaveLength(MASSISSOS.length);
	});

	it('cap nom de repte fa servir "100 Cims" com a marca, excepte el 100 Cims', () => {
		for (const r of REPTES) {
			if (r.id === ID_REPTE_CENT_CIMS) continue;
			for (const m of [ca, es] as Record<string, string>[]) {
				expect(m[clauMissatgeRepte(r.id, 'nom')]).not.toMatch(/100 Cims/i);
			}
		}
	});

	it('cada repte té nom i descripció a ca i es', () => {
		for (const r of REPTES) {
			for (const camp of ['nom', 'descripcio'] as const) {
				const k = clauMissatgeRepte(r.id, camp);
				expect((ca as Record<string, string>)[k], k).toBeTruthy();
				expect((es as Record<string, string>)[k], k).toBeTruthy();
			}
		}
	});

	it('clauMissatgeRepte, idRepteMassis, repteDeId i repteDeSlug', () => {
		expect(clauMissatgeRepte('12-mesos-12-cims', 'nom')).toBe('repte_12_mesos_12_cims_nom');
		expect(idRepteMassis('montseny')).toBe('massis-montseny');
		expect(repteDeId('les-4-estacions')?.id).toBe(ID_REPTE_ESTACIONS);
		expect(repteDeId('no')).toBeUndefined();
		expect(repteDeSlug('las-4-estaciones', 'es')?.id).toBe(ID_REPTE_ESTACIONS);
		expect(repteDeSlug('las-4-estaciones', 'ca')).toBeUndefined();
	});
});

describe('cimsDelFiltre', () => {
	it('sense filtre, tot el catàleg (llista o mapa)', () => {
		expect(cimsDelFiltre(undefined, CATALEG)).toHaveLength(300);
		expect(cimsDelFiltre(undefined, new Map(CATALEG.map((c) => [c.id, c])))).toHaveLength(300);
	});
	it('combina tots els camps amb AND', () => {
		const r = cimsDelFiltre(
			{ comarques: ['comarca-1'], altitudMin: 1100, altitudMax: 1200, essencial: true },
			CATALEG
		);
		expect(r.map((c) => c.id)).toEqual([101, 106, 111, 116, 121, 126, 131, 136, 141, 146]);
		expect(cimsDelFiltre({ ids: [3, 999] }, CATALEG).map((c) => c.id)).toEqual([3]);
		expect(cimsDelFiltre({ slugs: ['cim-7'] }, CATALEG).map((c) => c.id)).toEqual([7]);
		expect(cimsDelFiltre({ zones: ['andorra'] }, CATALEG)).toEqual([]);
		expect(cimsDelFiltre({ essencial: false }, CATALEG)).toHaveLength(150);
	});
});

describe('regles: n-distintes i totes', () => {
	const r3 = repte({ cims: { ids: [1, 2, 3, 4] }, regla: { tipus: 'n-distintes', n: 3 } });

	it('compta cims diferents; data = primera ascensió del 3r cim', () => {
		const res = avaluarRepte(
			r3,
			[
				asc(1, '2020-01-05'),
				asc(1, '2019-01-01'), // repetició anterior: la data del cim és aquesta
				asc(2, '2021-03-03'),
				asc(9, '2018-01-01'), // fora del conjunt
				asc(3, '2022-05-05'),
				asc(3, '2022-04-04')
			],
			CATALEG,
			OP
		);
		expect(res).toMatchObject({
			progres: 3,
			fets: 3,
			objectiu: 3,
			completat: true,
			dataCompletat: '2022-04-04',
			nivell: 1,
			nivellMaxim: 1,
			assoliments: [{ nivell: 1, data: '2022-04-04' }],
			pendents: { tipus: 'cims', cimIds: [4] },
			cimsQueSumen: []
		});
	});

	it('esborrades, futures, dates o mètodes invàlids i cims fora del catàleg no compten', () => {
		const res = avaluarRepte(
			r3,
			[
				asc(1, '2020-01-01', { deletedAt: '2020-02-01T00:00:00Z' }),
				asc(2, sumarDies(AVUI, 1)),
				asc(3, '2023-02-30'),
				asc(4, '2020-01-01', { metode: 'moto' as never }),
				asc(1, AVUI) // avui sí
			],
			CATALEG,
			OP
		);
		expect(res.progres).toBe(1);
		expect(res.completat).toBe(false);
		expect(res.cimsQueSumen).toEqual([2, 3, 4]);
	});

	it('les anteriors al 01/07/2006 sí que compten als reptes propis', () => {
		const res = avaluarRepte(r3, [asc(1, '1999-01-01')], CATALEG, OP);
		expect(res.progres).toBe(1);
	});

	it('desDe i metodes de la condició filtren', () => {
		const r = repte({
			cims: { ids: [1, 2] },
			regla: { tipus: 'totes' },
			desDe: '2020-01-01',
			metodes: ['esqui']
		});
		const res = avaluarRepte(
			r,
			[
				asc(1, '2019-12-31', { metode: 'esqui' }),
				asc(2, '2021-01-01'),
				asc(1, '2020-01-01', { metode: 'esqui' })
			],
			CATALEG,
			OP
		);
		expect(res.progres).toBe(1);
		expect(res.objectiu).toBe(2);
	});

	it('totes: objectiu = mida del conjunt; conjunt buit → mai completat', () => {
		const buit = avaluarRepte(
			repte({ cims: { ids: [] }, regla: { tipus: 'totes' } }),
			[],
			CATALEG,
			OP
		);
		expect(buit).toMatchObject({ objectiu: 0, completat: false, fraccio: 0, assoliments: [] });
		const catBuit = avaluarRepte(
			repte({ regla: { tipus: 'totes' } }),
			[asc(1, '2020-01-01')],
			[],
			OP
		);
		expect(catBuit).toMatchObject({ objectiu: 0, progres: 0, completat: false });
	});

	it('n impossible (més gran que el conjunt) no es completa; n ≤ 0 tampoc', () => {
		const r = repte({ cims: { ids: [1] }, regla: { tipus: 'n-distintes', n: 5 } });
		expect(avaluarRepte(r, [asc(1, '2020-01-01')], CATALEG, OP).completat).toBe(false);
		const z = repte({ regla: { tipus: 'n-distintes', n: 0 } });
		expect(avaluarRepte(z, [asc(1, '2020-01-01')], CATALEG, OP).completat).toBe(false);
	});

	it('avui invàlid llança', () => {
		expect(() => avaluarRepte(r3, [], CATALEG, { avui: '2026-13-01' })).toThrow(RangeError);
		expect(() => avaluarReptes([], CATALEG, { avui: 'x' })).toThrow(RangeError);
	});
});

describe('Totes les comarques', () => {
	const cat = [
		cim(1, { comarca: 'a' }),
		cim(2, { comarca: 'a' }),
		cim(3, { comarca: 'b' }),
		cim(4, { comarca: 'andorra', zona: 'andorra' }),
		cim(5, { comarca: 'catalunya-nord', zona: 'catalunya-nord' })
	];
	const r = repteDeId(ID_REPTE_COMARQUES)!;

	it('una per comarca, incloses Andorra i la Catalunya Nord', () => {
		const res = avaluarRepte(
			r,
			[asc(1, '2020-01-01'), asc(2, '2019-01-01'), asc(4, '2021-01-01')],
			cat,
			OP
		);
		expect(res).toMatchObject({
			progres: 2,
			objectiu: 4,
			completat: false,
			pendents: { tipus: 'comarques', comarques: ['b', 'catalunya-nord'] },
			cimsQueSumen: [3, 5]
		});
	});

	it('data de compleció = la comarca que s’omple l’última', () => {
		const res = avaluarRepte(
			r,
			[
				asc(1, '2020-01-01'),
				asc(3, '2022-01-01'),
				asc(4, '2021-01-01'),
				asc(5, '2023-06-01'),
				asc(5, '2024-01-01')
			],
			cat,
			OP
		);
		expect(res).toMatchObject({ completat: true, dataCompletat: '2023-06-01', progres: 4 });
	});
});

describe('Les 4 estacions', () => {
	const r = repteDeId(ID_REPTE_ESTACIONS)!;

	it('estacioDe: meteorològiques per mesos sencers', () => {
		const e = (m: string) => estacioDe(`2025-${m}-15`);
		expect(['01', '02', '12'].map(e)).toEqual(['hivern', 'hivern', 'hivern']);
		expect(['03', '04', '05'].map(e)).toEqual(['primavera', 'primavera', 'primavera']);
		expect(['06', '07', '08'].map(e)).toEqual(['estiu', 'estiu', 'estiu']);
		expect(['09', '10', '11'].map(e)).toEqual(['tardor', 'tardor', 'tardor']);
		expect(estacioDe('2025-02-28')).toBe('hivern');
		expect(estacioDe('2024-02-29')).toBe('hivern');
		expect(estacioDe('2025-03-01')).toBe('primavera');
		expect(estacioDe('2025-11-30')).toBe('tardor');
		expect(estacioDe('2025-12-01')).toBe('hivern');
		expect(ESTACIONS).toHaveLength(4);
	});

	it('les 4 el mateix any natural (el desembre compta per a l’any que acaba)', () => {
		const res = avaluarRepte(
			r,
			[
				asc(1, '2024-12-20'),
				asc(2, '2025-04-01'),
				asc(3, '2025-07-01'),
				asc(4, '2025-10-01'),
				asc(5, '2025-12-05')
			],
			CATALEG,
			OP
		);
		expect(res).toMatchObject({
			completat: true,
			dataCompletat: '2025-12-05',
			progres: 4,
			objectiu: 4
		});
	});

	it("l'hivern que creua l'any no uneix desembre i gener-febrer de l'any següent", () => {
		const res = avaluarRepte(
			r,
			[asc(1, '2024-04-01'), asc(2, '2024-07-01'), asc(3, '2024-10-01'), asc(4, '2025-01-10')],
			CATALEG,
			OP
		);
		expect(res.completat).toBe(false);
		expect(res.pendents).toEqual({ tipus: 'estacions', any: 2024, estacions: ['hivern'] });
	});

	it('repetir el mateix cim compta (no cal cim nou); s’escull el primer any complet', () => {
		const res = avaluarRepte(
			r,
			[
				asc(1, '2022-01-01'),
				asc(1, '2022-04-01'),
				asc(1, '2022-07-01'),
				asc(1, '2022-10-01'),
				asc(2, '2021-01-01'),
				asc(2, '2021-04-01'),
				asc(2, '2021-07-01'),
				asc(2, '2021-10-31')
			],
			CATALEG,
			OP
		);
		expect(res.dataCompletat).toBe('2021-10-31');
	});

	it('empat de cobertura: l’any més recent; cimsQueSumen si falta l’estació d’avui', () => {
		const res = avaluarRepte(r, [asc(1, '2023-04-01'), asc(2, '2025-07-01')], CATALEG, OP);
		expect(res.pendents).toMatchObject({ any: 2025, estacions: ['primavera', 'tardor', 'hivern'] });
		expect(res.cimsQueSumen).toHaveLength(300);
		const fet = avaluarRepte(r, [asc(1, '2026-10-01')], CATALEG, OP);
		expect(fet.cimsQueSumen).toEqual([]);
		const res0 = avaluarRepte(r, [], CATALEG, OP);
		expect(res0.pendents).toEqual({ tipus: 'estacions', any: null, estacions: [...ESTACIONS] });
	});
});

describe('12 mesos, 12 cims', () => {
	const r = repteDeId(ID_REPTE_12_MESOS)!;
	const mes = (i: number) => {
		const idx = 2025 * 12 + i; // i = 0 → gener 2025
		return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, '0')}-10`;
	};

	it('12 mesos seguits amb un cim nou, creuant el canvi d’any', () => {
		const a = Array.from({ length: 12 }, (_, i) => asc(i + 1, mes(i + 3))); // abr 2025 – mar 2026
		const res = avaluarRepte(r, a, CATALEG, OP);
		expect(res).toMatchObject({
			completat: true,
			dataCompletat: '2026-03-10',
			progres: 12,
			objectiu: 12
		});
	});

	it('una repetició no és un cim nou i trenca la ratxa', () => {
		const a = Array.from({ length: 12 }, (_, i) => asc(i === 6 ? 1 : i + 1, mes(i)));
		const res = avaluarRepte(r, a, CATALEG, { avui: '2025-12-20' });
		expect(res.completat).toBe(false);
		expect(res.pendents).toMatchObject({
			tipus: 'mesos',
			ratxaActual: 5,
			inici: '2025-08',
			fi: '2025-12',
			mesActualFet: true,
			millorRatxa: 6
		});
	});

	it('ratxa viva si l’últim mes és el passat; morta si no', () => {
		const a = [asc(1, '2026-08-01'), asc(2, '2026-09-30')];
		const viva = avaluarRepte(r, a, CATALEG, OP);
		expect(viva.pendents).toMatchObject({ ratxaActual: 2, mesActualFet: false });
		expect(viva.progres).toBe(2);
		expect(viva.cimsQueSumen).not.toContain(1);
		expect(viva.cimsQueSumen).toContain(3);
		const morta = avaluarRepte(r, a, CATALEG, { avui: '2026-11-01' });
		expect(morta.pendents).toMatchObject({ ratxaActual: 0, inici: null, fi: null, millorRatxa: 2 });
	});

	it('dos cims nous el mateix mes compten com un mes; esborrades no', () => {
		const res = avaluarRepte(
			r,
			[asc(1, '2026-10-01'), asc(2, '2026-10-02'), asc(3, '2026-09-01', { deletedAt: 'x' })],
			CATALEG,
			OP
		);
		expect(res.pendents).toMatchObject({ ratxaActual: 1, millorRatxa: 1 });
	});

	it('un cop completat, segueix completat encara que la ratxa es trenqui', () => {
		const a = Array.from({ length: 12 }, (_, i) => asc(i + 1, mes(i)));
		const res = avaluarRepte(r, a, CATALEG, OP);
		expect(res).toMatchObject({ completat: true, progres: 12, dataCompletat: '2025-12-10' });
	});
});

describe('Massissos', () => {
	it('sub-repte "totes" per slug', () => {
		const cat = [
			cim(1, { slug: 'matagalls' }),
			cim(2, { slug: 'les-agudes' }),
			cim(3, { slug: 'tagamanent' })
		];
		const r = repteDeId('massis-montseny')!;
		const res = avaluarRepte(r, [asc(1, '2020-01-01'), asc(2, '2020-02-01')], cat, OP);
		expect(res).toMatchObject({ progres: 2, objectiu: 3, pendents: { cimIds: [3] } });
		expect(avaluarRepte(r, [asc(3, '2021-01-01')], cat, OP).progres).toBe(1);
	});
});

describe('100 Cims i infantil (delegats, compatibles amb R1)', () => {
	it('coincideixen amb percentatges.reptes de calcularEstadistiques', () => {
		const a = [
			...Array.from({ length: 120 }, (_, i) => asc(i + 1, sumarDies('2019-08-01', i))),
			...Array.from({ length: 60 }, (_, i) => asc(151 + i, sumarDies('2026-07-02', i % 100)))
		].filter((x) => x.data <= AVUI);
		const full = a.map((x, i) => ({
			...x,
			id: `a${i}`,
			nota: null,
			companys: [],
			createdAt: '2026-01-01T00:00:00Z',
			updatedAt: '2026-01-01T00:00:00Z'
		}));
		const est = calcularEstadistiques(full, CATALEG, OP).percentatges.reptes;
		const rs = avaluarReptes(a, CATALEG, OP);
		for (const r1 of est) {
			const r2 = per(r1.id, rs);
			expect({
				id: r2.id,
				fets: r2.fets,
				objectiu: r2.objectiu,
				fraccio: r2.fraccio,
				nivell: r2.nivell,
				nivellMaxim: r2.nivellMaxim,
				assoliments: r2.assoliments
			}).toEqual(r1);
		}
		const c = per(ID_REPTE_CENT_CIMS, rs);
		expect(c.nivell).toBe(1);
		expect(c.objectiu).toBe(200);
		expect(c.completat).toBe(true);
		expect(c.dataCompletat).toBe(c.assoliments[0].data);
		expect(c.pendents.tipus).toBe('cims');
		expect(c.cimsQueSumen).not.toContain(1);
		const inf = per(ID_REPTE_INFANTIL, rs);
		expect(inf.completat).toBe(true);
		expect(inf.cimsQueSumen).toEqual([]);
	});

	it('sense nivell, pendents del 100 Cims = essencials pendents', () => {
		const res = avaluarRepte(
			repteDeId(ID_REPTE_CENT_CIMS)!,
			[asc(1, '2020-01-01'), asc(200, '2020-01-01')],
			CATALEG,
			OP
		);
		expect(res.fets).toBe(1);
		expect(res.pendents).toMatchObject({ tipus: 'cims' });
		const ids = (res.pendents as { cimIds: number[] }).cimIds;
		expect(ids).toHaveLength(149);
		expect(ids.every((id) => id <= 150)).toBe(true);
	});

	it('infantil: abans del 2026-07-01 no compta; esborrades tampoc', () => {
		const res = avaluarRepte(
			repteDeId(ID_REPTE_INFANTIL)!,
			[asc(1, '2026-06-30'), asc(2, '2026-07-01'), asc(3, '2026-08-01', { deletedAt: 'x' })],
			CATALEG,
			OP
		);
		expect(res.progres).toBe(1);
		expect(res.cimsQueSumen).toContain(1);
		expect(res.cimsQueSumen).not.toContain(2);
	});

	it('100 Cims: completat al 100; a 5×100 cimsQueSumen buit', () => {
		const cat = Array.from({ length: 520 }, (_, i) => cim(i + 1));
		const a = cat.map((c, i) => asc(c.id, sumarDies('2007-01-01', i)));
		const res = avaluarRepte(repteDeId(ID_REPTE_CENT_CIMS)!, a, cat, OP);
		expect(res.nivell).toBe(5);
		expect(res.completat).toBe(true);
		expect(res.dataCompletat).toBe(sumarDies('2007-01-01', 99));
		expect(res.assoliments.map((a) => a.nivell)).toEqual([1, 2, 3, 4, 5]);
		expect(res.cimsQueSumen).toEqual([]);
	});

	it('catàleg buit: res no peta', () => {
		const rs = avaluarReptes([asc(1, '2020-01-01')], [], OP);
		expect(rs).toHaveLength(REPTES.length);
		expect(rs.every((r) => !r.completat)).toBe(true);
	});
});

describe('medalles', () => {
	it('una per nivell, en ordre cronològic i deterministes', () => {
		const cat = [
			cim(1, { slug: 'matagalls', comarca: 'a' }),
			cim(2, { slug: 'les-agudes', comarca: 'a' }),
			cim(3, { slug: 'tagamanent', comarca: 'a' })
		];
		const m = medalles(
			[
				asc(1, '2020-01-01'),
				asc(2, '2021-01-01'),
				asc(3, '2021-01-01'),
				asc(3, '2021-01-01', { deletedAt: 'x' })
			],
			cat,
			OP
		);
		expect(m).toEqual([
			{ repteId: ID_REPTE_COMARQUES, nivell: 1, data: '2020-01-01' },
			{ repteId: 'massis-montseny', nivell: 1, data: '2021-01-01' }
		]);
	});

	it('medallesDeResultats ordena per data, repte i nivell', () => {
		const base = {
			fets: 0,
			progres: 0,
			objectiu: 1,
			fraccio: 0,
			nivellMaxim: 5,
			completat: false,
			dataCompletat: null,
			pendents: { tipus: 'cims' as const, cimIds: [] },
			cimsQueSumen: []
		};
		const m = medallesDeResultats([
			{
				...base,
				id: 'b',
				nivell: 2,
				assoliments: [
					{ nivell: 2, data: '2020-01-01' },
					{ nivell: 1, data: '2020-01-01' }
				]
			},
			{ ...base, id: 'a', nivell: 1, assoliments: [{ nivell: 1, data: '2020-01-01' }] },
			{ ...base, id: 'c', nivell: 1, assoliments: [{ nivell: 1, data: '2019-01-01' }] }
		]);
		expect(m.map((x) => `${x.repteId}${x.nivell}`)).toEqual(['c1', 'a1', 'b1', 'b2']);
	});

	it('sense ascensions, cap medalla', () => {
		expect(medalles([], CATALEG, OP)).toEqual([]);
	});
});
