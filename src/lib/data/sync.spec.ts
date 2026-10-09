import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ClientSupabase } from '$lib/platform/supabase';
import {
	actualitzarAscensio,
	afegirAscensio,
	esborrarAscensio,
	esborrarTot,
	llistarAscensions,
	pendentsDeSincronitzar
} from './ascensions';
import { CIMS } from './catalog/cataleg';
import { obtenirBd, tancarBd, type FilaAscensio } from './local/db';
import { establirRellotge } from './local/rellotge';
import {
	ErrorSync,
	PAGINA_PULL,
	_reiniciarSyncPerTests,
	classificarError,
	configurarSync,
	estatSync,
	filaDesDeSql,
	propietariLocal,
	remotSupabase,
	resoldreConflicteCompte,
	sincronitzar,
	sincronitzarAra,
	type EstatSync,
	type FilaPush,
	type FilaRemota,
	type Remot,
	type ResultatPush
} from './sync';

const CIM_A = CIMS[0].id;
const CIM_B = CIMS[1].id;
const USUARI = '11111111-1111-4111-8111-111111111111';
const ALTRE = '22222222-2222-4222-8222-222222222222';

function fixar(iso: string) {
	establirRellotge(() => new Date(iso));
}

// ---------------------------------------------------------------------------
// Servidor fals: mateixa regla que `sync_push` (LWW estricte, empat → servidor) i pull per
// `server_updated_at` amb microsegons, com Postgres.
// ---------------------------------------------------------------------------

/** `2026-10-09T10:00:00.123456+00:00` → microsegons des de l'època. */
function micros(t: string): number {
	const m = /\.(\d+)/.exec(t);
	const frac = m ? (m[1] + '000000').slice(0, 6) : '000000';
	const senseFrac = t.replace(/\.\d+/, '');
	return Math.floor(Date.parse(senseFrac) / 1000) * 1_000_000 + Number(frac);
}

function textMicros(us: number): string {
	const s = Math.floor(us / 1_000_000);
	const frac = String(us % 1_000_000).padStart(6, '0');
	return new Date(s * 1000).toISOString().replace('.000Z', `.${frac}+00:00`);
}

class ServidorFals implements Remot {
	files = new Map<string, { fila: FilaAscensio; server: number }>();
	rellotge = micros('2026-10-01T00:00:00.000000+00:00');
	crides = { push: 0, pull: 0 };
	/** Si es defineix, el següent push/pull llança aquest error (una vegada). */
	fallaPush: unknown = null;
	fallaPull: unknown = null;
	/** Ganxo per simular canvis locals mentre la petició és en vol. */
	duranPush: (() => Promise<void>) | null = null;

	private tic(): number {
		this.rellotge += 1;
		return this.rellotge;
	}

	/** Escriptura directa (com si vingués d'un altre dispositiu). */
	escriure(fila: FilaAscensio): void {
		this.files.set(fila.id, { fila: { ...fila }, server: this.tic() });
	}

	async push(files: FilaPush[]): Promise<ResultatPush> {
		this.crides.push++;
		if (this.fallaPush) {
			const e = this.fallaPush;
			this.fallaPush = null;
			throw e;
		}
		if (this.duranPush) {
			const g = this.duranPush;
			this.duranPush = null;
			await g();
		}
		const rebutjades: ResultatPush['rebutjades'] = [];
		let acceptades = 0;
		for (const f of files) {
			if (f.data < '2006-07-01') {
				rebutjades.push({ id: f.id, motiu: 'data fora de rang' });
				continue;
			}
			const actual = this.files.get(f.id);
			if (!actual || f.updatedAt > actual.fila.updatedAt) {
				this.files.set(f.id, { fila: { ...f }, server: this.tic() });
			}
			acceptades++;
		}
		return { acceptades, rebutjades };
	}

	async pull(desDe: string | null, limit: number): Promise<FilaRemota[]> {
		this.crides.pull++;
		if (this.fallaPull) {
			const e = this.fallaPull;
			this.fallaPull = null;
			throw e;
		}
		const des = desDe ? micros(desDe) : -Infinity;
		return [...this.files.values()]
			.filter((r) => r.server >= des)
			.sort((a, b) => a.server - b.server || (a.fila.id < b.fila.id ? -1 : 1))
			.slice(0, limit)
			.map((r) => ({ fila: { ...r.fila }, serverUpdatedAt: textMicros(r.server) }));
	}

	viva(id: string): FilaAscensio | undefined {
		const r = this.files.get(id);
		return r && !r.fila.deletedAt ? r.fila : undefined;
	}
}

async function filaLocal(id: string): Promise<FilaAscensio | undefined> {
	return obtenirBd().ascensions.get(id);
}

const filaRemota = (canvis: Partial<FilaAscensio> = {}): FilaAscensio => ({
	id: '01920000-0000-7000-8000-0000000000aa',
	cimId: CIM_B,
	data: '2025-08-15',
	metode: 'esqui',
	nota: 'des del mòbil',
	createdAt: '2025-08-15T10:00:00.000Z',
	updatedAt: '2025-08-15T10:00:00.000Z',
	deletedAt: null,
	...canvis
});

let servidor: ServidorFals;

beforeEach(async () => {
	fixar('2026-09-29T10:00:00.000Z');
	await esborrarTot();
	servidor = new ServidorFals();
});

afterEach(() => {
	_reiniciarSyncPerTests();
	establirRellotge();
	vi.useRealTimers();
});

afterAll(() => tancarBd());

// ---------------------------------------------------------------------------
// Migració local → núvol
// ---------------------------------------------------------------------------

describe('primera sync: adopció de les dades locals', () => {
	it('puja totes les locals (làpides incloses), assigna el propietari i buida la cua', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		const b = await afegirAscensio({ cimId: CIM_B, data: '2026-09-21', metode: 'btt', nota: 'n' });
		await esborrarAscensio(b.id);
		// Simula dades antigues sense entrada a la cua (p. ex. ja "sincronitzades" amb un altre compte).
		await obtenirBd().outbox.clear();

		const r = await sincronitzar(servidor, USUARI);

		expect(r).toEqual({ estat: 'fet', pujades: 2, rebutjades: 0, baixades: 0 });
		expect(servidor.viva(a.id)).toMatchObject({ cimId: CIM_A, metode: 'a-peu' });
		expect(servidor.files.get(b.id)?.fila.deletedAt).not.toBeNull();
		expect(await propietariLocal()).toBe(USUARI);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('és idempotent: una segona sync no torna a pujar res ni canvia el servidor', async () => {
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		const abans = structuredClone([...servidor.files.entries()]);

		const r = await sincronitzar(servidor, USUARI);

		expect(r).toMatchObject({ pujades: 0, baixades: 0 });
		expect([...servidor.files.entries()]).toEqual(abans);
	});

	it('pujar dues vegades la mateixa fila (reintent) no la duplica', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		await obtenirBd().outbox.put({
			ascensioId: a.id,
			encuaAt: '2026-09-29T10:00:01.000Z',
			intents: 0
		});
		await sincronitzar(servidor, USUARI);
		expect(servidor.files.size).toBe(1);
	});

	it('baixa les ascensions que ja hi ha al núvol (dispositiu nou)', async () => {
		servidor.escriure(filaRemota());
		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ baixades: 1 });
		expect(await llistarAscensions()).toEqual([
			expect.objectContaining({ id: filaRemota().id, cimId: CIM_B, metode: 'esqui' })
		]);
		// Les files baixades no s'encuen (no cal tornar-les a pujar).
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// Fusió LWW
// ---------------------------------------------------------------------------

describe('fusió LWW per updatedAt', () => {
	it('la remota més nova guanya i el pendent local que perd es descarta', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		// Edició local (pendent) i, després, una edició més nova en un altre dispositiu.
		fixar('2026-09-29T11:00:00.000Z');
		await actualitzarAscensio(a.id, { nota: 'local' });
		servidor.escriure({
			...(await filaLocal(a.id))!,
			nota: 'remota',
			updatedAt: '2026-09-29T12:00:00.000Z'
		});
		const r = await sincronitzar(servidor, USUARI);
		expect(r.estat).toBe('fet');
		expect((await filaLocal(a.id))?.nota).toBe('remota');
		expect(servidor.viva(a.id)?.nota).toBe('remota');
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('la local més nova guanya: es puja i el pull no la trepitja', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		servidor.escriure({
			...(await filaLocal(a.id))!,
			nota: 'remota',
			updatedAt: '2026-09-29T10:30:00.000Z'
		});
		fixar('2026-09-29T11:00:00.000Z');
		await actualitzarAscensio(a.id, { nota: 'local' });
		await sincronitzar(servidor, USUARI);
		expect((await filaLocal(a.id))?.nota).toBe('local');
		expect(servidor.viva(a.id)?.nota).toBe('local');
	});

	it("empat d'updatedAt amb contingut diferent: guanya el servidor (convergència)", async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		const local = (await filaLocal(a.id))!;
		const ts = '2026-09-29T11:00:00.000Z';
		await obtenirBd().ascensions.put({ ...local, nota: 'local', updatedAt: ts });
		await obtenirBd().outbox.put({ ascensioId: a.id, encuaAt: ts, intents: 0 });
		servidor.escriure({ ...local, nota: 'remota', updatedAt: ts });
		await sincronitzar(servidor, USUARI);
		await sincronitzar(servidor, USUARI);
		expect((await filaLocal(a.id))?.nota).toBe('remota');
		expect(servidor.viva(a.id)?.nota).toBe('remota');
	});
});

// ---------------------------------------------------------------------------
// Làpides
// ---------------------------------------------------------------------------

describe('làpides (deletedAt)', () => {
	it('un esborrat local es puja com a làpida', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		fixar('2026-09-29T11:00:00.000Z');
		await esborrarAscensio(a.id);
		await sincronitzar(servidor, USUARI);
		expect(servidor.files.get(a.id)?.fila.deletedAt).toBe('2026-09-29T11:00:00.000Z');
		expect(servidor.viva(a.id)).toBeUndefined();
	});

	it("un esborrat remot amaga l'ascensió local i una restauració remota la torna", async () => {
		servidor.escriure(filaRemota());
		await sincronitzar(servidor, USUARI);
		servidor.escriure(
			filaRemota({ deletedAt: '2025-09-01T00:00:00.000Z', updatedAt: '2025-09-01T00:00:00.000Z' })
		);
		await sincronitzar(servidor, USUARI);
		expect(await llistarAscensions()).toEqual([]);
		expect((await filaLocal(filaRemota().id))?.deletedAt).toBe('2025-09-01T00:00:00.000Z');

		servidor.escriure(filaRemota({ updatedAt: '2025-09-02T00:00:00.000Z' }));
		await sincronitzar(servidor, USUARI);
		expect(await llistarAscensions()).toHaveLength(1);
	});
});

// ---------------------------------------------------------------------------
// Cua (outbox) i errors
// ---------------------------------------------------------------------------

describe('cua i errors', () => {
	it('una entrada tornada a encuar mentre es pujava es queda a la cua (i surt a la següent)', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		fixar('2026-09-29T11:00:00.000Z');
		await actualitzarAscensio(a.id, { nota: 'v1' });
		servidor.duranPush = async () => {
			fixar('2026-09-29T11:00:05.000Z');
			await actualitzarAscensio(a.id, { nota: 'v2' });
		};
		await sincronitzar(servidor, USUARI);
		expect(await pendentsDeSincronitzar()).toHaveLength(1);
		expect((await filaLocal(a.id))?.nota).toBe('v2');

		await sincronitzar(servidor, USUARI);
		expect(await pendentsDeSincronitzar()).toEqual([]);
		expect(servidor.viva(a.id)?.nota).toBe('v2');
	});

	it('les files que el servidor rebutja es queden a la cua amb intents + 1', async () => {
		const id = '01920000-0000-7000-8000-0000000000bb';
		const ts = '2026-09-29T10:00:00.000Z';
		await obtenirBd().ascensions.put({
			id,
			cimId: CIM_A,
			data: '2001-01-01',
			metode: 'a-peu',
			nota: null,
			createdAt: ts,
			updatedAt: ts,
			deletedAt: null
		});
		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ pujades: 0, rebutjades: 1 });
		expect(await pendentsDeSincronitzar()).toEqual([
			expect.objectContaining({ ascensioId: id, intents: 1 })
		]);
	});

	it('error de xarxa al push: no es perd res i la sync següent ho puja', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.fallaPush = new ErrorSync('xarxa', 'Failed to fetch');
		await expect(sincronitzar(servidor, USUARI)).rejects.toMatchObject({ codi: 'xarxa' });
		expect(await pendentsDeSincronitzar()).toHaveLength(1);
		expect(await llistarAscensions()).toHaveLength(1);

		await sincronitzar(servidor, USUARI);
		expect(servidor.viva(a.id)).toBeDefined();
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('error de xarxa al pull: el push ja fet es conserva i el cursor no avança', async () => {
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.escriure(filaRemota());
		servidor.fallaPull = new ErrorSync('xarxa');
		await expect(sincronitzar(servidor, USUARI)).rejects.toBeInstanceOf(ErrorSync);
		expect(await pendentsDeSincronitzar()).toEqual([]);
		expect(await obtenirBd().meta.get('cursorPull')).toMatchObject({ valor: null });

		await sincronitzar(servidor, USUARI);
		expect(await llistarAscensions()).toHaveLength(2);
	});

	it("pull paginat: baixa més d'una pàgina sense perdre files", async () => {
		const n = PAGINA_PULL + 37;
		for (let i = 0; i < n; i++) {
			const hex = i.toString(16).padStart(12, '0');
			servidor.escriure(filaRemota({ id: `01920000-0000-7000-8000-${hex}` }));
		}
		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ baixades: n });
		expect(await obtenirBd().ascensions.count()).toBe(n);
		expect(servidor.crides.pull).toBeGreaterThanOrEqual(2);
	});

	it('pull incremental: la segona sync només demana des del cursor (amb solapament)', async () => {
		servidor.escriure(filaRemota());
		await sincronitzar(servidor, USUARI);
		const espia = vi.spyOn(servidor, 'pull');
		await sincronitzar(servidor, USUARI);
		const desDe = espia.mock.calls[0][0];
		expect(desDe).not.toBeNull();
		const server = servidor.files.get(filaRemota().id)!.server;
		// Cursor = últim `server_updated_at` baixat, menys 5 s de solapament (precisió de ms).
		expect(server - micros(desDe!)).toBeGreaterThanOrEqual(5_000_000);
		expect(server - micros(desDe!)).toBeLessThan(5_001_000);
	});
});

// ---------------------------------------------------------------------------
// Dades d'un altre compte
// ---------------------------------------------------------------------------

describe("dades d'un altre compte al dispositiu", () => {
	it("no fusiona res fins que l'usuari decideix", async () => {
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, ALTRE);
		const altreServidor = new ServidorFals();
		const r = await sincronitzar(altreServidor, USUARI);
		expect(r).toEqual({ estat: 'conflicte' });
		expect(altreServidor.crides).toEqual({ push: 0, pull: 0 });
	});

	it('`fusionar` passa les dades al compte actual; `descartar-locals` les treu del dispositiu', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, ALTRE);
		const nou = new ServidorFals();
		configurarSync({ remot: nou, usuariId: USUARI });
		await sincronitzarAra();
		await resoldreConflicteCompte('fusionar');
		expect(nou.viva(a.id)).toBeDefined();
		expect(await propietariLocal()).toBe(USUARI);

		configurarSync(null);
		await sincronitzar(servidor, ALTRE).then((r) => expect(r).toEqual({ estat: 'conflicte' }));
		configurarSync({ remot: servidor, usuariId: ALTRE });
		await resoldreConflicteCompte('descartar-locals');
		// Es baixa el que l'altre compte tenia al núvol (la mateixa ascensió que hi havia pujat).
		expect(await propietariLocal()).toBe(ALTRE);
		expect(await llistarAscensions()).toHaveLength(1);
	});
});

// ---------------------------------------------------------------------------
// Orquestració i estat observable
// ---------------------------------------------------------------------------

describe('estatSync i sincronitzarAra', () => {
	it('sense sessió no fa res; amb sessió sincronitza i publica ultimaSync i error', async () => {
		const estats: EstatSync[] = [];
		const desub = estatSync.subscribe((e) => estats.push(e));
		await sincronitzarAra();
		expect(servidor.crides.push + servidor.crides.pull).toBe(0);

		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.fallaPush = new ErrorSync('xarxa');
		// Activar la sync en fa una de seguida (que falla per xarxa).
		configurarSync({ remot: servidor, usuariId: USUARI });
		await vi.waitFor(() =>
			expect(estats.at(-1)).toMatchObject({ actiu: true, error: 'xarxa', sincronitzant: false })
		);

		await sincronitzarAra();
		const darrer = estats.at(-1)!;
		expect(darrer.error).toBeUndefined();
		expect(darrer.ultimaSync).toBe('2026-09-29T10:00:00.000Z');
		await vi.waitFor(() => expect(estats.at(-1)?.pendents).toBe(0));
		desub();
	});

	it("el conflicte es publica a l'estat", async () => {
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, ALTRE);
		let darrer: EstatSync | undefined;
		const desub = estatSync.subscribe((e) => (darrer = e));
		configurarSync({ remot: new ServidorFals(), usuariId: USUARI });
		await sincronitzarAra();
		expect(darrer?.conflicte).toBe('altre-compte');
		desub();
	});
});

// ---------------------------------------------------------------------------
// Adaptador sobre el client de Supabase (mock)
// ---------------------------------------------------------------------------

function clientFals(respostes: { rpc?: unknown; select?: unknown }) {
	const crides: { metode: string; args: unknown[] }[] = [];
	const consulta = {
		gte: (...args: unknown[]) => (crides.push({ metode: 'gte', args }), consulta),
		order: (...args: unknown[]) => (crides.push({ metode: 'order', args }), consulta),
		limit: (...args: unknown[]) => {
			crides.push({ metode: 'limit', args });
			return Promise.resolve(respostes.select);
		}
	};
	const client = {
		rpc: (...args: unknown[]) => {
			crides.push({ metode: 'rpc', args });
			return Promise.resolve(respostes.rpc);
		},
		from: (...args: unknown[]) => {
			crides.push({ metode: 'from', args });
			return {
				select: (...a: unknown[]) => (crides.push({ metode: 'select', args: a }), consulta)
			};
		}
	};
	return { client: client as unknown as ClientSupabase, crides };
}

describe('remotSupabase (client mock)', () => {
	const sql = {
		id: '01920000-0000-7000-8000-0000000000aa',
		cim_id: CIM_B,
		data: '2025-08-15',
		metode: 'a_peu' as const,
		nota: null,
		created_at: '2025-08-15T10:00:00+00:00',
		updated_at: '2025-08-15T10:00:00.5+00:00',
		deleted_at: null,
		server_updated_at: '2026-10-09T15:20:23.938786+00:00'
	};

	it('push crida `sync_push` amb les files i retorna acceptades/rebutjades', async () => {
		const { client, crides } = clientFals({
			rpc: { data: { acceptades: 1, rebutjades: [] }, error: null, status: 200 }
		});
		const fila = filaRemota();
		const r = await remotSupabase(client).push([fila]);
		expect(r).toEqual({ acceptades: 1, rebutjades: [] });
		expect(crides[0]).toEqual({ metode: 'rpc', args: ['sync_push', { files: [fila] }] });
	});

	it('pull filtra per cursor, ordena i converteix al format local', async () => {
		const { client, crides } = clientFals({ select: { data: [sql], error: null, status: 200 } });
		const r = await remotSupabase(client).pull('2026-10-09T15:00:00.000Z', 50);
		expect(r).toEqual([
			{
				fila: {
					id: sql.id,
					cimId: CIM_B,
					data: '2025-08-15',
					metode: 'a-peu',
					nota: null,
					createdAt: '2025-08-15T10:00:00.000Z',
					updatedAt: '2025-08-15T10:00:00.500Z',
					deletedAt: null
				},
				serverUpdatedAt: sql.server_updated_at
			}
		]);
		expect(crides.map((c) => c.metode)).toEqual([
			'from',
			'select',
			'gte',
			'order',
			'order',
			'limit'
		]);
		expect(crides[2].args).toEqual(['server_updated_at', '2026-10-09T15:00:00.000Z']);
	});

	it('pull complet (sense cursor) no filtra', async () => {
		const { client, crides } = clientFals({ select: { data: [], error: null, status: 200 } });
		await remotSupabase(client).pull(null, 10);
		expect(crides.some((c) => c.metode === 'gte')).toBe(false);
	});

	it('classifica els errors: sessió (401/PGRST301), xarxa (fetch) i servidor', async () => {
		const sessio = clientFals({
			rpc: { data: null, error: { message: 'JWT expired', code: 'PGRST301' }, status: 401 }
		});
		await expect(remotSupabase(sessio.client).push([])).rejects.toMatchObject({ codi: 'sessio' });

		const xarxa = clientFals({
			select: { data: null, error: { message: 'TypeError: Failed to fetch', code: '' }, status: 0 }
		});
		await expect(remotSupabase(xarxa.client).pull(null, 1)).rejects.toMatchObject({
			codi: 'xarxa'
		});

		const servidorKo = clientFals({
			rpc: { data: null, error: { message: 'boom', code: 'XX000' }, status: 500 }
		});
		await expect(remotSupabase(servidorKo.client).push([])).rejects.toMatchObject({
			codi: 'servidor'
		});

		expect(classificarError(new TypeError('Load failed')).codi).toBe('xarxa');
	});

	it('filaDesDeSql converteix làpides i mètodes amb guió baix', () => {
		const r = filaDesDeSql({ ...sql, metode: 'raquetes', deleted_at: '2025-09-01T00:00:00+00:00' });
		expect(r.fila).toMatchObject({ metode: 'raquetes', deletedAt: '2025-09-01T00:00:00.000Z' });
	});
});
