/**
 * Municipi d'origen local (preferència) i stores vius d'origen i d'estadístiques (bloc R1).
 * La sync de l'origen es prova a `sync.spec.ts`.
 */
import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	actualitzarAscensio,
	afegirAscensio,
	esborrarAscensio,
	esborrarTot,
	type StoreLectura
} from './ascensions';
import { CIMS } from './catalog/cataleg';
import {
	_reiniciarEstadistiquesPerTests,
	companysDelDiari,
	estadistiques,
	estadistiquesActuals,
	type EstatEstadistiques
} from './estadistiques';
import { obtenirBd, tancarBd } from './local/db';
import { establirRellotge } from './local/rellotge';
import {
	ErrorOrigen,
	_reiniciarOrigenPerTests,
	desarOrigen,
	esborrarOrigen,
	llegirMunicipiOrigen,
	llegirOrigen,
	origen,
	type EstatOrigen
} from './origen';

const BARCELONA = '080193';
const GIRONA = '170792';

function fixar(iso: string) {
	establirRellotge(() => new Date(iso));
}

const pref = () => obtenirBd().preferencies.get('origen');

/** Subscriu-s'hi i recull els valors fins que `fins` es compleix. */
function seguir<T>(store: StoreLectura<T>, fins: (v: T) => boolean) {
	const valors: T[] = [];
	let unsub = () => {};
	const p = new Promise<T[]>((resolve) => {
		unsub = store.subscribe((v) => {
			valors.push(v);
			if (fins(v)) resolve(valors);
		});
	});
	return { p, valors, unsub: () => unsub() };
}

beforeEach(async () => {
	fixar('2026-09-29T10:00:00.000Z');
	await esborrarTot();
	_reiniciarOrigenPerTests();
	_reiniciarEstadistiquesPerTests();
});

afterEach(() => {
	establirRellotge();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

afterAll(() => tancarBd());

describe('desarOrigen / llegirOrigen', () => {
	it('sense origen: null', async () => {
		expect(await llegirOrigen()).toBeNull();
		expect(await llegirMunicipiOrigen()).toBeNull();
		expect(await pref()).toBeUndefined();
	});

	it('desa el codi amb l’instant del canvi i el deixa pendent de pujar', async () => {
		await desarOrigen(BARCELONA);
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: BARCELONA,
			updatedAt: '2026-09-29T10:00:00.000Z',
			pendent: 1
		});
		expect(await llegirOrigen()).toBe(BARCELONA);
		expect(await llegirMunicipiOrigen()).toMatchObject({ nom: 'Barcelona', comarca: 'Barcelonès' });
	});

	it('accepta parròquies d’Andorra i poblacions de la Catalunya Nord', async () => {
		await desarOrigen('ad:ordino');
		expect(await llegirMunicipiOrigen()).toMatchObject({ nom: 'Ordino', zona: 'andorra' });
		await desarOrigen('cn:perpinya');
		expect(await llegirMunicipiOrigen()).toMatchObject({ nom: 'Perpinyà', zona: 'catalunya-nord' });
	});

	it('canviar-lo avança updatedAt (LWW) encara que el rellotge no es mogui', async () => {
		await desarOrigen(BARCELONA);
		await desarOrigen(GIRONA);
		const p = await pref();
		expect(p?.valor).toBe(GIRONA);
		expect(p!.updatedAt > '2026-09-29T10:00:00.000Z').toBe(true);
	});

	it('desar el mateix valor no canvia res (ni updatedAt ni pendent)', async () => {
		await desarOrigen(BARCELONA);
		await obtenirBd().preferencies.update('origen', { pendent: 0 });
		fixar('2026-09-29T12:00:00.000Z');
		await desarOrigen(BARCELONA);
		expect(await pref()).toMatchObject({ updatedAt: '2026-09-29T10:00:00.000Z', pendent: 0 });
		await esborrarTot();
		await desarOrigen(null);
		expect(await pref()).toBeUndefined();
	});

	it('treure’l deixa valor null amb l’instant (perquè el canvi es propagui)', async () => {
		await desarOrigen(BARCELONA);
		await obtenirBd().preferencies.update('origen', { pendent: 0 });
		fixar('2026-09-29T12:00:00.000Z');
		await esborrarOrigen();
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: null,
			updatedAt: '2026-09-29T12:00:00.000Z',
			pendent: 1
		});
		expect(await llegirOrigen()).toBeNull();
	});

	it('rebutja codis que no són de cap municipi, sense desar res ni filtrar el codi', async () => {
		for (const dolent of ['999999', 'Barcelona', '08019', 'ad:inventat', '', 'cn:']) {
			const e = await desarOrigen(dolent).catch((err: unknown) => err);
			expect(e).toBeInstanceOf(ErrorOrigen);
			expect((e as ErrorOrigen).codi).toBe('origen:desconegut');
			// Dada personal: el codi rebut no surt al missatge de l'error.
			if (dolent) expect((e as ErrorOrigen).message).not.toContain(dolent);
		}
		expect(await pref()).toBeUndefined();
	});

	it('esborrarTot també esborra el municipi d’origen', async () => {
		await desarOrigen(BARCELONA);
		await esborrarTot();
		expect(await obtenirBd().preferencies.count()).toBe(0);
		expect(await llegirOrigen()).toBeNull();
	});
});

describe('store origen()', () => {
	it('emet de seguida (carregant) i després el municipi; segueix els canvis', async () => {
		const s = seguir<EstatOrigen>(origen(), (v) => v.codi === GIRONA && v.municipi !== null);
		expect(s.valors[0]).toEqual({ carregat: false, codi: null, municipi: null });
		await vi.waitFor(() => expect(s.valors.at(-1)).toMatchObject({ carregat: true, codi: null }));
		await desarOrigen(BARCELONA);
		await vi.waitFor(() =>
			expect(s.valors.at(-1)).toMatchObject({ codi: BARCELONA, municipi: { nom: 'Barcelona' } })
		);
		await desarOrigen(GIRONA);
		const valors = await s.p;
		expect(valors.at(-1)).toMatchObject({
			carregat: true,
			codi: GIRONA,
			municipi: { nom: 'Girona', comarcaSlug: 'girones' }
		});
		await desarOrigen(null);
		await vi.waitFor(() =>
			expect(s.valors.at(-1)).toEqual({ carregat: true, codi: null, municipi: null })
		);
		s.unsub();
	});

	it('una subscripció nova rep de seguida l’últim estat conegut', async () => {
		await desarOrigen(BARCELONA);
		const s = seguir<EstatOrigen>(origen(), (v) => v.carregat);
		await s.p;
		s.unsub();
		const t = seguir<EstatOrigen>(origen(), () => true);
		expect(t.valors[0]).toMatchObject({ carregat: true, codi: BARCELONA });
		t.unsub();
	});

	it('un codi que no és al conjunt de municipis dona municipi: null (cal tornar-lo a triar)', async () => {
		await obtenirBd().preferencies.put({
			clau: 'origen',
			valor: '999999',
			updatedAt: '2026-09-29T10:00:00.000Z',
			pendent: 0
		});
		const s = seguir<EstatOrigen>(origen(), (v) => v.carregat);
		expect((await s.p).at(-1)).toEqual({ carregat: true, codi: '999999', municipi: null });
		s.unsub();
	});

	it('en SSR (sense IndexedDB) emet l’estat inicial i no toca la BD', () => {
		vi.stubGlobal('indexedDB', undefined);
		const run = vi.fn();
		origen().subscribe(run)();
		expect(run).toHaveBeenCalledTimes(1);
		expect(run.mock.calls[0][0]).toEqual({ carregat: false, codi: null, municipi: null });
		const run2 = vi.fn();
		estadistiques().subscribe(run2)();
		expect(run2).toHaveBeenCalledTimes(1);
		expect(run2.mock.calls[0][0]).toMatchObject({ carregat: false, origen: null });
	});
});

describe('store estadistiques()', () => {
	const MONTCAU = CIMS.find((c) => c.slug === 'montcau') ?? CIMS[0];
	const LLUNY = [...CIMS]
		.filter((c) => c.lat !== null && c.zona === 'catalunya')
		.sort((a, b) => a.lat! - b.lat!)[0]; // el més meridional (Ports)

	it('es recalcula amb les ascensions i amb el municipi d’origen', async () => {
		const s = seguir<EstatEstadistiques>(estadistiques(), () => false);
		expect(s.valors[0]).toMatchObject({ carregat: false, origen: null });
		expect(s.valors[0].estadistiques.totals.ascensions).toBe(0);
		await vi.waitFor(() => expect(s.valors.at(-1)?.carregat).toBe(true));

		const a = await afegirAscensio({ cimId: MONTCAU.id, data: '2026-09-20', metode: 'a-peu' });
		await afegirAscensio({ cimId: MONTCAU.id, data: '2026-08-20', metode: 'a-peu' });
		await afegirAscensio({ cimId: LLUNY.id, data: '2026-09-21', metode: 'btt' });
		await vi.waitFor(() => expect(s.valors.at(-1)?.estadistiques.totals.ascensions).toBe(3));
		let e = s.valors.at(-1)!;
		expect(e.estadistiques.totals).toMatchObject({ cimsDiferents: 2, repeticions: 1 });
		expect(e.estadistiques.cimMesFet?.cim.id).toBe(MONTCAU.id);
		expect(e.estadistiques.percentatges.cataleg.total).toBe(CIMS.length);
		// Sense origen no hi ha "cim més llunyà".
		expect(e.origen).toBeNull();
		expect(e.estadistiques.cimMesLlunya).toBeNull();

		await desarOrigen(BARCELONA);
		await vi.waitFor(() => expect(s.valors.at(-1)?.origen?.nom).toBe('Barcelona'));
		e = s.valors.at(-1)!;
		expect(e.estadistiques.cimMesLlunya?.cim.id).toBe(LLUNY.id);
		expect(e.estadistiques.cimMesLlunya!.distanciaKm).toBeGreaterThan(100);

		await esborrarAscensio(a.id);
		await vi.waitFor(() => expect(s.valors.at(-1)?.estadistiques.totals.ascensions).toBe(2));
		expect(s.valors.at(-1)?.estadistiques.cimMesFet).toBeNull();

		await desarOrigen(null);
		await vi.waitFor(() => expect(s.valors.at(-1)?.origen).toBeNull());
		expect(s.valors.at(-1)?.estadistiques.cimMesLlunya).toBeNull();
		s.unsub();
	});

	it('estadistiquesActuals fa una sola lectura amb el mateix resultat', async () => {
		await afegirAscensio({ cimId: MONTCAU.id, data: '2026-09-20', metode: 'a-peu' });
		await desarOrigen(GIRONA);
		const r = await estadistiquesActuals();
		expect(r.carregat).toBe(true);
		expect(r.origen?.nom).toBe('Girona');
		expect(r.estadistiques.totals.ascensions).toBe(1);
		expect(r.estadistiques.cimMesLlunya?.cim.id).toBe(MONTCAU.id);
		// "Avui" surt del rellotge de la capa (la ratxa del mes en curs).
		expect(r.estadistiques.ratxa.mesActualFet).toBe(true);
		fixar('2026-12-01T10:00:00.000Z');
		expect((await estadistiquesActuals()).estadistiques.ratxa.actual.mesos).toBe(0);
	});
});

describe('companysDelDiari', () => {
	it('suggereix els companys ja usats, per freqüència i recència, amb filtre', async () => {
		const a = await afegirAscensio({
			cimId: CIMS[0].id,
			data: '2026-09-01',
			metode: 'a-peu',
			companys: ['Inesa', 'Pau']
		});
		await afegirAscensio({
			cimId: CIMS[1].id,
			data: '2026-09-10',
			metode: 'a-peu',
			companys: ['Inesa', 'Mar']
		});
		expect(await companysDelDiari()).toEqual([
			{ nom: 'Inesa', vegades: 2, ultimaData: '2026-09-10' },
			{ nom: 'Mar', vegades: 1, ultimaData: '2026-09-10' },
			{ nom: 'Pau', vegades: 1, ultimaData: '2026-09-01' }
		]);
		expect((await companysDelDiari({ text: 'p' })).map((c) => c.nom)).toEqual(['Pau']);
		expect((await companysDelDiari({ exclou: ['inesa'] })).map((c) => c.nom)).toEqual([
			'Mar',
			'Pau'
		]);
		// Els d'una ascensió esborrada o editada deixen de sortir.
		await actualitzarAscensio(a.id, { companys: [] });
		expect((await companysDelDiari()).map((c) => c.nom)).toEqual(['Inesa', 'Mar']);
	});
});
