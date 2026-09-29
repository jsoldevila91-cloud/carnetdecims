import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated, mainNav, settleAnimations, ROUTES } from './fixtures';

const SHEET = 'Registrar una ascensió';

const sheet = (page: Page) => page.getByRole('dialog', { name: SHEET });
const registerTab = (page: Page) => mainNav(page).getByRole('link', { name: SHEET });

/** Obre el full amb el teclat (el focus queda al botó i s'ha de restaurar). */
async function openWithKeyboard(page: Page) {
	await registerTab(page).focus();
	await page.keyboard.press('Enter');
	await expect(sheet(page)).toBeVisible();
	await expect(page).toHaveURL(ROUTES.ca.register);
}

async function expectClosed(page: Page, url: string) {
	await expect(sheet(page)).toBeHidden();
	await expect(page).toHaveURL(url);
}

test.describe('Full "Registrar" (shallow routing)', () => {
	test.beforeEach(async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.peaks);
	});

	test('s’obre amb el botó, té títol i focus a dins', async ({ page }) => {
		await registerTab(page).click();
		const dialog = sheet(page);
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('heading', { level: 2, name: SHEET })).toBeVisible();
		// Modal: el focus és dins del diàleg
		await expect
			.poll(() => page.evaluate(() => !!document.activeElement?.closest('dialog[open]')))
			.toBe(true);
		// Avís de web no oficial al formulari de registre
		await expect(dialog).toContainText(/FEEC/);
	});

	test('es tanca amb el botó Tanca i torna el focus', async ({ page }) => {
		await openWithKeyboard(page);
		await sheet(page).getByRole('button', { name: 'Tanca' }).click();
		await expectClosed(page, ROUTES.ca.peaks);
		await expect(registerTab(page)).toBeFocused();
	});

	test('es tanca amb Esc i torna el focus', async ({ page }) => {
		await openWithKeyboard(page);
		await settleAnimations(page);
		await page.keyboard.press('Escape');
		await expectClosed(page, ROUTES.ca.peaks);
		await expect(registerTab(page)).toBeFocused();
	});

	test('es tanca amb el botó enrere del navegador', async ({ page }) => {
		await openWithKeyboard(page);
		await page.goBack();
		await expectClosed(page, ROUTES.ca.peaks);
		await expect(registerTab(page)).toBeFocused();
		// I endavant el torna a obrir (estat de ruta)
		await page.goForward();
		await expect(sheet(page)).toBeVisible();
	});

	test('es tanca en tocar el fons (mòbil)', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'Al mòbil el fons queda per sobre del full');
		await registerTab(page).click();
		await expect(sheet(page)).toBeVisible();
		await settleAnimations(page);
		await page.mouse.click(10, 10);
		await expectClosed(page, ROUTES.ca.peaks);
	});

	test('Esc dues vegades no desincronitza l’URL', async ({ page }) => {
		await openWithKeyboard(page);
		await settleAnimations(page);
		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
		await expectClosed(page, ROUTES.ca.peaks);
		// Encara es pot tornar a obrir
		await registerTab(page).click();
		await expect(sheet(page)).toBeVisible();
	});

	test('la resta de la pàgina queda inert mentre és obert', async ({ page }) => {
		await openWithKeyboard(page);
		await settleAnimations(page);
		for (let i = 0; i < 6; i++) {
			await page.keyboard.press('Tab');
			const inside = await page.evaluate(
				() =>
					!!document.activeElement?.closest('dialog[open]') ||
					document.activeElement === document.body
			);
			expect(inside, `Tab #${i + 1} ha sortit del diàleg`).toBe(true);
		}
	});

	test('la CTA de /app també obre el full', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.app);
		await page
			.locator('main')
			.getByRole('link', { name: /registra/i })
			.first()
			.click();
		await expect(sheet(page)).toBeVisible();
		await page.goBack();
		await expectClosed(page, ROUTES.ca.app);
	});

	test('recarregar /ca/app/registrar mostra la pàgina completa', async ({ page }) => {
		await registerTab(page).click();
		await expect(sheet(page)).toBeVisible();
		// Espera que el formulari (import dinàmic) hagi carregat: recarregar amb l'import en curs
		// fa que WebKit escrigui "Importing a module script failed" a la consola (soroll, no bug).
		await expect(sheet(page).getByRole('button', { name: 'Registrar i segellar' })).toBeVisible();
		await page.reload();
		await expect(page.locator('main h1')).toHaveText(SHEET, { ignoreCase: true });
		await expect(sheet(page)).toBeHidden();
		await expect(registerTab(page)).toHaveAttribute('aria-current', 'page');
	});
});
