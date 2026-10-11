/**
 * Format d'exportació versió 2 (bloc R1: companys i municipi d'origen) i compatibilitat de la
 * importació amb la versió 1.
 */
import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	FORMAT_EXPORTACIO,
	actualitzarAscensio,
	afegirAscensio,
	esborrarTot,
	exportarDades,
	importarDades,
	llistarAscensions,
	pendentsDeSincronitzar
} from './ascensions';
import { CIMS } from './catalog/cataleg';
import { obtenirBd, tancarBd } from './local/db';
import { establirRellotge } from './local/rellotge';
import { uuidv7 } from './local/uuid';
import { desarOrigen, llegirOrigen } from './origen';

const CIM_A = CIMS[0].id;
const CIM_B = CIMS[1].id;
const BARCELONA = '080193';
const GIRONA = '170792';

function fixar(iso: string) {
	establirRellotge(() => new Date(iso));
}

/** Fitxer de la versió 1, tal com l'exportava l'app abans de R1. */
function fitxerV1(ascensions: Record<string, unknown>[]) {
	return JSON.stringify({
		format: FORMAT_EXPORTACIO,
		versio: 1,
		app: 'carnetdecims.cat',
		exportatAt: '2026-09-01T10:00:00.000Z',
		catalegVersio: '2026-09-essencials',
		avis: '…',
		total: ascensions.length,
		ascensions
	});
}

const entradaV1 = (canvis: Record<string, unknown> = {}) => ({
	id: uuidv7(),
	cimId: CIM_A,
	cimNom: CIMS[0].nom,
	data: '2025-05-01',
	metode: 'a-peu',
	nota: 'del fitxer',
	createdAt: '2025-05-01T18:00:00.000Z',
	updatedAt: '2025-05-01T18:00:00.000Z',
	...canvis
});

const pref = () => obtenirBd().preferencies.get('origen');

beforeEach(async () => {
	fixar('2026-09-29T10:00:00.000Z');
	await esborrarTot();
});

afterEach(() => establirRellotge());
afterAll(() => tancarBd());

describe('exportació versió 2', () => {
	it('porta els companys de cada ascensió i el municipi d’origen amb el nom', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'boira',
			companys: ['Inesa', 'el Pau']
		});
		await desarOrigen(BARCELONA);
		const exp = JSON.parse(await exportarDades());
		expect(exp.versio).toBe(2);
		expect(exp.preferencies).toEqual({
			origen: { codi: BARCELONA, nom: 'Barcelona', updatedAt: '2026-09-29T10:00:00.000Z' }
		});
		expect(exp.ascensions).toEqual([
			{
				id: a.id,
				cimId: CIM_A,
				cimNom: CIMS[0].nom,
				data: '2026-09-20',
				metode: 'a-peu',
				nota: 'boira',
				companys: ['Inesa', 'el Pau'],
				createdAt: a.createdAt,
				updatedAt: a.updatedAt
			}
		]);
	});

	it('sense origen (o després de treure’l) exporta origen: null', async () => {
		expect(JSON.parse(await exportarDades()).preferencies).toEqual({ origen: null });
		await desarOrigen(BARCELONA);
		await desarOrigen(null);
		expect(JSON.parse(await exportarDades()).preferencies).toEqual({ origen: null });
	});

	it('exportar → esborrarTot → importar recupera companys i origen; reimportar és idempotent', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		const b = await afegirAscensio({ cimId: CIM_B, data: '2026-09-21', metode: 'btt' });
		await desarOrigen(GIRONA);
		const json = await exportarDades();
		await esborrarTot();
		expect(await llegirOrigen()).toBeNull();

		expect(await importarDades(json, 'fusionar')).toEqual({
			afegides: 2,
			actualitzades: 0,
			ignorades: 0,
			origenImportat: true
		});
		expect(await llistarAscensions()).toEqual([b, a]);
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: GIRONA,
			updatedAt: '2026-09-29T10:00:00.000Z',
			pendent: 1
		});
		for (const mode of ['fusionar', 'substituir'] as const) {
			expect(await importarDades(json, mode)).toEqual({
				afegides: 0,
				actualitzades: 0,
				ignorades: 2
			});
		}
	});
});

describe('importació de la versió 2', () => {
	it('fusionar: els companys del fitxer guanyen si la fila del fitxer és més nova', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		const exp = JSON.parse(await exportarDades());
		exp.ascensions[0].companys = ['Mar', 'Pol'];
		exp.ascensions[0].updatedAt = '2026-09-29T10:30:00.000Z';
		fixar('2026-09-29T11:00:00.000Z');
		expect(await importarDades(JSON.stringify(exp), 'fusionar')).toMatchObject({
			actualitzades: 1
		});
		expect((await llistarAscensions())[0].companys).toEqual(['Mar', 'Pol']);
		// Una edició local posterior guanya al fitxer.
		await actualitzarAscensio(a.id, { companys: [] });
		expect(await importarDades(JSON.stringify(exp), 'fusionar')).toMatchObject({ ignorades: 1 });
		expect((await llistarAscensions())[0].companys).toEqual([]);
	});

	it('substituir: una diferència només de companys també se sobreescriu', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		const json = await exportarDades();
		await actualitzarAscensio(a.id, { companys: ['Inesa', 'Pau'] });
		fixar('2026-09-29T12:00:00.000Z');
		expect(await importarDades(json, 'substituir')).toEqual({
			afegides: 0,
			actualitzades: 1,
			ignorades: 0
		});
		const [fila] = await llistarAscensions();
		expect(fila.companys).toEqual(['Inesa']);
		expect(fila.updatedAt).toBe('2026-09-29T12:00:00.000Z');
	});

	it('normalitza els companys del fitxer i ignora les entrades amb companys invàlids', async () => {
		const bona = entradaV1({ companys: ['  Inesa ', 'inesa', '', 'Pau'] });
		const fitxer = {
			format: FORMAT_EXPORTACIO,
			versio: 2,
			ascensions: [
				bona,
				entradaV1({ companys: 'Inesa' }),
				entradaV1({ companys: ['x'.repeat(41)] }),
				entradaV1({ companys: Array.from({ length: 11 }, (_, i) => `c${i}`) }),
				entradaV1({ companys: [1, 2] })
			]
		};
		expect(await importarDades(JSON.stringify(fitxer), 'fusionar')).toEqual({
			afegides: 1,
			actualitzades: 0,
			ignorades: 4
		});
		expect(await llistarAscensions()).toMatchObject([{ id: bona.id, companys: ['Inesa', 'Pau'] }]);
	});

	it('origen: fusionar aplica LWW; un fitxer sense origen no esborra el local', async () => {
		fixar('2026-09-29T10:00:00.000Z');
		await desarOrigen(BARCELONA);
		const fitxer = (origen: unknown) =>
			JSON.stringify({
				format: FORMAT_EXPORTACIO,
				versio: 2,
				preferencies: { origen },
				ascensions: []
			});
		// Més antic que el local: no canvia.
		expect(
			await importarDades(
				fitxer({ codi: GIRONA, updatedAt: '2026-09-28T10:00:00.000Z' }),
				'fusionar'
			)
		).toEqual({ afegides: 0, actualitzades: 0, ignorades: 0 });
		expect(await llegirOrigen()).toBe(BARCELONA);
		// Sense origen: tampoc.
		await importarDades(fitxer(null), 'fusionar');
		expect(await llegirOrigen()).toBe(BARCELONA);
		// Més nou: guanya el fitxer i queda pendent de pujar.
		fixar('2026-09-29T12:00:00.000Z');
		expect(
			await importarDades(
				fitxer({ codi: GIRONA, updatedAt: '2026-09-29T11:00:00.000Z' }),
				'fusionar'
			)
		).toMatchObject({ origenImportat: true });
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: GIRONA,
			updatedAt: '2026-09-29T11:00:00.000Z',
			pendent: 1
		});
	});

	it('origen: substituir deixa el del fitxer (també si no n’hi ha), amb updatedAt nou', async () => {
		await desarOrigen(BARCELONA);
		const fitxer = (origen: unknown) =>
			JSON.stringify({
				format: FORMAT_EXPORTACIO,
				versio: 2,
				preferencies: { origen },
				ascensions: []
			});
		fixar('2026-09-29T12:00:00.000Z');
		await importarDades(
			fitxer({ codi: GIRONA, updatedAt: '2020-01-01T00:00:00.000Z' }),
			'substituir'
		);
		expect(await pref()).toMatchObject({
			valor: GIRONA,
			updatedAt: '2026-09-29T12:00:00.000Z',
			pendent: 1
		});
		fixar('2026-09-29T13:00:00.000Z');
		expect(await importarDades(fitxer(null), 'substituir')).toMatchObject({
			origenImportat: true
		});
		expect(await pref()).toMatchObject({
			valor: null,
			updatedAt: '2026-09-29T13:00:00.000Z',
			pendent: 1
		});
		// Ja no n'hi ha: tornar-ho a importar no canvia res.
		expect(await importarDades(fitxer(null), 'substituir')).not.toHaveProperty('origenImportat');
	});

	it('un origen amb format invàlid o instant futur s’ignora (la resta s’importa)', async () => {
		await desarOrigen(BARCELONA);
		const abans = await pref();
		for (const origen of [
			{ codi: 'Barcelona', updatedAt: '2026-09-29T11:00:00.000Z' },
			{ codi: '08019', updatedAt: '2026-09-29T11:00:00.000Z' },
			{ codi: GIRONA, updatedAt: 'ahir' },
			{ codi: GIRONA, updatedAt: '2030-01-01T00:00:00.000Z' },
			{ codi: GIRONA },
			'girona',
			42
		]) {
			const json = JSON.stringify({
				format: FORMAT_EXPORTACIO,
				versio: 2,
				preferencies: { origen },
				ascensions: [entradaV1()]
			});
			for (const mode of ['fusionar', 'substituir'] as const) {
				const r = await importarDades(json, mode);
				expect(r).not.toHaveProperty('origenImportat');
			}
		}
		expect(await pref()).toEqual(abans);
	});
});

describe('importació de la versió 1 (fitxers anteriors a R1)', () => {
	it('s’accepta: les ascensions entren sense companys ([] en llegir-les)', async () => {
		const e = entradaV1();
		expect(await importarDades(fitxerV1([e]), 'fusionar')).toEqual({
			afegides: 1,
			actualitzades: 0,
			ignorades: 0
		});
		expect(await llistarAscensions()).toEqual([
			{
				id: e.id,
				cimId: CIM_A,
				data: '2025-05-01',
				metode: 'a-peu',
				nota: 'del fitxer',
				companys: [],
				createdAt: e.createdAt,
				updatedAt: e.updatedAt,
				deletedAt: null
			}
		]);
		// La fila es desa sense la clau: en pujar-la, el servidor conservarà els companys que tingui.
		expect('companys' in (await obtenirBd().ascensions.get(e.id))!).toBe(false);
		expect(await pendentsDeSincronitzar()).toHaveLength(1);
	});

	it('fusionar: no esborra els companys locals encara que el fitxer sigui més nou', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'local',
			companys: ['Inesa']
		});
		const json = fitxerV1([
			entradaV1({
				id: a.id,
				data: '2026-09-20',
				nota: 'del fitxer',
				createdAt: a.createdAt,
				updatedAt: '2026-09-29T10:30:00.000Z'
			})
		]);
		fixar('2026-09-29T11:00:00.000Z');
		expect(await importarDades(json, 'fusionar')).toMatchObject({ actualitzades: 1 });
		expect(await llistarAscensions()).toMatchObject([
			{ id: a.id, nota: 'del fitxer', companys: ['Inesa'] }
		]);
	});

	it('substituir: els companys no compten com a diferència ni es perden', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'igual',
			companys: ['Inesa']
		});
		const igual = entradaV1({
			id: a.id,
			data: '2026-09-20',
			nota: 'igual',
			createdAt: a.createdAt,
			updatedAt: a.updatedAt
		});
		expect(await importarDades(fitxerV1([igual]), 'substituir')).toEqual({
			afegides: 0,
			actualitzades: 0,
			ignorades: 1
		});
		fixar('2026-09-29T12:00:00.000Z');
		expect(
			await importarDades(fitxerV1([{ ...igual, nota: 'canviada' }]), 'substituir')
		).toMatchObject({ actualitzades: 1 });
		expect(await llistarAscensions()).toMatchObject([
			{ id: a.id, nota: 'canviada', companys: ['Inesa'] }
		]);
	});

	it('no toca el municipi d’origen del dispositiu (en cap mode)', async () => {
		await desarOrigen(BARCELONA);
		const abans = await pref();
		for (const mode of ['fusionar', 'substituir'] as const) {
			const r = await importarDades(fitxerV1([entradaV1()]), mode);
			expect(r).not.toHaveProperty('origenImportat');
		}
		expect(await pref()).toEqual(abans);
	});
});
