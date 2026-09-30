/**
 * Bloc 4b · El meu carnet (/app): pàgines I–V amb segells, detall del segell, essencials
 * pendents (/app/essencials) i progrés per comarca (/app/comarques).
 *
 * Cada test comença amb un IndexedDB buit (context nou) i el sembra amb `sembrar()` o amb una
 * importació JSON. Les xifres esperades es calculen a partir del catàleg real (`cataleg.ts`).
 *
 * "En espera" (no essencials pujades des del 01/07/2019 sense el 100 fet) NO es pot provar per
 * E2E: el catàleg real només té les 150 essencials. Es cobreix al domini
 * (`src/lib/domain/carnet.spec.ts`) i al component amb un catàleg sintètic
 * (`src/lib/ui/PaginesCarnet.svelte.spec.ts`).
 */
import type { Locator, Page } from '@playwright/test';
import {
	test,
	expect,
	gotoHydrated,
	mainNav,
	settleAnimations,
	waitForHydration,
	ROUTES
} from './fixtures';
import {
	CIM,
	SHEET_EDICIO,
	expectBdBuida,
	fitxerExportacio,
	filesBd,
	sembrar,
	sheetRegistre,
	toast,
	type FilaSembra
} from './ascensions';
import AxeBuilder from '@axe-core/playwright';
import { CIMS, COMARQUES, overflowX, type Cim } from './cataleg';

const APP = '/ca/app';

// ── Localitzadors ───────────────────────────────────────────────────────────

const tabs = (page: Page) =>
	page.getByRole('tablist', { name: 'Pàgines del carnet, de la I a la V' }).getByRole('tab');
const panell = (page: Page) => page.getByRole('tabpanel');
const graella = (page: Page) => page.getByRole('list', { name: /^Caselles de la pàgina/ });
const segells = (page: Page) => graella(page).getByRole('button');
const casella = (page: Page, n: number) =>
	graella(page).getByRole('button', { name: new RegExp(`^Casella ${n}:`) });
/** Estat de la pàgina (dins de main: el bàner offline i els toasts també són status). */
const estat = (page: Page) => page.locator('main').getByRole('status');

async function obrirAmbTeclat(boto: Locator) {
	await boto.focus();
	await boto.press('Enter');
}

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** axe amb expect.soft: un test recull totes les violacions de tots els estats. */
async function axeSoft(page: Page) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const resum = violations.map((v) => ({
		id: v.id,
		n: v.nodes.length,
		nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	expect.soft(resum, `violacions axe a ${new URL(page.url()).pathname}`).toEqual([]);
}

const capcalera = (page: Page) => page.getByRole('region', { name: 'Progrés del repte' });

async function comptador(page: Page) {
	return (await page.locator('p.count').innerText()).replace(/\s+/g, '');
}

/** "Casella n: {cim}, {data}" → [n, cim]. */
async function segellsVisibles(page: Page): Promise<[number, string][]> {
	const labels = await segells(page).evaluateAll((bs) =>
		bs.map((b) => b.getAttribute('aria-label')!)
	);
	return labels.map((l) => {
		const m = /^Casella (\d+): (.+), [^,]+$/.exec(l);
		if (!m) throw new Error(`etiqueta inesperada: ${l}`);
		return [Number(m[1]), m[2]];
	});
}

/** Data llarga amb l'Intl del mateix navegador (el format de l'app, `formatDataLlarga`). */
function dataLlarga(page: Page, iso: string, locale = 'ca') {
	return page.evaluate(
		([iso, locale]) =>
			new Intl.DateTimeFormat(locale, {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				timeZone: 'UTC'
			}).format(new Date(`${iso}T00:00:00Z`)),
		[iso, locale] as const
	);
}

const cimId = (id: number) => {
	const c = CIMS.find((x) => x.id === id);
	if (!c) throw new Error(`cim ${id} no és al catàleg`);
	return c;
};

function sumaDies(iso: string, dies: number) {
	const d = new Date(`${iso}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + dies);
	return d.toISOString().slice(0, 10);
}

/** Primera data vàlida de cada cim (≥ 2006-07-01 i no futura), ordenada com el carnet. */
function ordreEsperat(files: FilaSembra[], avui = '2026-09-30') {
	const primera = new Map<number, string>();
	for (const f of files) {
		if (f.data < '2006-07-01' || f.data > avui) continue;
		const p = primera.get(f.cimId);
		if (!p || f.data < p) primera.set(f.cimId, f.data);
	}
	return [...primera.entries()].sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
}

/**
 * 41 ascensions: 30 cims diferents (ids 1..30) en ordre no cronològic, 10 repeticions
 * posteriors i 1 repetició anterior (el 01/07/2006, límit inclòs) que passa a ser la 1a.
 */
function dades40(): FilaSembra[] {
	const files: FilaSembra[] = [];
	for (let i = 0; i < 30; i++) {
		files.push({ cimId: i + 1, data: sumaDies('2008-03-01', ((i * 11) % 30) * 97) });
	}
	for (let i = 0; i < 10; i++) {
		files.push({ cimId: i + 1, data: sumaDies(files[i].data, 400), metode: 'raquetes' });
	}
	files.push({ cimId: 11, data: '2006-07-01', metode: 'esqui' });
	return files;
}

// ── (a) Buit ────────────────────────────────────────────────────────────────

test.describe('Carnet buit', () => {
	test('0 ascensions: estat buit amb CTA i sense pestanyes', async ({ page }) => {
		await gotoHydrated(page, APP);
		await expectBdBuida(page);
		await expect(capcalera(page)).toHaveAttribute('aria-busy', 'false');
		await expect(page.getByRole('heading', { name: 'Registra el teu primer cim' })).toBeVisible();
		const cta = page.locator('main').getByRole('link', { name: 'Registrar un cim' });
		await expect(cta).toBeVisible();
		await expect(cta).toHaveAttribute('href', '/ca/app/registrar');
		await expect(tabs(page)).toHaveCount(0);
		expect(await comptador(page)).toBe('0/100');
		await expect(capcalera(page)).toContainText('Sense nivell');
		await expect(capcalera(page)).toContainText('Essencials: 0 de 150');
		// Sense ascensions no hi ha progrés per comarca, però sí les essencials pendents
		await expect(page.getByRole('heading', { name: 'Progrés per comarca' })).toHaveCount(0);
		await expect(page.locator('main')).toContainText('Et falten 150 de 150 cims essencials.');
		// El CTA obre el full de registre
		await cta.click();
		await expect(sheetRegistre(page)).toBeVisible();
	});
});

// ── (b) ~40 ascensions amb repeticions ─────────────────────────────────────

test.describe('Carnet amb dades', () => {
	test('41 ascensions (30 cims): un segell per cim, ordre cronològic, capçalera coherent', async ({
		page
	}) => {
		const files = dades40();
		await sembrar(page, files);
		const esperat = ordreEsperat(files);
		expect(esperat).toHaveLength(30);

		// Nombre de segells = cims diferents que compten (les repeticions no en creen)
		await expect(segells(page)).toHaveCount(30);
		// 100 caselles visibles; per al lector, només les 30 amb segell i un resum de les buides
		await expect(graella(page).locator('li')).toHaveCount(100);
		await expect(graella(page).getByRole('listitem')).toHaveCount(30);
		await expect(panell(page).getByText('Caselles buides: 31–100.')).toHaveCount(1);
		const vist = await segellsVisibles(page);
		expect(vist).toEqual(esperat.map(([id], i) => [i + 1, cimId(id).nom]));

		// La repetició anterior (01/07/2006) ha passat a ser la casella 1
		const primer = esperat[0];
		expect(primer).toEqual([11, '2006-07-01']);
		await expect(casella(page, 1)).toHaveAccessibleName(
			`Casella 1: ${cimId(11).nom}, ${await dataLlarga(page, '2006-07-01')}`
		);

		// Pestanyes: I seleccionada i actual
		await expect(tabs(page)).toHaveCount(5);
		await expect(tabs(page).nth(0)).toHaveAccessibleName('Pàgina I: 30 segells');
		await expect(tabs(page).nth(0)).toHaveAttribute('aria-selected', 'true');
		await expect(tabs(page).nth(0)).toHaveAttribute('aria-current', 'step');
		await expect(panell(page)).toContainText('Caselles 1–100 · 30 de 100 segells');

		// Capçalera
		expect(await comptador(page)).toBe('30/100');
		const cap = capcalera(page);
		await expect(cap).toContainText('Pàgina I');
		await expect(cap).toContainText('Sense nivell');
		await expect(cap).toContainText('70 segells per tancar la pàgina');
		await expect(cap).toContainText('Essencials: 30 de 150');
		await expect(cap.getByRole('img', { name: '30 segells de 100' })).toBeVisible();
		await expect(cap).toContainText('Cims nous el 2026: 0 de 100');
		const [ultimId, ultimaData] = esperat.at(-1)!;
		await expect(cap).toContainText(
			`Últim segell: ${cimId(ultimId).nom}, ${await dataLlarga(page, ultimaData)}`
		);

		// Coherència amb l'historial: 41 ascensions, 11 repeticions que no sumen → 30 cims
		await page.getByRole('link', { name: "Tot l'historial" }).click();
		await expect(page).toHaveURL('/ca/app/historial');
		await expect(page.locator('main')).toContainText(
			'Ascensions registrades en aquest dispositiu: 41.'
		);
		const files_ = page.locator('main section.any li');
		await expect(files_).toHaveCount(41);
		await expect(files_.filter({ hasText: 'Repetició · no suma' })).toHaveCount(11);
	});

	test('ascensions invàlides (abans del 01/07/2006 o futures) no segellen; historial coherent', async ({
		page
	}) => {
		await sembrar(page, [
			{ cimId: CIM.pedraforca.id, data: '2006-06-30' },
			{ cimId: CIM.pedraforca.id, data: '2012-05-05' },
			{ cimId: CIM.montcau.id, data: '2099-01-01' }
		]);
		await expect(segells(page)).toHaveCount(1);
		await expect(casella(page, 1)).toHaveAccessibleName(
			`Casella 1: Pedraforca, ${await dataLlarga(page, '2012-05-05')}`
		);
		expect(await comptador(page)).toBe('1/100');

		// A l'historial, l'ascensió del 2012 és la que compta: no pot dir "no suma"
		await gotoHydrated(page, '/ca/app/historial');
		const fila2012 = page
			.getByRole('region', { name: /^2012\b/ })
			.locator('li')
			.filter({ hasText: 'Pedraforca' });
		await expect(fila2012).toHaveCount(1);
		await expect(fila2012, 'l’ascensió que segella no és una repetició').not.toContainText(
			'Repetició · no suma'
		);
		// La del 30/06/2006 (abans de l'inici del repte) surt com a "fora del repte"
		const fila2006 = page
			.getByRole('region', { name: /^2006\b/ })
			.locator('li')
			.filter({ hasText: 'Pedraforca' });
		await expect(fila2006).toContainText('Fora del repte · no compta');
		await expect(fila2006).not.toContainText('Repetició · no suma');
	});
});

// ── (d) Pàgina I completa ───────────────────────────────────────────────────

test.describe('Pàgina I completa', () => {
	test('100 essencials importades: segell "Completa", data i pestanya II activa', async ({
		page
	}) => {
		test.setTimeout(90_000);
		// 10 per any del 2010 al 2019: la 100a és el 15/10/2019
		const files: FilaSembra[] = Array.from({ length: 100 }, (_, i) => ({
			cimId: i + 1,
			data: `${2010 + Math.floor(i / 10)}-${String((i % 10) + 1).padStart(2, '0')}-15`
		}));
		await gotoHydrated(page, '/ca/app/compte');
		await expectBdBuida(page);
		await page.locator('input[type=file]').setInputFiles({
			name: 'cent.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify(fitxerExportacio(files)))
		});
		await expect(toast(page, /Importació feta\. Noves: 100\./)).toBeVisible({ timeout: 40_000 });

		await gotoHydrated(page, APP);
		const t = tabs(page);
		await expect(t.nth(0)).toHaveAccessibleName('Pàgina I: 100 segells');
		await expect(t.nth(1)).toHaveAccessibleName('Pàgina II: 0 segells');
		// La pàgina que s'omple ara és la II: seleccionada i actual
		await expect(t.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect(t.nth(1)).toHaveAttribute('aria-current', 'step');
		await expect(t.nth(0)).toHaveAttribute('aria-selected', 'false');
		await expect(t.nth(0)).not.toHaveAttribute('aria-current');
		await expect(panell(page).getByRole('heading', { name: 'Pàgina II' })).toBeVisible();
		await expect(segells(page)).toHaveCount(0);
		await expect(panell(page)).toContainText('Caselles 101–200 · 0 de 100 segells');

		// Capçalera: nivell 1×100, objectiu 200
		expect(await comptador(page)).toBe('100/200');
		await expect(capcalera(page)).toContainText('Pàgina II');
		await expect(capcalera(page)).toContainText('Nivell 1×100');
		await expect(capcalera(page)).toContainText('100 segells per tancar la pàgina');

		// Pàgina I: segell "Completa" amb la data de la 100a ascensió
		await t.nth(0).click();
		await expect(panell(page).getByRole('heading', { name: 'Pàgina I' })).toBeVisible();
		await expect(segells(page)).toHaveCount(100);
		const nota = panell(page).getByRole('note');
		await expect(nota).toContainText('Completa', { ignoreCase: true });
		await expect(nota).toContainText(
			`Pàgina completada el ${await dataLlarga(page, '2019-10-15')}`
		);
		// La casella 100 és la 100a ascensió (id 100)
		await expect(casella(page, 100)).toHaveAccessibleName(
			`Casella 100: ${cimId(100).nom}, ${await dataLlarga(page, '2019-10-15')}`
		);
	});
});

// ── (e) Pestanyes amb teclat ────────────────────────────────────────────────

test.describe('Pestanyes de pàgines (patró ARIA tabs)', () => {
	test('fletxes, Inici i Fi mouen el focus i la selecció; aria-current es queda a la I', async ({
		page
	}) => {
		await sembrar(page, [
			{ cimId: CIM.pedraforca.id, data: '2020-01-01' },
			{ cimId: CIM.montcau.id, data: '2021-01-01' }
		]);
		const t = tabs(page);
		await expect(t).toHaveCount(5);
		const seleccionada = async (i: number) => {
			await expect(t.nth(i)).toBeFocused();
			for (let k = 0; k < 5; k++) {
				await expect(t.nth(k)).toHaveAttribute('aria-selected', String(k === i));
				await expect(t.nth(k)).toHaveAttribute('tabindex', k === i ? '0' : '-1');
			}
			await expect(t.nth(0)).toHaveAttribute('aria-current', 'step');
			const romans = ['I', 'II', 'III', 'IV', 'V'];
			await expect(panell(page).getByRole('heading', { level: 3 })).toHaveText(
				`Pàgina ${romans[i]}`
			);
			await expect(panell(page)).toHaveAccessibleName(new RegExp(`^Pàgina ${romans[i]}:`));
		};

		await t.nth(0).focus();
		await page.keyboard.press('ArrowRight');
		await seleccionada(1);
		await page.keyboard.press('ArrowRight');
		await seleccionada(2);
		await page.keyboard.press('ArrowLeft');
		await seleccionada(1);
		await page.keyboard.press('ArrowLeft');
		await seleccionada(0);
		// Dona la volta
		await page.keyboard.press('ArrowLeft');
		await seleccionada(4);
		await page.keyboard.press('ArrowRight');
		await seleccionada(0);
		await page.keyboard.press('End');
		await seleccionada(4);
		await page.keyboard.press('Home');
		await seleccionada(0);
		await expect(segells(page)).toHaveCount(2);
		for (let k = 1; k < 5; k++) await expect(t.nth(k)).not.toHaveAttribute('aria-current');
	});
});

// ── (f) Detall del segell ───────────────────────────────────────────────────

test.describe('Detall del segell', () => {
	const DADES: FilaSembra[] = [
		{ cimId: CIM.pedraforca.id, data: '2020-01-01', nota: 'Per la canal' },
		{ cimId: CIM.montcau.id, data: '2021-01-01' },
		{ cimId: CIM.matagalls.id, data: '2022-01-01' },
		{ cimId: CIM.montcau.id, data: '2023-03-03', metode: 'btt' }
	];

	test('obrir, enrere tanca i el focus torna a la casella; Esc també', async ({ page }) => {
		await sembrar(page, DADES);
		const c1 = casella(page, 1);
		// Amb el teclat: WebKit no enfoca els botons en fer-hi clic (no hi hauria on tornar)
		await obrirAmbTeclat(c1);
		const full = page.getByRole('dialog', { name: 'Pedraforca' });
		await expect(full).toBeVisible();
		await expect(page).toHaveURL(APP);
		await expect(full).toContainText('Casella 1 · Pàgina I');
		await expect(full).toContainText('Compta per al repte · Cim essencial');
		await expect(full).toContainText('Per la canal');
		await expect(full).toContainText('Sense repeticions');
		await expect(full.getByRole('link', { name: 'Fitxa del cim' })).toHaveAttribute(
			'href',
			`/ca/cims/${CIM.pedraforca.slug}`
		);

		await page.goBack();
		await expect(full).toBeHidden();
		await expect(page).toHaveURL(APP);
		await expect(c1).toBeFocused();

		// Montcau: 1 repetició
		const c2 = casella(page, 2);
		await obrirAmbTeclat(c2);
		const fullM = page.getByRole('dialog', { name: 'Montcau' });
		await expect(fullM).toContainText('Repeticions: 1');
		await expect(fullM).toContainText('BTT');
		await page.keyboard.press('Escape');
		await expect(fullM).toBeHidden();
		await expect(c2).toBeFocused();
		await expect(page.getByRole('dialog')).toHaveCount(0);
	});

	test('editar la data reordena les caselles; enrere no torna al detall; focus al segell', async ({
		page
	}) => {
		await sembrar(page, DADES);
		expect(await segellsVisibles(page)).toEqual([
			[1, 'Pedraforca'],
			[2, 'Montcau'],
			[3, 'Matagalls']
		]);
		await obrirAmbTeclat(casella(page, 1));
		const full = page.getByRole('dialog', { name: 'Pedraforca' });
		await full.getByRole('button', { name: "Edita l'ascensió" }).click();
		const edicio = page.getByRole('dialog', { name: SHEET_EDICIO });
		await expect(edicio).toBeVisible();
		await expect(edicio.getByLabel('Data')).toHaveValue('2020-01-01');
		await edicio.getByLabel('Data').fill('2024-06-01');
		await edicio.getByRole('button', { name: 'Desa els canvis' }).click();
		await expect(edicio).toBeHidden();
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page).toHaveURL(APP);
		await expect(toast(page, 'Ascensió actualitzada.')).toBeVisible();

		// Pedraforca passa de la casella 1 a la 3
		await expect
			.poll(() => segellsVisibles(page))
			.toEqual([
				[1, 'Montcau'],
				[2, 'Matagalls'],
				[3, 'Pedraforca']
			]);
		await expect(casella(page, 3)).toHaveAccessibleName(
			`Casella 3: Pedraforca, ${await dataLlarga(page, '2024-06-01')}`
		);
		const files = await filesBd(page);
		expect(files.find((f) => f.cimId === CIM.pedraforca.id)?.data).toBe('2024-06-01');

		// El focus ha de tornar al segell editat (ara a la casella 3), no a una altra casella
		const focus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
		expect(focus, 'focus després d’editar').toMatch(/^Casella 3: Pedraforca/);
	});

	test('recarregar amb el detall obert no trenca la pàgina', async ({ page }) => {
		await sembrar(page, DADES);
		await casella(page, 2).click();
		await expect(page.getByRole('dialog', { name: 'Montcau' })).toBeVisible();
		await page.reload();
		await waitForHydration(page);
		await expect(segells(page)).toHaveCount(3);
	});

	test('"Registrar una altra ascensió" obre el full amb el cim i enrere torna al carnet', async ({
		page
	}) => {
		await sembrar(page, DADES);
		await casella(page, 3).click();
		const full = page.getByRole('dialog', { name: 'Matagalls' });
		await full.getByRole('link', { name: 'Registrar una altra ascensió' }).click();
		const reg = sheetRegistre(page);
		await expect(reg.getByRole('button', { name: 'Canvia el cim (Matagalls)' })).toBeVisible();
		await page.goBack();
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page).toHaveURL(APP);
	});
});

// ── (g) Essencials pendents ─────────────────────────────────────────────────

const BCN = { latitude: 41.3874, longitude: 2.1686 };

function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
	const rad = Math.PI / 180;
	const h =
		Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
		Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lon - a.lon) * rad) / 2) ** 2;
	return 2 * 6371.0088 * Math.asin(Math.min(1, Math.sqrt(h)));
}

const perComarca = (a: Cim, b: Cim) =>
	a.comarca.localeCompare(b.comarca, 'ca') || b.altitud - a.altitud || a.id - b.id;

const noms = (page: Page) => page.locator('main ul.llista li').locator('a.nom').allInnerTexts();

/** Compta les crides a la geolocalització (sense substituir-la). */
async function vigilaGeo(page: Page) {
	await page.addInitScript(() => {
		const w = window as unknown as { __geo: number };
		w.__geo = 0;
		const g = navigator.geolocation;
		if (!g) return;
		const orig = g.getCurrentPosition.bind(g);
		const origW = g.watchPosition.bind(g);
		g.getCurrentPosition = (...a: Parameters<Geolocation['getCurrentPosition']>) => {
			w.__geo++;
			return orig(...a);
		};
		g.watchPosition = (...a: Parameters<Geolocation['watchPosition']>) => {
			w.__geo++;
			return origW(...a);
		};
	});
	return () => page.evaluate(() => (window as unknown as { __geo: number }).__geo);
}

test.describe('Essencials pendents (/app/essencials)', () => {
	const FETES = [43, CIM.pedraforca.id]; // Sant Pere Màrtir (la més propera a BCN) i Pedraforca
	const pendents = CIMS.filter((c) => c.essencial && !FETES.includes(c.id));

	test('per defecte per comarca; sense demanar la posició en carregar', async ({ page }) => {
		const crides = await vigilaGeo(page);
		await sembrar(
			page,
			FETES.map((id) => ({ cimId: id, data: '2024-01-01' })),
			ROUTES.ca.essentials
		);
		await expect(
			page.getByRole('heading', { level: 1, name: 'Essencials pendents' })
		).toBeVisible();
		await expect(page.locator('main')).toContainText(
			`Et falten ${pendents.length} de 150 cims essencials.`
		);
		await expect(estat(page)).toHaveText('Ordenats per comarca i altitud.');
		const esperat = [...pendents].sort(perComarca).map((c) => c.nom);
		expect(await noms(page)).toEqual(esperat);
		await page.waitForTimeout(500);
		expect(await crides(), 'geolocalització en carregar').toBe(0);
		// També al carnet (resum de 3)
		await gotoHydrated(page, APP);
		expect(await noms(page)).toEqual(esperat.slice(0, 3));
		await expect(
			page.getByRole('link', {
				name: new RegExp(`^(Totes les|Tots els) pendents \\(${pendents.length}\\) →$`)
			})
		).toBeVisible();
		expect(await crides()).toBe(0);
	});

	test('permís denegat: missatge i la llista continua per comarca', async ({ page, context }) => {
		await context.clearPermissions();
		// Denegació determinista en tots els navegadors
		await page.addInitScript(() => {
			navigator.geolocation.getCurrentPosition = (_ok, ko) =>
				ko?.({ code: 1, message: 'denied', PERMISSION_DENIED: 1 } as GeolocationPositionError);
		});
		await sembrar(page, [{ cimId: 43, data: '2024-01-01' }], ROUTES.ca.essentials);
		const esperat = CIMS.filter((c) => c.essencial && c.id !== 43)
			.sort(perComarca)
			.map((c) => c.nom);
		await page.getByRole('button', { name: 'Ordena per proximitat' }).click();
		await expect(page.getByRole('alert')).toContainText('No hi ha permís per saber on ets');
		await expect(estat(page)).toHaveText('Ordenats per comarca i altitud.');
		expect(await noms(page)).toEqual(esperat);
		await expect(page.getByRole('button', { name: 'Ordena per proximitat' })).toBeVisible();
	});

	test('permís concedit: ordre per distància des de Barcelona i tornar a comarca', async ({
		page,
		context
	}) => {
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BCN);
		await sembrar(
			page,
			FETES.map((id) => ({ cimId: id, data: '2024-01-01' })),
			ROUTES.ca.essentials
		);
		const des = { lat: BCN.latitude, lon: BCN.longitude };
		const perDistancia = [...pendents].sort(
			(a, b) =>
				distanciaKm(des, { lat: a.lat!, lon: a.lon! }) -
					distanciaKm(des, { lat: b.lat!, lon: b.lon! }) || perComarca(a, b)
		);
		// La més propera pendent (Sant Pere Màrtir ja és feta)
		expect(perDistancia[0].nom).toBe('Turó de la Magarola');

		await page.getByRole('button', { name: 'Ordena per proximitat' }).click();
		await expect(estat(page)).toHaveText('Ordenats per distància des de la teva posició.');
		const vist = await noms(page);
		expect(vist[0]).toBe(perDistancia[0].nom);
		expect(vist).toEqual(perDistancia.map((c) => c.nom));
		const primera = page.locator('main ul.llista li').first();
		await expect(primera).toContainText(/a 6,9 km/);
		await expect(page.getByRole('alert')).toHaveCount(0);

		// Torna a l'ordre per comarca amb el mateix botó (el focus no es perd)
		const boto = page.getByRole('button', { name: 'Ordena per comarca' });
		await boto.focus();
		await page.keyboard.press('Enter');
		await expect(estat(page)).toHaveText('Ordenats per comarca i altitud.');
		await expect(page.getByRole('button', { name: 'Ordena per proximitat' })).toBeFocused();
		expect(await noms(page)).toEqual([...pendents].sort(perComarca).map((c) => c.nom));
		await expect(page.locator('main ul.llista')).not.toContainText(' km');
	});
});

// ── (h) Progrés per comarca ─────────────────────────────────────────────────

test.describe('Progrés per comarca (/app/comarques)', () => {
	test('els meters coincideixen amb el catàleg i l’ordre és per progrés relatiu', async ({
		page
	}) => {
		const files: FilaSembra[] = [
			{ cimId: 43, data: '2020-01-01' }, // Baix Llobregat
			{ cimId: 44, data: '2020-02-01' },
			{ cimId: 44, data: '2021-02-01' }, // repetició: no suma
			{ cimId: 48, data: '2020-03-01' }, // Barcelonès
			{ cimId: 47, data: '2020-04-01' },
			{ cimId: CIM.pedraforca.id, data: '2019-05-01' },
			{ cimId: CIM.canigo.id, data: '2018-06-01' },
			{ cimId: CIM.pica.id, data: '2005-06-01' } // invàlida: no suma
		];
		await sembrar(page, files, ROUTES.ca.regions);
		const fets = new Map<string, Set<number>>();
		for (const f of files) {
			if (f.data < '2006-07-01') continue;
			const c = cimId(f.cimId);
			(fets.get(c.comarca) ?? fets.set(c.comarca, new Set()).get(c.comarca)!).add(c.id);
		}
		const comarquesAmbCims = COMARQUES.filter((c) => CIMS.some((x) => x.comarca === c.slug));
		const esperat = comarquesAmbCims
			.map((c) => {
				const total = CIMS.filter((x) => x.comarca === c.slug).length;
				const n = fets.get(c.slug)?.size ?? 0;
				return { slug: c.slug, nom: c.nom, n, total, f: n / total };
			})
			.sort((a, b) => b.f - a.f || b.n - a.n || a.slug.localeCompare(b.slug, 'ca'));

		const meters = page.locator('main').getByRole('meter');
		await expect(meters).toHaveCount(esperat.length);
		const vist = await meters.evaluateAll((ms) =>
			ms.map((m) => ({
				nom: m.getAttribute('aria-label'),
				now: Number(m.getAttribute('aria-valuenow')),
				max: Number(m.getAttribute('aria-valuemax')),
				min: Number(m.getAttribute('aria-valuemin')),
				text: m.getAttribute('aria-valuetext')
			}))
		);
		expect(vist).toEqual(
			esperat.map((e) => ({
				nom: e.nom,
				now: e.n,
				max: e.total,
				min: 0,
				text: `${e.n} de ${e.total} cims`
			}))
		);
		// Barcelonès (2 de 2) davant del Baix Llobregat (2 de 4)
		expect(vist[0].nom).toBe('Barcelonès');

		// Resum del carnet: les 5 primeres
		await gotoHydrated(page, APP);
		const resum = page.getByRole('region', { name: 'Progrés per comarca' }).getByRole('meter');
		await expect(resum).toHaveCount(5);
		expect(await resum.evaluateAll((ms) => ms.map((m) => m.getAttribute('aria-label')))).toEqual(
			esperat.slice(0, 5).map((e) => e.nom)
		);
	});
});

// ── (i) Error de càrrega offline: focus a "Torna-ho a provar" ───────────────

test('offline sense precàrrega: el focus va directament a "Torna-ho a provar"', async ({
	page,
	context,
	consoleGuard
}) => {
	consoleGuard.allow(
		/Failed to (load resource|fetch dynamically imported module)|Importing a module script failed|ERR_INTERNET_DISCONNECTED|Load failed|error loading dynamically imported module/i
	);
	await gotoHydrated(page, '/ca/cims');
	await context.setOffline(true);
	await mainNav(page).getByRole('link', { name: 'Registrar una ascensió' }).click();
	const full = sheetRegistre(page);
	const reintenta = full.getByRole('alert').getByRole('button', { name: 'Torna-ho a provar' });
	await expect(reintenta).toBeVisible();
	await expect(reintenta).toBeFocused();
	await context.setOffline(false);
});

// ── (j) Accessibilitat, reflow, idiomes ─────────────────────────────────────

const DADES_A11Y: FilaSembra[] = [
	{ cimId: CIM.pedraforca.id, data: '2020-01-01', nota: 'Nota llarga '.repeat(20) },
	{ cimId: CIM.montcau.id, data: '2021-01-01' },
	{ cimId: CIM.montcau.id, data: '2022-01-01' },
	{ cimId: CIM.picossa.id, data: '2022-03-01' },
	{ cimId: CIM.aliga.id, data: '2023-01-01' }
];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe carnet · ${colorScheme}`, () => {
		test.use({ colorScheme });

		test('/ca/app buit', async ({ page }) => {
			await gotoHydrated(page, APP);
			await expect(page.getByRole('heading', { name: 'Registra el teu primer cim' })).toBeVisible();
			await axeSoft(page);
		});

		test('/ca/app amb dades, pàgina I completa i detall obert', async ({ page }) => {
			test.setTimeout(90_000);
			const files: FilaSembra[] = Array.from({ length: 101 }, (_, i) => ({
				cimId: i + 1,
				data: `${2010 + Math.floor(i / 10)}-${String((i % 10) + 1).padStart(2, '0')}-15`
			}));
			await sembrar(page, files);
			await expect(tabs(page).nth(1)).toHaveAttribute('aria-selected', 'true');
			await axeSoft(page);
			await tabs(page).nth(0).click();
			await expect(panell(page).getByRole('note')).toBeVisible();
			await axeSoft(page);
			await casella(page, 1).click();
			await expect(page.getByRole('dialog')).toBeVisible();
			await axeSoft(page);
		});

		test('/ca/app amb poques dades i detall amb nota i repeticions', async ({ page }) => {
			await sembrar(page, DADES_A11Y);
			await axeSoft(page);
			await casella(page, 1).click();
			await expect(page.getByRole('dialog', { name: 'Pedraforca' })).toBeVisible();
			await axeSoft(page);
		});

		test('/ca/app/essencials (per comarca i per proximitat) i /ca/app/comarques', async ({
			page,
			context
		}) => {
			await context.grantPermissions(['geolocation']);
			await context.setGeolocation(BCN);
			await sembrar(page, DADES_A11Y, ROUTES.ca.essentials);
			await axeSoft(page);
			await page.getByRole('button', { name: 'Ordena per proximitat' }).click();
			await expect(estat(page)).toHaveText(/distància/);
			await axeSoft(page);
			await gotoHydrated(page, ROUTES.ca.regions);
			await expect(page.locator('main').getByRole('meter').first()).toBeVisible();
			await axeSoft(page);
		});
	});
}

test.describe('Reflow a 320 px i idiomes', () => {
	test('sense scroll horitzontal a 320 px (carnet amb dades, detall, essencials, comarques)', async ({
		page,
		context
	}) => {
		test.setTimeout(90_000);
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BCN);
		await page.setViewportSize({ width: 320, height: 640 });
		await sembrar(page, DADES_A11Y);
		const comprova = async (on: string) => {
			await settleAnimations(page);
			const o = await overflowX(page);
			expect.soft(o.px, `${on} desborda (${o.culprit})`).toBeLessThanOrEqual(0);
		};
		await comprova('/ca/app');
		await casella(page, 1).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		const dlg = await page.getByRole('dialog').evaluate((d) => ({
			sw: d.scrollWidth,
			cw: d.clientWidth,
			right: d.getBoundingClientRect().right
		}));
		expect.soft(dlg.sw, 'el detall desborda horitzontalment').toBeLessThanOrEqual(dlg.cw);
		expect.soft(dlg.right).toBeLessThanOrEqual(320.5);
		await comprova('/ca/app (detall obert)');
		await page.keyboard.press('Escape');
		for (const url of [
			ROUTES.ca.essentials,
			ROUTES.ca.regions,
			ROUTES.es.app,
			ROUTES.es.essentials,
			ROUTES.es.regions
		]) {
			await gotoHydrated(page, url);
			await comprova(url);
		}
		await gotoHydrated(page, ROUTES.ca.essentials);
		await page.getByRole('button', { name: 'Ordena per proximitat' }).click();
		await expect(estat(page)).toHaveText(/distància/);
		await comprova('/ca/app/essencials per proximitat');
	});

	test('castellà: pestanyes, caselles, detall i pàgines en castellà', async ({ page }) => {
		await sembrar(page, DADES_A11Y, ROUTES.es.app);
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		await expect(page.getByRole('heading', { level: 1, name: 'Mi carnet' })).toBeVisible();
		const t = page
			.getByRole('tablist', { name: 'Páginas del carnet, de la I a la V' })
			.getByRole('tab');
		await expect(t.nth(0)).toHaveAccessibleName('Página I: 4 sellos');
		const g = page.getByRole('list', { name: 'Casillas de la página I' });
		await expect(g.getByRole('button').first()).toHaveAccessibleName(
			`Casilla 1: Pedraforca, ${await dataLlarga(page, '2020-01-01', 'es')}`
		);
		await g.getByRole('button').first().click();
		const full = page.getByRole('dialog', { name: 'Pedraforca' });
		await expect(full.getByRole('button', { name: 'Editar la ascensión' })).toBeVisible();
		await expect(full.getByRole('link', { name: /Ficha de la cima/i })).toHaveAttribute(
			'href',
			`/es/cimas/${CIM.pedraforca.slug}`
		);
		await page.keyboard.press('Escape');

		await gotoHydrated(page, ROUTES.es.essentials);
		await expect(
			page.getByRole('heading', { level: 1, name: 'Esenciales pendientes' })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Ordenar por proximidad' })).toBeVisible();
		await gotoHydrated(page, ROUTES.es.regions);
		await expect(
			page.getByRole('heading', { level: 1, name: 'Progreso por comarca' })
		).toBeVisible();
		const hrefs = await page
			.locator('main')
			.getByRole('link')
			.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs.some((h) => h?.startsWith('/es/comarcas/'))).toBe(true);
		expect(hrefs.filter((h) => h?.startsWith('/ca/'))).toEqual([]);
	});

	for (const url of [ROUTES.ca.essentials, ROUTES.es.regions]) {
		test(`${url} porta X-Robots-Tag i meta robots noindex`, async ({ page }) => {
			const res = await page.goto(url);
			expect(res?.headers()['x-robots-tag']).toContain('noindex');
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
		});
	}
});

// ── Verbositat per a lectors de pantalla ─────────────────────────────────────

test('lector de pantalla: la graella només anuncia els segells i resumeix les buides', async ({
	page
}) => {
	await sembrar(page, [{ cimId: CIM.pedraforca.id, data: '2020-01-01' }]);
	// Visualment hi ha 100 caselles; per al lector, la llista només té la casella amb segell.
	await expect(graella(page).locator('li')).toHaveCount(100);
	await expect(graella(page).getByRole('listitem')).toHaveCount(1);
	await expect(graella(page).getByRole('listitem').getByRole('button')).toHaveAccessibleName(
		/^Casella 1: Pedraforca, /
	);
	await expect(graella(page).locator('li[aria-hidden="true"]')).toHaveCount(99);
	// Un sol resum de les buides, fora de la llista
	await expect(panell(page).getByText('Caselles buides: 2–100.')).toHaveCount(1);
});
