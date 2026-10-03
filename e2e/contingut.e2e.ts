import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated, expectHref, hrefsAbsoluts } from './fixtures';
import { CIMS, LOCALES, expectNoAxeViolations, fitxaUrl, jsonLdNodes, overflowX } from './cataleg';
import type { Locale } from './cataleg';
import { CONTINGUTS, type ClauPagina } from '../src/lib/content/index.ts';

/**
 * Bloc 3c: les 8 pàgines de contingut editorial (hub del repte, normativa, com validar, repte
 * infantil, metodologia, sobre el projecte, avís legal, privadesa) en ca i es, la portada
 * definitiva i el peu. Les dades esperades (H1, seccions, FAQ, data) surten dels mòduls de
 * `src/lib/content/`; les URL s'escriuen a mà perquè també són part del que es prova.
 */

const URLS: Record<ClauPagina, Record<Locale, string>> = {
	repte: { ca: '/ca/repte-100-cims', es: '/es/reto-100-cims' },
	normativa: { ca: '/ca/repte-100-cims/normativa', es: '/es/reto-100-cims/normativa' },
	comValidar: { ca: '/ca/repte-100-cims/com-validar', es: '/es/reto-100-cims/como-validar' },
	repteInfantil: {
		ca: '/ca/repte-100-cims/repte-infantil',
		es: '/es/reto-100-cims/reto-infantil'
	},
	metodologia: { ca: '/ca/metodologia', es: '/es/metodologia' },
	sobreElProjecte: { ca: '/ca/sobre-el-projecte', es: '/es/sobre-el-proyecto' },
	avisLegal: { ca: '/ca/avis-legal', es: '/es/aviso-legal' },
	privacitat: { ca: '/ca/privacitat', es: '/es/privacidad' }
};
const CLAUS = Object.keys(URLS) as ClauPagina[];

const MSG = {
	ca: JSON.parse(readFileSync('messages/ca.json', 'utf8')) as Record<string, string>,
	es: JSON.parse(readFileSync('messages/es.json', 'utf8')) as Record<string, string>
};
const altre = (l: Locale): Locale => (l === 'ca' ? 'es' : 'ca');

/**
 * Marcadors pendents admesos (inventari esperat). Buit: cap pàgina es pot publicar amb un
 * `[PENDENT: …]` / `[PENDIENTE: …]`. Si mai se n'admet un, afegiu-lo aquí amb la seva clau.
 */
const PENDENTS_ESPERATS: Partial<Record<ClauPagina, RegExp>> = {};

const indexNav = (page: Page, l: Locale) =>
	page.getByRole('navigation', { name: MSG[l].content_toc_label });

async function obreTotesLesFaq(page: Page) {
	await page
		.locator('main details')
		.evaluateAll((ds) => ds.forEach((d) => ((d as HTMLDetailsElement).open = true)));
}

for (const clau of CLAUS) {
	for (const l of LOCALES) {
		const url = URLS[clau][l];
		const pagina = CONTINGUTS[clau][l];
		const faq = pagina.faq ?? [];
		const entradesIndex = [...pagina.seccions.map((s) => s.id), ...(faq.length ? ['pc-faq'] : [])];

		test.describe(`Contingut ${url}`, () => {
			test('200, lang, un H1, data de revisió, JSON-LD i FAQ coherents', async ({ page }) => {
				const res = await page.goto(url);
				expect(res?.status()).toBe(200);
				await expect(page.locator('html')).toHaveAttribute('lang', l);
				const h1 = page.getByRole('heading', { level: 1 });
				await expect(h1).toHaveCount(1);
				await expect(h1).toHaveText(pagina.h1);

				// "Actualitzat el …" amb <time datetime> = data del contingut
				const time = page.locator(`main .updated time[datetime="${pagina.actualitzat}"]`);
				await expect(time).toHaveCount(1);
				await expect(time).toContainText(l === 'ca' ? 'Actualitzat el' : 'Actualizado el');

				// Un H2 per secció, amb l'id de l'àncora
				for (const s of pagina.seccions) {
					await expect(page.locator(`main section#${s.id} > h2`)).toHaveText(s.titol);
				}

				// FAQ visibles ⇔ FAQPage al JSON-LD, amb el mateix nombre de preguntes
				const details = page.locator('main section#pc-faq details');
				await expect(details).toHaveCount(faq.length);
				const nodes = await jsonLdNodes(page);
				const faqPage = nodes.filter((n) => n['@type'] === 'FAQPage');
				expect(faqPage, 'FAQPage només si hi ha FAQ visibles').toHaveLength(faq.length ? 1 : 0);
				if (faq.length) {
					expect(faqPage[0].mainEntity).toHaveLength(faq.length);
					const visibles = (await details.locator('summary').allTextContents()).map((t) =>
						t.trim()
					);
					expect(faqPage[0].mainEntity.map((q: { name: string }) => q.name)).toEqual(visibles);
				}
				// Cap id repetit al document (àncores i aria-labelledby inequívocs)
				const idsRepetits = await page.evaluate(() => {
					const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
					return ids.filter((id, i) => ids.indexOf(id) !== i);
				});
				expect(idsRepetits, 'ids repetits').toEqual([]);
				const webPage = nodes.find((n) => n['@type'] === 'WebPage' || n['@type'] === 'AboutPage');
				expect(webPage?.dateModified).toBe(pagina.actualitzat);
				expect(webPage?.inLanguage).toBe(l);
				const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
				expect(bc?.itemListElement?.length).toBeGreaterThanOrEqual(2);
			});

			test('índex de seccions: cada àncora porta a la secció, visible i com a punt de focus', async ({
				page
			}) => {
				await gotoHydrated(page, url);
				const nav = indexNav(page, l);
				if (entradesIndex.length < 3) {
					await expect(nav).toHaveCount(0);
					return;
				}
				// Al mòbil l'índex és plegable i surt tancat: s'obre des del seu summary.
				const plegable = nav.locator('details');
				if ((await plegable.getAttribute('open')) === null) {
					await nav.locator('summary').click();
					await expect(plegable).toHaveAttribute('open', '');
				}
				const links = nav.getByRole('link');
				await expect(links).toHaveCount(entradesIndex.length);
				expect(await hrefsAbsoluts(links)).toEqual(entradesIndex.map((id) => `#${id}`));
				for (const [i, id] of entradesIndex.entries()) {
					await links.nth(i).click();
					await expect(page).toHaveURL(new RegExp(`#${id}$`));
					const h2 = page.locator(`#${id} > h2`);
					await expect(h2).toBeInViewport();
					// El títol no queda tapat per la capçalera fixa: el punt central és seu.
					const tapat = await h2.evaluate((el) => {
						const r = el.getBoundingClientRect();
						const hit = document.elementFromPoint(r.left + 8, r.top + r.height / 2);
						return hit && !el.contains(hit) ? `${hit.tagName}.${hit.className}` : null;
					});
					expect(tapat, `#${id}: títol tapat`).toBeNull();
					// Tab després del clic: el focus continua des de la secció (punt de navegació).
					await page.keyboard.press('Tab');
					const posicio = await page.evaluate((sid) => {
						const s = document.getElementById(sid)!;
						const a = document.activeElement!;
						if (s.contains(a)) return 'dins';
						return s.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING
							? 'despres'
							: 'abans';
					}, id);
					expect(posicio, `Tab després de #${id}`).not.toBe('abans');
					if (i < entradesIndex.length - 1) await page.evaluate(() => window.scrollTo(0, 0));
				}
			});

			test('enllaços: interns localitzats i vius, externs amb rel i target', async ({
				page,
				request
			}) => {
				await gotoHydrated(page, url);
				const links = await page.locator('main a[href]').evaluateAll((as) =>
					as.map((a) => {
						// L'HTML prerenderitzat porta els interns relatius (`../es`) fins que la hidratació
						// els reescriu: es resolen per no dependre del moment de la lectura.
						const raw = a.getAttribute('href')!;
						const abs = new URL(raw, location.href);
						const intern =
							!raw.startsWith('#') && !/^[a-z]+:/i.test(raw) && abs.origin === location.origin;
						return {
							href: intern ? abs.pathname + abs.search + abs.hash : raw,
							rel: a.getAttribute('rel'),
							target: a.getAttribute('target'),
							text: (a.textContent ?? '').trim()
						};
					})
				);
				expect(links.length).toBeGreaterThan(0);
				const interns = new Set<string>();
				for (const a of links) {
					expect(a.href, 'cap destí perillós').not.toMatch(/^(javascript|data|vbscript):/i);
					if (a.href.startsWith('#')) {
						await expect(page.locator(a.href), `àncora ${a.href}`).toHaveCount(1);
					} else if (a.href.startsWith('/')) {
						expect(a.href, `intern localitzat (${a.text})`).toMatch(new RegExp(`^/${l}(/|$|#)`));
						interns.add(a.href.split('#')[0]);
					} else {
						expect(a.href, `extern https (${a.text})`).toMatch(/^https:\/\//);
						expect(a.rel?.split(/\s+/).sort(), `rel de ${a.href}`).toEqual([
							'external',
							'noopener'
						]);
						expect(a.target, `target de ${a.href}`).toBe('_blank');
						expect(a.text, `avís de pestanya nova a ${a.href}`).toContain(MSG[l].content_new_tab);
					}
				}
				for (const h of interns) {
					expect((await request.get(h)).status(), h).toBe(200);
				}
			});

			test('FAQ operables amb teclat', async ({ page }) => {
				test.skip(!faq.length, 'sense FAQ');
				await gotoHydrated(page, url);
				const summaries = page.locator('main section#pc-faq summary');
				for (const i of [0, faq.length - 1]) {
					const s = summaries.nth(i);
					const d = s.locator('xpath=..');
					await s.focus();
					await expect(s).toBeFocused();
					await expect(d).not.toHaveAttribute('open');
					await page.keyboard.press('Enter');
					await expect(d).toHaveAttribute('open', '');
					await expect(d.locator('.resposta')).toBeVisible();
					await page.keyboard.press('Space');
					await expect(d).not.toHaveAttribute('open');
				}
				// Tab recorre els summary en ordre
				await summaries.first().focus();
				await page.keyboard.press('Tab');
				await expect(summaries.nth(1)).toBeFocused();
			});

			test('el selector d’idioma porta a la pàgina equivalent', async ({ page }) => {
				await gotoHydrated(page, url);
				const o = altre(l);
				const enllac = page.locator(`header a[hreflang="${o}"]`).first();
				await expectHref(enllac, URLS[clau][o]);
				await enllac.click();
				await expect(page).toHaveURL(URLS[clau][o]);
				await expect(page.locator('html')).toHaveAttribute('lang', o);
				await expect(page.getByRole('heading', { level: 1 })).toHaveText(CONTINGUTS[clau][o].h1);
				// hreflang del <head> apunta a la mateixa parella
				await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
					'href',
					new RegExp(`${URLS[clau][l]}$`)
				);
			});

			test('inventari de marcadors pendents', async ({ page }) => {
				await page.goto(url);
				const text = await page.locator('main').innerText();
				const trobats = [...text.matchAll(/\[(?:PENDENT|PENDIENTE):[^\]]*\]/g)].map((m) => m[0]);
				const marcats = await page.locator('main mark.pendent').allTextContents();
				test.info().annotations.push({
					type: 'pendents',
					description: trobats.length ? trobats.join(' | ') : '(cap)'
				});
				// Tot marcador del text surt destacat (<mark>) i no n'hi ha cap d'inesperat
				expect(marcats).toEqual(trobats);
				const esperat = PENDENTS_ESPERATS[clau];
				if (esperat) {
					expect(trobats).toHaveLength(1);
					expect(trobats[0]).toMatch(esperat);
				} else {
					expect(trobats).toEqual([]);
				}
			});

			test('sense scroll horitzontal a 320 px (amb les FAQ obertes)', async ({ page }) => {
				await page.setViewportSize({ width: 320, height: 640 });
				await gotoHydrated(page, url);
				await obreTotesLesFaq(page);
				const { px, culprit } = await overflowX(page);
				expect(px, `desborda (${culprit})`).toBeLessThanOrEqual(0);
			});

			for (const colorScheme of ['light', 'dark'] as const) {
				test(`axe ${colorScheme} (FAQ obertes)`, async ({ page }) => {
					await page.emulateMedia({ colorScheme });
					await gotoHydrated(page, url);
					await obreTotesLesFaq(page);
					await expectNoAxeViolations(page);
				});
			}
		});
	}
}

test.describe('Avisos de web no oficial', () => {
	for (const clau of ['repte', 'normativa'] as const) {
		for (const l of LOCALES) {
			test(`${URLS[clau][l]} té un requadre de web no oficial`, async ({ page }) => {
				await page.goto(URLS[clau][l]);
				const nota = page
					.locator('main [role="note"]')
					.filter({ hasText: /no oficial/ })
					.filter({ hasText: 'FEEC' });
				await expect(nota.first()).toBeVisible();
				// I el peu també ho diu
				await expect(page.locator('footer')).toContainText(MSG[l].footer_disclaimer);
			});
		}
	}
});

test.describe('Privadesa: el web fa el que diu la política', () => {
	test.describe('amb el service worker actiu (com en producció)', () => {
		test.use({ serviceWorkers: 'allow' });
		test('sense cookies ni peticions a tercers; només l’emmagatzematge tècnic que diu la política', async ({
			page,
			context
		}) => {
			test.setTimeout(60_000);
			const hosts = new Set<string>();
			page.on('request', (r) => hosts.add(new URL(r.url()).hostname));
			for (const u of ['/ca', URLS.privacitat.ca, URLS.normativa.es, '/ca/cims']) {
				await gotoHydrated(page, u);
			}
			// Fins aquí, cap tercer. El mapa (des del bloc 4c) contacta els serveis de mapes que
			// enumera la política (ICGC, IGN i Mapterhorn), i res més.
			expect([...hosts].filter((h) => h !== 'localhost')).toEqual([]);
			await gotoHydrated(page, '/es/mapa');
			expect(await context.cookies()).toEqual([]);
			const storage = await page.evaluate(async () => ({
				local: Object.keys(localStorage),
				session: Object.keys(sessionStorage),
				idb:
					'databases' in indexedDB ? (await indexedDB.databases()).map((d) => d.name ?? '?') : [],
				sw:
					'serviceWorker' in navigator
						? (await navigator.serviceWorker.getRegistrations()).length
						: 0,
				caches: 'caches' in window ? await caches.keys() : []
			}));
			// La política (bloc 4d) diu: memòria cau del service worker (`carnet-*`), dues preferències
			// tècniques a localStorage i l'estat de navegació de SvelteKit a sessionStorage. Res més.
			// IndexedDB: /mapa obre la BD local (Dexie) per marcar els cims fets; buida, sense dades.
			test
				.info()
				.annotations.push({ type: 'sessionStorage', description: storage.session.join(', ') });
			expect(storage.session.filter((k) => !/^sveltekit:/.test(k))).toEqual([]);
			for (const k of storage.local)
				expect(['carnetdecims:llest-offline', 'carnetdecims:avis-installacio']).toContain(k);
			for (const nom of storage.idb) expect(nom).toBe('carnetdecims');
			expect(storage.sw).toBeLessThanOrEqual(1);
			for (const c of storage.caches) expect(c).toMatch(/^carnet-/);
			for (const h of [...hosts].filter((h) => h !== 'localhost'))
				expect(['geoserveis.icgc.cat', 'data.geopf.fr', 'tiles.mapterhorn.com']).toContain(h);
		});
	});

	test('a la fitxa de cim només es contacta ICGC/IGN (mapes), com diu la política', async ({
		page,
		context
	}) => {
		const hosts = new Set<string>();
		page.on('request', (r) => hosts.add(new URL(r.url()).hostname));
		await page.route(/geoserveis\.icgc\.cat|data\.geopf\.fr/, (route) =>
			route.fulfill({ status: 204, body: '' })
		);
		const nord = CIMS.find((c) => c.zona === 'catalunya-nord') ?? CIMS[0];
		for (const slug of [CIMS[0].slug, nord.slug]) await gotoHydrated(page, fitxaUrl(slug, 'ca'));
		const externs = [...hosts].filter((h) => h !== 'localhost');
		for (const h of externs) expect(['geoserveis.icgc.cat', 'data.geopf.fr']).toContain(h);
		expect(await context.cookies()).toEqual([]);
	});
});

test.describe('Portada definitiva', () => {
	for (const l of LOCALES) {
		const home = `/${l}`;
		const DESTACATS = ['pica-d-estats', 'pedraforca-pollego-superior', 'canigo', 'matagalls'];

		test(`${home}: seccions, CTA i un sol H1`, async ({ page }) => {
			await gotoHydrated(page, home);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(MSG[l].home_title);
			const h2 = (await page.locator('main h2').allTextContents()).map((t) => t.trim());
			expect(h2).toEqual([
				MSG[l].home_value_title,
				MSG[l].home_steps_title,
				MSG[l].home_repte_title,
				MSG[l].home_featured_title,
				MSG[l].explore_label,
				MSG[l].home_unofficial_title
			]);
			const main = page.locator('main');
			await expectHref(
				main.getByRole('link', { name: MSG[l].home_cta_primary, exact: true }),
				`/${l}/app`
			);
			await expectHref(
				main.getByRole('link', { name: MSG[l].home_cta_secondary, exact: true }),
				l === 'ca' ? '/ca/cims' : '/es/cimas'
			);
			// Enllaços al hub del repte
			for (const [k, clau] of [
				['home_repte_link_hub', 'repte'],
				['home_repte_link_normativa', 'normativa'],
				['home_repte_link_validar', 'comValidar'],
				['home_repte_link_infantil', 'repteInfantil']
			] as const) {
				expect(MSG[l][k], `missatge ${k}`).toBeTruthy();
				await expectHref(main.getByRole('link', { name: MSG[l][k], exact: true }), URLS[clau][l]);
			}
			await expect(main).toContainText(MSG[l].footer_disclaimer);
		});

		test(`${home}: els 4 cims destacats enllacen a la seva fitxa`, async ({ page, request }) => {
			await gotoHydrated(page, home);
			const links = page.locator('main section.destacats ul a');
			await expect(links).toHaveCount(4);
			const hrefs = await hrefsAbsoluts(links);
			expect(hrefs).toEqual(DESTACATS.map((s) => fitxaUrl(s, l)));
			for (const [i, slug] of DESTACATS.entries()) {
				const cim = CIMS.find((c) => c.slug === slug)!;
				expect(cim.essencial, slug).toBe(true);
				await expect(links.nth(i)).toContainText(cim.nom);
				expect((await request.get(hrefs[i]!)).status(), hrefs[i]!).toBe(200);
			}
			await links.first().click();
			await expect(page).toHaveURL(fitxaUrl(DESTACATS[0], l));
		});

		test(`${home}: el carnet d'exemple és decoratiu i no s'anuncia`, async ({ page }) => {
			await gotoHydrated(page, home);
			const art = page.locator('main .art');
			await expect(art).toHaveAttribute('aria-hidden', 'true');
			expect(
				await art.evaluate(
					(el) => el.querySelectorAll('a,button,input,select,textarea,[tabindex]').length
				)
			).toBe(0);
			const snap = await page.locator('main').ariaSnapshot();
			expect(snap).not.toContain(MSG[l].home_passport_example);
			expect(snap).not.toMatch(/\b37\b/);
		});
	}
});

test.describe('Peu i landmarks', () => {
	const INFO = [
		'repte',
		'normativa',
		'metodologia',
		'sobreElProjecte',
		'avisLegal',
		'privacitat'
	] as const;
	for (const l of LOCALES) {
		test(`/${l}: peu "Informació del web" amb els 6 enllaços`, async ({ page, request }) => {
			await gotoHydrated(page, `/${l}`);
			const nav = page.getByRole('navigation', { name: MSG[l].footer_info_label });
			await expect(nav).toHaveCount(1);
			const hrefs = await hrefsAbsoluts(nav.getByRole('link'));
			expect(hrefs).toEqual(INFO.map((c) => URLS[c][l]));
			for (const h of hrefs) expect((await request.get(h!)).status(), h!).toBe(200);
		});

		for (const u of [`/${l}`, URLS.normativa[l], URLS.privacitat[l]]) {
			test(`${u}: noms de navigation únics`, async ({ page }) => {
				await gotoHydrated(page, u);
				const noms = await page.locator('nav, [role="navigation"]').evaluateAll((navs) =>
					navs
						.filter((n) => !n.closest('[aria-hidden="true"]'))
						.map((n) => {
							const lb = n.getAttribute('aria-labelledby');
							return (
								n.getAttribute('aria-label') ??
								(lb ? document.getElementById(lb)?.textContent?.trim() : null) ??
								'(sense nom)'
							);
						})
				);
				expect(noms).not.toContain('(sense nom)');
				expect(noms.length, noms.join(' | ')).toBe(new Set(noms).size);
				await expect(page.locator('main')).toHaveCount(1);
				await expect(page.locator('footer.site-footer')).toHaveCount(1);
			});
		}
	}
});
