import {
	test,
	expect,
	gotoHydrated,
	mainNav,
	ROUTES,
	expectHref,
	toleraAvortamentsWebKit
} from './fixtures';

test.describe('Navegació principal (5 pestanyes)', () => {
	const tabs = [
		{ name: 'Inici', url: ROUTES.ca.app, h1: 'El meu carnet' },
		{ name: 'Mapa', url: ROUTES.ca.map, h1: 'Mapa del repte 100 Cims' },
		{ name: 'Cims', url: ROUTES.ca.peaks, h1: 'Llista de cims del repte 100 Cims' },
		{ name: 'Perfil', url: ROUTES.ca.account, h1: 'Perfil' }
	];

	for (const tab of tabs) {
		test(`la pestanya ${tab.name} porta a ${tab.url} i queda marcada`, async ({ page }) => {
			await gotoHydrated(page, ROUTES.ca.home);
			const nav = mainNav(page);
			await nav.getByRole('link', { name: tab.name, exact: true }).click();
			await expect(page).toHaveURL(tab.url);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(tab.h1, {
				ignoreCase: true
			});
			await expect(nav.getByRole('link', { name: tab.name, exact: true })).toHaveAttribute(
				'aria-current',
				'page'
			);
			await expect(nav.locator('a[aria-current="page"]')).toHaveCount(1);
		});
	}

	test('la pestanya Registrar obre el full sense sortir de la pàgina', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.peaks);
		await mainNav(page).getByRole('link', { name: 'Registrar una ascensió' }).click();
		await expect(page.getByRole('dialog', { name: 'Registrar una ascensió' })).toBeVisible();
		await expect(page).toHaveURL(ROUTES.ca.register);
		// La pàgina de sota continua sent la llista de cims
		await expect(page.locator('main h1')).toHaveText(/llista de cims del repte/i);
	});

	test('en castellà, les pestanyes apunten a les rutes traduïdes', async ({ page }) => {
		await page.goto(ROUTES.es.home);
		const nav = mainNav(page, 'es');
		await expectHref(nav.getByRole('link', { name: 'Inicio', exact: true }), '/es/app');
		await expectHref(nav.getByRole('link', { name: 'Cimas', exact: true }), '/es/cimas');
		await expectHref(nav.getByRole('link', { name: 'Perfil', exact: true }), '/es/app/cuenta');
		await expectHref(nav.getByRole('link', { name: 'Mapa', exact: true }), '/es/mapa');
	});
});

test.describe('Idioma', () => {
	const pairs = [
		[ROUTES.ca.home, ROUTES.es.home],
		[ROUTES.ca.peaks, ROUTES.es.peaks],
		[ROUTES.ca.map, ROUTES.es.map],
		[ROUTES.ca.app, ROUTES.es.app],
		[ROUTES.ca.account, ROUTES.es.account]
	] as const;

	for (const [ca, es] of pairs) {
		test(`${ca} ⇄ ${es} manté la ruta equivalent i canvia lang`, async ({ page }) => {
			await gotoHydrated(page, ca);
			await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
			await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
			await expect(page).toHaveURL(es);
			await expect(page.locator('html')).toHaveAttribute('lang', 'es');
			await expect(mainNav(page, 'es')).toBeVisible();

			await page.getByRole('banner').getByRole('link', { name: 'Català' }).click();
			await expect(page).toHaveURL(ca);
			await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
		});
	}

	test('el selector conserva la query string', async ({ page }) => {
		await gotoHydrated(page, `${ROUTES.ca.peaks}?essencials=1`);
		await expectHref(
			page.getByRole('banner').getByRole('link', { name: 'Español' }),
			'/es/cimas?essencials=1'
		);
	});

	test('el selector marca l’idioma actual amb aria-current', async ({ page }) => {
		await page.goto(ROUTES.es.peaks);
		const header = page.getByRole('banner');
		await expect(header.getByRole('link', { name: 'Español' })).toHaveAttribute(
			'aria-current',
			'true'
		);
		await expect(header.getByRole('link', { name: 'Català' })).not.toHaveAttribute(
			'aria-current',
			/.*/
		);
	});
});

test.describe('Servidor', () => {
	test('/ redirigeix a /ca amb 301 (i conserva la query)', async ({ request }) => {
		const res = await request.get('/', { maxRedirects: 0 });
		expect(res.status()).toBe(301);
		expect(res.headers()['location']).toBe('/ca');

		const withQuery = await request.get('/?utm_source=x', { maxRedirects: 0 });
		expect(withQuery.status()).toBe(301);
		expect(withQuery.headers()['location']).toBe('/ca?utm_source=x');
	});

	test('/ en el navegador acaba a /ca en català', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(ROUTES.ca.home);
		await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
	});

	for (const [locale, routes] of Object.entries(ROUTES)) {
		for (const url of Object.values(routes)) {
			test(`${url} respon 200 amb lang="${locale}"`, async ({ request }) => {
				const res = await request.get(url);
				expect(res.status()).toBe(200);
				expect(await res.text()).toMatch(new RegExp(`<html[^>]*\\slang="${locale}"`));
			});
		}
	}
});

test.describe('noindex de la zona /app', () => {
	for (const url of [ROUTES.ca.app, ROUTES.es.app, ROUTES.ca.account, ROUTES.ca.register]) {
		test(`${url} porta X-Robots-Tag i meta robots noindex`, async ({ page }) => {
			const res = await page.goto(url);
			expect(res?.headers()['x-robots-tag']).toContain('noindex');
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
			await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
		});

		test(`${url}: el HTML inicial (sense JS) ja porta el meta robots noindex`, async ({
			request
		}) => {
			const html = await (await request.get(url)).text();
			const head = html.slice(0, html.indexOf('</head>'));
			expect(head).toMatch(/<meta name="robots" content="noindex"/);
			expect(html.match(/name="robots"/g)).toHaveLength(1);
		});
	}

	test('en navegar de /app a una pàgina pública no queda cap noindex orfe', async ({ page }) => {
		await page.goto(ROUTES.ca.app);
		await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
		await page.locator('a[href="/ca/cims"]').first().click();
		await expect(page).toHaveURL(/\/ca\/cims$/);
		await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
	});

	// /mapa: espai reservat (noindex) fins al bloc 4c; ara és el mapa real (imatge estàtica + text
	// sense JS) i és indexable: canonical sense query, hreflang, al sitemap de pàgines i JSON-LD Map.
	for (const [url, altra, sitemap] of [
		[ROUTES.ca.map, ROUTES.es.map, '/sitemap-ca-pagines.xml'],
		[ROUTES.es.map, ROUTES.ca.map, '/sitemap-es-paginas.xml']
	] as const) {
		test(`${url} és indexable, amb canonical, hreflang, al sitemap i JSON-LD Map`, async ({
			page,
			request
		}) => {
			const res = await page.goto(url);
			expect(res?.status()).toBe(200);
			expect(res?.headers()['x-robots-tag'] ?? '').not.toContain('noindex');
			await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				'href',
				`https://carnetdecims.cat${url}`
			);
			await expect(
				page.locator(`link[rel="alternate"][hreflang="${altra.slice(1, 3)}"]`)
			).toHaveAttribute('href', `https://carnetdecims.cat${altra}`);

			const xml = await (await request.get(sitemap)).text();
			expect(xml, sitemap).toContain(`<loc>https://carnetdecims.cat${url}</loc>`);

			const blocs = await page.locator('script[type="application/ld+json"]').allTextContents();
			const nodes = blocs.flatMap((b) => JSON.parse(b)['@graph'] ?? [JSON.parse(b)]);
			const map = nodes.find((n: { '@type'?: string }) => n['@type'] === 'Map');
			expect(map?.url).toBe(`https://carnetdecims.cat${url}`);
		});

		test(`${url} amb filtres o ?cim= manté el canonical a la URL base`, async ({
			page,
			consoleGuard,
			browserName
		}) => {
			// Es navega amb el mapa carregant: a WebKit les peticions avortades fan soroll (mapa.e2e.ts)
			toleraAvortamentsWebKit(consoleGuard, browserName);
			for (const qs of ['?zona=andorra&essencials=1', '?cim=pedraforca-pollego-superior']) {
				await page.goto(`${url}${qs}`);
				await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
					'href',
					`https://carnetdecims.cat${url}`
				);
				await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
			}
		});
	}

	for (const url of [ROUTES.ca.home, ROUTES.es.peaks]) {
		test(`${url} (pública) és indexable i té canonical`, async ({ page }) => {
			const res = await page.goto(url);
			expect(res?.headers()['x-robots-tag'] ?? '').not.toContain('noindex');
			await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				'href',
				`https://carnetdecims.cat${url}`
			);
		});
	}
});

test.describe('404', () => {
	for (const [url, lang, h1] of [
		['/ca/no-existeix', 'ca', 'No hem trobat aquesta pàgina'],
		['/es/no-existe', 'es', 'No hemos encontrado esta página'],
		['/ca/cims/no-existeix/mes/avall', 'ca', 'No hem trobat aquesta pàgina']
	] as const) {
		test(`${url} → 404 en ${lang}, noindex i enllaços que funcionen`, async ({
			page,
			consoleGuard
		}) => {
			consoleGuard.allow(/Failed to load resource.*404/);
			const res = await page.goto(url);
			expect(res?.status()).toBe(404);
			await expect(page.locator('html')).toHaveAttribute('lang', lang);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
			// L'enllaç "inici" resol a la portada de l'idioma, sigui quina sigui la profunditat
			await page.locator('main').getByRole('link').first().click();
			await expect(page).toHaveURL(`/${lang}`);
		});
	}
});

test.describe('Sense connexió', () => {
	test('mostra el bàner offline i avisa en recuperar la connexió', async ({ page, context }) => {
		await gotoHydrated(page, ROUTES.ca.app);
		await context.setOffline(true);
		await page.evaluate(() => window.dispatchEvent(new Event('offline')));
		const status = page.locator('.offline-region');
		await expect(status).toContainText(/sense connexió/i);

		await context.setOffline(false);
		await page.evaluate(() => window.dispatchEvent(new Event('online')));
		await expect(status).not.toContainText(/sense connexió/i);
		await expect(page.getByRole('region', { name: 'Notificacions' })).toContainText(
			'Tornes a tenir connexió'
		);
	});
});

test.describe('Teclat', () => {
	test('el primer Tab mostra "Salta al contingut" i porta al main', async ({
		page,
		browserName
	}) => {
		test.skip(browserName === 'webkit', 'WebKit no enfoca enllaços amb Tab per defecte');
		await gotoHydrated(page, ROUTES.ca.peaks);
		await page.keyboard.press('Tab');
		const skip = page.getByRole('link', { name: 'Salta al contingut' });
		await expect(skip).toBeFocused();
		await expect(skip).toBeInViewport();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/#contingut$/);
	});
});
