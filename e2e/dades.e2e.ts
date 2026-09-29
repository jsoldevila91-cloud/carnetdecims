/**
 * Bloc 4a · Dades locals (/app/compte): exportar, importar (fusionar, idempotent, fitxers
 * invàlids) i esborrar-ho tot. També a11y (axe clar/fosc), reflow a 320 px i el botó de
 * desar visible dins del full a 375 px per a tota la zona app.
 */
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated, settleAnimations } from './fixtures';
import {
	CIM,
	botoRegistrar,
	campData,
	expectBdBuida,
	filesBd,
	fitxerExportacio,
	obrirFullNav,
	sembrar,
	toast,
	triarCim,
	type FilaSembra
} from './ascensions';

const COMPTE = '/ca/app/compte';

const LLAVOR: FilaSembra[] = [
	{ cimId: CIM.pedraforca.id, data: '2024-08-10', nota: 'Per la canal' },
	{ cimId: CIM.montcau.id, data: '2025-02-01', metode: 'btt' }
];

async function importar(page: Page, contingut: string | object, nom = 'copia.json') {
	await page.locator('input[type=file]').setInputFiles({
		name: nom,
		mimeType: 'application/json',
		buffer: Buffer.from(typeof contingut === 'string' ? contingut : JSON.stringify(contingut))
	});
}

const comptador = (page: Page) => page.locator('main').getByText(/^Ascensions desades: \d+$/);

test.describe('Exportar', () => {
	test('sense dades el botó d’exportar està desactivat', async ({ page }) => {
		await gotoHydrated(page, COMPTE);
		await expectBdBuida(page);
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		await expect(page.getByRole('button', { name: 'Exporta una còpia (JSON)' })).toBeDisabled();
		await expect(page.getByRole('button', { name: 'Esborra totes les dades' })).toBeDisabled();
	});

	test('descarrega un JSON versionat amb les ascensions vives', async ({ page }) => {
		const rows = await sembrar(page, LLAVOR, COMPTE);
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
		const [download] = await Promise.all([
			page.waitForEvent('download'),
			page.getByRole('button', { name: 'Exporta una còpia (JSON)' }).click()
		]);
		expect(download.suggestedFilename()).toMatch(/^carnetdecims-\d{4}-\d{2}-\d{2}\.json$/);
		const json = JSON.parse(await readFile((await download.path())!, 'utf8'));
		expect(json).toMatchObject({
			format: 'carnetdecims.ascensions',
			versio: 1,
			app: 'carnetdecims.cat',
			total: 2
		});
		expect(typeof json.exportatAt).toBe('string');
		expect(json.avis).toMatch(/no oficial/);
		expect(json.ascensions).toHaveLength(2);
		const perId = new Map(json.ascensions.map((a: { id: string }) => [a.id, a]));
		expect(perId.get(rows[0].id)).toMatchObject({
			cimId: CIM.pedraforca.id,
			cimNom: 'Pedraforca',
			data: '2024-08-10',
			metode: 'a-peu',
			nota: 'Per la canal'
		});
		expect(perId.get(rows[1].id)).toMatchObject({
			cimId: CIM.montcau.id,
			metode: 'btt',
			nota: null
		});
		await expect(toast(page, 'Còpia descarregada.')).toBeVisible();
	});

	test('exportar → esborrar tot → importar recupera exactament les dades', async ({ page }) => {
		await sembrar(page, LLAVOR, COMPTE);
		const [download] = await Promise.all([
			page.waitForEvent('download'),
			page.getByRole('button', { name: 'Exporta una còpia (JSON)' }).click()
		]);
		const text = await readFile((await download.path())!, 'utf8');
		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		await page.getByRole('button', { name: 'Sí, esborra-ho tot' }).click();
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		await importar(page, text);
		await expect(
			toast(page, 'Importació feta. Noves: 2. Actualitzades: 0. Ignorades: 0.')
		).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');
	});
});

test.describe('Importar', () => {
	test('fusiona: afegeix les noves, no duplica les existents i és idempotent', async ({ page }) => {
		const [a] = await sembrar(page, [LLAVOR[0]], COMPTE);
		const fitxer = fitxerExportacio([
			{
				id: a.id,
				cimId: a.cimId,
				data: a.data,
				nota: a.nota,
				createdAt: a.createdAt,
				updatedAt: a.updatedAt
			},
			{ cimId: CIM.matagalls.id, data: '2023-05-01' },
			{ cimId: CIM.canigo.id, data: '2022-07-01' }
		]);
		await importar(page, fitxer);
		await expect(
			toast(page, 'Importació feta. Noves: 2. Actualitzades: 0. Ignorades: 1.')
		).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 3');

		await importar(page, fitxer);
		await expect(
			toast(page, 'Importació feta. Noves: 0. Actualitzades: 0. Ignorades: 3.')
		).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 3');
		expect(await filesBd(page)).toHaveLength(3);
	});

	test('fusiona per id: guanya la versió amb updatedAt més recent', async ({ page }) => {
		const [a] = await sembrar(
			page,
			[{ ...LLAVOR[0], updatedAt: '2025-01-01T10:00:00.000Z' }],
			COMPTE
		);
		await importar(
			page,
			fitxerExportacio([
				{
					id: a.id,
					cimId: a.cimId,
					data: '2024-09-09',
					nota: 'editada a un altre dispositiu',
					createdAt: a.createdAt,
					updatedAt: '2025-06-01T10:00:00.000Z'
				}
			])
		);
		await expect(toast(page, /Actualitzades: 1\./)).toBeVisible();
		const [fila] = await filesBd(page);
		expect(fila.data).toBe('2024-09-09');
	});

	test('entrades invàlides dins d’un fitxer vàlid s’ignoren (i les vàlides s’importen)', async ({
		page
	}) => {
		await gotoHydrated(page, COMPTE);
		const f = fitxerExportacio([
			{ cimId: CIM.matagalls.id, data: '2023-05-01' },
			{ cimId: CIM.canigo.id, data: '2006-06-30' }, // abans de l'inici
			{ cimId: 99999, data: '2023-05-01' }, // cim inexistent
			{ cimId: CIM.montcau.id, data: '2999-01-01' } // futura
		]);
		await importar(page, f);
		await expect(
			toast(page, 'Importació feta. Noves: 1. Actualitzades: 0. Ignorades: 3.')
		).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 1');
	});

	const INVALIDS: [string, string | object, RegExp][] = [
		['text que no és JSON', 'hola, no sóc un JSON', /No s'ha pogut importar el fitxer/],
		['JSON d’un altre format', { foo: 1, ascensions: [] }, /No s'ha pogut importar el fitxer/],
		[
			'versió més nova',
			{ ...fitxerExportacio([]), versio: 99 },
			/Aquesta còpia és d'una versió més nova/
		],
		[
			'cap entrada vàlida',
			fitxerExportacio([{ cimId: 99999, data: '2023-05-01' }]),
			/No s'ha pogut importar el fitxer/
		]
	];
	for (const [nom, contingut, missatge] of INVALIDS) {
		test(`fitxer invàlid (${nom}): error i cap canvi`, async ({ page }) => {
			await sembrar(page, LLAVOR, COMPTE);
			const abans = await filesBd(page);
			await importar(page, contingut);
			const t = toast(page, missatge);
			await expect(t).toBeVisible();
			await expect(t).toHaveClass(/error/);
			await expect(comptador(page)).toHaveText('Ascensions desades: 2');
			expect(await filesBd(page)).toEqual(abans);
		});
	}

	test('es pot tornar a triar el mateix fitxer (el camp es reinicia)', async ({ page }) => {
		await gotoHydrated(page, COMPTE);
		const f = fitxerExportacio([{ cimId: CIM.matagalls.id, data: '2023-05-01' }]);
		await importar(page, f);
		await expect(toast(page, /Noves: 1\./)).toBeVisible();
		await expect(page.locator('input[type=file]')).toHaveValue('');
	});
});

test.describe('Esborrar-ho tot', () => {
	test('demana confirmació; Cancel·la no esborra; confirmar ho esborra tot', async ({ page }) => {
		await sembrar(page, LLAVOR, COMPTE);
		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		const dialeg = page.getByRole('dialog', { name: 'Esborrar totes les dades' });
		await expect(dialeg).toBeVisible();
		await expect(dialeg).toContainText('(2)');
		await dialeg.getByRole('button', { name: 'Cancel·la' }).click();
		await expect(dialeg).toBeHidden();
		await expect(comptador(page)).toHaveText('Ascensions desades: 2');

		// Esc també cancel·la
		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		await expect(dialeg).toBeVisible();
		await settleAnimations(page);
		await page.keyboard.press('Escape');
		await expect(dialeg).toBeHidden();
		expect(await filesBd(page)).toHaveLength(2);

		await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
		await dialeg.getByRole('button', { name: 'Sí, esborra-ho tot' }).click();
		await expect(dialeg).toBeHidden();
		await expect(toast(page, "S'han esborrat totes les dades d'aquest dispositiu.")).toBeVisible();
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		expect(await filesBd(page)).toHaveLength(0);
		// Persisteix després de recarregar
		await page.reload();
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		await gotoHydrated(page, '/ca/app');
		await expect(page.getByRole('heading', { name: 'Registra el teu primer cim' })).toBeVisible();
	});

	test('després d’esborrar-ho tot el focus no es perd al <body>', async ({ page }) => {
		await sembrar(page, LLAVOR, COMPTE);
		await page.getByRole('button', { name: 'Esborra totes les dades' }).focus();
		await page.keyboard.press('Enter');
		await page.getByRole('button', { name: 'Sí, esborra-ho tot' }).focus();
		await page.keyboard.press('Enter');
		await expect(comptador(page)).toHaveText('Ascensions desades: 0');
		await settleAnimations(page);
		const tag = await page.evaluate(() => document.activeElement?.tagName ?? 'null');
		expect(tag, 'focus després de l’esborrat total').not.toBe('BODY');
	});
});

test.describe('Castellà', () => {
	test('/es/app/cuenta: textos i accions en castellà', async ({ page }) => {
		await sembrar(page, LLAVOR, '/es/app/cuenta');
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		await expect(page.getByRole('button', { name: 'Exportar una copia (JSON)' })).toBeEnabled();
		await expect(page.getByRole('button', { name: 'Importar una copia' })).toBeVisible();
		await page.getByRole('button', { name: 'Borrar todos los datos' }).click();
		await expect(page.getByRole('button', { name: 'Sí, borrarlo todo' })).toBeVisible();
	});
});

// ---------------------------------------------------------------------------
// A11y i disseny de la zona app
// ---------------------------------------------------------------------------

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const summary = violations.map((v) => ({
		id: v.id,
		impact: v.impact,
		nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	expect(summary, 'violacions axe').toEqual([]);
}

const LLAVOR_RICA: FilaSembra[] = [
	{ cimId: CIM.pedraforca.id, data: '2023-07-01', nota: 'Primera' },
	{ cimId: CIM.pedraforca.id, data: '2025-07-01' },
	{ cimId: CIM.picossa.id, data: '2025-03-01' },
	{ cimId: CIM.matagalls.id, data: '2024-10-12', metode: 'raquetes' }
];

const PAGINES_APP = ['/ca/app', '/ca/app/registrar', '/ca/app/historial', '/ca/app/compte'];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe zona app · ${colorScheme}`, () => {
		test.use({ colorScheme });

		for (const url of PAGINES_APP) {
			test(`${url} amb dades sense violacions`, async ({ page }) => {
				await sembrar(page, LLAVOR_RICA, url);
				await expectNoAxeViolations(page);
			});
		}

		test('/ca/app/historial buit sense violacions', async ({ page }) => {
			await gotoHydrated(page, '/ca/app/historial');
			await expect(page.getByRole('heading', { name: 'Encara no hi ha ascensions' })).toBeVisible();
			await expectNoAxeViolations(page);
		});

		test('full de registre obert amb errors, avisos i previsualització', async ({ page }) => {
			await sembrar(page, LLAVOR_RICA, '/ca/cims');
			const full = await obrirFullNav(page);
			await botoRegistrar(full).click(); // errors
			await expect(full.getByText('Revisa el formulari:')).toBeVisible();
			await expectNoAxeViolations(page);
			await triarCim(full, 'picossa', 'La Picossa');
			await campData(full).fill('2025-03-02'); // restricció + repetició
			await expect(full.locator('.avisos p')).toHaveCount(2);
			await expect(full.getByRole('img', { name: /Previsualització del segell/ })).toBeVisible();
			await expectNoAxeViolations(page);
		});

		test('full d’edició i confirmació d’esborrar-ho tot', async ({ page }) => {
			await sembrar(page, LLAVOR_RICA, '/ca/app/historial');
			await page.getByRole('button', { name: /^Edita l'ascensió a Matagalls/ }).click();
			await expect(page.getByRole('dialog', { name: "Editar l'ascensió" })).toBeVisible();
			await expectNoAxeViolations(page);
			await gotoHydrated(page, COMPTE);
			await page.getByRole('button', { name: 'Esborra totes les dades' }).click();
			await expect(page.getByRole('dialog', { name: 'Esborrar totes les dades' })).toBeVisible();
			await expectNoAxeViolations(page);
		});

		test('toast de registre amb Desfés sense violacions', async ({ page }) => {
			await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
			await botoRegistrar(page.locator('main')).click();
			await expect(toast(page, 'Segellat: Montcau.')).toBeVisible();
			await expectNoAxeViolations(page);
		});
	});
}

async function expectSenseScrollHoritzontal(page: Page, que: string) {
	const { sw, cw } = await page.evaluate(() => ({
		sw: document.documentElement.scrollWidth,
		cw: document.documentElement.clientWidth
	}));
	expect(sw, `scroll horitzontal a ${que}`).toBeLessThanOrEqual(cw);
}

test.describe('Reflow a 320 px', () => {
	test.use({ viewport: { width: 320, height: 640 } });

	for (const url of PAGINES_APP) {
		test(`${url} sense scroll horitzontal`, async ({ page }) => {
			await sembrar(page, LLAVOR_RICA, url);
			await settleAnimations(page);
			await expectSenseScrollHoritzontal(page, url);
		});
	}

	test('full de registre amb avisos i cerca oberta, sense desbordar', async ({ page }) => {
		await sembrar(page, LLAVOR_RICA, '/ca/cims');
		const full = await obrirFullNav(page);
		await full.getByRole('combobox').fill('sant');
		await expect(full.getByRole('option').first()).toBeVisible();
		await settleAnimations(page);
		await expectSenseScrollHoritzontal(page, 'full amb la cerca');
		const desborda = await full.evaluate((d) => {
			const r = d.getBoundingClientRect();
			return [...d.querySelectorAll('*')]
				.filter((el) => {
					const b = el.getBoundingClientRect();
					return b.width > 0 && (b.right > r.right + 1 || b.left < r.left - 1);
				})
				.map((el) => el.className || el.tagName)
				.slice(0, 5);
		});
		expect(desborda, 'elements fora del full').toEqual([]);
		await full.getByRole('combobox').press('Enter');
		await campData(full).fill('2025-03-02');
		await settleAnimations(page);
		await expectSenseScrollHoritzontal(page, 'full amb avisos');
	});
});

test.describe('Full de registre a 375 px', () => {
	test.use({ viewport: { width: 375, height: 667 } });

	test('el botó "Registrar i segellar" es pot veure sencer i no el tapa res', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		const full = await obrirFullNav(page);
		await triarCim(full, 'picossa', 'La Picossa');
		await campData(full).fill('2025-03-02'); // avís: el formulari és més llarg
		await settleAnimations(page);
		const boto = botoRegistrar(full);
		await boto.scrollIntoViewIfNeeded();
		await settleAnimations(page);
		// Sencer dins de la finestra i dins de la zona visible (amb scroll) del full; 1 px de marge
		// per l'arrodoniment subpíxel.
		const geo = await boto.evaluate((b) => {
			const r = b.getBoundingClientRect();
			let p: HTMLElement | null = b.parentElement;
			while (p && getComputedStyle(p).overflowY === 'visible') p = p.parentElement;
			const c = (p ?? document.documentElement).getBoundingClientRect();
			return { top: r.top, bottom: r.bottom, vh: innerHeight, cTop: c.top, cBottom: c.bottom };
		});
		expect(geo.top).toBeGreaterThanOrEqual(Math.max(0, geo.cTop) - 1);
		expect(geo.bottom).toBeLessThanOrEqual(Math.min(geo.vh, geo.cBottom) + 1);
		const tapat = await boto.evaluate((b) => {
			const r = b.getBoundingClientRect();
			const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
			return !(el && (el === b || b.contains(el)));
		});
		expect(tapat, 'el botó queda tapat per un altre element').toBe(false);
		const r = await boto.boundingBox();
		expect(r!.height).toBeGreaterThanOrEqual(44);
		// I funciona
		await boto.click();
		await expect(toast(page, 'Segellat: La Picossa.')).toBeVisible();
	});
});
