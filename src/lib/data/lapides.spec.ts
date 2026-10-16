/**
 * Minimització de dades a les làpides (bloc R1, `local/lapides.ts`): una ascensió esborrada
 * conserva la nota i els companys només durant la finestra de desfer (10 min); després es buida
 * (en local i, via la cua, al núvol). Vegeu `docs/03-modelo-datos.md` §2.
 */
import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	FORMAT_EXPORTACIO,
	afegirAscensio,
	esborrarAscensio,
	esborrarTot,
	exportarDades,
	importarDades,
	llistarAscensions,
	pendentsDeSincronitzar,
	restaurarAscensio
} from './ascensions';
import { CIMS } from './catalog/cataleg';
import { obtenirBd, tancarBd, type FilaAscensio } from './local/db';
import {
	FINESTRA_DESFER_MS,
	foraDeFinestra,
	lapidaBuidada,
	lapidaPerBuidar,
	purgarLapides,
	senseDiari,
	teDiari
} from './local/lapides';
import { establirRellotge } from './local/rellotge';
import { uuidv7 } from './local/uuid';

const CIM_A = CIMS[0].id;
const CIM_B = CIMS[1].id;

const T0 = '2026-09-29T10:00:00.000Z';
/** Instant `ms` mil·lisegons després de `T0`. */
const despres = (ms: number) => new Date(Date.parse(T0) + ms).toISOString();

function fixar(iso: string) {
	establirRellotge(() => new Date(iso));
}

const fila = (canvis: Partial<FilaAscensio> = {}): FilaAscensio => ({
	id: uuidv7(),
	cimId: CIM_A,
	data: '2026-09-20',
	metode: 'a-peu',
	nota: 'amb boira',
	companys: ['Inesa'],
	createdAt: '2026-09-20T18:00:00.000Z',
	updatedAt: T0,
	deletedAt: T0,
	...canvis
});

const filaLocal = (id: string) => obtenirBd().ascensions.get(id);

/** Registra una ascensió amb nota i companys i l'esborra a `T0`. */
async function esborradaAmbDiari() {
	fixar('2026-09-29T09:00:00.000Z');
	const a = await afegirAscensio({
		cimId: CIM_A,
		data: '2026-09-20',
		metode: 'a-peu',
		nota: 'amb boira',
		companys: ['Inesa', 'el Pau']
	});
	fixar(T0);
	await esborrarAscensio(a.id);
	return a;
}

beforeEach(async () => {
	fixar(T0);
	await esborrarTot();
});

afterEach(() => establirRellotge());

afterAll(() => tancarBd());

describe('funcions pures', () => {
	it('foraDeFinestra: només làpides amb `deletedAt` de fa 10 min o més', () => {
		const ara = new Date(despres(FINESTRA_DESFER_MS));
		expect(FINESTRA_DESFER_MS).toBe(10 * 60_000);
		expect(foraDeFinestra({ deletedAt: null }, ara)).toBe(false);
		expect(foraDeFinestra({ deletedAt: T0 }, ara)).toBe(true);
		expect(foraDeFinestra({ deletedAt: despres(1) }, ara)).toBe(false);
		// Rellotge d'un altre dispositiu avançat: la làpida "del futur" encara és dins.
		expect(foraDeFinestra({ deletedAt: despres(FINESTRA_DESFER_MS + 5_000) }, ara)).toBe(false);
		expect(foraDeFinestra({ deletedAt: 'no és una data' }, ara)).toBe(false);
	});

	it('teDiari: nota, companys o sense la clau `companys` (el núvol en podria tenir)', () => {
		expect(teDiari({ nota: null, companys: [] })).toBe(false);
		expect(teDiari({ nota: 'n', companys: [] })).toBe(true);
		expect(teDiari({ nota: null, companys: ['Inesa'] })).toBe(true);
		expect(teDiari({ nota: null })).toBe(true);
	});

	it('senseDiari i lapidaBuidada: nota null, companys [] i `updatedAt` + 1 ms', () => {
		const f = fila({ companys: undefined, updatedAt: '2026-09-29T10:00:00.999Z' });
		expect(senseDiari(f)).toEqual({ ...f, nota: null, companys: [] });
		const b = lapidaBuidada(f);
		expect(b).toEqual({ ...f, nota: null, companys: [], updatedAt: '2026-09-29T10:00:01.000Z' });
		// Determinista: no depèn del rellotge.
		fixar('2030-01-01T00:00:00.000Z');
		expect(lapidaBuidada(f)).toEqual(b);
		expect(b.deletedAt! <= b.updatedAt).toBe(true); // check `deleted_at <= updated_at` del núvol
	});

	it('lapidaPerBuidar: làpida fora de la finestra amb dades', () => {
		const ara = new Date(despres(FINESTRA_DESFER_MS));
		expect(lapidaPerBuidar(fila(), ara)).toBe(true);
		expect(lapidaPerBuidar(fila({ deletedAt: null }), ara)).toBe(false);
		expect(lapidaPerBuidar(fila({ nota: null, companys: [] }), ara)).toBe(false);
		expect(lapidaPerBuidar(fila(), new Date(despres(FINESTRA_DESFER_MS - 1)))).toBe(false);
	});
});

describe('esborrar i desfer', () => {
	it('dins de la finestra, la làpida conserva el diari i "Desfés" la torna sencera', async () => {
		const a = await esborradaAmbDiari();
		expect(await filaLocal(a.id)).toMatchObject({
			deletedAt: T0,
			nota: 'amb boira',
			companys: ['Inesa', 'el Pau']
		});
		fixar(despres(FINESTRA_DESFER_MS - 1));
		expect(await purgarLapides(obtenirBd())).toBe(0);
		const r = await restaurarAscensio(a.id);
		expect(r).toMatchObject({ deletedAt: null, nota: 'amb boira', companys: ['Inesa', 'el Pau'] });
	});

	it('fora de la finestra, "Desfés" la torna sense nota ni companys (encara que la purga no hagi passat)', async () => {
		const a = await esborradaAmbDiari();
		fixar(despres(FINESTRA_DESFER_MS));
		// La purga no ha passat: la làpida encara té el diari.
		expect((await filaLocal(a.id))?.nota).toBe('amb boira');
		const r = await restaurarAscensio(a.id);
		expect(r).toMatchObject({ deletedAt: null, nota: null, companys: [] });
		expect(r.updatedAt).toBe(despres(FINESTRA_DESFER_MS));
		expect(await llistarAscensions()).toEqual([r]);
		expect(await filaLocal(a.id)).toMatchObject({ nota: null, companys: [] });
	});

	it('fora de la finestra i ja purgada: "Desfés" també la torna sense diari', async () => {
		const a = await esborradaAmbDiari();
		fixar(despres(FINESTRA_DESFER_MS + 60_000));
		expect(await purgarLapides(obtenirBd())).toBe(1);
		const r = await restaurarAscensio(a.id);
		expect(r).toMatchObject({ deletedAt: null, nota: null, companys: [] });
	});
});

describe('purgarLapides', () => {
	it('buida i encua només les làpides fora de la finestra amb dades', async () => {
		const bd = obtenirBd();
		const vella = fila();
		const recent = fila({ deletedAt: despres(1), updatedAt: despres(1) });
		const senseClau = fila({ nota: null, companys: undefined });
		const jaBuida = fila({ nota: null, companys: [] });
		const viva = fila({ deletedAt: null });
		await bd.ascensions.bulkAdd([vella, recent, senseClau, jaBuida, viva]);

		fixar(despres(FINESTRA_DESFER_MS));
		expect(await purgarLapides(bd)).toBe(2);

		expect(await filaLocal(vella.id)).toEqual({
			...vella,
			nota: null,
			companys: [],
			updatedAt: despres(1)
		});
		expect(await filaLocal(senseClau.id)).toMatchObject({ nota: null, companys: [] });
		expect(await filaLocal(recent.id)).toEqual(recent);
		expect(await filaLocal(jaBuida.id)).toEqual(jaBuida);
		expect(await filaLocal(viva.id)).toEqual(viva);
		const cua = await pendentsDeSincronitzar();
		expect(cua.map((e) => e.ascensioId).sort()).toEqual([vella.id, senseClau.id].sort());
		expect(cua.every((e) => e.intents === 0 && e.encuaAt === despres(1))).toBe(true);
	});

	it('és idempotent: una segona passada no escriu res', async () => {
		const bd = obtenirBd();
		await bd.ascensions.add(fila());
		fixar(despres(FINESTRA_DESFER_MS));
		expect(await purgarLapides(bd)).toBe(1);
		const buidada = await bd.ascensions.toArray();
		await bd.outbox.clear(); // com si la sync ja l'hagués pujat
		fixar(despres(FINESTRA_DESFER_MS * 3));
		expect(await purgarLapides(bd)).toBe(0);
		expect(await pendentsDeSincronitzar()).toEqual([]);
		expect(await bd.ascensions.toArray()).toEqual(buidada);
	});

	it('reinicia els intents d’una entrada bloquejada de la mateixa fila', async () => {
		const bd = obtenirBd();
		const f = fila();
		await bd.ascensions.add(f);
		await bd.outbox.put({ ascensioId: f.id, encuaAt: T0, intents: 7 });
		fixar(despres(FINESTRA_DESFER_MS));
		await purgarLapides(bd);
		expect(await bd.outbox.get(f.id)).toEqual({
			ascensioId: f.id,
			encuaAt: despres(1),
			intents: 0
		});
	});

	it('`comprovar` s’executa abans d’escriure: si llança, no s’escriu res', async () => {
		const bd = obtenirBd();
		const f = fila();
		await bd.ascensions.add(f);
		fixar(despres(FINESTRA_DESFER_MS));
		await expect(
			purgarLapides(bd, async () => {
				throw new Error('època canviada');
			})
		).rejects.toThrow('època canviada');
		expect(await filaLocal(f.id)).toEqual(f);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('s’executa en obrir la BD', async () => {
		const f = fila();
		await obtenirBd().ascensions.add(f);
		tancarBd();
		fixar(despres(FINESTRA_DESFER_MS));
		// Primera lectura després d'obrir: ja veu la làpida buida.
		expect(await filaLocal(f.id)).toMatchObject({ nota: null, companys: [] });
		expect((await pendentsDeSincronitzar()).map((e) => e.ascensioId)).toEqual([f.id]);
	});
});

describe('exportació i importació', () => {
	it('exportarDades no inclou les làpides (ni la seva nota ni els companys) dins de la finestra', async () => {
		const a = await esborradaAmbDiari();
		await afegirAscensio({ cimId: CIM_B, data: '2026-09-21', metode: 'btt', nota: 'viva' });
		const text = await exportarDades();
		const exp = JSON.parse(text);
		expect(exp.format).toBe(FORMAT_EXPORTACIO);
		expect(exp.ascensions.map((x: { id: string }) => x.id)).not.toContain(a.id);
		expect(text).not.toContain('amb boira');
		expect(text).not.toContain('el Pau');
	});

	it('importar en mode substituir deixa làpides ja buides (no es poden desfer)', async () => {
		const local = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'local',
			companys: ['Inesa']
		});
		const fitxer = JSON.stringify({
			format: FORMAT_EXPORTACIO,
			versio: 2,
			ascensions: [
				{
					id: uuidv7(),
					cimId: CIM_B,
					data: '2026-09-21',
					metode: 'btt',
					nota: null,
					companys: [],
					createdAt: T0,
					updatedAt: T0
				}
			]
		});
		fixar(despres(1_000));
		await importarDades(fitxer, 'substituir');
		const f = await filaLocal(local.id);
		expect(f?.deletedAt).not.toBeNull();
		expect(f).toMatchObject({ nota: null, companys: [] });
	});
});
