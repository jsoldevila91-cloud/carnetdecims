/**
 * Bloc 4a · Historial (/app/historial): agrupat per any, ordre, etiquetes, editar, esborrar,
 * Desfés i focus. Cada test sembra el seu IndexedDB (context nou per test).
 */
import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated } from './fixtures';
import { CIM, SHEET_EDICIO, expectBdBuida, filesBd, sembrar, toast } from './ascensions';

const HISTORIAL = '/ca/app/historial';

const seccio = (page: Page, any: number) =>
	page.getByRole('region', { name: new RegExp(`^${any}\\b`) });
const nomsDe = (page: Page, any: number) =>
	seccio(page, any).getByRole('heading', { level: 3 }).allInnerTexts();

test.describe('Historial', () => {
	test('buit: estat buit amb CTA de registrar', async ({ page }) => {
		await gotoHydrated(page, HISTORIAL);
		await expectBdBuida(page);
		await expect(page.getByRole('heading', { name: 'Encara no hi ha ascensions' })).toBeVisible();
		await expect(
			page.locator('main').getByRole('link', { name: 'Registrar un cim' })
		).toBeVisible();
	});

	test('agrupat per any (desc) i, dins de cada any, per data desc i creació desc', async ({
		page
	}) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-03-01' },
				{ cimId: CIM.montcau.id, data: '2025-01-10' },
				{ cimId: CIM.canigo.id, data: '2025-08-15', createdAt: '2025-08-15T10:00:00.000Z' },
				// Mateixa data, creada després: va primer
				{ cimId: CIM.pica.id, data: '2025-08-15', createdAt: '2025-08-15T18:00:00.000Z' },
				{ cimId: CIM.pedraforca.id, data: '2006-07-01' }
			],
			HISTORIAL
		);
		await expect(page.locator('main')).toContainText(
			'Ascensions registrades en aquest dispositiu: 5.'
		);
		const anys = await page
			.locator('main section.any h2')
			.evaluateAll((hs) => hs.map((h) => h.firstChild?.textContent?.trim()));
		expect(anys).toEqual(['2025', '2024', '2006']);
		expect(await nomsDe(page, 2025)).toEqual(["Pica d'Estats", 'Canigó', 'Montcau']);
		await expect(seccio(page, 2025)).toContainText('Ascensions: 3');
		expect(await nomsDe(page, 2024)).toEqual(['Matagalls']);
		// El nom enllaça a la fitxa
		await expect(seccio(page, 2024).getByRole('link', { name: 'Matagalls' })).toHaveAttribute(
			'href',
			/\/ca\/cims\/matagalls$/
		);
	});

	test('etiquetes "Repetició · no suma" i "Dins d’una restricció d’accés"', async ({ page }) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.pedraforca.id, data: '2023-07-01' },
				{ cimId: CIM.pedraforca.id, data: '2025-07-01' },
				{ cimId: CIM.picossa.id, data: '2025-03-01' },
				{ cimId: CIM.santSalvador.id, data: '2024-10-12' }
			],
			HISTORIAL
		);
		const fila = (any: number, nom: string) =>
			seccio(page, any)
				.locator('li')
				.filter({ has: page.getByRole('heading', { name: nom }) });
		await expect(fila(2025, 'Pedraforca')).toContainText('Repetició · no suma');
		await expect(fila(2023, 'Pedraforca')).not.toContainText('Repetició');
		await expect(fila(2025, 'La Picossa')).toContainText("Dins d'una restricció d'accés");
		await expect(fila(2024, 'Sant Salvador de les Espases')).toContainText(
			"Dins d'una restricció d'accés"
		);
	});

	test('editar: el full ve omplert, desa els canvis i Desfés els reverteix', async ({ page }) => {
		const [a] = await sembrar(
			page,
			[{ cimId: CIM.matagalls.id, data: '2024-05-01', metode: 'a-peu', nota: 'vell' }],
			HISTORIAL
		);
		await page.getByRole('button', { name: /^Edita l'ascensió a Matagalls/ }).click();
		const full = page.getByRole('dialog', { name: SHEET_EDICIO });
		await expect(full).toBeVisible();
		await expect(page).toHaveURL(HISTORIAL);
		await expect(full.getByLabel('Data')).toHaveValue('2024-05-01');
		await expect(full.getByRole('radio', { name: 'A peu' })).toBeChecked();
		await expect(full.getByLabel('Nota (opcional)')).toHaveValue('vell');
		await expect(full.getByRole('button', { name: 'Canvia el cim (Matagalls)' })).toBeVisible();
		// Editar no és repetir-se a si mateixa
		await expect(full.locator('.avisos')).not.toContainText('Ja tens aquest cim');

		await full.getByLabel('Data').fill('2025-02-02');
		await full.getByRole('radio', { name: 'BTT' }).check();
		await full.getByLabel('Nota (opcional)').fill('nou');
		await full.getByRole('button', { name: 'Desa els canvis' }).click();
		await expect(full).toBeHidden();
		await expect(page).toHaveURL(HISTORIAL);

		const t = toast(page, 'Ascensió actualitzada.');
		await expect(t).toBeVisible();
		await expect(seccio(page, 2025)).toContainText('BTT');
		await expect(seccio(page, 2025)).toContainText('nou');
		await expect(seccio(page, 2024)).toHaveCount(0);
		let files = await filesBd(page);
		expect(files).toHaveLength(1);
		expect(files[0]).toMatchObject({ id: a.id, data: '2025-02-02' });

		await t.getByRole('button', { name: 'Desfés' }).click();
		await expect(toast(page, 'Desfet')).toBeVisible();
		await expect(seccio(page, 2024)).toContainText('vell');
		await expect(seccio(page, 2024)).toContainText('A peu');
		await expect(seccio(page, 2025)).toHaveCount(0);
		files = await filesBd(page);
		expect(files[0]).toMatchObject({ id: a.id, data: '2024-05-01' });
	});

	test('editar amb una data invàlida no desa i mostra l’error al camp', async ({ page }) => {
		await sembrar(page, [{ cimId: CIM.matagalls.id, data: '2024-05-01' }], HISTORIAL);
		await page.getByRole('button', { name: /^Edita l'ascensió a Matagalls/ }).click();
		const full = page.getByRole('dialog', { name: SHEET_EDICIO });
		await full.getByLabel('Data').fill('2005-01-01');
		await full.getByRole('button', { name: 'Desa els canvis' }).click();
		await expect(full.getByLabel('Data')).toBeFocused();
		await expect(full).toBeVisible();
		expect((await filesBd(page))[0].data).toBe('2024-05-01');
	});

	test('esborrar: el focus passa a la fila del costat; Desfés la recupera', async ({ page }) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.montcau.id, data: '2025-09-01' },
				{ cimId: CIM.matagalls.id, data: '2025-08-01' },
				{ cimId: CIM.canigo.id, data: '2025-07-01' }
			],
			HISTORIAL
		);
		// Teclat: focus al botó i Retorn (els navegadors no sempre enfoquen amb el clic)
		const esborra = (nom: string) =>
			page.getByRole('button', { name: new RegExp(`^Esborra l'ascensió a ${nom}`) });
		await esborra('Matagalls').focus();
		await page.keyboard.press('Enter');
		const t = toast(page, 'Ascensió esborrada: Matagalls.');
		await expect(t).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Matagalls' })).toHaveCount(0);
		// Següent fila (Canigó): el seu primer botó
		await expect(page.getByRole('button', { name: /^Edita l'ascensió a Canigó/ })).toBeFocused();

		// L'última fila: el focus va a l'anterior
		await esborra('Canigó').focus();
		await page.keyboard.press('Enter');
		await expect(page.getByRole('button', { name: /^Edita l'ascensió a Montcau/ })).toBeFocused();

		// L'única que queda: el focus va al contingut (no es perd al body)
		await esborra('Montcau').focus();
		await page.keyboard.press('Enter');
		await expect(page.getByRole('heading', { name: 'Encara no hi ha ascensions' })).toBeVisible();
		await expect(page.locator('#contingut')).toBeFocused();

		// Desfés de l'últim esborrat
		await toast(page, 'Ascensió esborrada: Montcau.')
			.getByRole('button', { name: 'Desfés' })
			.click();
		await expect(page.getByRole('heading', { name: 'Montcau' })).toBeVisible();
		const vives = (await filesBd(page)).filter((f) => !f.deletedAt);
		expect(vives.map((f) => f.cimId)).toEqual([CIM.montcau.id]);
	});

	test('esborrar amb el ratolí també deixa el focus en un lloc útil', async ({ page }) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.montcau.id, data: '2025-09-01' },
				{ cimId: CIM.matagalls.id, data: '2025-08-01' }
			],
			HISTORIAL
		);
		await page.getByRole('button', { name: /^Esborra l'ascensió a Montcau/ }).click();
		await expect(toast(page, 'Ascensió esborrada: Montcau.')).toBeVisible();
		const focus = await page.evaluate(() => document.activeElement?.tagName ?? 'null');
		expect(focus, 'el focus no pot quedar al <body>').not.toBe('BODY');
	});

	test('els canvis fets des del full es veuen a l’historial sense recarregar', async ({ page }) => {
		await sembrar(page, [{ cimId: CIM.montcau.id, data: '2025-09-01' }], HISTORIAL);
		await page.locator('main').getByRole('link', { name: 'Registrar un cim' }).click();
		const full = page.getByRole('dialog', { name: 'Registrar una ascensió' });
		await full.getByRole('combobox').fill('canigo');
		await full.getByRole('combobox').press('Enter');
		await full.getByLabel('Data').fill('2023-08-01');
		await full.getByRole('button', { name: 'Registrar i segellar' }).click();
		await expect(full).toBeHidden();
		await expect(seccio(page, 2023).getByRole('heading', { name: 'Canigó' })).toBeVisible();
		await expect(page.locator('main')).toContainText(
			'Ascensions registrades en aquest dispositiu: 2.'
		);
	});
});
