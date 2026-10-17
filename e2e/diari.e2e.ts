/**
 * Bloc R1 · Diari de muntanya: companys al formulari de registre i d'edició (`CampCompanys`),
 * historial (fila, filtre "Només el diari"), detall del segell, Desfés, persistència,
 * exportació v2 i importació v1/v2, axe i reflow.
 */
import { readFile } from 'node:fs/promises';
import type { Locator, Page } from '@playwright/test';
import { test, expect, gotoHydrated, ROUTES } from './fixtures';
import {
	CIM,
	SHEET_EDICIO,
	botoRegistrar,
	fitxerExportacio,
	obrirFullNav,
	sembrar,
	toast,
	triarCim
} from './ascensions';
import {
	conte,
	escriureOrigen,
	exacte,
	expectAxeNet,
	expectSenseDesbord,
	filesAmbCompanys,
	llegirOrigen,
	municipi,
	t,
	type Locale
} from './r1';

const HISTORIAL = '/ca/app/historial';

const commuta = (scope: Page | Locator, locale: Locale = 'ca') =>
	scope.getByRole('button', {
		name: new RegExp(
			`^[+−]?\\s*(${t(locale, 'partners_toggle').replace(/[()]/g, '\\$&')}|${t(locale, 'partners_toggle_count', { count: '\\d+' }).replace(/[()]/g, '\\$&')})$`
		)
	});
const campCompanys = (scope: Page | Locator, locale: Locale = 'ca') =>
	scope.getByRole('combobox', { name: t(locale, 'partners_label') });
const xips = (scope: Page | Locator, locale: Locale = 'ca') =>
	scope.getByRole('list', { name: t(locale, 'partners_list_label') }).locator('li .nom');
const avis = (scope: Page | Locator) => scope.locator('.companys p[aria-live="polite"]');
const treu = (scope: Page | Locator, nom: string, locale: Locale = 'ca') =>
	scope.getByRole('button', { name: exacte(locale, 'partners_remove_label', { nom }) });

async function obrirCompanys(full: Locator, locale: Locale = 'ca') {
	const b = commuta(full, locale);
	await expect(b).toHaveAttribute('aria-expanded', 'false');
	await b.focus();
	await b.press('Enter');
	await expect(b).toHaveAttribute('aria-expanded', 'true');
	await expect(campCompanys(full, locale)).toBeFocused();
}

const vivesAmbCompanys = async (page: Page) =>
	(await filesAmbCompanys(page)).filter((f) => !f.deletedAt);

// ---------------------------------------------------------------------------
// Formulari
// ---------------------------------------------------------------------------

test.describe('Diari · companys al formulari', () => {
	test('teclat: Retorn i coma afegeixen, repetits avisats, Treu mou el focus i el text pendent es desa', async ({
		page
	}) => {
		await gotoHydrated(page, ROUTES.ca.app);
		const full = await obrirFullNav(page);
		await triarCim(full, 'matagalls', 'Matagalls');
		await obrirCompanys(full);
		const camp = campCompanys(full);

		// Retorn afegeix (i no envia el formulari)
		await page.keyboard.type('Inesa');
		await page.keyboard.press('Enter');
		await expect(full).toBeVisible();
		await expect(xips(full)).toHaveText(['Inesa']);
		await expect(avis(full)).toHaveText(t('ca', 'partners_added', { nom: 'Inesa' }));
		await expect(camp).toHaveValue('');

		// La coma separa (també en enganxar)
		await page.keyboard.type('Pau, Marta,');
		await expect(xips(full)).toHaveText(['Inesa', 'Pau', 'Marta']);
		await expect(camp).toHaveValue('');

		// Repetit (sense accents ni majúscules): s'avisa i no s'afegeix
		await page.keyboard.type('INÈSA');
		await page.keyboard.press('Enter');
		await expect(xips(full)).toHaveText(['Inesa', 'Pau', 'Marta']);
		await expect(avis(full)).toHaveText(t('ca', 'partners_duplicate', { nom: 'INÈSA' }));
		await expect(camp).toHaveValue('');

		// Treu amb el teclat: el focus passa a la xip que ocupa el lloc
		await treu(full, 'Pau').focus();
		await page.keyboard.press('Enter');
		await expect(xips(full)).toHaveText(['Inesa', 'Marta']);
		await expect(treu(full, 'Marta')).toBeFocused();
		await expect(avis(full)).toHaveText(t('ca', 'partners_removed', { nom: 'Pau' }));
		// L'última: el focus va a l'anterior
		await page.keyboard.press('Enter');
		await expect(treu(full, 'Inesa')).toBeFocused();

		// Text escrit sense afegir: es desa igualment en enviar
		await camp.fill('Joan  Puig ');
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		await expect(toast(page, 'Segellat: Matagalls.')).toBeVisible();
		const [fila] = await vivesAmbCompanys(page);
		expect(fila.companys).toEqual(['Inesa', 'Joan Puig']);

		// Persistència i visible a l'historial
		await gotoHydrated(page, HISTORIAL);
		const filaH = page
			.locator('main li')
			.filter({ has: page.getByRole('heading', { name: 'Matagalls' }) });
		await expect(filaH.locator('.companys')).toContainText('Inesa');
		await expect(filaH.locator('.companys')).toContainText('Joan Puig');
	});

	test('sense companys: el camp queda plegat i la fila es desa amb la clau buida', async ({
		page
	}) => {
		await gotoHydrated(page, ROUTES.ca.app);
		const full = await obrirFullNav(page);
		await triarCim(full, 'montcau', 'Montcau');
		await expect(commuta(full)).toHaveAttribute('aria-expanded', 'false');
		await expect(campCompanys(full)).toBeHidden();
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		const [fila] = await vivesAmbCompanys(page);
		expect(fila.companys).toEqual([]);
	});

	test('límits: 10 companys i 40 caràcters; error en viu amb aria-invalid i en enviar', async ({
		page
	}) => {
		await gotoHydrated(page, ROUTES.ca.app);
		const full = await obrirFullNav(page);
		await triarCim(full, 'montcau', 'Montcau');
		await obrirCompanys(full);
		const camp = campCompanys(full);
		const noms = Array.from({ length: 10 }, (_, i) => `Company ${i + 1}`);
		await camp.fill(noms.join(',') + ',');
		await expect(xips(full)).toHaveText(noms);
		await expect(full.locator('.limits')).toContainText(
			t('ca', 'partners_count', { count: 10, max: 10 })
		);
		await expect(camp).not.toHaveAttribute('aria-invalid', 'true');

		// L'onzè no hi cap
		await camp.fill('Onzè');
		await camp.press('Enter');
		await expect(xips(full)).toHaveCount(10);
		await expect(full.locator('.companys .err')).toHaveText(
			exacte('ca', 'partners_error_many', { max: 10 })
		);
		await expect(camp).toHaveAttribute('aria-invalid', 'true');
		const descrit = await camp.getAttribute('aria-describedby');
		const idErr = await full.locator('.companys .err').getAttribute('id');
		expect(descrit?.split(' ')).toContain(idErr);
		// Escriure esborra l'error
		await camp.fill('');
		await expect(camp).not.toHaveAttribute('aria-invalid', 'true');

		// Nom massa llarg (41): error en viu i comptador de caràcters
		await treu(full, 'Company 10').click();
		const llarg = 'A'.repeat(41);
		await camp.fill(llarg);
		await expect(full.locator('.companys .err')).toHaveText(
			exacte('ca', 'partners_error_long', { max: 40 })
		);
		await expect(camp).toHaveAttribute('aria-invalid', 'true');
		await expect(full.locator('.limits')).toContainText(
			t('ca', 'partners_chars', { count: 41, max: 40 })
		);
		// Enviar amb el nom massa llarg al camp: no desa i el focus va al camp
		await botoRegistrar(full).click();
		await expect(full).toBeVisible();
		await expect(camp).toBeFocused();
		expect(await vivesAmbCompanys(page)).toHaveLength(0);

		// 40 exactes sí
		await camp.fill('B'.repeat(40));
		await expect(camp).not.toHaveAttribute('aria-invalid', 'true');
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		const [fila] = await vivesAmbCompanys(page);
		expect(fila.companys).toHaveLength(10);
		expect(fila.companys).toContain('B'.repeat(40));
	});

	test('suggeriments: habituals com a botons, autocompletat amb fletxes i Retorn', async ({
		page
	}) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-01-10', companys: ['Inesa', 'Pau'] },
				{ cimId: CIM.canigo.id, data: '2024-07-10', companys: ['Inesa'] },
				{ cimId: CIM.pica.id, data: '2025-07-10', companys: ['Pere', 'Paula'] }
			],
			ROUTES.ca.app
		);
		const full = await obrirFullNav(page);
		await triarCim(full, 'montcau', 'Montcau');
		await obrirCompanys(full);
		const grup = full.getByRole('group', { name: t('ca', 'partners_suggestions_label') });
		const habituals = grup.getByRole('button');
		// Inesa (2) primer; després, empat a 1: el més recent (Pere/Paula, 2025) abans que Pau
		await expect(habituals.first()).toHaveAccessibleName(
			t('ca', 'partners_add_label', { nom: 'Inesa' })
		);
		await expect(habituals).toHaveCount(4);
		await grup
			.getByRole('button', { name: exacte('ca', 'partners_add_label', { nom: 'Inesa' }) })
			.click();
		await expect(xips(full)).toHaveText(['Inesa']);
		await expect(campCompanys(full)).toBeFocused();
		await expect(
			grup.getByRole('button', { name: exacte('ca', 'partners_add_label', { nom: 'Inesa' }) })
		).toHaveCount(0);

		// Ordre: més vegades; empat, el més recent; empat, alfabètic
		await expect(habituals).toHaveText(['Paula', 'Pere', 'Pau']);

		// Autocompletat: "pa" → Paula (2025) i Pau (2024); fletxes i Retorn trien
		const camp = campCompanys(full);
		await camp.fill('pa');
		await expect(camp).toHaveAttribute('aria-expanded', 'true');
		const opcions = full.getByRole('listbox').getByRole('option');
		await expect(opcions).toHaveText(['Paula', 'Pau']);
		await expect(camp).not.toHaveAttribute('aria-activedescendant', /.+/);
		await camp.press('ArrowDown');
		await camp.press('ArrowDown');
		await expect(opcions.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect(camp).toHaveAttribute(
			'aria-activedescendant',
			(await opcions.nth(1).getAttribute('id'))!
		);
		await camp.press('Enter');
		await expect(xips(full)).toHaveText(['Inesa', 'Pau']);
		await expect(camp).toHaveAttribute('aria-expanded', 'false');
		// Esc buida l'entrada sense tancar el full
		await camp.fill('Pe');
		await camp.press('Escape');
		await expect(full).toBeVisible();
		await expect(camp).toHaveValue('');
	});
});

// ---------------------------------------------------------------------------
// Editar, Desfés, historial i detall del segell
// ---------------------------------------------------------------------------

const filaHistorial = (page: Page, nom: string) =>
	page.locator('main li').filter({ has: page.getByRole('heading', { name: nom }) });

test.describe('Diari · editar, historial i detall', () => {
	test('editar: el camp s’obre sol amb els companys; treure’n un i Desfés els restaura', async ({
		page
	}) => {
		const [a] = await sembrar(
			page,
			[{ cimId: CIM.matagalls.id, data: '2024-05-01', nota: 'Boira', companys: ['Inesa', 'Pau'] }],
			HISTORIAL
		);
		const filaH = filaHistorial(page, 'Matagalls');
		const llista = await page.evaluate(() =>
			new Intl.ListFormat('ca', { style: 'long', type: 'conjunction' }).format(['Inesa', 'Pau'])
		);
		await expect(filaH.locator('.companys')).toHaveText(
			exacte('ca', 'history_partners', { names: llista })
		);
		await page.getByRole('button', { name: /^Edita l'ascensió a Matagalls/ }).click();
		const full = page.getByRole('dialog', { name: SHEET_EDICIO });
		await expect(commuta(full)).toHaveAttribute('aria-expanded', 'true');
		await expect(xips(full)).toHaveText(['Inesa', 'Pau']);
		await treu(full, 'Inesa').click();
		await full.getByRole('button', { name: 'Desa els canvis' }).click();
		await expect(full).toBeHidden();
		await expect.poll(async () => (await vivesAmbCompanys(page))[0].companys).toEqual(['Pau']);
		await expect(filaH.locator('.companys')).not.toContainText('Inesa');

		await toast(page, 'Ascensió actualitzada.').getByRole('button', { name: 'Desfés' }).click();
		await expect(toast(page, 'Desfet')).toBeVisible();
		await expect
			.poll(async () => (await vivesAmbCompanys(page))[0].companys)
			.toEqual(['Inesa', 'Pau']);
		await expect(filaH.locator('.companys')).toContainText('Inesa');
		expect((await vivesAmbCompanys(page))[0].id).toBe(a.id);
	});

	test('editar una fila d’abans de R1 (sense la clau): el camp queda plegat', async ({ page }) => {
		// `companys` absent: la fila es llegeix com a [] i el camp no s'obre.
		await sembrar(page, [{ cimId: CIM.montcau.id, data: '2024-05-01', nota: 'vella' }], HISTORIAL);
		await page.getByRole('button', { name: /^Edita l'ascensió a Montcau/ }).click();
		const full = page.getByRole('dialog', { name: SHEET_EDICIO });
		await expect(commuta(full)).toHaveAttribute('aria-expanded', 'false');
		await full.getByLabel('Nota (opcional)').fill('nova');
		await full.getByRole('button', { name: 'Desa els canvis' }).click();
		await expect(full).toBeHidden();
		await expect.poll(async () => (await vivesAmbCompanys(page))[0].nota).toBe('nova');
		expect((await vivesAmbCompanys(page))[0].companys ?? []).toEqual([]);
	});

	test('filtre "Només el diari": aria-pressed, recompte en viu, fora de la URL i no persisteix', async ({
		page
	}) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-05-01', nota: 'Amb neu' },
				{ cimId: CIM.montcau.id, data: '2024-06-01', companys: ['Inesa'] },
				{ cimId: CIM.canigo.id, data: '2024-07-01' },
				{ cimId: CIM.pica.id, data: '2024-08-01', companys: [] }
			],
			HISTORIAL
		);
		const filtre = () => page.getByRole('button', { name: exacte('ca', 'history_diary_filter') });
		await expect(filtre()).toHaveAttribute('aria-pressed', 'false');
		const titols = page.locator('main section.any h3');
		await expect(titols).toHaveCount(4);
		await filtre().click();
		await expect(filtre()).toHaveAttribute('aria-pressed', 'true');
		await expect(
			page.locator('main [role="status"]').filter({
				hasText: conte('ca', 'history_diary_count', { count: 2 })
			})
		).toBeVisible();
		await expect(titols).toHaveText(['Montcau', 'Matagalls']);
		await expect(page).toHaveURL(HISTORIAL);
		// Teclat: espai el torna a desactivar
		await filtre().focus();
		await page.keyboard.press('Space');
		await expect(filtre()).toHaveAttribute('aria-pressed', 'false');
		await expect(titols).toHaveCount(4);
		// Recàrrega: el filtre torna a estar desactivat
		await filtre().click();
		await page.reload();
		await expect(filtre()).toHaveAttribute('aria-pressed', 'false');
		await expect(titols).toHaveCount(4);
	});

	test('filtre del diari sense cap entrada: missatge buit', async ({ page }) => {
		await sembrar(page, [{ cimId: CIM.canigo.id, data: '2024-07-01' }], HISTORIAL);
		await page.getByRole('button', { name: exacte('ca', 'history_diary_filter') }).click();
		await expect(page.locator('main')).toContainText(t('ca', 'history_diary_empty'));
		await expect(page.locator('main section.any')).toHaveCount(0);
	});

	test('detall del segell al carnet: mostra els companys', async ({ page }) => {
		await sembrar(page, [
			{ cimId: CIM.pedraforca.id, data: '2020-01-01', companys: ['Inesa', 'Pau'] }
		]);
		const c1 = page
			.getByRole('list', { name: /^Caselles de la pàgina/ })
			.getByRole('button', { name: /^Casella 1:/ });
		await c1.focus();
		await c1.press('Enter');
		const full = page.getByRole('dialog', { name: 'Pedraforca' });
		await expect(full).toBeVisible();
		await expect(full.getByText(exacte('ca', 'history_partners_label'))).toBeVisible();
		await expect(full.locator('dd.companys')).toContainText('Inesa');
		await expect(full.locator('dd.companys')).toContainText('Pau');
	});

	test('/es: registre amb companys en castellà', async ({ page }) => {
		await gotoHydrated(page, ROUTES.es.app);
		const full = await obrirFullNav(page, 'es');
		await triarCim(full, 'montcau', 'Montcau');
		await obrirCompanys(full, 'es');
		await page.keyboard.type('Inesa');
		await page.keyboard.press('Enter');
		await expect(xips(full, 'es')).toHaveText(['Inesa']);
		await expect(avis(full)).toHaveText(t('es', 'partners_added', { nom: 'Inesa' }));
		await expect(treu(full, 'Inesa', 'es')).toBeVisible();
		// Plegat amb companys: el botó diu quants n'hi ha
		await commuta(full, 'es').click();
		await expect(commuta(full, 'es')).toHaveAttribute('aria-expanded', 'false');
		await expect(commuta(full, 'es')).toContainText(t('es', 'partners_toggle_count', { count: 1 }));
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		await expect.poll(async () => (await vivesAmbCompanys(page))[0]?.companys).toEqual(['Inesa']);
	});
});

// ---------------------------------------------------------------------------
// Exportació v2 i importació v1/v2
// ---------------------------------------------------------------------------

async function importar(page: Page, contingut: object) {
	await page.locator('input[type=file]').setInputFiles({
		name: 'copia.json',
		mimeType: 'application/json',
		buffer: Buffer.from(JSON.stringify(contingut))
	});
}

test.describe('Diari · exportació i importació', () => {
	test('exporta la versió 2 amb companys i municipi d’origen', async ({ page }) => {
		const rows = await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-05-01', companys: ['Inesa', 'Pau'] },
				{ cimId: CIM.montcau.id, data: '2024-06-01' }
			],
			'/ca/app'
		);
		await escriureOrigen(page, municipi('Tremp').codi);
		await gotoHydrated(page, ROUTES.ca.account);
		const [download] = await Promise.all([
			page.waitForEvent('download'),
			page.getByRole('button', { name: 'Exporta una còpia (JSON)' }).click()
		]);
		const json = JSON.parse(await readFile((await download.path())!, 'utf8'));
		expect(json.versio).toBe(2);
		expect(json.preferencies).toEqual({
			origen: {
				codi: municipi('Tremp').codi,
				nom: 'Tremp',
				updatedAt: '2026-01-01T10:00:00.000Z'
			}
		});
		const perId = new Map(json.ascensions.map((a: { id: string }) => [a.id, a]));
		expect(perId.get(rows[0].id)).toMatchObject({ companys: ['Inesa', 'Pau'] });
		// Fila d'abans de R1 (sense la clau): s'exporta amb `[]`
		expect(perId.get(rows[1].id)).toMatchObject({ companys: [] });
	});

	test('importa v2: companys normalitzats i municipi d’origen (el toast ho diu)', async ({
		page
	}) => {
		await gotoHydrated(page, ROUTES.ca.account);
		const v1 = fitxerExportacio([{ cimId: CIM.matagalls.id, data: '2024-05-01' }]);
		const fitxer = {
			...v1,
			versio: 2,
			preferencies: {
				origen: {
					codi: municipi('Figueres').codi,
					nom: 'Figueres',
					updatedAt: '2025-12-01T10:00:00.000Z'
				}
			},
			ascensions: v1.ascensions.map((a) => ({ ...a, companys: [' Inesa ', 'inesa', 'Pau'] }))
		};
		await importar(page, fitxer);
		await expect(toast(page, conte('ca', 'account_import_origin'))).toBeVisible();
		const [fila] = await vivesAmbCompanys(page);
		expect(fila.companys).toEqual(['Inesa', 'Pau']);
		expect(await llegirOrigen(page)).toMatchObject({
			valor: municipi('Figueres').codi,
			pendent: 1
		});
	});

	test('importa v1: funciona i no esborra els companys ni l’origen locals', async ({ page }) => {
		const id = '0190a1b2-c3d4-4e5f-8a6b-00000000abcd';
		const creat = '2025-01-01T10:00:00.000Z';
		await sembrar(
			page,
			[
				{
					id,
					cimId: CIM.matagalls.id,
					data: '2024-05-01',
					companys: ['Inesa'],
					createdAt: creat,
					updatedAt: creat
				}
			],
			'/ca/app'
		);
		await escriureOrigen(page, municipi('Tremp').codi);
		await gotoHydrated(page, ROUTES.ca.account);
		// Fitxer v1: la mateixa ascensió més nova (amb nota) i una de nova
		const v1 = fitxerExportacio([
			{
				id,
				cimId: CIM.matagalls.id,
				data: '2024-05-01',
				nota: 'del fitxer',
				createdAt: creat,
				updatedAt: '2025-06-01T10:00:00.000Z'
			},
			{ cimId: CIM.montcau.id, data: '2024-06-01' }
		]);
		expect(v1.versio).toBe(1);
		await importar(page, v1);
		await expect(
			toast(page, /Importació feta\. Noves: 1\. Actualitzades: 1\. Ignorades: 0\./)
		).toBeVisible();
		await expect(toast(page, conte('ca', 'account_import_origin'))).toHaveCount(0);
		const files = await vivesAmbCompanys(page);
		const actualitzada = files.find((f) => f.id === id)!;
		expect(actualitzada.nota).toBe('del fitxer');
		expect(actualitzada.companys).toEqual(['Inesa']);
		expect((await llegirOrigen(page))?.valor).toBe(municipi('Tremp').codi);
	});
});

// ---------------------------------------------------------------------------
// Accessibilitat i reflow
// ---------------------------------------------------------------------------

test.describe('Diari · a11y i reflow', () => {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`axe: full de registre amb companys, suggeriments i error (${colorScheme})`, async ({
			page
		}) => {
			await page.emulateMedia({ colorScheme });
			await sembrar(
				page,
				[{ cimId: CIM.matagalls.id, data: '2024-01-10', companys: ['Inesa', 'Pau'] }],
				ROUTES.ca.app
			);
			const full = await obrirFullNav(page);
			await triarCim(full, 'montcau', 'Montcau');
			await obrirCompanys(full);
			await campCompanys(full).fill('Marta');
			await campCompanys(full).press('Enter');
			await expectAxeNet(page, 'dialog[open]');
			await campCompanys(full).fill('in');
			await expect(full.getByRole('option').first()).toBeVisible();
			await expectAxeNet(page, 'dialog[open]');
			await campCompanys(full).fill('C'.repeat(41));
			await expect(campCompanys(full)).toHaveAttribute('aria-invalid', 'true');
			await expectAxeNet(page, 'dialog[open]');
		});
	}

	test('axe: historial amb el filtre del diari actiu', async ({ page }) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-05-01', nota: 'Amb neu', companys: ['Inesa'] },
				{ cimId: CIM.canigo.id, data: '2024-07-01' }
			],
			HISTORIAL
		);
		await page.getByRole('button', { name: exacte('ca', 'history_diary_filter') }).click();
		await expectAxeNet(page);
	});

	test('320 px: 10 noms de 40 caràcters al full i a l’historial sense scroll horitzontal', async ({
		page
	}) => {
		await page.setViewportSize({ width: 320, height: 640 });
		const noms = Array.from({ length: 10 }, (_, i) =>
			`${i}${'Llarguíssim'.repeat(4)}`.slice(0, 40)
		);
		await sembrar(
			page,
			[{ cimId: CIM.matagalls.id, data: '2024-05-01', companys: noms }],
			HISTORIAL
		);
		await expect(page.locator('main .companys')).toBeVisible();
		await expectSenseDesbord(page);
		await page.getByRole('button', { name: /^Edita l'ascensió a Matagalls/ }).click();
		const full = page.getByRole('dialog', { name: SHEET_EDICIO });
		await expect(xips(full)).toHaveCount(10);
		await expectSenseDesbord(page);
	});
});
