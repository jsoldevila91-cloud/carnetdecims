/**
 * Bloc R1 · Municipi d'origen a /app/compte (secció `#origen`): triar amb el teclat i amb el
 * ratolí, canviar, treure, cancel·lar, persistència, chunk de municipis diferit i error de
 * càrrega amb "Torna-ho a provar", codi desconegut, ca/es, axe i reflow.
 *
 * La sync amb el compte (sync_origen) és a `compte.e2e.ts`.
 */
import type { Locator, Page, Route } from '@playwright/test';
import { test, expect, gotoHydrated, ROUTES } from './fixtures';
import { CIM, sembrar } from './ascensions';
import {
	escriureOrigen,
	exacte,
	expectAxeNet,
	expectSenseDesbord,
	llegirOrigen,
	municipi,
	t,
	type Locale
} from './r1';

const seccio = (page: Page) => page.locator('#origen');
const bloc = (page: Page) => page.getByTestId('origen-municipi');
const cercador = (scope: Page | Locator, locale: Locale = 'ca') =>
	scope.getByRole('combobox', { name: t(locale, 'origin_search_label') });
const boto = (page: Page, clau: string, locale: Locale = 'ca') =>
	bloc(page).getByRole('button', { name: exacte(locale, clau) });
const estatViu = (page: Page) => bloc(page).locator('.estat-viu');

/**
 * Observa el chunk del conjunt de municipis (el que porta el codi de Barcelona). Amb
 * `bloquejar`, la petició s'avorta (sense connexió i sense caché).
 */
async function vigilarChunkMunicipis(page: Page) {
	const estat = { peticions: 0, carregat: 0, bloquejar: false };
	await page.route(/\/_app\/immutable\/chunks\/[^/]+\.js$/, async (route: Route) => {
		// `wrangler dev` a vegades talla una connexió sota càrrega (ECONNRESET): es reintenta.
		let resp;
		for (let intent = 0; ; intent++) {
			try {
				resp = await route.fetch();
				break;
			} catch (e) {
				if (intent >= 2) throw e;
			}
		}
		const body = await resp.text();
		// El JSON es compila a JS amb cometes de qualsevol tipus (avui, accents greus).
		if (/["'`]080193["'`]/.test(body)) {
			estat.peticions++;
			if (estat.bloquejar) return route.abort('internetdisconnected');
			estat.carregat++;
		}
		return route.fulfill({ response: resp, body });
	});
	return estat;
}

test.describe('Municipi d’origen a /app/compte', () => {
	test('teclat: tria, desa, anuncia i torna el focus; el chunk es baixa només en obrir', async ({
		page
	}) => {
		const chunk = await vigilarChunkMunicipis(page);
		await gotoHydrated(page, `${ROUTES.ca.account}#origen`);
		await expect(seccio(page).getByRole('heading', { level: 2 })).toHaveText(
			exacte('ca', 'origin_title')
		);
		await expect(bloc(page)).toContainText(t('ca', 'origin_none'));
		await expect(bloc(page)).toContainText(t('ca', 'origin_privacy_local'));
		await expect(boto(page, 'origin_remove')).toHaveCount(0);
		expect(chunk.carregat, 'el conjunt de municipis no es baixa sense origen').toBe(0);

		const tria = boto(page, 'origin_choose');
		await tria.focus();
		await page.keyboard.press('Enter');
		const cb = cercador(bloc(page));
		await expect(cb).toBeFocused();
		await expect.poll(() => chunk.carregat).toBe(1);

		await page.keyboard.type('lleida');
		const opcions = bloc(page).getByRole('option');
		// "Lleida" (exacte) va primer; "Artesa de Lleida", etc. després
		await expect(opcions.first()).toContainText('Lleida');
		await expect(opcions.first().locator('.o-nom')).toHaveText('Lleida');
		const n = await opcions.count();
		expect(n).toBeGreaterThan(1);
		await expect(bloc(page).locator('.selector [role="status"]')).toHaveText(
			exacte('ca', 'origin_results', { count: n })
		);
		// Fletxa amunt des de la primera va a l'última (cicle) i avall torna a la primera
		await page.keyboard.press('ArrowUp');
		await expect(opcions.nth(n - 1)).toHaveAttribute('aria-selected', 'true');
		await page.keyboard.press('ArrowDown');
		await expect(opcions.first()).toHaveAttribute('aria-selected', 'true');
		await page.keyboard.press('Enter');

		await expect(cb).toHaveCount(0);
		const lleida = municipi('Lleida');
		await expect(bloc(page).locator('.valor')).toContainText('Lleida');
		await expect(bloc(page).locator('.valor')).toContainText(`(${lleida.comarca})`);
		await expect(estatViu(page)).toHaveText(exacte('ca', 'origin_saved', { municipi: 'Lleida' }));
		await expect(boto(page, 'origin_change')).toBeFocused();
		expect(await llegirOrigen(page)).toMatchObject({ valor: lleida.codi, pendent: 1 });

		// Persistència
		await page.reload();
		await expect(bloc(page).locator('.valor')).toContainText('Lleida');
	});

	test('ratolí: cerca pel nucli ("Barruera" → la Vall de Boí) i canvia el municipi', async ({
		page
	}) => {
		await sembrar(page, [], '/ca/app');
		await escriureOrigen(page, municipi('Lleida').codi);
		await gotoHydrated(page, ROUTES.ca.account);
		await expect(bloc(page).locator('.valor')).toContainText('Lleida');
		await boto(page, 'origin_change').click();
		await cercador(bloc(page)).fill('barruera');
		const opcio = bloc(page).getByRole('option').first();
		await expect(opcio.locator('.o-nom')).toHaveText('la Vall de Boí');
		await expect(opcio).toContainText(t('ca', 'origin_head', { cap: 'Barruera' }));
		await opcio.click();
		await expect(bloc(page).locator('.valor')).toContainText('la Vall de Boí');
		expect((await llegirOrigen(page))?.valor).toBe(municipi('la Vall de Boí').codi);
	});

	test('treure el municipi: torna a "cap", el focus va a "Tria" i es manté en recarregar', async ({
		page
	}) => {
		await sembrar(page, [], '/ca/app');
		await escriureOrigen(page, municipi('Figueres').codi);
		await gotoHydrated(page, ROUTES.ca.account);
		const treu = boto(page, 'origin_remove');
		await treu.focus();
		await page.keyboard.press('Enter');
		await expect(bloc(page)).toContainText(t('ca', 'origin_none'));
		await expect(estatViu(page)).toHaveText(exacte('ca', 'origin_removed'));
		await expect(boto(page, 'origin_choose')).toBeFocused();
		await expect(boto(page, 'origin_remove')).toHaveCount(0);
		// Treure és un canvi més (null amb instant), pendent de pujar si hi ha compte
		expect(await llegirOrigen(page)).toMatchObject({ valor: null, pendent: 1 });
		await page.reload();
		await expect(bloc(page)).toContainText(t('ca', 'origin_none'));
	});

	test('Cancel·la tanca la cerca sense desar i retorna el focus', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.account);
		await boto(page, 'origin_choose').click();
		await cercador(bloc(page)).fill('tremp');
		await expect(bloc(page).getByRole('option').first()).toContainText('Tremp');
		await bloc(page)
			.getByRole('button', { name: exacte('ca', 'origin_cancel') })
			.click();
		await expect(cercador(bloc(page))).toHaveCount(0);
		await expect(boto(page, 'origin_choose')).toBeFocused();
		expect(await llegirOrigen(page)).toBeUndefined();
	});

	test('sense coincidències: estat "cap municipi" i Retorn no desa res', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.account);
		await boto(page, 'origin_choose').click();
		await cercador(bloc(page)).fill('qwxz');
		await expect(bloc(page).locator('.selector [role="status"]')).toHaveText(
			exacte('ca', 'origin_no_results')
		);
		await expect(bloc(page).getByRole('option')).toHaveCount(0);
		await cercador(bloc(page)).press('Enter');
		await expect(cercador(bloc(page))).toBeVisible();
		expect(await llegirOrigen(page)).toBeUndefined();
	});

	test('cerca amb molts resultats: com a màxim 20 i "continua escrivint"', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.account);
		await boto(page, 'origin_choose').click();
		await cercador(bloc(page)).fill('sant');
		await expect(bloc(page).getByRole('option')).toHaveCount(20);
		await expect(bloc(page).locator('.selector [role="status"]')).toContainText(
			t('ca', 'origin_more')
		);
	});

	test('el chunk no es pot baixar: error, camp desactivat i "Torna-ho a provar" ho recupera', async ({
		page,
		consoleGuard,
		browserName
	}) => {
		// BUG (R1, pendent): Chromium desa a la memòria de mòduls l'import() fallit del chunk de
		// municipis i "Torna-ho a provar" no el torna a demanar mai (cal recarregar la pàgina).
		// WebKit sí que el torna a demanar. Quan s'arregli, aquest test passarà a Chromium i
		// Playwright avisarà que cal treure aquesta línia.
		test.fail(browserName === 'chromium', 'el reintent no torna a baixar el chunk a Chromium');
		consoleGuard.allow(
			/Failed to fetch dynamically imported module|Failed to load resource|net::ERR|Importing a module script failed|error loading dynamically imported module/i
		);
		const chunk = await vigilarChunkMunicipis(page);
		chunk.bloquejar = true;
		await gotoHydrated(page, ROUTES.ca.account);
		await boto(page, 'origin_choose').click();
		const alerta = bloc(page).getByRole('alert');
		await expect(alerta).toContainText(t('ca', 'origin_load_error'));
		await expect(cercador(bloc(page))).toBeDisabled();
		chunk.bloquejar = false;
		expect(chunk.peticions).toBe(1);
		await alerta.getByRole('button', { name: exacte('ca', 'origin_retry') }).click();
		// El reintent ha de tornar a demanar el chunk (un import() fallit no es pot repetir igual)
		await expect.poll(() => chunk.peticions, { timeout: 5_000 }).toBe(2);
		await expect(cercador(bloc(page))).toBeEnabled();
		await expect(cercador(bloc(page))).toBeFocused();
		await cercador(bloc(page)).fill('tremp');
		await expect(bloc(page).getByRole('option').first()).toContainText('Tremp');
	});

	test('codi desat desconegut: avís "torna’l a triar"; tornar-lo a triar el resol', async ({
		page
	}) => {
		await sembrar(page, [{ cimId: CIM.montcau.id, data: '2025-02-10' }], '/ca/app');
		await escriureOrigen(page, 'cn:poble-inexistent', { pendent: 0 });
		await gotoHydrated(page, ROUTES.ca.account);
		await expect(bloc(page)).toContainText(t('ca', 'origin_rechoose'));
		// Hi ha un codi desat: es pot canviar o treure
		await expect(boto(page, 'origin_remove')).toBeVisible();
		await boto(page, 'origin_change').click();
		await cercador(bloc(page)).fill('perpinya');
		await expect(bloc(page).getByRole('option').first()).toBeVisible();
		await cercador(bloc(page)).press('Enter');
		await expect(bloc(page)).not.toContainText(t('ca', 'origin_rechoose'));
		await expect(bloc(page).locator('.valor')).toBeVisible();
		expect((await llegirOrigen(page))?.valor).toMatch(/^cn:/);
	});

	test('/es/app/cuenta: textos en castellà i tria amb el teclat', async ({ page }) => {
		await gotoHydrated(page, ROUTES.es.account);
		await expect(seccio(page).getByRole('heading', { level: 2 })).toHaveText(
			exacte('es', 'origin_title')
		);
		await boto(page, 'origin_choose', 'es').click();
		const cb = cercador(bloc(page), 'es');
		await expect(cb).toBeFocused();
		await cb.fill('girona');
		await expect(bloc(page).getByRole('option').first().locator('.o-nom')).toHaveText('Girona');
		await cb.press('Enter');
		await expect(estatViu(page)).toHaveText(exacte('es', 'origin_saved', { municipi: 'Girona' }));
		await expect(boto(page, 'origin_change', 'es')).toBeFocused();
	});
});

test.describe('Municipi d’origen · a11y i reflow', () => {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`axe sense violacions: sense origen, cerca oberta amb resultats i amb origen (${colorScheme})`, async ({
			page
		}) => {
			await page.emulateMedia({ colorScheme });
			await gotoHydrated(page, ROUTES.ca.account);
			await expectAxeNet(page, '#origen');
			await boto(page, 'origin_choose').click();
			await cercador(bloc(page)).fill('vall');
			await expect(bloc(page).getByRole('option').first()).toBeVisible();
			await expectAxeNet(page, '#origen');
			await cercador(bloc(page)).press('Enter');
			await expect(bloc(page).locator('.valor')).toBeVisible();
			await expectAxeNet(page, '#origen');
		});
	}

	test('320 px: cerca oberta i municipi de nom llarg sense scroll horitzontal', async ({
		page
	}) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await sembrar(page, [], '/ca/app');
		await escriureOrigen(page, municipi("Vandellòs i l'Hospitalet de l'Infant").codi);
		await gotoHydrated(page, ROUTES.ca.account);
		await expect(bloc(page).locator('.valor')).toContainText('Vandellòs');
		await expectSenseDesbord(page);
		await boto(page, 'origin_change').click();
		await cercador(bloc(page)).fill('sant');
		await expect(bloc(page).getByRole('option').first()).toBeVisible();
		await expectSenseDesbord(page);
	});
});
