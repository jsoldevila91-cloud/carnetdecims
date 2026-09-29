import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated } from './fixtures';
import {
	COMARQUES_AMB_CIMS,
	LOCALES,
	ORIGIN,
	alt,
	cimsDe,
	comarca,
	comarcaUrl,
	comarquesUrl,
	expectNoAxeViolations,
	fitxaUrl,
	jsonLdNodes,
	overflowX,
	stubMaps,
	type Locale
} from './cataleg';

/**
 * Bloc 3b: índex de comarques (`/ca/comarques`, `/es/comarcas`) i pàgines de comarca
 * (`/ca/comarques/{slug}`, `/es/comarcas/{slug}`) amb mapa estàtic i marcadors enllaçats.
 * Les xifres esperades surten del catàleg (`e2e/cataleg.ts`).
 */

const T = {
	ca: {
		breadcrumb: 'Ruta de navegació',
		home: 'Inici',
		comarques: 'Comarques',
		markers: 'Cims del mapa',
		zones: { catalunya: 'Catalunya', andorra: 'Andorra', 'catalunya-nord': 'Catalunya Nord' },
		attrIcgc: 'Mapa topogràfic © ICGC',
		attrIgn: 'Mapa topogràfic © IGN France (Plan IGN)',
		nearby: 'Comarques properes'
	},
	es: {
		breadcrumb: 'Ruta de navegación',
		home: 'Inicio',
		comarques: 'Comarcas',
		markers: 'Cimas del mapa',
		zones: { catalunya: 'Cataluña', andorra: 'Andorra', 'catalunya-nord': 'Cataluña Norte' },
		attrIcgc: 'Mapa topográfico © ICGC',
		attrIgn: 'Mapa topográfico © IGN France (Plan IGN)',
		nearby: 'Comarcas cercanas'
	}
} as const;

/** Mostra: Pirineu, Aran, costa, Andorra i Catalunya Nord (zones) i una comarca d'1 sol cim. */
const MOSTRA = [
	'bergueda',
	'val-d-aran',
	'alt-emporda',
	'andorra',
	'catalunya-nord',
	'garraf',
	'pallars-sobira'
] as const;

const markers = (page: Page, locale: Locale) =>
	page.getByRole('list', { name: T[locale].markers }).getByRole('link');

/** Enllaços a fitxes de les llistes de la pàgina (sense els marcadors del mapa). */
async function hrefsLlistes(page: Page, locale: Locale) {
	const prefix = locale === 'ca' ? '/ca/cims/' : '/es/cimas/';
	return page
		.locator(
			'main section[aria-labelledby="essencials"] a, main section[aria-labelledby="altres"] a'
		)
		.evaluateAll(
			(as, p) => as.map((a) => a.getAttribute('href')!).filter((h) => h.startsWith(p)),
			prefix
		);
}

// ── Índex ───────────────────────────────────────────────────────────────────────────────────

for (const locale of LOCALES) {
	const t = T[locale];
	const url = comarquesUrl(locale);

	test.describe(`Índex ${url}`, () => {
		test('200, H1, 43 comarques agrupades per zona i en ordre alfabètic', async ({ page }) => {
			const res = await page.goto(url);
			expect(res?.status()).toBe(200);
			await expect(page.locator('html')).toHaveAttribute('lang', locale);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
			expect((await page.title()).length).toBeLessThanOrEqual(60);

			expect(COMARQUES_AMB_CIMS).toHaveLength(43);
			for (const zona of ['catalunya', 'andorra', 'catalunya-nord'] as const) {
				const esperades = COMARQUES_AMB_CIMS.filter((c) => c.zona === zona);
				const region = page.getByRole('region', { name: t.zones[zona], exact: true });
				const links = region.getByRole('link');
				const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
				expect(hrefs, `comarques de la zona ${zona} en ordre`).toEqual(
					esperades.map((c) => comarcaUrl(c.slug, locale))
				);
				for (const [i, c] of esperades.entries()) {
					await expect(links.nth(i)).toContainText(c.nom);
				}
			}
			// La Segarra (sense cims) no hi surt
			await expect(page.locator(`main a[href="${comarcaUrl('segarra', locale)}"]`)).toHaveCount(0);
		});

		test('el recompte de cada targeta coincideix amb el catàleg', async ({ page }) => {
			await page.goto(url);
			for (const c of COMARQUES_AMB_CIMS) {
				const n = cimsDe(c.slug).length;
				const card = page.locator(`main a[href="${comarcaUrl(c.slug, locale)}"]`);
				// Amb el catàleg només d'essencials, el text és "{n} essencials" / "1 essencial"
				await expect(card, c.slug).toContainText(new RegExp(`(^|\\D)${n}\\s`));
			}
		});

		test('els 43 enllaços responen 200 i el JSON-LD llista les mateixes comarques', async ({
			page,
			request
		}) => {
			await page.goto(url);
			const hrefs = await page
				.locator('main ul a')
				.evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
			expect(hrefs).toHaveLength(43);
			expect(new Set(hrefs).size).toBe(43);
			const estats = await Promise.all(
				hrefs.map(async (h) => [h, (await request.get(h, { maxRedirects: 0 })).status()] as const)
			);
			expect(estats.filter(([, s]) => s !== 200)).toEqual([]);

			const nodes = await jsonLdNodes(page);
			const col = nodes.find((n) => n['@type'] === 'CollectionPage');
			expect(col?.url).toBe(`${ORIGIN}${url}`);
			expect(col.mainEntity.numberOfItems).toBe(43);
			expect(col.mainEntity.itemListElement.map((i: { url: string }) => i.url)).toEqual(
				hrefs.map((h) => `${ORIGIN}${h}`)
			);
			const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
			expect(bc.itemListElement.map((i: { name: string }) => i.name)).toEqual([
				t.home,
				t.comarques
			]);
			const crumb = page.getByRole('navigation', { name: t.breadcrumb });
			await expect(crumb.getByRole('listitem')).toHaveText([t.home, t.comarques]);
			await expect(crumb.locator('[aria-current="page"]')).toHaveText(t.comarques);
		});
	});
}

// ── Pàgines de comarca (mostra) ─────────────────────────────────────────────────────────────

for (const slug of MOSTRA) {
	for (const locale of LOCALES) {
		const url = comarcaUrl(slug, locale);
		const t = T[locale];
		const co = comarca(slug);
		const cims = cimsDe(slug);
		const ambCoords = cims.filter((c) => c.lat !== null && c.lon !== null);

		test.describe(`Comarca ${url}`, () => {
			test.beforeEach(async ({ page }) => stubMaps(page));

			test('200, H1, recompte, llistes i breadcrumb', async ({ page }) => {
				const res = await page.goto(url);
				expect(res?.status()).toBe(200);
				await expect(page.locator('html')).toHaveAttribute('lang', locale);
				const h1 = page.getByRole('heading', { level: 1 });
				await expect(h1).toHaveCount(1);
				await expect(h1).toContainText(co.nom);
				expect((await page.title()).length).toBeLessThanOrEqual(60);
				// Contingut prim (`src/lib/seo/indexabilitat.ts`): indexable només amb ≥ 3 cims
				if (cims.length >= 3) {
					await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
					await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
						'href',
						`${ORIGIN}${url}`
					);
				} else {
					await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
					await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
				}

				// Llistes: exactament els cims de la comarca, de més alt a més baix (essencials primer)
				const hrefs = await hrefsLlistes(page, locale);
				const essencials = cims.filter((c) => c.essencial);
				const altres = cims.filter((c) => !c.essencial);
				expect(hrefs).toEqual([...essencials, ...altres].map((c) => fitxaUrl(c.slug, locale)));

				// El resum "N cims · N essencials" (o "1 cim · 1 essencial")
				await expect(page.locator('main .sub')).toContainText(
					cims.length === 1 ? /\b1 (cim|cima)\b/ : new RegExp(`\\b${cims.length} (cims|cimas)\\b`)
				);

				const crumb = page.getByRole('navigation', { name: t.breadcrumb });
				await expect(crumb.getByRole('listitem')).toHaveText([t.home, t.comarques, co.nom]);
				await expect(crumb.getByRole('link', { name: t.home, exact: true })).toHaveAttribute(
					'href',
					`/${locale}`
				);
				await expect(crumb.getByRole('link', { name: t.comarques, exact: true })).toHaveAttribute(
					'href',
					comarquesUrl(locale)
				);
				await expect(crumb.locator('[aria-current="page"]')).toHaveText(co.nom);
			});

			test('mapa: un marcador per cim amb coordenades, amb nom i enllaç a la fitxa', async ({
				page,
				request
			}) => {
				await page.goto(url);
				const img = page.locator('main figure img');
				await expect(img).toHaveCount(1);
				await expect(img).toHaveAttribute('alt', /\S/);
				const ign = co.zona === 'catalunya-nord';
				await expect(img).toHaveAttribute(
					'src',
					ign ? /^https:\/\/data\.geopf\.fr\/wms-r\/wms\?/ : /^https:\/\/geoserveis\.icgc\.cat\//
				);
				const atribucio = page.locator('main figure figcaption a');
				await expect(atribucio).toContainText(ign ? t.attrIgn : t.attrIcgc);
				await expect(atribucio).toHaveAttribute('target', '_blank');
				await expect(atribucio).toHaveAttribute('rel', /noopener/);

				const ms = markers(page, locale);
				await expect(ms).toHaveCount(ambCoords.length);
				const info = await ms.evaluateAll((as) =>
					as.map((a) => ({
						href: a.getAttribute('href')!,
						label: a.getAttribute('aria-label')!,
						num: a.textContent!.trim().match(/^\d+/)?.[0]
					}))
				);
				// Mateix ordre i número que la llista (de més alt a més baix)
				expect(info.map((i) => i.href)).toEqual(ambCoords.map((c) => fitxaUrl(c.slug, locale)));
				expect(info.map((i) => i.label)).toEqual(
					ambCoords.map((c) => `${c.nom}, ${alt(c.altitud)} m`)
				);
				expect(info.map((i) => i.num)).toEqual(ambCoords.map((_, i) => String(i + 1)));
				for (const { href } of info) expect((await request.get(href)).status(), href).toBe(200);

				// Els marcadors cauen dins la imatge
				const box = (await page.locator('main figure .map-img').boundingBox())!;
				for (const b of await ms.evaluateAll((as) =>
					as.map((a) => {
						const r = a.getBoundingClientRect();
						return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
					})
				)) {
					expect(b.x).toBeGreaterThanOrEqual(box.x);
					expect(b.x).toBeLessThanOrEqual(box.x + box.width);
					expect(b.y).toBeGreaterThanOrEqual(box.y);
					expect(b.y).toBeLessThanOrEqual(box.y + box.height);
				}
			});

			test('JSON-LD vàlid: CollectionPage de la comarca, ItemList i BreadcrumbList', async ({
				page
			}) => {
				await page.goto(url);
				const nodes = await jsonLdNodes(page);
				const col = nodes.find((n) => n['@type'] === 'CollectionPage');
				expect(col, 'CollectionPage').toBeTruthy();
				expect(col.url).toBe(`${ORIGIN}${url}`);
				expect(col.inLanguage).toBe(locale);
				expect(col.about?.name).toBe(co.nom);
				expect(col.about?.url).toBe(`${ORIGIN}${url}`);
				expect(col.mainEntity.numberOfItems).toBe(cims.length);
				expect(col.mainEntity.itemListElement.map((i: { url: string }) => i.url).sort()).toEqual(
					cims.map((c) => `${ORIGIN}${fitxaUrl(c.slug, locale)}`).sort()
				);
				const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
				expect(bc.itemListElement.map((i: { name: string }) => i.name)).toEqual([
					t.home,
					t.comarques,
					co.nom
				]);
				expect(bc.itemListElement[1].item).toBe(`${ORIGIN}${comarquesUrl(locale)}`);
				expect(JSON.stringify(nodes)).not.toMatch(/FEEC|feec\.cat/);
			});

			test('les comarques properes responen 200', async ({ page, request }) => {
				await page.goto(url);
				const links = page.getByRole('region', { name: t.nearby }).getByRole('link');
				const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
				expect(hrefs.length).toBeGreaterThan(0);
				expect(hrefs).not.toContain(url);
				for (const h of hrefs) expect((await request.get(h)).status(), h).toBe(200);
			});
		});
	}
}

test.describe('Comarca: marcadors (navegació)', () => {
	test.beforeEach(async ({ page }) => stubMaps(page));

	test('cada marcador del Berguedà obre la seva fitxa', async ({ page }) => {
		const cims = cimsDe('bergueda');
		for (const [i, c] of cims.entries()) {
			await gotoHydrated(page, comarcaUrl('bergueda', 'ca'));
			await markers(page, 'ca').nth(i).click();
			await expect(page).toHaveURL(fitxaUrl(c.slug, 'ca'));
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.nom);
		}
	});

	// Cims molt junts (Pica d'Estats / Pic de Sotllo, a uns 500 m): cap marcador pot quedar tapat.
	for (const slug of ['pallars-sobira', 'val-d-aran', 'andorra', 'alta-ribagorca'] as const) {
		test(`cap marcador de ${slug} queda tapat per un altre (es pot clicar)`, async ({ page }) => {
			await page.goto(comarcaUrl(slug, 'ca'));
			await page.locator('main figure').scrollIntoViewIfNeeded();
			await page.mouse.move(0, 0);
			const tapats = await markers(page, 'ca').evaluateAll((as) =>
				as.flatMap((a) => {
					const r = a.getBoundingClientRect();
					const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
					const guanya = hit?.closest('a');
					return guanya === a
						? []
						: [`${a.getAttribute('aria-label')} tapat per ${guanya?.getAttribute('aria-label')}`];
				})
			);
			expect(tapats).toEqual([]);
		});
	}

	test('marcadors accessibles amb el teclat: ordre de la llista, etiqueta visible i Enter', async ({
		page,
		browserName
	}) => {
		test.skip(
			browserName === 'webkit',
			'WebKit (Safari) no enfoca enllaços amb Tab per defecte (preferència del sistema)'
		);
		const cims = cimsDe('val-d-aran');
		await gotoHydrated(page, comarcaUrl('val-d-aran', 'ca'));
		const ms = markers(page, 'ca');
		// Tab fins al primer marcador
		for (let i = 0; i < 80; i++) {
			await page.keyboard.press('Tab');
			if (await ms.first().evaluate((a) => a === document.activeElement)) break;
		}
		for (const [i, c] of cims.entries()) {
			if (i > 0) await page.keyboard.press('Tab');
			const m = ms.nth(i);
			await expect(m).toBeFocused();
			await expect(m).toHaveAccessibleName(`${c.nom}, ${alt(c.altitud)} m`);
			// L'etiqueta amb el nom es fa visible en enfocar-lo
			await expect
				.poll(() => m.locator('.etiqueta').evaluate((e) => getComputedStyle(e).opacity))
				.toBe('1');
			await expect(m.locator('.etiqueta')).toBeInViewport();
		}
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(fitxaUrl(cims.at(-1)!.slug, 'ca'));
	});
});

test.describe('Comarca: 404', () => {
	for (const url of [
		'/ca/comarques/segarra',
		'/es/comarcas/segarra',
		'/ca/comarques/no-existeix',
		'/es/comarcas/Bergueda'
	]) {
		test(`${url} → 404 real`, async ({ page, request, consoleGuard }) => {
			consoleGuard.allow(/Failed to load resource.*404/);
			expect((await request.get(url)).status()).toBe(404);
			const res = await page.goto(url);
			expect(res?.status()).toBe(404);
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
			await expect(
				page.locator('script[type="application/ld+json"]', { hasText: 'CollectionPage' })
			).toHaveCount(0);
		});
	}
});

test.describe('Comarques: sitemap', () => {
	for (const [locale, nom] of [
		['ca', 'comarques'],
		['es', 'comarcas']
	] as const) {
		test(`sitemap-${locale}-${nom}.xml: índex + comarques amb ≥ 3 cims`, async ({ request }) => {
			const res = await request.get(`/sitemap-${locale}-${nom}.xml`);
			expect(res.status()).toBe(200);
			const locs = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
			const indexables = COMARQUES_AMB_CIMS.filter((c) => cimsDe(c.slug).length >= 3);
			expect(locs.sort()).toEqual(
				[
					`${ORIGIN}${comarquesUrl(locale)}`,
					...indexables.map((c) => `${ORIGIN}${comarcaUrl(c.slug, locale)}`)
				].sort()
			);
			expect(locs.some((l) => l.endsWith('/segarra'))).toBe(false);
		});
	}
});

test.describe('Comarca: idioma', () => {
	test('ca ⇄ es manté la pàgina de comarca', async ({ page }) => {
		await gotoHydrated(page, comarcaUrl('val-d-aran', 'ca'));
		await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
		await expect(page).toHaveURL(comarcaUrl('val-d-aran', 'es'));
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		await page.getByRole('banner').getByRole('link', { name: 'Català' }).click();
		await expect(page).toHaveURL(comarcaUrl('val-d-aran', 'ca'));
	});

	test('índex ca ⇄ es', async ({ page }) => {
		await gotoHydrated(page, comarquesUrl('ca'));
		await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
		await expect(page).toHaveURL(comarquesUrl('es'));
	});
});

// ── axe ─────────────────────────────────────────────────────────────────────────────────────

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`Comarques: axe · ${colorScheme}`, () => {
		test.use({ colorScheme });
		test.beforeEach(async ({ page }) => stubMaps(page));

		const urls = [
			comarquesUrl('ca'),
			comarquesUrl('es'),
			...['bergueda', 'catalunya-nord', 'garraf'].flatMap((s) =>
				LOCALES.map((l) => comarcaUrl(s, l))
			)
		];
		for (const url of urls) {
			test(`${url} sense violacions WCAG 2.2 AA`, async ({ page }) => {
				await gotoHydrated(page, url);
				await expectNoAxeViolations(page);
			});
		}

		test('marcador enfocat (etiqueta visible) sense violacions', async ({ page }) => {
			await gotoHydrated(page, comarcaUrl('pallars-sobira', 'ca'));
			await markers(page, 'ca').first().focus();
			await expectNoAxeViolations(page);
		});
	});
}

// ── Reflow: les 43 × 2 pàgines de comarca a 320 px ─────────────────────────────────────────

test('cap pàgina de comarca (43 × ca/es) ni l’índex desborda a 320 px', async ({
	page
}, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chrome', 'Una sola passada n’hi ha prou');
	test.setTimeout(240_000);
	await stubMaps(page);
	await page.setViewportSize({ width: 320, height: 640 });
	const urls = [
		...LOCALES.map(comarquesUrl),
		...COMARQUES_AMB_CIMS.flatMap((c) => LOCALES.map((l) => comarcaUrl(c.slug, l)))
	];
	expect(urls).toHaveLength(88);
	const desborden: string[] = [];
	const tapats: string[] = [];
	const etiquetesFora: string[] = [];
	for (const url of urls) {
		await page.goto(url, { waitUntil: 'load' });
		await page.evaluate(() => document.fonts.ready);
		const { px, culprit } = await overflowX(page);
		if (px > 0) desborden.push(`${url} (+${px} px, ${culprit})`);
		// A 320 px el mapa és petit: marcadors que en tapen d'altres (no es poden clicar)
		const fig = page.locator('main figure');
		if ((await fig.count()) > 0) {
			await fig.scrollIntoViewIfNeeded();
			const t = await page.evaluate(() =>
				[...document.querySelectorAll<HTMLAnchorElement>('main figure li a')].flatMap((a) => {
					const r = a.getBoundingClientRect();
					const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
					return hit?.closest('a') === a ? [] : [a.getAttribute('aria-label')];
				})
			);
			if (t.length) tapats.push(`${url}: ${t.join(' | ')}`);
			// Les etiquetes dels marcadors (visibles en passar-hi o enfocar-los) no surten de la pantalla
			const fora = await page.evaluate(() =>
				[...document.querySelectorAll<HTMLElement>('main figure li a .etiqueta')].flatMap((e) => {
					const r = e.getBoundingClientRect();
					return r.left < 0 || r.right > document.documentElement.clientWidth
						? [`${e.textContent} (${Math.round(r.left)}…${Math.round(r.right)})`]
						: [];
				})
			);
			if (fora.length) etiquetesFora.push(`${url}: ${fora.join(' | ')}`);
		}
	}
	expect(desborden, 'pàgines amb scroll horitzontal a 320 px').toEqual([]);
	expect.soft(tapats, 'marcadors tapats per un altre a 320 px').toEqual([]);
	expect.soft(etiquetesFora, 'etiquetes de marcador fora de la pantalla a 320 px').toEqual([]);
});
