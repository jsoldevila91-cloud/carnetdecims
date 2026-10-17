import { describe, expect, it } from 'vitest';
import {
	AVISOS_VALIDACIO,
	BOM_UTF8,
	anysAmbAscensions,
	campCsv,
	csvValidacio,
	dataFull,
	exportValidacio,
	terminiValidacio,
	type Ascensio,
	type AvisValidacio,
	type Cim,
	type DataISO,
	type ExportValidacio,
	type Metode,
	type RestriccioAcces,
	type TextosCsvValidacio
} from './index';

// ---------------------------------------------------------------------------
// Utilitats
// ---------------------------------------------------------------------------

const AVUI = '2026-10-17';

function cim(id: number, over: Partial<Cim> = {}): Cim {
	return {
		id,
		slug: `cim-${id}`,
		nom: `Cim ${id}`,
		nom_amb_article: `el Cim ${id}`,
		nom_amb_de: `del Cim ${id}`,
		altitud: 1000 + id,
		comarca: `comarca-${id % 3}`,
		zona: 'catalunya',
		essencial: false,
		lat: 42,
		lon: 1.5,
		restriccions: [],
		...over
	};
}

/** 1..150 essencials, 151..400 no essencials. */
const CATALEG: Cim[] = Array.from({ length: 400 }, (_, i) => cim(i + 1, { essencial: i < 150 }));

function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

let seq = 0;
function asc(cimId: number, data: DataISO, over: Partial<Ascensio> = {}): Ascensio {
	seq++;
	return {
		id: `a${String(seq).padStart(5, '0')}`,
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
/** Una ascensió per cim, un dia rere l'altre. */
const ascs = (cims: number[], inici: DataISO) => cims.map((id, i) => asc(id, sumarDies(inici, i)));

const avisosDe = (e: ExportValidacio, cimId: number) =>
	e.files.filter((f) => f.cimId === cimId).map((f) => f.avisos);

// ---------------------------------------------------------------------------
// exportValidacio
// ---------------------------------------------------------------------------

describe('exportValidacio', () => {
	it('sense ascensions: tot buit', () => {
		const e = exportValidacio([], CATALEG, 2026, { avui: AVUI });
		expect(e).toEqual({ any: 2026, files: [], excloses: [], totalNous: 0, superaMaxim: false });
	});

	it('any sense res: buit encara que hi hagi altres anys', () => {
		const e = exportValidacio(ascs(ids(5), '2025-03-01'), CATALEG, 2024, { avui: AVUI });
		expect(e.files).toEqual([]);
		expect(e.totalNous).toBe(0);
	});

	it('ordre per data, createdAt i id; num correlatiu', () => {
		const a = asc(3, '2026-05-02');
		const b = asc(1, '2026-05-01', { createdAt: '2026-05-02T10:00:00Z' });
		const c = asc(2, '2026-05-01', { createdAt: '2026-05-01T10:00:00Z' });
		const d = asc(4, '2026-05-01', { id: 'zz', createdAt: '2026-05-02T10:00:00Z' });
		const e = exportValidacio([a, d, b, c], CATALEG, 2026, { avui: AVUI });
		expect(e.files.map((f) => [f.num, f.cimId])).toEqual([
			[1, 2],
			[2, 1],
			[3, 4],
			[4, 3]
		]);
		expect(e.files[0]).toMatchObject({ ascensioId: c.id, data: '2026-05-01', metode: 'a-peu' });
	});

	it('conserva el mètode (BTT, esquí, raquetes)', () => {
		const metodes: Metode[] = ['btt', 'esqui', 'raquetes'];
		const e = exportValidacio(
			metodes.map((m, i) => asc(i + 1, `2026-02-0${i + 1}`, { metode: m })),
			CATALEG,
			2026,
			{ avui: AVUI }
		);
		expect(e.files.map((f) => f.metode)).toEqual(metodes);
	});

	it('excloses amb motiu: esborrada, motoritzada, futura, cim desconegut', () => {
		const llista = [
			asc(1, '2026-03-01', { deletedAt: '2026-03-02T00:00:00Z' }),
			asc(2, '2026-03-02', { metode: 'cotxe' as Metode }),
			asc(3, '2026-11-01'),
			asc(9999, '2026-03-04'),
			asc(5, '2026-03-05')
		];
		const e = exportValidacio(llista, CATALEG, 2026, { avui: AVUI });
		expect(e.files.map((f) => f.cimId)).toEqual([5]);
		expect(e.excloses.map((x) => [x.cimId, x.motiu])).toEqual([
			[1, 'esborrada'],
			[2, 'metode'],
			[9999, 'cim-desconegut'],
			[3, 'futura']
		]);
		expect(e.totalNous).toBe(1);
	});

	it('fora del repte: anterior al 01/07/2006 a excloses, mai a files', () => {
		const e = exportValidacio([asc(1, '2006-06-30'), asc(2, '2006-07-01')], CATALEG, 2006, {
			avui: AVUI
		});
		expect(e.files.map((f) => f.cimId)).toEqual([2]);
		expect(e.excloses).toEqual([expect.objectContaining({ cimId: 1, motiu: 'fora-del-repte' })]);
		expect(e.files.flatMap((f) => f.avisos)).not.toContain('fora-del-repte');
	});

	it('dates amb format invàlid no surten enlloc', () => {
		const e = exportValidacio([asc(1, '2026-02-30'), asc(2, 'xx')], CATALEG, 2026, {
			avui: AVUI
		});
		expect(e.files).toEqual([]);
		expect(e.excloses).toEqual([]);
	});

	it('repetit: el mateix any i creuant anys', () => {
		const e = exportValidacio(
			[asc(1, '2025-08-01'), asc(1, '2026-02-01'), asc(2, '2026-03-01'), asc(2, '2026-04-01')],
			CATALEG,
			2026,
			{ avui: AVUI }
		);
		expect(avisosDe(e, 1)).toEqual([['repetit']]);
		expect(avisosDe(e, 2)).toEqual([[], ['repetit']]);
		expect(e.totalNous).toBe(1);
	});

	it('repetit: dues el mateix dia, la segona per createdAt', () => {
		const e = exportValidacio(
			[
				asc(1, '2026-02-01', { createdAt: '2026-02-01T12:00:00Z' }),
				asc(1, '2026-02-01', { createdAt: '2026-02-01T09:00:00Z' })
			],
			CATALEG,
			2026,
			{ avui: AVUI }
		);
		expect(e.files.map((f) => f.avisos)).toEqual([[], ['repetit']]);
		expect(e.files[0].ascensioId).not.toBe(e.files[1].ascensioId);
	});

	it('una repetició vàlida d’una ascensió esborrada no és repetit', () => {
		const e = exportValidacio(
			[asc(1, '2026-01-01', { deletedAt: '2026-01-02T00:00:00Z' }), asc(1, '2026-02-01')],
			CATALEG,
			2026,
			{ avui: AVUI }
		);
		expect(avisosDe(e, 1)).toEqual([[]]);
	});

	it('mes-de-100: a partir de la 101a nova de l’any; les repetides no compten', () => {
		const inici = '2026-01-01';
		const nous = ascs(ids(101), inici);
		const rep = asc(1, '2026-06-01'); // repetició al mig, no suma
		const e = exportValidacio([...nous, rep], CATALEG, 2026, { avui: AVUI });
		expect(e.totalNous).toBe(101);
		expect(e.superaMaxim).toBe(true);
		const amb = e.files.filter((f) => f.avisos.includes('mes-de-100'));
		expect(amb.map((f) => f.cimId)).toEqual([101]);
		expect(avisosDe(e, 1)).toEqual([[], ['repetit']]);
	});

	it('exactament 100 noves: no supera el màxim', () => {
		const e = exportValidacio(ascs(ids(100), '2026-01-01'), CATALEG, 2026, { avui: AVUI });
		expect(e.totalNous).toBe(100);
		expect(e.superaMaxim).toBe(false);
		expect(e.files.some((f) => f.avisos.includes('mes-de-100'))).toBe(false);
	});

	it('limitAnual configurable', () => {
		const e = exportValidacio(ascs(ids(3), '2026-01-01'), CATALEG, 2026, {
			avui: AVUI,
			limitAnual: 2
		});
		expect(e.superaMaxim).toBe(true);
		expect(e.files.map((f) => f.avisos)).toEqual([[], [], ['mes-de-100']]);
	});

	it('desDe: amaga les anteriors però el recompte de noves és de tot l’any', () => {
		const llista = ascs(ids(101), '2026-01-01'); // la 101a cau el 2026-04-11
		const e = exportValidacio(llista, CATALEG, 2026, { avui: AVUI, desDe: '2026-04-01' });
		expect(e.files[0]).toMatchObject({ num: 1, data: '2026-04-01' });
		expect(e.files).toHaveLength(11);
		expect(e.totalNous).toBe(101);
		expect(e.files.at(-1)!.avisos).toEqual(['mes-de-100']);
	});

	it('desDe també filtra les excloses', () => {
		const e = exportValidacio(
			[asc(1, '2026-01-01', { deletedAt: 'x' }), asc(2, '2026-05-01', { deletedAt: 'x' })],
			CATALEG,
			2026,
			{ avui: AVUI, desDe: '2026-02-01' }
		);
		expect(e.excloses.map((x) => x.cimId)).toEqual([2]);
	});

	it('en-espera: no essencial posterior al 01/07/2019 sense el 100', () => {
		const e = exportValidacio(
			[
				asc(151, '2026-02-01'),
				asc(152, '2018-05-01'),
				asc(152, '2026-02-02'),
				asc(1, '2026-02-03')
			],
			CATALEG,
			2026,
			{ avui: AVUI }
		);
		expect(avisosDe(e, 151)).toEqual([['en-espera']]);
		// Antiga (1a ascensió abans del tall): compta; la repetició del 2026 no és en espera.
		expect(avisosDe(e, 152)).toEqual([['repetit']]);
		expect(avisosDe(e, 1)).toEqual([[]]);
	});

	it('en-espera: desapareix quan el 100 està completat (retroactiu per defecte)', () => {
		const cent = ascs(ids(100), '2024-01-01');
		const e = exportValidacio([...cent, asc(151, '2026-02-01')], CATALEG, 2026, { avui: AVUI });
		expect(avisosDe(e, 151)).toEqual([[]]);
	});

	it('en-espera amb noEssencialsRetroactives: false (lectura literal)', () => {
		const cent = ascs(ids(100), '2026-01-01'); // completat el 2026-04-10
		const llista = [...cent, asc(151, '2026-02-01'), asc(152, '2026-05-01')];
		const e = exportValidacio(llista, CATALEG, 2026, {
			avui: AVUI,
			noEssencialsRetroactives: false,
			limitAnual: 500
		});
		expect(avisosDe(e, 151)).toEqual([['en-espera']]);
		expect(avisosDe(e, 152)).toEqual([[]]);
	});

	it('restricció: el dia hi havia una restricció activa (també repetit)', () => {
		const fauna: RestriccioAcces = {
			tipus: 'fauna',
			periodeIniciMmdd: '01-15',
			periodeFiMmdd: '06-15',
			dataInici: null,
			dataFi: null,
			fontUrl: 'https://example.org'
		};
		const cat = CATALEG.map((c) => (c.id === 7 ? { ...c, restriccions: [fauna] } : c));
		const e = exportValidacio(
			[asc(7, '2026-01-10'), asc(7, '2026-02-01'), asc(7, '2026-07-01')],
			cat,
			2026,
			{ avui: AVUI }
		);
		expect(avisosDe(e, 7)).toEqual([[], ['restriccio', 'repetit'], ['repetit']]);
	});

	it('avisos acumulats en ordre canònic', () => {
		const tot: RestriccioAcces = {
			tipus: 'obres',
			periodeIniciMmdd: null,
			periodeFiMmdd: null,
			dataInici: null,
			dataFi: null,
			fontUrl: 'https://example.org'
		};
		const cat = CATALEG.map((c) => (c.id === 400 ? { ...c, restriccions: [tot] } : c));
		const e = exportValidacio(
			[...ascs(ids(100, 151), '2026-01-01'), asc(400, '2026-09-01')],
			cat,
			2026,
			{ avui: AVUI }
		);
		const darrera = e.files.at(-1)!;
		expect(darrera.cimId).toBe(400);
		expect(darrera.avisos).toEqual(['restriccio', 'mes-de-100', 'en-espera']);
		for (const f of e.files) {
			const pos = f.avisos.map((a) => AVISOS_VALIDACIO.indexOf(a));
			expect(pos).toEqual([...pos].sort((x, y) => x - y));
		}
	});

	it('accepta el catàleg com a Map', () => {
		const mapa = new Map(CATALEG.map((c) => [c.id, c]));
		const e = exportValidacio([asc(1, '2026-01-01')], mapa, 2026, { avui: AVUI });
		expect(e.files).toHaveLength(1);
	});

	it('errors de programació', () => {
		expect(() => exportValidacio([], CATALEG, 2026.5, { avui: AVUI })).toThrow(RangeError);
		expect(() => exportValidacio([], CATALEG, 2026, { avui: '2026-13-01' })).toThrow(RangeError);
		expect(() => exportValidacio([], CATALEG, 2026, { avui: AVUI, desDe: 'ahir' })).toThrow(
			RangeError
		);
	});

	it('no muta l’entrada', () => {
		const llista = [asc(2, '2026-02-01'), asc(1, '2026-01-01')];
		const copia = structuredClone(llista);
		exportValidacio(llista, CATALEG, 2026, { avui: AVUI });
		expect(llista).toEqual(copia);
	});
});

// ---------------------------------------------------------------------------
// anysAmbAscensions i terminiValidacio
// ---------------------------------------------------------------------------

describe('anysAmbAscensions', () => {
	it('descendent, sense repetits; ignora esborrades, invàlides i anteriors al 2006-07-01', () => {
		const llista = [
			asc(1, '2024-01-01'),
			asc(2, '2026-05-01'),
			asc(3, '2024-08-01'),
			asc(4, '2019-01-01', { deletedAt: 'x' }),
			asc(5, '2006-06-30'),
			asc(6, 'malament'),
			asc(7, '2027-01-01')
		];
		expect(anysAmbAscensions(llista)).toEqual([2027, 2026, 2024]);
		expect(anysAmbAscensions(llista, AVUI)).toEqual([2026, 2024]);
		expect(anysAmbAscensions([])).toEqual([]);
	});
});

describe('terminiValidacio', () => {
	it('31/12 de l’any en curs i dies que falten', () => {
		expect(terminiValidacio('2026-10-17')).toEqual({
			any: 2026,
			dataLimit: '2026-12-31',
			dies: 75
		});
		expect(terminiValidacio('2026-12-31').dies).toBe(0);
		expect(terminiValidacio('2026-01-01').dies).toBe(364);
		expect(terminiValidacio('2028-01-01').dies).toBe(365);
	});

	it('avui invàlid', () => {
		expect(() => terminiValidacio('2026-02-30')).toThrow(RangeError);
	});
});

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

const TEXTOS: TextosCsvValidacio = {
	capcalera: ['Núm.', 'Data', 'Cim', 'Altitud', 'Comarca', 'Mètode', 'Avisos'],
	avis: Object.fromEntries(AVISOS_VALIDACIO.map((a) => [a, `avís ${a}`])) as Record<
		AvisValidacio,
		string
	>,
	metode: { 'a-peu': 'A peu', btt: 'BTT', esqui: 'Esquí', raquetes: 'Raquetes' }
};
const COMARQUES = [
	{ slug: 'comarca-0', nom: 'Comarca Zero' },
	{ slug: 'comarca-1', nom: 'Comarca "U"; amb punt i coma' },
	{ slug: 'comarca-2', nom: 'Comarca Dos' }
];

describe('campCsv', () => {
	it('escapament RFC 4180', () => {
		expect(campCsv('simple')).toBe('simple');
		expect(campCsv(12)).toBe('12');
		expect(campCsv('a;b')).toBe('"a;b"');
		expect(campCsv('di "hola"')).toBe('"di ""hola"""');
		expect(campCsv('línia\nnova')).toBe('"línia\nnova"');
		expect(campCsv('')).toBe('');
	});

	it('protecció contra injecció de fórmules', () => {
		expect(campCsv('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`);
		expect(campCsv('+1')).toBe("'+1");
		expect(campCsv('-2')).toBe("'-2");
		expect(campCsv('@SUM(A1)')).toBe("'@SUM(A1)");
		expect(campCsv('\tx')).toBe("'\tx");
		expect(campCsv('\rx')).toBe(`"'\rx"`);
		expect(campCsv('a=b')).toBe('a=b');
	});
});

describe('csvValidacio', () => {
	it('BOM, capçalera, CRLF, columnes i textos', () => {
		const cat = CATALEG.map((c) => (c.id === 1 ? { ...c, nom: '=Cim; "perillós"' } : c));
		const e = exportValidacio(
			[asc(1, '2026-03-05'), asc(1, '2026-04-06', { metode: 'raquetes' })],
			cat,
			2026,
			{ avui: AVUI }
		);
		const csv = csvValidacio(e, cat, TEXTOS, COMARQUES);
		expect(csv.startsWith(BOM_UTF8)).toBe(true);
		expect(csv.endsWith('\r\n')).toBe(true);
		const linies = csv.slice(1).split('\r\n');
		expect(linies).toEqual([
			'Núm.;Data;Cim;Altitud;Comarca;Mètode;Avisos',
			`1;05/03/2026;"'=Cim; ""perillós""";1001;"Comarca ""U""; amb punt i coma";A peu;`,
			`2;06/04/2026;"'=Cim; ""perillós""";1001;"Comarca ""U""; amb punt i coma";Raquetes;avís repetit`,
			''
		]);
	});

	it('diversos avisos separats per coma; comarca desconeguda → slug', () => {
		const e: ExportValidacio = {
			any: 2026,
			files: [
				{
					num: 1,
					ascensioId: 'x',
					cimId: 3,
					data: '2026-01-02',
					metode: 'btt',
					avisos: ['restriccio', 'repetit']
				}
			],
			excloses: [],
			totalNous: 0,
			superaMaxim: false
		};
		const csv = csvValidacio(e, CATALEG, TEXTOS, []);
		expect(csv.split('\r\n')[1]).toBe(
			'1;02/01/2026;Cim 3;1003;comarca-0;BTT;avís restriccio, avís repetit'
		);
	});

	it('export buit: només capçalera', () => {
		const csv = csvValidacio(
			exportValidacio([], CATALEG, 2026, { avui: AVUI }),
			CATALEG,
			TEXTOS,
			COMARQUES
		);
		expect(csv).toBe(BOM_UTF8 + 'Núm.;Data;Cim;Altitud;Comarca;Mètode;Avisos\r\n');
	});

	it('dataFull', () => {
		expect(dataFull('2026-01-09')).toBe('09/01/2026');
	});
});
