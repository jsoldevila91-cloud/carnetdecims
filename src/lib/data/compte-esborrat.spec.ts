/**
 * QA-6b-2: els esborrats locals del compte (`esborrarTot` amb sessió, `sortir({ esborrarDades })`
 * i `esborrarCompte()`) amb una passada de sync en vol. El pull es reté (petició lenta), s'esborra
 * i després arriba la resposta: no ha de tornar a inserir res ni reescriure el cursor.
 * Client de Supabase fals (sense xarxa ni correus).
 */
import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type Fila = {
	id: string;
	cim_id: number;
	data: string;
	metode: string;
	nota: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	server_updated_at: string;
};

const fals = vi.hoisted(() => {
	const estat = {
		nuvol: new Map<string, Fila>(),
		tic: 0,
		callback: null as null | ((event: string, session: unknown) => void),
		/** Si hi és, el pull següent espera aquesta promesa abans de respondre. */
		retenir: null as null | Promise<void>,
		pullsEnVol: 0,
		crides: [] as string[]
	};
	const instant = () =>
		new Date(Date.UTC(2026, 9, 1) + ++estat.tic).toISOString().replace('Z', '000+00:00');
	const client = {
		auth: {
			onAuthStateChange(cb: (event: string, session: unknown) => void) {
				estat.callback = cb;
				return { data: { subscription: { unsubscribe() {} } } };
			},
			async signOut() {
				estat.crides.push('signOut');
				return { error: null };
			}
		},
		async rpc(nom: string, args: { files?: Record<string, unknown>[] }) {
			estat.crides.push(nom);
			if (nom === 'sync_push') {
				for (const f of args.files ?? []) {
					estat.nuvol.set(f.id as string, {
						id: f.id as string,
						cim_id: f.cimId as number,
						data: f.data as string,
						metode: String(f.metode).replace('-', '_'),
						nota: (f.nota as string | null) ?? null,
						created_at: f.createdAt as string,
						updated_at: f.updatedAt as string,
						deleted_at: (f.deletedAt as string | null) ?? null,
						server_updated_at: instant()
					});
				}
				return {
					data: { acceptades: args.files?.length ?? 0, rebutjades: [] },
					error: null,
					status: 200
				};
			}
			if (nom === 'esborrar_compte') {
				estat.nuvol.clear();
				return { data: null, error: null, status: 200 };
			}
			return { data: null, error: { message: 'no implementat' }, status: 501 };
		},
		from() {
			let desDe: string | null = null;
			const consulta = {
				select: () => consulta,
				gte: (_c: string, v: string) => ((desDe = v), consulta),
				order: () => consulta,
				async limit(n: number) {
					// La resposta es calcula en arribar la petició (abans de l'esborrat).
					const files = [...estat.nuvol.values()]
						.filter((f) => !desDe || Date.parse(f.server_updated_at) >= Date.parse(desDe))
						.sort((a, b) => a.server_updated_at.localeCompare(b.server_updated_at))
						.slice(0, n);
					estat.pullsEnVol++;
					try {
						if (estat.retenir) await estat.retenir;
					} finally {
						estat.pullsEnVol--;
					}
					return { data: files, error: null, status: 200 };
				}
			};
			return consulta;
		}
	};
	return { estat, client };
});

vi.mock('$lib/platform/supabase', () => ({
	CLAU_SESSIO: 'carnetdecims-auth',
	supabaseConfigurat: () => true,
	obtenirSupabase: () => fals.client,
	sessioDesada: () => null
}));

const { afegirAscensio, esborrarTot, llistarAscensions } = await import('./ascensions');
const { CIMS } = await import('./catalog/cataleg');
const { obtenirBd, tancarBd } = await import('./local/db');
const { establirRellotge } = await import('./local/rellotge');
const { esborrarCompte, iniciarCompte, sessio, sortir } = await import('./compte');
const { _reiniciarSyncPerTests, estatSync, sincronitzarAra } = await import('./sync');

const USUARI = { id: '11111111-1111-4111-8111-111111111111', email: 'inesa@exemple.cat' };

async function meta(clau: 'propietari' | 'cursorPull' | 'ultimaSync') {
	return (await obtenirBd().meta.get(clau))?.valor ?? null;
}

let estatSessio = '';
let sincronitzant = false;
let desubs: (() => void)[] = [];

/** Entra (SIGNED_IN) i espera que la primera sync hagi pujat i baixat les ascensions locals. */
async function entrarISincronitzar() {
	fals.estat.callback?.('SIGNED_IN', { user: USUARI });
	await vi.waitFor(() => expect(estatSessio).toBe('autenticat'));
	await vi.waitFor(async () => {
		expect(await meta('cursorPull')).not.toBeNull();
		expect(sincronitzant).toBe(false);
	});
}

/** Comença una passada amb el pull retingut i espera que la petició sigui en vol. */
async function passadaAmbPullRetingut() {
	let alliberar!: () => void;
	fals.estat.retenir = new Promise<void>((r) => (alliberar = r));
	const enCurs = sincronitzarAra();
	await vi.waitFor(() => expect(fals.estat.pullsEnVol).toBe(1));
	return {
		async acabar() {
			fals.estat.retenir = null;
			alliberar();
			await enCurs;
		}
	};
}

beforeAll(() => {
	vi.stubGlobal('window', new EventTarget());
	vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'hidden' }));
	iniciarCompte();
});

beforeEach(async () => {
	establirRellotge(() => new Date('2026-09-29T10:00:00.000Z'));
	desubs = [
		sessio.subscribe((s) => (estatSessio = s.estat)),
		estatSync.subscribe((e) => (sincronitzant = e.sincronitzant))
	];
	await esborrarTot();
	fals.estat.nuvol.clear();
	fals.estat.crides = [];
	await afegirAscensio({ cimId: CIMS[0].id, data: '2026-09-20', metode: 'a-peu' });
	await afegirAscensio({ cimId: CIMS[1].id, data: '2026-09-21', metode: 'btt' });
	await entrarISincronitzar();
	expect(fals.estat.nuvol.size).toBe(2);
});

afterEach(async () => {
	fals.estat.retenir = null;
	await sortir();
	for (const d of desubs) d();
	_reiniciarSyncPerTests();
	establirRellotge();
});

afterAll(() => {
	vi.unstubAllGlobals();
	tancarBd();
});

describe('esborrats locals amb una passada de sync en vol (QA-6b-2)', () => {
	it('"Esborra totes les dades" amb sessió: no reapareixen i el cursor queda a zero', async () => {
		const passada = await passadaAmbPullRetingut();
		await esborrarTot();
		await passada.acabar();

		expect(await obtenirBd().ascensions.count()).toBe(0);
		expect(await meta('cursorPull')).toBeNull();
		expect(await meta('propietari')).toBeNull();
		// La sessió continua: la sync següent ho torna a baixar tot del núvol.
		expect(estatSessio).toBe('autenticat');
		await sincronitzarAra();
		expect(await llistarAscensions()).toHaveLength(2);
	});

	it('sortir({ esborrarDades: true }): el dispositiu queda buit encara que arribi el pull', async () => {
		const passada = await passadaAmbPullRetingut();
		await sortir({ esborrarDades: true });
		await passada.acabar();

		expect(estatSessio).toBe('anonim');
		expect(await obtenirBd().ascensions.count()).toBe(0);
		expect(await obtenirBd().outbox.count()).toBe(0);
		expect(await meta('cursorPull')).toBeNull();
		expect(await meta('propietari')).toBeNull();
		expect(fals.estat.nuvol.size).toBe(2); // el núvol no es toca
	});

	it("esborrarCompte(): no hi tornen les files del compte que s'acaba d'esborrar", async () => {
		const passada = await passadaAmbPullRetingut();
		await esborrarCompte();
		await passada.acabar();

		expect(fals.estat.crides).toContain('esborrar_compte');
		expect(estatSessio).toBe('anonim');
		expect(await obtenirBd().ascensions.count()).toBe(0);
		expect(await meta('cursorPull')).toBeNull();
		expect(await meta('propietari')).toBeNull();
	});

	it('esborrarCompte({ conservarDispositiu: true }): les locals es queden, sense cursor ni propietari', async () => {
		const abans = await obtenirBd().ascensions.toArray();
		const passada = await passadaAmbPullRetingut();
		await esborrarCompte({ conservarDispositiu: true });
		await passada.acabar();

		expect(await obtenirBd().ascensions.toArray()).toEqual(abans);
		expect(await meta('cursorPull')).toBeNull();
		expect(await meta('propietari')).toBeNull();
	});
});
