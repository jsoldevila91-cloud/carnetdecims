/**
 * Entrada amb Google activada (`PUBLIC_GOOGLE_AUTH=true`; vegeu `playwright.google.config.ts`).
 * El Supabase és el fals; la navegació a `/auth/v1/authorize` s'intercepta (mai arriba a Google).
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test as base, expect, gotoHydrated, settleAnimations } from './fixtures';
import { supabaseFals, type SupabaseFals } from './supabase-fals';

const test = base.extend<{ supa: SupabaseFals; authorize: URL[] }>({
	supa: [
		async ({ context, page, consoleGuard }, use) => {
			// Només `vite dev`: algun recurs respon 403 (se'n deixa constància de quin).
			consoleGuard.allow(/status of 403/);
			page.on('response', (r) => {
				if (r.status() === 403) console.log('403 →', r.url());
			});
			await use(await supabaseFals(context));
		},
		{ auto: true }
	],
	authorize: async ({ context }, use) => {
		const vistes: URL[] = [];
		// Registrada després del fals: té preferència.
		await context.route(/^https:\/\/[a-z0-9-]+\.supabase\.co\/auth\/v1\/authorize/, (route) => {
			vistes.push(new URL(route.request().url()));
			return route.fulfill({
				status: 200,
				contentType: 'text/html',
				body: '<!doctype html><title>Google (fals)</title><p>Google fals</p>'
			});
		});
		await use(vistes);
	}
});

const boto = (page: Page, nom: string) => page.getByRole('button', { name: nom });

test('ca: botó "Continua amb Google" i separador "o" visibles; pulsar-lo demana /authorize amb redirectTo', async ({
	page,
	authorize
}) => {
	await gotoHydrated(page, '/ca/app/compte');
	const origen = new URL(page.url()).origin;
	const s = page.locator('section#compte');
	await expect(boto(page, 'Continua amb Google')).toBeVisible();
	await expect(s.locator('.separador')).toHaveText('o');
	await boto(page, 'Continua amb Google').click();
	await expect.poll(() => authorize.length).toBe(1);
	const u = authorize[0];
	expect(u.pathname).toBe('/auth/v1/authorize');
	expect(u.searchParams.get('provider')).toBe('google');
	expect(u.searchParams.get('redirect_to')).toBe(`${origen}/ca/app/compte`);
	expect(u.searchParams.get('code_challenge')).toBeTruthy();
});

test('es: redirectTo a /es/app/cuenta', async ({ page, authorize }) => {
	await gotoHydrated(page, '/es/app/cuenta');
	const origen = new URL(page.url()).origin;
	await boto(page, 'Continuar con Google').click();
	await expect.poll(() => authorize.length).toBe(1);
	expect(authorize[0].searchParams.get('redirect_to')).toBe(`${origen}/es/app/cuenta`);
});

test('sense connexió: no navega i mostra l’avís', async ({ page, context, authorize }) => {
	await gotoHydrated(page, '/ca/app/compte');
	await context.setOffline(true);
	await boto(page, 'Continua amb Google').click();
	await expect(page.getByRole('alert').filter({ hasText: 'Necessites connexió' })).toBeVisible();
	expect(authorize).toHaveLength(0);
});

test('retorn amb ?error=access_denied: missatge de cancel·lat i botó torna a estar actiu', async ({
	page
}) => {
	await gotoHydrated(page, '/ca/app/compte?error=access_denied&error_description=denied');
	await expect(page.getByText(/Has cancel·lat l'entrada amb Google/)).toBeVisible();
	await expect(boto(page, 'Continua amb Google')).toBeEnabled();
});

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe · ${colorScheme}`, () => {
		test.use({ colorScheme });
		test('botó de Google sense violacions i amb alçada tàctil >= 44 px', async ({ page }) => {
			await gotoHydrated(page, '/ca/app/compte');
			await expect(boto(page, 'Continua amb Google')).toBeVisible();
			await page.evaluate(() => document.fonts.ready);
			await settleAnimations(page);
			const { violations } = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(violations.map((v) => v.id)).toEqual([]);
			const h = (await boto(page, 'Continua amb Google').boundingBox())!.height;
			expect(h).toBeGreaterThanOrEqual(44);
			// Teclat: arriba al botó amb Tab.
			await boto(page, 'Continua amb Google').focus();
			await expect(boto(page, 'Continua amb Google')).toBeFocused();
		});
	});
}
