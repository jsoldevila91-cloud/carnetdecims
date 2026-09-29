import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated, settleAnimations } from './fixtures';

/**
 * Fitxa de cim (bloc 3a): /ca/cims/{slug} i /es/cimas/{slug}.
 * Mostra representativa: Catalunya (ICGC), Andorra (ICGC), Catalunya Nord (Plan IGN),
 * les dues restriccions d'accés (fauna amb període anual i obres sense data de fi) i Lo Tormo
 * (vèrtex ICGC). Les dades esperades es llegeixen de `cims.json` (font única, sense duplicar-les).
 */

type Locale = 'ca' | 'es';
interface Cim {
	slug: string;
	nom: string;
	altitud: number;
	lat: number | null;
	lon: number | null;
	comarca: string;
	zona: 'catalunya' | 'andorra' | 'catalunya-nord';
	essencial: boolean;
	estat_revisio: string;
	restriccions: { tipus: string }[];
}
interface Comarca {
	slug: string;
	nom: string;
}

const readJson = <T>(file: string): T =>
	JSON.parse(readFileSync(new URL(`../src/lib/data/catalog/${file}`, import.meta.url), 'utf8'));
const CIMS = readJson<Cim[]>('cims.json');
const COMARQUES = readJson<Comarca[]>('comarques.json');

const cim = (slug: string) => {
	const c = CIMS.find((x) => x.slug === slug);
	if (!c) throw new Error(`El cim ${slug} no és al catàleg`);
	return c;
};
const comarcaNom = (c: Cim) => COMARQUES.find((x) => x.slug === c.comarca)!.nom;
const fitxaUrl = (slug: string, locale: Locale) =>
	locale === 'ca' ? `/ca/cims/${slug}` : `/es/cimas/${slug}`;
/** Mateix format que `formatAltitude`: 2506 → "2.506". */
const alt = (m: number) => String(Math.round(m)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const MOSTRA = [
	'pedraforca-pollego-superior',
	'pica-d-estats',
	'canigo',
	'comapedrosa',
	'la-picossa',
	'sant-salvador-de-les-espases',
	'lo-tormo'
] as const;
const LOCALES: Locale[] = ['ca', 'es'];

const T = {
	ca: {
		breadcrumb: 'Ruta de navegació',
		home: 'Inici',
		comarques: 'Comarques',
		altitude: 'Altitud',
		comarca: 'Comarca',
		essential: 'Essencial',
		stamp: 'Cim essencial',
		register: 'Registrar aquest cim',
		wikiloc: 'Veure rutes a Wikiloc',
		nearby: 'Cims a prop',
		restrictions: "Restriccions d'accés",
		activeToday: 'Vigent avui',
		fauna: 'Protecció de la fauna',
		faunaPeriod: 'Cada any: 15 de gener – 15 de juny',
		obres: 'Obres',
		permanent: 'Sense data de fi coneguda',
		attrIcgc: 'Mapa topogràfic © ICGC',
		attrIgn: 'Mapa topogràfic © IGN France (Plan IGN)',
		lang: 'Català'
	},
	es: {
		breadcrumb: 'Ruta de navegación',
		home: 'Inicio',
		comarques: 'Comarcas',
		altitude: 'Altitud',
		comarca: 'Comarca',
		essential: 'Esencial',
		stamp: 'Cima esencial',
		register: 'Registrar esta cima',
		wikiloc: 'Ver rutas en Wikiloc',
		nearby: 'Cimas cercanas',
		restrictions: 'Restricciones de acceso',
		activeToday: 'Vigente hoy',
		fauna: 'Protección de la fauna',
		faunaPeriod: 'Cada año: 15 de enero – 15 de junio',
		obres: 'Obras',
		permanent: 'Sin fecha de fin conocida',
		attrIcgc: 'Mapa topográfico © ICGC',
		attrIgn: 'Mapa topográfico © IGN France (Plan IGN)',
		lang: 'Español'
	}
} as const;

/** PNG transparent 1×1: els mapes WMS externs no fan dependre els E2E de la xarxa. */
const PNG_1PX = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);
async function stubMaps(page: Page) {
	await page.route(/geoserveis\.icgc\.cat|data\.geopf\.fr/, (route) =>
		route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1PX })
	);
}

const dd = (page: Page, dt: string) => page.locator('main dl dt', { hasText: dt }).locator('+ dd');

// ---------------------------------------------------------------------------------------------

for (const slug of MOSTRA) {
	for (const locale of LOCALES) {
		const url = fitxaUrl(slug, locale);
		const t = T[locale];

		test.describe(`Fitxa ${url}`, () => {
			test.beforeEach(async ({ page }) => stubMaps(page));

			test('200, capçalera, dades, segell i SEO', async ({ page }) => {
				const c = cim(slug);
				const res = await page.goto(url);
				expect(res?.status()).toBe(200);
				await expect(page.locator('html')).toHaveAttribute('lang', locale);

				await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.nom);
				await expect(dd(page, t.altitude)).toHaveText(`${alt(c.altitud)} m`);
				await expect(dd(page, t.comarca)).toHaveText(comarcaNom(c));
				await expect(page.locator('main .sub')).toContainText(
					`${alt(c.altitud)} m · ${comarcaNom(c)}`
				);

				if (c.essencial) {
					await expect(page.locator('main dd.essential')).toHaveText(t.essential);
					const segell = page.locator('main .stamp svg.segell');
					await expect(segell).toBeVisible();
					// El text del segell va en majúscules per CSS
					await expect(segell).toContainText(t.stamp, { ignoreCase: true });
					await expect(segell).toContainText(alt(c.altitud));
				}

				// <title> ≤ 60 i sense canonical mentre la fitxa no estigui revisada (docs/02 §6)
				expect((await page.title()).length).toBeLessThanOrEqual(60);
				if (c.estat_revisio !== 'revisat') {
					await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
					await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
					await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
				} else {
					await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
					await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
						'href',
						`https://carnetdecims.cat${url}`
					);
				}
			});

			test('JSON-LD Mountain amb les coordenades del catàleg i breadcrumb', async ({ page }) => {
				const c = cim(slug);
				await page.goto(url);
				const blocs = await page.locator('script[type="application/ld+json"]').allTextContents();
				expect(blocs.length).toBeGreaterThan(0);
				const nodes = blocs
					.map((b) => JSON.parse(b)) // falla si no és JSON vàlid
					.flatMap((j) => j['@graph'] ?? [j]);

				const mountain = nodes.find((n) => n['@type'] === 'Mountain');
				expect(mountain, 'node Mountain').toBeTruthy();
				expect(mountain.name).toBe(c.nom);
				expect(mountain.geo).toMatchObject({
					'@type': 'GeoCoordinates',
					latitude: c.lat,
					longitude: c.lon,
					elevation: c.altitud
				});
				expect(mountain.containedInPlace?.name).toBe(comarcaNom(c));
				expect(JSON.stringify(nodes)).not.toMatch(/FEEC|feec\.cat/);

				// Bloc 3b: Inici › Comarques › {comarca} › {cim}
				const comarquesUrl = locale === 'ca' ? '/ca/comarques' : '/es/comarcas';
				const comarcaUrl = `${comarquesUrl}/${c.comarca}`;
				const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
				expect(bc.itemListElement.map((i: { name: string }) => i.name)).toEqual([
					t.home,
					t.comarques,
					comarcaNom(c),
					c.nom
				]);
				expect(bc.itemListElement[1].item).toBe(`https://carnetdecims.cat${comarquesUrl}`);
				expect(bc.itemListElement[2].item).toBe(`https://carnetdecims.cat${comarcaUrl}`);
				expect(mountain.containedInPlace?.url).toBe(`https://carnetdecims.cat${comarcaUrl}`);

				// Breadcrumb visible (mateixos noms i ordre que el JSON-LD)
				const crumb = page.getByRole('navigation', { name: t.breadcrumb });
				await expect(crumb.getByRole('listitem')).toHaveText([
					t.home,
					t.comarques,
					comarcaNom(c),
					c.nom
				]);
				await expect(crumb.getByRole('link', { name: t.home, exact: true })).toHaveAttribute(
					'href',
					`/${locale}`
				);
				await expect(crumb.getByRole('link', { name: t.comarques, exact: true })).toHaveAttribute(
					'href',
					comarquesUrl
				);
				await expect(crumb.getByRole('link', { name: comarcaNom(c), exact: true })).toHaveAttribute(
					'href',
					comarcaUrl
				);
				// La comarca de la llista de dades també enllaça a la seva pàgina
				await expect(dd(page, t.comarca).getByRole('link')).toHaveAttribute('href', comarcaUrl);
				await expect(crumb.locator('[aria-current="page"]')).toHaveText(c.nom);
			});

			test('mapa amb alt i atribució, CTA de registre i Wikiloc extern', async ({ page }) => {
				const c = cim(slug);
				await page.goto(url);

				const img = page.locator('main figure img');
				await expect(img).toHaveCount(1);
				// L'alt contrau l'article ("de la Picossa", "del Tormo"): es compara sense article
				const senseArticle = c.nom.replace(/^(La|Lo|El|Els|Les|Los|L')\s?/, '');
				await expect(img).toHaveAttribute('alt', new RegExp(senseArticle.replace(/'/g, '.')));
				await expect(img).toHaveAttribute('alt', new RegExp(`\\(${alt(c.altitud)} m\\)`));
				const ign = c.zona === 'catalunya-nord';
				await expect(img).toHaveAttribute(
					'src',
					ign ? /^https:\/\/data\.geopf\.fr\/wms-r\/wms\?/ : /^https:\/\/geoserveis\.icgc\.cat\//
				);
				const atribucio = page.locator('main figure figcaption a');
				await expect(atribucio).toContainText(ign ? t.attrIgn : t.attrIcgc);
				await expect(atribucio).toHaveAttribute('target', '_blank');
				await expect(atribucio).toHaveAttribute('rel', /noopener/);

				await expect(page.getByRole('link', { name: t.register })).toHaveAttribute(
					'href',
					`/${locale}/app/registrar?cim=${slug}`
				);

				const wl = page.getByRole('link', { name: new RegExp(t.wikiloc) });
				await expect(wl).toHaveAttribute('href', new RegExp(`^https://${locale}\\.wikiloc\\.com/`));
				await expect(wl).toHaveAttribute('target', '_blank');
				await expect(wl).toHaveAttribute('rel', /\bnofollow\b/);
				await expect(wl).toHaveAttribute('rel', /\bnoopener\b/);
				// La caixa sw/ne conté el cim
				const href = new URL((await wl.getAttribute('href'))!);
				const [s, w] = href.searchParams.get('sw')!.split(',').map(Number);
				const [n, e] = href.searchParams.get('ne')!.split(',').map(Number);
				expect(c.lat!).toBeGreaterThan(s);
				expect(c.lat!).toBeLessThan(n);
				expect(c.lon!).toBeGreaterThan(w);
				expect(c.lon!).toBeLessThan(e);
			});

			test('enllaços "a prop" i "mateixa comarca" responen 200 i porten a fitxes', async ({
				page,
				request
			}) => {
				await page.goto(url);
				const nearby = page.getByRole('region', { name: t.nearby });
				await expect(nearby.getByRole('link')).not.toHaveCount(0);
				const hrefs = [
					...(await nearby
						.getByRole('link')
						.evaluateAll((as) => as.map((a) => a.getAttribute('href')))),
					...(await page
						.locator('section[aria-labelledby="comarca"] a')
						.evaluateAll((as) => as.map((a) => a.getAttribute('href'))))
				] as string[];
				const prefix = locale === 'ca' ? '/ca/cims/' : '/es/cimas/';
				for (const h of hrefs) {
					expect(h.startsWith(prefix), `${h} és una fitxa en ${locale}`).toBe(true);
					expect(h).not.toBe(url);
					expect((await request.get(h)).status(), h).toBe(200);
				}
				expect(new Set(hrefs.slice(0, 6)).size, 'sense repetits a "a prop"').toBe(
					Math.min(6, hrefs.length)
				);
			});
		});
	}
}

test.describe('Fitxa: navegació', () => {
	test.beforeEach(async ({ page }) => stubMaps(page));

	test('clicar un cim proper i un de la comarca obre la seva fitxa', async ({ page }) => {
		await gotoHydrated(page, fitxaUrl('pedraforca-pollego-superior', 'ca'));
		const primer = page.getByRole('region', { name: 'Cims a prop' }).getByRole('link').first();
		const desti = (await primer.getAttribute('href'))!;
		await primer.click();
		await expect(page).toHaveURL(desti);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			cim(desti.split('/').pop()!).nom
		);

		const comarca = page.locator('section[aria-labelledby="comarca"] a').first();
		const desti2 = (await comarca.getAttribute('href'))!;
		await comarca.click();
		await expect(page).toHaveURL(desti2);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			cim(desti2.split('/').pop()!).nom
		);
	});

	// Bloc 3b: l'enllaç "Tots els cims del…" porta a la pàgina de comarca (abans, /cims#comarca-…)
	for (const [locale, text, desti] of [
		['ca', 'Tots els cims del Berguedà', '/ca/comarques/bergueda'],
		['es', 'Todas las cimas del Berguedà', '/es/comarcas/bergueda']
	] as const) {
		test(`"${text}" porta a la pàgina de la comarca`, async ({ page }) => {
			await gotoHydrated(page, fitxaUrl('pedraforca-pollego-superior', locale));
			const link = page.getByRole('link', { name: text });
			await expect(link).toHaveAttribute('href', desti);
			await link.click();
			await expect(page).toHaveURL(desti);
			await expect(page.getByRole('heading', { level: 1 })).toContainText('Berguedà');
		});
	}

	test('el breadcrumb porta a la comarca i la comarca enllaça la fitxa', async ({ page }) => {
		await gotoHydrated(page, fitxaUrl('canigo', 'es'));
		await page
			.getByRole('navigation', { name: 'Ruta de navegación' })
			.getByRole('link', { name: 'Catalunya Nord', exact: true })
			.click();
		await expect(page).toHaveURL('/es/comarcas/catalunya-nord');
		// Enllaç de la llista (els marcadors del mapa es proven a comarques.e2e.ts)
		await page
			.locator('main section[aria-labelledby="essencials"]')
			.getByRole('link', { name: /^Canigó/ })
			.click();
		await expect(page).toHaveURL('/es/cimas/canigo');
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Canigó');
		await page
			.getByRole('navigation', { name: 'Ruta de navegación' })
			.getByRole('link', { name: 'Comarcas', exact: true })
			.click();
		await expect(page).toHaveURL('/es/comarcas');
	});

	for (const slug of ['pica-d-estats', 'la-picossa'] as const) {
		test(`idioma ca ⇄ es manté la fitxa ${slug}`, async ({ page }) => {
			const c = cim(slug);
			await gotoHydrated(page, fitxaUrl(slug, 'ca'));
			await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
			await expect(page).toHaveURL(fitxaUrl(slug, 'es'));
			await expect(page.locator('html')).toHaveAttribute('lang', 'es');
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.nom);
			await expect(page.getByRole('link', { name: 'Registrar esta cima' })).toBeVisible();

			await page.getByRole('banner').getByRole('link', { name: 'Català' }).click();
			await expect(page).toHaveURL(fitxaUrl(slug, 'ca'));
			await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.nom);
		});
	}

	test('el CTA de registre porta a /app/registrar amb el cim', async ({ page }) => {
		await gotoHydrated(page, fitxaUrl('lo-tormo', 'ca'));
		await page.getByRole('link', { name: 'Registrar aquest cim' }).click();
		await expect(page).toHaveURL('/ca/app/registrar?cim=lo-tormo');
	});
});

test.describe('Fitxa: 404', () => {
	for (const url of [
		'/ca/cims/no-existeix-aquest-cim',
		'/es/cimas/no-existe-esta-cima',
		'/es/cimas/Pedraforca'
	]) {
		test(`${url} → 404 real`, async ({ page, request, consoleGuard }) => {
			consoleGuard.allow(/Failed to load resource.*404/);
			expect((await request.get(url)).status()).toBe(404);
			const res = await page.goto(url);
			expect(res?.status()).toBe(404);
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
			await expect(
				page.locator('script[type="application/ld+json"]', { hasText: 'Mountain' })
			).toHaveCount(0);
		});
	}
});

test.describe('Fitxa: restriccions d’accés', () => {
	test.beforeEach(async ({ page }) => stubMaps(page));

	for (const locale of LOCALES) {
		const t = T[locale];

		test(`La Picossa (${locale}): fauna, període anual i font externa`, async ({ page }) => {
			await page.goto(fitxaUrl('la-picossa', locale));
			const region = page.getByRole('region', { name: t.restrictions });
			await expect(region).toBeVisible();
			await expect(region).toContainText(t.fauna);
			await expect(region).toContainText(t.faunaPeriod);
			const font = region.getByRole('link').first();
			await expect(font).toHaveAttribute('target', '_blank');
			await expect(font).toHaveAttribute('rel', /noopener/);
		});

		test(`Sant Salvador de les Espases (${locale}): obres sense data de fi, sempre vigent`, async ({
			page
		}) => {
			await page.clock.setFixedTime(new Date('2026-09-28T12:00:00+02:00'));
			await gotoHydrated(page, fitxaUrl('sant-salvador-de-les-espases', locale));
			const region = page.getByRole('region', { name: t.restrictions });
			await expect(region).toContainText(t.obres);
			await expect(region).toContainText(t.permanent);
			await expect(region.getByText(t.activeToday)).toBeVisible();
		});
	}

	test('els cims sense restriccions no mostren el bloc', async ({ page }) => {
		await page.goto(fitxaUrl('pedraforca-pollego-superior', 'ca'));
		await expect(page.getByRole('region', { name: "Restriccions d'accés" })).toHaveCount(0);
	});

	// "Vigent avui" es calcula al client amb la data local d'Europe/Madrid (límits inclosos).
	const casos = [
		{ ara: '2027-03-01T10:00:00+01:00', vigent: true, nom: 'dins el període' },
		{ ara: '2026-09-28T12:00:00+02:00', vigent: false, nom: 'fora del període' },
		{ ara: '2027-01-15T00:30:00+01:00', vigent: true, nom: 'primer dia (00:30 local)' },
		{ ara: '2027-01-14T23:30:00+01:00', vigent: false, nom: 'la vigília (23:30 local)' },
		{ ara: '2027-06-15T23:30:00+02:00', vigent: true, nom: 'últim dia (23:30 local)' },
		// 00:30 del 16/06 a Madrid encara és 15/06 en UTC: ha de comptar la data local
		{ ara: '2027-06-16T00:30:00+02:00', vigent: false, nom: "l'endemà (00:30 local, 15/06 UTC)" }
	];
	for (const { ara, vigent, nom } of casos) {
		test(`La Picossa · "Vigent avui" ${nom}: ${vigent ? 'sí' : 'no'}`, async ({ page }) => {
			await page.clock.setFixedTime(new Date(ara));
			await gotoHydrated(page, fitxaUrl('la-picossa', 'ca'));
			const item = page.getByRole('region', { name: "Restriccions d'accés" }).getByRole('listitem');
			if (vigent) {
				await expect(item.getByText('Vigent avui')).toBeVisible();
				await expect(item).toHaveClass(/activa/);
			} else {
				await expect(item.getByText('Vigent avui')).toHaveCount(0);
				await expect(item).not.toHaveClass(/activa/);
			}
		});
	}
});

// ---------------------------------------------------------------------------------------------

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`Fitxa: axe · ${colorScheme}`, () => {
		test.use({ colorScheme });
		test.beforeEach(async ({ page }) => stubMaps(page));

		for (const slug of MOSTRA) {
			for (const locale of LOCALES) {
				const url = fitxaUrl(slug, locale);
				test(`${url} sense violacions WCAG 2.2 AA`, async ({ page }) => {
					// Dins el període de La Picossa: també es comprova el contrast del distintiu "Vigent"
					await page.clock.setFixedTime(new Date('2027-03-01T10:00:00+01:00'));
					await gotoHydrated(page, url);
					await page.evaluate(() => document.fonts.ready);
					await settleAnimations(page);
					const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
					const summary = violations.map((v) => ({
						id: v.id,
						nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
					}));
					expect(summary, 'violacions axe').toEqual([]);
				});
			}
		}
	});
}

test.describe('Fitxa: reflow i objectius tàctils', () => {
	test.beforeEach(async ({ page }) => stubMaps(page));

	// Mostra + els noms llargs que desbordaven abans de d19e1da (H1 d'una sola paraula ampla).
	const REFLOW = [...MOSTRA, 'castellsapera', 'montcorbison', 'pic-de-comaloforno'] as const;

	test('sense scroll horitzontal a 320 px', async ({ page }) => {
		// 20 navegacions: amb 30 s i `networkidle` donava timeouts sota càrrega (tots els projectes en paral·lel)
		test.setTimeout(120_000);
		await page.setViewportSize({ width: 320, height: 640 });
		for (const slug of REFLOW) {
			for (const locale of LOCALES) {
				const url = fitxaUrl(slug, locale);
				await page.goto(url, { waitUntil: 'load' });
				await page.evaluate(() => document.fonts.ready);
				const { overflow, culprit } = await page.evaluate(() => {
					const vw = document.documentElement.clientWidth;
					const wide = [...document.querySelectorAll<HTMLElement>('main *')].find(
						(el) => el.getBoundingClientRect().right > vw + 0.5
					);
					return {
						overflow: document.documentElement.scrollWidth - vw,
						culprit: wide ? `${wide.tagName.toLowerCase()}.${wide.className}` : null
					};
				});
				expect
					.soft(overflow, `${url} desborda horitzontalment (${culprit})`)
					.toBeLessThanOrEqual(0);
			}
		}
	});

	// Criteri del projecte (docs/06): objectius tàctils còmodes. L'enllaç d'atribució del mapa
	// passa WCAG 2.5.8 per l'excepció d'espaiat (axe no el marca), però fa 15 px d'alt.
	test('els enllaços del contingut fan ≥ 24 px d’alt', async ({ page }) => {
		await page.goto(fitxaUrl('pedraforca-pollego-superior', 'ca'));
		const petits = await page
			.locator('main a')
			.evaluateAll((as) =>
				as
					.map((a) => ({ text: a.textContent?.trim(), h: a.getBoundingClientRect().height }))
					.filter((r) => r.h > 0 && r.h < 24)
			);
		expect(petits, 'enllaços per sota del mínim de 24 px (WCAG 2.5.8)').toEqual([]);
	});

	// Regressió (d19e1da): l'atribució del mapa feia 15 px d'alt; criteri del projecte ≥ 44 px.
	for (const slug of ['pedraforca-pollego-superior', 'canigo'] as const) {
		test(`l’enllaç d’atribució del mapa (${slug}) fa ≥ 44 px d’alt`, async ({ page }) => {
			await page.goto(fitxaUrl(slug, 'ca'));
			const box = await page.locator('main figure figcaption a').boundingBox();
			expect(box, 'enllaç d’atribució visible').not.toBeNull();
			expect(box!.height).toBeGreaterThanOrEqual(44);
		});
	}
});
