import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BrowserContext, Page, Route } from '@playwright/test';
import { test, expect, gotoHydrated, waitForHydration } from './fixtures';
import { CIMS, LOCALES, expectNoAxeViolations, fitxaUrl, overflowX, stubMaps } from './cataleg';
import type { ContingutFitxa } from '../src/lib/content/fitxes/types.ts';
import canigo from '../src/lib/content/fitxes/canigo.ts';
import comapedrosa from '../src/lib/content/fitxes/comapedrosa.ts';
import laMola from '../src/lib/content/fitxes/la-mola-de-sant-llorenc-del-munt.ts';
import matagalls from '../src/lib/content/fitxes/matagalls.ts';
import montcau from '../src/lib/content/fitxes/montcau.ts';
import pedraforca from '../src/lib/content/fitxes/pedraforca-pollego-superior.ts';
import picaDEstats from '../src/lib/content/fitxes/pica-d-estats.ts';
import puigmal from '../src/lib/content/fitxes/puigmal.ts';
import santJeroni from '../src/lib/content/fitxes/sant-jeroni.ts';
import taga from '../src/lib/content/fitxes/taga.ts';

/**
 * Bloc 6a · Contingut editorial de les fitxes (10 pilots), meteo i Wikiloc "clic per carregar".
 *
 * - Les dades esperades surten dels mateixos fitxers de contingut (`src/lib/content/fitxes/*.ts`):
 *   cap text duplicat al test.
 * - Meteo: a la UI es mocka `/api/meteo/*` al navegador (`page.route`); el Worker parla amb
 *   Open-Meteo i això no es pot mockar des de Playwright. L'endpoint real es prova amb `request`
 *   i se salta (no falla) si no hi ha xarxa (502).
 * - Wikiloc es mocka (`context.route`) per no dependre de la xarxa.
 * - CLS: només Chromium (l'API `layout-shift` no existeix a WebKit).
 */

const PILOTS: ContingutFitxa[] = [
	canigo,
	comapedrosa,
	laMola,
	matagalls,
	montcau,
	pedraforca,
	picaDEstats,
	puigmal,
	santJeroni,
	taga
];
const SLUGS_PILOTS = new Set(PILOTS.map((p) => p.slug));
/** Fitxes sense contingut editorial (plantilla): una de cada zona i una amb restriccions. */
const SENSE_CONTINGUT = ['la-picossa', 'lo-tormo', 'bastiments'];

const cim = (slug: string) => {
	const c = CIMS.find((x) => x.slug === slug);
	if (!c) throw new Error(`${slug} no és al catàleg`);
	return c;
};

const T = {
	ca: {
		draftAll:
			"En revisió: les dades del cim i els textos d'aquesta fitxa encara no els ha revisat una persona.",
		draftCatalog:
			"Dades en revisió: l'altitud i la situació dels cims encara no s'han revisat a mà.",
		show: 'Mostra la ruta',
		hide: 'Amaga la ruta',
		privacy: 'En prémer el botó es carregarà contingut de Wikiloc, que pot fer servir galetes.',
		iframe: 'Mapa de Wikiloc: ',
		wikilocGeneric: 'Veure rutes a Wikiloc',
		weatherTitle: 'El temps al cim',
		today: 'Avui',
		tomorrow: 'Demà',
		wind: 'Vent',
		precip: 'Precipitació',
		updated2h: 'Previsió actualitzada fa 2 hores',
		old: 'Previsió antiga: pot no estar al dia.',
		error: "No s'ha pogut carregar la previsió.",
		retry: 'Torna-ho a provar',
		offline: 'Sense connexió: previsió no disponible.',
		saved: "Sense connexió: es mostra l'última previsió guardada.",
		source: 'Dades: Open-Meteo',
		sere: 'Serè',
		pluja: 'Pluja',
		neu: 'Neu',
		tempesta: 'Tempesta',
		ennuvolat: 'Ennuvolat',
		max: 'màxima',
		mide: 'Dificultat MIDE',
		mideMedi: 'Medi',
		mideMedi3: 'Diversos factors de risc.'
	},
	es: {
		draftAll:
			'En revisión: una persona aún no ha revisado los datos de la cima ni los textos de esta ficha.',
		draftCatalog:
			'Datos en revisión: la altitud y la ubicación de las cimas aún no se han revisado a mano.',
		show: 'Mostrar la ruta',
		hide: 'Ocultar la ruta',
		privacy: 'Al pulsar el botón se cargará contenido de Wikiloc, que puede usar cookies.',
		iframe: 'Mapa de Wikiloc: ',
		wikilocGeneric: 'Ver rutas en Wikiloc',
		weatherTitle: 'El tiempo en la cima',
		today: 'Hoy',
		tomorrow: 'Mañana',
		wind: 'Viento',
		precip: 'Precipitación',
		updated2h: 'Previsión actualizada hace 2 horas',
		old: 'Previsión antigua: puede no estar al día.',
		error: 'No se ha podido cargar la previsión.',
		retry: 'Reintentar',
		offline: 'Sin conexión: previsión no disponible.',
		saved: 'Sin conexión: se muestra la última previsión guardada.',
		source: 'Datos: Open-Meteo',
		sere: 'Despejado',
		pluja: 'Lluvia',
		neu: 'Nieve',
		tempesta: 'Tormenta',
		ennuvolat: 'Nublado',
		max: 'máxima',
		mide: 'Dificultad MIDE',
		mideMedi: 'Medio',
		mideMedi3: 'Varios factores de riesgo.'
	}
} as const;

// ── Text ─────────────────────────────────────────────────────────────────────

/** Text en línia → text pla visible (`[text](url)` → text, `**x**` → x), espais normalitzats. */
const pla = (s: string) =>
	s
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*/g, '')
		.replace(/\s+/g, ' ')
		.trim();

/**
 * Sondes per buscar el text d'una fitxa dins del JS: el tros ASCII més llarg (≥ 25 caràcters)
 * de cada paràgraf, perquè el minificador pot escapar els accents i les cometes.
 */
function sondes(c: ContingutFitxa, locales: readonly ('ca' | 'es')[] = LOCALES): string[] {
	const out: string[] = [];
	for (const locale of locales) {
		const textos = [
			...c.descripcio[locale],
			...(c.faq?.[locale] ?? []).map((f) => f.resposta),
			...c.rutes.map((r) => r.descripcio[locale])
		];
		for (const t of textos) {
			// Sobre el text cru: `[`, `]`, `(`, `)`, `*` i `/` tallen, i així la sonda no travessa
			// cap marca d'enllaç (és present tal qual a les dades i al text visible).
			const millor = t
				.split(/[^A-Za-z0-9 ,.]+/)
				.map((s) => s.trim())
				.sort((a, b) => b.length - a.length)[0];
			if (millor && millor.length >= 25) out.push(millor);
		}
	}
	return out;
}

/** Text visible d'uns elements, sense el text només per a lectors de pantalla (`.sr-only`). */
function textosVisibles(page: Page, selector: string) {
	return page.locator(selector).evaluateAll((els) =>
		els.map((el) => {
			const c = el.cloneNode(true) as HTMLElement;
			c.querySelectorAll('.sr-only').forEach((s) => s.remove());
			return (c.textContent ?? '').replace(/\s+/g, ' ').trim();
		})
	);
}

// ── Meteo (mock de /api/meteo/*) ─────────────────────────────────────────────

/** Data `AAAA-MM-DD` a Europe/Madrid, avui + `delta` dies. */
const diaMadrid = (delta = 0) =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Madrid',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date(Date.now() + delta * 86_400_000));

/** Previsió sintètica: ahir (s'ha de descartar) + avui + 3 dies. */
function previsio(edatMinuts = 120) {
	const dia = (delta: number, codi: number, tMax: number, tMin: number) => ({
		data: diaMadrid(delta),
		tMax,
		tMin,
		ventMax: 23.6,
		ratxaMax: 41,
		precipitacio: 2.35,
		probPrecipitacio: 40,
		codi,
		iso0: 2840
	});
	return {
		actualitzat: new Date(Date.now() - edatMinuts * 60_000).toISOString(),
		altitud: 2910,
		font: {
			nom: 'Open-Meteo',
			url: 'https://open-meteo.com/',
			llicencia: 'CC BY 4.0',
			llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
		},
		dies: [
			dia(-1, 3, 30, 20),
			dia(0, 0, 12.4, -0.3),
			dia(1, 63, 8, 1),
			dia(2, 71, -2, -7),
			dia(3, 95, 5, 0)
		]
	};
}

type MockMeteo = { status?: number; body?: unknown; abort?: boolean; delayMs?: number };

/** Mocka `/api/meteo/*` i compta les peticions de la pàgina. */
async function mockMeteo(target: Page | BrowserContext, mock: MockMeteo | (() => MockMeteo)) {
	const peticions: string[] = [];
	await target.route(/\/api\/meteo\//, async (route: Route) => {
		peticions.push(route.request().url());
		const m = typeof mock === 'function' ? mock() : mock;
		if (m.delayMs) await new Promise((r) => setTimeout(r, m.delayMs));
		if (m.abort) return route.abort('internetdisconnected');
		await route.fulfill({
			status: m.status ?? 200,
			contentType: 'application/json; charset=utf-8',
			headers: { 'cache-control': 'public, max-age=900' },
			body: JSON.stringify(m.body ?? previsio())
		});
	});
	return peticions;
}

const seccioMeteo = (page: Page) => page.locator('section.meteo');

async function mostraMeteo(page: Page) {
	await page.locator('#meteo-titol').scrollIntoViewIfNeeded();
}

// ── Wikiloc (mock) ───────────────────────────────────────────────────────────

async function mockWikiloc(context: BrowserContext) {
	const peticions: string[] = [];
	context.on('request', (r) => {
		if (/wikiloc\.com/.test(r.url())) peticions.push(r.url());
	});
	await context.route(/wikiloc\.com/, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'text/html; charset=utf-8',
			body: '<!doctype html><html lang="ca"><title>Wikiloc (mock)</title><body><p>Mapa</p></body></html>'
		})
	);
	return peticions;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. Dades dels pilots (sense navegador)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dades de les 10 fitxes pilot', () => {
	test.beforeEach(() => test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop'));

	test('totes en esborrany, amb Wikiloc coherent (id = sufix de la URL) i sense MIDE inventat', () => {
		expect(PILOTS).toHaveLength(10);
		for (const p of PILOTS) {
			expect(p.estat, p.slug).toBe('esborrany');
			expect(
				CIMS.some((c) => c.slug === p.slug),
				`${p.slug} al catàleg`
			).toBe(true);
			// La guia (docs/07 §8) demana 2–3 rutes de Wikiloc o el camp buit amb nota.
			expect(p.wikiloc?.length ?? 0, `${p.slug}: wikiloc`).toBeGreaterThanOrEqual(2);
			expect(p.wikiloc!.length, `${p.slug}: wikiloc`).toBeLessThanOrEqual(3);
			for (const w of p.wikiloc!) {
				expect(w.url, `${p.slug}: ${w.id}`).toMatch(
					new RegExp(`^https://(www|ca|es)\\.wikiloc\\.com/.*-${w.id}$`)
				);
			}
		}
		// Informe: quins pilots tenen MIDE (cap, a 2026-10-03: el MIDE només amb font oficial).
		const ambMide = PILOTS.flatMap((p) =>
			p.rutes.filter((r) => r.mide).map((r) => `${p.slug}/${r.id}`)
		);
		test
			.info()
			.annotations.push({ type: 'rutes amb MIDE', description: ambMide.join(', ') || 'cap' });
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. HTML sense JS: seccions, text, avís únic, noindex
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Fitxes pilot · HTML sense JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	for (const p of PILOTS) {
		for (const locale of LOCALES) {
			test(`${p.slug} (${locale}): seccions i text al HTML, avís únic, noindex`, async ({
				page
			}) => {
				await stubMaps(page);
				const res = await page.goto(fitxaUrl(p.slug, locale));
				expect(res?.status()).toBe(200);
				const main = page.locator('main');

				// Descripció: tots els paràgrafs, text exacte (enllaços inclosos)
				await expect(main.locator('h2#sobre')).toHaveCount(1);
				expect(await textosVisibles(page, 'section[aria-labelledby="sobre"] > p')).toEqual(
					p.descripcio[locale].map(pla)
				);

				// Rutes: una targeta per ruta, la normal primer
				await expect(main.locator('h2#rutes')).toHaveCount(1);
				expect(await textosVisibles(page, 'section[aria-labelledby="rutes"] article h3')).toEqual(
					p.rutes.map((r) => pla(r.nom[locale]))
				);
				expect(
					await textosVisibles(page, 'section[aria-labelledby="rutes"] article p.desc')
				).toEqual(p.rutes.map((r) => pla(r.descripcio[locale])));

				// Consells
				const consells = p.consells?.[locale] ?? [];
				expect(consells.length, 'el pilot té consells').toBeGreaterThan(0);
				expect(await textosVisibles(page, 'section[aria-labelledby="consells"] li')).toEqual(
					consells.map(pla)
				);

				// FAQ: <details> natius (operables sense JS), resposta al HTML
				const faq = p.faq?.[locale] ?? [];
				expect(faq.length).toBeGreaterThan(0);
				expect(await textosVisibles(page, 'section.faq details > summary')).toEqual(
					faq.map((f) => pla(f.pregunta))
				);
				expect(await textosVisibles(page, 'section.faq details .resposta')).toEqual(
					faq.map((f) => pla(f.resposta))
				);

				// Fonts generals: enllaços amb data de consulta
				const fonts = main.locator('section[aria-labelledby="fonts"] li');
				await expect(fonts).toHaveCount(p.fonts.length);
				for (const [i, f] of p.fonts.entries()) {
					await expect(fonts.nth(i).locator('a')).toHaveAttribute('href', f.url);
				}

				// Wikiloc recomanat: títols i enllaços, sense cap iframe
				const wl = main.locator('li.wl');
				await expect(wl).toHaveCount(p.wikiloc!.length);
				for (const [i, w] of p.wikiloc!.entries()) {
					await expect(wl.nth(i).locator('.wl-titol')).toHaveText(w.titol);
					await expect(wl.nth(i).locator('a.ext')).toHaveAttribute('href', w.url);
				}
				await expect(main.locator('iframe')).toHaveCount(0);

				// Un sol avís de revisió (catàleg + textos), cap altre
				const avisos = main
					.locator('[role="note"]')
					.filter({ hasText: /revisi[óo]n?\b|revisat|revisado/i });
				await expect(avisos).toHaveCount(1);
				await expect(avisos).toHaveText(T[locale].draftAll);

				// Esborrany → noindex
				await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
			});
		}
	}

	for (const slug of SENSE_CONTINGUT) {
		for (const locale of LOCALES) {
			test(`${slug} (${locale}) sense contingut: com abans, cap secció buida`, async ({ page }) => {
				expect(SLUGS_PILOTS.has(slug)).toBe(false);
				await stubMaps(page);
				await page.goto(fitxaUrl(slug, locale));
				const main = page.locator('main');
				await expect(main.locator('h1')).toContainText(cim(slug).nom);
				for (const id of ['sobre', 'rutes', 'consells', 'faq', 'fonts', 'meteo-titol']) {
					await expect(main.locator(`#${id}`), id).toHaveCount(0);
				}
				await expect(main.locator('section.meteo, li.wl, section.faq, .fonts-fitxa')).toHaveCount(
					0
				);
				// Es manté el botó genèric de Wikiloc i el mapa
				await expect(
					main.getByRole('link', { name: new RegExp(T[locale].wikilocGeneric) })
				).toHaveCount(1);
				await expect(main.locator('h2#mapa')).toHaveCount(1);
				// Cap secció amb només el títol (h2 sense germans)
				const buides = await main
					.locator('section')
					.evaluateAll((ss) =>
						ss.filter((s) => s.children.length <= 1).map((s) => s.getAttribute('aria-labelledby'))
					);
				expect(buides).toEqual([]);
				const avisos = main.locator('[role="note"]');
				await expect(avisos).toHaveCount(1);
				await expect(avisos).toHaveText(T[locale].draftCatalog);
			});
		}
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. FAQ amb teclat
// ═══════════════════════════════════════════════════════════════════════════

test.describe('FAQ operable amb teclat', () => {
	for (const locale of LOCALES) {
		test(`puigmal (${locale}): Tab arriba a les preguntes, Enter/Espai obren i tanquen`, async ({
			page,
			browserName
		}) => {
			await stubMaps(page);
			await mockMeteo(page, {});
			await gotoHydrated(page, fitxaUrl('puigmal', locale));
			const summaries = page.locator('section.faq summary');
			const n = puigmal.faq![locale].length;
			await expect(summaries).toHaveCount(n);

			// Focus a l'element anterior (l'enllaç "Obre a Wikiloc" de l'última ruta) i Tab
			if (browserName !== 'webkit') {
				// WebKit (Safari) no mou el focus als enllaços amb Tab per defecte.
				await page.locator('li.wl a.ext').last().focus();
				await page.keyboard.press('Tab');
				// Pot haver-hi el botó genèric de Wikiloc entremig
				for (let i = 0; i < 3; i++) {
					if (await summaries.first().evaluate((s) => s === document.activeElement)) break;
					await page.keyboard.press('Tab');
				}
			} else {
				await summaries.first().focus();
			}
			await expect(summaries.first()).toBeFocused();
			const outline = await summaries
				.first()
				.evaluate((s) => getComputedStyle(s).outlineStyle + ' ' + getComputedStyle(s).outlineWidth);
			expect(outline, 'focus visible').not.toMatch(/^none|\b0px$/);

			const details = page.locator('section.faq details').first();
			await expect(details).not.toHaveAttribute('open', '');
			await page.keyboard.press('Enter');
			await expect(details).toHaveAttribute('open', '');
			await expect(details.locator('.resposta')).toBeVisible();
			await page.keyboard.press('Space');
			await expect(details).not.toHaveAttribute('open', '');

			// Tab passa a la pregunta següent
			await page.keyboard.press('Tab');
			await expect(summaries.nth(1)).toBeFocused();
		});
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. El text de les fitxes no va al JS del client
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Text de les fitxes fora del JS del client', () => {
	const TOTES_LES_SONDES = PILOTS.flatMap((p) => sondes(p).map((s) => ({ slug: p.slug, s })));

	test('cap chunk _app/*.js descarregat a la fitxa conté text de cap pilot', async ({ page }) => {
		expect(TOTES_LES_SONDES.length).toBeGreaterThan(80);
		const chunks = new Map<string, Promise<string>>();
		page.on('response', (r) => {
			const u = new URL(r.url());
			if (u.pathname.startsWith('/_app/') && u.pathname.endsWith('.js') && r.ok())
				chunks.set(u.pathname, r.text());
		});
		await stubMaps(page);
		await mockMeteo(page, {});
		await gotoHydrated(page, fitxaUrl('puigmal', 'ca'));
		// Interacció → precàrrega diferida (formulari de registre) als 3 s d'inactivitat
		await page.mouse.move(10, 10);
		await page.keyboard.press('Tab');
		await mostraMeteo(page);
		await page.waitForTimeout(4000);
		// Navegació del client a una altra fitxa pilot
		await page.goto(fitxaUrl('pedraforca-pollego-superior', 'es'));
		await waitForHydration(page);

		expect(chunks.size).toBeGreaterThan(3);
		const trobades: string[] = [];
		for (const [cami, cos] of chunks) {
			const text = await cos;
			for (const { slug, s } of TOTES_LES_SONDES)
				if (text.includes(s)) trobades.push(`${cami}: ${slug} «${s}»`);
		}
		expect(trobades).toEqual([]);
	});

	test('cap fitxer JS del build (client) conté text de cap pilot', async () => {
		test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop');
		const dir = join(process.cwd(), '.svelte-kit', 'cloudflare', '_app');
		const fitxers = (readdirSync(dir, { recursive: true }) as string[]).filter((f) =>
			f.endsWith('.js')
		);
		expect(fitxers.length).toBeGreaterThan(10);
		const trobades: string[] = [];
		for (const f of fitxers) {
			const text = readFileSync(join(dir, f), 'utf8');
			for (const { slug, s } of TOTES_LES_SONDES)
				if (text.includes(s)) trobades.push(`${f}: ${slug}`);
		}
		expect(trobades).toEqual([]);
	});

	test('__data.json i HTML de cada fitxa: només aquell cim i només l’idioma de la pàgina', async ({
		request
	}, ti) => {
		test.skip(ti.project.name !== 'desktop-chrome', 'només un cop');
		// 40 peticions seqüencials + milers de cerques de sondes: ~4 s en solitari, però > 30 s amb
		// els 3 projectes en paral·lel (QA 6a-bis). Marge ampli sense perdre cap comprovació.
		test.setTimeout(120_000);
		for (const p of PILOTS) {
			for (const locale of LOCALES) {
				const altre = locale === 'ca' ? 'es' : 'ca';
				const url = fitxaUrl(p.slug, locale);
				const dades = await request.get(`${url}/__data.json`);
				expect(dades.status(), url).toBe(200);
				const html = await (await request.get(url)).text();
				for (const [nom, cos] of [
					['__data.json', await dades.text()],
					['HTML', html]
				]) {
					for (const s of sondes(p, [locale]))
						expect(cos.includes(s), `${url} ${nom}: falta «${s}»`).toBe(true);
					for (const s of sondes(p, [altre]))
						expect(cos.includes(s), `${url} ${nom}: porta text en ${altre} «${s}»`).toBe(false);
					for (const x of PILOTS.filter((x) => x.slug !== p.slug))
						for (const s of sondes(x))
							expect(cos.includes(s), `${url} ${nom} conté ${x.slug}`).toBe(false);
				}
			}
		}
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. MIDE amb dades sintètiques (cap pilot en té)
// ═══════════════════════════════════════════════════════════════════════════

/** Afegeix un MIDE a la primera ruta d'un `__data.json` (format devalue aplanat). */
function ambMide(json: { nodes: ({ type: string; data?: unknown[] } | null)[] }) {
	const node = json.nodes.find(
		(n) =>
			n?.type === 'data' &&
			(n.data?.[0] as Record<string, number> | undefined)?.contingut !== undefined
	)!;
	const d = node.data as unknown[];
	const arrel = d[0] as Record<string, number>;
	const contingut = d[arrel.contingut] as Record<string, number>;
	const rutes = d[contingut.rutes] as number[];
	const ruta = d[rutes[0]] as Record<string, number>;
	const nou = (v: unknown) => d.push(v) - 1;
	const mide = { medi: nou(3), itinerari: nou(2), desplacament: nou(4), esforc: nou(3) };
	ruta.mide = nou(mide);
	return json;
}

test.describe('MIDE (dades sintètiques)', () => {
	for (const locale of LOCALES) {
		test(`puigmal (${locale}): 4 eixos amb valor i explicació en text, quadrets decoratius`, async ({
			page
		}) => {
			await stubMaps(page);
			await mockMeteo(page, {});
			await page.route(/\/(cims|cimas)\/puigmal\/__data\.json/, async (route) => {
				const res = await route.fetch();
				await route.fulfill({ response: res, json: ambMide(await res.json()) });
			});
			// Navegació del client (el __data.json només es demana en navegar dins l'app)
			await gotoHydrated(page, locale === 'ca' ? '/ca/cims' : '/es/cimas');
			await page.locator(`main a[href$="/puigmal"]`).first().click();
			await expect(page).toHaveURL(new RegExp(`/puigmal$`));
			const ruta = page.locator('section[aria-labelledby="rutes"] article').first();
			const llista = ruta.getByRole('list', { name: T[locale].mide });
			await expect(llista).toBeVisible();
			const eixos = llista.locator('li');
			await expect(eixos).toHaveCount(4);
			// Cada eix: nom + "n de 5" + explicació, llegibles sense color
			await expect(eixos.nth(0)).toContainText(T[locale].mideMedi);
			await expect(eixos.nth(0)).toContainText('3 de 5');
			await expect(eixos.nth(0)).toContainText(T[locale].mideMedi3);
			await expect(eixos.nth(1)).toContainText('2 de 5');
			await expect(eixos.nth(2)).toContainText('4 de 5');
			await expect(eixos.nth(3)).toContainText('3 de 5');
			// Quadrets: aria-hidden; ple vs buit es distingeix pel farciment (forma), no pel to
			const pips = await eixos
				.nth(0)
				.locator('.pips')
				.evaluate((el) => ({
					hidden: el.getAttribute('aria-hidden'),
					fons: [...el.children].map((c) => getComputedStyle(c).backgroundColor),
					vores: [...el.children].map((c) => getComputedStyle(c).borderTopColor)
				}));
			expect(pips.hidden).toBe('true');
			const transparent = (c: string) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
			expect(pips.fons.map((c) => !transparent(c))).toEqual([true, true, true, false, false]);
			expect(new Set(pips.vores).size, 'mateixa vora a tots: no és només color').toBe(1);
		});
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. Wikiloc "clic per carregar"
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Wikiloc recomanat: clic per carregar', () => {
	for (const locale of LOCALES) {
		test(`puigmal (${locale}): cap petició a Wikiloc abans del clic; després, l'iframe embedv2`, async ({
			page,
			context
		}) => {
			const wikiloc = await mockWikiloc(context);
			await stubMaps(page);
			await mockMeteo(page, {});
			await gotoHydrated(page, fitxaUrl('puigmal', locale));
			// Tota la pàgina recorreguda (lazy-load, meteo, etc.)
			await mostraMeteo(page);
			await page.locator('section.faq').scrollIntoViewIfNeeded();
			await page.waitForTimeout(1000);
			expect(wikiloc, 'cap petició a wikiloc.com abans del clic').toEqual([]);
			await expect(page.locator('iframe')).toHaveCount(0);

			const primera = page.locator('li.wl').first();
			const boto = primera.getByRole('button', { name: T[locale].show });
			await expect(boto).toHaveAttribute('aria-expanded', 'false');
			// Consentiment informat visible i associat al botó
			const avis = primera.locator('.avis');
			await expect(avis).toBeVisible();
			await expect(avis).toHaveText(T[locale].privacy);
			await expect(boto).toHaveAttribute('aria-describedby', (await avis.getAttribute('id'))!);

			await boto.click();
			const id = puigmal.wikiloc![0].id;
			const iframe = primera.locator('iframe');
			await expect(iframe).toHaveCount(1);
			await expect(iframe).toHaveAttribute(
				'src',
				`https://${locale}.wikiloc.com/wikiloc/embedv2.do?id=${id}&elevation=on&images=off&maptype=H`
			);
			await expect(iframe).toHaveAttribute('title', T[locale].iframe + puigmal.wikiloc![0].titol);
			await expect(primera.getByRole('button', { name: T[locale].hide })).toHaveAttribute(
				'aria-expanded',
				'true'
			);
			await expect.poll(() => wikiloc.length).toBeGreaterThan(0);
			expect(
				wikiloc.every((u) => u.includes(`embedv2.do?id=${id}`)),
				wikiloc.join('\n')
			).toBe(true);
			// Només la ruta triada: la segona continua sense iframe
			await expect(page.locator('li.wl').nth(1).locator('iframe')).toHaveCount(0);

			// Tancar → l'iframe desapareix
			await primera.getByRole('button', { name: T[locale].hide }).click();
			await expect(iframe).toHaveCount(0);
		});
	}

	test('les 10 pilots mostren les seves rutes de Wikiloc (ca i es), sense peticions', async ({
		page,
		context
	}) => {
		test.slow();
		const wikiloc = await mockWikiloc(context);
		await stubMaps(page);
		await mockMeteo(page, {});
		for (const p of PILOTS) {
			for (const locale of LOCALES) {
				await page.goto(fitxaUrl(p.slug, locale));
				await waitForHydration(page);
				await expect(page.locator('li.wl'), `${p.slug} ${locale}`).toHaveCount(p.wikiloc!.length);
				await expect(page.getByRole('button', { name: T[locale].show })).toHaveCount(
					p.wikiloc!.length
				);
			}
		}
		expect(wikiloc).toEqual([]);
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. Meteo (UI amb /api/meteo/* mockejat)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Meteo a la fitxa', () => {
	for (const locale of LOCALES) {
		test(`(${locale}) es carrega només en entrar al viewport; 4 dies amb dades i atribució`, async ({
			page
		}) => {
			await stubMaps(page);
			const peticions = await mockMeteo(page, {});
			await gotoHydrated(page, fitxaUrl('puigmal', locale));
			await page.waitForTimeout(1500);
			expect(peticions, 'cap petició abans de veure la secció').toEqual([]);

			await mostraMeteo(page);
			await expect.poll(() => peticions.length).toBe(1);
			expect(new URL(peticions[0]).pathname).toBe('/api/meteo/puigmal');

			const s = seccioMeteo(page);
			const dies = s.locator('li.dia');
			await expect(dies).toHaveCount(4);
			// Ahir es descarta; avui i demà amb nom
			await expect(dies.nth(0)).toContainText(T[locale].today);
			await expect(dies.nth(1)).toContainText(T[locale].tomorrow);
			await expect(s).not.toContainText(T[locale].ennuvolat);
			// Icones decoratives + condició en text (alternativa textual)
			for (const [i, cond] of [
				T[locale].sere,
				T[locale].pluja,
				T[locale].neu,
				T[locale].tempesta
			].entries()) {
				await expect(dies.nth(i).locator('svg.icona-temps')).toHaveAttribute('aria-hidden', 'true');
				await expect(dies.nth(i).locator('.condicio')).toHaveText(cond);
			}
			// Màx/mín (sense "-0"), amb etiqueta per a lectors de pantalla
			await expect(dies.nth(0).locator('.tmax')).toHaveText(
				new RegExp(`${T[locale].max}.*12\\s?°C`)
			);
			await expect(dies.nth(0).locator('.tmin')).toHaveText(/(^|\s)0\s?°C$/);
			await expect(dies.nth(2).locator('.tmax')).toHaveText(/[-−]2\s?°C$/);
			// Vent (i ratxes) i precipitació (amb probabilitat)
			await expect(dies.nth(0).locator('dl')).toContainText(T[locale].wind);
			await expect(dies.nth(0).locator('dl')).toContainText(/24\s?km\/h/);
			await expect(dies.nth(0).locator('dl')).toContainText(/41\s?km\/h/);
			await expect(dies.nth(0).locator('dl')).toContainText(T[locale].precip);
			await expect(dies.nth(0).locator('dl')).toContainText(/2,4\s?mm/);
			await expect(dies.nth(0).locator('dl')).toContainText(/40\s?%/);

			await expect(s.locator('.actualitzada')).toHaveText(T[locale].updated2h);
			await expect(s).not.toContainText(T[locale].old);
			// Atribució amb enllaç i llicència
			const font = s.locator('p.font');
			await expect(font.getByRole('link', { name: new RegExp(T[locale].source) })).toHaveAttribute(
				'href',
				'https://open-meteo.com/'
			);
			const llic = font.getByRole('link', { name: /CC BY 4\.0/ });
			await expect(llic).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
			await expect(llic).toHaveAttribute('rel', /license/);

			// Sense més peticions (cap refresc en bucle)
			await page.waitForTimeout(2000);
			expect(peticions).toHaveLength(1);
		});
	}

	test('previsió de més de 6 h → avís de previsió antiga; de 5 h, no', async ({ page }) => {
		await stubMaps(page);
		let edat = 7 * 60;
		await mockMeteo(page, () => ({ body: previsio(edat) }));
		await gotoHydrated(page, fitxaUrl('montcau', 'ca'));
		await mostraMeteo(page);
		await expect(seccioMeteo(page).locator('.actualitzada')).toHaveText(
			'Previsió actualitzada fa 7 hores'
		);
		await expect(seccioMeteo(page)).toContainText(T.ca.old);

		edat = 5 * 60;
		await page.reload();
		await waitForHydration(page);
		await mostraMeteo(page);
		await expect(seccioMeteo(page).locator('.actualitzada')).toHaveText(
			'Previsió actualitzada fa 5 hores'
		);
		await expect(seccioMeteo(page)).not.toContainText(T.ca.old);
	});

	test('502 del servidor → missatge i "Torna-ho a provar"; cap reintent automàtic', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource.*502/);
		await stubMaps(page);
		let estat = 502;
		const peticions = await mockMeteo(page, () =>
			estat === 502 ? { status: 502, body: { error: 'proveidor_no_disponible' } } : {}
		);
		await gotoHydrated(page, fitxaUrl('matagalls', 'ca'));
		await mostraMeteo(page);
		const s = seccioMeteo(page);
		await expect(s.getByRole('status').filter({ hasText: T.ca.error })).toBeVisible();
		await page.waitForTimeout(4000);
		expect(peticions, 'sense bucle de reintents').toHaveLength(1);

		estat = 200;
		await s.getByRole('button', { name: T.ca.retry }).click();
		await expect(s.locator('li.dia')).toHaveCount(4);
		expect(peticions).toHaveLength(2);
	});

	test('sense connexió → avís; en tornar la xarxa, un sol reintent', async ({
		page,
		context,
		consoleGuard
	}) => {
		consoleGuard.allow(/ERR_INTERNET_DISCONNECTED|Failed to load resource/);
		await stubMaps(page);
		let online = true;
		// Amb `setOffline` el `route` encara pot rebre la petició: es simula la fallada de xarxa.
		const peticions = await mockMeteo(page, () => ({ abort: !online }));
		await gotoHydrated(page, fitxaUrl('canigo', 'ca'));
		online = false;
		await context.setOffline(true);
		await mostraMeteo(page);
		const s = seccioMeteo(page);
		await expect(s).toContainText(T.ca.offline);
		await page.waitForTimeout(2500);
		const abans = peticions.length;
		expect(abans).toBeLessThanOrEqual(1);

		online = true;
		await context.setOffline(false);
		await expect(s.locator('li.dia')).toHaveCount(4);
		await page.waitForTimeout(2000);
		expect(peticions.length - abans, 'un sol reintent en tornar la xarxa').toBe(1);
	});

	test('cim desconegut (404) no es mostra com "sense connexió" i no es reintenta', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource.*404/);
		await stubMaps(page);
		const peticions = await mockMeteo(page, { status: 404, body: { error: 'cim_desconegut' } });
		await gotoHydrated(page, fitxaUrl('taga', 'es'));
		await mostraMeteo(page);
		await expect(
			seccioMeteo(page).getByRole('status').filter({ hasText: T.es.error })
		).toBeVisible();
		await page.waitForTimeout(2000);
		expect(peticions).toHaveLength(1);
	});
});

// ── Meteo amb el service worker (Chromium) ──────────────────────────────────

test.describe('Meteo sense connexió amb el service worker', () => {
	test.use({ serviceWorkers: 'allow' });
	test.skip(
		({ browserName }) => browserName !== 'chromium',
		'WebKit + setOffline talla també les respostes del SW (vegeu pwa.e2e.ts)'
	);

	test('mostra l’última previsió guardada i ho diu', async ({ page, context, consoleGuard }) => {
		test.slow(); // precache del SW (~520 kB) sota càrrega
		consoleGuard.allow(/ERR_INTERNET_DISCONNECTED|Failed to load resource/);
		await context.route(/geoserveis\.icgc\.cat|data\.geopf\.fr/, (r) => r.abort());
		consoleGuard.allow(/geoserveis|ERR_FAILED/);
		const peticions = await mockMeteo(context, {});
		const url = fitxaUrl('sant-jeroni', 'ca');
		await gotoHydrated(page, url);
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
		// Recàrrega controlada pel SW: l'HTML i la meteo passen pel SW (i es desen)
		await page.reload();
		await waitForHydration(page);
		await mostraMeteo(page);
		await expect(seccioMeteo(page).locator('li.dia')).toHaveCount(4);
		await expect
			.poll(
				() =>
					page.evaluate(async () => {
						const c = await caches.open('carnet-meteo-v1');
						return (await c.keys()).map((r) => new URL(r.url).pathname);
					}),
				{ timeout: 15_000 }
			)
			.toContain('/api/meteo/sant-jeroni');
		const abans = peticions.length;

		await context.unroute(/\/api\/meteo\//);
		await context.setOffline(true);
		await page.reload();
		await waitForHydration(page);
		const s = seccioMeteo(page);
		await mostraMeteo(page);
		await expect(s.locator('li.dia')).toHaveCount(4);
		await expect(s).toContainText(T.ca.saved);
		await expect(s.locator('.actualitzada')).toContainText('Previsió actualitzada fa 2 hores');
		await page.waitForTimeout(2000);
		expect(peticions.length).toBe(abans);
		await context.setOffline(false);
	});
});

// ── Endpoint real ───────────────────────────────────────────────────────────

test.describe('GET /api/meteo/{slug} (endpoint real)', () => {
	test.beforeEach(() => test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop'));

	test('slug desconegut o invàlid → 404 JSON sense cache', async ({ request }) => {
		for (const slug of ['no-existeix', 'PUIGMAL', 'puigmal%20', 'segarra']) {
			const res = await request.get(`/api/meteo/${slug}`);
			expect(res.status(), slug).toBe(404);
			expect(res.headers()['cache-control'], slug).toBe('no-store');
			expect(res.headers()['content-type']).toMatch(/application\/json/);
			expect(await res.json()).toEqual({ error: 'cim_desconegut' });
		}
		// Camí amb més segments: no és l'endpoint
		expect((await request.get('/api/meteo/puigmal/x')).status()).toBe(404);
	});

	test('només GET', async ({ request }) => {
		const res = await request.post('/api/meteo/puigmal', { data: {} });
		expect([403, 405]).toContain(res.status());
	});

	test('cim del catàleg → 200 amb cache curta i dades a l’altitud del cim (necessita xarxa)', async ({
		request
	}) => {
		const res = await request.get('/api/meteo/puigmal');
		test.skip(res.status() === 502, 'Sense xarxa cap a Open-Meteo (502): no es pot provar');
		expect(res.status()).toBe(200);
		const h = res.headers();
		expect(h['content-type']).toMatch(/application\/json/);
		expect(h['cache-control']).toMatch(/^public, max-age=(900|300)$/);
		expect(h['x-carnet-meteo']).toMatch(/^(HIT|MISS|STALE)$/);
		expect(h['x-robots-tag']).toBe('noindex');
		const cos = await res.json();
		expect(cos.altitud).toBe(cim('puigmal').altitud);
		expect(cos.font).toMatchObject({ nom: 'Open-Meteo', llicencia: 'CC BY 4.0' });
		expect(cos.dies.length).toBeGreaterThanOrEqual(3);
		expect(cos.dies.length).toBeLessThanOrEqual(4);
		for (const d of cos.dies) {
			expect(d.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(typeof d.tMax).toBe('number');
			expect(d.tMax).toBeGreaterThanOrEqual(d.tMin);
		}
		// La petició següent surt d'una cache (no torna a preguntar al proveïdor): mateix
		// `actualitzat`. No es mira `x-carnet-meteo`: la cache per URL de l'adapter (15 min) torna
		// la resposta tal com va sortir, amb el seu "MISS" original (vegeu `server/meteo/servei.ts`).
		const res2 = await request.get('/api/meteo/puigmal');
		expect(res2.status()).toBe(200);
		expect((await res2.json()).actualitzat).toBe(cos.actualitzat);
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. axe (clar i fosc) i reflow a 320 px
// ═══════════════════════════════════════════════════════════════════════════

/** Fitxa amb totes les seccions obertes: meteo carregada, una FAQ, fonts d'una ruta i Wikiloc. */
async function obreTot(page: Page, context: BrowserContext, url: string) {
	await mockWikiloc(context);
	await stubMaps(page);
	await mockMeteo(page, {});
	await gotoHydrated(page, url);
	await mostraMeteo(page);
	await expect(seccioMeteo(page).locator('li.dia')).toHaveCount(4);
	await page.locator('section.faq summary').first().click();
	await page.locator('details.fonts summary').first().click();
	await page.locator('li.wl').first().getByRole('button').click();
	await expect(page.locator('li.wl iframe')).toHaveCount(1);
}

const AXE = ['pedraforca-pollego-superior', 'pica-d-estats', 'la-mola-de-sant-llorenc-del-munt'];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe · fitxes pilot · ${colorScheme}`, () => {
		test.use({ colorScheme });
		for (const slug of AXE) {
			test(`${slug} amb totes les seccions obertes sense violacions WCAG 2.2 AA`, async ({
				page,
				context
			}) => {
				await obreTot(page, context, fitxaUrl(slug, slug === 'pica-d-estats' ? 'es' : 'ca'));
				await expectNoAxeViolations(page);
			});
		}
	});
}

test.describe('Reflow a 320 px', () => {
	test.use({ viewport: { width: 320, height: 640 } });
	for (const p of PILOTS) {
		test(`${p.slug} (ca i es) sense scroll horitzontal amb tot obert`, async ({
			page,
			context
		}) => {
			for (const locale of LOCALES) {
				await obreTot(page, context, fitxaUrl(p.slug, locale));
				const o = await overflowX(page);
				expect(o, `${locale}: ${o.culprit}`).toEqual({ px: 0, culprit: null });
				await context.unrouteAll({ behavior: 'ignoreErrors' });
				await page.unrouteAll({ behavior: 'ignoreErrors' });
			}
		});
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. CLS (build de producció, Chromium)
// ═══════════════════════════════════════════════════════════════════════════

declare global {
	interface Window {
		__cls?: { total: number; shifts: { t: number; v: number; nodes: string[] }[] };
	}
}

function observaCls() {
	window.__cls = { total: 0, shifts: [] };
	new PerformanceObserver((llista) => {
		for (const e of llista.getEntries() as (PerformanceEntry & {
			value: number;
			hadRecentInput: boolean;
			sources?: { node?: Node | null }[];
		})[]) {
			if (e.hadRecentInput) continue;
			window.__cls!.total += e.value;
			window.__cls!.shifts.push({
				t: Math.round(e.startTime),
				v: Math.round(e.value * 10000) / 10000,
				nodes: (e.sources ?? []).map((s) => {
					const el = s.node as HTMLElement | null;
					return el
						? `${el.nodeName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}`
						: '?';
				})
			});
		}
	}).observe({ type: 'layout-shift', buffered: true });
}

test.describe('CLS de les fitxes pilot', () => {
	test.skip(({ browserName }) => browserName !== 'chromium', 'layout-shift només a Chromium');

	// Mesura informativa (depèn del moment en què arriba la font; no s'hi fa cap asserció).
	for (const ample of [320, 375, 768]) {
		test(`${ample} px, fonts lentes (800 ms): CLS de càrrega mesurat a les 10 (informatiu)`, async ({
			browser
		}, ti) => {
			test.skip(ti.project.name !== 'mobile-chrome', 'un sol projecte Chromium mòbil');
			test.setTimeout(300_000);
			const resultats: string[] = [];
			for (const p of PILOTS) {
				const ctx = await browser.newContext({
					viewport: { width: ample, height: ample >= 768 ? 1024 : 740 },
					deviceScaleFactor: 2,
					isMobile: ample < 768,
					hasTouch: true,
					serviceWorkers: 'block'
				});
				await ctx.addInitScript(observaCls);
				const page = await ctx.newPage();
				await stubMaps(page);
				await mockMeteo(page, {});
				await page.route(/\.woff2(\?|$)/, async (r) => {
					await new Promise((res) => setTimeout(res, 800));
					await r.continue();
				});
				await page.goto(fitxaUrl(p.slug, 'ca'));
				await page.evaluate(() => document.fonts.ready);
				await page.waitForTimeout(1500);
				const c = (await page.evaluate(() => window.__cls))!;
				resultats.push(
					`${p.slug}=${Math.round(c.total * 1000) / 1000} ${c.shifts.map((s) => `${s.v}@${s.t}ms[${s.nodes.join(',')}]`).join(' ')}`
				);
				await ctx.close();
			}
			const informe = resultats.join('\n');
			console.log(`CLS ${ample}px (fonts lentes):\n${informe}`);
			ti.annotations.push({ type: `CLS ${ample}px`, description: informe });
		});
	}

	/**
	 * Determinista: l'alçada de la capçalera (H1 inclòs) ha de ser la mateixa amb la font de
	 * reserva (woff2 bloquejades) i amb Archivo. Si canvia, hi ha CLS quan la font arriba tard.
	 * (BUG QA-6a corregit: el H1 de Puigmal passava d'1 a 2 línies amb Archivo; ara els salts del
	 * mòbil són explícits, `saltsTitolEm`.)
	 */
	/**
	 * Els 10 pilots i els cims on el H1 canviava de línies amb Archivo (escombrat de les 150 fitxes
	 * del QA 6a: Puigmal, La Muga, Molló-Puntaire, Torre de Madeloc; Tossa Plana de Lles, 0,05).
	 */
	const CAPCALERA = [
		...PILOTS.map((p) => cim(p.slug)),
		...['la-muga', 'mollo-puntaire', 'torre-de-madeloc', 'tossa-plana-de-lles'].map(cim)
	];
	for (const ample of [320, 375, 768]) {
		test(`${ample} px · pilots i noms curts: la capçalera no canvia d'alçada en carregar Archivo`, async ({
			browser
		}, ti) => {
			test.skip(ti.project.name !== 'mobile-chrome', 'un sol projecte Chromium mòbil');
			test.setTimeout(300_000);
			const nouContext = async (bloquejaFonts: boolean) => {
				const ctx = await browser.newContext({
					viewport: { width: ample, height: ample >= 768 ? 1024 : 740 },
					deviceScaleFactor: 2,
					isMobile: ample < 768,
					hasTouch: true,
					serviceWorkers: 'block'
				});
				const page = await ctx.newPage();
				await stubMaps(page);
				await mockMeteo(page, {});
				if (bloquejaFonts) await page.route(/\.woff2(\?|$)/, (r) => r.abort());
				return { ctx, page };
			};
			const reserva = await nouContext(true);
			const archivo = await nouContext(false);
			const mida = async (page: Page, slug: string) => {
				await page.goto(fitxaUrl(slug, 'ca'));
				await page.evaluate(() => document.fonts.ready);
				return page.evaluate(() => {
					const h1 = document.querySelector('main h1')!;
					const r = h1.getBoundingClientRect();
					const lh = parseFloat(getComputedStyle(h1).fontSize) * 0.95;
					return {
						h1: Math.round(r.height),
						linies: Math.round(r.height / lh),
						cap: Math.round(document.querySelector('main header')!.getBoundingClientRect().height),
						// `fonts.check` torna `true` si cap cara cal carregar: es mira l'estat real.
						font: [...document.fonts].some(
							(f) => /^["']?Archivo Variable/.test(f.family) && f.status === 'loaded'
						)
					};
				});
			};
			const dolents: string[] = [];
			let ambArchivo = 0;
			let reservaAmbArchivo = 0;
			for (const c of CAPCALERA) {
				const r = await mida(reserva.page, c.slug);
				const a = await mida(archivo.page, c.slug);
				if (a.font) ambArchivo++;
				if (r.font) reservaAmbArchivo++;
				if (Math.abs(a.cap - r.cap) > 2)
					dolents.push(
						`${c.slug}: reserva ${r.linies} línies/${r.cap} px → Archivo ${a.linies} línies/${a.cap} px`
					);
			}
			await reserva.ctx.close();
			await archivo.ctx.close();
			const informe = dolents.join('\n') || 'cap';
			console.log(`Capçalera ${ample}px (reserva vs Archivo):\n${informe}`);
			ti.annotations.push({ type: `H1 ${ample}px`, description: informe });
			expect(ambArchivo, 'Archivo s’ha carregat al context normal').toBe(CAPCALERA.length);
			expect(reservaAmbArchivo, 'el context de reserva no té Archivo').toBe(0);
			expect(dolents, informe).toEqual([]);
		});
	}

	for (const cas of ['ok', 'error', 'offline'] as const) {
		test(`375 px: carregar la meteo en fer scroll no mou la pàgina (${cas})`, async ({
			browser
		}, ti) => {
			test.skip(ti.project.name !== 'mobile-chrome', 'un sol projecte Chromium mòbil');
			// (BUG QA-6a corregit: l'estat d'error ocupa la mateixa alçada que l'esquelet de 4 dies.)
			const ctx = await browser.newContext({
				viewport: { width: 375, height: 740 },
				isMobile: true,
				hasTouch: true,
				serviceWorkers: 'block'
			});
			await ctx.addInitScript(observaCls);
			const page = await ctx.newPage();
			await stubMaps(page);
			await mockMeteo(
				page,
				cas === 'ok'
					? { delayMs: 600 }
					: cas === 'error'
						? { delayMs: 600, status: 502, body: {} }
						: { delayMs: 600, abort: true }
			);
			await page.goto(fitxaUrl('puigmal', 'ca'));
			await waitForHydration(page);
			await page.evaluate(() => document.fonts.ready);
			await page.waitForTimeout(800);
			// Títol de la meteo a dalt de tot: la secció i el que hi ha a sota, visibles
			await page.evaluate(() => {
				window.__cls = { total: 0, shifts: [] };
				document.getElementById('meteo-titol')!.scrollIntoView({ block: 'start' });
			});
			await page.waitForTimeout(1800);
			const c = (await page.evaluate(() => window.__cls))!;
			const informe = `${cas}: ${Math.round(c.total * 1000) / 1000} ${c.shifts.map((s) => `${s.v}[${s.nodes.join(',')}]`).join(' ')}`;
			await ctx.close();
			console.log(`CLS meteo 375px ${informe}`);
			ti.annotations.push({ type: 'CLS meteo', description: informe });
			expect(c.total, informe).toBeLessThan(0.05);
		});
	}
});
