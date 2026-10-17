/**
 * Bloc R1 · Estadístiques (/ca/app/estadistiques, /es/app/estadisticas).
 *
 * Estats buit / poques dades / moltes dades. Les xifres esperades es calculen aquí amb un oracle
 * propi (`esperat`) sobre `cims.json` i `municipis.json`; no es copia `domain/estadistiques.ts`.
 * El rellotge del navegador es fixa (`page.clock.setFixedTime`) perquè la ratxa i les dates
 * "futures" no depenguin del dia en què es passen els tests.
 */
import type { Locator, Page } from '@playwright/test';
import { test, expect, gotoHydrated, ROUTES } from './fixtures';
import { CIM, sembrar, type FilaSembra } from './ascensions';
import {
	CIMS,
	COMARQUES,
	cimPerId,
	conte,
	distanciaKm,
	escriureOrigen,
	exacte,
	expectAxeNet,
	expectSenseDesbord,
	llegirOrigen,
	municipi,
	t,
	type Locale,
	type MunicipiE2E
} from './r1';

/** "Avui" fix dels tests (hora local de Madrid; dijous). */
const AVUI = '2026-10-16';
const ARA = new Date('2026-10-16T10:00:00+02:00');

const BARCELONA = municipi('Barcelona');

async function fixarRellotge(page: Page) {
	await page.clock.setFixedTime(ARA);
}

const resum = (page: Page) => page.getByTestId('stats-resum');

// ---------------------------------------------------------------------------
// Oracle
// ---------------------------------------------------------------------------

const METODES = ['a-peu', 'btt', 'esqui', 'raquetes'];

interface Esperat {
	ascensions: number;
	cimsDiferents: number;
	repeticions: number;
	foraRepte: number;
	mesFet: { cimId: number; n: number } | null;
	repetits: { cimId: number; n: number }[];
	essencials: { fets: number; total: number };
	infantil: number;
	comarques: { fets: number; total: number };
	altitudAcumulada: number;
	cimMesAlt: number | null;
	primer: number | null;
	llunya: { cimId: number; km: number } | null;
	perAny: { any: number; ascensions: number; nous: number }[];
	millorAny: number | null;
	ratxaActual: number;
	ratxaMaxima: number;
	mesActualFet: boolean;
	companys: { nom: string; n: number }[];
}

function esperat(files: FilaSembra[], avui: string, origen: MunicipiE2E | null): Esperat {
	const valides = files.filter(
		(f) =>
			f.data >= '2006-07-01' &&
			f.data <= avui &&
			METODES.includes(f.metode ?? 'a-peu') &&
			CIMS.some((c) => c.id === f.cimId)
	);
	const perCim = new Map<number, { n: number; primera: string; ultima: string }>();
	for (const f of valides) {
		const r = perCim.get(f.cimId);
		if (!r) perCim.set(f.cimId, { n: 1, primera: f.data, ultima: f.data });
		else {
			r.n++;
			if (f.data < r.primera) r.primera = f.data;
			if (f.data > r.ultima) r.ultima = f.data;
		}
	}
	const ranking = [...perCim.entries()].sort(
		([ia, a], [ib, b]) =>
			b.n - a.n || b.ultima.localeCompare(a.ultima) || a.primera.localeCompare(b.primera) || ia - ib
	);
	const fets = [...perCim.keys()].map(cimPerId);
	const essencialsTotal = CIMS.filter((c) => c.essencial).length;
	const comarquesAmbCims = COMARQUES.filter((c) => CIMS.some((x) => x.comarca === c.slug));

	let llunya: Esperat['llunya'] = null;
	if (origen) {
		for (const c of fets) {
			if (c.lat === null || c.lon === null) continue;
			const km = distanciaKm(origen, { lat: c.lat, lon: c.lon });
			const actual = llunya ? cimPerId(llunya.cimId) : null;
			if (
				!llunya ||
				km > llunya.km + 1e-9 ||
				(Math.abs(km - llunya.km) <= 1e-9 &&
					(c.altitud > actual!.altitud || (c.altitud === actual!.altitud && c.id < actual!.id)))
			)
				llunya = { cimId: c.id, km };
		}
	}

	const anys = new Map<number, { ascensions: number; nous: number }>();
	for (const f of valides) {
		const any = Number(f.data.slice(0, 4));
		const r = anys.get(any) ?? { ascensions: 0, nous: 0 };
		r.ascensions++;
		anys.set(any, r);
	}
	for (const [, r] of perCim) anys.get(Number(r.primera.slice(0, 4)))!.nous++;
	const perAny = [...anys.entries()].sort(([a], [b]) => a - b).map(([any, r]) => ({ any, ...r }));
	const millor = [...perAny].sort(
		(a, b) => b.nous - a.nous || b.ascensions - a.ascensions || b.any - a.any
	)[0];

	// Ratxa de mesos (índex = any * 12 + mes)
	const idx = (d: string) => Number(d.slice(0, 4)) * 12 + Number(d.slice(5, 7)) - 1;
	const mesos = new Set(valides.map((f) => idx(f.data)));
	const comptaEnrere = (desDe: number) => {
		let n = 0;
		while (mesos.has(desDe - n)) n++;
		return n;
	};
	const mesAvui = idx(avui);
	const mesActualFet = mesos.has(mesAvui);
	const ratxaActual = mesActualFet ? comptaEnrere(mesAvui) : comptaEnrere(mesAvui - 1);
	let ratxaMaxima = 0;
	for (const m of mesos) {
		if (mesos.has(m - 1)) continue;
		let n = 0;
		while (mesos.has(m + n)) n++;
		ratxaMaxima = Math.max(ratxaMaxima, n);
	}

	// Companys: totes les ascensions vives (també les de fora del repte), un cop per ascensió.
	// Empat: el més recent primer (data de l'última ascensió on surt), després alfabètic.
	const companys = new Map<string, { n: number; ultima: string }>();
	for (const f of files)
		for (const c of new Set(f.companys ?? [])) {
			const r = companys.get(c) ?? { n: 0, ultima: '' };
			r.n++;
			if (f.data > r.ultima) r.ultima = f.data;
			companys.set(c, r);
		}

	const primeraValida = [...valides].sort((a, b) => a.data.localeCompare(b.data))[0];
	return {
		ascensions: valides.length,
		cimsDiferents: perCim.size,
		repeticions: valides.length - perCim.size,
		foraRepte: files.length - valides.length,
		mesFet:
			ranking[0] && ranking[0][1].n >= 2 ? { cimId: ranking[0][0], n: ranking[0][1].n } : null,
		repetits: ranking
			.filter(([, r]) => r.n >= 2)
			.slice(0, 5)
			.map(([cimId, r]) => ({ cimId, n: r.n })),
		essencials: { fets: fets.filter((c) => c.essencial).length, total: essencialsTotal },
		infantil: new Set(valides.filter((f) => f.data >= '2026-07-01').map((f) => f.cimId)).size,
		comarques: {
			fets: new Set(fets.map((c) => c.comarca)).size,
			total: comarquesAmbCims.length
		},
		altitudAcumulada: fets.reduce((s, c) => s + c.altitud, 0),
		cimMesAlt: fets.length
			? [...fets].sort((a, b) => b.altitud - a.altitud || a.id - b.id)[0].id
			: null,
		primer: primeraValida?.cimId ?? null,
		llunya,
		perAny,
		millorAny: millor?.any ?? null,
		ratxaActual,
		ratxaMaxima,
		mesActualFet,
		companys: [...companys.entries()]
			.sort(
				([a, ra], [b, rb]) =>
					rb.n - ra.n || rb.ultima.localeCompare(ra.ultima) || a.localeCompare(b, 'ca')
			)
			.map(([nom, r]) => ({ nom, n: r.n }))
	};
}

const altitud = (m: number) =>
	Math.round(m)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------------------------------------------------------------------------
// Dades
// ---------------------------------------------------------------------------

/** 30 essencials del catàleg (ordre d'id, sense els que es repeteixen a part). */
const RESERVATS: number[] = [
	CIM.montcau.id,
	CIM.matagalls.id,
	CIM.canigo.id,
	CIM.pica.id,
	CIM.aliga.id
];
const ESSENCIALS = CIMS.filter((c) => c.essencial && !RESERVATS.includes(c.id))
	.sort((a, b) => a.id - b.id)
	.slice(0, 30);

/**
 * Moltes dades: 8 anys, repeticions (Montcau ×4, Matagalls ×3), tots els mètodes, una ratxa
 * màxima de 7 mesos (2023-01 → 2023-07) i una d'actual de 5 (2026-05 → 2026-09: viva perquè
 * l'octubre encara no té ascensió), companys i 2 de fora del repte (2005 i futura).
 */
function moltesDades(): FilaSembra[] {
	const f: FilaSembra[] = [];
	const metodes = ['a-peu', 'btt', 'esqui', 'raquetes'] as const;
	ESSENCIALS.slice(0, 12).forEach((c, i) =>
		f.push({
			cimId: c.id,
			data: `${2019 + (i % 4)}-0${1 + (i % 9)}-1${i % 9}`,
			metode: metodes[i % 4]
		})
	);
	for (let m = 1; m <= 7; m++)
		f.push({
			cimId: ESSENCIALS[12 + m].id,
			data: `2023-0${m}-05`,
			companys: m % 2 ? ['Inesa', 'Pau'] : ['Inesa']
		});
	for (let m = 5; m <= 9; m++)
		f.push({
			cimId: ESSENCIALS[20 + m - 5].id,
			data: `2026-0${m}-20`,
			companys: m === 9 ? ['Marta'] : []
		});
	// Repeticions
	f.push({ cimId: CIM.montcau.id, data: '2020-03-01', companys: ['Pau'] });
	f.push({ cimId: CIM.montcau.id, data: '2021-03-01' });
	f.push({ cimId: CIM.montcau.id, data: '2024-03-01', nota: 'Amb boira' });
	f.push({ cimId: CIM.montcau.id, data: '2025-03-01' });
	f.push({ cimId: CIM.matagalls.id, data: '2020-06-01' });
	f.push({ cimId: CIM.matagalls.id, data: '2024-06-01' });
	f.push({ cimId: CIM.matagalls.id, data: '2025-06-01' });
	f.push({ cimId: CIM.canigo.id, data: '2025-08-15', metode: 'raquetes', companys: ['Inesa'] });
	// Fora del repte (no compten enlloc)
	f.push({ cimId: CIM.pica.id, data: '2005-07-01', companys: ['Jordi'] });
	f.push({ cimId: CIM.pica.id, data: '2027-01-01' });
	return f;
}

// ---------------------------------------------------------------------------
// Estats
// ---------------------------------------------------------------------------

test.describe('Estadístiques · estats', () => {
	for (const locale of ['ca', 'es'] as Locale[]) {
		test(`buit (${locale}): estat buit, CTA de registrar i cap secció`, async ({ page }) => {
			await gotoHydrated(page, ROUTES[locale].stats);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(
				exacte(locale, 'stats_title')
			);
			await expect(
				page.getByRole('heading', { name: exacte(locale, 'stats_empty_title') })
			).toBeVisible();
			await expect(resum(page)).toHaveCount(0);
			await expect(page.getByTestId('stats-llunya')).toHaveCount(0);
			const cta = page.locator('main').getByRole('link', { name: exacte(locale, 'app_empty_cta') });
			await expect(cta).toBeVisible();
		});
	}

	test('només ascensions fora del repte: estat buit que diu quantes no compten', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				{ cimId: CIM.pica.id, data: '2005-01-01' },
				{ cimId: CIM.montcau.id, data: '2006-06-30' }
			],
			ROUTES.ca.stats
		);
		await expect(
			page.getByRole('heading', { name: exacte('ca', 'stats_empty_title') })
		).toBeVisible();
		await expect(page.locator('main')).toContainText(
			t('ca', 'stats_out_of_challenge', { count: 2 })
		);
		await expect(resum(page)).toHaveCount(0);
	});

	test('poques dades (1 ascensió): resum, llunyà sense origen, sense rànquing, anys ni ratxa', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(page, [{ cimId: CIM.pedraforca.id, data: '2025-08-10' }], ROUTES.ca.stats);
		await expect(resum(page)).toBeVisible();
		await expect(resum(page).locator('dd')).toHaveText(['1', '1', '0']);
		await expect(page.getByTestId('stats-mes-fet')).toHaveCount(0);
		await expect(page.getByTestId('stats-anys')).toHaveCount(0);
		await expect(page.getByTestId('stats-ratxa')).toHaveCount(0);
		const llunya = page.getByTestId('stats-llunya');
		await expect(llunya).toContainText(t('ca', 'stats_far_empty'));
		await expect(
			llunya.getByRole('button', { name: exacte('ca', 'stats_far_choose') })
		).toBeVisible();
		await expect(page.getByTestId('stats-companys')).toContainText(t('ca', 'stats_partners_empty'));
		// Fites: el primer segell és el mateix que l'últim (no es repeteix "Últim segell").
		const fites = page.getByTestId('stats-fites');
		await expect(fites.getByText(exacte('ca', 'stats_first'))).toBeVisible();
		await expect(fites.getByText(exacte('ca', 'stats_last'))).toHaveCount(0);
		await expect(fites).toContainText(`${altitud(cimPerId(CIM.pedraforca.id).altitud)} m`);
	});

	test('dues ascensions al mateix cim: "el que més has fet" apareix (×2) però sense rànquing', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2024-01-10' },
				{ cimId: CIM.matagalls.id, data: '2025-01-10' },
				{ cimId: CIM.montcau.id, data: '2025-02-10' }
			],
			ROUTES.ca.stats
		);
		const mesFet = page.getByTestId('stats-mes-fet');
		await expect(mesFet.getByRole('link', { name: 'Matagalls' })).toBeVisible();
		await expect(mesFet).toContainText(t('ca', 'stats_most_count', { count: 2 }));
		await expect(mesFet.locator('ol.ranking')).toHaveCount(0);
		// Dos anys: gràfic per anys i millor any
		await expect(page.getByTestId('stats-anys').locator('li')).toHaveCount(2);
	});
});

// ---------------------------------------------------------------------------
// Moltes dades amb oracle
// ---------------------------------------------------------------------------

async function comprovarMoltesDades(page: Page, locale: Locale, e: Esperat) {
	// Resum
	await expect(resum(page).locator('dd')).toHaveText([
		String(e.cimsDiferents),
		String(e.ascensions),
		String(e.repeticions)
	]);
	await expect(resum(page)).toContainText(
		t(locale, 'stats_out_of_challenge', { count: e.foraRepte })
	);

	// El cim que més has fet + rànquing
	const mesFet = page.getByTestId('stats-mes-fet');
	expect(e.mesFet).not.toBeNull();
	await expect(mesFet.locator('.d-nom')).toHaveText(cimPerId(e.mesFet!.cimId).nom);
	await expect(mesFet.locator('.d-xifra')).toHaveText(
		exacte(locale, 'stats_most_count', { count: e.mesFet!.n })
	);
	await expect(mesFet.locator('ol.ranking li a')).toHaveText(
		e.repetits.map((r) => cimPerId(r.cimId).nom)
	);

	// Percentatges: barres role=meter amb valors
	const pct = page.getByTestId('stats-percentatges');
	const ess = pct.getByRole('meter', { name: t(locale, 'stats_pct_essentials') });
	await expect(ess).toHaveAttribute('aria-valuenow', String(e.essencials.fets));
	await expect(ess).toHaveAttribute('aria-valuemax', String(e.essencials.total));
	await expect(ess).toHaveAttribute(
		'aria-valuetext',
		conte(locale, 'stats_pct_value', { done: e.essencials.fets, total: e.essencials.total })
	);
	if (CIMS.every((c) => c.essencial)) {
		// El catàleg només té essencials: no es duplica la barra del catàleg
		await expect(pct.getByRole('meter', { name: t(locale, 'stats_pct_catalog') })).toHaveCount(0);
		await expect(pct).toContainText(t(locale, 'stats_pct_catalog_only_essentials'));
	}
	const cent = pct.getByRole('meter', { name: t(locale, 'stats_challenge_100') });
	await expect(cent).toHaveAttribute('aria-valuemax', '100');
	// Catàleg només d'essencials i < 100 l'any: compten tots els cims diferents vàlids.
	await expect(cent).toHaveAttribute('aria-valuenow', String(e.cimsDiferents));
	const inf = pct.getByRole('meter', { name: t(locale, 'stats_challenge_kids') });
	await expect(inf).toHaveAttribute('aria-valuemax', '50');
	await expect(inf).toHaveAttribute('aria-valuenow', String(e.infantil));
	await expect(pct).toContainText(
		t(locale, 'stats_comarques_value', { done: e.comarques.fets, total: e.comarques.total })
	);

	// Fites
	const fites = page.getByTestId('stats-fites');
	await expect(fites).toContainText(`${altitud(e.altitudAcumulada)} m`);
	await expect(fites.getByRole('link', { name: cimPerId(e.cimMesAlt!).nom })).toBeVisible();
	await expect(fites.getByRole('link', { name: cimPerId(e.primer!).nom }).first()).toBeVisible();

	// Per anys (text per al lector de pantalla: el gràfic és aria-hidden)
	const asc = (n: number) =>
		n === 1 ? t(locale, 'stats_count_ascents_one') : t(locale, 'stats_count_ascents', { count: n });
	const nous = (n: number) =>
		n === 1 ? t(locale, 'stats_count_new_one') : t(locale, 'stats_count_new', { count: n });
	const textos = e.perAny.map(
		(a) =>
			t(locale, 'stats_year_sr', { year: a.any, ascents: asc(a.ascensions), new: nous(a.nous) }) +
			(a.any === e.millorAny ? ` (${t(locale, 'stats_year_best')})` : '')
	);
	const anys = page.getByTestId('stats-anys');
	await expect(anys.locator('li .sr-only')).toHaveText(textos.map((x) => x.trim()));
	await expect(anys.locator('li.millor .any')).toHaveText(String(e.millorAny));

	// Ratxa
	const ratxa = page.getByTestId('stats-ratxa');
	const mesos = (n: number) =>
		n === 0
			? t(locale, 'stats_streak_none')
			: n === 1
				? t(locale, 'stats_streak_months_one')
				: t(locale, 'stats_streak_months', { count: n });
	await expect(ratxa.locator('dd .gran')).toHaveText([mesos(e.ratxaActual), mesos(e.ratxaMaxima)]);
	if (e.ratxaActual > 0 && !e.mesActualFet)
		await expect(ratxa).toContainText(t(locale, 'stats_streak_keep'));

	// Amb qui has pujat més (també compten les ascensions de fora del repte: és memòria)
	await expect(page.getByTestId('stats-companys').locator('li .c-nom')).toHaveText(
		e.companys.slice(0, 5).map((c) => c.nom)
	);
}

test.describe('Estadístiques · moltes dades (oracle)', () => {
	for (const locale of ['ca', 'es'] as Locale[]) {
		test(`totes les seccions coincideixen amb l'oracle (${locale}, origen Barcelona)`, async ({
			page
		}) => {
			test.slow();
			await fixarRellotge(page);
			const files = moltesDades();
			await sembrar(page, files, '/ca/app');
			await escriureOrigen(page, BARCELONA.codi);
			await gotoHydrated(page, ROUTES[locale].stats);
			const e = esperat(files, AVUI, BARCELONA);
			// L'oracle té sentit (si no, el test no prova res)
			expect(e.foraRepte).toBe(2);
			expect(e.ratxaMaxima).toBe(7);
			expect(e.ratxaActual).toBe(5);
			expect(e.mesFet).toEqual({ cimId: CIM.montcau.id, n: 4 });

			await comprovarMoltesDades(page, locale, e);

			// El cim més llunyà des de Barcelona (km amb el format de l'idioma)
			const llunya = page.getByTestId('stats-llunya');
			await expect(llunya.locator('.d-nom')).toHaveText(cimPerId(e.llunya!.cimId).nom);
			const km = await page.evaluate(
				([v, l]) =>
					new Intl.NumberFormat(l as string, { maximumFractionDigits: 1 }).format(v as number),
				[e.llunya!.km, locale]
			);
			await expect(llunya.locator('.d-xifra')).toHaveText(
				exacte(locale, 'stats_far_value', { km, municipi: 'Barcelona' })
			);
			await expect(
				llunya.getByRole('button', { name: exacte(locale, 'stats_far_change') })
			).toBeVisible();
		});
	}

	test('el cim més llunyà depèn del municipi: Tremp vs. Figueres', async ({ page }) => {
		await fixarRellotge(page);
		const files = moltesDades();
		await sembrar(page, files, '/ca/app');
		for (const nom of ['Tremp', 'Figueres']) {
			const mun = municipi(nom);
			await escriureOrigen(page, mun.codi, { updatedAt: new Date().toISOString() });
			await gotoHydrated(page, ROUTES.ca.stats);
			const e = esperat(files, AVUI, mun);
			await expect(page.getByTestId('stats-llunya').locator('.d-nom')).toHaveText(
				cimPerId(e.llunya!.cimId).nom
			);
			await expect(page.getByTestId('stats-llunya').locator('.d-xifra')).toContainText(nom);
		}
	});

	test('s’actualitza en viu: registrar una repetició canvia el resum sense recarregar', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				{ cimId: CIM.matagalls.id, data: '2025-01-10' },
				{ cimId: CIM.montcau.id, data: '2025-02-10' }
			],
			ROUTES.ca.stats
		);
		await expect(resum(page).locator('dd')).toHaveText(['2', '2', '0']);
		await expect(page.getByTestId('stats-mes-fet')).toHaveCount(0);
		// Escriptura des d'una altra pestanya (mateix origen): Dexie la propaga amb liveQuery.
		const altra = await page.context().newPage();
		await altra.clock.setFixedTime(ARA);
		await gotoHydrated(altra, ROUTES.ca.register);
		const cb = altra.getByRole('combobox', { name: /^Cim$/ });
		await cb.fill('montcau');
		await cb.press('Enter');
		await altra.getByLabel(/^Data$/).fill('2025-09-09');
		await altra.getByRole('button', { name: /Registrar i segellar/ }).click();
		await expect(resum(page).locator('dd')).toHaveText(['2', '3', '1'], { timeout: 10_000 });
		await expect(page.getByTestId('stats-mes-fet').locator('.d-nom')).toHaveText('Montcau');
		await altra.close();
	});
});

// ---------------------------------------------------------------------------
// Municipi d'origen des de les estadístiques (full)
// ---------------------------------------------------------------------------

const fullOrigen = (page: Page, locale: Locale = 'ca') =>
	page.getByRole('dialog', { name: t(locale, 'origin_title') });
const cercador = (scope: Page | Locator, locale: Locale = 'ca') =>
	scope.getByRole('combobox', { name: t(locale, 'origin_search_label') });

test.describe('Estadístiques · municipi d’origen (full)', () => {
	for (const locale of ['ca', 'es'] as Locale[]) {
		test(`teclat (${locale}): obre el full amb el focus al cercador, tria i torna el focus`, async ({
			page
		}) => {
			await fixarRellotge(page);
			await sembrar(
				page,
				[
					{ cimId: CIM.pica.id, data: '2024-07-20' },
					{ cimId: CIM.montcau.id, data: '2025-02-10' }
				],
				ROUTES[locale].stats
			);
			const boto = page
				.getByTestId('stats-llunya')
				.getByRole('button', { name: exacte(locale, 'stats_far_choose') });
			await boto.focus();
			await page.keyboard.press('Enter');
			const full = fullOrigen(page, locale);
			await expect(full).toBeVisible();
			await expect(cercador(full, locale)).toBeFocused();
			await expect(cercador(full, locale)).toHaveAttribute('aria-expanded', 'false');

			await page.keyboard.type('barcel');
			await expect(cercador(full, locale)).toHaveAttribute('aria-expanded', 'true');
			const opcions = full.getByRole('option');
			await expect(opcions.first()).toContainText('Barcelona');
			const n = await opcions.count();
			await expect(full.locator('.selector [role="status"]')).toHaveText(
				exacte(locale, 'origin_results', { count: n })
			);
			// La primera opció és l'activa; fletxa avall i amunt hi tornen
			await expect(opcions.first()).toHaveAttribute('aria-selected', 'true');
			if (n > 1) {
				await page.keyboard.press('ArrowDown');
				await expect(opcions.nth(1)).toHaveAttribute('aria-selected', 'true');
				await expect(cercador(full, locale)).toHaveAttribute(
					'aria-activedescendant',
					(await opcions.nth(1).getAttribute('id'))!
				);
				await page.keyboard.press('ArrowUp');
			}
			await expect(opcions.first()).toHaveAttribute('aria-selected', 'true');
			await page.keyboard.press('Enter');

			await expect(full).toBeHidden();
			const llunya = page.getByTestId('stats-llunya');
			await expect(llunya.locator('.d-xifra')).toContainText('Barcelona');
			const canvia = llunya.getByRole('button', { name: exacte(locale, 'stats_far_change') });
			await expect(canvia).toBeFocused();
			expect((await llegirOrigen(page))?.valor).toBe(BARCELONA.codi);

			// Persistència
			await page.reload();
			await expect(page.getByTestId('stats-llunya').locator('.d-xifra')).toContainText('Barcelona');
		});
	}

	test('Esc buida la cerca sense tancar el full; un segon Esc el tanca', async ({ page }) => {
		await sembrar(page, [{ cimId: CIM.montcau.id, data: '2025-02-10' }], ROUTES.ca.stats);
		const boto = page.getByTestId('stats-llunya').getByRole('button');
		await boto.focus();
		await page.keyboard.press('Enter');
		const full = fullOrigen(page);
		await expect(cercador(full)).toBeFocused();
		await page.keyboard.type('xyzzy');
		await expect(full.locator('.selector [role="status"]')).toHaveText(
			exacte('ca', 'origin_no_results')
		);
		await page.keyboard.press('Escape');
		await expect(full).toBeVisible();
		await expect(cercador(full)).toHaveValue('');
		await page.keyboard.press('Escape');
		await expect(full).toBeHidden();
		await expect(boto).toBeFocused();
		expect(await llegirOrigen(page)).toBeUndefined();
	});

	test('codi desat que ja no és a la llista: avís "torna’l a triar" i es pot tornar a triar', async ({
		page
	}) => {
		await sembrar(page, [{ cimId: CIM.montcau.id, data: '2025-02-10' }], '/ca/app');
		// Format vàlid però inexistent al conjunt (p. ex. d'una versió futura dels municipis)
		await escriureOrigen(page, '999999', { pendent: 0 });
		await gotoHydrated(page, ROUTES.ca.stats);
		const llunya = page.getByTestId('stats-llunya');
		await expect(llunya).toContainText(t('ca', 'origin_rechoose'));
		await llunya.getByRole('button', { name: exacte('ca', 'stats_far_change') }).click();
		const full = fullOrigen(page);
		await expect(full.getByTestId('origen-municipi')).toContainText(t('ca', 'origin_rechoose'));
		await cercador(full).fill('figueres');
		await expect(full.getByRole('option').first()).toContainText('Figueres');
		await cercador(full).press('Enter');
		await expect(full).toBeHidden();
		await expect(llunya.locator('.d-xifra')).toContainText('Figueres');
		await expect(llunya).not.toContainText(t('ca', 'origin_rechoose'));
	});
});

// ---------------------------------------------------------------------------
// Accessibilitat, reflow i navegació
// ---------------------------------------------------------------------------

test.describe('Estadístiques · a11y i reflow', () => {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`axe sense violacions amb dades i amb el full obert (${colorScheme})`, async ({
			page
		}) => {
			test.slow();
			await page.emulateMedia({ colorScheme });
			await fixarRellotge(page);
			await sembrar(page, moltesDades(), '/ca/app');
			await escriureOrigen(page, BARCELONA.codi);
			await gotoHydrated(page, ROUTES.ca.stats);
			await expect(page.getByTestId('stats-ratxa')).toBeVisible();
			await expectAxeNet(page);
			await page.getByTestId('stats-llunya').getByRole('button').click();
			const full = fullOrigen(page);
			await cercador(full).fill('sant');
			await expect(full.getByRole('option').first()).toBeVisible();
			await expectAxeNet(page, 'dialog[open]');
		});
	}

	test('buit: axe sense violacions', async ({ page }) => {
		await gotoHydrated(page, ROUTES.es.stats);
		await expect(
			page.getByRole('heading', { name: exacte('es', 'stats_empty_title') })
		).toBeVisible();
		await expectAxeNet(page);
	});

	for (const locale of ['ca', 'es'] as Locale[]) {
		test(`320 px sense scroll horitzontal (${locale}), amb noms llargs i full obert`, async ({
			page
		}) => {
			await page.setViewportSize({ width: 320, height: 640 });
			await fixarRellotge(page);
			const files = [
				...moltesDades(),
				{
					cimId: CIM.aliga.id,
					data: '2025-10-01',
					companys: ['M' + 'a'.repeat(39), 'Inesa']
				}
			];
			await sembrar(page, files, '/ca/app');
			await escriureOrigen(page, municipi("l'Hospitalet de Llobregat").codi);
			await gotoHydrated(page, ROUTES[locale].stats);
			await expect(page.getByTestId('stats-ratxa')).toBeVisible();
			await expectSenseDesbord(page);
			await page.getByTestId('stats-llunya').getByRole('button').click();
			await cercador(fullOrigen(page, locale), locale).fill('la vall');
			await expect(fullOrigen(page, locale).getByRole('option').first()).toBeVisible();
			await expectSenseDesbord(page);
		});
	}

	test('/app enllaça a les estadístiques (ca i es)', async ({ page }) => {
		await sembrar(page, [{ cimId: CIM.montcau.id, data: '2025-02-10' }], ROUTES.ca.app);
		await page
			.locator('main')
			.getByRole('link', { name: new RegExp(`^${t('ca', 'stats_link')}`) })
			.click();
		await expect(page).toHaveURL(ROUTES.ca.stats);
		await expect(resum(page)).toBeVisible();
		await gotoHydrated(page, ROUTES.es.app);
		await page
			.locator('main')
			.getByRole('link', { name: new RegExp(`^${t('es', 'stats_link')}`) })
			.click();
		await expect(page).toHaveURL(ROUTES.es.stats);
	});

	test('la pàgina és noindex i no posa dades personals a la URL', async ({ page }) => {
		await fixarRellotge(page);
		await sembrar(page, moltesDades(), '/ca/app');
		await escriureOrigen(page, BARCELONA.codi);
		const urls: string[] = [];
		page.on('request', (r) => urls.push(r.url()));
		await gotoHydrated(page, ROUTES.ca.stats);
		await expect(page.getByTestId('stats-companys').locator('li').first()).toBeVisible();
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
		expect(urls.filter((u) => /Inesa|Barcelona|080193/.test(u))).toEqual([]);
	});
});
