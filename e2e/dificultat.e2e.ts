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
	type NivellDificultat
} from '../src/lib/domain/dificultat.ts';
import type { ContingutFitxa, RutaAcces } from '../src/lib/content/fitxes/types.ts';
import {
	BUGS_H1_768,
	FITXES,
	FITXERS_FITXES,
	NENS,
	PILOTS,
	SLUGS_FITXES,
	SLUGS_PILOTS,
	altitudCim,
	dificultatRutaOracle,
	esFacilOracle,
	nomCurtOracle,
	rutaAptaNensOracle,
	rutaNensOracle,
	separaConeguts,
	type Dada,
	type DificultatOracle
} from './fitxes-contingut';

/**
 * Blocs 6a-bis i 6b · "Dificultat orientativa" (estimació pròpia, no és el MIDE) i llistats
 * `/cims-facils` i `/cims-amb-nens`, sobre **totes les fitxes** amb contingut (50 al bloc 6b).
 *
 * - Les fitxes es descobreixen al disc (`e2e/fitxes-contingut.ts`): cap llista copiada a mà.
 * - Els nivells esperats surten d'un **oracle independent** (`dificultatOracle`, fórmula de
 *   docs/05: km-esforç = km + D+/100 o minuts/15, llindars 7/15/22, tècnica i altitud) i dels
 *   criteris documentats dels llistats (amb nens: D+ ≤ 600, ≤ 150 min, cap/terreny irregular amb
 *   font, nivell ≤ 2). La prova de dades (secció 0) el contrasta amb el domini de l'app.
 * - Render al navegador: totes a `desktop-chrome`; als projectes mòbils, les 10 pilots del 6a.
 * - Els textos de la interfície surten de `messages/{ca,es}.json`.
 */

const cim = (slug: string) => {
	const c = CIMS.find((x) => x.slug === slug);
	if (!c) throw new Error(`${slug} no és al catàleg`);
	return c;
};

/** Fitxes que es renderitzen en aquest projecte (totes a escriptori, les pilots als mòbils). */
const fitxesDelProjecte = (projecte: string): ContingutFitxa[] =>
	projecte === 'desktop-chrome' ? FITXES : PILOTS;

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
const nomDada = (locale: Locale, d: Dada) => msg(locale, `cim_difficulty_data_${d}`);

/** Text de "Per què és aproximada?" tal com el construeix el distintiu (Intl.ListFormat). */
const textFalten = (locale: Locale, dades: readonly Dada[]) =>
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

// ── Oracle (e2e/fitxes-contingut.ts, independent del codi de l'app) ─────────

const dificultatRuta = dificultatRutaOracle;

/** Dificultat de la ruta normal (la primera) de cada fitxa. */
const NORMAL = new Map(FITXES.map((p) => [p.slug, dificultatRuta(p.slug, p.rutes[0])]));
/** Mapa esperat a les llistes: només cims amb contingut i dificultat calculable. */
const ESPERAT_LLISTES = new Map(
	[...NORMAL].filter((e): e is [string, DificultatOracle] => e[1] !== null)
);

/** Alguna ruta de la fitxa té dificultat calculable (hi haurà algun element `.dif`). */
const algunaRutaAmbDificultat = (p: ContingutFitxa) =>
	p.rutes.some((r) => dificultatRuta(p.slug, r) !== null);

const rutaAptaNens = rutaAptaNensOracle;

/** Criteris documentats: fàcils mira la ruta normal; amb nens, qualsevol ruta (la més fàcil). */
function entraAlLlistat(id: 'cims-facils' | 'cims-amb-nens', p: ContingutFitxa): boolean {
	return id === 'cims-facils' ? esFacilOracle(p) : rutaNensOracle(p) !== undefined;
}
const ESPERAT_LLISTAT = {
	'cims-facils': FITXES.filter((p) => entraAlLlistat('cims-facils', p)).map((p) => p.slug),
	'cims-amb-nens': FITXES.filter((p) => entraAlLlistat('cims-amb-nens', p)).map((p) => p.slug)
};
/** Ruta per anar-hi amb nens de cada cim del llistat (la de la línia "Des de …"). */
const RUTA_NENS = new Map(
	FITXES.flatMap((p) => {
		const r = rutaNensOracle(p);
		return r ? [[p.slug, r] as const] : [];
	})
);
/**
 * Distintius esperats a `/cims-amb-nens`: allà el distintiu és el de la ruta per anar-hi amb nens
 * (la de la línia "Des de …"), no el de la ruta normal.
 */
const ESPERAT_BADGES_NENS = new Map(
	[...RUTA_NENS].map(([slug, r]) => [slug, dificultatRuta(slug, r)!] as const)
);

/** Entrada del domini per a una ruta (només per contrastar l'oracle amb l'app a la secció 0). */
const entradaDomini = (slug: string, r: RutaAcces) => {
	const ruta = {
		desnivellPositiuM: r.desnivellPositiuM,
		distanciaKm: r.distanciaKm,
		tempsMinuts: r.tempsMinuts,
		tecnicitat: r.tecnicitat,
		altitudCim: altitudCim(slug)
	};
	return { id: r.id, ruta, dificultat: dificultatOrientativa(ruta) };
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

function esperatBadgeLlista(locale: Locale, d: DificultatOracle) {
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
async function expectBadgesLlista(
	page: Page,
	locale: Locale,
	selector?: string,
	esperat: ReadonlyMap<string, DificultatOracle> = ESPERAT_LLISTES
) {
	const files = await badgesLlista(page, selector);
	expect(files.length, 'la llista té cims').toBeGreaterThan(0);
	const reals = files.map((f) => ({ slug: f.slug, badge: f.badge }));
	const esperats = files.map((f) => {
		const d = esperat.get(f.slug);
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
	d: DificultatOracle,
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

/** Talla una llista en trossos de `n` (tests més curts i paral·lelitzables). */
const trossos = <T>(xs: readonly T[], n: number): T[][] =>
	Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));

// ═══════════════════════════════════════════════════════════════════════════
// 0. Dades i oracle (sense navegador)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · dades de les fitxes', () => {
	test.beforeEach(() => test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop'));

	test('fitxes descobertes = fitxers; l’oracle independent coincideix amb el domini a totes les rutes i als dos llistats', () => {
		expect(FITXES.length, 'fitxes amb contingut').toBeGreaterThanOrEqual(50);
		expect([...FITXERS_FITXES].sort(), 'nom de fitxer = slug').toEqual(
			FITXES.map((f) => f.slug).sort()
		);
		expect(
			[...SLUGS_PILOTS].every((s) => SLUGS_FITXES.has(s)),
			'les 10 pilots hi són'
		).toBe(true);
		// L'oracle fa servir els llindars de la documentació: si l'app els canvia, cal saber-ho.
		expect(ESCALA_DIFICULTAT.esforc.llindarsKmEsforc).toEqual([7, 15, 22]);
		expect(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens']).toMatchObject({
			desnivellMaxM: NENS.desnivellMaxM,
			tempsMaxMinuts: NENS.tempsMaxMinuts,
			nivellMax: NENS.nivellMax,
			tecnicitats: ['cap', 'terreny-irregular']
		});
		const errors: string[] = [];
		const taula: string[] = [];
		for (const p of FITXES) {
			const rutes = p.rutes.map((r) => entradaDomini(p.slug, r));
			for (const [i, r] of p.rutes.entries()) {
				const o = dificultatRuta(p.slug, r);
				const a = rutes[i].dificultat;
				const so = o && JSON.stringify([o.nivell, o.aproximada, o.dadesQueFalten, o.factors]);
				const sa = a && JSON.stringify([a.nivell, a.aproximada, a.dadesQueFalten, a.factors]);
				if (so !== sa) errors.push(`${p.slug}/${r.id}: oracle ${so} ≠ domini ${sa}`);
			}
			if (esRutaFacil(rutes[0]) !== esFacilOracle(p))
				errors.push(`${p.slug}: fàcil domini=${esRutaFacil(rutes[0])}`);
			const nensDomini = rutaAmbNens(rutes)?.id;
			const nensOracle = rutaNensOracle(p)?.id;
			if (nensDomini !== nensOracle)
				errors.push(`${p.slug}: ruta amb nens domini=${nensDomini} oracle=${nensOracle}`);
			const d = NORMAL.get(p.slug);
			taula.push(
				`${p.slug} (${altitudCim(p.slug)} m): ` +
					(d
						? `nivell ${d.nivell} · km-esf ${d.kmEsforc?.toFixed(1) ?? '—'} · factors ${JSON.stringify(d.factors)} · aprox ${d.aproximada ? d.dadesQueFalten.join('+') : 'no'}`
						: 'sense dificultat a la ruta normal') +
					` · rutes: ${p.rutes.map((x) => `${x.id}=${dificultatRuta(p.slug, x)?.nivell ?? 'null'}`).join(', ')}`
			);
		}
		expect(errors).toEqual([]);
		const informe = `${taula.join('\n')}\nfàcils (${ESPERAT_LLISTAT['cims-facils'].length}): ${ESPERAT_LLISTAT['cims-facils'].join(', ') || 'cap'}\namb nens (${ESPERAT_LLISTAT['cims-amb-nens'].length}): ${[...RUTA_NENS].map(([s, r]) => `${s}→${r.id}`).join(', ') || 'cap'}`;
		console.log(`Calibració de les ${FITXES.length} fitxes:\n${informe}`);
		test.info().annotations.push({ type: 'calibració', description: informe });
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. Fitxes amb contingut: distintiu a la capçalera i a cada ruta
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Dificultat · fitxes amb contingut', () => {
	for (const p of FITXES) {
		for (const locale of LOCALES) {
			test(`${p.slug} (${locale}): capçalera amb el nivell esperat, sota el H1, i cada ruta amb el seu`, async ({
				page
			}, ti) => {
				test.skip(
					!fitxesDelProjecte(ti.project.name).includes(p),
					'als mòbils, només les 10 pilots (les 50 a desktop-chrome)'
				);
				await stubMaps(page);
				await gotoHydrated(page, fitxaUrl(p.slug, locale));
				const d = NORMAL.get(p.slug) ?? null;
				const cap = page.locator('main .dif-cap');
				if (!d) {
					// Ruta normal sense prou dades: cap distintiu a la capçalera
					await expect(cap).toHaveCount(0);
				} else {
					await expect(cap).toHaveCount(1);
					await expectBadgeComplet(page, cap, locale, d, true);

					// Sota el H1 (no hi interfereix): comença després que acabi el H1
					const h1 = await page.locator('main h1').boundingBox();
					const bb = await cap.boundingBox();
					expect(bb!.y, 'el distintiu va sota el H1').toBeGreaterThanOrEqual(
						h1!.y + h1!.height - 1
					);
				}

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
		test.setTimeout(30_000 + FITXES.length * 2_000);
		const ctx = await browser.newContext({ javaScriptEnabled: false });
		const page = await ctx.newPage();
		for (const p of FITXES) {
			const d = NORMAL.get(p.slug);
			await page.goto(fitxaUrl(p.slug, 'ca'));
			await expect(page.locator('main .dif-cap .dif'), p.slug).toHaveCount(d ? 1 : 0);
			if (d)
				await expect(page.locator('main .dif-cap strong'), p.slug).toHaveText(
					nomNivell('ca', d.nivell)
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
	test('cap fitxa sense contingut porta distintiu; les que en tenen, segons l’oracle (HTML de les 150 × ca/es)', async ({
		request
	}) => {
		test.skip(test.info().project.name !== 'desktop-chrome', 'només un cop');
		test.setTimeout(120_000);
		const errors: string[] = [];
		for (const c of CIMS) {
			const f = FITXES.find((x) => x.slug === c.slug);
			for (const locale of LOCALES) {
				const html = await (await request.get(fitxaUrl(c.slug, locale))).text();
				const te = /class="dif-cap/.test(html);
				const esperat = !!f && (NORMAL.get(c.slug) ?? null) !== null;
				if (te !== esperat)
					errors.push(`${c.slug} (${locale}): distintiu=${te}, esperat=${esperat}`);
				const algun = /class="dif[ "-]/.test(html);
				const algunEsperat = !!f && algunaRutaAmbDificultat(f);
				if (algun !== algunEsperat)
					errors.push(`${c.slug} (${locale}): algun .dif=${algun}, esperat=${algunEsperat}`);
			}
		}
		expect(errors).toEqual([]);
	});

	/** Una fitxa amb contingut però sense cap ruta amb dades (si n'hi ha) i una sense contingut. */
	const SENSE_DIFICULTAT = [
		...FITXES.filter((f) => !algunaRutaAmbDificultat(f))
			.slice(0, 1)
			.map((f) => f.slug),
		CIMS.find((c) => !SLUGS_FITXES.has(c.slug))!.slug
	];

	for (const locale of LOCALES) {
		test(`${SENSE_DIFICULTAT.join(' i ')} (${locale}): sense distintiu ni enllaç a la metodologia de dificultat`, async ({
			page
		}) => {
			await stubMaps(page);
			for (const slug of SENSE_DIFICULTAT) {
				// Hidratada (i no només carregada): el distintiu tampoc no apareix al client, i el
				// `goto` següent no avorta imports en curs (WebKit: "Importing a module script failed").
				await gotoHydrated(page, fitxaUrl(slug, locale));
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
		test(`/cims (${locale}): distintiu compacte només als cims amb dificultat, amb el nivell esperat`, async ({
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

		test(`/cims-essencials i tresmils (${locale}): distintiu només als cims amb dificultat`, async ({
			page
		}) => {
			await page.goto(URL_LLISTAT.essencials[locale]);
			await expectBadgesLlista(page, locale);
			await page.goto(URL_LLISTAT.tresmils[locale]);
			await expectBadgesLlista(page, locale);
		});

		test(`comarques amb fitxes (${locale}): distintiu només als cims amb dificultat`, async ({
			page
		}, ti) => {
			// Escriptori: totes les comarques amb alguna fitxa amb contingut; mòbils: una mostra.
			const comarques =
				ti.project.name === 'desktop-chrome'
					? [...new Set(FITXES.map((f) => cim(f.slug).comarca))].sort()
					: ['ripolles', 'bages', 'valles-occidental'];
			test.setTimeout(30_000 + comarques.length * 3_000);
			await stubMaps(page);
			for (const comarca of comarques) {
				await page.goto(comarcaUrl(comarca, locale));
				const amb = await expectBadgesLlista(page, locale);
				const ambDificultat = [...ESPERAT_LLISTES.keys()].filter(
					(slug) => cim(slug).comarca === comarca
				);
				expect(amb.sort(), comarca).toEqual(ambDificultat.sort());
			}
		});
	}

	test('/mapa (llista, HTML sense JS): distintiu només als cims amb dificultat', async ({
		browser
	}) => {
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
				await expectBadgesLlista(
					page,
					locale,
					undefined,
					id === 'cims-amb-nens' ? ESPERAT_BADGES_NENS : ESPERAT_LLISTES
				);
				for (const slug of esperats) {
					if (id === 'cims-facils') expect(NORMAL.get(slug)!.nivell).toBe(1);
					else {
						const p = FITXES.find((x) => x.slug === slug)!;
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
		});

		test(`enllaçats des de la portada (Explora), /cims i el peu (${locale})`, async ({
			page,
			request
		}) => {
			const destins = [
				{ id: 'cims-facils', text: msg(locale, 'explore_easy') },
				{ id: 'cims-amb-nens', text: msg(locale, 'explore_kids') }
			] as const;
			/** Comprova que dins `arrel` hi ha un enllaç amb el text i la URL localitzada de cada llistat. */
			const comprova = async (arrel: ReturnType<Page['locator']>, on: string) => {
				for (const d of destins) {
					const a = arrel.getByRole('link', { name: d.text, exact: true });
					await expect(a, `${on} → ${d.id}`).toHaveCount(1);
					await expectHref(a, URL_LLISTAT[d.id][locale], `${on} → ${d.id}`);
				}
			};
			// Portada: secció "Explora els cims"
			await page.goto(`/${locale}`);
			await comprova(
				page.locator('section').filter({
					has: page.getByRole('heading', { level: 2, name: msg(locale, 'explore_label') })
				}),
				'portada (Explora)'
			);
			// Peu (a la portada, a /cims, a una fitxa i als mateixos llistats)
			const peu = () => page.getByRole('navigation', { name: msg(locale, 'footer_explore_label') });
			await comprova(peu(), 'peu de la portada');
			// /cims: navegació "Explora" de la capçalera
			await page.goto(URL_LLISTAT.cims[locale]);
			await comprova(page.getByRole('navigation', { name: msg(locale, 'explore_label') }), '/cims');
			await comprova(peu(), 'peu de /cims');
			await page.goto(fitxaUrl(FITXES[0].slug, locale));
			await comprova(peu(), 'peu d’una fitxa');
			for (const id of ['cims-facils', 'cims-amb-nens'] as const) {
				await page.goto(URL_LLISTAT[id][locale]);
				await comprova(peu(), `peu de ${id}`);
				expect((await request.get(URL_LLISTAT[id][locale])).status()).toBe(200);
			}
		});

		test(`cims-amb-nens (${locale}): cada cim diu "Des de …" i el desnivell i el temps d'anada de la ruta amb nens`, async ({
			page
		}) => {
			await gotoHydrated(page, URL_LLISTAT['cims-amb-nens'][locale]);
			const files = await page.locator('main .llista li').evaluateAll((lis) =>
				lis.map((li) => {
					const a = li.querySelector('a')!;
					const ruta = li.querySelector('.ruta');
					const t = (sel: string) =>
						(ruta?.querySelector(sel)?.textContent ?? null)?.trim() ?? null;
					return {
						slug: new URL(a.href).pathname.split('/').pop()!,
						rutes: li.querySelectorAll('.ruta').length,
						sr: t('.sr-only'),
						nom: t('.nom-ruta'),
						dades: ruta?.querySelector('.dades')?.textContent ?? null,
						sepOcult: ruta?.querySelector('.sep')?.getAttribute('aria-hidden') ?? null,
						dinsEnllac: !!ruta && a.contains(ruta),
						nomAccessible: (a.textContent ?? '').replace(/\s+/g, ' ').trim()
					};
				})
			);
			expect(files.map((f) => f.slug).sort()).toEqual([...RUTA_NENS.keys()].sort());
			const errors: string[] = [];
			for (const f of files) {
				const r = RUTA_NENS.get(f.slug)!;
				const nomCurt = nomCurtOracle(r.nom[locale]);
				const dades = [
					msg(locale, 'kids_route_elevation', { metres: alt(r.desnivellPositiuM!) }),
					msg(locale, 'kids_route_time', { temps: durada(r.tempsMinuts!) })
				].join(' · ');
				const real = {
					rutes: f.rutes,
					sr: f.sr,
					nom: f.nom,
					dades: f.dades?.replace(/\s+/g, ' ').trim(),
					sepOcult: f.sepOcult,
					dinsEnllac: f.dinsEnllac
				};
				const esperat = {
					rutes: 1,
					sr: msg(locale, 'kids_route_sr'),
					nom: nomCurt,
					dades,
					sepOcult: 'true',
					dinsEnllac: true
				};
				if (JSON.stringify(real) !== JSON.stringify(esperat))
					errors.push(`${f.slug}: ${JSON.stringify(real)} ≠ ${JSON.stringify(esperat)}`);
				// "Des de …" / "Desde …": el punt de sortida, i és el començament del nom de la ruta
				if (!/^(Des de |Des del |Des dels |Des d'|Des d’|Desde )/.test(f.nom ?? ''))
					errors.push(`${f.slug}: «${f.nom}» no comença per "Des de"`);
				if (f.nom === null || !r.nom[locale].startsWith(f.nom))
					errors.push(`${f.slug}: «${f.nom}» no és el començament de «${r.nom[locale]}»`);
				// Número i unitat sempre junts (espai fix): cap espai normal darrere d'una xifra
				if (/\d /.test(f.dades ?? '')) errors.push(`${f.slug}: espai trencable a «${f.dades}»`);
				// El nom accessible de l'enllaç no ajunta les parts
				if (!f.nomAccessible.includes(`${msg(locale, 'kids_route_sr')} ${nomCurt}`))
					errors.push(`${f.slug}: nom accessible «${f.nomAccessible}»`);
			}
			expect(errors).toEqual([]);
			test.info().annotations.push({
				type: 'rutes amb nens',
				description: files.map((f) => `${f.slug}: ${f.nom}`).join('; ')
			});
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
			await expectBadgesLlista(page, locale, undefined, ESPERAT_BADGES_NENS);
			// Amb < 3 cims, noindex; si no, cap meta robots (com al HTML del servidor)
			if (ESPERAT_LLISTAT['cims-amb-nens'].length < 3)
				await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
			else await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
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
	const SONDES = FITXES.flatMap((p) => sondes(p).map((s) => ({ slug: p.slug, s })));

	test('chunks JS i __data.json de llistes i llistats: cap text de fitxa, només el mapa lleuger', async ({
		page,
		request
	}) => {
		test.slow(); // ~1.000 sondes de les 50 fitxes contra cada chunk
		expect(SONDES.length).toBeGreaterThan(80 * (FITXES.length / 10));
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
	{ nom: 'cims-amb-nens (ca)', url: URL_LLISTAT['cims-amb-nens'].ca },
	// Una fitxa nova del bloc 6b (no pilot) amb ruta per a nens, desplegada
	...[...RUTA_NENS.keys()]
		.filter((s) => !SLUGS_PILOTS.has(s))
		.slice(0, 1)
		.map((s) => ({ nom: `fitxa ${s} (es, desplegat)`, url: fitxaUrl(s, 'es'), obre: true })),
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
		for (const [i, tros] of trossos(FITXES, 10).entries()) {
			test(`(${locale}) fitxes ${i * 10 + 1}–${i * 10 + tros.length} amb els desplegables oberts sense scroll horitzontal`, async ({
				page
			}) => {
				test.setTimeout(120_000);
				await stubMaps(page);
				const dolents: string[] = [];
				for (const p of tros) {
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
				expect(dolents).toEqual([]);
			});
		}

		test(`(${locale}) llistats i metodologia sense scroll horitzontal; la ruta amb nens dins la fila`, async ({
			page
		}) => {
			test.setTimeout(120_000);
			await stubMaps(page);
			const dolents: string[] = [];
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
				// Distintiu compacte i línia "Des de …" dins la fila
				const fora = await page
					.locator('main .llista li .dif-mini, main .llista li .ruta, main .llista li .ruta .dada')
					.evaluateAll(
						(els) =>
							els.filter(
								(el) =>
									el.getBoundingClientRect().right >
									el.closest('a')!.getBoundingClientRect().right + 0.5
							).length
					);
				if (fora) dolents.push(`${url}: ${fora} elements fora de la fila`);
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
	const AMB_CAPCALERA = FITXES.filter((p) => NORMAL.get(p.slug));
	for (const ample of [320, 375, 768]) {
		for (const [i, tros] of trossos(AMB_CAPCALERA, 17).entries()) {
			test(`${ample} px, fonts lentes (fitxes ${i * 17 + 1}–${i * 17 + tros.length}): el distintiu i la caixa del H1 no es desplacen en carregar`, async ({
				browser
			}, ti) => {
				test.skip(ti.project.name !== 'mobile-chrome', 'un sol projecte Chromium mòbil');
				test.setTimeout(240_000);
				const informe: string[] = [];
				const dolents: string[] = [];
				for (const p of tros) {
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
				const { nous, arreglats } = separaConeguts(
					dolents,
					ample === 768 ? BUGS_H1_768 : new Set(),
					tros.map((p) => p.slug)
				);
				expect(nous).toEqual([]);
				expect(
					arreglats,
					'bugs coneguts que ja no es reprodueixen: treu-los de BUGS_H1_768'
				).toEqual([]);
			});
		}
	}
});
