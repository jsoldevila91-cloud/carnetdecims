/**
 * Fase 5 · Compte i sincronització (beta privada) amb Supabase **fals** (`supabase-fals.ts`).
 *
 * Cap petició arriba al Supabase real: la fixture automàtica `supa` intercepta tot
 * `*.supabase.co` del context abans de navegar i falla el test si hi ha cap petició que el
 * servidor fals no sap respondre.
 *
 * Cobreix: demanar l'enllaç (enviat, reenviar als 60 s, errors traduïts), entrar amb el codi,
 * tornar de l'enllaç (`token_hash`), primer accés (pujada de les dades locals, migració Dexie
 * v1 → v2), idempotència del push, pull amb LWW, cua offline, conflicte amb dades d'un altre
 * compte, tancar sessió, esborrar el compte, "Esborra totes les dades" (local), indicador del
 * núvol, franja "Crea un compte", avís de beta, axe clar/fosc i reflow a 320 px.
 */
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { test as base, expect, gotoHydrated, settleAnimations } from './fixtures';
import {
	CIM,
	NOM_BD,
	botoRegistrar,
	completar,
	obrirFullNav,
	sembrar,
	toast,
	triarCim,
	uuidTest,
	type FilaSembra
} from './ascensions';
import {
	CLAU_SESSIO,
	CODI_BO,
	TOKEN_HASH_BO,
	desarSessio,
	escriureMeta,
	idUsuari,
	llegirTaula,
	supabaseFals,
	type SupabaseFals
} from './supabase-fals';

const test = base.extend<{ supa: SupabaseFals }>({
	supa: [
		async ({ context, consoleGuard }, use) => {
			// Les respostes d'error que el servidor fals torna a propòsit (403 codi caducat, 429,
			// 500…) el navegador les escriu a la consola i l'app no ho pot evitar. Les no previstes
			// (501) les detecta `noGestionades`.
			consoleGuard.allow(
				/Failed to load resource: the server responded with a status of (400|401|403|429|500)/
			);
			const s = await supabaseFals(context, [INESA, ALTRE]);
			await use(s);
			expect(s.noGestionades, 'peticions a Supabase sense resposta al servidor fals').toEqual([]);
		},
		{ auto: true }
	]
});

const COMPTE = '/ca/app/compte';
const INESA = 'inesa@exemple.cat';
const ALTRE = 'altre@exemple.cat';
const CLAU_ENLLAC = 'carnetdecims:enllac-enviat';

const LLAVOR: FilaSembra[] = [
	{ cimId: CIM.pedraforca.id, data: '2024-08-10', nota: 'Per la canal' },
	{ cimId: CIM.montcau.id, data: '2025-02-01', metode: 'btt' }
];

const seccio = (page: Page) => page.locator('section#compte');
const comptador = (page: Page) => page.locator('main').getByText(/^Ascensions desades: \d+$/);
const vives = async (page: Page) =>
	(await llegirTaula<{ id: string; deletedAt: string | null }>(page, 'ascensions')).filter(
		(f) => !f.deletedAt
	);
const meta = async (page: Page) =>
	Object.fromEntries(
		(await llegirTaula<{ clau: string; valor: string | null }>(page, 'meta')).map((m) => [
			m.clau,
			m.valor
		])
	);
const idsPujats = (s: SupabaseFals) => new Set(s.pushos.flat().map((f) => f.id));

/** Llavor local (anònima) + sessió desada → obre `url` amb la sessió iniciada. */
async function prepararAutenticat(
	page: Page,
	email: string,
	files: FilaSembra[] = [],
	opcions: { url?: string; propietari?: string } = {}
) {
	const rows = await sembrar(page, files, '/ca/app');
	if (opcions.propietari) await escriureMeta(page, { propietari: opcions.propietari });
	await desarSessio(page, email);
	await gotoHydrated(page, opcions.url ?? COMPTE);
	return rows;
}

async function esperarSincronitzat(page: Page) {
	await expect(seccio(page).getByText(/Tot desat al núvol/)).toBeVisible({ timeout: 15_000 });
}

async function demanarEnllac(page: Page, email = INESA) {
	await seccio(page).getByLabel('Correu electrònic').fill(email);
	await seccio(page).getByRole('button', { name: "Envia'm l'enllaç" }).click();
	await expect(seccio(page).getByText(`T'hem enviat un correu a ${email}.`)).toBeVisible();
}

// ---------------------------------------------------------------------------
// Entrar
// ---------------------------------------------------------------------------

test.describe('Entrar sense contrasenya', () => {
	test('demana l’enllaç: estat "T’hem enviat…", compte enrere de 60 s i reenviament', async ({
		page,
		supa
	}) => {
		await gotoHydrated(page, COMPTE);
		await expect(seccio(page).getByText(/Crea un compte per desar el teu carnet/)).toBeVisible();
		await seccio(page).getByLabel('Correu electrònic').fill('  Inesa@Exemple.CAT ');
		await seccio(page).getByRole('button', { name: "Envia'm l'enllaç" }).click();
		await expect(
			seccio(page).getByText(/T'hem enviat un correu a Inesa@Exemple\.CAT/)
		).toBeVisible();
		// El servidor rep el correu net i la URL de tornada a /ca/app/compte.
		expect(supa.otps).toEqual([INESA]);
		const otp = supa.crides('/auth/v1/otp')[0];
		expect(decodeURIComponent(otp.query)).toContain(
			'redirect_to=http://localhost:4173/ca/app/compte'
		);
		expect(otp.cos).toMatchObject({ email: INESA, create_user: true });
		// El focus va a l'avís (lector de pantalla) i no es pot reenviar encara.
		await expect(seccio(page).locator('.enviat')).toBeFocused();
		await expect(
			seccio(page).getByText(/Podràs tornar a enviar l'enllaç d'aquí a (60|59|58) s\./)
		).toBeVisible();
		await expect(seccio(page).getByRole('button', { name: "Torna a enviar l'enllaç" })).toHaveCount(
			0
		);

		// L'estat sobreviu a una recàrrega; passats 60 s apareix el botó de reenviar.
		await page.evaluate(
			({ clau }) => {
				const v = JSON.parse(localStorage.getItem(clau)!);
				localStorage.setItem(clau, JSON.stringify({ ...v, t: Date.now() - 61_000 }));
			},
			{ clau: CLAU_ENLLAC }
		);
		await gotoHydrated(page, COMPTE);
		await expect(seccio(page).getByText(/T'hem enviat un correu a/)).toBeVisible();
		const reenviar = seccio(page).getByRole('button', { name: "Torna a enviar l'enllaç" });
		await expect(reenviar).toBeVisible();
		await reenviar.click();
		await expect(toast(page, "T'hem tornat a enviar l'enllaç.")).toBeVisible();
		expect(supa.otps).toHaveLength(2);
		await expect(seccio(page).getByText(/d'aquí a (60|59|58) s/)).toBeVisible();

		// "Fes servir un altre correu" torna al formulari amb el focus al camp.
		await seccio(page).getByRole('button', { name: 'Fes servir un altre correu' }).click();
		await expect(seccio(page).getByLabel('Correu electrònic')).toBeFocused();
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_ENLLAC)).toBeNull();
	});

	test('errors en demanar l’enllaç, traduïts i sense perdre el formulari', async ({
		page,
		context,
		supa
	}) => {
		await gotoHydrated(page, COMPTE);
		const camp = seccio(page).getByLabel('Correu electrònic');
		const enviar = seccio(page).getByRole('button', { name: "Envia'm l'enllaç" });
		const alerta = seccio(page).getByRole('alert');

		// Validació al client: no s'envia res.
		await camp.fill('no-es-un-correu');
		await enviar.click();
		await expect(alerta).toHaveText(/Escriu una adreça de correu vàlida/);
		expect(supa.otps).toEqual([]);

		// Error del servidor (p. ex. SMTP): missatge genèric traduït.
		supa.errorOtp = {
			status: 500,
			error_code: 'unexpected_failure',
			msg: 'Error sending magic link email'
		};
		await camp.fill(INESA);
		await enviar.click();
		await expect(alerta).toHaveText(
			"No s'ha pogut enviar l'enllaç. Revisa el correu i la connexió i torna-ho a provar."
		);
		await expect(camp).toBeFocused();
		await expect(camp).toHaveValue(INESA);
		await expect(camp).toHaveAttribute('aria-invalid', 'true');

		// SMTP per defecte de Supabase amb un correu de fora de l'equip.
		supa.errorOtp = {
			status: 400,
			error_code: 'email_address_not_authorized',
			msg: 'Email address not authorized'
		};
		await enviar.click();
		await expect(alerta).toHaveText(/No s'ha pogut enviar l'enllaç/);

		// Límit de correus.
		supa.errorOtp = {
			status: 429,
			error_code: 'over_email_send_rate_limit',
			msg: 'email rate limit exceeded'
		};
		await enviar.click();
		await expect(alerta).toHaveText(/Has demanat massa enllaços seguits/);

		// Sense connexió: no s'intenta.
		const abans = supa.otps.length;
		await context.setOffline(true);
		await enviar.click();
		await expect(alerta).toHaveText("Necessites connexió a internet per rebre l'enllaç.");
		expect(supa.otps).toHaveLength(abans);
		await context.setOffline(false);

		supa.errorOtp = null;
		await enviar.click();
		await expect(seccio(page).getByText(`T'hem enviat un correu a ${INESA}.`)).toBeVisible();
	});

	test('correu que el servidor considera invàlid → missatge de correu invàlid (no de codi)', async ({
		page,
		supa
	}) => {
		await gotoHydrated(page, COMPTE);
		supa.errorOtp = {
			status: 400,
			error_code: 'email_address_invalid',
			msg: 'Email address "inesa@exemple.con" is invalid'
		};
		await seccio(page).getByLabel('Correu electrònic').fill('inesa@exemple.con');
		await seccio(page).getByRole('button', { name: "Envia'm l'enllaç" }).click();
		await expect(seccio(page).getByRole('alert')).toHaveText(/Escriu una adreça de correu vàlida/, {
			timeout: 3_000
		});
	});

	test('entra amb el codi de 6 xifres i el primer accés puja les ascensions locals', async ({
		page,
		supa
	}) => {
		const rows = await sembrar(page, LLAVOR, COMPTE);
		await demanarEnllac(page);
		const camp = seccio(page).getByLabel('O escriu el codi del correu');
		const entrar = seccio(page).getByRole('button', { name: 'Entra amb el codi' });

		// Format invàlid: error al client, cap petició.
		await camp.fill('12ab');
		await entrar.click();
		await expect(seccio(page).getByRole('alert')).toHaveText(/El codi no és correcte o ha caducat/);
		expect(supa.crides('/auth/v1/verify')).toHaveLength(0);

		// Codi incorrecte o caducat (403 del servidor).
		await camp.fill('000000');
		await entrar.click();
		await expect(seccio(page).getByRole('alert')).toHaveText(/El codi no és correcte o ha caducat/);
		await expect(camp).toHaveAttribute('aria-invalid', 'true');
		expect(supa.crides('/auth/v1/verify')).toHaveLength(1);

		// Codi bo (amb espai enmig, com quan es copia del correu).
		await camp.fill('123 456');
		await entrar.click();
		await expect(seccio(page).getByText('Has entrat amb')).toBeVisible();
		await expect(seccio(page).getByText(INESA, { exact: true })).toBeVisible();
		expect(supa.crides('/auth/v1/verify').at(-1)!.cos).toMatchObject({
			email: INESA,
			token: CODI_BO,
			type: 'email'
		});
		await expect(
			seccio(page)
				.getByRole('status')
				.filter({ hasText: 'Hem desat les teves 2 ascensions al núvol.' })
		).toBeVisible({ timeout: 15_000 });
		await expect(toast(page, 'Hem desat les teves 2 ascensions al núvol.')).toBeVisible();
		await esperarSincronitzat(page);

		// Les files pujades són les locals (ids i contingut), amb el mètode i la nota.
		expect([...idsPujats(supa)].sort()).toEqual(rows.map((r) => r.id).sort());
		const alNuvol = supa.filesDe(INESA);
		expect(alNuvol).toHaveLength(2);
		expect(alNuvol.find((f) => f.id === rows[0].id)).toMatchObject({
			cim_id: CIM.pedraforca.id,
			data: '2024-08-10',
			metode: 'a_peu',
			nota: 'Per la canal',
			deleted_at: null
		});
		expect(alNuvol.find((f) => f.id === rows[1].id)).toMatchObject({ metode: 'btt' });
		expect(await llegirTaula(page, 'outbox')).toEqual([]);
		expect((await meta(page)).propietari).toBe(idUsuari(INESA));
		// L'estat "enllaç enviat" s'oblida en entrar.
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_ENLLAC)).toBeNull();

		// Idempotència: tornar a sincronitzar no duplica res (ni al núvol ni al dispositiu).
		const pushosAbans = supa.pushos.length;
		await seccio(page).getByRole('button', { name: 'Sincronitza ara' }).click();
		await expect(toast(page, 'Sincronització feta.')).toBeVisible();
		await page.reload();
		await esperarSincronitzat(page);
		expect(supa.pushos.slice(pushosAbans).flat()).toEqual([]);
		expect(supa.filesDe(INESA)).toHaveLength(2);
		expect(await vives(page)).toHaveLength(2);
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
	});

	test('torna de l’enllaç del correu (token_hash): sessió, URL neta i primer accés', async ({
		page,
		supa
	}) => {
		const [row] = await sembrar(page, [LLAVOR[0]], COMPTE);
		await page.goto(`${COMPTE}?token_hash=${TOKEN_HASH_BO}&type=email`);
		await expect(seccio(page).getByText('Has entrat amb')).toBeVisible({ timeout: 15_000 });
		await expect(page).toHaveURL(/\/ca\/app\/compte$/);
		expect(supa.crides('/auth/v1/verify')[0].cos).toMatchObject({
			token_hash: TOKEN_HASH_BO,
			type: 'email'
		});
		await expect(seccio(page).getByText('Hem desat la teva ascensió al núvol.')).toBeVisible({
			timeout: 15_000
		});
		expect(supa.filesDe(INESA).map((f) => f.id)).toEqual([row.id]);
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_SESSIO)).toContain(
			idUsuari(INESA)
		);
	});

	test('enllaç caducat o ja fet servir: avís clar, URL neta i continua anònim', async ({
		page,
		supa
	}) => {
		await page.goto(`${COMPTE}?token_hash=caducat&type=email`);
		await expect(seccio(page).getByRole('alert')).toHaveText(
			"L'enllaç no és vàlid, ha caducat o ja s'ha fet servir. Demana'n un de nou."
		);
		await expect(page).toHaveURL(/\/ca\/app\/compte$/);
		await expect(seccio(page).getByLabel('Correu electrònic')).toBeVisible();
		expect(supa.crides('/rest/v1/rpc/sync_push')).toHaveLength(0);
	});

	test('sense dades locals: el primer accés recupera les ascensions del núvol', async ({
		page,
		supa
	}) => {
		const alNuvol = [
			{ cimId: CIM.canigo.id, data: '2023-07-15' },
			{ cimId: CIM.pica.id, data: '2024-08-01', metode: 'esqui' as const },
			{ cimId: CIM.matagalls.id, data: '2025-01-06', nota: 'Amb neu' }
		].map((f, i) => completar(f, i));
		supa.sembrar(INESA, alNuvol);
		await gotoHydrated(page, COMPTE);
		await demanarEnllac(page);
		await seccio(page).getByLabel('O escriu el codi del correu').fill(CODI_BO);
		await seccio(page).getByRole('button', { name: 'Entra amb el codi' }).click();
		await expect(
			seccio(page).getByText('Hem recuperat les teves 3 ascensions del núvol.')
		).toBeVisible({ timeout: 15_000 });
		await expect(comptador(page)).toHaveText('Ascensions desades: 3');
		expect((await vives(page)).map((f) => f.id).sort()).toEqual(alNuvol.map((f) => f.id).sort());
		expect(supa.pushos.flat()).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// Sincronització
// ---------------------------------------------------------------------------

test.describe('Sincronització', () => {
	test('migració Dexie v1 → v2: les dades d’abans de la fase 5 es conserven i es pugen', async ({
		page,
		supa
	}) => {
		const files = LLAVOR.map((f, i) => completar(f, i));
		// BD v1 (Dexie versió 1 = IndexedDB 10) creada des d'una pàgina pública (no obre Dexie).
		await gotoHydrated(page, '/ca/repte-100-cims');
		await page.evaluate(
			({ nom, files }) =>
				new Promise<void>((resolve, reject) => {
					const req = indexedDB.open(nom, 10);
					req.onupgradeneeded = () => {
						const bd = req.result;
						const a = bd.createObjectStore('ascensions', { keyPath: 'id' });
						for (const i of ['cimId', 'data', 'updatedAt', 'deletedAt']) a.createIndex(i, i);
						const o = bd.createObjectStore('outbox', { keyPath: 'ascensioId' });
						o.createIndex('encuaAt', 'encuaAt');
					};
					req.onerror = () => reject(req.error);
					req.onsuccess = () => {
						const bd = req.result;
						const tx = bd.transaction(['ascensions', 'outbox'], 'readwrite');
						for (const f of files) {
							tx.objectStore('ascensions').put(f);
							tx.objectStore('outbox').put({ ascensioId: f.id, encuaAt: f.updatedAt, intents: 0 });
						}
						tx.oncomplete = () => {
							bd.close();
							resolve();
						};
						tx.onerror = () => reject(tx.error);
					};
				}),
			{ nom: NOM_BD, files }
		);
		await gotoHydrated(page, COMPTE);
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
		const versio = await page.evaluate(
			(nom) =>
				new Promise<{ v: number; stores: string[] }>((resolve) => {
					const req = indexedDB.open(nom);
					req.onsuccess = () => {
						const r = { v: req.result.version, stores: [...req.result.objectStoreNames] };
						req.result.close();
						resolve(r);
					};
				}),
			NOM_BD
		);
		expect(versio.v).toBe(20);
		expect(versio.stores.sort()).toEqual(['ascensions', 'meta', 'outbox']);

		await desarSessio(page, INESA);
		await gotoHydrated(page, COMPTE);
		await esperarSincronitzat(page);
		expect([...idsPujats(supa)].sort()).toEqual(files.map((f) => f.id).sort());
		expect(supa.filesDe(INESA)).toHaveLength(2);
	});

	test('resposta del push perduda: es reintenta amb els mateixos ids i no es duplica', async ({
		page,
		supa,
		consoleGuard
	}) => {
		consoleGuard.allow(/\[sync\]|status of 500/);
		supa.perdreRespostesPush = 1;
		const rows = await prepararAutenticat(page, INESA, [
			...LLAVOR,
			{ cimId: CIM.canigo.id, data: '2025-06-20' }
		]);
		await expect(seccio(page).getByText('Error en sincronitzar')).toBeVisible({ timeout: 15_000 });
		await expect(
			seccio(page).getByText(/Les ascensions continuen desades en aquest dispositiu/)
		).toBeVisible();
		// El servidor les ha desat però el client no ho sap: continuen a la cua.
		expect(supa.filesDe(INESA)).toHaveLength(3);
		expect(await llegirTaula(page, 'outbox')).toHaveLength(3);

		await seccio(page).getByRole('button', { name: 'Torna-ho a provar' }).click();
		await esperarSincronitzat(page);
		expect(supa.pushos).toHaveLength(2);
		expect(supa.pushos[1].map((f) => f.id).sort()).toEqual(rows.map((r) => r.id).sort());
		expect(supa.filesDe(INESA)).toHaveLength(3);
		expect(await llegirTaula(page, 'outbox')).toEqual([]);
		expect(await vives(page)).toHaveLength(3);
	});

	test('pull amb LWW: el més nou guanya a cada costat, làpides i files noves del núvol', async ({
		page,
		supa
	}) => {
		const T = (h: number) => new Date(Date.UTC(2025, 5, 1, h)).toISOString();
		const local = {
			guanyaLocal: {
				id: uuidTest(),
				cimId: CIM.pedraforca.id,
				data: '2024-08-10',
				nota: 'local nova',
				createdAt: T(1),
				updatedAt: T(10)
			},
			guanyaNuvol: {
				id: uuidTest(),
				cimId: CIM.montcau.id,
				data: '2025-02-01',
				nota: 'local vella',
				createdAt: T(1),
				updatedAt: T(2)
			},
			nomesLocal: {
				id: uuidTest(),
				cimId: CIM.canigo.id,
				data: '2025-06-20',
				createdAt: T(3),
				updatedAt: T(3)
			},
			esborradaAlNuvol: {
				id: uuidTest(),
				cimId: CIM.pica.id,
				data: '2023-07-01',
				createdAt: T(1),
				updatedAt: T(1)
			}
		};
		const nomesNuvol = completar(
			{ cimId: CIM.matagalls.id, data: '2022-10-12', nota: 'del mòbil vell' },
			5
		);
		supa.sembrar(INESA, [
			{ ...local.guanyaLocal, nota: 'núvol vella', updatedAt: T(5) },
			{ ...local.guanyaNuvol, nota: 'núvol nova', updatedAt: T(8) },
			{ ...local.esborradaAlNuvol, updatedAt: T(9), deletedAt: T(9) },
			nomesNuvol
		]);
		await prepararAutenticat(page, INESA, Object.values(local));
		await esperarSincronitzat(page);

		const files = new Map(
			(
				await llegirTaula<{ id: string; nota: string | null; deletedAt: string | null }>(
					page,
					'ascensions'
				)
			).map((f) => [f.id, f])
		);
		expect(files.get(local.guanyaLocal.id)?.nota).toBe('local nova');
		expect(files.get(local.guanyaNuvol.id)?.nota).toBe('núvol nova');
		expect(files.get(local.nomesLocal.id)?.deletedAt).toBeNull();
		expect(files.get(local.esborradaAlNuvol.id)?.deletedAt).not.toBeNull();
		expect(files.get(nomesNuvol.id)?.nota).toBe('del mòbil vell');
		await expect(comptador(page)).toHaveText('Ascensions desades: 4');

		const nuvol = new Map(supa.filesDe(INESA).map((f) => [f.id, f]));
		expect(nuvol.get(local.guanyaLocal.id)?.nota).toBe('local nova');
		expect(nuvol.get(local.guanyaNuvol.id)?.nota).toBe('núvol nova');
		expect(nuvol.get(local.nomesLocal.id)).toBeDefined();
		expect(nuvol.get(local.esborradaAlNuvol.id)?.deleted_at).not.toBeNull();
		expect(await llegirTaula(page, 'outbox')).toEqual([]);

		// L'historial ja no mostra la làpida i sí la ascensió baixada.
		await gotoHydrated(page, '/ca/app/historial');
		await expect(page.locator('main').getByText('Matagalls').first()).toBeVisible();
		await expect(page.locator('main').getByText("Pica d'Estats")).toHaveCount(0);
	});

	test('ascensió registrada sense connexió: s’encua i es puja en tornar la connexió', async ({
		page,
		context,
		supa,
		consoleGuard
	}) => {
		consoleGuard.allow(
			/Failed to load resource|ERR_INTERNET_DISCONNECTED|network connection|Load failed|Fetch API cannot load|NetworkError/
		);
		await prepararAutenticat(page, INESA, LLAVOR);
		await esperarSincronitzat(page);
		// El formulari es carrega amb import(): s'obre un cop amb connexió.
		let full = await obrirFullNav(page);
		await page.keyboard.press('Escape');
		await expect(full).toBeHidden();

		supa.senseXarxa = true;
		await context.setOffline(true);
		full = await obrirFullNav(page);
		await triarCim(full, 'matagalls', 'Matagalls');
		await botoRegistrar(full).click();
		await expect(toast(page, 'Segellat: Matagalls.')).toBeVisible();
		await expect(seccio(page).getByText('1 canvi pendent de desar al núvol')).toBeVisible({
			timeout: 10_000
		});
		await expect(seccio(page).getByText('Es desaran quan tornis a tenir connexió.')).toBeVisible();
		await expect(
			seccio(page).getByRole('button', { name: /Sincronitza ara|Sincronitzant|Torna-ho a provar/ })
		).toBeDisabled();
		const [nova] = (await vives(page)).filter(
			(f) => !supa.filesDe(INESA).some((n) => n.id === f.id)
		);
		expect(nova).toBeDefined();
		expect(await llegirTaula(page, 'outbox')).toEqual([
			expect.objectContaining({ ascensioId: nova.id })
		]);
		// Sense xarxa no arriba res al servidor.
		await page.waitForTimeout(2_500);
		expect(idsPujats(supa).has(nova.id)).toBe(false);

		supa.senseXarxa = false;
		await context.setOffline(false);
		await esperarSincronitzat(page);
		expect(idsPujats(supa).has(nova.id)).toBe(true);
		expect(supa.filesDe(INESA).find((f) => f.id === nova.id)).toMatchObject({
			cim_id: CIM.matagalls.id
		});
		expect(await llegirTaula(page, 'outbox')).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// Conflicte: dades d'un altre compte al dispositiu
// ---------------------------------------------------------------------------

test.describe('Dades d’un altre compte al dispositiu', () => {
	test('no es fusiona res sense preguntar; "Afegeix-les a aquest compte" les puja', async ({
		page,
		supa
	}) => {
		const rows = await prepararAutenticat(page, INESA, LLAVOR, { propietari: idUsuari(ALTRE) });
		await expect(
			seccio(page).getByText("Aquest dispositiu té ascensions d'un altre compte")
		).toBeVisible({ timeout: 15_000 });
		await expect(seccio(page).getByRole('button', { name: 'Sincronitza ara' })).toBeDisabled();
		// Ni push ni pull mentre no es tria.
		await page.waitForTimeout(1_000);
		expect(supa.crides('/rest/v1/rpc/sync_push')).toHaveLength(0);
		expect(supa.crides('/rest/v1/ascensions')).toHaveLength(0);
		expect(await vives(page)).toHaveLength(2);
		await expect(page.locator('main').getByText('Desat al núvol')).toHaveCount(0);

		await seccio(page).getByRole('button', { name: 'Afegeix-les a aquest compte' }).click();
		await esperarSincronitzat(page);
		expect([...idsPujats(supa)].sort()).toEqual(rows.map((r) => r.id).sort());
		expect(supa.filesDe(INESA)).toHaveLength(2);
		expect((await meta(page)).propietari).toBe(idUsuari(INESA));
	});

	test('"Esborra-les d’aquest dispositiu" no puja res i baixa les del compte actual', async ({
		page,
		supa
	}) => {
		const propia = completar({ cimId: CIM.canigo.id, data: '2023-07-15' }, 1);
		supa.sembrar(INESA, [propia]);
		await prepararAutenticat(page, INESA, LLAVOR, { propietari: idUsuari(ALTRE) });
		await seccio(page).getByRole('button', { name: "Esborra-les d'aquest dispositiu" }).click();
		await esperarSincronitzat(page);
		expect(supa.pushos.flat()).toEqual([]);
		expect((await vives(page)).map((f) => f.id)).toEqual([propia.id]);
		await expect(comptador(page)).toHaveText('Ascensions desades: 1');
	});

	test('"Afegeix-les" quan aquelles ascensions ja són al núvol de l’altre compte', async ({
		page,
		supa
	}) => {
		const rows = LLAVOR.map((f, i) => completar(f, i));
		supa.sembrar(ALTRE, rows); // l'altre compte ja les havia sincronitzat
		await prepararAutenticat(
			page,
			INESA,
			LLAVOR.map((f, i) => ({ ...f, id: rows[i].id })),
			{
				propietari: idUsuari(ALTRE)
			}
		);
		await seccio(page).getByRole('button', { name: 'Afegeix-les a aquest compte' }).click();
		await expect(seccio(page).getByText(/Tot desat al núvol/)).toBeVisible({ timeout: 8_000 });
		expect(supa.filesDe(INESA)).toHaveLength(2);
		// Entren amb ids nous; les de l'altre compte no es toquen (ni làpides).
		const idsAltre = rows.map((r) => r.id);
		expect(supa.filesDe(INESA).filter((f) => idsAltre.includes(f.id))).toEqual([]);
		expect(supa.filesDe(ALTRE).filter((f) => !f.deleted_at)).toHaveLength(2);
		expect((await vives(page)).map((f) => f.id).filter((id) => idsAltre.includes(id))).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// Tancar la sessió i esborrar
// ---------------------------------------------------------------------------

test.describe('Tancar la sessió i esborrar', () => {
	test('tancar la sessió: les dades es queden al dispositiu i la sessió s’oblida', async ({
		page,
		supa
	}) => {
		await prepararAutenticat(page, INESA, LLAVOR);
		await esperarSincronitzat(page);
		await seccio(page).getByRole('button', { name: 'Tanca la sessió' }).click();
		await expect(
			toast(page, 'Has tancat la sessió. Les ascensions continuen en aquest dispositiu.')
		).toBeVisible();
		await expect(seccio(page).getByLabel('Correu electrònic')).toBeVisible();
		await expect(seccio(page).getByRole('heading', { name: 'El teu compte' })).toBeFocused();
		expect(supa.crides('/auth/v1/logout')[0].query).toContain('scope=local');
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_SESSIO)).toBeNull();
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
		await page.reload();
		await expect(seccio(page).getByLabel('Correu electrònic')).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
		// Les dades queden marcades del compte que surt (si n'entra un altre, se li preguntarà).
		expect((await meta(page)).propietari).toBe(idUsuari(INESA));
	});

	test('esborrar el compte: confirmació forta, RPC i conservar al dispositiu (per defecte)', async ({
		page,
		supa
	}) => {
		await prepararAutenticat(page, INESA, LLAVOR);
		await esperarSincronitzat(page);
		await seccio(page).getByRole('button', { name: 'Esborra el compte' }).click();
		const full = page.getByRole('dialog', { name: 'Esborrar el compte' });
		await expect(full).toBeVisible();
		await expect(
			full.getByText(/S'esborraran el teu compte i totes les ascensions desades al núvol/)
		).toBeVisible();
		const conservar = full.getByLabel('Conserva les ascensions en aquest dispositiu, sense compte');
		await expect(conservar).toBeChecked();
		const confirmar = full.getByRole('button', { name: 'Esborra el compte definitivament' });
		await expect(confirmar).toBeDisabled();
		const camp = full.getByLabel(/Per confirmar-ho, escriu el teu correu o la paraula ESBORRAR/);
		await camp.fill('esborra');
		await expect(confirmar).toBeDisabled();

		// Abans d'esborrar, es pot descarregar la còpia del compte.
		const [download] = await Promise.all([
			page.waitForEvent('download'),
			full.getByRole('button', { name: 'Descarrega les meves dades' }).click()
		]);
		const json = JSON.parse(await readFile((await download.path())!, 'utf8'));
		expect(json).toMatchObject({
			format: 'carnetdecims.ascensions',
			total: 2,
			compte: { email: INESA }
		});

		await camp.fill('esborrar');
		await expect(confirmar).toBeEnabled();
		await confirmar.click();
		await expect(toast(page, 'Hem esborrat el teu compte i les dades del núvol.')).toBeVisible();
		expect(supa.crides('/rest/v1/rpc/esborrar_compte')).toHaveLength(1);
		expect(supa.filesDe(INESA)).toEqual([]);
		await expect(seccio(page).getByLabel('Correu electrònic')).toBeVisible();
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_SESSIO)).toBeNull();
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
		const m = await meta(page);
		expect(m.propietari ?? null).toBeNull();
	});

	test('esborrar el compte sense conservar: també s’esborra el dispositiu; error del servidor no tanca res', async ({
		page,
		supa,
		consoleGuard
	}) => {
		consoleGuard.allow(/status of 500/);
		await prepararAutenticat(page, ALTRE, LLAVOR);
		await esperarSincronitzat(page);
		await seccio(page).getByRole('button', { name: 'Esborra el compte' }).click();
		const full = page.getByRole('dialog', { name: 'Esborrar el compte' });
		await full.getByLabel('Conserva les ascensions en aquest dispositiu, sense compte').uncheck();
		await expect(
			full.getByText("Si ho desmarques, també s'esborraran d'aquest dispositiu.")
		).toBeVisible();
		// Confirmació amb el correu (sense majúscules).
		await full.getByLabel(/Per confirmar-ho/).fill('ALTRE@exemple.cat');

		// Primer, error del servidor: es manté la sessió i les dades.
		supa.errorEsborrar = 500;
		await full.getByRole('button', { name: 'Esborra el compte definitivament' }).click();
		await expect(
			toast(page, "No s'ha pogut esborrar el compte. Revisa la connexió i torna-ho a provar.")
		).toBeVisible();
		await expect(full).toBeVisible();
		expect(supa.filesDe(ALTRE)).toHaveLength(2);
		supa.errorEsborrar = null;

		await full.getByRole('button', { name: 'Esborra el compte definitivament' }).click();
		await expect(toast(page, 'Hem esborrat el teu compte i les dades del núvol.')).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		expect(supa.filesDe(ALTRE)).toEqual([]);
	});

	test('"Esborra totes les dades" (local) amb compte no toca el núvol', async ({ page, supa }) => {
		await prepararAutenticat(page, INESA, LLAVOR);
		await esperarSincronitzat(page);
		const peticionsAbans = supa.peticions.length;
		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		const full = page.getByRole('dialog', { name: 'Esborrar totes les dades' });
		await expect(full.getByText(/d'aquest dispositiu \(2\)/)).toBeVisible();
		await full.getByRole('button', { name: 'Sí, esborra-ho tot' }).click();
		await expect(toast(page, "S'han esborrat totes les dades d'aquest dispositiu.")).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		// Cap làpida pujada ni supressió al núvol.
		const noves = supa.peticions.slice(peticionsAbans);
		expect(noves.filter((p) => p.cami === '/rest/v1/rpc/esborrar_compte')).toEqual([]);
		expect(
			noves
				.filter((p) => p.cami === '/rest/v1/rpc/sync_push')
				.flatMap((p) => (p.cos as { files: { deletedAt: string | null }[] }).files)
				.filter((f) => f.deletedAt)
		).toEqual([]);
		expect(supa.filesDe(INESA).filter((f) => !f.deleted_at)).toHaveLength(2);
		// La sessió continua: en sincronitzar, les ascensions tornen del núvol.
		await seccio(page).getByRole('button', { name: 'Sincronitza ara' }).click();
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
	});

	test('"Esborra totes les dades" amb compte: el text explica que el núvol no s’esborra', async ({
		page
	}) => {
		await prepararAutenticat(page, INESA, LLAVOR);
		await esperarSincronitzat(page);
		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		const full = page.getByRole('dialog', { name: 'Esborrar totes les dades' });
		await expect(full).toBeVisible();
		await expect(full.getByText(/només les ascensions d'aquest dispositiu \(2\)/)).toBeVisible();
		await expect(full.getByText(/El teu compte les conserva al núvol/)).toBeVisible();
		await expect(full.getByText(/«Esborra el compte»/)).toBeVisible();
		await expect(full.getByText(/No es pot desfer/)).toHaveCount(0);
	});

	test('"Esborra totes les dades" sense compte: el text avisa que no es pot desfer', async ({
		page
	}) => {
		await sembrar(page, LLAVOR, COMPTE);
		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		const full = page.getByRole('dialog', { name: 'Esborrar totes les dades' });
		await expect(full).toBeVisible();
		await expect(full.getByText(/No es pot desfer/)).toBeVisible();
		await expect(full.getByText(/núvol/)).toHaveCount(0);
	});
});

// ---------------------------------------------------------------------------
// Indicadors i avisos
// ---------------------------------------------------------------------------

test.describe('Indicadors i avisos', () => {
	test('indicador del núvol a /app: anònim, desat i error', async ({
		page,
		supa,
		consoleGuard
	}) => {
		consoleGuard.allow(/\[sync\]|status of 500/);
		await gotoHydrated(page, '/ca/app');
		const ind = page.getByRole('link', { name: /Estat del núvol/ });
		await expect(ind).toContainText('Desat només en aquest dispositiu');
		await expect(ind).toContainText('Crea un compte');
		await expect(ind).toHaveAttribute('href', COMPTE);

		await prepararAutenticat(page, INESA, LLAVOR, { url: '/ca/app' });
		await expect(ind).toContainText('Desat al núvol', { timeout: 15_000 });
		await expect(ind).toContainText('Veure el compte');

		supa.errorPush = 500;
		await obrirFullNav(page).then(async (full) => {
			await triarCim(full, 'matagalls', 'Matagalls');
			await botoRegistrar(full).click();
		});
		await expect(ind).toContainText('Error en sincronitzar', { timeout: 10_000 });
	});

	test('franja "Crea un compte": només anònims, descartable i recordada', async ({ page }) => {
		await gotoHydrated(page, '/ca/app');
		const franja = page.getByRole('link', { name: /Crea un compte · desa el teu carnet al núvol/ });
		await expect(franja).toBeVisible();
		await expect(franja).toHaveAttribute('href', `${COMPTE}#compte`);
		await page.getByRole('button', { name: 'Amaga el suggeriment de crear un compte' }).click();
		await expect(franja).toHaveCount(0);
		await expect(page.locator('#contingut')).toBeFocused();
		await page.reload();
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(franja).toHaveCount(0);

		// Amb sessió no surt mai (encara que no s'hagi amagat).
		await page.evaluate(() => localStorage.removeItem('carnetdecims:cta-compte-amagat'));
		await desarSessio(page, INESA);
		await gotoHydrated(page, '/ca/app');
		await expect(page.getByRole('link', { name: /Estat del núvol/ })).toContainText(
			/Desat al núvol|pendent/,
			{ timeout: 15_000 }
		);
		await expect(franja).toHaveCount(0);
	});

	test('avís de beta: fora del mode beta no surt enlloc (ni a l’HTML prerenderitzat)', async ({
		page,
		request
	}) => {
		// Els E2E es construeixen amb PUBLIC_MODE_BETA=false (playwright.config.ts). L'avís en
		// mode beta (visible, correu, amagar-lo per a la sessió) el proven BannerBeta.svelte.spec.ts.
		const html = await (await request.get('/ca/cims')).text();
		expect(html).not.toContain('Avís de versió beta');
		await gotoHydrated(page, '/ca/app');
		await expect(page.getByRole('link', { name: /Estat del núvol/ })).toBeVisible();
		await expect(page.getByRole('complementary', { name: 'Avís de versió beta' })).toHaveCount(0);
		await gotoHydrated(page, '/ca/cims');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.getByRole('complementary', { name: 'Avís de versió beta' })).toHaveCount(0);
	});
});

// ---------------------------------------------------------------------------
// Accessibilitat i reflow
// ---------------------------------------------------------------------------

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page, que: string) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const summary = violations.map((v) => ({
		id: v.id,
		nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	expect(summary, `violacions axe (${que})`).toEqual([]);
}

/** Recorre els estats de /app/compte i hi aplica `comprovar`. */
async function recorrerEstats(
	page: Page,
	supa: SupabaseFals,
	comprovar: (que: string) => Promise<void>,
	email = INESA
) {
	await gotoHydrated(page, COMPTE);
	await comprovar('anònim');
	await seccio(page).getByLabel('Correu electrònic').fill('no-valid');
	await seccio(page).getByRole('button', { name: "Envia'm l'enllaç" }).click();
	await expect(seccio(page).getByRole('alert')).toBeVisible();
	await comprovar('error de correu');
	await demanarEnllac(page, email);
	await seccio(page).getByLabel('O escriu el codi del correu').fill('000000');
	await seccio(page).getByRole('button', { name: 'Entra amb el codi' }).click();
	await expect(seccio(page).getByRole('alert')).toBeVisible();
	await comprovar('enllaç enviat + codi incorrecte');
	await seccio(page).getByLabel('O escriu el codi del correu').fill(CODI_BO);
	await seccio(page).getByRole('button', { name: 'Entra amb el codi' }).click();
	await expect(seccio(page).getByText(/El teu compte està llest|Hem desat/)).toBeVisible({
		timeout: 15_000
	});
	await esperarSincronitzat(page);
	await comprovar('autenticat (primer accés)');
	await seccio(page).getByRole('button', { name: 'Esborra el compte' }).click();
	await expect(page.getByRole('dialog', { name: 'Esborrar el compte' })).toBeVisible();
	await page
		.getByRole('dialog')
		.getByLabel('Conserva les ascensions en aquest dispositiu, sense compte')
		.uncheck();
	await comprovar('full d’esborrar el compte');
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).toBeHidden();
	// Error de sync.
	supa.errorPush = 500;
	await sembrar(page, [LLAVOR[0]], COMPTE);
	await expect(seccio(page).getByText('Error en sincronitzar')).toBeVisible({ timeout: 15_000 });
	await comprovar('error de sincronització');
	// Conflicte.
	supa.errorPush = null;
	await escriureMeta(page, { propietari: idUsuari(ALTRE) });
	await gotoHydrated(page, COMPTE);
	await expect(
		seccio(page).getByText("Aquest dispositiu té ascensions d'un altre compte")
	).toBeVisible({ timeout: 15_000 });
	await comprovar('conflicte');
}

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe /app/compte · ${colorScheme}`, () => {
		test.use({ colorScheme });
		test('tots els estats del compte sense violacions WCAG 2.2 AA', async ({
			page,
			supa,
			consoleGuard
		}) => {
			test.slow();
			consoleGuard.allow(/\[sync\]|status of 500/);
			await recorrerEstats(page, supa, (que) => expectNoAxeViolations(page, que));
		});
	});
}

test.describe('Reflow a 320 px', () => {
	test.use({ viewport: { width: 320, height: 640 } });
	test('/app/compte sense scroll horitzontal en cap estat (correu llarg)', async ({
		page,
		supa,
		consoleGuard
	}) => {
		test.slow();
		consoleGuard.allow(/\[sync\]|status of 500/);
		const llarg = 'una.adreca.de.correu.molt.llarga.per.provar@subdomini.exemple.cat';
		supa.correus.add(llarg);
		await recorrerEstats(
			page,
			supa,
			async (que) => {
				await settleAnimations(page);
				const { sw, cw } = await page.evaluate(() => ({
					sw: document.documentElement.scrollWidth,
					cw: document.documentElement.clientWidth
				}));
				expect(sw, `scroll horitzontal (${que})`).toBeLessThanOrEqual(cw);
			},
			llarg
		);
	});
});
