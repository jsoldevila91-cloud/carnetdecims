import { test as base, expect, type Page } from '@playwright/test';

/**
 * Fixture automàtica: recull errors de consola i excepcions no capturades de cada
 * test i el fa fallar si n'hi ha. Un test que espera un error (p. ex. el recurs 404)
 * el pot permetre amb `consoleGuard.allow(/patró/)`.
 */
type ConsoleGuard = { errors: string[]; allow: (pattern: RegExp) => void };

export const test = base.extend<{ consoleGuard: ConsoleGuard }>({
	consoleGuard: [
		async ({ page }, use) => {
			const errors: string[] = [];
			const allowed: RegExp[] = [];
			page.on('console', (msg) => {
				if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
			});
			page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
			await use({ errors, allow: (p) => allowed.push(p) });
			const unexpected = errors.filter((e) => !allowed.some((re) => re.test(e)));
			expect(unexpected, 'errors de consola inesperats').toEqual([]);
		},
		{ auto: true }
	]
});

export { expect };

/** Navega i espera que SvelteKit hagi hidratat (necessari per al shallow routing). */
export async function gotoHydrated(page: Page, url: string) {
	const response = await page.goto(url);
	await page.waitForLoadState('networkidle');
	return response;
}

/** Espera que acabin les animacions CSS (full inferior, transicions) abans de mesurar. */
export async function settleAnimations(page: Page) {
	await page.evaluate(() =>
		Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined)))
	);
}

/** Navegació principal (barra inferior al mòbil, lateral a l'escriptori). */
export const mainNav = (page: Page, locale: 'ca' | 'es' = 'ca') =>
	page.getByRole('navigation', {
		name: locale === 'ca' ? 'Navegació principal' : 'Navegación principal'
	});

/** Rutes de la fase 1 (ca i es). */
export const ROUTES = {
	ca: {
		home: '/ca',
		peaks: '/ca/cims',
		map: '/ca/mapa',
		app: '/ca/app',
		account: '/ca/app/compte',
		register: '/ca/app/registrar'
	},
	es: {
		home: '/es',
		peaks: '/es/cimas',
		map: '/es/mapa',
		app: '/es/app',
		account: '/es/app/cuenta',
		register: '/es/app/registrar'
	}
} as const;
