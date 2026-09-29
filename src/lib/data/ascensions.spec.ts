import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Ascensio } from '$lib/domain';
import {
	CODIS_ERROR_VALIDACIO,
	ErrorAscensioNoTrobada,
	ErrorImportacio,
	ErrorValidacio,
	FORMAT_EXPORTACIO,
	NOTA_MAX,
	actualitzarAscensio,
	afegirAscensio,
	ascensionsVives,
	ascensionsVivesAmbEstat,
	esborrarAscensio,
	esborrarTot,
	exportarDades,
	importarDades,
	llistarAscensions,
	pendentsDeSincronitzar,
	restaurarAscensio,
	validarAscensio,
	type NovaAscensio
} from './ascensions';
import { CIMS } from './catalog/cataleg';
import { CarnetDb, NOM_BD, obtenirBd, tancarBd } from './local/db';
import { establirRellotge } from './local/rellotge';
import { esUuid, uuidv7 } from './local/uuid';

const CIM_A = CIMS[0].id;
const CIM_B = CIMS[1].id;
const CIM_INEXISTENT = 999_999;

/** Fixa el rellotge a un instant UTC (Madrid = UTC+2 a l'estiu). */
function fixar(iso: string) {
	establirRellotge(() => new Date(iso));
}

const nova = (canvis: Partial<NovaAscensio> = {}): NovaAscensio => ({
	cimId: CIM_A,
	data: '2026-09-20',
	metode: 'a-peu',
	...canvis
});

async function errorDe(p: Promise<unknown>): Promise<ErrorValidacio> {
	const e = await p.then(
		() => null,
		(err: unknown) => err
	);
	expect(e).toBeInstanceOf(ErrorValidacio);
	return e as ErrorValidacio;
}

beforeEach(async () => {
	fixar('2026-09-29T10:00:00.000Z');
	await esborrarTot();
});

afterEach(() => {
	establirRellotge();
	vi.unstubAllGlobals();
});

afterAll(() => tancarBd());

describe('uuidv7', () => {
	it('genera UUID v7 vàlids, únics i ordenats pel temps', () => {
		const a = uuidv7(1_700_000_000_000);
		const b = uuidv7(1_700_000_000_001);
		expect(esUuid(a)).toBe(true);
		expect(a[14]).toBe('7');
		expect('89ab').toContain(a[19]);
		expect(a < b).toBe(true);
		expect(a.slice(0, 13).replace('-', '')).toBe(
			(1_700_000_000_000).toString(16).padStart(12, '0')
		);
		expect(new Set(Array.from({ length: 500 }, () => uuidv7())).size).toBe(500);
	});

	it('esUuid rebutja formats no canònics', () => {
		expect(esUuid('not-a-uuid')).toBe(false);
		expect(esUuid('0192F2A0-0000-7000-8000-000000000000')).toBe(false);
		expect(esUuid(42)).toBe(false);
	});
});

describe('esquema', () => {
	it('BD carnetdecims amb ascensions i outbox indexades', async () => {
		const bd = obtenirBd();
		await bd.open();
		expect(bd.name).toBe(NOM_BD);
		expect(bd.verno).toBe(1);
		const idx = bd.ascensions.schema.indexes.map((i) => i.name).sort();
		expect(bd.ascensions.schema.primKey.name).toBe('id');
		expect(idx).toEqual(['cimId', 'data', 'deletedAt', 'updatedAt']);
		expect(bd.outbox.schema.primKey.name).toBe('ascensioId');
		expect(new CarnetDb('x').tables.map((t) => t.name).sort()).toEqual(['ascensions', 'outbox']);
	});
});

describe('afegirAscensio', () => {
	it('desa, genera id/timestamps i encua a outbox', async () => {
		const a = await afegirAscensio(nova({ nota: '  Boira al cim  ' }));
		expect(esUuid(a.id)).toBe(true);
		expect(a).toMatchObject({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'Boira al cim',
			createdAt: '2026-09-29T10:00:00.000Z',
			updatedAt: '2026-09-29T10:00:00.000Z',
			deletedAt: null
		});
		expect(await llistarAscensions()).toEqual([a]);
		expect(await pendentsDeSincronitzar()).toEqual([
			{ ascensioId: a.id, encuaAt: '2026-09-29T10:00:00.000Z', intents: 0 }
		]);
	});

	it('nota buida o d’espais → null; salts de línia normalitzats', async () => {
		expect((await afegirAscensio(nova({ nota: '   ' }))).nota).toBeNull();
		expect((await afegirAscensio(nova({ nota: 'a\r\nb' }))).nota).toBe('a\nb');
	});

	it('permet repetir el mateix cim (historial)', async () => {
		await afegirAscensio(nova());
		await afegirAscensio(nova());
		expect(await llistarAscensions()).toHaveLength(2);
	});

	describe('dates límit', () => {
		it('2006-07-01 és vàlida; 2006-06-30 no', async () => {
			await expect(afegirAscensio(nova({ data: '2006-07-01' }))).resolves.toBeTruthy();
			const e = await errorDe(afegirAscensio(nova({ data: '2006-06-30' })));
			expect(e.codi).toBe('data:anterior-inici');
			expect(e.camp).toBe('data');
		});

		it('avui és vàlida; demà és futura', async () => {
			await expect(afegirAscensio(nova({ data: '2026-09-29' }))).resolves.toBeTruthy();
			expect((await errorDe(afegirAscensio(nova({ data: '2026-09-30' })))).codi).toBe(
				'data:futura'
			);
		});

		it('"avui" és la data local de Madrid, no la UTC', async () => {
			fixar('2026-09-29T21:30:00.000Z'); // 23:30 a Madrid, encara dia 29
			expect((await errorDe(afegirAscensio(nova({ data: '2026-09-30' })))).codi).toBe(
				'data:futura'
			);
			fixar('2026-09-29T22:30:00.000Z'); // 00:30 del dia 30 a Madrid
			await expect(afegirAscensio(nova({ data: '2026-09-30' }))).resolves.toBeTruthy();
		});

		it('format i dates impossibles', async () => {
			for (const data of ['20-09-2026', '2026-02-30', '2026-09-20T10:00', '']) {
				expect((await errorDe(afegirAscensio(nova({ data })))).codi).toBe('data:format');
			}
		});
	});

	it('cim desconegut, mètode invàlid i nota massa llarga', async () => {
		const e1 = await errorDe(afegirAscensio(nova({ cimId: CIM_INEXISTENT })));
		expect([e1.camp, e1.codi]).toEqual(['cimId', 'cimId:desconegut']);
		expect((await errorDe(afegirAscensio(nova({ cimId: 1.5 })))).codi).toBe('cimId:desconegut');
		const e2 = await errorDe(afegirAscensio(nova({ metode: 'cotxe' as never })));
		expect([e2.camp, e2.codi]).toEqual(['metode', 'metode:invalid']);
		const e3 = await errorDe(afegirAscensio(nova({ nota: 'x'.repeat(NOTA_MAX + 1) })));
		expect([e3.camp, e3.codi]).toEqual(['nota', 'nota:massa-llarga']);
		expect((await errorDe(afegirAscensio(nova({ nota: 7 as never })))).codi).toBe('nota:format');
		expect(await llistarAscensions()).toEqual([]);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('el límit de la nota compta caràcters Unicode, no unitats UTF-16', async () => {
		const a = await afegirAscensio(nova({ nota: '⛰️'.repeat(NOTA_MAX / 2) }));
		expect(a.nota).toHaveLength(NOTA_MAX);
		await expect(afegirAscensio(nova({ nota: '🏔'.repeat(NOTA_MAX) }))).resolves.toBeTruthy();
	});
});

describe('validarAscensio', () => {
	it('retorna tots els errors, en ordre de camp, amb codis estables', () => {
		const errs = validarAscensio(
			{ cimId: CIM_INEXISTENT, data: '2027-01-01', metode: 'moto', nota: 'x'.repeat(501) },
			'2026-09-29'
		);
		expect(errs.map((e) => e.codi)).toEqual([
			'cimId:desconegut',
			'data:futura',
			'metode:invalid',
			'nota:massa-llarga'
		]);
		for (const e of errs) expect(CODIS_ERROR_VALIDACIO).toContain(e.codi);
		expect(validarAscensio(nova(), '2026-09-29')).toEqual([]);
		expect(validarAscensio(null, '2026-09-29').map((e) => e.camp)).toEqual([
			'cimId',
			'data',
			'metode'
		]);
	});
});

describe('actualitzarAscensio', () => {
	it('modifica, revalida, avança updatedAt i encua', async () => {
		const a = await afegirAscensio(nova({ nota: 'hola' }));
		fixar('2026-09-29T11:00:00.000Z');
		const b = await actualitzarAscensio(a.id, { data: '2026-09-21', metode: 'raquetes' });
		expect(b).toMatchObject({
			id: a.id,
			cimId: CIM_A,
			data: '2026-09-21',
			metode: 'raquetes',
			nota: 'hola',
			createdAt: a.createdAt,
			updatedAt: '2026-09-29T11:00:00.000Z'
		});
		expect(await llistarAscensions()).toEqual([b]);
		const outbox = await pendentsDeSincronitzar();
		expect(outbox).toEqual([{ ascensioId: a.id, encuaAt: '2026-09-29T11:00:00.000Z', intents: 0 }]);
	});

	it("nota '' l'esborra; nota absent la conserva", async () => {
		const a = await afegirAscensio(nova({ nota: 'hola' }));
		expect((await actualitzarAscensio(a.id, { metode: 'btt' })).nota).toBe('hola');
		expect((await actualitzarAscensio(a.id, { nota: '' })).nota).toBeNull();
	});

	it('updatedAt estrictament creixent amb el rellotge aturat (LWW)', async () => {
		const a = await afegirAscensio(nova());
		const b = await actualitzarAscensio(a.id, { metode: 'esqui' });
		expect(b.updatedAt > a.updatedAt).toBe(true);
	});

	it('rebutja canvis no vàlids sense modificar res', async () => {
		const a = await afegirAscensio(nova());
		expect((await errorDe(actualitzarAscensio(a.id, { data: '2026-10-01' }))).codi).toBe(
			'data:futura'
		);
		expect(await llistarAscensions()).toEqual([a]);
	});

	it('error si no existeix o està esborrada', async () => {
		await expect(actualitzarAscensio(uuidv7(), { metode: 'btt' })).rejects.toBeInstanceOf(
			ErrorAscensioNoTrobada
		);
		const a = await afegirAscensio(nova());
		await esborrarAscensio(a.id);
		await expect(actualitzarAscensio(a.id, { metode: 'btt' })).rejects.toMatchObject({
			codi: 'ascensio:no-trobada'
		});
	});
});

describe('esborrar i restaurar (tombstones)', () => {
	it('esborrar deixa làpida, la treu de la llista i encua', async () => {
		const a = await afegirAscensio(nova());
		fixar('2026-09-29T12:00:00.000Z');
		await esborrarAscensio(a.id);
		expect(await llistarAscensions()).toEqual([]);
		const fila = await obtenirBd().ascensions.get(a.id);
		expect(fila).toMatchObject({
			deletedAt: '2026-09-29T12:00:00.000Z',
			updatedAt: '2026-09-29T12:00:00.000Z'
		});
		expect((await pendentsDeSincronitzar())[0].encuaAt).toBe('2026-09-29T12:00:00.000Z');
		// Idempotent
		await esborrarAscensio(a.id);
		expect((await obtenirBd().ascensions.get(a.id))?.deletedAt).toBe('2026-09-29T12:00:00.000Z');
	});

	it('restaurar (Desfés) la torna a la llista amb updatedAt nou', async () => {
		const a = await afegirAscensio(nova({ nota: 'n' }));
		await esborrarAscensio(a.id);
		const r = await restaurarAscensio(a.id);
		expect(r).toMatchObject({ id: a.id, nota: 'n', deletedAt: null });
		expect(r.updatedAt > a.updatedAt).toBe(true);
		expect(await llistarAscensions()).toEqual([r]);
		expect(await restaurarAscensio(a.id)).toEqual(r); // idempotent
	});

	it('error amb ids inexistents', async () => {
		await expect(esborrarAscensio(uuidv7())).rejects.toBeInstanceOf(ErrorAscensioNoTrobada);
		await expect(restaurarAscensio(uuidv7())).rejects.toBeInstanceOf(ErrorAscensioNoTrobada);
	});
});

describe('ordre de llistarAscensions', () => {
	it('data desc i, dins del mateix dia, createdAt desc', async () => {
		fixar('2026-09-29T08:00:00.000Z');
		const x = await afegirAscensio(nova({ data: '2026-09-10' }));
		fixar('2026-09-29T09:00:00.000Z');
		const y = await afegirAscensio(nova({ data: '2026-09-20' }));
		fixar('2026-09-29T10:00:00.000Z');
		const z = await afegirAscensio(nova({ data: '2026-09-10', cimId: CIM_B }));
		fixar('2026-09-29T11:00:00.000Z');
		const w = await afegirAscensio(nova({ data: '2010-05-01' }));
		expect((await llistarAscensions()).map((a) => a.id)).toEqual([y.id, z.id, x.id, w.id]);
	});
});

describe('stores vius', () => {
	function seguent<T>(
		store: { subscribe(run: (v: T) => void): () => void },
		fins: (v: T) => boolean
	) {
		const valors: T[] = [];
		let unsub = () => {};
		const p = new Promise<T[]>((resolve) => {
			unsub = store.subscribe((v) => {
				valors.push(v);
				if (fins(v)) resolve(valors);
			});
		});
		return { p, unsub: () => unsub() };
	}

	it('ascensionsVives emet de seguida i després cada canvi', async () => {
		const s = seguent<Ascensio[]>(ascensionsVives(), (v) => v.length === 2);
		await new Promise((r) => setTimeout(r, 20));
		const a = await afegirAscensio(nova({ data: '2026-09-01' }));
		const b = await afegirAscensio(nova({ data: '2026-09-02' }));
		const valors = await s.p;
		expect(Array.isArray(valors[0])).toBe(true); // síncron
		expect(valors.at(-1)?.map((x) => x.id)).toEqual([b.id, a.id]);
		s.unsub();

		const t = seguent<Ascensio[]>(ascensionsVives(), (v) => v.length === 0);
		await esborrarAscensio(a.id);
		await esborrarTot();
		expect((await t.p).at(-1)).toEqual([]);
		t.unsub();
	});

	it('ascensionsVivesAmbEstat indica quan ja ha carregat', async () => {
		await afegirAscensio(nova());
		const s = seguent(ascensionsVivesAmbEstat(), (v) => v.carregat && v.ascensions.length === 1);
		const valors = await s.p;
		expect(valors.at(-1)?.carregat).toBe(true);
		s.unsub();
	});

	it('en SSR (sense IndexedDB) emet [] i no toca la BD', () => {
		vi.stubGlobal('indexedDB', undefined);
		const run = vi.fn();
		const unsub = ascensionsVives().subscribe(run);
		expect(run).toHaveBeenCalledTimes(1);
		expect(Array.isArray(run.mock.calls[0][0])).toBe(true);
		unsub();
		const run2 = vi.fn();
		ascensionsVivesAmbEstat().subscribe(run2)();
		expect(run2).toHaveBeenCalledTimes(1);
	});
});

describe('exportar i importar', () => {
	it('exporta JSON versionat amb metadades i sense làpides', async () => {
		const a = await afegirAscensio(nova({ nota: 'n' }));
		const b = await afegirAscensio(nova({ cimId: CIM_B }));
		await esborrarAscensio(b.id);
		const exp = JSON.parse(await exportarDades());
		expect(exp).toMatchObject({
			format: FORMAT_EXPORTACIO,
			versio: 1,
			app: 'carnetdecims.cat',
			exportatAt: '2026-09-29T10:00:00.000Z',
			total: 1
		});
		expect(exp.catalegVersio).toBeTruthy();
		expect(exp.avis).toMatch(/FEEC/);
		expect(exp.ascensions).toEqual([
			{
				id: a.id,
				cimId: CIM_A,
				cimNom: CIMS[0].nom,
				data: a.data,
				metode: 'a-peu',
				nota: 'n',
				createdAt: a.createdAt,
				updatedAt: a.updatedAt
			}
		]);
	});

	it('exportar → esborrarTot → importar recupera les dades; reimportar és idempotent', async () => {
		const a = await afegirAscensio(nova({ nota: 'n' }));
		const b = await afegirAscensio(nova({ cimId: CIM_B, data: '2015-01-01' }));
		const json = await exportarDades();
		await esborrarTot();
		expect(await importarDades(json, 'fusionar')).toEqual({
			afegides: 2,
			actualitzades: 0,
			ignorades: 0
		});
		expect(await llistarAscensions()).toEqual([a, b]);
		expect(await importarDades(json, 'fusionar')).toEqual({
			afegides: 0,
			actualitzades: 0,
			ignorades: 2
		});
		expect(await importarDades(json, 'substituir')).toEqual({
			afegides: 0,
			actualitzades: 0,
			ignorades: 2
		});
		expect(await llistarAscensions()).toEqual([a, b]);
		expect((await pendentsDeSincronitzar()).map((o) => o.ascensioId).sort()).toEqual(
			[a.id, b.id].sort()
		);
	});

	it('fusionar: LWW per updatedAt', async () => {
		const a = await afegirAscensio(nova({ nota: 'vella' }));
		const exp = JSON.parse(await exportarDades());
		// El fitxer té una versió més nova…
		exp.ascensions[0].nota = 'nova';
		exp.ascensions[0].updatedAt = '2026-09-29T10:30:00.000Z';
		fixar('2026-09-29T11:00:00.000Z');
		expect(await importarDades(JSON.stringify(exp), 'fusionar')).toMatchObject({
			actualitzades: 1
		});
		expect((await llistarAscensions())[0].nota).toBe('nova');
		// …i una edició local posterior guanya al fitxer.
		await actualitzarAscensio(a.id, { nota: 'local' });
		expect(await importarDades(JSON.stringify(exp), 'fusionar')).toMatchObject({
			actualitzades: 0,
			ignorades: 1
		});
		expect((await llistarAscensions())[0].nota).toBe('local');
	});

	it('substituir: deixa exactament les del fitxer (les altres, com a làpides)', async () => {
		const a = await afegirAscensio(nova({ nota: 'fitxer' }));
		const json = await exportarDades();
		await actualitzarAscensio(a.id, { nota: 'canviada' });
		const b = await afegirAscensio(nova({ cimId: CIM_B }));
		fixar('2026-09-29T12:00:00.000Z');
		expect(await importarDades(json, 'substituir')).toEqual({
			afegides: 0,
			actualitzades: 1,
			ignorades: 0
		});
		const llista = await llistarAscensions();
		expect(llista.map((x) => [x.id, x.nota])).toEqual([[a.id, 'fitxer']]);
		expect((await obtenirBd().ascensions.get(b.id))?.deletedAt).toBe('2026-09-29T12:00:00.000Z');
	});

	it('valida cada entrada i dedupe per id dins del fitxer', async () => {
		const id = uuidv7();
		const base = {
			id,
			cimId: CIM_A,
			data: '2020-01-01',
			metode: 'a-peu',
			nota: null,
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z'
		};
		const fitxer = {
			format: FORMAT_EXPORTACIO,
			versio: 1,
			ascensions: [
				base,
				{ ...base, nota: 'més nova', updatedAt: '2026-02-01T00:00:00.000Z' }, // mateix id
				{ ...base, id: uuidv7(), data: '2006-06-30' }, // abans de l'inici
				{ ...base, id: uuidv7(), data: '2026-09-30' }, // futura
				{ ...base, id: uuidv7(), cimId: CIM_INEXISTENT },
				{ ...base, id: uuidv7(), metode: 'helicopter' },
				{ ...base, id: uuidv7(), nota: 'x'.repeat(NOTA_MAX + 1) },
				{ ...base, id: 'no-uuid' },
				{ ...base, id: uuidv7(), updatedAt: 'ahir' },
				{ ...base, id: uuidv7(), deletedAt: '2026-01-02T00:00:00.000Z' },
				'text',
				null
			]
		};
		expect(await importarDades(JSON.stringify(fitxer), 'fusionar')).toEqual({
			afegides: 1,
			actualitzades: 0,
			ignorades: 11
		});
		expect(await llistarAscensions()).toMatchObject([{ id, nota: 'més nova' }]);
	});

	it('rebutja fitxers no vàlids sense escriure res', async () => {
		const a = await afegirAscensio(nova());
		const casos: [string, string][] = [
			['{no és json', 'importacio:json-invalid'],
			['[]', 'importacio:format'],
			['{"format":"altre","versio":1,"ascensions":[]}', 'importacio:format'],
			[`{"format":"${FORMAT_EXPORTACIO}","ascensions":[]}`, 'importacio:format'],
			[`{"format":"${FORMAT_EXPORTACIO}","versio":2,"ascensions":[]}`, 'importacio:versio'],
			[
				`{"format":"${FORMAT_EXPORTACIO}","versio":1,"ascensions":[{"id":"x"}]}`,
				'importacio:sense-valides'
			]
		];
		for (const [json, codi] of casos) {
			for (const mode of ['fusionar', 'substituir'] as const) {
				const e = await importarDades(json, mode).catch((err: unknown) => err);
				expect(e).toBeInstanceOf(ErrorImportacio);
				expect((e as ErrorImportacio).codi).toBe(codi);
			}
		}
		expect(await llistarAscensions()).toEqual([a]);
	});

	it('substituir amb un fitxer buit deixa el dispositiu buit', async () => {
		await afegirAscensio(nova());
		const buit = JSON.stringify({ format: FORMAT_EXPORTACIO, versio: 1, ascensions: [] });
		expect(await importarDades(buit, 'substituir')).toEqual({
			afegides: 0,
			actualitzades: 0,
			ignorades: 0
		});
		expect(await llistarAscensions()).toEqual([]);
	});
});

describe('esborrarTot (RGPD local)', () => {
	it('buida ascensions, làpides i outbox', async () => {
		const a = await afegirAscensio(nova());
		await afegirAscensio(nova({ cimId: CIM_B }));
		await esborrarAscensio(a.id);
		await esborrarTot();
		expect(await llistarAscensions()).toEqual([]);
		expect(await obtenirBd().ascensions.count()).toBe(0);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});
});
