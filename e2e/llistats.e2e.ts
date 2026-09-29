import { test, expect, gotoHydrated, hrefsAbsoluts } from './fixtures';
import {
	CIMS,
	COMARQUES_AMB_CIMS,
	LOCALES,
	ORIGIN,
	alt,
	comarca,
	comarcaUrl,
	expectNoAxeViolations,
	fitxaUrl,
	jsonLdNodes,
	overflowX,
	perAltitudDesc,
	type Locale
} from './cataleg';

/**
 * Bloc 3b: llistats curats `/cims-essencials`, `/tresmils` i `/cims-mes-alts` (ca i es).
 * Els cims esperats es calculen del catàleg: tresmils = altitud ≥ 3000, més alts = top 25.
 */

const URLS = {
	essencials: { ca: '/ca/cims-essencials', es: '/es/cimas-esenciales' },
	tresmils: { ca: '/ca/tresmils', es: '/es/tresmiles' },
	'mes-alts': { ca: '/ca/cims-mes-alts', es: '/es/cimas-mas-altas' }
} as const;

const BREADCRUMB = { ca: 'Ruta de navegació', es: 'Ruta de navegación' } as const;
const HOME = { ca: 'Inici', es: 'Inicio' } as const;
const NOM_CURT = {
	essencials: { ca: 'Cims essencials', es: 'Cimas esenciales' },
	tresmils: { ca: 'Tresmils', es: 'Tresmiles' },
	'mes-alts': { ca: 'Cims més alts', es: 'Cimas más altas' }
} as const;

const TRESMILS = CIMS.filter((c) => c.altitud >= 3000).sort(perAltitudDesc);
const MES_ALTS = [...CIMS].sort(perAltitudDesc).slice(0, 25);

/** Fitxes enllaçades per la llista principal (sense la navegació "Explora"). */
const hrefsLlista = (page: import('@playwright/test').Page, locale: Locale) =>
	page.locator('main .llista a').evaluateAll(
		// `pathname` resolt: l'HTML prerenderitzat porta hrefs relatius (`../ca/cims/…`) fins que
		// la hidratació els reescriu; així el resultat no depèn del moment de la lectura.
		(as, p) =>
			as.map((a) => new URL((a as HTMLAnchorElement).href).pathname).filter((h) => h.startsWith(p)),
		locale === 'ca' ? '/ca/cims/' : '/es/cimas/'
	);

for (const locale of LOCALES) {
	test.describe(`Llistats (${locale})`, () => {
		test(`tresmils: exactament els ${TRESMILS.length} cims ≥ 3000 m, de més alt a més baix`, async ({
			page,
			request
		}) => {
			expect(TRESMILS).toHaveLength(5);
			const res = await page.goto(URLS.tresmils[locale]);
			expect(res?.status()).toBe(200);
			await expect(page.locator('html')).toHaveAttribute('lang', locale);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
			// Rànquing numerat (<ol>)
			await expect(page.locator('main ol.llista > li')).toHaveCount(TRESMILS.length);
			const hrefs = await hrefsLlista(page, locale);
			expect(hrefs).toEqual(TRESMILS.map((c) => fitxaUrl(c.slug, locale)));
			const items = page.locator('main ol.llista > li');
			for (const [i, c] of TRESMILS.entries()) {
				await expect(items.nth(i)).toContainText(c.nom);
				await expect(items.nth(i)).toContainText(`${alt(c.altitud)} m`);
				await expect(items.nth(i)).toContainText(comarca(c.comarca).nom);
			}
			// L'entradeta anomena el més alt
			await expect(page.locator('main .lede')).toContainText(`${alt(TRESMILS[0].altitud)} m`);
			for (const h of hrefs) expect((await request.get(h)).status(), h).toBe(200);
		});

		test('més alts: 25 cims en ordre descendent d’altitud', async ({ page }) => {
			const res = await page.goto(URLS['mes-alts'][locale]);
			expect(res?.status()).toBe(200);
			await expect(page.locator('main ol.llista > li')).toHaveCount(25);
			const hrefs = await hrefsLlista(page, locale);
			expect(hrefs).toEqual(MES_ALTS.map((c) => fitxaUrl(c.slug, locale)));
			// Les altituds visibles són no creixents
			const alts = await page
				.locator('main ol.llista > li .meta')
				.evaluateAll((els) =>
					els.map((e) => Number(e.textContent!.match(/([\d.]+) m/)![1].replace(/\./g, '')))
				);
			expect(alts).toEqual(MES_ALTS.map((c) => c.altitud));
			for (let i = 1; i < alts.length; i++) expect(alts[i]).toBeLessThanOrEqual(alts[i - 1]);
			// L'H1 porta el nombre del rànquing
			await expect(page.getByRole('heading', { level: 1 })).toContainText('25');
		});

		test('essencials: totes les essencials, agrupades per comarca (H2 enllaçat)', async ({
			page
		}) => {
			const essencials = CIMS.filter((c) => c.essencial);
			const res = await page.goto(URLS.essencials[locale]);
			expect(res?.status()).toBe(200);
			const hrefs = await hrefsLlista(page, locale);
			expect(hrefs).toHaveLength(essencials.length);
			expect(new Set(hrefs)).toEqual(new Set(essencials.map((c) => fitxaUrl(c.slug, locale))));
			const comarquesAmbEss = COMARQUES_AMB_CIMS.filter((co) =>
				essencials.some((c) => c.comarca === co.slug)
			);
			const h2 = page.locator('main h2');
			await expect(h2).toHaveCount(comarquesAmbEss.length);
			const h2Links = await hrefsAbsoluts(page.locator('main h2 a'));
			expect(h2Links).toEqual(comarquesAmbEss.map((c) => comarcaUrl(c.slug, locale)));
		});

		for (const id of ['essencials', 'tresmils', 'mes-alts'] as const) {
			test(`${id}: breadcrumb, JSON-LD i <title>`, async ({ page }) => {
				const url = URLS[id][locale];
				await page.goto(url);
				expect((await page.title()).length).toBeLessThanOrEqual(60);
				await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
					'href',
					`${ORIGIN}${url}`
				);
				const crumb = page.getByRole('navigation', { name: BREADCRUMB[locale] });
				await expect(crumb.getByRole('listitem')).toHaveText([HOME[locale], NOM_CURT[id][locale]]);

				const nodes = await jsonLdNodes(page);
				const col = nodes.find((n) => n['@type'] === 'CollectionPage');
				expect(col?.url).toBe(`${ORIGIN}${url}`);
				const hrefs = await hrefsLlista(page, locale);
				expect(col.mainEntity.numberOfItems).toBe(hrefs.length);
				expect(col.mainEntity.itemListElement.map((i: { url: string }) => i.url)).toEqual(
					hrefs.map((h) => `${ORIGIN}${h}`)
				);
				const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
				expect(bc.itemListElement.map((i: { name: string }) => i.name)).toEqual([
					HOME[locale],
					NOM_CURT[id][locale]
				]);
				expect(JSON.stringify(nodes)).not.toMatch(/FEEC|feec\.cat/);
			});
		}
	});
}

test('/cims enllaça els llistats i les comarques, i tots responen 200', async ({
	page,
	request
}) => {
	await page.goto('/ca/cims');
	// N'hi ha una altra amb el mateix nom al peu (SiteFooter): aquí, la del contingut
	const nav = page.locator('main').getByRole('navigation', { name: 'Explora els cims' });
	const hrefs = await nav
		.getByRole('link')
		// El HTML SSR pot dur camins relatius ("../ca/…"): es compara el camí resolt
		.evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
	expect(hrefs).toEqual([
		'/ca/comarques',
		'/ca/cims-essencials',
		'/ca/tresmils',
		'/ca/cims-mes-alts'
	]);
	for (const h of hrefs) expect((await request.get(h)).status(), h).toBe(200);
});

test('idioma ca ⇄ es manté el llistat', async ({ page }) => {
	await gotoHydrated(page, URLS.tresmils.ca);
	await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
	await expect(page).toHaveURL(URLS.tresmils.es);
	await page.getByRole('banner').getByRole('link', { name: 'Català' }).click();
	await expect(page).toHaveURL(URLS.tresmils.ca);
});

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`Llistats: axe · ${colorScheme}`, () => {
		test.use({ colorScheme });
		for (const url of Object.values(URLS).flatMap((u) => [u.ca, u.es])) {
			test(`${url} sense violacions WCAG 2.2 AA`, async ({ page }) => {
				await gotoHydrated(page, url);
				await expectNoAxeViolations(page);
			});
		}
	});
}

test('els llistats no desborden a 320 px', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 640 });
	for (const url of Object.values(URLS).flatMap((u) => [u.ca, u.es])) {
		await page.goto(url, { waitUntil: 'load' });
		await page.evaluate(() => document.fonts.ready);
		const { px, culprit } = await overflowX(page);
		expect.soft(px, `${url} desborda (${culprit})`).toBeLessThanOrEqual(0);
	}
});
