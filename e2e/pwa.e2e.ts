/**
 * Bloc 4d · PWA: manifest per idioma, service worker (precache, offline, actualització) i
 * instal·lació. Contra la build de producció (`wrangler dev`): en dev el SW no es registra.
 *
 * La configuració global bloqueja el SW (`serviceWorkers: 'block'`); aquí es permet als tests
 * que el proven. Comportament per navegador (Playwright 1.60, Windows):
 * - Chromium: registre, precache, `clients.claim()`, offline amb `context.setOffline(true)`,
 *   actualització i `context.route` sobre les peticions del SW. Tot es prova.
 * - WebKit: el SW es registra, precarrega i s'actualitza igual, però amb `setOffline(true)`
 *   WebKit talla també les respostes del SW ("WebKit encountered an internal error"), fins i tot
 *   un `fetch` des de la pàgina d'un recurs del precache. Els tests offline se salten a WebKit
 *   (limitació de l'emulació, no de l'app: cal provar-ho en un iPhone real).
 * - `beforeinstallprompt` no existeix fora de Chromium: se simula amb un `Event` amb `prompt()`
 *   i `userChoice`. `display-mode: standalone` se simula sobreescrivint `matchMedia` (i
 *   `navigator.standalone` a iOS) abans dels scripts de l'app.
 */
import { readFileSync } from 'node:fs';
import type { BrowserContext, Page } from '@playwright/test';
import { test, expect, gotoHydrated } from './fixtures';
import { CIM, botoRegistrar, filesBd, sembrar, toast } from './ascensions';

const FITXA = `/ca/cims/${CIM.pedraforca.slug}`;
const FITXA_NO_VISITADA = `/ca/cims/${CIM.matagalls.slug}`;
const AVIS = (page: Page) => page.getByRole('complementary', { name: 'Instal·la Carnet de Cims' });
const BANNER_VERSIO = (page: Page) => page.locator('.offline-region .versio');

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Espera que hi hagi un SW actiu (`activated`) que controli la pàgina. */
async function esperaSW(page: Page) {
	await page.evaluate(() =>
		navigator.serviceWorker.ready.then(
			(r) =>
				new Promise<void>((res) => {
					const w = r.active!;
					if (w.state === 'activated') return res();
					w.addEventListener('statechange', () => w.state === 'activated' && res());
				})
		)
	);
	await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, {
		timeout: 30_000
	});
}

/** Noms de les caches i, per a cada una, els camins (o URL externes) desats. */
function contingutCaches(page: Page) {
	return page.evaluate(async () => {
		const out: Record<string, string[]> = {};
		for (const nom of await caches.keys()) {
			const claus = await (await caches.open(nom)).keys();
			out[nom] = claus.map((r) => {
				const u = new URL(r.url);
				return u.origin === location.origin ? u.pathname : u.href;
			});
		}
		return out;
	});
}

/** Espera que una URL (camí propi o URL externa) sigui a una cache concreta. */
async function esperaACache(page: Page, cache: string, url: string | RegExp) {
	await expect
		.poll(
			async () => {
				const c = (await contingutCaches(page))[cache] ?? [];
				return c.some((u) => (typeof url === 'string' ? u === url : url.test(u)));
			},
			{ timeout: 20_000, message: `${url} a ${cache}` }
		)
		.toBe(true);
}

/** Simula el `beforeinstallprompt` de Chromium. `window.__prompts` compta les crides. */
async function simulaBeforeInstallPrompt(page: Page, outcome: 'accepted' | 'dismissed') {
	await page.evaluate((outcome) => {
		const w = window as Window & { __prompts?: number };
		w.__prompts ??= 0;
		const e = new Event('beforeinstallprompt', { cancelable: true });
		Object.assign(e, {
			prompt: async () => {
				w.__prompts!++;
			},
			userChoice: Promise.resolve({ outcome, platform: 'web' })
		});
		window.dispatchEvent(e);
	}, outcome);
}

/** App ja instal·lada: `display-mode: standalone` (i `navigator.standalone` a iOS). */
async function emulaStandalone(context: BrowserContext) {
	await context.addInitScript(() => {
		const original = window.matchMedia.bind(window);
		window.matchMedia = (q: string) =>
			/display-mode:\s*standalone/.test(q) ? original('(min-width: 0px)') : original(q);
		Object.defineProperty(navigator, 'standalone', { configurable: true, value: true });
	});
}

/** Registra el Matagalls des de la pàgina completa (amb l'esdeveniment opcional abans). */
async function registraMatagalls(page: Page, abans?: () => Promise<void>) {
	await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.matagalls.slug}`);
	await abans?.();
	await botoRegistrar(page.locator('main')).click();
	await expect(page).toHaveURL('/ca/app');
	await expect(toast(page, /(Segellat|Desat): Matagalls/)).toBeVisible();
}

/** Mida real d'una imatge PNG o WebP (capçalera). */
function midaImatge(b: Buffer): string {
	if (b.readUInt32BE(0) === 0x89504e47) return `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;
	if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
		const chunk = b.toString('ascii', 12, 16);
		if (chunk === 'VP8 ') return `${b.readUInt16LE(26) & 0x3fff}x${b.readUInt16LE(28) & 0x3fff}`;
		if (chunk === 'VP8L') {
			const bits = b.readUInt32LE(21);
			return `${(bits & 0x3fff) + 1}x${((bits >> 14) & 0x3fff) + 1}`;
		}
		if (chunk === 'VP8X') return `${b.readUIntLE(24, 3) + 1}x${b.readUIntLE(27, 3) + 1}`;
	}
	return 'desconeguda';
}

// ── 1. Manifest ─────────────────────────────────────────────────────────────

test.describe('Manifest per idioma', () => {
	for (const l of ['ca', 'es'] as const) {
		test(`/manifest-${l}.webmanifest: camps, icones i dreceres vàlids`, async ({ request }) => {
			const res = await request.get(`/manifest-${l}.webmanifest`);
			expect(res.status()).toBe(200);
			expect(res.headers()['content-type']).toContain('application/manifest+json');
			const mf = await res.json();
			expect(mf).toMatchObject({
				id: '/app',
				name: 'Carnet de Cims',
				short_name: 'Carnet de Cims',
				lang: l,
				start_url: `/${l}/app?source=pwa`,
				scope: '/',
				display: 'standalone'
			});
			expect(mf.description.length).toBeGreaterThan(20);
			expect(mf.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
			expect(mf.background_color).toMatch(/^#[0-9a-f]{6}$/i);
			// Mai el nom ni la marca de la FEEC com a nom de l'app
			expect(`${mf.name} ${mf.short_name}`).not.toMatch(/100 Cims|FEEC/i);

			// start_url dins l'scope i servida
			expect(new URL(mf.start_url, 'http://x').pathname.startsWith(mf.scope)).toBe(true);
			expect((await request.get(mf.start_url)).status()).toBe(200);

			// Icones: 192 i 512 "any", una maskable i una monochrome; totes 200 amb la mida declarada
			const purposes = mf.icons.map((i: { purpose?: string }) => i.purpose ?? 'any');
			expect(purposes).toEqual(expect.arrayContaining(['any', 'maskable', 'monochrome']));
			const sizesAny = mf.icons
				.filter((i: { purpose?: string }) => (i.purpose ?? 'any') === 'any')
				.map((i: { sizes: string }) => i.sizes);
			expect(sizesAny).toEqual(expect.arrayContaining(['192x192', '512x512']));
			const imatges = [
				...mf.icons,
				...mf.screenshots,
				...mf.shortcuts.flatMap((s: { icons: unknown[] }) => s.icons)
			] as { src: string; sizes: string; type: string }[];
			for (const img of imatges) {
				const r = await request.get(img.src);
				expect(r.status(), img.src).toBe(200);
				expect(r.headers()['content-type'], img.src).toContain(img.type);
				expect(midaImatge(await r.body()), img.src).toBe(img.sizes);
			}
			for (const s of mf.screenshots) expect(s.label.length, s.src).toBeGreaterThan(5);

			// Dreceres: URL de l'idioma i servides
			expect(mf.shortcuts.length).toBeGreaterThanOrEqual(3);
			for (const s of mf.shortcuts) {
				expect(s.url, s.name).toMatch(new RegExp(`^/${l}/`));
				expect((await request.get(s.url)).status(), s.url).toBe(200);
			}
		});
	}

	test('cada idioma enllaça el seu manifest (també el shell de /app) i la icona d’Apple', async ({
		request
	}) => {
		for (const [url, l] of [
			['/ca', 'ca'],
			['/es', 'es'],
			['/ca/cims', 'ca'],
			['/es/app', 'es'],
			['/ca/app/registrar', 'ca']
		] as const) {
			const html = await (await request.get(url)).text();
			expect(html, url).toContain(`<link rel="manifest" href="/manifest-${l}.webmanifest"`);
			expect(html, url).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
		}
		const apple = await request.get('/apple-touch-icon.png');
		expect(apple.status()).toBe(200);
		expect(midaImatge(await apple.body())).toBe('180x180');
	});
});

// ── 2. Service worker: registre i precache ──────────────────────────────────

test.describe('Service worker', () => {
	test.use({ serviceWorkers: 'allow' });
	test.slow(({ browserName }) => browserName === 'webkit', 'precache complet a WebKit');

	test('es registra a l’scope /, s’activa i controla la pàgina sense recarregar', async ({
		page
	}) => {
		await gotoHydrated(page, '/ca');
		await esperaSW(page);
		const reg = await page.evaluate(async () => {
			const r = (await navigator.serviceWorker.getRegistration())!;
			return {
				scope: new URL(r.scope).pathname,
				script: new URL(r.active!.scriptURL).pathname,
				controller: navigator.serviceWorker.controller?.state
			};
		});
		expect(reg).toEqual({ scope: '/', script: '/service-worker.js', controller: 'activated' });

		const c = await contingutCaches(page);
		const precache = Object.keys(c).filter((n) => n.startsWith('carnet-precache-'));
		expect(precache).toHaveLength(1);
		const fitxers = c[precache[0]];
		for (const imprescindible of [
			'/ca/app',
			'/ca/app/registrar',
			'/ca/app/historial',
			'/es/app',
			'/es/app/cuenta',
			'/ca/offline',
			'/es/offline',
			'/manifest-ca.webmanifest',
			'/manifest-es.webmanifest',
			'/icons/icon-192.png',
			'/favicon.svg'
		])
			expect(fitxers, imprescindible).toContain(imprescindible);
		// Fora del precache: captures, robots, MapLibre i el seu worker (es baixen en visitar el mapa)
		expect(fitxers.filter((f) => /screenshots|robots\.txt|maplibre-worker/.test(f))).toEqual([]);
		// Cap fitxa ni pàgina pública al precache (van a la cache de pàgines en visitar-les)
		expect(fitxers.filter((f) => /^\/(ca|es)\/(cims|cimas|comarques|comarcas)\//.test(f))).toEqual(
			[]
		);
	});

	test('toast "Preparat per funcionar sense connexió" un sol cop', async ({ page }) => {
		await gotoHydrated(page, '/ca');
		await esperaSW(page);
		await expect(toast(page, 'Preparat per funcionar sense connexió')).toBeVisible();
		expect(await page.evaluate(() => localStorage.getItem('carnetdecims:llest-offline'))).toBe('1');

		await page.reload();
		await esperaSW(page);
		await gotoHydrated(page, '/es');
		await page.waitForTimeout(1500);
		await expect(
			page.getByRole('region', { name: /Notificacions|Notificaciones/ })
		).not.toContainText(/Preparat|Preparado/);
	});
});

// ── 3. Sense connexió (Chromium) ────────────────────────────────────────────

test.describe('Sense connexió (amb el SW instal·lat)', () => {
	test.use({ serviceWorkers: 'allow' });
	test.skip(
		({ browserName }) => browserName !== 'chromium',
		'WebKit + setOffline talla també les respostes del service worker (vegeu la capçalera)'
	);

	test('carnet, registrar (IndexedDB), historial i tornar a tenir connexió', async ({
		page,
		context
	}) => {
		await gotoHydrated(page, '/ca/app');
		await esperaSW(page);
		await context.setOffline(true);

		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.matagalls.slug}`);
		await expect(page.locator('main h1')).toHaveText('Registrar una ascensió');
		await expect(page.locator('.offline-region')).toContainText('Sense connexió');
		await botoRegistrar(page.locator('main')).click();
		await expect(page).toHaveURL('/ca/app');
		await expect(toast(page, 'Segellat: Matagalls.')).toBeVisible();
		const files = await filesBd(page);
		expect(files).toHaveLength(1);
		expect(files[0]).toMatchObject({ cimId: CIM.matagalls.id, deletedAt: null });

		// Recàrregues completes sense xarxa: shells del precache + dades d'IndexedDB
		await gotoHydrated(page, '/ca/app/historial');
		await expect(page.locator('main h1')).toHaveText('Historial');
		await expect(page.locator('main')).toContainText('Matagalls');
		await gotoHydrated(page, '/ca/app');
		await expect.poll(() => page.locator('p.count').innerText()).toMatch(/^1\s*\/\s*100/);
		await gotoHydrated(page, '/es/app/historial');
		await expect(page.locator('main')).toContainText('Matagalls');

		await context.setOffline(false);
		await gotoHydrated(page, '/ca/cims');
		await expect(page.locator('main h1')).not.toHaveText('Sense connexió');
		await expect(page.locator('.offline-region')).not.toContainText('Sense connexió');
		expect(await filesBd(page)).toHaveLength(1);
	});

	test('fitxa visitada (amb la imatge del mapa) sí; no visitada → "Sense connexió" a la URL demanada', async ({
		page,
		context
	}) => {
		// Imatge del mapa estàtic: resposta CORS fixa (sense dependre de l'ICGC)
		const png = readFileSync('static/icons/icon-192.png');
		await context.route(/geoserveis\.icgc\.cat\/servei\/|data\.geopf\.fr\//, (r) =>
			r.fulfill({
				status: 200,
				contentType: 'image/png',
				headers: { 'access-control-allow-origin': '*' },
				body: png
			})
		);
		await gotoHydrated(page, '/ca/app');
		await esperaSW(page);
		await gotoHydrated(page, FITXA);
		await esperaACache(page, 'carnet-pagines-v1', FITXA);
		await esperaACache(page, 'carnet-teseles-v1', /geoserveis\.icgc\.cat\/servei\//);
		await context.unroute(/geoserveis\.icgc\.cat\/servei\/|data\.geopf\.fr\//);

		await context.setOffline(true);
		await gotoHydrated(page, FITXA);
		await expect(page.locator('main h1')).toContainText('Pedraforca');
		const img = page.locator('main figure img').first();
		await expect
			.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0))
			.toBe(true);

		const res = await page.goto(FITXA_NO_VISITADA);
		expect(res?.status()).toBe(200);
		await expect(page).toHaveURL(FITXA_NO_VISITADA);
		await expect(page.locator('main h1')).toHaveText('Sense connexió');
		await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
		// Des de la pàgina offline, el carnet funciona
		await page.locator('main').getByRole('link', { name: 'El meu carnet' }).click();
		await expect(page).toHaveURL('/ca/app');
		await expect(page.locator('main h1')).toHaveText('El meu carnet');

		await page.goto(`/es/cimas/${CIM.matagalls.slug}`);
		await expect(page.locator('main h1')).toHaveText('Sin conexión');
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');

		await context.setOffline(false);
		await gotoHydrated(page, FITXA_NO_VISITADA);
		await expect(page.locator('main h1')).toContainText('Matagalls');
	});

	test('/ca/mapa amb les tessel·les ja vistes funciona sense connexió', async ({
		page,
		context,
		consoleGuard
	}) => {
		test.slow();
		// Sense xarxa, les tessel·les no vistes (vores, un altre zoom) fallen: MapLibre ho registra.
		consoleGuard.allow(
			/Failed to load resource|AJAXError|Failed to fetch|ERR_INTERNET_DISCONNECTED/
		);
		await gotoHydrated(page, '/ca/app');
		await esperaSW(page);
		await gotoHydrated(page, '/ca/mapa');
		const controls = page.getByRole('group', { name: 'Controls del mapa' });
		await expect(controls).toBeVisible({ timeout: 60_000 });
		await esperaACache(page, 'carnet-pagines-v1', '/ca/mapa');
		await esperaACache(page, 'carnet-recursos-v1', /maplibre-worker/);
		await esperaACache(page, 'carnet-teseles-v1', /\.pbf|\/tiles?\//);
		// Que acabin de desar-se (cache.put en segon pla)
		await page.waitForTimeout(1500);

		const delSW: string[] = [];
		page.on('response', (r) => {
			if (/geoserveis\.icgc\.cat|mapterhorn|data\.geopf\.fr/.test(r.url()) && r.fromServiceWorker())
				if (r.status() === 200) delSW.push(r.url());
		});
		await context.setOffline(true);
		await gotoHydrated(page, '/ca/mapa');
		await expect(page.locator('main h1')).not.toHaveText('Sense connexió');
		await expect(controls).toBeVisible({ timeout: 60_000 });
		await expect(page.locator('.maplibregl-canvas')).toBeVisible();
		await expect(
			page.getByRole('alert').filter({ hasText: "No s'ha pogut carregar el mapa interactiu" })
		).toHaveCount(0);
		await expect.poll(() => delSW.length, { timeout: 20_000 }).toBeGreaterThan(0);
		await context.setOffline(false);
	});
});

// ── 4. Actualització ────────────────────────────────────────────────────────

test.describe('Nova versió', () => {
	test.use({ serviceWorkers: 'allow' });
	test.slow();

	test('banner, "Més tard" i "Actualitza": recarrega, conserva les dades i esborra el precache antic', async ({
		page,
		context
	}) => {
		// La primera instal·lació rep un SW amb una altra versió ("antiga"); `update()` baixa el
		// real del servidor (Playwright no intercepta la comprovació d'actualització).
		let versio: string | undefined;
		await context.route('**/service-worker.js', async (route) => {
			const res = await route.fetch();
			const cos = await res.text();
			versio = /x-carnet-sw-versio`\)(?:!==|===)`([^`]+)`/.exec(cos)?.[1];
			await route.fulfill({
				response: res,
				body: versio ? cos.replaceAll(`\`${versio}\``, '`e2e-antiga`') : cos
			});
		});
		await sembrar(page, [{ cimId: CIM.pedraforca.id, data: '2024-08-10' }]);
		await esperaSW(page);
		await context.unroute('**/service-worker.js');
		expect(versio, 'la versió del SW es reconeix al codi construït').toBeTruthy();
		expect(Object.keys(await contingutCaches(page))).toContain('carnet-precache-e2e-antiga');
		await expect(BANNER_VERSIO(page)).toHaveCount(0);

		await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())!.update());
		await expect(BANNER_VERSIO(page)).toContainText('Hi ha una nova versió', { timeout: 60_000 });
		// La versió nova espera (no s'activa sola): les dues precache conviuen
		const abans = Object.keys(await contingutCaches(page));
		expect(abans).toEqual(
			expect.arrayContaining(['carnet-precache-e2e-antiga', `carnet-precache-${versio}`])
		);

		// "Més tard": s'amaga i el focus no es perd
		await BANNER_VERSIO(page).getByRole('button', { name: 'Més tard' }).click();
		await expect(BANNER_VERSIO(page)).toHaveCount(0);
		await expect(page.locator('#contingut')).toBeFocused();

		// A la visita següent torna a sortir (el SW nou continua en espera)
		await gotoHydrated(page, '/ca/app/historial');
		await expect(BANNER_VERSIO(page)).toBeVisible({ timeout: 15_000 });

		const recarrega = page.waitForEvent('load');
		await BANNER_VERSIO(page).getByRole('button', { name: 'Actualitza' }).click();
		await recarrega;
		await expect(page).toHaveURL('/ca/app/historial');
		await expect(page.locator('main')).toContainText('Pedraforca');
		await expect(BANNER_VERSIO(page)).toHaveCount(0);
		await expect
			.poll(async () =>
				Object.keys(await contingutCaches(page)).filter((n) => n.includes('precache'))
			)
			.toEqual([`carnet-precache-${versio}`]);
		const estat = await page.evaluate(async () => {
			const r = (await navigator.serviceWorker.getRegistration())!;
			return { waiting: !!r.waiting, controla: navigator.serviceWorker.controller !== null };
		});
		expect(estat).toEqual({ waiting: false, controla: true });
		expect(await filesBd(page)).toHaveLength(1);
	});
});

// ── 5. Instal·lació ─────────────────────────────────────────────────────────

test.describe('Avís d’instal·lació (Chromium, beforeinstallprompt simulat)', () => {
	test.skip(({ browserName }) => browserName !== 'chromium', 'beforeinstallprompt és de Chromium');

	test('no surt en entrar; després del primer registre sí; "Ara no" persisteix i el focus va al contingut', async ({
		page
	}) => {
		// En entrar, encara que el navegador ofereixi instal·lar: cap avís
		await gotoHydrated(page, '/ca/app');
		await simulaBeforeInstallPrompt(page, 'dismissed');
		await page.waitForTimeout(800);
		await expect(AVIS(page)).toHaveCount(0);

		await registraMatagalls(page, () => simulaBeforeInstallPrompt(page, 'dismissed'));
		// Surt quan el toast del segell ja no hi és
		await expect(AVIS(page)).toBeVisible({ timeout: 20_000 });
		await expect(AVIS(page).getByRole('button', { name: 'Instal·la', exact: true })).toBeVisible();
		await AVIS(page).getByRole('button', { name: 'Ara no' }).click();
		await expect(AVIS(page)).toHaveCount(0);
		await expect(page.locator('#contingut')).toBeFocused();
		expect(await page.evaluate(() => localStorage.getItem('carnetdecims:avis-installacio'))).toBe(
			'rebutjat'
		);

		// Un altre registre (i una altra sessió): no torna a sortir sol
		await registraMatagalls(page, () => simulaBeforeInstallPrompt(page, 'dismissed'));
		await expect(toast(page, /(Segellat|Desat): Matagalls/)).toHaveCount(0, { timeout: 15_000 });
		await page.waitForTimeout(800);
		await expect(AVIS(page)).toHaveCount(0);

		// El Perfil continua oferint-lo
		await gotoHydrated(page, '/ca/app/compte');
		await simulaBeforeInstallPrompt(page, 'dismissed');
		await expect(page.getByRole('button', { name: "Instal·la l'app" })).toBeVisible();
	});

	test('"Instal·la" obre el diàleg natiu; acceptat → no torna a sortir', async ({ page }) => {
		await registraMatagalls(page, () => simulaBeforeInstallPrompt(page, 'accepted'));
		await expect(AVIS(page)).toBeVisible({ timeout: 20_000 });
		await AVIS(page).getByRole('button', { name: 'Instal·la', exact: true }).click();
		await expect(AVIS(page)).toHaveCount(0);
		expect(await page.evaluate(() => (window as Window & { __prompts?: number }).__prompts)).toBe(
			1
		);
		expect(await page.evaluate(() => localStorage.getItem('carnetdecims:avis-installacio'))).toBe(
			'installada'
		);
		await expect(page.locator('#contingut')).toBeFocused();
	});

	test('Perfil sense oferta del navegador: explica com instal·lar-la, sense botó', async ({
		page
	}) => {
		await gotoHydrated(page, '/ca/app/compte');
		const app = page.getByRole('region', { name: "L'app" });
		await expect(app).toContainText('Ara el navegador no ofereix instal·lar-la');
		await expect(app.getByRole('button')).toHaveCount(0);
	});
});

test.describe('Avís d’instal·lació a iOS (WebKit, UA d’iPhone)', () => {
	test.skip(({ browserName }) => browserName !== 'webkit', 'només Safari d’iOS');

	test('després del primer registre: "Com s\'instal·la" obre el full d\'instruccions', async ({
		page
	}) => {
		await gotoHydrated(page, '/ca/app');
		await page.waitForTimeout(800);
		await expect(AVIS(page)).toHaveCount(0);

		await registraMatagalls(page);
		await expect(AVIS(page)).toBeVisible({ timeout: 20_000 });
		await AVIS(page).getByRole('button', { name: "Com s'instal·la" }).click();
		const full = page.getByRole('dialog', { name: "Instal·la l'app a l'iPhone o l'iPad" });
		await expect(full).toBeVisible();
		await expect(full.locator('ol li')).toHaveCount(3);
		await expect(full).toContainText('Comparteix');
		await expect(full).toContainText("Afegeix a la pantalla d'inici");
		await full.getByRole('button', { name: 'Entesos' }).click();
		await expect(full).toBeHidden();
		await expect(AVIS(page)).toHaveCount(0);
		// (El focus en tancar el full: test de sota, marcat com a bug.)
		// Haver vist les instruccions compta com a resposta
		expect(await page.evaluate(() => localStorage.getItem('carnetdecims:avis-installacio'))).toBe(
			'rebutjat'
		);

		// El Perfil sempre ofereix les instruccions
		await gotoHydrated(page, '/ca/app/compte');
		await page.getByRole('button', { name: "Instal·la l'app" }).click();
		await expect(full).toBeVisible();
	});

	test("en tancar el full d'instruccions obert des de l'avís, el focus va a #contingut", async ({
		page
	}) => {
		// BUG (QA 4d): `tancarFullIos` (ui/AvisInstallacio.svelte) mou el focus en el frame
		// següent, quan el <dialog> encara és obert; en acabar de tancar-se el focus cau a <body>.
		test.fail(true, "Bug 4d: el focus es perd a <body> en tancar el full d'iOS (WCAG 2.4.3)");
		await registraMatagalls(page);
		await expect(AVIS(page)).toBeVisible({ timeout: 20_000 });
		await AVIS(page).getByRole('button', { name: "Com s'instal·la" }).click();
		const full = page.getByRole('dialog', { name: "Instal·la l'app a l'iPhone o l'iPad" });
		await full.getByRole('button', { name: 'Entesos' }).click();
		await expect(full).toBeHidden();
		await expect(page.locator('#contingut')).toBeFocused();
	});
});

test.describe('App instal·lada (display-mode: standalone)', () => {
	test('cap avís després de registrar; el Perfil diu que ja és instal·lada', async ({
		page,
		context,
		browserName
	}) => {
		await emulaStandalone(context);
		const simula =
			browserName === 'chromium' ? () => simulaBeforeInstallPrompt(page, 'dismissed') : undefined;
		await registraMatagalls(page, simula);
		await expect(toast(page, /(Segellat|Desat): Matagalls/)).toHaveCount(0, { timeout: 15_000 });
		await page.waitForTimeout(800);
		await expect(AVIS(page)).toHaveCount(0);

		await gotoHydrated(page, '/ca/app/compte');
		await simula?.();
		const app = page.getByRole('region', { name: "L'app" });
		await expect(app).toContainText("Ja l'estàs fent servir com a app instal·lada.");
		await expect(app.getByRole('button')).toHaveCount(0);
	});
});
