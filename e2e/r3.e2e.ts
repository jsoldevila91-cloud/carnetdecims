/**
 * Bloc R3 · Compartir i validar.
 *
 * - /ca/app/validacio (/es/app/validacion): any per defecte, avisos (restricció, repetit, > 100),
 *   excloses amb motiu, "a partir del", termini, CSV (BOM, `;`, CRLF) i full imprimible
 *   (`page.emulateMedia({ media: 'print' })`).
 * - /ca|es/app/compartir: enllaç de només lectura (round-trip en una pàgina nova, nom amb HTML i
 *   caràcters de control com a text, enllaç copiat anunciat, sense notes dins de l'enllaç) i
 *   imatge PNG 1080×1350.
 * - /ca|es/carnet#c=…: enllaç vàlid, invàlid, truncat, cims desconeguts i dates futures
 *   (descartades), nom massa llarg, versió futura, `noindex, nofollow`, sense JS, `hashchange`,
 *   el fragment no surt a cap petició, i offline amb el SW (Chromium).
 * - Reflow a 320/375/1280 i axe.
 *
 * Els enllaços dels tests de /carnet es construeixen aquí amb un codificador **propi** (format
 * binari v1 de docs/03 §3.7, sense comprimir i en base64url), no amb `domain/carnet-compartit.ts`:
 * així el test és un oracle independent. Els textos es llegeixen de `messages/*.json` (`t()`).
 * El rellotge del navegador es fixa a divendres 2026-10-16 (Europe/Madrid).
 */
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import type { Browser, Page } from '@playwright/test';
import { test, expect, gotoHydrated, waitForHydration } from './fixtures';
import { CIM, sembrar, type FilaSembra } from './ascensions';
import { CIMS, COMARQUES, expectAxeNet, expectSenseDesbord, t, type Locale } from './r1';

// ---------------------------------------------------------------------------
// Constants, rutes i oracles
// ---------------------------------------------------------------------------

const ARA = new Date('2026-10-16T10:00:00+02:00');
const ANY = 2026;
/** Del 16/10 al 31/12 de 2026. */
const DIES_TERMINI = 76;

const RUTA = {
	validacio: { ca: '/ca/app/validacio', es: '/es/app/validacion' },
	compartir: { ca: '/ca/app/compartir', es: '/es/app/compartir' },
	carnet: { ca: '/ca/carnet', es: '/es/carnet' }
} as const;

const LOCALES: Locale[] = ['ca', 'es'];

// Amb els 3 projectes en paral·lel, sembrar + hidratar /app/compartir (Dexie, canvas) supera
// els 30 s per defecte a Chromium mòbil en aquesta màquina.
test.describe.configure({ timeout: 60_000 });

function clauExisteix(locale: Locale, clau: string): boolean {
	try {
		t(locale, clau);
		return true;
	} catch {
		return false;
	}
}

async function fixarRellotge(page: Page) {
	await page.clock.setFixedTime(ARA);
}

const nomCim = (id: number) => {
	const c = CIMS.find((x) => x.id === id);
	if (!c) throw new Error(`cim ${id}`);
	return c.nom;
};

/** Cims essencials (tots ho són al catàleg actual) per sembrar volums grans. */
const IDS_CATALEG = CIMS.map((c) => c.id).sort((a, b) => a - b);

const sumaDies = (iso: string, n: number) =>
	new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * 86_400_000).toISOString().slice(0, 10);

// ── Codificador i descodificador independents del format v1 ────────────────

function varint(n: number): number[] {
	const out: number[] = [];
	while (n >= 0x80) {
		out.push((n & 0x7f) | 0x80);
		n >>>= 7;
	}
	out.push(n);
	return out;
}

const diesDes2006 = (d: string) =>
	Math.round(
		(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) - Date.UTC(2006, 6, 1)) /
			86_400_000
	);

/** Bytes del format v1 (sense comprimir). `nom` pot ser bytes crus per provar casos dolents. */
function bytesV1(
	nom: string | Uint8Array | undefined,
	entrades: [cimId: number, data: string][],
	versio = 1
): number[] {
	const n = nom === undefined ? new Uint8Array() : typeof nom === 'string' ? Buffer.from(nom) : nom;
	const out = [versio, ...varint(n.length), ...n, ...varint(entrades.length)];
	let anterior = 0;
	for (const [cimId, data] of [...entrades].sort((a, b) => (a[1] < b[1] ? -1 : 1))) {
		const d = diesDes2006(data);
		out.push(...varint(d - anterior), ...varint(cimId));
		anterior = d;
	}
	return out;
}

/** Valor de `c=` (capçalera 0 = sense comprimir, i base64url sense farciment). */
const fragmentV1 = (...args: Parameters<typeof bytesV1>) =>
	Buffer.from([0, ...bytesV1(...args)]).toString('base64url');

/** Descodifica un enllaç generat per l'app (per comprovar què hi viatja). */
function llegeixEnllacTest(url: string) {
	const valor = new URLSearchParams(url.slice(url.indexOf('#') + 1)).get('c')!;
	const cru = Buffer.from(valor, 'base64url');
	const dades = cru[0] === 1 ? inflateRawSync(cru.subarray(1)) : cru.subarray(1);
	let pos = 0;
	const vi = () => {
		let n = 0;
		for (let i = 0; ; i++) {
			const b = dades[pos++];
			n |= (b & 0x7f) << (7 * i);
			if (!(b & 0x80)) return n;
		}
	};
	const versio = dades[pos++];
	const l = vi();
	const nom = dades.subarray(pos, pos + l).toString('utf8');
	pos += l;
	const n = vi();
	const entrades: { cimId: number; data: string }[] = [];
	let dies = 0;
	for (let i = 0; i < n; i++) {
		dies += vi();
		entrades.push({ cimId: vi(), data: sumaDies('2006-07-01', dies) });
	}
	return { versio, nom, entrades, sobrants: dades.length - pos, cru: dades };
}

// ── Localitzadors ──────────────────────────────────────────────────────────

const main = (page: Page) => page.locator('main');
const taula = (page: Page) => page.getByTestId('validacio-taula');
const filesTaula = (page: Page) => taula(page).locator('tbody tr');
const selectorAny = (page: Page) => main(page).locator('select');
const campDesDe = (page: Page) => main(page).locator('input[type="date"]');
const botoCsv = (page: Page, l: Locale) =>
	main(page).getByRole('button', { name: t(l, 'validation_download_csv') });
const botoImprimir = (page: Page, l: Locale) =>
	main(page).getByRole('button', { name: t(l, 'validation_print') });
const campEnllac = (page: Page) => page.getByTestId('compartir-enllac');
const campNom = (page: Page) => main(page).locator('input[type="text"]');

/** Espera un enllaç generat (i estable) al camp de compartir. */
async function enllacGenerat(page: Page, locale: Locale): Promise<string> {
	await expect(campEnllac(page)).toHaveValue(new RegExp(`/${locale}/carnet#c=[A-Za-z0-9_-]+$`));
	await expect(campEnllac(page)).toHaveAttribute('aria-busy', 'false');
	return campEnllac(page).inputValue();
}

async function obrirCarnet(page: Page, locale: Locale, valor: string) {
	await page.goto(`${RUTA.carnet[locale]}#c=${valor}`);
	await waitForHydration(page, 30_000);
}

const titolCarnet = (page: Page) => page.getByTestId('carnet-compartit-titol');
const errorCarnet = (page: Page) => page.getByTestId('carnet-compartit-error');
const totalCarnet = (page: Page) => page.getByTestId('carnet-compartit-total');

// ---------------------------------------------------------------------------
// 1. Validació
// ---------------------------------------------------------------------------

test.describe('Validació: llista de l’any', () => {
	for (const locale of LOCALES) {
		test(`${locale}: any per defecte (l’actual), termini, avisos i excloses`, async ({ page }) => {
			await fixarRellotge(page);
			const files: FilaSembra[] = [
				{ cimId: CIM.matagalls.id, data: '2025-05-01' },
				{ cimId: CIM.matagalls.id, data: '2026-05-01' }, // repetit (d'un altre any)
				{ cimId: CIM.picossa.id, data: '2026-03-01' }, // fauna 15/01–15/06
				{ cimId: CIM.picossa.id, data: '2026-07-01' }, // repetit, sense restricció
				{ cimId: CIM.pedraforca.id, data: '2026-02-01', metode: 'cotxe' as never },
				{ cimId: 99_999, data: '2026-04-01' },
				{ cimId: CIM.canigo.id, data: '2026-12-01' }, // futura
				{ cimId: CIM.pica.id, data: '2024-08-15' }
			];
			await sembrar(page, files, RUTA.validacio[locale]);

			await expect(main(page).locator('h1')).toHaveText(t(locale, 'validation_title'));
			await expect(selectorAny(page)).toHaveValue(String(ANY));
			await expect(selectorAny(page).locator('option')).toHaveText(['2026', '2025', '2024']);
			await expect(page.getByTestId('validacio-termini')).toContainText(String(DIES_TERMINI));

			// Files: Picossa (03-01), Matagalls (05-01), Picossa (07-01), per data
			await expect(filesTaula(page)).toHaveCount(3);
			await expect(filesTaula(page).locator('th b')).toHaveText([
				CIM.picossa.nom,
				CIM.matagalls.nom,
				CIM.picossa.nom
			]);
			await expect(filesTaula(page).locator('td.c-num')).toHaveText(['1', '2', '3']);
			const [f1, f2, f3] = [0, 1, 2].map((i) => filesTaula(page).nth(i));
			await expect(f1.locator('li.avis')).toHaveCount(1);
			await expect(f1.locator('li.avis.restriccio')).toContainText(
				t(locale, 'validation_warning_restriction')
			);
			await expect(f2.locator('li.avis.repetit')).toHaveCount(1);
			await expect(f2.locator('li.avis.restriccio')).toHaveCount(0);
			await expect(f3.locator('li.avis')).toHaveCount(1);
			await expect(f3.locator('li.avis.repetit')).toHaveCount(1);
			await expect(page.getByTestId('validacio-supera')).toHaveCount(0);

			// 1 cim nou el 2026 (la Picossa; el Matagalls ja es va fer el 2025)
			await expect(page.getByTestId('validacio-resum')).toHaveText(
				t(locale, 'validation_summary', { count: 3, year: ANY, new: 1 })
			);

			// Excloses: mètode, cim desconegut i futura, amb el motiu
			const excl = page.getByTestId('validacio-excloses').locator('li');
			await expect(excl).toHaveCount(3);
			await expect(excl.nth(0)).toContainText(CIM.pedraforca.nom);
			await expect(excl.nth(0)).toContainText(t(locale, 'validation_reason_method'));
			await expect(excl.nth(1)).toContainText('#99999');
			await expect(excl.nth(1)).toContainText(t(locale, 'validation_reason_unknown'));
			await expect(excl.nth(2)).toContainText(CIM.canigo.nom);
			await expect(excl.nth(2)).toContainText(t(locale, 'validation_reason_future'));

			// Canvi d'any
			await selectorAny(page).selectOption('2024');
			await expect(filesTaula(page)).toHaveCount(1);
			await expect(filesTaula(page).locator('th b')).toHaveText(CIM.pica.nom);
			await expect(page.getByTestId('validacio-excloses')).toHaveCount(0);
		});
	}

	test('sense ascensions l’any en curs: per defecte, l’any més recent', async ({ page }) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-05-01' },
				{ cimId: CIM.pedraforca.id, data: '2025-06-01' }
			],
			RUTA.validacio.ca
		);
		await expect(selectorAny(page)).toHaveValue('2025');
		await expect(filesTaula(page)).toHaveCount(1);
	});

	test('sense cap ascensió: estat buit i sense botons', async ({ page }) => {
		await fixarRellotge(page);
		await gotoHydrated(page, RUTA.validacio.ca);
		await expect(main(page)).toContainText(t('ca', 'validation_empty_title'));
		await expect(botoCsv(page, 'ca')).toHaveCount(0);
		await expect(page.locator('.full-impres')).toHaveCount(0);
	});

	test('més de 100 cims nous en un any: avís general, fila 101 marcada; “a partir del” no canvia el recompte', async ({
		page
	}) => {
		await fixarRellotge(page);
		const ids = IDS_CATALEG.slice(0, 101);
		await sembrar(
			page,
			ids.map((cimId, i) => ({ cimId, data: sumaDies('2026-01-01', i) })),
			RUTA.validacio.ca
		);
		await expect(filesTaula(page)).toHaveCount(101);
		await expect(page.getByTestId('validacio-supera')).toBeVisible();
		await expect(page.getByTestId('validacio-supera')).toContainText('101');
		await expect(taula(page).locator('li.avis.mes-de-100')).toHaveCount(1);
		await expect(filesTaula(page).nth(100).locator('li.avis.mes-de-100')).toHaveCount(1);
		await expect(filesTaula(page).nth(99).locator('li.avis.mes-de-100')).toHaveCount(0);

		// Només a partir del 101è dia: 1 fila, i continua marcada (recompte de tot l'any)
		await campDesDe(page).fill(sumaDies('2026-01-01', 100));
		await expect(filesTaula(page)).toHaveCount(1);
		await expect(filesTaula(page).locator('td.c-num')).toHaveText('1');
		await expect(filesTaula(page).locator('li.avis.mes-de-100')).toHaveCount(1);
		await expect(page.getByTestId('validacio-resum')).toHaveText(
			t('ca', 'validation_summary', { count: 1, year: ANY, new: 101 })
		);
		await expect(page.getByTestId('validacio-supera')).toBeVisible();
	});

	for (const locale of LOCALES) {
		test(`${locale}: CSV amb BOM, “;”, CRLF, capçalera traduïda i files`, async ({ page }) => {
			await fixarRellotge(page);
			await sembrar(
				page,
				[
					{ cimId: CIM.matagalls.id, data: '2025-05-01' },
					{ cimId: CIM.matagalls.id, data: '2026-05-01', metode: 'raquetes' },
					{ cimId: CIM.picossa.id, data: '2026-03-01', metode: 'esqui' },
					{ cimId: CIM.aliga.id, data: '2026-09-09', nota: '=HYPERLINK("http://x")' }
				],
				RUTA.validacio[locale]
			);
			await expect(filesTaula(page)).toHaveCount(3);
			const [baixada] = await Promise.all([
				page.waitForEvent('download'),
				botoCsv(page, locale).click()
			]);
			expect(baixada.suggestedFilename()).toBe(`carnetdecims-validacio-${ANY}.csv`);
			const buf = readFileSync((await baixada.path())!);
			expect([...buf.subarray(0, 3)], 'BOM UTF-8').toEqual([0xef, 0xbb, 0xbf]);
			const text = buf.subarray(3).toString('utf8');
			expect(text.endsWith('\r\n')).toBe(true);
			expect(text.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
			const linies = text.slice(0, -2).split('\r\n');
			expect(linies).toHaveLength(4);
			const capcalera = [
				'validation_col_num',
				'validation_col_date',
				'validation_col_peak',
				// El CSV pot tenir una capçalera d'altitud pròpia ("Altitud (m)")
				clauExisteix(locale, 'validation_csv_col_altitude')
					? 'validation_csv_col_altitude'
					: 'validation_col_altitude',
				'validation_col_comarca',
				'validation_col_method',
				'validation_col_warnings'
			].map((k) => t(locale, k));
			expect(linies[0].split(';')).toEqual(capcalera);

			const cim = (id: number) => CIMS.find((c) => c.id === id)!;
			const comarca = (id: number) => COMARQUES.find((c) => c.slug === cim(id).comarca)!.nom;
			const camps = linies.slice(1).map((l) => l.split(';'));
			expect(camps.map((c) => c.length)).toEqual([7, 7, 7]);
			expect(camps[0]).toEqual([
				'1',
				'01/03/2026',
				CIM.picossa.nom,
				String(cim(CIM.picossa.id).altitud),
				comarca(CIM.picossa.id),
				t(locale, 'method_esqui'),
				t(locale, 'validation_warning_restriction')
			]);
			expect(camps[1].slice(0, 3)).toEqual(['2', '01/05/2026', CIM.matagalls.nom]);
			expect(camps[1][5]).toBe(t(locale, 'method_raquetes'));
			expect(camps[1][6]).toBe(t(locale, 'validation_warning_repeated'));
			expect(camps[2].slice(0, 3)).toEqual(['3', '09/09/2026', CIM.aliga.nom]);
			expect(camps[2][6]).toBe('');
			// La nota no surt mai al CSV
			expect(text).not.toContain('HYPERLINK');
		});
	}

	test('full imprimible: només el full, amb totes les files i els camps per omplir', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				{ cimId: CIM.picossa.id, data: '2026-03-01' },
				{ cimId: CIM.matagalls.id, data: '2026-05-01' }
			],
			RUTA.validacio.ca
		);
		await expect(filesTaula(page)).toHaveCount(2);
		const full = page.locator('.full-impres');
		await expect(full).toBeHidden();
		await page.emulateMedia({ media: 'print' });
		await expect(full).toBeVisible();
		await expect(full.locator('tbody tr')).toHaveCount(2);
		await expect(full.locator('thead th')).toHaveCount(7);
		await expect(full.locator('dl dt')).toHaveCount(4);
		await expect(full).toContainText(t('ca', 'validation_print_footer'));
		await expect(page.locator('.pantalla')).toBeHidden();
		await expect(page.locator('header').first()).toBeHidden();
		// Res de la pàgina fora del full ocupa espai a la impressió
		const visibles = await page.evaluate(() =>
			[...document.body.querySelectorAll<HTMLElement>('body *')]
				.filter((el) => !el.closest('.full-impres') && !el.contains(document.querySelector('.full-impres')))
				.filter((el) => {
					const r = el.getBoundingClientRect();
					return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
				})
				.map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
				.slice(0, 5)
		);
		expect(visibles).toEqual([]);
		await page.emulateMedia({ media: 'screen' });
		await expect(full).toBeHidden();
		await expect(botoImprimir(page, 'ca')).toBeEnabled();
	});

	test('després de visitar la validació, imprimir una altra pàgina de l’app no la deixa en blanc', async ({
		page
	}) => {
		// BUG conegut (informe QA R3): els `:global(...)` de `@media print` de la validació
		// continuen carregats després de navegar i amaguen tot el <main>. Treure `test.fail` quan
		// es corregeixi.
		test.fail();
		// Els estils `@media print` de la validació són `:global(main > :not(.full-impres))`: si
		// continuen carregats després de navegar amb el router, buiden qualsevol altra pàgina.
		await fixarRellotge(page);
		await sembrar(page, [{ cimId: CIM.matagalls.id, data: '2026-05-01' }], '/ca/app/historial');
		const enllac = main(page).locator('a[href="/ca/app/validacio"]').first();
		await expect(enllac).toBeVisible();
		await Promise.all([page.waitForURL(RUTA.validacio.ca, { timeout: 20_000 }), enllac.click()]);
		await expect(filesTaula(page)).toHaveCount(1);
		await page.goBack();
		await expect(page).toHaveURL('/ca/app/historial');
		await expect(main(page)).toContainText(CIM.matagalls.nom);
		await page.emulateMedia({ media: 'print' });
		await expect(main(page).locator('h1')).toBeVisible();
		await expect(main(page).getByText(CIM.matagalls.nom).first()).toBeVisible();
	});
});

// ---------------------------------------------------------------------------
// 2. Compartir
// ---------------------------------------------------------------------------

const SEMBRA_COMPARTIR: FilaSembra[] = [
	{ cimId: CIM.matagalls.id, data: '2025-05-01', nota: 'NOTA-SECRETA', companys: ['Companya X'] },
	{ cimId: CIM.matagalls.id, data: '2026-05-01', nota: 'NOTA-SECRETA-2' },
	{ cimId: CIM.pedraforca.id, data: '2024-08-01', metode: 'btt' },
	{ cimId: CIM.canigo.id, data: '2026-06-01' },
	{ cimId: CIM.aliga.id, data: '2026-12-24' } // futura: no es comparteix
];

test.describe('Compartir: enllaç de només lectura', () => {
	for (const locale of LOCALES) {
		test(`${locale}: genera l’enllaç, només cims i dates; round-trip en una pàgina nova`, async ({
			page,
			context
		}) => {
			await fixarRellotge(page);
			await sembrar(page, SEMBRA_COMPARTIR, RUTA.compartir[locale]);
			await expect(main(page).locator('h1')).toHaveText(t(locale, 'share_title'));
			const url = await enllacGenerat(page, locale);
			expect(new URL(url).origin).toBe(new URL(page.url()).origin);

			const ll = llegeixEnllacTest(url);
			expect(ll.versio).toBe(1);
			expect(ll.sobrants).toBe(0);
			expect(ll.nom).toBe('');
			// Un segell per cim (la 1a ascensió), sense futures
			expect(ll.entrades).toEqual([
				{ cimId: CIM.pedraforca.id, data: '2024-08-01' },
				{ cimId: CIM.matagalls.id, data: '2025-05-01' },
				{ cimId: CIM.canigo.id, data: '2026-06-01' }
			]);
			expect(ll.cru.toString('latin1')).not.toMatch(/NOTA|Companya/);

			const p2 = await context.newPage();
			await p2.clock.setFixedTime(ARA);
			await p2.goto(url);
			await waitForHydration(p2, 30_000);
			await expect(titolCarnet(p2)).toHaveText(t(locale, 'shared_title'));
			await expect(totalCarnet(p2)).toHaveText(/^\s*3\s*\//);
			await expect(p2.getByTestId('carnet-compartit-descartades')).toHaveCount(0);
			// Només lectura: cap segell és un botó
			await expect(p2.locator('main .graella button')).toHaveCount(0);
			await expect(p2.locator('main .graella li.plena')).toHaveCount(3);
			await expect(p2.locator('main')).not.toContainText('NOTA-SECRETA');
			await p2.close();
		});
	}

	test('nom amb HTML i caràcters de control: es mostra com a text, sanejat', async ({
		page,
		context
	}) => {
		await fixarRellotge(page);
		await sembrar(page, SEMBRA_COMPARTIR, RUTA.compartir.ca);
		const html = '<img src=x onerror="window.__xss=1">';
		await campNom(page).fill(html);
		let url = await enllacGenerat(page, 'ca');
		await expect.poll(() => llegeixEnllacTest(url).nom).toBe(html);
		url = await campEnllac(page).inputValue();

		const p2 = await context.newPage();
		await p2.clock.setFixedTime(ARA);
		await p2.goto(url);
		await waitForHydration(p2, 30_000);
		await expect(titolCarnet(p2)).toHaveText(t('ca', 'shared_title_named', { name: html }));
		expect(await p2.evaluate(() => (window as { __xss?: number }).__xss)).toBeUndefined();
		await expect(p2.locator('main img')).toHaveCount(0);
		await expect(p2).toHaveTitle(new RegExp(html.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

		// Controls, bidi i zero-width: fora; "d'" davant de vocal
		await campNom(page).fill('‮An​na\u0007\t ');
		await expect
			.poll(async () => llegeixEnllacTest(await campEnllac(page).inputValue()).nom)
			.toBe('Anna');
		await expect(campEnllac(page)).toHaveAttribute('aria-busy', 'false');
		await p2.goto(await campEnllac(page).inputValue());
		await waitForHydration(p2, 30_000);
		await expect(titolCarnet(p2)).toHaveText(t('ca', 'shared_title_named_vowel', { name: 'Anna' }));
		await p2.close();
	});

	test('copiar l’enllaç ho anuncia a la regió viva', async ({ page, context, browserName }) => {
		if (browserName === 'chromium')
			await context.grantPermissions(['clipboard-read', 'clipboard-write']);
		await fixarRellotge(page);
		await sembrar(page, SEMBRA_COMPARTIR, RUTA.compartir.ca);
		const url = await enllacGenerat(page, 'ca');
		const viu = page.getByTestId('compartir-avis-copia');
		await expect(viu).toHaveAttribute('aria-live', 'polite');
		await expect(viu).toHaveText('');
		await main(page).getByRole('button', { name: t('ca', 'share_link_copy') }).click();
		if (browserName === 'chromium') {
			await expect(viu).toHaveText(t('ca', 'share_link_copied'));
			expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(url);
		} else {
			await expect(viu).toHaveText(
				new RegExp(
					`^(${[t('ca', 'share_link_copied'), t('ca', 'share_link_copy_manual')]
						.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
						.join('|')})$`
				)
			);
		}
	});

	test('imatge PNG 1080×1350 generada al client i descarregable', async ({ page }) => {
		await fixarRellotge(page);
		await sembrar(page, SEMBRA_COMPARTIR, RUTA.compartir.ca);
		const img = page.getByTestId('compartir-previsualitzacio');
		await expect(img).toBeVisible({ timeout: 15_000 });
		await expect(img).toHaveAttribute('src', /^blob:/);
		await expect(img).toHaveAttribute('alt', /3\/100/);
		const info = await img.evaluate(async (el: HTMLImageElement) => {
			await el.decode();
			const b = new Uint8Array(await (await fetch(el.src)).arrayBuffer());
			return { w: el.naturalWidth, h: el.naturalHeight, sig: [...b.subarray(0, 8)], mida: b.length };
		});
		expect(info.sig).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
		expect({ w: info.w, h: info.h }).toEqual({ w: 1080, h: 1350 });
		expect(info.mida).toBeGreaterThan(10_000);

		const [baixada] = await Promise.all([
			page.waitForEvent('download'),
			main(page).getByRole('button', { name: t('ca', 'share_image_download') }).click()
		]);
		expect(baixada.suggestedFilename()).toBe('carnetdecims.png');
		const buf = readFileSync((await baixada.path())!);
		expect([...buf.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
	});

	test('sense ascensions: estat buit, sense enllaç', async ({ page }) => {
		await fixarRellotge(page);
		await gotoHydrated(page, RUTA.compartir.es);
		await expect(main(page)).toContainText(t('es', 'share_empty_title'));
		await expect(campEnllac(page)).toHaveCount(0);
	});
});

// ---------------------------------------------------------------------------
// 3. Carnet compartit públic
// ---------------------------------------------------------------------------

test.describe('Carnet compartit (/carnet)', () => {
	for (const locale of LOCALES) {
		test(`${locale}: enllaç vàlid amb nom; noindex, nofollow`, async ({ page }) => {
			await fixarRellotge(page);
			await obrirCarnet(
				page,
				locale,
				fragmentV1('Inesa', [
					[CIM.matagalls.id, '2020-05-01'],
					[CIM.pedraforca.id, '2019-08-01'],
					[CIM.canigo.id, '2026-10-16']
				])
			);
			await expect(titolCarnet(page)).toHaveText(
				t(locale, 'shared_title_named_vowel', { name: 'Inesa' })
			);
			await expect(totalCarnet(page)).toHaveText(/^\s*3\s*\//);
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
				'content',
				'noindex, nofollow'
			);
			await expect(page.locator('main .graella li.plena')).toHaveCount(3);
			const cta = main(page).locator('aside a');
			await expect(cta).toHaveAttribute('rel', /nofollow/);
		});
	}

	test('enllaços invàlids: sense fragment, base64 dolent, truncat, versió futura, nom massa llarg', async ({
		page
	}) => {
		await fixarRellotge(page);
		const bo = fragmentV1(undefined, [
			[CIM.matagalls.id, '2020-05-01'],
			[CIM.pedraforca.id, '2021-08-01'],
			[CIM.canigo.id, '2022-10-16']
		]);
		let truncat = bo.slice(0, -3);
		if (truncat.length % 4 === 1) truncat = truncat.slice(0, -1);
		const casos = [
			'',
			'#',
			'#x=abc',
			'#c=',
			'#c=!!!*',
			'#c=AAAA=',
			`#c=${truncat}`,
			`#c=${bo}AA`,
			`#c=${fragmentV1(undefined, [[CIM.matagalls.id, '2020-05-01']], 2)}`,
			`#c=${fragmentV1('x'.repeat(161), [])}`,
			`#c=${fragmentV1(new Uint8Array([0xff, 0xfe]), [])}`,
			`#c=${Buffer.from([1, 0xff]).toString('base64url')}`, // deflate corrupte
			`#c=${'A'.repeat(20_000)}`
		];
		for (const hash of casos) {
			await page.goto(`${RUTA.carnet.ca}${hash}`);
			await waitForHydration(page, 30_000);
			await expect(errorCarnet(page), hash.slice(0, 40)).toBeVisible();
			await expect(errorCarnet(page)).toHaveRole('alert');
			await expect(titolCarnet(page)).toHaveCount(0);
			await expect(main(page).locator('h1')).toHaveText(t('ca', 'shared_title'));
		}
	});

	test('cims desconeguts i dates futures: es descarten i s’avisa', async ({ page }) => {
		await fixarRellotge(page);
		await obrirCarnet(
			page,
			'ca',
			fragmentV1('Pere', [
				[CIM.matagalls.id, '2020-05-01'],
				[99_999, '2021-01-01'],
				[CIM.canigo.id, '2026-10-17'], // demà
				[CIM.matagalls.id, '2020-05-01'] // duplicat exacte
			])
		);
		await expect(titolCarnet(page)).toHaveText(t('ca', 'shared_title_named', { name: 'Pere' }));
		await expect(page.getByTestId('carnet-compartit-descartades')).toContainText(
			t('ca', 'shared_discarded', { count: 2 })
		);
		await expect(totalCarnet(page)).toHaveText(/^\s*1\s*\//);
	});

	test('carnet buit (0 entrades) i canvi de fragment amb `hashchange`', async ({ page }) => {
		await fixarRellotge(page);
		await obrirCarnet(page, 'es', fragmentV1(undefined, []));
		await expect(titolCarnet(page)).toHaveText(t('es', 'shared_title'));
		await expect(main(page)).toContainText(t('es', 'shared_empty'));
		await page.evaluate(
			(v) => (location.hash = `c=${v}`),
			fragmentV1('Joan', [[CIM.pica.id, '2015-07-01']])
		);
		await expect(titolCarnet(page)).toHaveText(t('es', 'shared_title_named', { name: 'Joan' }));
		await expect(totalCarnet(page)).toHaveText(/^\s*1\s*\//);
		await page.evaluate(() => (location.hash = 'c=@@'));
		await expect(errorCarnet(page)).toBeVisible();
	});

	test('el fragment no surt a cap petició de xarxa', async ({ page }) => {
		await fixarRellotge(page);
		const valor = fragmentV1('Fuita', [[CIM.matagalls.id, '2020-05-01']]);
		const urls: string[] = [];
		page.on('request', (r) => urls.push(r.url()));
		await obrirCarnet(page, 'ca', valor);
		await expect(titolCarnet(page)).toBeVisible();
		// CTA cap a /app: tampoc hi viatja
		await main(page).locator('aside a').click();
		await expect(page).toHaveURL('/ca/app');
		await waitForHydration(page, 30_000);
		const ambFragment = urls.filter((u) => u.includes(valor.slice(0, 12)) || u.includes('#c='));
		expect(ambFragment).toEqual([]);
	});

	test('sense JavaScript: títol i missatge de <noscript>', async ({ browser, baseURL }) => {
		const ctx = await (browser as Browser).newContext({ javaScriptEnabled: false, baseURL });
		const p = await ctx.newPage();
		await p.goto(`${RUTA.carnet.ca}#c=${fragmentV1('Inesa', [[CIM.matagalls.id, '2020-05-01']])}`);
		await expect(p.locator('main h1')).toHaveText(t('ca', 'shared_title'));
		// Els selectors de Playwright no entren dins de <noscript>: es mira el text renderitzat.
		expect(await p.evaluate(() => document.body.innerText)).toContain(t('ca', 'shared_noscript'));
		await expect(p.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
		await ctx.close();
	});
});

// ---------------------------------------------------------------------------
// 4. Offline (Chromium, amb el SW)
// ---------------------------------------------------------------------------

test.describe('Carnet compartit sense connexió', () => {
	test.use({ serviceWorkers: 'allow' });
	test.skip(
		({ browserName }) => browserName !== 'chromium',
		'WebKit + setOffline talla també les respostes del SW (vegeu pwa.e2e.ts)'
	);

	test('/ca/carnet i /es/carnet són al precache i pinten el carnet offline', async ({
		page,
		context
	}) => {
		await gotoHydrated(page, '/ca');
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
		await context.setOffline(true);
		for (const locale of LOCALES) {
			await page.goto(
				`${RUTA.carnet[locale]}#c=${fragmentV1('Inesa', [[CIM.matagalls.id, '2020-05-01']])}`
			);
			await waitForHydration(page, 30_000);
			await expect(totalCarnet(page)).toHaveText(/^\s*1\s*\//);
		}
		await context.setOffline(false);
	});
});

// ---------------------------------------------------------------------------
// 5. Reflow i accessibilitat
// ---------------------------------------------------------------------------

test.describe('Reflow (320/375/1280) i axe', () => {
	for (const locale of LOCALES) {
		test(`${locale}: validació, compartir i carnet sense desbordament ni violacions axe`, async ({
			page
		}) => {
			test.setTimeout(120_000);
			await fixarRellotge(page);
			await sembrar(
				page,
				[
					...SEMBRA_COMPARTIR,
					{ cimId: CIM.picossa.id, data: '2026-03-01' },
					{ cimId: CIM.pedraforca.id, data: '2026-02-01', metode: 'cotxe' as never }
				],
				RUTA.validacio[locale]
			);
			const nomLlarg = 'Maria-Antònia Puigdollers i Vilanova';
			const carnet = `${RUTA.carnet[locale]}#c=${fragmentV1(nomLlarg, [
				[CIM.matagalls.id, '2020-05-01'],
				[99_999, '2021-01-01']
			])}`;
			for (const ruta of [RUTA.validacio[locale], RUTA.compartir[locale], carnet]) {
				await page.goto(ruta);
				await waitForHydration(page, 30_000);
				if (ruta === RUTA.validacio[locale]) await expect(filesTaula(page)).not.toHaveCount(0);
				if (ruta === RUTA.compartir[locale]) {
					await campNom(page).fill(nomLlarg);
					await enllacGenerat(page, locale);
					await expect(page.getByTestId('compartir-previsualitzacio')).toBeVisible({
						timeout: 15_000
					});
				}
				if (ruta === carnet) await expect(totalCarnet(page)).toBeVisible();
				for (const width of [320, 375, 1280]) {
					await page.setViewportSize({ width, height: 800 });
					await expectSenseDesbord(page);
				}
				await expectAxeNet(page);
			}
			// Estat d'error del carnet
			await page.goto(`${RUTA.carnet[locale]}#c=@@`);
			await waitForHydration(page, 30_000);
			await expect(errorCarnet(page)).toBeVisible();
			await page.setViewportSize({ width: 320, height: 800 });
			await expectSenseDesbord(page);
			await expectAxeNet(page);
		});
	}
});
