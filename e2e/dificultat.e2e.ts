import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import {
	test,
	expect,
	expectHref,
	gotoHydrated,
	hrefsAbsoluts,
	waitForHydration
} from './fixtures';
import {
	CIMS,
	LOCALES,
	alt,
	comarcaUrl,
	expectNoAxeViolations,
	fitxaUrl,
	jsonLdNodes,
	overflowX,
	stubMaps,
	type Locale
} from './cataleg';
import {
	CRITERIS_LLISTATS_DIFICULTAT,
	ESCALA_DIFICULTAT,
	dificultatOrientativa,
	esRutaFacil,
	rutaAmbNens,
	type DadaDificultat,
	type DificultatOrientativa,
	type NivellDificultat,
	type Tecnicitat
} from '../src/lib/domain/dificultat.ts';
import type { ContingutFitxa, RutaAcces } from '../src/lib/content/fitxes/types.ts';
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
 * Bloc 6a-bis · "Dificultat orientativa" (estimació pròpia, no és el MIDE) i llistats
 * `/cims-facils` i `/cims-amb-nens`.
 *
 * - Els nivells esperats es deriven de les dades de les fitxes (`src/lib/content/fitxes/*.ts`) i
 *   de l'altitud del catàleg amb la mateixa funció del domini (`dificultatOrientativa`): cap nivell
 *   copiat a mà al test.
 * - Els criteris dels llistats es reimplementen aquí a partir de `CRITERIS_LLISTATS_DIFICULTAT`
 *   (oracle independent) i es contrasten amb els predicats del domini.
 * - Els textos de la interfície surten de `messages/{ca,es}.json`.
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

const cim = (slug: string) => {
	const c = CIMS.find((x) => x.slug === slug);
	if (!c) throw new Error(`${slug} no és al catàleg`);
	return c;
};

// ── Textos (messages/*.json) ─────────────────────────────────────────────────

const MSG: Record<Locale, Record<string, string>> = {
	ca: JSON.parse(readFileSync(new URL('../messages/ca.json', import.meta.url), 'utf8')),
	es: JSON.parse(readFileSync(new URL('../messages/es.json', import.meta.url), 'utf8'))
};
const msg = (locale: Locale, clau: string, params: Record<string, string | number> = {}) => {
	const t = MSG[locale][clau];
	if (t === undefined) throw new Error(`Falta el missatge ${clau}`);
	return t.replace(/\{(\w+)\}/g, (_, k) => String(params[k]));
};

const CLAU_NOM: Record<NivellDificultat, string> = {
	1: 'cim_difficulty_facil',
	2: 'cim_difficulty_moderada',
	3: 'cim_difficulty_exigent',
	4: 'cim_difficulty_molt_exigent'
};
const nomNivell = (locale: Locale, n: NivellDificultat) => msg(locale, CLAU_NOM[n]);
const nomDada = (locale: Locale, d: DadaDificultat) => msg(locale, `cim_difficulty_data_${d}`);

/** Text de "Per què és aproximada?" tal com el construeix el distintiu (Intl.ListFormat). */
const textFalten = (locale: Locale, dades: readonly DadaDificultat[]) =>
	dades.length === 0
		? msg(locale, 'cim_difficulty_missing_generic')
		: msg(locale, 'cim_difficulty_missing', {
				dades: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
					dades.map((d) => nomDada(locale, d))
				)
			});

const URL_LLISTAT = {
	'cims-facils': { ca: '/ca/cims-facils', es: '/es/cimas-faciles' },
	'cims-amb-nens': { ca: '/ca/cims-amb-nens', es: '/es/cimas-con-ninos' },
	essencials: { ca: '/ca/cims-essencials', es: '/es/cimas-esenciales' },
	tresmils: { ca: '/ca/tresmils', es: '/es/tresmiles' },
	'mes-alts': { ca: '/ca/cims-mes-alts', es: '/es/cimas-mas-altas' },
	cims: { ca: '/ca/cims', es: '/es/cimas' },
	mapa: { ca: '/ca/mapa', es: '/es/mapa' }
} as const;
const metodologiaUrl = (locale: Locale) => `/${locale}/metodologia`;
const ANCLA = 'dificultat-orientativa';

// ── Oracle ───────────────────────────────────────────────────────────────────

const dificultatRuta = (slug: string, r: RutaAcces): DificultatOrientativa | null =>
	dificultatOrientativa({
		desnivellPositiuM: r.desnivellPositiuM,
		distanciaKm: r.distanciaKm,
		tempsMinuts: r.tempsMinuts,
		tecnicitat: r.tecnicitat,
		altitudCim: cim(slug).altitud
	});

/** Dificultat de la ruta normal (la primera) de cada pilot. */
const NORMAL = new Map(PILOTS.map((p) => [p.slug, dificultatRuta(p.slug, p.rutes[0])]));
/** Mapa esperat a les llistes: només cims amb contingut i dificultat calculable. */
const ESPERAT_LLISTES = new Map(
	[...NORMAL].filter((e): e is [string, DificultatOrientativa] => e[1] !== null)
);

/** Hi ha esforç calculat i tecnicitat amb font (condició comuna dels llistats). */
const prouDades = (d: DificultatOrientativa | null): d is DificultatOrientativa =>
	!!d && d.factors.esforc !== undefined && d.factors.tecnica !== undefined;

/**
 * Ruta apta per anar-hi amb nens (reimplementació a partir de `CRITERIS_LLISTATS_DIFICULTAT`):
 * desnivell, temps i tecnicitat **amb font** i dins dels límits, i nivell ≤ nivellMax.
 */
function rutaAptaNens(slug: string, r: RutaAcces): boolean {
	const c = CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'];
	const d = dificultatRuta(slug, r);
	if (!prouDades(d) || d.nivell > c.nivellMax) return false;
	if (!(c.tecnicitats as readonly Tecnicitat[]).includes(r.tecnicitat as Tecnicitat)) return false;
	if (r.desnivellPositiuM === undefined || r.desnivellPositiuM > c.desnivellMaxM) return false;
	if (r.tempsMinuts === undefined || r.tempsMinuts > c.tempsMaxMinuts) return false;
	return true;
}

/** Reimplementació dels criteris: fàcils mira la ruta normal; amb nens, qualsevol ruta. */
function entraAlLlistat(id: 'cims-facils' | 'cims-amb-nens', p: ContingutFitxa): boolean {
	if (id === 'cims-amb-nens') return p.rutes.some((r) => rutaAptaNens(p.slug, r));
	const d = NORMAL.get(p.slug) ?? null;
	if (!prouDades(d)) return false;
	return d.nivell <= CRITERIS_LLISTATS_DIFICULTAT['cims-facils'].nivellMax;
}
const ESPERAT_LLISTAT = {
	'cims-facils': PILOTS.filter((p) => entraAlLlistat('cims-facils', p)).map((p) => p.slug),
	'cims-amb-nens': PILOTS.filter((p) => entraAlLlistat('cims-amb-nens', p)).map((p) => p.slug)
};

// ── Lectura del DOM ──────────────────────────────────────────────────────────

interface BadgeLlista {
	slug: string;
	badge: null | {
		visible: string[];
		sr: string[];
		svgHidden: string | null;
		plens: number;
		pics: number;
	};
}

/** Distintius compactes de les files d'una llista de cims (`main .llista li`). */
function badgesLlista(page: Page, selector = 'main .llista li'): Promise<BadgeLlista[]> {
	return page.locator(selector).evaluateAll((lis) =>
		lis.map((li) => {
			const a = li.querySelector('a')!;
			const slug = new URL(a.getAttribute('href') ?? '', document.baseURI).pathname
				.split('/')
				.pop()!;
			const b = li.querySelector('.dif-mini');
			if (!b) return { slug, badge: null };
			const svg = b.querySelector('svg');
			return {
				slug,
				badge: {
					visible: [...b.children]
						.filter((c) => c.tagName.toLowerCase() !== 'svg' && !c.classList.contains('sr-only'))
						.map((c) => (c.textContent ?? '').trim()),
					sr: [...b.querySelectorAll('.sr-only')].map((s) => (s.textContent ?? '').trim()),
					svgHidden: svg?.getAttribute('aria-hidden') ?? null,
					plens: svg?.querySelectorAll('path.ple').length ?? 0,
					pics: svg?.querySelectorAll('path').length ?? 0
				}
			};
		})
	);
}

function esperatBadgeLlista(locale: Locale, d: DificultatOrientativa) {
	const nom = nomNivell(locale, d.nivell);
	return {
		visible: d.aproximada ? [nom, msg(locale, 'cim_difficulty_approx')] : [nom],
		sr: [
			msg(locale, 'cim_difficulty_list_sr', { nivell: nom }),
			...(d.aproximada ? [`(${msg(locale, 'cim_difficulty_approx_sr')})`] : [])
		],
		svgHidden: 'true',
		plens: d.nivell,
		pics: 4
	};
}

/** Comprova els distintius d'una llista: només als cims amb contingut i amb el nivell esperat. */
async function expectBadgesLlista(page: Page, locale: Locale, selector?: string) {
	const files = await badgesLlista(page, selector);
	expect(files.length, 'la llista té cims').toBeGreaterThan(0);
	const reals = files.map((f) => ({ slug: f.slug, badge: f.badge }));
	const esperats = files.map((f) => {
		const d = ESPERAT_LLISTES.get(f.slug);
		return { slug: f.slug, badge: d ? esperatBadgeLlista(locale, d) : null };
	});
	expect(reals).toEqual(esperats);
	return files.filter((f) => f.badge).map((f) => f.slug);
}

/** Distintiu complet (capçalera de la fitxa o targeta de ruta). */
async function expectBadgeComplet(
	page: Page,
	arrel: ReturnType<Page['locator']>,
	locale: Locale,
	d: DificultatOrientativa,
	ambAbast: boolean
) {
	const b = arrel.locator('.dif');
	await expect(b).toHaveCount(1);
	const nom = nomNivell(locale, d.nivell);
	// Etiqueta + abast
	await expect(b.locator('.label')).toContainText(msg(locale, 'cim_difficulty_label'));
	if (ambAbast)
		await expect(b.locator('.label')).toContainText(msg(locale, 'cim_difficulty_normal_route'));
	// Nivell en text visible (no només color ni forma)
	await expect(b.locator('.nivell strong')).toHaveText(nom);
	await expect(b.locator('.nivell strong')).toBeVisible();
	await expect(b.locator('.nivell .sr-only').first()).toHaveText(
		`(${msg(locale, 'cim_difficulty_level_sr', { nivell: d.nivell })})`
	);
	// Pics decoratius: aria-hidden, 4 formes, plens = nivell
	const svg = b.locator('svg.pics');
	await expect(svg).toHaveAttribute('aria-hidden', 'true');
	await expect(svg.locator('path')).toHaveCount(4);
	await expect(svg.locator('path.ple')).toHaveCount(d.nivell);
	// "aprox." i el desplegable amb les dades que falten
	const aprox = b.locator('.aprox');
	const details = b.locator('details.falten');
	if (d.aproximada) {
		await expect(aprox).toHaveText(msg(locale, 'cim_difficulty_approx'));
		await expect(aprox).toBeVisible();
		await expect(details).toHaveCount(1);
		await expect(details.locator('summary')).toHaveText(msg(locale, 'cim_difficulty_why_approx'));
		await details.locator('summary').click();
		await expect(details.locator('p')).toBeVisible();
		await expect(details.locator('p')).toHaveText(textFalten(locale, d.dadesQueFalten));
	} else {
		await expect(aprox).toHaveCount(0);
		await expect(details).toHaveCount(0);
	}
	// "No és el MIDE" i enllaç a la metodologia (ancla)
	await expect(b.locator('.peu')).toContainText(msg(locale, 'cim_difficulty_not_mide'));
	const enllac = b.getByRole('link', { name: msg(locale, 'cim_difficulty_how') });
	await expect(enllac).toHaveCount(1);
	await expectHref(enllac, `${metodologiaUrl(locale)}#${ANCLA}`);
}

// ── Text de les fitxes (sondes per buscar-lo dins del JS / __data.json) ──────

function sondes(c: ContingutFitxa): string[] {
	const out: string[] = [];
	for (const locale of LOCALES) {
		const textos = [
			...c.descripcio[locale],
			...(c.faq?.[locale] ?? []).map((f) => f.resposta),
			...c.rutes.map((r) => r.descripcio[locale])
		];
		for (const t of textos) {
			const millor = t
				.split(/[^A-Za-z0-9 ,.]+/)
				.map((s) => s.trim())
				.sort((a, b) => b.length - a.length)[0];
			if (millor && millor.length >= 25) out.push(millor);
		}
	}
	return out;
}

// ═══════════════════════════════════════════════════════════════════════════
// 0. Dades i oracle (sense navegador)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · dades dels pilots', () => {
	test.beforeEach(() => test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop'));

	test('les 10 pilots tenen dificultat a la ruta normal; l’oracle dels llistats coincideix amb el domini', () => {
		expect(PILOTS).toHaveLength(10);
		const taula: string[] = [];
		for (const p of PILOTS) {
			const d = NORMAL.get(p.slug);
			expect(d, `${p.slug}: dificultat de la ruta normal`).not.toBeNull();
			const r = p.rutes[0];
			const entrada = {
				ruta: {
					desnivellPositiuM: r.desnivellPositiuM,
					distanciaKm: r.distanciaKm,
					tempsMinuts: r.tempsMinuts,
					tecnicitat: r.tecnicitat,
					altitudCim: cim(p.slug).altitud
				},
				dificultat: d ?? null
			};
			expect(esRutaFacil(entrada), `${p.slug}: fàcil`).toBe(entraAlLlistat('cims-facils', p));
			const totes = p.rutes.map((x) => ({
				id: x.id,
				ruta: {
					desnivellPositiuM: x.desnivellPositiuM,
					distanciaKm: x.distanciaKm,
					tempsMinuts: x.tempsMinuts,
					tecnicitat: x.tecnicitat,
					altitudCim: cim(p.slug).altitud
				},
				dificultat: dificultatRuta(p.slug, x)
			}));
			expect(rutaAmbNens(totes) !== undefined, `${p.slug}: nens`).toBe(
				entraAlLlistat('cims-amb-nens', p)
			);
			taula.push(
				`${p.slug} (${cim(p.slug).altitud} m): nivell ${d!.nivell} ${d!.clau}` +
					` · km-esf ${d!.kmEsforc ?? '—'} (${d!.baseEsforc ?? '—'})` +
					` · factors ${JSON.stringify(d!.factors)}` +
					` · aprox ${d!.aproximada ? d!.dadesQueFalten.join('+') : 'no'}` +
					` · rutes: ${p.rutes.map((x) => `${x.id}=${dificultatRuta(p.slug, x)?.clau ?? 'null'}`).join(', ')}`
			);
		}
		const informe = `${taula.join('\n')}\nfàcils: ${ESPERAT_LLISTAT['cims-facils'].join(', ') || 'cap'}\namb nens: ${ESPERAT_LLISTAT['cims-amb-nens'].join(', ') || 'cap'}`;
		console.log(`Calibració pilots:\n${informe}`);
		test.info().annotations.push({ type: 'calibració', description: informe });
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. Fitxes pilot: distintiu a la capçalera i a cada ruta
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · fitxes pilot', () => {
	for (const p of PILOTS) {
		for (const locale of LOCALES) {
			test(`${p.slug} (${locale}): capçalera amb el nivell esperat, sota el H1, i cada ruta amb el seu`, async ({
				page
			}) => {
				await stubMaps(page);
				await gotoHydrated(page, fitxaUrl(p.slug, locale));
				const d = NORMAL.get(p.slug)!;
				const cap = page.locator('main .dif-cap');
				await expect(cap).toHaveCount(1);
				await expectBadgeComplet(page, cap, locale, d, true);

				// Sota el H1 (no hi interfereix): comença després que acabi el H1
				const h1 = await page.locator('main h1').boundingBox();
				const bb = await cap.boundingBox();
				expect(bb!.y, 'el distintiu va sota el H1').toBeGreaterThanOrEqual(h1!.y + h1!.height - 1);

				// Cada targeta de ruta: el seu distintiu si la dificultat es pot calcular, cap si no
				const articles = page.locator('section[aria-labelledby="rutes"] article');
				await expect(articles).toHaveCount(p.rutes.length);
				for (const [i, r] of p.rutes.entries()) {
					const dr = dificultatRuta(p.slug, r);
					const art = articles.nth(i);
					if (dr) await expectBadgeComplet(page, art, locale, dr, false);
					else
						await expect(art.locator('.dif'), `${r.id}: sense dades, sense distintiu`).toHaveCount(
							0
						);
					// El distintiu de la ruta no porta "ruta normal" (és de la ruta)
					if (dr) await expect(art.locator('.dif .abast')).toHaveCount(0);
				}
			});
		}
	}

	test('sense JS: el distintiu de capçalera ja és al HTML (no s’insereix al client)', async ({
		browser
	}) => {
		test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop');
		const ctx = await browser.newContext({ javaScriptEnabled: false });
		const page = await ctx.newPage();
		for (const p of PILOTS) {
			await page.goto(fitxaUrl(p.slug, 'ca'));
			await expect(page.locator('main .dif-cap .dif'), p.slug).toHaveCount(1);
			await expect(page.locator('main .dif-cap strong')).toHaveText(
				nomNivell('ca', NORMAL.get(p.slug)!.nivell)
			);
		}
		await ctx.close();
	});

	test('teclat: el desplegable "Per què és aproximada?" s’obre amb Enter', async ({
		page,
		browserName
	}) => {
		test.skip(browserName === 'webkit', 'WebKit no enfoca <summary> amb focus() de manera fiable');
		await stubMaps(page);
		await gotoHydrated(page, fitxaUrl('canigo', 'ca'));
		const det = page.locator('main .dif-cap details');
		await det.locator('summary').focus();
		await page.keyboard.press('Enter');
		await expect(det).toHaveAttribute('open', '');
		await expect(det.locator('p')).toBeVisible();
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. Fitxes sense contingut: cap distintiu (escombrat de les 150 × 2)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · fitxes sense contingut', () => {
	test('cap fitxa sense contingut porta distintiu; les pilots sí (HTML de les 150 × ca/es)', async ({
		request
	}) => {
		test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop');
		test.setTimeout(120_000);
		const errors: string[] = [];
		for (const c of CIMS) {
			for (const locale of LOCALES) {
				const html = await (await request.get(fitxaUrl(c.slug, locale))).text();
				const te = /class="dif-cap/.test(html);
				const esperat = SLUGS_PILOTS.has(c.slug) && NORMAL.get(c.slug) !== null;
				if (te !== esperat)
					errors.push(`${c.slug} (${locale}): distintiu=${te}, esperat=${esperat}`);
				if (!SLUGS_PILOTS.has(c.slug) && /class="dif[ "-]/.test(html))
					errors.push(`${c.slug} (${locale}): hi ha algun element .dif`);
			}
		}
		expect(errors).toEqual([]);
	});

	for (const locale of LOCALES) {
		test(`la-picossa i bastiments (${locale}): sense distintiu ni enllaç a la metodologia de dificultat`, async ({
			page
		}) => {
			await stubMaps(page);
			for (const slug of ['la-picossa', 'bastiments']) {
				await page.goto(fitxaUrl(slug, locale));
				await expect(page.locator('main h1')).toContainText(cim(slug).nom);
				await expect(page.locator('main .dif, main .dif-cap, main .dif-mini')).toHaveCount(0);
				await expect(page.locator(`main a[href*="#${ANCLA}"]`)).toHaveCount(0);
			}
		});
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Llistes: distintiu compacte només als cims amb contingut
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · llistes de cims', () => {
	for (const locale of LOCALES) {
		test(`/cims (${locale}): distintiu compacte només a les pilots, amb el nivell esperat`, async ({
			page
		}) => {
			await gotoHydrated(page, URL_LLISTAT.cims[locale]);
			const amb = await expectBadgesLlista(page, locale);
			expect(amb.sort()).toEqual([...ESPERAT_LLISTES.keys()].sort());
			// Nom accessible de l'enllaç: inclou la dificultat (no només color/forma)
			const d = ESPERAT_LLISTES.get('puigmal')!;
			const enllac = page.locator('main .llista a[href$="/puigmal"]');
			await expect(enllac).toContainText(nomNivell(locale, d.nivell));
			const nomAcc = await enllac.evaluate((a) => a.textContent?.replace(/\s+/g, ' ').trim());
			expect(nomAcc).toContain(
				msg(locale, 'cim_difficulty_list_sr', { nivell: nomNivell(locale, d.nivell) })
			);
		});

		test(`/cims-essencials i tresmils (${locale}): distintiu només a les pilots`, async ({
			page
		}) => {
			await page.goto(URL_LLISTAT.essencials[locale]);
			await expectBadgesLlista(page, locale);
			await page.goto(URL_LLISTAT.tresmils[locale]);
			await expectBadgesLlista(page, locale);
		});

		test(`comarques Ripollès, Bages i Vallès Occidental (${locale}): distintiu només a les pilots`, async ({
			page
		}) => {
			await stubMaps(page);
			for (const comarca of ['ripolles', 'bages', 'valles-occidental']) {
				await page.goto(comarcaUrl(comarca, locale));
				const amb = await expectBadgesLlista(page, locale);
				const pilotsComarca = PILOTS.filter((p) => cim(p.slug).comarca === comarca).map(
					(p) => p.slug
				);
				expect(amb.sort(), comarca).toEqual(pilotsComarca.sort());
			}
		});
	}

	test('/mapa (llista, HTML sense JS): distintiu només a les pilots', async ({ browser }) => {
		test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop');
		const ctx = await browser.newContext({ javaScriptEnabled: false });
		const page = await ctx.newPage();
		await stubMaps(page);
		for (const locale of LOCALES) {
			await page.goto(URL_LLISTAT.mapa[locale]);
			const amb = await expectBadgesLlista(page, locale);
			expect(amb.sort()).toEqual([...ESPERAT_LLISTES.keys()].sort());
		}
		await ctx.close();
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. Llistats /cims-facils i /cims-amb-nens
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Llistats de dificultat', () => {
	for (const id of ['cims-facils', 'cims-amb-nens'] as const) {
		for (const locale of LOCALES) {
			test(`${id} (${locale}): cims coherents amb els criteris, noindex si < 3, avisos i entradeta`, async ({
				page,
				request
			}) => {
				const esperats = ESPERAT_LLISTAT[id];
				const res = await page.goto(URL_LLISTAT[id][locale]);
				expect(res?.status()).toBe(200);
				await expect(page.locator('html')).toHaveAttribute('lang', locale);
				await expect(page.getByRole('heading', { level: 1 })).toHaveText(
					msg(locale, id === 'cims-facils' ? 'easy_title' : 'kids_title')
				);

				// Cims: exactament els que compleixen els criteris, cadascun amb el seu distintiu
				const files = await badgesLlista(page);
				expect(files.map((f) => f.slug).sort()).toEqual([...esperats].sort());
				await expectBadgesLlista(page, locale);
				for (const slug of esperats) {
					if (id === 'cims-facils') expect(NORMAL.get(slug)!.nivell).toBe(1);
					else {
						const p = PILOTS.find((x) => x.slug === slug)!;
						expect(p.rutes.some((r) => rutaAptaNens(slug, r))).toBe(true);
					}
				}
				// Tots els enllaços porten a una fitxa que existeix
				for (const slug of esperats)
					expect((await request.get(fitxaUrl(slug, locale))).status(), slug).toBe(200);

				// Entradeta amb el recompte i els llindars del domini
				const n = esperats.length;
				const c = CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'];
				const llindars = {
					desnivell: alt(c.desnivellMaxM),
					temps: `${Math.floor(c.tempsMaxMinuts / 60)} h${c.tempsMaxMinuts % 60 ? ` ${c.tempsMaxMinuts % 60} min` : ''}`
				};
				const pre = id === 'cims-facils' ? 'easy_lede' : 'kids_lede';
				const lede =
					n === 0
						? msg(locale, `${pre}_empty`)
						: n === 1
							? msg(locale, `${pre}_one`, llindars)
							: msg(locale, pre, { count: n, ...llindars });
				await expect(page.locator('main .lede')).toHaveText(lede);

				// noindex mentre < 3 cims (els enllaços es continuen seguint)
				const robots = page.locator('meta[name="robots"]');
				if (n < 3) {
					await expect(robots).toHaveAttribute('content', /noindex/);
					await expect(robots).not.toHaveAttribute('content', /nofollow/);
					await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
				} else {
					await expect(robots).toHaveCount(0);
				}

				// Avisos: no és el MIDE, enllaç a la metodologia, i seguretat a la de nens
				const head = page.locator('main .page-head');
				await expect(head).toContainText(msg(locale, 'difficulty_list_disclaimer'));
				await expect(head).toContainText(msg(locale, 'difficulty_list_growing'));
				const metode = head.getByRole('link', { name: msg(locale, 'difficulty_list_method_link') });
				await expectHref(metode, `${metodologiaUrl(locale)}#${ANCLA}`);
				if (id === 'cims-amb-nens') await expect(head).toContainText(msg(locale, 'kids_safety'));
				else await expect(head).not.toContainText(msg(locale, 'kids_safety'));

				// JSON-LD: ItemList amb tants elements com cims
				const nodes = await jsonLdNodes(page);
				const llista = nodes.find((x) => x['@type'] === 'ItemList');
				if (llista) expect(llista.numberOfItems).toBe(n);
			});
		}
	}

	test('fora del sitemap mentre tenen < 3 cims', async ({ request }) => {
		test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop');
		const index = await (await request.get('/sitemap-index.xml')).text();
		const fills = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
		expect(fills.length).toBeGreaterThan(2);
		const tots: string[] = [];
		for (const f of fills) {
			const xml = await (await request.get(f)).text();
			tots.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
			tots.push(...[...xml.matchAll(/href="([^"]+)"/g)].map((m) => new URL(m[1]).pathname));
		}
		expect(tots.length).toBeGreaterThan(100);
		for (const id of ['cims-facils', 'cims-amb-nens'] as const) {
			const urls = Object.values(URL_LLISTAT[id]);
			const presents = tots.filter((u) => (urls as string[]).includes(u));
			if (ESPERAT_LLISTAT[id].length < 3) expect(presents, id).toEqual([]);
			else expect(new Set(presents), id).toEqual(new Set(urls));
		}
		// Els llistats de catàleg sí que hi són
		expect(tots).toContain('/ca/cims-essencials');
	});

	for (const locale of LOCALES) {
		test(`enllaçats des de la navegació "Explora" dels llistats (${locale})`, async ({ page }) => {
			const nomNav = msg(locale, 'explore_label');
			for (const origen of [
				'essencials',
				'tresmils',
				'mes-alts',
				'cims-facils',
				'cims-amb-nens'
			] as const) {
				await page.goto(URL_LLISTAT[origen][locale]);
				const nav = page.getByRole('navigation', { name: nomNav });
				const hrefs = await hrefsAbsoluts(nav.locator('a'));
				for (const desti of ['cims-facils', 'cims-amb-nens'] as const) {
					if (desti === origen)
						expect(hrefs, `${origen} no s'enllaça a si mateix`).not.toContain(
							URL_LLISTAT[desti][locale]
						);
					else expect(hrefs, `${origen} → ${desti}`).toContain(URL_LLISTAT[desti][locale]);
				}
			}
			// Informatiu: altres "Explora" (portada, /cims, peu) que encara no els enllacen
			const sense: string[] = [];
			for (const url of [`/${locale}`, URL_LLISTAT.cims[locale]]) {
				await page.goto(url);
				const hrefs = await hrefsAbsoluts(page.locator('a'));
				for (const desti of ['cims-facils', 'cims-amb-nens'] as const)
					if (!hrefs.includes(URL_LLISTAT[desti][locale])) sense.push(`${url} ✗ ${desti}`);
			}
			test
				.info()
				.annotations.push({ type: 'sense enllaç', description: sense.join('; ') || 'cap' });
		});

		test(`navegació del client fins als llistats (${locale}): mateix contingut que el HTML`, async ({
			page
		}) => {
			await gotoHydrated(page, URL_LLISTAT.essencials[locale]);
			const nav = page.getByRole('navigation', { name: msg(locale, 'explore_label') });
			await nav.getByRole('link', { name: msg(locale, 'explore_kids') }).click();
			await expect(page).toHaveURL(new RegExp(`${URL_LLISTAT['cims-amb-nens'][locale]}$`));
			await waitForHydration(page);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(msg(locale, 'kids_title'));
			expect((await badgesLlista(page)).map((f) => f.slug).sort()).toEqual(
				[...ESPERAT_LLISTAT['cims-amb-nens']].sort()
			);
			await expectBadgesLlista(page, locale);
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
				'content',
				ESPERAT_LLISTAT['cims-amb-nens'].length < 3 ? /noindex/ : /index/
			);
		});
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. Metodologia: ancla i llindars = ESCALA_DIFICULTAT
// ═══════════════════════════════════════════════════════════════════════════

/** "2.500", "1,4" (separador de milers sempre, com `formatAltitude`). */
const num = (n: number) =>
	new Intl.NumberFormat('de-DE', { useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);
const durada = (min: number) =>
	[Math.floor(min / 60) ? `${Math.floor(min / 60)} h` : '', min % 60 ? `${min % 60} min` : '']
		.filter(Boolean)
		.join(' ');

test.describe('Dificultat · metodologia', () => {
	for (const locale of LOCALES) {
		test(`(${locale}) "Com es calcula" porta a la secció i els llindars coincideixen amb ESCALA_DIFICULTAT`, async ({
			page
		}) => {
			await stubMaps(page);
			await gotoHydrated(page, fitxaUrl('puigmal', locale));
			await page
				.locator('main .dif-cap')
				.getByRole('link', { name: msg(locale, 'cim_difficulty_how') })
				.click();
			await expect(page).toHaveURL(new RegExp(`${metodologiaUrl(locale)}#${ANCLA}$`));
			const seccio = page.locator(`#${ANCLA}`);
			await expect(seccio).toHaveCount(1);
			const h2 = seccio.locator('h2');
			await expect(h2).toHaveText(msg(locale, 'cim_difficulty_label'));
			await expect(h2).toBeInViewport();
			// El títol no queda tapat per cap capçalera fixa (un cop acabat el desplaçament)
			await expect
				.poll(
					() =>
						h2.evaluate((el) => {
							const r = el.getBoundingClientRect();
							const x = r.left + Math.min(20, r.width / 2);
							const top = document.elementFromPoint(x, r.top + r.height / 2);
							return top && !el.contains(top) ? `${top.tagName}.${top.className}` : null;
						}),
					{ message: 'H2 de la secció tapat' }
				)
				.toBeNull();

			const text = ((await seccio.textContent()) ?? '').replace(/\s+/g, ' ');
			const nom = (n: NivellDificultat) => nomNivell(locale, n);
			const { metresPerKmEsforc, minutsPerKmEsforc, factorNomesDesnivell, llindarsKmEsforc } =
				ESCALA_DIFICULTAT.esforc;
			const [l1, l2, l3] = llindarsKmEsforc;
			const [a2, a3] = ESCALA_DIFICULTAT.altitud.llindarsM;
			const ca = locale === 'ca';
			const esperats = [
				ca
					? `Fins a ${num(l1)} → ${nom(1)}; fins a ${num(l2)} → ${nom(2)}; fins a ${num(l3)} → ${nom(3)}; més de ${num(l3)} → ${nom(4)}`
					: `Hasta ${num(l1)} → ${nom(1)}; hasta ${num(l2)} → ${nom(2)}; hasta ${num(l3)} → ${nom(3)}; más de ${num(l3)} → ${nom(4)}`,
				`${ca ? 'dividit per' : 'dividido por'} ${num(metresPerKmEsforc)} (${num(metresPerKmEsforc)} m`,
				`cada ${num(minutsPerKmEsforc)} min`,
				`/ ${num(metresPerKmEsforc)} × ${num(factorNomesDesnivell)}`,
				ca
					? `de ${num(a2)} a ${num(a3 - 1)} m, com a mínim ${nom(2)}; a partir de ${num(a3)} m, com a mínim ${nom(3)}`
					: `de ${num(a2)} a ${num(a3 - 1)} m, como mínimo ${nom(2)}; a partir de ${num(a3)} m, como mínimo ${nom(3)}`,
				ca
					? `ruta normal de nivell ${nom(CRITERIS_LLISTATS_DIFICULTAT['cims-facils'].nivellMax)}`
					: `ruta normal de nivel ${nom(CRITERIS_LLISTATS_DIFICULTAT['cims-facils'].nivellMax)}`,
				ca
					? `com a màxim ${num(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'].desnivellMaxM)} m de desnivell i ${durada(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'].tempsMaxMinuts)} d'anada`
					: `como máximo ${num(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'].desnivellMaxM)} m de desnivel y ${durada(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'].tempsMaxMinuts)} de ida`
			];
			for (const e of esperats) expect(text, e).toContain(e);

			// Pas més tècnic: un "→ Nivell" per valor, en l'ordre de l'escala
			const itemTecnica = seccio
				.locator('li')
				.filter({ hasText: ca ? 'Pas més tècnic:' : 'Paso más técnico:' });
			await expect(itemTecnica).toHaveCount(1);
			const fletxes = [...((await itemTecnica.textContent()) ?? '').matchAll(/→ ([^;.]+)/g)].map(
				(m) => m[1].trim()
			);
			expect(fletxes).toEqual(
				(Object.values(ESCALA_DIFICULTAT.tecnica) as NivellDificultat[]).map((n) => nom(n))
			);
			// Nivells de nens: tots els ≤ nivellMax
			const nivellsNens = ESCALA_DIFICULTAT.nivells
				.filter((n) => n.nivell <= CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'].nivellMax)
				.map((n) => nom(n.nivell))
				.join(' o ');
			expect(text).toContain(nivellsNens);

			// Enllaços de la secció als llistats, localitzats
			await expectHref(
				seccio.locator('a', { hasText: ca ? 'cims fàcils' : 'cimas fáciles' }),
				URL_LLISTAT['cims-facils'][locale]
			);
			await expectHref(
				seccio.locator('a', {
					hasText: ca ? 'cims per fer amb nens' : 'cimas para hacer con niños'
				}),
				URL_LLISTAT['cims-amb-nens'][locale]
			);
		});
	}
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. El text de les fitxes no va al JS del client ni a les dades de les llistes
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · sense text de fitxes al client', () => {
	const SONDES = PILOTS.flatMap((p) => sondes(p).map((s) => ({ slug: p.slug, s })));

	test('chunks JS i __data.json de llistes i llistats: cap text de fitxa, només el mapa lleuger', async ({
		page,
		request
	}) => {
		expect(SONDES.length).toBeGreaterThan(80);
		const chunks = new Map<string, Promise<string>>();
		page.on('response', (r) => {
			const u = new URL(r.url());
			if (u.pathname.startsWith('/_app/') && u.pathname.endsWith('.js') && r.ok())
				chunks.set(
					u.pathname,
					r.text().catch(() => '')
				);
		});
		await gotoHydrated(page, URL_LLISTAT['cims-facils'].ca);
		const nav = page.getByRole('navigation', { name: msg('ca', 'explore_label') });
		await nav.getByRole('link', { name: msg('ca', 'explore_kids') }).click();
		await expect(page).toHaveURL(/cims-amb-nens$/);
		await waitForHydration(page);
		expect(chunks.size).toBeGreaterThan(3);
		const trobades: string[] = [];
		for (const [cami, cos] of chunks) {
			const text = await cos;
			for (const { slug, s } of SONDES)
				if (text.includes(s)) trobades.push(`${cami}: ${slug} «${s}»`);
		}
		expect(trobades).toEqual([]);

		// __data.json de les pàgines amb distintius: sense text ni camps de ruta
		const PROHIBITS = [
			'descripcio',
			'tecnicitat',
			'desnivellPositiuM',
			'distanciaKm',
			'tempsMinuts',
			'fonts'
		];
		for (const url of [
			URL_LLISTAT['cims-facils'].ca,
			URL_LLISTAT['cims-amb-nens'].es,
			URL_LLISTAT.cims.ca,
			URL_LLISTAT.essencials.es,
			comarcaUrl('ripolles', 'ca')
		]) {
			const res = await request.get(`${url}/__data.json`);
			expect(res.status(), url).toBe(200);
			const cos = await res.text();
			for (const { slug, s } of SONDES)
				expect(cos.includes(s), `${url}: ${slug} «${s}»`).toBe(false);
			for (const camp of PROHIBITS)
				expect(cos.includes(`"${camp}"`), `${url}: camp ${camp}`).toBe(false);
		}
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. axe (clar i fosc), reflow a 320 px i CLS
// ═══════════════════════════════════════════════════════════════════════════

const PAGINES_AXE: { nom: string; url: string; obre?: boolean }[] = [
	{ nom: 'fitxa Canigó (aprox., desplegat)', url: fitxaUrl('canigo', 'ca'), obre: true },
	{ nom: 'fitxa Puigmal (es)', url: fitxaUrl('puigmal', 'es') },
	{ nom: 'cims-facils', url: URL_LLISTAT['cims-facils'].ca },
	{ nom: 'cims-amb-nens (es)', url: URL_LLISTAT['cims-amb-nens'].es },
	{ nom: 'comarca Ripollès', url: comarcaUrl('ripolles', 'ca') },
	{ nom: 'metodologia', url: `${metodologiaUrl('ca')}#${ANCLA}` }
];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`Dificultat · axe ${colorScheme}`, () => {
		test.use({ colorScheme });
		for (const p of PAGINES_AXE) {
			test(`${p.nom} sense violacions WCAG 2.2 AA`, async ({ page }) => {
				await stubMaps(page);
				await gotoHydrated(page, p.url);
				if (p.obre) {
					for (const s of await page.locator('main details.falten summary').all()) await s.click();
				}
				await expectNoAxeViolations(page);
			});
		}
	});
}

test.describe('Dificultat · reflow a 320 px', () => {
	test.use({ viewport: { width: 320, height: 640 } });
	for (const locale of LOCALES) {
		test(`(${locale}) pilots amb els desplegables oberts, llistats i metodologia sense scroll horitzontal`, async ({
			page
		}) => {
			test.setTimeout(120_000);
			await stubMaps(page);
			const dolents: string[] = [];
			for (const p of PILOTS) {
				await page.goto(fitxaUrl(p.slug, locale));
				for (const s of await page.locator('main details.falten summary').all()) await s.click();
				const o = await overflowX(page);
				if (o.px > 0 || o.culprit) dolents.push(`${p.slug}: ${o.px}px ${o.culprit}`);
				// La "pastilla" del nivell no surt del seu contenidor
				const fora = await page.locator('main .dif .nivell').evaluateAll(
					(els) =>
						els.filter((el) => {
							const pare = el.closest('.dif')!.getBoundingClientRect();
							return el.getBoundingClientRect().right > pare.right + 0.5;
						}).length
				);
				if (fora) dolents.push(`${p.slug}: ${fora} pastilles fora del distintiu`);
			}
			for (const url of [
				URL_LLISTAT['cims-facils'][locale],
				URL_LLISTAT['cims-amb-nens'][locale],
				URL_LLISTAT.cims[locale],
				comarcaUrl('ripolles', locale),
				metodologiaUrl(locale)
			]) {
				await page.goto(url);
				const o = await overflowX(page);
				if (o.px > 0 || o.culprit) dolents.push(`${url}: ${o.px}px ${o.culprit}`);
				// Distintiu compacte dins la fila
				const fora = await page
					.locator('main .llista li .dif-mini')
					.evaluateAll(
						(els) =>
							els.filter(
								(el) =>
									el.getBoundingClientRect().right >
									el.closest('a')!.getBoundingClientRect().right + 0.5
							).length
					);
				if (fora) dolents.push(`${url}: ${fora} distintius fora de la fila`);
			}
			expect(dolents).toEqual([]);
		});
	}
});

declare global {
	interface Window {
		__clsDif?: {
			total: number;
			shifts: { v: number; nodes: string[]; distintiu: boolean }[];
		};
	}
}

/**
 * Observador de layout-shift: per a cada font del desplaçament anota l'element (el pare si és un
 * node de text), el rect abans/després i si és dins el distintiu de dificultat (`.dif-cap`).
 */
function observaClsDif() {
	window.__clsDif = { total: 0, shifts: [] };
	new PerformanceObserver((llista) => {
		for (const e of llista.getEntries() as (PerformanceEntry & {
			value: number;
			hadRecentInput: boolean;
			sources?: {
				node?: Node | null;
				previousRect: DOMRectReadOnly;
				currentRect: DOMRectReadOnly;
			}[];
		})[]) {
			if (e.hadRecentInput) continue;
			window.__clsDif!.total += e.value;
			let distintiu = false;
			const nodes = (e.sources ?? []).map((s) => {
				const n = s.node ?? null;
				const el = (n && n.nodeType === 3 ? n.parentElement : n) as HTMLElement | null;
				if (!el) return '?';
				const dinsDif = !!el.closest('.dif-cap');
				const vertical =
					Math.abs(s.previousRect.y - s.currentRect.y) > 0.5 ||
					Math.abs(s.previousRect.height - s.currentRect.height) > 0.5;
				if (dinsDif && vertical) distintiu = true;
				const cls = String(el.className || '').split(' ')[0];
				return `${n?.nodeType === 3 ? '#text in ' : ''}${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} y${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)}`;
			});
			window.__clsDif!.shifts.push({ v: Math.round(e.value * 10000) / 10000, nodes, distintiu });
		}
	}).observe({ type: 'layout-shift', buffered: true });
}

test.describe('Dificultat · CLS del H1 (Chromium)', () => {
	/**
	 * Pitjor cas: fonts lentes (800 ms). El distintiu va sota el H1 i és al HTML del servidor:
	 * no s'ha de moure verticalment en hidratar ni en arribar Archivo, i la caixa del H1 tampoc.
	 * El CLS total de la pàgina és informatiu (La Mola a 768 px té un reflux horitzontal del H1
	 * conegut del bloc 6a, independent del distintiu).
	 */
	for (const ample of [320, 375, 768]) {
		test(`${ample} px, fonts lentes: el distintiu i la caixa del H1 no es desplacen en carregar`, async ({
			browser
		}, ti) => {
			test.skip(ti.project.name !== 'mobile-chrome', 'un sol projecte Chromium mòbil');
			test.setTimeout(240_000);
			const informe: string[] = [];
			const dolents: string[] = [];
			for (const p of PILOTS) {
				const ctx = await browser.newContext({
					viewport: { width: ample, height: ample >= 768 ? 1024 : 740 },
					deviceScaleFactor: 2,
					isMobile: ample < 768,
					hasTouch: true,
					serviceWorkers: 'block'
				});
				await ctx.addInitScript(observaClsDif);
				const page = await ctx.newPage();
				await stubMaps(page);
				await page.route(/\.woff2(\?|$)/, async (r) => {
					await new Promise((res) => setTimeout(res, 800));
					await r.continue();
				});
				await page.goto(fitxaUrl(p.slug, 'ca'), { waitUntil: 'domcontentloaded' });
				const caixa = () =>
					page.evaluate(() => {
						const h = document.querySelector('main h1')!.getBoundingClientRect();
						const d = document.querySelector('main .dif-cap')!.getBoundingClientRect();
						return { h1y: h.y + scrollY, h1h: h.height, dify: d.y + scrollY };
					});
				const abans = await caixa();
				await waitForHydration(page);
				await page.evaluate(() => document.fonts.ready);
				await page.waitForTimeout(1200);
				const despres = await caixa();
				const c = (await page.evaluate(() => window.__clsDif))!;
				await ctx.close();
				informe.push(
					`${p.slug}=${Math.round(c.total * 1000) / 1000} ${c.shifts.map((s) => `${s.v}[${s.nodes.join(', ')}]`).join(' ')}`
				);
				for (const s of c.shifts.filter((x) => x.distintiu))
					dolents.push(`${p.slug}: el distintiu es desplaça ${s.v} [${s.nodes.join(', ')}]`);
				if (
					Math.abs(despres.h1y - abans.h1y) > 1 ||
					Math.abs(despres.h1h - abans.h1h) > 1 ||
					Math.abs(despres.dify - abans.dify) > 1
				)
					dolents.push(`${p.slug}: ${JSON.stringify(abans)} → ${JSON.stringify(despres)}`);
			}
			ti.annotations.push({ type: `CLS ${ample}px`, description: informe.join('\n') });
			console.log(`CLS dificultat ${ample}px (fonts lentes):\n${informe.join('\n')}`);
			expect(dolents).toEqual([]);
		});
	}
});
