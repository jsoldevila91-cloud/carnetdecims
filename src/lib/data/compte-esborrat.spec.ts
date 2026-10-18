/**
 * QA-6b-2: els esborrats locals del compte (`esborrarTot` amb sessió, `sortir({ esborrarDades })`
 * i `esborrarCompte()`) amb una passada de sync en vol. El pull es reté (petició lenta), s'esborra
 * i després arriba la resposta: no ha de tornar a inserir res ni reescriure el cursor.
 * Client de Supabase fals (sense xarxa ni correus).
 *
 * Bloc R1: què passa amb el municipi d'origen en cada esborrat, i l'exportació del compte amb
 * els companys i l'origen.
 */
import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type Fila = {
	id: string;
	cim_id: number;
	data: string;
	metode: string;
	nota: string | null;
	companys: string[];
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	server_updated_at: string;
};

const fals = vi.hoisted(() => {
	const estat = {
		nuvol: new Map<string, Fila>(),
		/** Municipi d'origen del compte (`perfils`). */
		origen: null as null | { codi: string | null; updatedAt: string },
		tic: 0,
		callback: null as null | ((event: string, session: unknown) => void),
		/** Si hi és, el pull següent espera aquesta promesa abans de respondre. */
		retenir: null as null | Promise<void>,
		pullsEnVol: 0,
		crides: [] as string[],
		/** Columnes demanades a cada taula (`taula: columnes`). */
		seleccions: [] as string[]
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
						// Com la migració 0005: sense la clau, es conserven els desats.
						companys: Array.isArray(f.companys)
							? (f.companys as string[])
							: (estat.nuvol.get(f.id as string)?.companys ?? []),
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
				estat.origen = null;
				return { data: null, error: null, status: 200 };
			}
			if (nom === 'sync_origen') {
				// Com la RPC: LWW estricte i retorna el que queda al compte.
				const canvi = (args as { canvi?: { codi: string | null; updatedAt: string } }).canvi;
				if (canvi && (!estat.origen || canvi.updatedAt > estat.origen.updatedAt)) {
					estat.origen = { ...canvi };
				}
				return { data: estat.origen, error: null, status: 200 };
			}
			return { data: null, error: { message: 'no implementat' }, status: 501 };
		},
		from(taula: string) {
			let desDe: string | null = null;
			const consulta = {
				select: (columnes: string) => (estat.seleccions.push(`${taula}: ${columnes}`), consulta),
				gte: (_c: string, v: string) => ((desDe = v), consulta),
				order: () => consulta,
				// Exportació del compte: pàgines d'`ascensions` i el perfil.
				async range(a: number, b: number) {
					return { data: [...estat.nuvol.values()].slice(a, b + 1), error: null, status: 200 };
				},
				async maybeSingle() {
					const perfil = estat.origen
						? {
								alias: null,
								origen_municipi: estat.origen.codi,
								origen_updated_at: estat.origen.updatedAt.replace('Z', '+00:00'),
								created_at: '2026-10-01T00:00:00+00:00',
								updated_at: '2026-10-01T00:00:00+00:00'
							}
						: null;
					return { data: perfil, error: null, status: 200 };
				},
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
	googleAuthActiu: false,
	contrasenyaAuthActiu: false,
	obtenirSupabase: () => fals.client,
	sessioDesada: () => null
}));

const { afegirAscensio, esborrarTot, llistarAscensions } = await import('./ascensions');
const { CIMS } = await import('./catalog/cataleg');
const { obtenirBd, tancarBd } = await import('./local/db');
const { establirRellotge } = await import('./local/rellotge');
const { esborrarCompte, exportarDadesCompte, iniciarCompte, sessio, sortir } =
	await import('./compte');
const { _reiniciarSyncPerTests, estatSync, sincronitzarAra } = await import('./sync');
const { desarOrigen, llegirOrigen } = await import('./origen');
const { importarDades } = await import('./ascensions');

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
	fals.estat.origen = null;
	fals.estat.crides = [];
	fals.estat.seleccions = [];
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

describe("municipi d'origen i compte (bloc R1)", () => {
	const BARCELONA = '080193';
	const pref = () => obtenirBd().preferencies.get('origen');

	/** Tria l'origen amb sessió i espera que hagi pujat al compte. */
	async function origenSincronitzat() {
		await desarOrigen(BARCELONA);
		await sincronitzarAra();
		expect(fals.estat.origen).toMatchObject({ codi: BARCELONA });
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });
	}

	it('sortir(): es queda al dispositiu; en tornar a entrar no es torna a pujar', async () => {
		await origenSincronitzat();
		await sortir();
		expect(estatSessio).toBe('anonim');
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });
		expect(fals.estat.origen).toMatchObject({ codi: BARCELONA });
	});

	it('sortir({ esborrarDades: true }): s’esborra del dispositiu, no del compte', async () => {
		await origenSincronitzat();
		await sortir({ esborrarDades: true });
		expect(await obtenirBd().preferencies.count()).toBe(0);
		expect(fals.estat.origen).toMatchObject({ codi: BARCELONA });
		// En tornar a entrar, baixa del compte.
		await entrarISincronitzar();
		expect(await llegirOrigen()).toBe(BARCELONA);
	});

	it('"Esborra totes les dades" amb sessió: la sync següent el torna a baixar', async () => {
		await origenSincronitzat();
		await esborrarTot();
		expect(await llegirOrigen()).toBeNull();
		await sincronitzarAra();
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 0 });
	});

	it('esborrarCompte(): desapareix del núvol i del dispositiu', async () => {
		await origenSincronitzat();
		await esborrarCompte();
		expect(fals.estat.origen).toBeNull();
		expect(await obtenirBd().preferencies.count()).toBe(0);
	});

	it('esborrarCompte({ conservarDispositiu: true }): es queda al dispositiu, pendent d’un compte futur', async () => {
		await origenSincronitzat();
		await esborrarCompte({ conservarDispositiu: true });
		expect(fals.estat.origen).toBeNull();
		expect(await pref()).toMatchObject({ valor: BARCELONA, pendent: 1 });
		expect(await meta('propietari')).toBeNull();
	});

	it('exportarDadesCompte: versió 2 amb companys i municipi d’origen, importable', async () => {
		const amb = await afegirAscensio({
			cimId: CIMS[2].id,
			data: '2026-09-22',
			metode: 'esqui',
			nota: 'amb la colla',
			companys: ['Inesa', 'el Pau']
		});
		await origenSincronitzat();
		const exp = JSON.parse(await exportarDadesCompte());
		expect(exp).toMatchObject({
			format: 'carnetdecims.ascensions',
			versio: 2,
			compte: { id: USUARI.id, email: USUARI.email },
			preferencies: {
				origen: { codi: BARCELONA, nom: 'Barcelona', updatedAt: '2026-09-29T10:00:00.000Z' }
			},
			total: 3
		});
		expect(exp.compte.perfil).toMatchObject({ origen_municipi: BARCELONA });
		expect(exp.ascensions).toHaveLength(3);
		expect(exp.ascensions.find((a: { id: string }) => a.id === amb.id)).toMatchObject({
			nota: 'amb la colla',
			companys: ['Inesa', 'el Pau']
		});
		for (const a of exp.ascensions) expect(Array.isArray(a.companys)).toBe(true);
		// Demana les columnes noves al núvol.
		expect(fals.estat.seleccions.some((c) => /^ascensions: .*companys/.test(c))).toBe(true);
		expect(fals.estat.seleccions.some((c) => /^perfils: .*origen_municipi/.test(c))).toBe(true);

		// El fitxer es pot importar en un dispositiu buit i sense sessió.
		await sortir({ esborrarDades: true });
		expect(await importarDades(JSON.stringify(exp), 'fusionar')).toEqual({
			afegides: 3,
			actualitzades: 0,
			ignorades: 0,
			origenImportat: true
		});
		expect(await llegirOrigen()).toBe(BARCELONA);
		expect((await llistarAscensions()).find((a) => a.id === amb.id)?.companys).toEqual([
			'Inesa',
			'el Pau'
		]);
	});

	it('exportarDadesCompte sense origen al compte: preferencies.origen és null', async () => {
		const exp = JSON.parse(await exportarDadesCompte());
		expect(exp.preferencies).toEqual({ origen: null });
		expect(exp.compte.perfil).toBeNull();
	});

	it('exportarDadesCompte: les làpides surten sense nota ni companys, encara que el núvol els tingui', async () => {
		// Làpida dins de la finestra de desfer (o d'un client antic): al núvol encara té el diari.
		const id = '01920000-0000-7000-8000-0000000000bb';
		fals.estat.nuvol.set(id, {
			id,
			cim_id: CIMS[3].id,
			data: '2026-09-10',
			metode: 'a_peu',
			nota: 'nota esborrada',
			companys: ['Inesa', 'el Pau'],
			created_at: '2026-09-10T10:00:00+00:00',
			updated_at: '2026-09-29T09:59:00+00:00',
			deleted_at: '2026-09-29T09:59:00+00:00',
			server_updated_at: '2026-10-01T00:00:01.000000+00:00'
		});
		const text = await exportarDadesCompte();
		const exp = JSON.parse(text);
		expect(exp.total).toBe(2);
		expect(exp.ascensions.find((a: { id: string }) => a.id === id)).toMatchObject({
			nota: null,
			companys: [],
			deletedAt: '2026-09-29T09:59:00.000Z'
		});
		expect(text).not.toContain('nota esborrada');
		expect(text).not.toContain('el Pau');
	});
});
