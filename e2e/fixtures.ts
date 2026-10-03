import { test as base, expect, type Locator, type Page } from '@playwright/test';

/**
 * Fixture automàtica: recull errors de consola i excepcions no capturades de cada
 * test i el fa fallar si n'hi ha. Un test que espera un error (p. ex. el recurs 404)
 * el pot permetre amb `consoleGuard.allow(/patró/)`.
 */
type ConsoleGuard = { errors: string[]; allow: (pattern: RegExp) => void };

/**
 * Senyal d'hidratació per a `waitForHydration` (s'injecta a totes les pàgines del context abans
 * dels scripts de l'app). El router de SvelteKit (`_start_router`, després d'hidratar) registra
 * `hashchange` a `window`; cap altre codi de l'app ho fa abans. Des del bloc 4d
 * (`paths.relative: false`) l'HTML prerenderitzat ja porta hrefs absoluts i el senyal antic
 * (hrefs relatius → absoluts) ja no distingia res.
 */
function senyalRouter() {
	const w = window as Window & { __e2eSenyal?: boolean; __e2eRouter?: boolean };
	w.__e2eSenyal = true;
	const original = w.addEventListener;
	w.addEventListener = function (this: unknown, ...args: Parameters<Window['addEventListener']>) {
		if (args[0] === 'hashchange') w.__e2eRouter = true;
		return original.apply((this as Window | undefined) ?? w, args);
	} as Window['addEventListener'];
}

/**
 * Previsió fixa per a `/api/meteo/*` (4 dies des d'avui, hora local del navegador = la de la
 * màquina). Sense aquest mock, un test que fa scroll fins a la meteo depèn de la xarxa i un 502
 * del proveïdor surt com a error de consola del navegador ("Failed to load resource"), que no es
 * pot silenciar des de l'app.
 */
function previsioPerDefecte() {
	const dies = Array.from({ length: 4 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() + i);
		const data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		return {
			data,
			tMax: 12,
			tMin: 3,
			ventMax: 15,
			ratxaMax: 35,
			precipitacio: 0,
			probPrecipitacio: 10,
			codi: 1,
			iso0: 3000
		};
	});
	return {
		actualitzat: new Date().toISOString(),
		altitud: 2000,
		font: {
			nom: 'Open-Meteo',
			url: 'https://open-meteo.com/',
			llicencia: 'CC BY 4.0',
			llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
		},
		dies
	};
}

export const test = base.extend<{
	consoleGuard: ConsoleGuard;
	senyalHidratacio: void;
	meteoPerDefecte: void;
}>({
	/**
	 * Mock de la meteo a nivell de context: un `page.route` o un `context.route` posterior del
	 * test (p. ex. `mockMeteo` de `contingut-fitxa.e2e.ts`) hi té preferència.
	 */
	meteoPerDefecte: [
		async ({ context }, use) => {
			await context.route(/\/api\/meteo\//, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json; charset=utf-8',
					body: JSON.stringify(previsioPerDefecte())
				})
			);
			await use();
		},
		{ auto: true }
	],
	senyalHidratacio: [
		async ({ context }, use) => {
			await context.addInitScript(senyalRouter);
			await use();
		},
		{ auto: true }
	],
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

/**
 * WebKit: en fer `page.goto` amb el mapa carregant tessel·les, les peticions avortades per la
 * descàrrega del document surten com a "due to access control checks" (alguna com a rebuig no
 * gestionat) i "Worker failed to load". No passa amb la navegació del client (MapLibre es destrueix
 * a `onDestroy`) ni a Chromium; un CORS real fallaria també a Chromium.
 */
export function toleraAvortamentsWebKit(
	consoleGuard: { allow: (p: RegExp) => void },
	browserName: string
) {
	if (browserName === 'webkit')
		consoleGuard.allow(/due to access control checks|Worker failed to load/);
}

/**
 * Espera que SvelteKit hagi hidratat la pàgina i arrencat el router. Senyal fiable i sense
 * `networkidle` (que sota càrrega, amb els 3 projectes en paral·lel, és lent i no garanteix res):
 * el router registra `hashchange` en acabar d'hidratar (`senyalRouter`, injectat per la fixture
 * `senyalHidratacio`). Sense la fixture (pàgina d'un context creat a mà) es fa servir
 * `history.scrollRestoration === 'manual'`, que el router fixa en arrencar.
 * Després deixa passar dos frames perquè s'executin els efectes (`onMount`, `$effect`).
 */
export async function waitForHydration(page: Page, timeout = 15_000) {
	await page.waitForFunction(
		() => {
			const w = window as Window & { __e2eSenyal?: boolean; __e2eRouter?: boolean };
			if (w.__e2eSenyal) return w.__e2eRouter === true;
			return history.scrollRestoration === 'manual' && !!document.querySelector('header a[href]');
		},
		undefined,
		{ timeout }
	);
	await page.evaluate(
		() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
	);
}

/** Navega i espera que SvelteKit hagi hidratat (necessari per al shallow routing). */
export async function gotoHydrated(page: Page, url: string) {
	const response = await page.goto(url);
	await waitForHydration(page);
	return response;
}

/**
 * Destí d'un enllaç resolt contra la URL del document, independent de si la pàgina ja ha
 * hidratat: l'HTML prerenderitzat porta hrefs relatius (`../ca/cims/x`) i `getAttribute('href')`
 * cru només coincideix amb `/ca/cims/x` després d'hidratar (intermitent a WebKit sota càrrega).
 * Interns: `pathname + search + hash`; àncores (`#x`) tal qual; externs: URL absoluta.
 * Funciona també amb `<a>` d'SVG. (Duplicat dins cada `evaluate`: s'executa al navegador.)
 */
export function hrefsAbsoluts(locator: Locator): Promise<string[]> {
	return locator.evaluateAll((as) =>
		as.map((a) => {
			const raw = a.getAttribute('href') ?? '';
			if (raw.startsWith('#')) return raw;
			const u = new URL(raw, document.baseURI);
			return u.origin === location.origin ? u.pathname + u.search + u.hash : u.href;
		})
	);
}

/** Href resolt d'un sol enllaç (espera que existeixi); vegeu `hrefsAbsoluts`. */
export function hrefAbsolut(locator: Locator, timeout = 5_000): Promise<string> {
	return locator.evaluate(
		(a) => {
			const raw = a.getAttribute('href') ?? '';
			if (raw.startsWith('#')) return raw;
			const u = new URL(raw, document.baseURI);
			return u.origin === location.origin ? u.pathname + u.search + u.hash : u.href;
		},
		undefined,
		{ timeout }
	);
}

/** Com `toHaveAttribute('href', …)` però amb l'href resolt; reintenta fins al timeout d'expect. */
export async function expectHref(locator: Locator, expected: string | RegExp, message?: string) {
	const poll = expect.poll(() => hrefAbsolut(locator), { message });
	if (typeof expected === 'string') await poll.toBe(expected);
	else await poll.toMatch(expected);
}

/** Espera que acabin les animacions CSS (full inferior, transicions) abans de mesurar. */
export async function settleAnimations(page: Page) {
	// Les animacions infinites (esquelet de càrrega de la meteo) no acaben mai: no s'esperen.
	await page.evaluate(() =>
		Promise.all(
			document
				.getAnimations()
				.filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
				.map((a) => a.finished.catch(() => undefined))
		)
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
		register: '/ca/app/registrar',
		essentials: '/ca/app/essencials',
		regions: '/ca/app/comarques',
		nearby: '/ca/app/a-prop'
	},
	es: {
		home: '/es',
		peaks: '/es/cimas',
		map: '/es/mapa',
		app: '/es/app',
		account: '/es/app/cuenta',
		register: '/es/app/registrar',
		essentials: '/es/app/esenciales',
		regions: '/es/app/comarcas',
		nearby: '/es/app/cerca'
	}
} as const;
