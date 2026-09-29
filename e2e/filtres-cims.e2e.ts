import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated } from './fixtures';
import { CIMS, expectNoAxeViolations } from './cataleg';

/**
 * Bloc 3b: filtres en client de `/cims` (`src/lib/ui/filtre-cims.ts`).
 * Nom sense accents + àlies + comarca, zona, franja d'altitud i només essencials; estat a la
 * query string (replaceState). Sense JS el formulari s'amaga i es veu la llista completa.
 */

const TOTAL = CIMS.length;
const visibles = (page: Page) => page.locator('main .grups .llista a:visible');
const estat = (page: Page) => page.locator('main').getByRole('status');
const cerca = (page: Page) => page.getByRole('searchbox', { name: 'Cerca per nom o comarca' });
const zona = (page: Page) => page.getByLabel('Zona', { exact: true });
const altitud = (page: Page) => page.getByLabel('Altitud', { exact: true });
const essencials = (page: Page) => page.getByRole('checkbox', { name: 'Només essencials' });
const treu = (page: Page) => page.getByRole('button', { name: 'Treu els filtres' });

const slugsVisibles = (page: Page) =>
	visibles(page).evaluateAll((as) => as.map((a) => a.getAttribute('href')!.split('/').pop()!));

const count = (f: (c: (typeof CIMS)[number]) => boolean) => CIMS.filter(f).length;
const textResultat = (n: number) =>
	n === 1 ? `Es mostra 1 de ${TOTAL} cims` : `Es mostren ${n} de ${TOTAL} cims`;

test.describe('Filtres de /cims', () => {
	test('sense filtres: tots els cims, sense recompte ni botó de treure', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		await expect(visibles(page)).toHaveCount(TOTAL);
		await expect(estat(page)).toHaveText('');
		await expect(treu(page)).toHaveCount(0);
	});

	for (const q of ["pica d'estats", 'PICA DESTATS', 'Pica d’Estats', 'pica  d estats']) {
		test(`cerca "${q}" troba la Pica d'Estats`, async ({ page }) => {
			await gotoHydrated(page, '/ca/cims');
			await cerca(page).fill(q);
			await expect(estat(page)).toHaveText(textResultat(1));
			expect(await slugsVisibles(page)).toEqual(['pica-d-estats']);
		});
	}

	for (const q of ['canigo', 'CANIGÓ', 'puígmal']) {
		test(`cerca sense distingir accents ni majúscules: "${q}"`, async ({ page }) => {
			await gotoHydrated(page, '/ca/cims');
			await cerca(page).fill(q);
			const slugs = await slugsVisibles(page);
			expect(slugs.length).toBeGreaterThan(0);
			expect(
				slugs.some((s) =>
					s.startsWith(
						q
							.normalize('NFD')
							.replace(/\p{Diacritic}/gu, '')
							.toLowerCase()
					)
				)
			).toBe(true);
		});
	}

	for (const q of ['Pollegó', 'pollego superior']) {
		test(`cerca per àlies "${q}" troba el Pedraforca`, async ({ page }) => {
			await gotoHydrated(page, '/ca/cims');
			await cerca(page).fill(q);
			expect(await slugsVisibles(page)).toEqual(['pedraforca-pollego-superior']);
			await expect(visibles(page).first()).toContainText('Pedraforca');
		});
	}

	test('cerca per comarca ("berguedà") mostra els cims de la comarca', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		await cerca(page).fill('bergueda');
		const n = count((c) => c.comarca === 'bergueda');
		await expect(visibles(page)).toHaveCount(n);
		await expect(estat(page)).toHaveText(textResultat(n));
	});

	for (const [valor, z] of [
		['andorra', 'andorra'],
		['catalunya-nord', 'catalunya-nord'],
		['catalunya', 'catalunya']
	] as const) {
		test(`zona ${valor}`, async ({ page }) => {
			await gotoHydrated(page, '/ca/cims');
			await zona(page).selectOption(valor);
			const n = count((c) => c.zona === z);
			await expect(visibles(page)).toHaveCount(n);
			await expect(estat(page)).toHaveText(textResultat(n));
			await expect(page).toHaveURL(`/ca/cims?zona=${valor}`);
		});
	}

	for (const [valor, min, max] of [
		['fins-1000', 0, 1000],
		['1000-2000', 1000, 2000],
		['2000-3000', 2000, 3000],
		['des-3000', 3000, Infinity]
	] as const) {
		test(`altitud ${valor}`, async ({ page }) => {
			await gotoHydrated(page, '/ca/cims');
			await altitud(page).selectOption(valor);
			const n = count((c) => c.altitud >= min && c.altitud < max);
			await expect(visibles(page)).toHaveCount(n);
			await expect(estat(page)).toHaveText(textResultat(n));
		});
	}

	test('les franges d’altitud sumen el total (cap cim es perd als límits)', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		let suma = 0;
		for (const v of ['fins-1000', '1000-2000', '2000-3000', 'des-3000']) {
			await altitud(page).selectOption(v);
			await expect(estat(page)).not.toHaveText('');
			suma += await visibles(page).count();
		}
		expect(suma).toBe(TOTAL);
	});

	test('combinació: zona + altitud + text + només essencials', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		await zona(page).selectOption('catalunya');
		await altitud(page).selectOption('2000-3000');
		await essencials(page).check();
		const n1 = count(
			(c) => c.zona === 'catalunya' && c.altitud >= 2000 && c.altitud < 3000 && c.essencial
		);
		await expect(visibles(page)).toHaveCount(n1);
		await cerca(page).fill('pic');
		const slugs = await slugsVisibles(page);
		expect(slugs.length).toBeGreaterThan(0);
		expect(slugs.length).toBeLessThanOrEqual(n1);
		for (const s of slugs) {
			const c = CIMS.find((x) => x.slug === s)!;
			expect(c.zona).toBe('catalunya');
			expect(c.altitud).toBeGreaterThanOrEqual(2000);
			expect(c.altitud).toBeLessThan(3000);
		}
		await expect(page).toHaveURL(/[?&]q=pic(&|$)/);
		await expect(page).toHaveURL(/zona=catalunya(&|$)/);
		await expect(page).toHaveURL(/alt=2000-3000/);
		await expect(page).toHaveURL(/essencials=1/);
		// Combinació impossible: Andorra + ≥ 3000 m → estat buit
		await zona(page).selectOption('andorra');
		await altitud(page).selectOption('des-3000');
		await expect(visibles(page)).toHaveCount(0);
		await expect(estat(page)).toHaveText(textResultat(0));
		await expect(page.getByText('Cap cim coincideix amb els filtres')).toBeVisible();
		await expect(page.locator('main .grups section:visible')).toHaveCount(0);
	});

	test('"Treu els filtres" ho restableix tot, neteja la URL i torna el focus a la cerca', async ({
		page
	}) => {
		await gotoHydrated(page, '/ca/cims?q=pic&zona=catalunya&alt=2000-3000&essencials=1');
		await expect(treu(page)).toBeVisible();
		await treu(page).click();
		await expect(visibles(page)).toHaveCount(TOTAL);
		await expect(estat(page)).toHaveText('');
		await expect(cerca(page)).toHaveValue('');
		await expect(zona(page)).toHaveValue('');
		await expect(altitud(page)).toHaveValue('');
		await expect(essencials(page)).not.toBeChecked();
		await expect(page).toHaveURL('/ca/cims');
		await expect(cerca(page)).toBeFocused();
		await expect(treu(page)).toHaveCount(0);
	});

	test('l’estat es llegeix de la URL i es conserva en recarregar', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		await zona(page).selectOption('catalunya-nord');
		await cerca(page).fill('canigo');
		await expect(page).toHaveURL(/zona=catalunya-nord/);
		await page.reload();
		await page.waitForLoadState('networkidle');
		await expect(cerca(page)).toHaveValue('canigo');
		await expect(zona(page)).toHaveValue('catalunya-nord');
		expect(await slugsVisibles(page)).toEqual(['canigo']);
		await expect(estat(page)).toHaveText(textResultat(1));
	});

	test('els canvis no creen entrades a l’historial (replaceState)', async ({ page }) => {
		await gotoHydrated(page, '/ca');
		await page.goto('/ca/cims');
		await page.waitForLoadState('networkidle');
		await cerca(page).fill('pica');
		await zona(page).selectOption('catalunya');
		await expect(page).toHaveURL(/q=pica/);
		await page.goBack();
		await expect(page).toHaveURL('/ca');
	});

	// Enllaç compartit amb una codificació diferent de la que genera `filtresAUrl` (%20 en lloc
	// de +, paràmetres en un altre ordre): els filtres s'han d'aplicar igualment i la URL
	// s'ha de continuar actualitzant en canviar-los.
	for (const qs of ['q=pica%20d%27estats', 'zona=catalunya&q=pica']) {
		test(`URL no canònica (?${qs}): aplica els filtres i manté la URL al dia`, async ({ page }) => {
			await gotoHydrated(page, `/ca/cims?${qs}`);
			const params = new URLSearchParams(qs);
			await expect(cerca(page)).toHaveValue(params.get('q')!);
			await expect(estat(page)).not.toHaveText('');
			const n = await visibles(page).count();
			expect(n).toBeLessThan(TOTAL);
			await expect(estat(page)).toHaveText(textResultat(n));
			await cerca(page).fill('canigo');
			await expect(page).toHaveURL(/[?&]q=canigo(&|$)/);
		});
	}

	test('valors desconeguts a la URL s’ignoren', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims?zona=mart&alt=9000&essencials=si');
		await expect(zona(page)).toHaveValue('');
		await expect(altitud(page)).toHaveValue('');
		await expect(essencials(page)).not.toBeChecked();
		await expect(visibles(page)).toHaveCount(TOTAL);
	});

	test('els grups de comarca amaguen els buits i actualitzen el recompte', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		await zona(page).selectOption('andorra');
		const grups = page.locator('main .grups section.grup:visible');
		await expect(grups).toHaveCount(1);
		await expect(grups.locator('h3')).toContainText('Andorra');
		await expect(grups.locator('h3 .count')).toHaveText(String(count((c) => c.zona === 'andorra')));
		await expect(grups.locator('h3 a')).toHaveAttribute('href', '/ca/comarques/andorra');
	});

	test('castellà: etiquetes i recompte traduïts', async ({ page }) => {
		await gotoHydrated(page, '/es/cimas');
		await page.getByRole('searchbox', { name: 'Busca por nombre o comarca' }).fill("pica d'estats");
		await page.getByLabel('Zona', { exact: true }).selectOption('catalunya');
		await expect(estat(page)).toHaveText(`Se muestra 1 de ${TOTAL} cimas`);
		await page.getByRole('button', { name: 'Quitar los filtros' }).click();
		await expect(visibles(page)).toHaveCount(TOTAL);
		await expect(page).toHaveURL('/es/cimas');
	});

	test('canviar d’idioma conserva els filtres de la query', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims?zona=andorra');
		await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
		await expect(page).toHaveURL('/es/cimas?zona=andorra');
		await page.waitForLoadState('networkidle');
		await expect(page.getByLabel('Zona', { exact: true })).toHaveValue('andorra');
	});
});

test.describe('Filtres de /cims sense JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	for (const url of ['/ca/cims', '/ca/cims?zona=andorra&q=xyz', '/es/cimas']) {
		test(`${url}: sense formulari i amb els ${TOTAL} cims`, async ({ page }) => {
			const res = await page.goto(url);
			expect(res?.status()).toBe(200);
			await expect(page.getByRole('search')).toBeHidden();
			await expect(visibles(page)).toHaveCount(TOTAL);
		});
	}
});

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`Filtres: axe · ${colorScheme}`, () => {
		test.use({ colorScheme });
		test('amb filtres actius sense violacions WCAG 2.2 AA', async ({ page }) => {
			await gotoHydrated(page, '/ca/cims?zona=catalunya&alt=2000-3000&essencials=1');
			await expect(treu(page)).toBeVisible();
			await expectNoAxeViolations(page);
		});
		test('estat buit sense violacions WCAG 2.2 AA', async ({ page }) => {
			await gotoHydrated(page, '/es/cimas?q=zzzzzz');
			await expect(page.getByText('Ninguna cima coincide con los filtros')).toBeVisible();
			await expectNoAxeViolations(page);
		});
	});
}

test('/cims amb filtres no desborda a 320 px', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 640 });
	await gotoHydrated(page, '/ca/cims?q=pic&zona=catalunya&alt=2000-3000&essencials=1');
	const px = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(px).toBeLessThanOrEqual(0);
});
