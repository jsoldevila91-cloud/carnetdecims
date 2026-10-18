/**
 * Fase 5 · Deduplicació d'ascensions, entrada amb Google (desactivada) i sync bloquejada.
 *
 * - Importar un JSON (UI només ofereix el mode "fusionar"; "substituir" és a les proves unitàries):
 *   ids "d'un altre compte", duplicats per (cim, data, mètode) dins del fitxer i contra una fila
 *   local viva; idempotència.
 * - Sessió simulada (`supabase-fals.ts`): dues ascensions amb la mateixa clau i distint id pel pull
 *   → una sola viva; el servidor rep la làpida de la perdedora. "id en ús" amb el full d'edició
 *   obert.
 * - Google: amb la build per defecte (`PUBLIC_GOOGLE_AUTH=false`) no hi ha ni botó ni separador.
 * - Sync bloquejada: el servidor rebutja una fila `MAX_INTENTS` (5) vegades → "1 canvi no s'ha
 *   pogut desar al núvol" i "Descarrega una còpia".
 */
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { test as base, expect, gotoHydrated, settleAnimations } from './fixtures';
import {
	CIM,
	SHEET_EDICIO,
	completar,
	filesBd,
	fitxerExportacio,
	sembrar,
	toast,
	uuidTest,
	type FilaSembra
} from './ascensions';
import {
	desarSessio,
	escriureMeta,
	idUsuari,
	llegirTaula,
	supabaseFals,
	type SupabaseFals
} from './supabase-fals';

const INESA = 'inesa@exemple.cat';
const ALTRE = 'altre@exemple.cat';
const COMPTE = '/ca/app/compte';
const HISTORIAL = '/ca/app/historial';

const test = base.extend<{ supa: SupabaseFals }>({
	supa: [
		async ({ context, consoleGuard }, use) => {
			consoleGuard.allow(
				/Failed to load resource: the server responded with a status of (400|401|403|429|500|503)|\[sync\]|due to access control checks/
			);
			const s = await supabaseFals(context, [INESA, ALTRE]);
			await use(s);
			expect(s.noGestionades, 'peticions a Supabase sense resposta al servidor fals').toEqual([]);
		},
		{ auto: true }
	]
});

async function importar(page: Page, contingut: string | object, nom = 'copia.json') {
	await page.locator('input[type=file]').setInputFiles({
		name: nom,
		mimeType: 'application/json',
		buffer: Buffer.from(typeof contingut === 'string' ? contingut : JSON.stringify(contingut))
	});
}

const vives = async (page: Page) =>
	(
		await llegirTaula<{
			id: string;
			cimId: number;
			data: string;
			metode: string;
			nota: string | null;
			createdAt: string;
			deletedAt: string | null;
		}>(page, 'ascensions')
	).filter((f) => !f.deletedAt);

const seccioCompte = (page: Page) => page.locator('section#compte');
const filesHistorial = (page: Page) => page.locator('main section.any li');

async function prepararAutenticat(
	page: Page,
	email: string,
	files: FilaSembra[] = [],
	opcions: { url?: string; propietari?: string } = {}
) {
	const rows = await sembrar(page, files, '/ca/app');
	await escriureMeta(page, { propietari: opcions.propietari ?? idUsuari(email) });
	await desarSessio(page, email);
	await gotoHydrated(page, opcions.url ?? COMPTE);
	return rows;
}

// ---------------------------------------------------------------------------
// Importar sense duplicar
// ---------------------------------------------------------------------------

test.describe('Importar · deduplicació', () => {
	test('dos cops el mateix JSON amb ids d’un altre compte i duplicats al fitxer: una sola ascensió, notes fusionades', async ({
		page
	}) => {
		await gotoHydrated(page, COMPTE);
		const fitxer = fitxerExportacio([
			{
				id: uuidTest(),
				cimId: CIM.matagalls.id,
				data: '2023-05-01',
				nota: 'Boira a dalt',
				createdAt: '2023-05-01T18:00:00.000Z'
			},
			{
				id: uuidTest(),
				cimId: CIM.matagalls.id,
				data: '2023-05-01',
				nota: 'Vent fort',
				createdAt: '2023-05-02T09:00:00.000Z'
			}
		]);
		await importar(page, fitxer);
		await expect(toast(page, /Importació feta/)).toBeVisible();
		let v = await vives(page);
		expect(v).toHaveLength(1);
		expect(v[0].nota).toContain('Boira a dalt');
		expect(v[0].nota).toContain('Vent fort');
		await expect(page.locator('main').getByText(/^Ascensions desades: \d+$/)).toHaveText(
			'Ascensions desades: 1'
		);

		// Idempotent: tornar-lo a importar no crea res ni canvia la fila.
		const abans = await filesBd(page);
		await importar(page, fitxer);
		await expect(toast(page, /Importació feta/).nth(1)).toBeVisible();
		v = await vives(page);
		expect(v).toHaveLength(1);
		expect(await filesBd(page)).toEqual(abans);

		await gotoHydrated(page, HISTORIAL);
		await expect(filesHistorial(page)).toHaveCount(1);
		await expect(page.locator('main')).toContainText('Boira a dalt');
		await expect(page.locator('main')).toContainText('Vent fort');
	});

	test('un duplicat d’una ascensió local viva (altre id) no crea fila: conserva id i createdAt locals', async ({
		page
	}) => {
		const [local] = await sembrar(
			page,
			[
				{
					cimId: CIM.montcau.id,
					data: '2024-03-10',
					nota: 'Nota local',
					createdAt: '2024-03-10T10:00:00.000Z'
				}
			],
			COMPTE
		);
		await importar(
			page,
			fitxerExportacio([
				{
					id: uuidTest(), // id d'un altre compte
					cimId: CIM.montcau.id,
					data: '2024-03-10',
					nota: 'Nota del fitxer',
					createdAt: '2024-03-11T10:00:00.000Z'
				},
				{ cimId: CIM.canigo.id, data: '2022-07-01' }
			])
		);
		await expect(toast(page, /Importació feta/)).toBeVisible();
		const v = await vives(page);
		expect(v).toHaveLength(2);
		const montcau = v.filter((f) => f.cimId === CIM.montcau.id);
		expect(montcau).toHaveLength(1);
		expect(montcau[0].id).toBe(local.id);
		expect(montcau[0].createdAt).toBe(local.createdAt);
		expect(montcau[0].nota).toContain('Nota local');
		expect(montcau[0].nota).toContain('Nota del fitxer');
	});

	test('mètodes diferents el mateix dia i cim NO es fusionen', async ({ page }) => {
		await gotoHydrated(page, COMPTE);
		await importar(
			page,
			fitxerExportacio([
				{ id: uuidTest(), cimId: CIM.matagalls.id, data: '2023-05-01', metode: 'a-peu' },
				{ id: uuidTest(), cimId: CIM.matagalls.id, data: '2023-05-01', metode: 'esqui' }
			])
		);
		await expect(toast(page, /Importació feta/)).toBeVisible();
		expect(await vives(page)).toHaveLength(2);
	});

	test('una ascensió local esborrada (làpida) no absorbeix la importada', async ({ page }) => {
		const [local] = await sembrar(page, [{ cimId: CIM.montcau.id, data: '2024-03-10' }], HISTORIAL);
		await page.getByRole('button', { name: /^Esborra l'ascensió a Montcau/ }).click();
		await expect(toast(page, 'Ascensió esborrada: Montcau.')).toBeVisible();
		await gotoHydrated(page, COMPTE);
		await importar(
			page,
			fitxerExportacio([{ id: uuidTest(), cimId: CIM.montcau.id, data: '2024-03-10' }])
		);
		await expect(toast(page, /Importació feta/)).toBeVisible();
		const v = await vives(page);
		expect(v).toHaveLength(1);
		expect(v[0].id).not.toBe(local.id);
	});
});

// ---------------------------------------------------------------------------
// Sync: deduplicació
// ---------------------------------------------------------------------------

test.describe('Sync · deduplicació', () => {
	test('dues ascensions amb la mateixa clau i distint id pel pull: una sola viva i làpida al servidor', async ({
		page,
		supa
	}) => {
		const guanyadora = completar(
			{
				cimId: CIM.pedraforca.id,
				data: '2024-08-10',
				nota: 'Des del mòbil',
				createdAt: '2024-08-10T09:00:00.000Z'
			},
			0
		);
		const perdedora = completar(
			{
				cimId: CIM.pedraforca.id,
				data: '2024-08-10',
				nota: 'Des de l’ordinador',
				createdAt: '2024-08-10T20:00:00.000Z'
			},
			1
		);
		supa.sembrar(INESA, [guanyadora, perdedora]);
		await prepararAutenticat(page, INESA, [], { url: COMPTE });
		await expect(seccioCompte(page).getByText(/Tot desat al núvol/)).toBeVisible({
			timeout: 15_000
		});

		const v = await vives(page);
		expect(v).toHaveLength(1);
		expect(v[0].id).toBe(guanyadora.id);
		expect(v[0].nota).toContain('Des del mòbil');
		expect(v[0].nota).toContain('Des de l’ordinador');
		await expect(page.locator('main').getByText(/^Ascensions desades: \d+$/)).toHaveText(
			'Ascensions desades: 1'
		);

		// El servidor rep la làpida de la perdedora i la guanyadora fusionada.
		const srv = supa.filesDe(INESA);
		expect(srv.find((f) => f.id === perdedora.id)?.deleted_at).toBeTruthy();
		const g = srv.find((f) => f.id === guanyadora.id)!;
		expect(g.deleted_at).toBeNull();
		expect(g.nota).toContain('Des de l’ordinador');
		expect(supa.pushos.flat().some((f) => f.id === perdedora.id && f.deletedAt)).toBe(true);

		// Historial i carnet: una sola.
		await gotoHydrated(page, HISTORIAL);
		await expect(filesHistorial(page)).toHaveCount(1);
		await gotoHydrated(page, '/ca/app');
		await expect(page.getByRole('region', { name: 'Progrés del repte' })).toContainText('1');

		// Sense bucles: una sync més no canvia res al servidor.
		const abans = JSON.stringify(supa.filesDe(INESA));
		await gotoHydrated(page, COMPTE);
		await seccioCompte(page).getByRole('button', { name: 'Sincronitza ara' }).click();
		await expect(toast(page, /Sincronització feta/).first()).toBeVisible();
		expect(JSON.stringify(supa.filesDe(INESA))).toBe(abans);
	});

	test('duplicat entre una local viva i una que arriba pel pull: se’n queda una', async ({
		page,
		supa
	}) => {
		const remota = completar(
			{ cimId: CIM.canigo.id, data: '2023-07-15', createdAt: '2023-07-15T08:00:00.000Z' },
			0
		);
		supa.sembrar(INESA, [remota]);
		await prepararAutenticat(page, INESA, [
			{ cimId: CIM.canigo.id, data: '2023-07-15', createdAt: '2023-07-15T12:00:00.000Z' }
		]);
		await expect(seccioCompte(page).getByText(/Tot desat al núvol/)).toBeVisible({
			timeout: 15_000
		});
		const v = await vives(page);
		expect(v).toHaveLength(1);
		expect(v[0].id).toBe(remota.id);
		expect(supa.filesDe(INESA).filter((f) => !f.deleted_at)).toHaveLength(1);
	});

	test('"id en ús" amb el full d’edició obert: desar després de la reassignació no falla', async ({
		page,
		supa
	}) => {
		const fila = completar({ cimId: CIM.matagalls.id, data: '2024-05-01', nota: 'vella' }, 0);
		// L'id ja és d'un altre compte al servidor.
		supa.sembrar(ALTRE, [fila]);
		// Retén la sync fins que el full d'edició sigui obert.
		supa.errorPush = 503;
		await prepararAutenticat(page, INESA, [{ ...fila }], { url: HISTORIAL });
		await page.getByRole('button', { name: /^Edita l'ascensió a Matagalls/ }).click();
		const full = page.getByRole('dialog', { name: SHEET_EDICIO });
		await expect(full).toBeVisible();
		await full.getByLabel('Nota (opcional)').fill('editada amb el full obert');
		await full.getByLabel('Data').fill('2024-05-02');

		// Deixa que la sync (reintent automàtic) reassigni l'id mentre el full és obert.
		supa.errorPush = null;
		// No hi ha reintent automàtic després d'un error: l'esdeveniment `online` en força un.
		await page.evaluate(() => window.dispatchEvent(new Event('online')));
		await expect
			.poll(async () => (await filesBd(page)).filter((f) => !f.deletedAt).map((f) => f.id), {
				timeout: 20_000
			})
			.not.toContain(fila.id);
		await expect(full).toBeVisible();

		await full.getByRole('button', { name: 'Desa els canvis' }).click();
		await expect(full).toBeHidden();
		await expect(toast(page, 'Ascensió actualitzada.')).toBeVisible();
		const v = await vives(page);
		expect(v).toHaveLength(1);
		expect(v[0]).toMatchObject({ data: '2024-05-02', nota: 'editada amb el full obert' });
		expect(v[0].id).not.toBe(fila.id);

		// Arriba al servidor del compte actual amb l'id nou; el de l'altre compte no es toca.
		await expect
			.poll(() => supa.filesDe(INESA).filter((f) => f.data === '2024-05-02').length, {
				timeout: 15_000
			})
			.toBe(1);
		expect(supa.filesDe(ALTRE).find((f) => f.id === fila.id)?.data).toBe('2024-05-01');
	});
});

// ---------------------------------------------------------------------------
// Google (desactivat a la build per defecte)
// ---------------------------------------------------------------------------

test.describe('Entrada amb Google desactivada', () => {
	const casos = [
		{ url: '/ca/app/compte', boto: 'Continua amb Google', correu: "Envia'm l'enllaç" },
		{ url: '/es/app/cuenta', boto: 'Continuar con Google', correu: /Envíame el enlace/ }
	] as const;
	for (const c of casos) {
		test(`${c.url}: ni botó ni separador "o"`, async ({ page }) => {
			await gotoHydrated(page, c.url);
			const s = page.locator('section#compte');
			// El formulari de correu sí hi és (el compte està disponible).
			await expect(s.getByRole('button', { name: c.correu })).toBeVisible();
			await expect(page.getByRole('button', { name: c.boto })).toHaveCount(0);
			await expect(page.getByText(/Google/)).toHaveCount(0);
			await expect(s.locator('.alternativa, .separador, .google')).toHaveCount(0);
		});
	}
});

// ---------------------------------------------------------------------------
// Sync bloquejada
// ---------------------------------------------------------------------------

test.describe('Sync bloquejada', () => {
	test('el servidor rebutja una fila 5 vegades: "1 canvi no s’ha pogut desar" i còpia descarregable', async ({
		page,
		supa,
		consoleGuard
	}) => {
		consoleGuard.allow(/\[sync\]/);
		const [bona, dolenta] = [
			completar({ cimId: CIM.canigo.id, data: '2023-07-15' }, 0),
			completar({ cimId: CIM.matagalls.id, data: '2024-05-01', nota: 'no entra' }, 1)
		];
		supa.rebutjarIds.set(dolenta.id, 'motiu de prova');
		await prepararAutenticat(page, INESA, [
			{ ...bona, metode: 'a-peu' },
			{ ...dolenta, metode: 'a-peu' }
		]);
		const s = seccioCompte(page);
		const bloquejat = s.getByText("1 canvi no s'ha pogut desar al núvol");

		// Cada sync rebutjada suma un intent; a partir del 5è la fila queda bloquejada.
		await expect
			.poll(
				async () => {
					if (await bloquejat.isVisible()) return 'bloquejat';
					const b = s.getByRole('button', { name: /^(Sincronitza ara|Torna-ho a provar)$/ });
					if (await b.isEnabled().catch(() => false))
						await b.click({ timeout: 1_000 }).catch(() => {});
					return 'no';
				},
				{ timeout: 25_000, intervals: [400] }
			)
			.toBe('bloquejat');

		const intents = (await llegirTaula<{ intents: number }>(page, 'outbox')).map((e) => e.intents);
		expect(Math.max(...intents)).toBeGreaterThanOrEqual(5);
		// La bona s'ha desat; la dolenta continua només al dispositiu.
		expect(supa.filesDe(INESA).map((f) => f.id)).toEqual([bona.id]);
		await expect(s.getByText(/desats en aquest dispositiu/)).toBeVisible();

		const [download] = await Promise.all([
			page.waitForEvent('download'),
			s.getByRole('button', { name: 'Descarrega una còpia' }).click()
		]);
		expect(download.suggestedFilename()).toMatch(/^carnetdecims-\d{4}-\d{2}-\d{2}\.json$/);
		const json = JSON.parse(await readFile((await download.path())!, 'utf8'));
		expect(json.format).toBe('carnetdecims.ascensions');
		const ids = json.ascensions.map((a: { id: string }) => a.id);
		expect(ids).toContain(dolenta.id);
		expect(ids).toContain(bona.id);
		await expect(toast(page, 'Còpia descarregada.')).toBeVisible();
	});

	test('el missatge bloquejat també surt com a avís en sincronitzar a mà', async ({
		page,
		supa,
		consoleGuard
	}) => {
		consoleGuard.allow(/\[sync\]/);
		const dolenta = completar({ cimId: CIM.matagalls.id, data: '2024-05-01' }, 0);
		supa.rebutjarIds.set(dolenta.id, 'motiu de prova');
		await prepararAutenticat(page, INESA, [{ ...dolenta, metode: 'a-peu' }]);
		// Deixa'l a 4 intents i que la sync manual faci el cinquè.
		const s = seccioCompte(page);
		const avis = toast(page, /1 canvi no s'ha pogut desar al núvol\./).first();
		await expect
			.poll(
				async () => {
					if (await avis.isVisible()) return 'avis';
					const b = s.getByRole('button', { name: /^(Sincronitza ara|Torna-ho a provar)$/ });
					if (await b.isEnabled().catch(() => false))
						await b.click({ timeout: 1_000 }).catch(() => {});
					return 'no';
				},
				{ timeout: 25_000, intervals: [400] }
			)
			.toBe('avis');
	});

	test('axe de /ca/app/compte amb sync bloquejada', async ({ page, supa, consoleGuard }) => {
		consoleGuard.allow(/\[sync\]/);
		const dolenta = completar({ cimId: CIM.matagalls.id, data: '2024-05-01' }, 0);
		supa.rebutjarIds.set(dolenta.id, 'motiu de prova');
		await prepararAutenticat(page, INESA, [{ ...dolenta, metode: 'a-peu' }]);
		const s = seccioCompte(page);
		await expect
			.poll(
				async () => {
					if (await s.getByText("1 canvi no s'ha pogut desar al núvol").isVisible()) return 1;
					const b = s.getByRole('button', { name: /^(Sincronitza ara|Torna-ho a provar)$/ });
					if (await b.isEnabled().catch(() => false))
						await b.click({ timeout: 1_000 }).catch(() => {});
					return 0;
				},
				{ timeout: 25_000, intervals: [400] }
			)
			.toBe(1);
		await page.evaluate(() => document.fonts.ready);
		await settleAnimations(page);
		const { violations } = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(violations.map((v) => v.id)).toEqual([]);
	});
});
