import { describe, expect, it } from 'vitest';
import {
	MAX_BYTES_CARNET,
	MAX_ENTRADES_COMPARTIDES,
	aBase64Url,
	CODIS_REPTE_COMPARTIT,
	MAX_MEDALLES_COMPARTIDES,
	REPTES,
	ascensionsDeCarnetCompartit,
	codificaCarnet,
	deBase64Url,
	descodificaCarnet,
	entradaCompartir,
	esErrorCarnet,
	medalles,
	paginesCarnet,
	resumCarnet,
	sanejaNom,
	type Ascensio,
	type AscensioCompartida,
	type CarnetCompartit,
	type Cim,
	type DataISO,
	type ErrorCarnetCompartit,
	type Medalla,
	type Metode
} from './index';

// ---------------------------------------------------------------------------
// Utilitats
// ---------------------------------------------------------------------------

const AVUI = '2026-10-17';
const cp = (...codis: number[]) => String.fromCodePoint(...codis);

function cim(id: number, essencial = id <= 150): Cim {
	return {
		id,
		slug: `cim-${id}`,
		nom: `Cim ${id}`,
		nom_amb_article: `el Cim ${id}`,
		nom_amb_de: `del Cim ${id}`,
		altitud: 1000 + id,
		comarca: `comarca-${id % 5}`,
		zona: 'catalunya',
		essencial,
		lat: 42,
		lon: 1.5,
		restriccions: []
	};
}

/** 1..150 essencials, 151..600 no essencials. */
const CATALEG: Cim[] = Array.from({ length: 600 }, (_, i) => cim(i + 1));

function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Generador pseudoaleatori determinista (mulberry32). */
function rng(llavor: number) {
	let s = llavor >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** `n` entrades realistes: cims diferents (1..522), dates del 2006-07-01 a AVUI. */
function entrades(n: number, llavor = 1): AscensioCompartida[] {
	const r = rng(llavor);
	const cims = Array.from({ length: 522 }, (_, i) => i + 1).sort(() => r() - 0.5);
	return Array.from({ length: n }, (_, i) => ({
		cimId: cims[i % cims.length],
		data: sumarDies('2006-07-01', Math.floor(r() * 7413))
	}));
}

const perData = (a: AscensioCompartida[]) =>
	a
		.map((x, i) => ({ ...x, i }))
		.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : a.i - b.i))
		.map(({ cimId, data }) => ({ cimId, data }));

function ok(r: CarnetCompartit | ErrorCarnetCompartit): CarnetCompartit {
	if (esErrorCarnet(r)) throw new Error(`error inesperat: ${r.error}`);
	return r;
}

const err = (bytes: number[] | Uint8Array) =>
	descodificaCarnet(Uint8Array.from(bytes), CATALEG, AVUI);

// ---------------------------------------------------------------------------
// Codificació i descodificació
// ---------------------------------------------------------------------------

describe('codificaCarnet / descodificaCarnet', () => {
	it('carnet buit sense nom: 3 bytes', () => {
		const bytes = codificaCarnet({ ascensions: [] });
		expect([...bytes]).toEqual([1, 0, 0, 0]);
		expect(descodificaCarnet(bytes, CATALEG, AVUI)).toEqual({
			ascensions: [],
			descartades: 0,
			medalles: []
		});
	});

	it('format v1 documentat', () => {
		const bytes = codificaCarnet({
			nom: 'Na',
			ascensions: [
				{ cimId: 200, data: '2006-07-03' },
				{ cimId: 5, data: '2006-07-01' }
			]
		});
		// versió, nom (2 bytes), N=2, (Δ0, 5), (Δ2, 200 = 0xC8 0x01)
		expect([...bytes]).toEqual([1, 2, 78, 97, 2, 0, 5, 2, 0xc8, 0x01, 0]);
	});

	it('round-trip de 500 entrades (ordre per data, estable dins del dia)', () => {
		const llista = entrades(500, 7);
		const bytes = codificaCarnet({ nom: 'JSR', ascensions: llista });
		const r = ok(descodificaCarnet(bytes, CATALEG, AVUI));
		expect(r.nom).toBe('JSR');
		expect(r.descartades).toBe(0);
		expect(r.ascensions).toEqual(perData(llista));
		// ~3 bytes per entrada sense comprimir
		expect(bytes.length).toBeLessThan(500 * 3 + 10);
	});

	it('round-trip del màxim (2.000 entrades, repeticions de cim en dates diferents)', () => {
		const llista = Array.from({ length: MAX_ENTRADES_COMPARTIDES }, (_, i) => ({
			cimId: (i % 522) + 1,
			data: sumarDies('2006-07-01', i * 3)
		}));
		const r = ok(descodificaCarnet(codificaCarnet({ ascensions: llista }), CATALEG, '2030-01-01'));
		expect(r.ascensions).toEqual(llista);
	});

	it('dins del mateix dia conserva l’ordre de qui comparteix', () => {
		const llista = [
			{ cimId: 9, data: '2020-01-01' },
			{ cimId: 3, data: '2020-01-01' },
			{ cimId: 7, data: '2019-01-01' }
		];
		const r = ok(descodificaCarnet(codificaCarnet({ ascensions: llista }), CATALEG, AVUI));
		expect(r.ascensions.map((a) => a.cimId)).toEqual([7, 9, 3]);
	});

	it('elimina duplicats exactes en codificar', () => {
		const a = { cimId: 1, data: '2020-01-01' };
		const bytes = codificaCarnet({ ascensions: [a, a, { ...a }] });
		expect(ok(descodificaCarnet(bytes, CATALEG, AVUI)).ascensions).toEqual([a]);
	});

	it('descodifica sense nom quan el nom queda buit', () => {
		const r = ok(descodificaCarnet(codificaCarnet({ nom: '   ', ascensions: [] }), CATALEG, AVUI));
		expect(r).not.toHaveProperty('nom');
	});

	it('nom UTF-8 multibyte i emojis', () => {
		const nom = `Núria ${cp(0x1f3d4)} Cerdanya`;
		const r = ok(descodificaCarnet(codificaCarnet({ nom, ascensions: [] }), CATALEG, AVUI));
		expect(r.nom).toBe(nom);
	});

	it('errors de programació en codificar', () => {
		const d = '2020-01-01';
		expect(() => codificaCarnet({ ascensions: [{ cimId: 0, data: d }] })).toThrow(RangeError);
		expect(() => codificaCarnet({ ascensions: [{ cimId: 1.5, data: d }] })).toThrow(RangeError);
		expect(() => codificaCarnet({ ascensions: [{ cimId: 2 ** 21, data: d }] })).toThrow(RangeError);
		expect(() => codificaCarnet({ ascensions: [{ cimId: 1, data: '2020-02-30' }] })).toThrow(
			RangeError
		);
		expect(() => codificaCarnet({ ascensions: [{ cimId: 1, data: '2006-06-30' }] })).toThrow(
			RangeError
		);
		const massa = Array.from({ length: MAX_ENTRADES_COMPARTIDES + 1 }, (_, i) => ({
			cimId: 1,
			data: sumarDies('2006-07-01', i)
		}));
		expect(() => codificaCarnet({ ascensions: massa })).toThrow(RangeError);
	});

	it('avui invàlid és un error de programació', () => {
		expect(() => descodificaCarnet(Uint8Array.from([1, 0, 0, 0]), CATALEG, 'avui')).toThrow(
			RangeError
		);
	});
});

describe('descodificaCarnet: validació estricta', () => {
	it('buit, versió i mida', () => {
		expect(err([])).toEqual({ error: 'buit' });
		expect(err([2, 0, 0])).toEqual({ error: 'versio' });
		expect(err([0, 0, 0])).toEqual({ error: 'versio' });
		expect(err(new Uint8Array(MAX_BYTES_CARNET + 1).fill(1))).toEqual({ error: 'massa-gran' });
	});

	it('truncat o amb bytes de més', () => {
		expect(err([1])).toEqual({ error: 'format' });
		expect(err([1, 0])).toEqual({ error: 'format' });
		expect(err([1, 0, 1, 0])).toEqual({ error: 'format' });
		expect(err([1, 0, 0])).toEqual({ error: 'format' }); // falta el recompte de medalles
		expect(err([1, 3, 65])).toEqual({ error: 'format' });
		expect(err([1, 0, 0, 0, 0])).toEqual({ error: 'format' });
		expect(err([1, 0, 1, 0, 5, 0, 9])).toEqual({ error: 'format' });
	});

	it('varints no canònics o massa llargs', () => {
		expect(err([1, 0x80, 0x00, 0])).toEqual({ error: 'format' });
		expect(err([1, 0, 1, 0x85, 0x00, 1])).toEqual({ error: 'format' });
		expect(err([1, 0, 1, 0, 0x80, 0x80, 0x80, 0x01])).toEqual({ error: 'format' });
		expect(err([1, 0, 0x80, 0x80, 0x80])).toEqual({ error: 'format' });
	});

	it('massa entrades o nom massa llarg', () => {
		// N = 2001
		expect(err([1, 0, 0xd1, 0x0f])).toEqual({ error: 'massa-gran' });
		// L = 161
		expect(err([1, 0xa1, 0x01, ...new Array(161).fill(65), 0])).toEqual({ error: 'massa-gran' });
	});

	it('N gran amb poques dades: format, sense reservar memòria', () => {
		expect(err([1, 0, 0xd0, 0x0f, 0, 1, 0])).toEqual({ error: 'format' });
	});

	it('nom que no és UTF-8 vàlid', () => {
		expect(err([1, 2, 0xc3, 0x28, 0])).toEqual({ error: 'format' });
		expect(err([1, 1, 0xff, 0])).toEqual({ error: 'format' });
	});

	it('cims desconeguts i dates futures: es descarten i es compten', () => {
		const bytes = codificaCarnet({
			ascensions: [
				{ cimId: 1, data: '2020-01-01' },
				{ cimId: 9999, data: '2020-01-02' },
				{ cimId: 2, data: '2026-10-17' },
				{ cimId: 3, data: '2026-10-18' },
				{ cimId: 4, data: '2099-01-01' }
			]
		});
		const r = ok(descodificaCarnet(bytes, CATALEG, AVUI));
		expect(r.ascensions).toEqual([
			{ cimId: 1, data: '2020-01-01' },
			{ cimId: 2, data: '2026-10-17' }
		]);
		expect(r.descartades).toBe(3);
	});

	it('cimId 0 (impossible en codificar) es descarta', () => {
		expect(ok(err([1, 0, 1, 0, 0, 0]))).toEqual({ ascensions: [], descartades: 1, medalles: [] });
	});

	it('duplicats a l’enllaç: se’n queda un, sense comptar-lo com a descartat', () => {
		expect(ok(err([1, 0, 2, 5, 1, 0, 1, 0]))).toEqual({
			ascensions: [{ cimId: 1, data: '2006-07-06' }],
			descartades: 0,
			medalles: []
		});
	});

	it('accepta el catàleg com a Map', () => {
		const mapa = new Map(CATALEG.map((c) => [c.id, c]));
		expect(
			ok(descodificaCarnet(Uint8Array.from([1, 0, 1, 0, 1, 0]), mapa, AVUI)).ascensions
		).toEqual([{ cimId: 1, data: '2006-07-01' }]);
	});

	it('bytes aleatoris: mai llança', () => {
		const r = rng(42);
		for (let k = 0; k < 2000; k++) {
			const n = Math.floor(r() * 40);
			const bytes = Uint8Array.from({ length: n }, () => Math.floor(r() * 256));
			if (n > 0 && r() < 0.7) bytes[0] = 1;
			expect(() => descodificaCarnet(bytes, CATALEG, AVUI)).not.toThrow();
		}
	});
});

// ---------------------------------------------------------------------------
// Nom
// ---------------------------------------------------------------------------

describe('sanejaNom', () => {
	it('treu controls, format invisible i separadors de línia; col·lapsa espais', () => {
		const brut = `  Jo${cp(0)}an${cp(0x7)}\n\tna ${cp(0x202e)}xe${cp(0x200b)}${cp(0x2028)}t  `;
		expect(sanejaNom(brut)).toBe('Joan na xe t');
		expect(sanejaNom(`a${cp(0xfeff)}b${cp(0x2066)}c${cp(0x7f)}d${cp(0x9f)}`)).toBe('abcd');
	});

	it('conserva el ZWJ dels emojis compostos', () => {
		const familia = cp(0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467);
		expect(sanejaNom(`Família ${familia}`)).toBe(`Família ${familia}`);
	});

	it('com a molt 40 caràcters (punts de codi), retallat', () => {
		expect(sanejaNom('x'.repeat(50))).toBe('x'.repeat(40));
		expect(sanejaNom(`${'a'.repeat(39)} b`)).toBe('a'.repeat(39));
		expect(Array.from(sanejaNom(cp(0x1f3d4).repeat(45))!)).toHaveLength(40);
	});

	it('buit o no text → undefined', () => {
		expect(sanejaNom('')).toBeUndefined();
		expect(sanejaNom(` ${cp(0)} \n`)).toBeUndefined();
		expect(sanejaNom(undefined)).toBeUndefined();
		expect(sanejaNom(42)).toBeUndefined();
	});

	it('el text HTML es conserva tal qual (la UI el pinta com a text, mai com a HTML)', () => {
		expect(sanejaNom('<img src=x onerror=alert(1)>')).toBe('<img src=x onerror=alert(1)>');
	});

	it('el nom codificat ja surt sanejat', () => {
		const bytes = codificaCarnet({ nom: `Ana${cp(0x202e)}\n`, ascensions: [] });
		expect(ok(descodificaCarnet(bytes, CATALEG, AVUI)).nom).toBe('Ana');
	});

	it('controls injectats directament als bytes: se sanegen en descodificar', () => {
		expect(ok(err([1, 4, 65, 0x1b, 0x0a, 66, 0, 0])).nom).toBe('A B');
		expect(ok(err([1, 3, 65, 0x1b, 66, 0, 0])).nom).toBe('AB');
	});
});

// ---------------------------------------------------------------------------
// Base64url
// ---------------------------------------------------------------------------

describe('base64url', () => {
	it('coincideix amb Buffer (base64url) per a totes les longituds', () => {
		const r = rng(3);
		for (let n = 0; n < 70; n++) {
			const bytes = Uint8Array.from({ length: n }, () => Math.floor(r() * 256));
			const s = aBase64Url(bytes);
			expect(s).toBe(Buffer.from(bytes).toString('base64url'));
			expect(deBase64Url(s)).toEqual(bytes);
		}
	});

	it('rebutja caràcters fora de l’alfabet, farciment i espais', () => {
		for (const s of ['ab+c', 'ab/c', 'YQ==', 'YW E', 'YWJj\n', 'é', '%41']) {
			expect(deBase64Url(s)).toBeNull();
		}
	});

	it('rebutja longituds impossibles i bits sobrants', () => {
		expect(deBase64Url('A')).toBeNull();
		expect(deBase64Url('AAAAA')).toBeNull();
		expect(deBase64Url('AB')).toBeNull(); // 'AA' és el canònic de [0]
		expect(deBase64Url('AAB')).toBeNull(); // 'AAA' és el canònic de [0, 0]
		expect(deBase64Url('AA')).toEqual(Uint8Array.from([0]));
		expect(deBase64Url('')).toEqual(new Uint8Array(0));
	});
});

// ---------------------------------------------------------------------------
// Ponts amb el carnet
// ---------------------------------------------------------------------------

let seq = 0;
function asc(cimId: number, data: DataISO, over: Partial<Ascensio> = {}): Ascensio {
	seq++;
	return {
		id: `a${String(seq).padStart(5, '0')}`,
		cimId,
		data,
		metode: 'a-peu',
		nota: 'nota privada',
		companys: ['Pere'],
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		...over
	};
}

describe('entradaCompartir', () => {
	it('un segell per cim, sense dades privades ni ascensions que no compten', () => {
		const llista = [
			asc(1, '2020-05-01'),
			asc(1, '2021-05-01'), // repetició: no
			asc(2, '2020-04-01', { deletedAt: '2020-04-02T00:00:00Z' }), // esborrada: no
			asc(3, '2027-01-01'), // futura: no
			asc(4, '2020-06-01', { metode: 'moto' as Metode }), // motor: no
			asc(5, '2005-01-01'), // anterior al 2006: no
			asc(9999, '2020-01-01'), // fora del catàleg: no
			asc(151, '2022-01-01') // no essencial en espera: sí (és al carnet)
		];
		const e = entradaCompartir(llista, CATALEG, { avui: AVUI, nom: ` JSR${cp(0)} ` });
		expect(e).toEqual({
			nom: 'JSR',
			ascensions: [
				{ cimId: 1, data: '2020-05-01' },
				{ cimId: 151, data: '2022-01-01' }
			],
			medalles: []
		});
		for (const a of e.ascensions) expect(Object.keys(a).sort()).toEqual(['cimId', 'data']);
	});

	it('sense nom: no hi ha clau nom', () => {
		expect(entradaCompartir([], CATALEG, { avui: AVUI })).toEqual({ ascensions: [], medalles: [] });
	});

	it('el carnet de qui rep és el mateix que el de qui comparteix', () => {
		const r = rng(11);
		const llista: Ascensio[] = [];
		for (let i = 0; i < 400; i++) {
			const cimId = 1 + Math.floor(r() * 600);
			const data = sumarDies('2006-07-01', Math.floor(r() * 7413));
			llista.push(
				asc(cimId, data, { createdAt: `2026-01-01T00:00:${String(i % 60).padStart(2, '0')}Z` })
			);
		}
		const op = { avui: AVUI };
		const original = paginesCarnet(llista, CATALEG, op);
		const entrada = entradaCompartir(llista, CATALEG, op);
		const rebut = ok(descodificaCarnet(codificaCarnet(entrada), CATALEG, AVUI));
		const sintetiques = ascensionsDeCarnetCompartit(rebut);
		const copia = paginesCarnet(sintetiques, CATALEG, op);

		const clau = (c: typeof original) => ({
			pagines: c.pagines.map((p) => ({
				segells: p.segells.map((s) => [s.cimId, s.data, s.ordre, s.comptaPerRepte]),
				completa: p.completa,
				dataCompletada: p.dataCompletada
			})),
			enEspera: c.enEspera.map((s) => [s.cimId, s.data]),
			fora: c.fora.map((s) => [s.cimId, s.data])
		});
		expect(clau(copia)).toEqual(clau(original));

		const ro = resumCarnet(llista, CATALEG, op);
		const rc = resumCarnet(sintetiques, CATALEG, op);
		expect({ ...rc, ultimSegell: null }).toEqual({ ...ro, ultimSegell: null });
		expect(rc.ultimSegell?.cimId).toBe(ro.ultimSegell?.cimId);
	});
});

describe('ascensionsDeCarnetCompartit', () => {
	it('ids correlatius, mètode a peu i sense dades privades', () => {
		const r = ascensionsDeCarnetCompartit({
			ascensions: [
				{ cimId: 4, data: '2020-01-01' },
				{ cimId: 2, data: '2020-01-01' }
			],
			descartades: 0,
			medalles: []
		});
		expect(r).toEqual([
			{ id: 'c0001', cimId: 4, data: '2020-01-01', metode: 'a-peu', createdAt: '' },
			{ id: 'c0002', cimId: 2, data: '2020-01-01', metode: 'a-peu', createdAt: '' }
		]);
	});
});

// ---------------------------------------------------------------------------
// Medalles
// ---------------------------------------------------------------------------

describe('medalles al carnet compartit', () => {
	const M: Medalla[] = [
		{ repteId: 'massis-montseny', nivell: 1, data: '1998-05-01' },
		{ repteId: 'cent-cims', nivell: 1, data: '2020-01-01' },
		{ repteId: 'les-4-estacions', nivell: 1, data: '2021-12-01' },
		{ repteId: 'cent-cims', nivell: 5, data: '2026-10-17' }
	];

	it('round-trip: ordre, nivell i dates anteriors al 2006', () => {
		const bytes = codificaCarnet({ ascensions: [], medalles: M });
		expect(ok(descodificaCarnet(bytes, CATALEG, AVUI)).medalles).toEqual(M);
	});

	it('format: codi, nivell i zigzag(dies)', () => {
		const bytes = codificaCarnet({
			ascensions: [],
			medalles: [
				{ repteId: 'cent-cims', nivell: 2, data: '2006-07-02' },
				{ repteId: 'infantil', nivell: 1, data: '2006-06-30' }
			]
		});
		// M=2, (0, 2, zigzag(1)=2), (1, 1, zigzag(-1)=1)
		expect([...bytes]).toEqual([1, 0, 0, 2, 0, 2, 2, 1, 1, 1]);
	});

	it('duplicades (mateix repte i nivell): la primera', () => {
		const bytes = codificaCarnet({
			ascensions: [],
			medalles: [M[1], { ...M[1], data: '2021-01-01' }]
		});
		expect(ok(descodificaCarnet(bytes, CATALEG, AVUI)).medalles).toEqual([M[1]]);
		expect(ok(err([1, 0, 0, 2, 0, 1, 2, 0, 1, 4])).medalles).toEqual([
			{ repteId: 'cent-cims', nivell: 1, data: '2006-07-02' }
		]);
	});

	it('errors de programació en codificar', () => {
		const ko = (m: Medalla) => () => codificaCarnet({ ascensions: [], medalles: [m] });
		expect(ko({ repteId: 'inventat', nivell: 1, data: '2020-01-01' })).toThrow(RangeError);
		expect(ko({ repteId: 'cent-cims', nivell: 0, data: '2020-01-01' })).toThrow(RangeError);
		expect(ko({ repteId: 'cent-cims', nivell: 6, data: '2020-01-01' })).toThrow(RangeError);
		expect(ko({ repteId: 'cent-cims', nivell: 1.5, data: '2020-01-01' })).toThrow(RangeError);
		expect(ko({ repteId: 'cent-cims', nivell: 1, data: '1899-12-31' })).toThrow(RangeError);
		expect(ko({ repteId: 'cent-cims', nivell: 1, data: '2020-02-30' })).toThrow(RangeError);
		const massa = Array.from({ length: MAX_MEDALLES_COMPARTIDES + 1 }, (_, i) => ({
			repteId: CODIS_REPTE_COMPARTIT[i % CODIS_REPTE_COMPARTIT.length],
			nivell: 1 + Math.floor(i / CODIS_REPTE_COMPARTIT.length),
			data: '2020-01-01'
		}));
		expect(() => codificaCarnet({ ascensions: [], medalles: massa })).toThrow(RangeError);
	});

	it('lectura estricta: codis desconeguts i dates futures es descarten', () => {
		// codi 200 desconegut; cent-cims amb data futura (AVUI + 1)
		const futur = 2 * (7413 + 1); // zigzag dels dies del 2026-10-18
		const v = (n: number) => (n < 128 ? [n] : [(n & 0x7f) | 0x80, n >> 7]);
		const r = ok(err([1, 0, 0, 3, ...v(200), 1, 0, 0, 1, ...v(futur), 1, 1, 0]));
		expect(r.medalles).toEqual([{ repteId: 'infantil', nivell: 1, data: '2006-07-01' }]);
		expect(r.descartades).toBe(0);
	});

	it('lectura estricta: nivell, data mínima, mida i bytes de més', () => {
		expect(err([1, 0, 0, 1, 0, 0, 0])).toEqual({ error: 'format' });
		expect(err([1, 0, 0, 1, 0, 6, 0])).toEqual({ error: 'format' });
		// zigzag de -40000 dies (abans del 1900) = 79999 = 0xFF 0xF0 0x04
		expect(err([1, 0, 0, 1, 0, 1, 0xff, 0xf0, 0x04])).toEqual({ error: 'format' });
		expect(err([1, 0, 0, 101])).toEqual({ error: 'massa-gran' });
		expect(err([1, 0, 0, 1, 0, 1])).toEqual({ error: 'format' });
		expect(err([1, 0, 0, 1, 0, 1, 0, 7])).toEqual({ error: 'format' });
	});

	it('la taula de codis cobreix tots els reptes, sense repetits, i és estable', () => {
		for (const r of REPTES) expect(CODIS_REPTE_COMPARTIT, r.id).toContain(r.id);
		expect(new Set(CODIS_REPTE_COMPARTIT).size).toBe(CODIS_REPTE_COMPARTIT.length);
		// Fixat: només es pot afegir al final.
		expect(CODIS_REPTE_COMPARTIT.slice(0, 12)).toEqual([
			'cent-cims',
			'infantil',
			'totes-les-comarques',
			'les-4-estacions',
			'12-mesos-12-cims',
			'massis-montseny',
			'massis-montserrat',
			'massis-sant-llorenc-del-munt',
			'massis-ports',
			'massis-cadi-moixero',
			'massis-prades',
			'massis-montsec'
		]);
	});

	it('entradaCompartir porta les medalles reals, que no es poden recalcular des de l’enllaç', () => {
		// El mateix cim les 4 estacions del 2025: 1 segell, però la medalla de Les 4 estacions.
		const llista = ['2025-01-10', '2025-04-10', '2025-07-10', '2025-10-10'].map((d) => asc(1, d));
		const reals = medalles(llista, CATALEG, { avui: AVUI });
		expect(reals.map((m) => m.repteId)).toContain('les-4-estacions');

		const entrada = entradaCompartir(llista, CATALEG, { avui: AVUI });
		expect(entrada.ascensions).toHaveLength(1);
		expect(entrada.medalles).toEqual(reals);

		const rebut = ok(descodificaCarnet(codificaCarnet(entrada), CATALEG, AVUI));
		expect(rebut.medalles).toEqual(reals);
		const recalculades = medalles(ascensionsDeCarnetCompartit(rebut), CATALEG, { avui: AVUI });
		expect(recalculades.map((m) => m.repteId)).not.toContain('les-4-estacions');
	});

	it('entradaCompartir amb 100 Cims complet: medalla del 100', () => {
		const llista = Array.from({ length: 100 }, (_, i) => asc(i + 1, sumarDies('2024-01-01', i)));
		const e = entradaCompartir(llista, CATALEG, { avui: AVUI });
		expect(e.medalles).toContainEqual({ repteId: 'cent-cims', nivell: 1, data: '2024-04-09' });
	});
});
