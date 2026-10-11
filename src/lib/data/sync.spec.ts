import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ClientSupabase } from '$lib/platform/supabase';
import {
	actualitzarAscensio,
	afegirAscensio,
	esborrarAscensio,
	esborrarTot,
	exportarDades,
	importarDades,
	llistarAscensions,
	pendentsDeSincronitzar
} from './ascensions';
import { CIMS } from './catalog/cataleg';
import { obtenirBd, tancarBd, type EntradaPreferencia, type FilaAscensio } from './local/db';
import { establirRellotge } from './local/rellotge';
import { desarOrigen, llegirOrigen } from './origen';
import {
	ErrorSync,
	MAX_INTENTS,
	PAGINA_PULL,
	SyncAvortada,
	_reiniciarSyncPerTests,
	alliberarDadesLocals,
	classificarError,
	configurarSync,
	estatSync,
	filaDesDeSql,
	filaPush,
	origenDesDeJson,
	propietariLocal,
	remotSupabase,
	resoldreConflicteCompte,
	sincronitzar,
	sincronitzarAra,
	type EstatSync,
	type FilaPush,
	type FilaRemota,
	type OrigenSync,
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
// `server_updated_at` amb microsegons, com Postgres. Com la migració 0005: una fila pujada sense
// la clau `companys` conserva els companys desats, i les files baixades sempre la porten.
// `origen` imita `sync_origen` (LWW estricte; retorna el que queda al servidor).
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
	/** Ids que al núvol són d'un altre compte (`sync_push` els rebutja amb 'id en ús'). */
	aliens = new Set<string>();
	/**
	 * Ganxo del pull: s'executa amb la resposta ja calculada i abans de tornar-la (com una
	 * petició lenta en vol). Una vegada.
	 */
	duranPull: (() => Promise<void>) | null = null;
	/** Si torna `true`, el push s'aplica però la resposta "es perd" (error de xarxa). Una vegada. */
	perdreResposta: ((files: FilaPush[]) => boolean) | null = null;
	/** Totes les files rebudes pel push (per comprovar què s'ha enviat). */
	rebudes: FilaPush[] = [];
	/** Municipi d'origen del compte (`perfils`), o `null` si no se n'ha desat mai cap. */
	origenCompte: OrigenSync | null = null;
	/** Canvis rebuts per `origen` (`null` = només lectura). */
	cridesOrigen: (OrigenSync | null)[] = [];
	/** Si es defineix, la crida següent a `origen` llança aquest error (una vegada). */
	fallaOrigen: unknown = null;
	/** Ganxo: s'executa amb la resposta d'`origen` ja calculada, abans de tornar-la. Una vegada. */
	duranOrigen: (() => Promise<void>) | null = null;

	private tic(): number {
		this.rellotge += 1;
		return this.rellotge;
	}

	/** Escriptura directa (com si vingués d'un altre dispositiu). */
	escriure(fila: FilaAscensio): void {
		this.files.set(fila.id, {
			fila: { ...fila, companys: fila.companys ?? [] },
			server: this.tic()
		});
	}

	async origen(canvi: OrigenSync | null): Promise<OrigenSync | null> {
		this.cridesOrigen.push(canvi);
		if (this.fallaOrigen) {
			const e = this.fallaOrigen;
			this.fallaOrigen = null;
			throw e;
		}
		if (canvi && (!this.origenCompte || canvi.updatedAt > this.origenCompte.updatedAt)) {
			this.origenCompte = { ...canvi };
		}
		const resposta = this.origenCompte ? { ...this.origenCompte } : null;
		if (this.duranOrigen) {
			const g = this.duranOrigen;
			this.duranOrigen = null;
			await g();
		}
		return resposta;
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
		this.rebudes.push(...files.map((f) => ({ ...f })));
		const rebutjades: ResultatPush['rebutjades'] = [];
		let acceptades = 0;
		for (const f of files) {
			if (f.data < '2006-07-01') {
				rebutjades.push({ id: f.id, motiu: 'data fora de rang' });
				continue;
			}
			if (this.aliens.has(f.id)) {
				rebutjades.push({ id: f.id, motiu: 'id en ús' });
				continue;
			}
			const actual = this.files.get(f.id);
			if (!actual || f.updatedAt > actual.fila.updatedAt) {
				// Sense la clau, es conserven els companys desats (fila nova: cap).
				const companys = f.companys !== undefined ? [...f.companys] : (actual?.fila.companys ?? []);
				this.files.set(f.id, { fila: { ...f, companys }, server: this.tic() });
			}
			acceptades++;
		}
		if (this.perdreResposta?.(files)) {
			this.perdreResposta = null;
			throw new ErrorSync('xarxa', 'resposta perduda');
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
		const resposta = [...this.files.values()]
			.filter((r) => r.server >= des)
			.sort((a, b) => a.server - b.server || (a.fila.id < b.fila.id ? -1 : 1))
			.slice(0, limit)
			.map((r) => ({ fila: { ...r.fila }, serverUpdatedAt: textMicros(r.server) }));
		if (this.duranPull) {
			const g = this.duranPull;
			this.duranPull = null;
			await g();
		}
		return resposta;
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

		expect(r).toEqual({
			estat: 'fet',
			pujades: 2,
			rebutjades: 0,
			reassignades: 0,
			baixades: 0,
			bloquejades: 0
		});
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
// Ids que ja són d'un altre compte ('id en ús') i rebutjos permanents
// ---------------------------------------------------------------------------

describe("ids d'un altre compte ('id en ús')", () => {
	it('`fusionar`: la fila rebutjada rep un id nou, es puja en la mateixa passada i la cua es buida', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'n'
		});
		const b = await afegirAscensio({ cimId: CIM_B, data: '2026-09-21', metode: 'btt' });
		await sincronitzar(servidor, ALTRE);
		// Al núvol del compte nou, l'id de `a` és d'un altre compte; `b` no hi era.
		const nou = new ServidorFals();
		nou.aliens.add(a.id);
		configurarSync({ remot: nou, usuariId: USUARI });
		await sincronitzarAra();
		await resoldreConflicteCompte('fusionar');

		const locals = await llistarAscensions();
		expect(locals).toHaveLength(2);
		const reassignada = locals.find((f) => f.id !== b.id)!;
		expect(reassignada.id).not.toBe(a.id);
		expect(reassignada).toMatchObject({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'n',
			createdAt: a.createdAt,
			updatedAt: a.updatedAt
		});
		// L'id vell desapareix del dispositiu sense làpida (ni local ni enviada al núvol).
		expect(await filaLocal(a.id)).toBeUndefined();
		expect(nou.rebudes.filter((f) => f.id === a.id && f.deletedAt)).toEqual([]);
		expect(nou.viva(reassignada.id)).toMatchObject({ cimId: CIM_A, nota: 'n' });
		expect(nou.viva(b.id)).toBeDefined();
		expect(nou.files.has(a.id)).toBe(false);
		expect(await pendentsDeSincronitzar()).toEqual([]);
		expect(await propietariLocal()).toBe(USUARI);
	});

	it('el resultat compta les reassignades a part (no com a rebutjades)', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.aliens.add(a.id);
		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ pujades: 1, rebutjades: 0, reassignades: 1, bloquejades: 0 });
		expect(servidor.files.size).toBe(1);
		// Una segona passada no torna a reassignar ni pujar res.
		const r2 = await sincronitzar(servidor, USUARI);
		expect(r2).toMatchObject({ pujades: 0, reassignades: 0 });
		expect(servidor.files.size).toBe(1);
	});

	it("importar el JSON d'un altre compte: les files amb id aliè entren amb un id nou", async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		const json = await exportarDades();
		await esborrarTot();
		await sincronitzar(servidor, USUARI); // dispositiu ja del compte, buit
		servidor.aliens.add(a.id);
		await importarDades(json, 'fusionar');

		await sincronitzar(servidor, USUARI);
		const locals = await llistarAscensions();
		expect(locals).toHaveLength(1);
		expect(locals[0].id).not.toBe(a.id);
		expect(servidor.viva(locals[0].id)).toMatchObject({ cimId: CIM_A, data: '2026-09-20' });
		expect(servidor.files.size).toBe(1);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('importar el propi export (ids del compte) fusiona per LWW sense duplicar ni reassignar', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		const json = await exportarDades();
		// Dispositiu nou (o esborrat): s'importa el fitxer i es torna a entrar.
		await esborrarTot();
		await importarDades(json, 'fusionar');
		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ reassignades: 0, rebutjades: 0 });
		expect((await llistarAscensions()).map((f) => f.id)).toEqual([a.id]);
		expect(servidor.files.size).toBe(1);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it("si es perd la resposta del push amb l'id nou, el reintent no duplica", async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.aliens.add(a.id);
		// El push de l'id nou s'aplica al servidor, però el client no rep la resposta.
		servidor.perdreResposta = (files) => files.some((f) => f.id !== a.id);
		await expect(sincronitzar(servidor, USUARI)).rejects.toMatchObject({ codi: 'xarxa' });
		const [local] = await llistarAscensions();
		expect(local.id).not.toBe(a.id);
		expect(await pendentsDeSincronitzar()).toEqual([
			expect.objectContaining({ ascensioId: local.id })
		]);

		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ reassignades: 0 });
		expect([...servidor.files.keys()]).toEqual([local.id]);
		expect((await llistarAscensions()).map((f) => f.id)).toEqual([local.id]);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it("una edició mentre es pujava es conserva a la fila amb l'id nou", async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.aliens.add(a.id);
		servidor.duranPush = async () => {
			fixar('2026-09-29T11:00:00.000Z');
			await actualitzarAscensio(a.id, { nota: 'editada' });
		};
		await sincronitzar(servidor, USUARI);
		const [local] = await llistarAscensions();
		expect(local).toMatchObject({ nota: 'editada' });
		expect(local.id).not.toBe(a.id);
		expect(servidor.viva(local.id)?.nota).toBe('editada');
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});
});

describe('rebutjos permanents (no "pendents" per sempre)', () => {
	async function filaInvalida(): Promise<string> {
		const id = '01920000-0000-7000-8000-0000000000cc';
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
		return id;
	}

	it(`després de ${MAX_INTENTS} rebutjos l'entrada queda bloquejada; la fila local es conserva`, async () => {
		const id = await filaInvalida();
		let r = await sincronitzar(servidor, USUARI);
		for (let i = 1; i < MAX_INTENTS; i++) {
			expect(r).toMatchObject({ rebutjades: 1, bloquejades: 0 });
			r = await sincronitzar(servidor, USUARI);
		}
		expect(r).toMatchObject({ rebutjades: 1, bloquejades: 1 });
		expect(await filaLocal(id)).toMatchObject({ data: '2001-01-01' });
		expect(await pendentsDeSincronitzar()).toEqual([
			expect.objectContaining({ ascensioId: id, intents: MAX_INTENTS })
		]);
	});

	it("l'estat publica error 'servidor' i no la compta com a pendent", async () => {
		const id = await filaInvalida();
		const ok = await afegirAscensio({ cimId: CIM_B, data: '2026-09-20', metode: 'a-peu' });
		// Ja rebutjada MAX_INTENTS - 1 vegades: la sync següent la bloqueja.
		await obtenirBd().outbox.put({
			ascensioId: id,
			encuaAt: '2026-09-29T09:00:00.000Z',
			intents: MAX_INTENTS - 1
		});
		let darrer: EstatSync | undefined;
		const desub = estatSync.subscribe((e) => (darrer = e));
		configurarSync({ remot: servidor, usuariId: USUARI });
		await vi.waitFor(() =>
			expect(darrer).toMatchObject({ sincronitzant: false, error: 'servidor', pendents: 0 })
		);
		expect(servidor.viva(ok.id)).toBeDefined();
		expect(await llistarAscensions()).toHaveLength(2);
		desub();
	});
});

// ---------------------------------------------------------------------------
// Esborrats locals durant una passada en vol (QA-6b-2)
// ---------------------------------------------------------------------------

describe('esborrat local amb una passada de sync en vol', () => {
	async function meta(clau: 'propietari' | 'cursorPull' | 'ultimaSync') {
		return (await obtenirBd().meta.get(clau))?.valor ?? null;
	}

	/** Dues ascensions sincronitzades: el núvol les té i el cursor ja ha avançat. */
	async function sincronitzades() {
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await afegirAscensio({ cimId: CIM_B, data: '2026-09-21', metode: 'btt' });
		await sincronitzar(servidor, USUARI);
		expect(await meta('cursorPull')).not.toBeNull();
	}

	it('esborrarTot mentre el pull és en vol: la passada avorta i no torna a inserir res', async () => {
		await sincronitzades();
		// El pull solapa 5 s: la resposta en vol porta les dues files.
		servidor.duranPull = () => esborrarTot();
		await expect(sincronitzar(servidor, USUARI)).rejects.toBeInstanceOf(SyncAvortada);

		expect(await obtenirBd().ascensions.count()).toBe(0);
		expect(await pendentsDeSincronitzar()).toEqual([]);
		expect(await meta('cursorPull')).toBeNull();
		expect(await meta('ultimaSync')).toBeNull();
		expect(await meta('propietari')).toBeNull();
		// El núvol no es toca i la sync següent ho torna a baixar tot (cursor a zero).
		expect(servidor.files.size).toBe(2);
		const espia = vi.spyOn(servidor, 'pull');
		const r = await sincronitzar(servidor, USUARI);
		expect(espia.mock.calls[0][0]).toBeNull();
		expect(r).toMatchObject({ estat: 'fet', baixades: 2 });
		expect(await llistarAscensions()).toHaveLength(2);
		expect(await propietariLocal()).toBe(USUARI);
	});

	it('esborrarTot mentre el push és en vol: no es reescriu la cua ni el cursor', async () => {
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.duranPush = () => esborrarTot();
		await expect(sincronitzar(servidor, USUARI)).rejects.toBeInstanceOf(SyncAvortada);
		expect(await obtenirBd().ascensions.count()).toBe(0);
		expect(await pendentsDeSincronitzar()).toEqual([]);
		expect(await meta('cursorPull')).toBeNull();
		expect(servidor.crides.pull).toBe(0);
	});

	it('alliberarDadesLocals (esborrar el compte conservant les dades) també avorta la passada', async () => {
		await sincronitzades();
		const abans = await obtenirBd().ascensions.toArray();
		servidor.escriure(filaRemota()); // una fila nova del compte que s'esborra
		servidor.duranPull = () => alliberarDadesLocals();
		await expect(sincronitzar(servidor, USUARI)).rejects.toBeInstanceOf(SyncAvortada);
		// Les locals es conserven tal com eren; no hi entra res de la passada avortada.
		expect(await obtenirBd().ascensions.toArray()).toEqual(abans);
		expect(await meta('cursorPull')).toBeNull();
		expect(await meta('propietari')).toBeNull();
	});

	it("amb l'orquestració: sense error publicat i les dades no tornen fins a la sync següent", async () => {
		await sincronitzades();
		let darrer: EstatSync | undefined;
		const desub = estatSync.subscribe((e) => (darrer = e));
		configurarSync({ remot: servidor, usuariId: USUARI });
		await vi.waitFor(() => expect(darrer).toMatchObject({ sincronitzant: false }));
		const ultimaAbans = darrer?.ultimaSync;

		servidor.duranPull = () => esborrarTot();
		await sincronitzarAra();
		expect(darrer).toMatchObject({ sincronitzant: false, error: undefined });
		expect(darrer?.ultimaSync).toBe(ultimaAbans);
		expect(await obtenirBd().ascensions.count()).toBe(0);

		await sincronitzarAra();
		expect(await llistarAscensions()).toHaveLength(2);
		desub();
	});
});

// ---------------------------------------------------------------------------
// Companys (bloc R1) i compatibilitat amb files i clients anteriors
// ---------------------------------------------------------------------------

describe('companys: push i pull', () => {
	it('els companys es pugen amb la fila i baixen en un altre dispositiu', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa', 'el Pau']
		});
		await sincronitzar(servidor, USUARI);
		expect(servidor.rebudes).toEqual([
			expect.objectContaining({ id: a.id, companys: ['Inesa', 'el Pau'] })
		]);
		expect(servidor.viva(a.id)?.companys).toEqual(['Inesa', 'el Pau']);

		// Dispositiu nou del mateix compte.
		await esborrarTot();
		const r = await sincronitzar(servidor, USUARI);
		expect(r).toMatchObject({ baixades: 1 });
		expect(await llistarAscensions()).toEqual([
			expect.objectContaining({ id: a.id, companys: ['Inesa', 'el Pau'] })
		]);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('una ascensió nova sense companys puja la clau amb [] (el client nou sempre mana)', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		expect(servidor.rebudes[0]).toHaveProperty('companys', []);
		// El que baixa és idèntic al que hi ha: cap escriptura local.
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ pujades: 0, baixades: 0 });
		expect((await filaLocal(a.id))?.companys).toEqual([]);
	});

	it('treure els companys ([]) també es propaga', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		await sincronitzar(servidor, USUARI);
		fixar('2026-09-29T11:00:00.000Z');
		await actualitzarAscensio(a.id, { companys: [] });
		await sincronitzar(servidor, USUARI);
		expect(servidor.viva(a.id)?.companys).toEqual([]);
	});

	it('LWW: uns companys remots més nous guanyen i el pendent local es descarta', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		await sincronitzar(servidor, USUARI);
		fixar('2026-09-29T11:00:00.000Z');
		await actualitzarAscensio(a.id, { companys: ['Local'] });
		servidor.escriure({
			...(await filaLocal(a.id))!,
			companys: ['Remota', 'Mar'],
			updatedAt: '2026-09-29T12:00:00.000Z'
		});
		await sincronitzar(servidor, USUARI);
		expect((await filaLocal(a.id))?.companys).toEqual(['Remota', 'Mar']);
		expect(servidor.viva(a.id)?.companys).toEqual(['Remota', 'Mar']);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('una diferència només de companys amb el mateix updatedAt: guanya el servidor', async () => {
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, USUARI);
		servidor.escriure({ ...(await filaLocal(a.id))!, companys: ['Inesa'] });
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ baixades: 1 });
		expect((await filaLocal(a.id))?.companys).toEqual(['Inesa']);
	});
});

describe('files sense la clau companys (anteriors a R1) i client antic', () => {
	/** Fila tal com la tenia el dispositiu amb el client anterior: sense `companys`. */
	async function filaVella(canvis: Partial<FilaAscensio> = {}): Promise<FilaAscensio> {
		const fila: FilaAscensio = {
			id: '01920000-0000-7000-8000-0000000000dd',
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			nota: 'vella',
			createdAt: '2026-09-20T10:00:00.000Z',
			updatedAt: '2026-09-20T10:00:00.000Z',
			deletedAt: null,
			...canvis
		};
		await obtenirBd().ascensions.put(fila);
		return fila;
	}

	it('filaPush: sense la clau a la fila local, tampoc no s’envia', async () => {
		const vella = await filaVella();
		expect(filaPush(vella)).not.toHaveProperty('companys');
		expect(filaPush({ ...vella, companys: [] })).toHaveProperty('companys', []);
		expect(filaPush({ ...vella, companys: ['Inesa'] }).companys).toEqual(['Inesa']);
	});

	it('pujar una fila vella no esborra els companys que ja té al núvol, i després baixen', async () => {
		// Un altre dispositiu (client nou) hi va posar companys; aquest la té sense la clau i més
		// nova (hi ha editat la nota sense connexió).
		const vella = await filaVella();
		servidor.escriure({ ...vella, companys: ['Inesa', 'Pau'] });
		fixar('2026-09-29T11:00:00.000Z');
		await actualitzarAscensio(vella.id, { nota: 'editada sense connexió' });
		expect('companys' in (await filaLocal(vella.id))!).toBe(false);

		const r = await sincronitzar(servidor, USUARI);

		expect(r).toMatchObject({ pujades: 1, rebutjades: 0 });
		expect(servidor.rebudes[0]).not.toHaveProperty('companys');
		expect(servidor.viva(vella.id)).toMatchObject({
			nota: 'editada sense connexió',
			companys: ['Inesa', 'Pau']
		});
		// El pull de la mateixa passada porta els companys al dispositiu.
		expect(await filaLocal(vella.id)).toMatchObject({
			nota: 'editada sense connexió',
			companys: ['Inesa', 'Pau']
		});
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('client antic: un push sense companys (nota editada) conserva els del núvol', async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		await sincronitzar(servidor, USUARI);
		// La PWA antiga puja la fila amb el format antic (sense la clau) i més nova.
		const { companys: _companys, ...antiga } = filaPush((await filaLocal(a.id))!);
		void _companys;
		await servidor.push([
			{ ...antiga, nota: 'des del client antic', updatedAt: '2026-09-29T12:00:00.000Z' }
		]);
		expect(servidor.viva(a.id)).toMatchObject({
			nota: 'des del client antic',
			companys: ['Inesa']
		});
		// El client nou baixa la nota i manté els companys.
		await sincronitzar(servidor, USUARI);
		expect(await filaLocal(a.id)).toMatchObject({
			nota: 'des del client antic',
			companys: ['Inesa']
		});
	});

	it('després d’actualitzar l’app (cursor a zero), el pull complet porta els companys a les files velles', async () => {
		const vella = await filaVella();
		await sincronitzar(servidor, USUARI);
		expect(servidor.viva(vella.id)?.companys).toEqual([]);
		// El cursor avança més de 5 s (el solapament del pull) més enllà d'aquella fila.
		servidor.rellotge += 10_000_000;
		servidor.escriure(filaRemota());
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ baixades: 1 });
		// Un altre dispositiu hi havia posat companys **sense** que aquest ho baixés (simula el client
		// antic, que no demanava la columna): la fila local es queda sense la clau i el cursor ja
		// l'ha passada.
		servidor.files.get(vella.id)!.fila.companys = ['Inesa'];
		await obtenirBd().ascensions.put(vella);
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ baixades: 0 });
		expect('companys' in (await filaLocal(vella.id))!).toBe(false);

		// La migració v3 de Dexie posa el cursor a zero (vegeu `ascensions.spec.ts`): pull complet.
		await obtenirBd().meta.put({ clau: 'cursorPull', valor: null });
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ baixades: 1, pujades: 0 });
		expect((await filaLocal(vella.id))?.companys).toEqual(['Inesa']);
		expect(await pendentsDeSincronitzar()).toEqual([]);
	});

	it('una fila vella que ja és igual al núvol rep la clau ([]) en el primer pull complet', async () => {
		const vella = await filaVella();
		servidor.escriure(vella);
		await sincronitzar(servidor, USUARI);
		expect((await filaLocal(vella.id))?.companys).toEqual([]);
		// I ja no es torna a escriure.
		await obtenirBd().meta.put({ clau: 'cursorPull', valor: null });
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ baixades: 0 });
	});

	it("'id en ús': la fila reassignada conserva els companys", async () => {
		const a = await afegirAscensio({
			cimId: CIM_A,
			data: '2026-09-20',
			metode: 'a-peu',
			companys: ['Inesa']
		});
		servidor.aliens.add(a.id);
		await sincronitzar(servidor, USUARI);
		const [local] = await llistarAscensions();
		expect(local.id).not.toBe(a.id);
		expect(local.companys).toEqual(['Inesa']);
		expect(servidor.viva(local.id)?.companys).toEqual(['Inesa']);
	});
});

// ---------------------------------------------------------------------------
// Municipi d'origen (preferència del compte, LWW)
// ---------------------------------------------------------------------------

describe("sync del municipi d'origen", () => {
	const BARCELONA = '080193';
	const GIRONA = '170792';
	const VIC = '082981';
	const pref = () => obtenirBd().preferencies.get('origen');
	const posar = (p: Partial<EntradaPreferencia>) =>
		obtenirBd().preferencies.put({
			clau: 'origen',
			valor: BARCELONA,
			updatedAt: '2026-09-29T10:00:00.000Z',
			pendent: 0,
			...p
		});

	it('sense origen enlloc: només es llegeix i no es desa res', async () => {
		await sincronitzar(servidor, USUARI);
		expect(servidor.cridesOrigen).toEqual([null]);
		expect(await pref()).toBeUndefined();
		expect(servidor.origenCompte).toBeNull();
	});

	it("primera sessió: l'origen triat sense compte es puja i deixa d'estar pendent", async () => {
		await desarOrigen(BARCELONA);
		await sincronitzar(servidor, USUARI);
		expect(servidor.cridesOrigen).toEqual([
			{ codi: BARCELONA, updatedAt: '2026-09-29T10:00:00.000Z' }
		]);
		expect(servidor.origenCompte).toEqual({
			codi: BARCELONA,
			updatedAt: '2026-09-29T10:00:00.000Z'
		});
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: BARCELONA,
			updatedAt: '2026-09-29T10:00:00.000Z',
			pendent: 0
		});
		// La sync següent només llegeix.
		await sincronitzar(servidor, USUARI);
		expect(servidor.cridesOrigen.at(-1)).toBeNull();
	});

	it("dispositiu nou: baixa l'origen del compte", async () => {
		servidor.origenCompte = { codi: GIRONA, updatedAt: '2026-09-01T08:00:00.000Z' };
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: GIRONA,
			updatedAt: '2026-09-01T08:00:00.000Z',
			pendent: 0
		});
		expect(await llegirOrigen()).toBe(GIRONA);
	});

	it('LWW: el canvi local més nou guanya; el més antic perd contra el del compte', async () => {
		servidor.origenCompte = { codi: GIRONA, updatedAt: '2026-09-29T09:00:00.000Z' };
		await desarOrigen(BARCELONA); // 10:00, més nou
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte.codi).toBe(BARCELONA);
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });

		// Un altre dispositiu el canvia més tard; aquí hi ha un canvi local pendent més antic.
		servidor.origenCompte = { codi: VIC, updatedAt: '2026-09-29T12:00:00.000Z' };
		await posar({ valor: GIRONA, updatedAt: '2026-09-29T11:00:00.000Z', pendent: 1 });
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte).toEqual({ codi: VIC, updatedAt: '2026-09-29T12:00:00.000Z' });
		expect(await pref()).toEqual({
			clau: 'origen',
			valor: VIC,
			updatedAt: '2026-09-29T12:00:00.000Z',
			pendent: 0
		});
	});

	it('empat d’instant amb valors diferents: guanya el servidor', async () => {
		servidor.origenCompte = { codi: GIRONA, updatedAt: '2026-09-29T10:00:00.000Z' };
		await desarOrigen(BARCELONA); // mateix instant
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte.codi).toBe(GIRONA);
		expect(await pref()).toMatchObject({ valor: GIRONA, pendent: 0 });
	});

	it("treure l'origen també es propaga (valor null amb instant)", async () => {
		await desarOrigen(BARCELONA);
		await sincronitzar(servidor, USUARI);
		fixar('2026-09-29T11:00:00.000Z');
		await desarOrigen(null);
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte).toEqual({ codi: null, updatedAt: '2026-09-29T11:00:00.000Z' });
		// Un altre dispositiu que encara el tenia el perd en sincronitzar.
		await posar({ valor: BARCELONA, updatedAt: '2026-09-29T10:00:00.000Z', pendent: 0 });
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toMatchObject({ valor: null, pendent: 0 });
		expect(await llegirOrigen()).toBeNull();
	});

	it('si es canvia mentre la petició és en vol, no es trepitja i surt a la sync següent', async () => {
		await desarOrigen(BARCELONA);
		servidor.duranOrigen = async () => {
			fixar('2026-09-29T11:00:00.000Z');
			await desarOrigen(GIRONA);
		};
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toMatchObject({ valor: GIRONA, pendent: 1 });
		expect(servidor.origenCompte?.codi).toBe(BARCELONA);
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte?.codi).toBe(GIRONA);
		expect(await pref()).toMatchObject({ valor: GIRONA, pendent: 0 });
	});

	it('si el compte no té (o té més antic) un origen local ja pujat, es torna a pujar', async () => {
		await desarOrigen(BARCELONA);
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });
		// El compte el perd (no hauria de passar): la sync ho detecta i el torna a pujar.
		servidor.origenCompte = null;
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 1 });
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte).toEqual({
			codi: BARCELONA,
			updatedAt: '2026-09-29T10:00:00.000Z'
		});
		expect(await pref()).toMatchObject({ pendent: 0 });
		// El mateix si el compte en té un de més antic que el local ja pujat.
		servidor.origenCompte = { codi: GIRONA, updatedAt: '2026-09-01T00:00:00.000Z' };
		await sincronitzar(servidor, USUARI);
		await sincronitzar(servidor, USUARI);
		expect(servidor.origenCompte.codi).toBe(BARCELONA);
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });
	});

	it('un Remot sense `origen` no el sincronitza (i la resta de la sync funciona)', async () => {
		await desarOrigen(BARCELONA);
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		const senseOrigen: Remot = {
			push: (files) => servidor.push(files),
			pull: (desDe, limit) => servidor.pull(desDe, limit)
		};
		expect(await sincronitzar(senseOrigen, USUARI)).toMatchObject({ estat: 'fet', pujades: 1 });
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 1 });
		expect(servidor.cridesOrigen).toEqual([]);
	});

	it('un rebuig del servidor no bloqueja la sync de les ascensions (queda pendent)', async () => {
		const avis = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await desarOrigen(BARCELONA);
		const a = await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		servidor.fallaOrigen = new ErrorSync('servidor', 'codi de municipi invàlid');
		expect(await sincronitzar(servidor, USUARI)).toMatchObject({ estat: 'fet', pujades: 1 });
		expect(servidor.viva(a.id)).toBeDefined();
		expect(await pref()).toMatchObject({ pendent: 1 });
		// Dada personal: el codi del municipi no surt al registre.
		expect(JSON.stringify(avis.mock.calls)).not.toContain(BARCELONA);
		avis.mockRestore();
		// Un error de xarxa, en canvi, fa fallar la passada (es reintentarà).
		servidor.fallaOrigen = new ErrorSync('xarxa');
		await expect(sincronitzar(servidor, USUARI)).rejects.toMatchObject({ codi: 'xarxa' });
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toMatchObject({ pendent: 0 });
	});

	it('un codi amb format invàlid que arribi del servidor no es desa', async () => {
		servidor.origenCompte = { codi: 'Barcelona', updatedAt: '2026-09-29T09:00:00.000Z' };
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toBeUndefined();
	});

	it('esborrarTot mentre la petició és en vol: no es torna a escriure la preferència', async () => {
		servidor.origenCompte = { codi: GIRONA, updatedAt: '2026-09-01T08:00:00.000Z' };
		servidor.duranOrigen = () => esborrarTot();
		await expect(sincronitzar(servidor, USUARI)).rejects.toBeInstanceOf(SyncAvortada);
		expect(await obtenirBd().preferencies.count()).toBe(0);
		// La sync següent el torna a baixar.
		await sincronitzar(servidor, USUARI);
		expect(await llegirOrigen()).toBe(GIRONA);
	});

	it("dades d'un altre compte: res fins que l'usuari tria; `descartar-locals` baixa el del compte", async () => {
		await desarOrigen(BARCELONA);
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, ALTRE); // el dispositiu és d'un altre compte
		const nou = new ServidorFals();
		nou.origenCompte = { codi: GIRONA, updatedAt: '2026-09-01T08:00:00.000Z' };
		expect(await sincronitzar(nou, USUARI)).toEqual({ estat: 'conflicte' });
		expect(nou.cridesOrigen).toEqual([]);
		expect(await llegirOrigen()).toBe(BARCELONA);

		configurarSync({ remot: nou, usuariId: USUARI });
		await sincronitzarAra();
		await resoldreConflicteCompte('descartar-locals');
		expect(await pref()).toMatchObject({ valor: GIRONA, pendent: 0 });
		// El compte nou no rep l'origen de l'altre.
		expect(nou.origenCompte.codi).toBe(GIRONA);
		expect(servidor.origenCompte?.codi).toBe(BARCELONA);
	});

	it('`fusionar`: l’origen del dispositiu es puja al compte actual i guanya el més recent', async () => {
		await desarOrigen(BARCELONA); // 10:00
		await afegirAscensio({ cimId: CIM_A, data: '2026-09-20', metode: 'a-peu' });
		await sincronitzar(servidor, ALTRE);
		expect(await pref()).toMatchObject({ pendent: 0 });

		const mesAntic = new ServidorFals();
		mesAntic.origenCompte = { codi: GIRONA, updatedAt: '2026-09-01T08:00:00.000Z' };
		configurarSync({ remot: mesAntic, usuariId: USUARI });
		await sincronitzarAra();
		await resoldreConflicteCompte('fusionar');
		expect(mesAntic.origenCompte.codi).toBe(BARCELONA);
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });
		expect(await propietariLocal()).toBe(USUARI);
	});

	it('alliberarDadesLocals: l’origen es queda i queda pendent per al compte que vingui', async () => {
		await desarOrigen(BARCELONA);
		await sincronitzar(servidor, USUARI);
		expect(await pref()).toMatchObject({ pendent: 0 });
		await alliberarDadesLocals();
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 1 });
		const nou = new ServidorFals();
		await sincronitzar(nou, ALTRE);
		expect(nou.origenCompte?.codi).toBe(BARCELONA);
	});

	it("l'estat compta l'origen pendent i el puja sol (amb sessió)", async () => {
		let darrer: EstatSync | undefined;
		const desub = estatSync.subscribe((e) => (darrer = e));
		configurarSync({ remot: servidor, usuariId: USUARI });
		await vi.waitFor(() => expect(darrer).toMatchObject({ sincronitzant: false, pendents: 0 }));
		await desarOrigen(BARCELONA);
		await vi.waitFor(() => expect(darrer?.pendents).toBe(1));
		await sincronitzarAra();
		await vi.waitFor(() => expect(darrer?.pendents).toBe(0));
		expect(servidor.origenCompte?.codi).toBe(BARCELONA);
		desub();
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
	// (el mateix `rpc` serveix per a `sync_push` i `sync_origen`)
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
		companys: ['Inesa', 'el Pau'],
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
					companys: ['Inesa', 'el Pau'],
					createdAt: '2025-08-15T10:00:00.000Z',
					updatedAt: '2025-08-15T10:00:00.500Z',
					deletedAt: null
				},
				serverUpdatedAt: sql.server_updated_at
			}
		]);
		// El pull demana la columna nova.
		expect(String(crides[1].args[0])).toContain('companys');
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

	it('filaDesDeSql: companys del núvol → fila local; sense la columna, sense la clau', () => {
		expect(filaDesDeSql({ ...sql, companys: [] }).fila.companys).toEqual([]);
		expect(filaDesDeSql({ ...sql, companys: null }).fila.companys).toEqual([]);
		const { companys: _c, ...senseColumna } = sql;
		void _c;
		expect(filaDesDeSql(senseColumna).fila).not.toHaveProperty('companys');
	});

	it('push envia els companys només si la fila els porta', async () => {
		const { client, crides } = clientFals({
			rpc: { data: { acceptades: 2, rebutjades: [] }, error: null, status: 200 }
		});
		const amb = filaPush({ ...filaRemota(), companys: ['Inesa'] });
		const sense = filaPush(filaRemota({ id: '01920000-0000-7000-8000-0000000000ab' }));
		await remotSupabase(client).push([amb, sense]);
		const enviades = (crides[0].args[1] as { files: Record<string, unknown>[] }).files;
		expect(enviades[0]).toHaveProperty('companys', ['Inesa']);
		expect(enviades[1]).not.toHaveProperty('companys');
	});

	it('origen crida `sync_origen` (amb el canvi o sense) i normalitza la resposta', async () => {
		const resposta = { codi: '080193', updatedAt: '2026-09-29T10:00:00.123+00:00' };
		const { client, crides } = clientFals({ rpc: { data: resposta, error: null, status: 200 } });
		const remot = remotSupabase(client);
		const canvi = { codi: '080193', updatedAt: '2026-09-29T10:00:00.123Z' };
		expect(await remot.origen!(canvi)).toEqual(canvi);
		expect(crides[0]).toEqual({ metode: 'rpc', args: ['sync_origen', { canvi }] });
		await remot.origen!(null);
		expect(crides[1]).toEqual({ metode: 'rpc', args: ['sync_origen', {}] });

		const buit = clientFals({ rpc: { data: null, error: null, status: 200 } });
		expect(await remotSupabase(buit.client).origen!(null)).toBeNull();
		const ko = clientFals({
			rpc: { data: null, error: { message: 'JWT expired', code: 'PGRST301' }, status: 401 }
		});
		await expect(remotSupabase(ko.client).origen!(null)).rejects.toMatchObject({ codi: 'sessio' });
	});

	it('origenDesDeJson: null si no hi ha instant; codi null si l’usuari el va treure', () => {
		expect(origenDesDeJson(null)).toBeNull();
		expect(origenDesDeJson('x')).toBeNull();
		expect(origenDesDeJson({ codi: '080193' })).toBeNull();
		expect(origenDesDeJson({ codi: '080193', updatedAt: 'ahir' })).toBeNull();
		expect(origenDesDeJson({ codi: null, updatedAt: '2026-09-29T10:00:00+00:00' })).toEqual({
			codi: null,
			updatedAt: '2026-09-29T10:00:00.000Z'
		});
	});
});
