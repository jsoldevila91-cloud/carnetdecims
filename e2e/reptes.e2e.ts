/**
 * Bloc R2 · Reptes, medalles, "El teu proper cim" i novetats.
 *
 * - /ca/app/reptes i /es/app/retos (llista) i el detall de cada tipus de regla (cent-cims,
 *   infantil, una-per-comarca, estacions, mesos consecutius, massís), amb dades sembrades a Dexie.
 * - Medalles: toast en registrar l'ascensió que completa un repte i secció a les estadístiques.
 * - "El teu proper cim" a /app amb `/api/meteo` simulat (bona, dolenta, sense dies, 502, sense
 *   connexió), sense i amb municipi d'origen, restriccions d'accés i canvi de cap de setmana.
 * - Full de novetats (`carnetdecims:novetat-vista`).
 * - axe i reflow (320, 375 i 1280).
 *
 * Els textos es llegeixen de `messages/*.json` (`t()` de `r1.ts`): els tests no en fixen el literal.
 * El rellotge del navegador es fixa (`page.clock.setFixedTime`): l'"avui" és divendres 2026-10-16
 * (cap de setmana 17–18 d'octubre) i no depèn del dia en què es passin els tests. Els oracles
 * (xifres esperades) es calculen aquí sobre `cims.json`, no es copia `domain/reptes.ts`.
 */
import type { Locator, Page } from '@playwright/test';
import { NOVETATS } from '../src/lib/content/novetats';
import { test, expect, gotoHydrated, mainNav, ROUTES, settleAnimations } from './fixtures';
import {
	CIM,
	NOM_BD,
	botoRegistrar,
	campData,
	sembrar,
	toast,
	type FilaSembra
} from './ascensions';
import {
	CIMS,
	COMARQUES,
	escapeRe,
	escriureOrigen,
	exacte,
	expectAxeNet,
	expectSenseDesbord,
	llegirOrigen,
	municipi,
	t,
	type Locale
} from './r1';

// ---------------------------------------------------------------------------
// Constants i oracles
// ---------------------------------------------------------------------------

/** "Avui" fix (divendres, hora de Madrid). */
const AVUI = '2026-10-16';
const ARA = new Date('2026-10-16T10:00:00+02:00');

const CLAU_NOVETAT = 'carnetdecims:novetat-vista';
const ID_NOVETAT = NOVETATS[0].id;

/** Reptes inicials: 5 + 7 massissos. */
const N_REPTES = 12;
const N_MASSISSOS = 7;

const SLUGS = {
	ca: {
		cent: '100-cims',
		infantil: 'repte-infantil',
		comarques: 'totes-les-comarques',
		estacions: 'les-4-estacions',
		mesos: '12-mesos-12-cims',
		montseny: 'massis-montseny',
		montserrat: 'massis-montserrat'
	},
	es: {
		cent: '100-cims',
		infantil: 'reto-infantil',
		comarques: 'todas-las-comarcas',
		estacions: 'las-4-estaciones',
		mesos: '12-meses-12-cimas',
		montseny: 'macizo-montseny',
		montserrat: 'macizo-montserrat'
	}
} as const;

const base = (locale: Locale) => (locale === 'ca' ? '/ca/app/reptes' : '/es/app/retos');
const detall = (locale: Locale, clau: keyof (typeof SLUGS)['ca']) =>
	`${base(locale)}/${SLUGS[locale][clau]}`;

const MONTSENY = ['matagalls', 'les-agudes', 'tagamanent', 'turo-de-montsoriu'];

const cimDe = (slug: string) => {
	const c = CIMS.find((x) => x.slug === slug);
	if (!c) throw new Error(`Cim desconegut: ${slug}`);
	return c;
};

/** Format de data llarga idèntic al de l'app (`Intl`, UTC): "16 d’octubre del 2026". */
const dataLlarga = (iso: string, locale: Locale) =>
	new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(`${iso}T00:00:00Z`));

const mesLlarg = (mes: string, locale: Locale) =>
	new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
		new Date(`${mes}-01T00:00:00Z`)
	);

const sumaDies = (iso: string, n: number) =>
	new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * 86_400_000).toISOString().slice(0, 10);

/** Un cim per slug amb una data. */
const fila = (slug: string, data: string, extra: Partial<FilaSembra> = {}): FilaSembra => ({
	cimId: cimDe(slug).id,
	data,
	...extra
});

async function fixarRellotge(page: Page, quan: Date = ARA) {
	await page.clock.setFixedTime(quan);
}

/** Converteix en làpida (`deletedAt`) una fila ja sembrada (la recarrega perquè Dexie la vegi). */
async function ferLapida(page: Page, id: string) {
	await page.evaluate(
		({ nom, id }) =>
			new Promise<void>((resolve, reject) => {
				const req = indexedDB.open(nom);
				req.onerror = () => reject(req.error);
				req.onsuccess = () => {
					const bd = req.result;
					const tx = bd.transaction('ascensions', 'readwrite');
					const s = tx.objectStore('ascensions');
					const g = s.get(id);
					g.onsuccess = () => s.put({ ...g.result, deletedAt: '2026-10-01T10:00:00.000Z' });
					tx.oncomplete = () => {
						bd.close();
						resolve();
					};
					tx.onerror = () => reject(tx.error);
				};
			}),
		{ nom: NOM_BD, id }
	);
}

/** Targeta d'un repte a la llista pel nom (clau de missatge). */
const targeta = (page: Page, locale: Locale, clauNom: string) =>
	page
		.getByTestId('targeta-repte')
		.filter({ has: page.getByRole('link', { name: exacte(locale, clauNom) }) });

/** `role=meter` del detall (la targeta sense enllaç). */
const meter = (page: Page) => page.locator('main').getByRole('meter').first();

async function valorsMeter(l: Locator) {
	return {
		min: Number(await l.getAttribute('aria-valuemin')),
		max: Number(await l.getAttribute('aria-valuemax')),
		now: Number(await l.getAttribute('aria-valuenow')),
		text: (await l.getAttribute('aria-valuetext')) ?? ''
	};
}

const sensePuntsNbsp = (s: string) => s.replace(/[\s\u00a0\u202f]+/g, ' ').trim();

/** Registra una ascensió a la pàgina completa `/app/registrar?cim=…`. */
async function registrarPerUrl(page: Page, slug: string, data: string, locale: Locale = 'ca') {
	await gotoHydrated(page, `/${locale}/app/registrar?cim=${slug}`);
	const main = page.locator('main');
	await expect(
		main.getByRole('button', { name: new RegExp(escapeRe(cimDe(slug).nom)) })
	).toBeVisible();
	await campData(main).fill(data);
	await botoRegistrar(main).click();
	await expect(page).toHaveURL(`/${locale}/app`);
}

// ---------------------------------------------------------------------------
// Llista de reptes
// ---------------------------------------------------------------------------

test.describe('Reptes · llista', () => {
	for (const locale of ['ca', 'es'] as Locale[]) {
		test(`buit (${locale}): 12 targetes amb 0, destacat primer, enllaços als detalls i res completat`, async ({
			page
		}) => {
			await fixarRellotge(page);
			await gotoHydrated(page, base(locale));
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(
				exacte(locale, 'reptes_title')
			);
			await expect(page.locator('html')).toHaveAttribute('lang', locale);
			await expect(page.getByTestId('reptes-resum')).toHaveText(
				exacte(locale, 'reptes_summary', { done: 0, total: N_REPTES })
			);

			const targetes = page.getByTestId('targeta-repte');
			await expect(targetes).toHaveCount(N_REPTES);
			const meters = page.locator('main').getByRole('meter');
			await expect(meters).toHaveCount(N_REPTES);
			for (const m of await meters.all()) {
				expect(await m.getAttribute('aria-valuenow')).toBe('0');
				expect(Number(await m.getAttribute('aria-valuemax'))).toBeGreaterThan(0);
			}

			// Ordre: destacat, altres (4), massissos (7).
			const seccions = page.locator('main h2');
			await expect(seccions).toHaveText([
				exacte(locale, 'reptes_featured_title'),
				exacte(locale, 'reptes_others_title'),
				exacte(locale, 'reptes_massifs_title')
			]);
			await expect(page.locator('section').nth(0).getByTestId('targeta-repte')).toHaveCount(1);
			await expect(page.locator('section').nth(1).getByTestId('targeta-repte')).toHaveCount(4);
			await expect(page.locator('section').nth(2).getByTestId('targeta-repte')).toHaveCount(
				N_MASSISSOS
			);

			// Cada targeta enllaça al seu detall, amb el slug de l'idioma.
			const hrefs = await page
				.locator('main [data-testid="targeta-repte"] h3 a')
				.evaluateAll((as) =>
					as.map((a) => {
						const u = new URL(a.getAttribute('href') ?? '', document.baseURI);
						return u.pathname;
					})
				);
			expect(hrefs).toHaveLength(N_REPTES);
			expect(new Set(hrefs).size, 'cap URL repetida').toBe(N_REPTES);
			for (const h of hrefs)
				expect(h).toMatch(new RegExp(`^${escapeRe(base(locale))}/[a-z0-9-]+$`));
			expect(hrefs).toContain(detall(locale, 'cent'));
			expect(hrefs).toContain(detall(locale, 'infantil'));
			expect(hrefs).toContain(detall(locale, 'montseny'));

			// Textos de les notes (cap de les claus s'ha quedat sense traduir).
			await expect(page.locator('main')).not.toContainText(/reptes?_[a-z_]+_(nom|descripcio)/);
			await expect(page.locator('main')).toContainText(t(locale, 'reptes_own_note'));
		});
	}

	test('amb dades: progrés a les targetes, completat amb data, resum i enllaç des de /app', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				// Montseny sencer (3 + la darrera el 2026-09-12)
				fila('matagalls', '2025-03-01'),
				fila('les-agudes', '2025-04-01'),
				fila('tagamanent', '2025-05-01'),
				fila('turo-de-montsoriu', '2026-09-12'),
				// Montserrat 2/3
				fila('sant-jeroni', '2024-01-10'),
				fila('montgros', '2024-02-10')
			],
			base('ca')
		);
		await expect(page.getByTestId('reptes-resum')).toHaveText(
			exacte('ca', 'reptes_summary', { done: 1, total: N_REPTES })
		);
		const montseny = targeta(page, 'ca', 'repte_massis_montseny_nom');
		await expect(montseny).toContainText(
			t('ca', 'reptes_completed_on', { date: dataLlarga('2026-09-12', 'ca') })
		);
		expect(await valorsMeter(montseny.getByRole('meter'))).toMatchObject({ now: 4, max: 4 });
		const montserrat = targeta(page, 'ca', 'repte_massis_montserrat_nom');
		await expect(montserrat).not.toContainText(t('ca', 'reptes_completed_on', { date: '' }).trim());
		const v = await valorsMeter(montserrat.getByRole('meter'));
		expect(v).toMatchObject({ now: 2, max: 3 });
		expect(sensePuntsNbsp(v.text)).toMatch(/^2\/3 \(67 ?%\)$/);

		// Des de /app, l'enllaç "Reptes" porta aquí (a mòbil la barra inferior no el té).
		await gotoHydrated(page, ROUTES.ca.app);
		await page.getByTestId('enllac-reptes').click();
		await expect(page).toHaveURL(base('ca'));
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(exacte('ca', 'reptes_title'));
	});

	test('navegació: la barra lateral (≥ 768 px) té "Reptes"; la barra inferior (mòbil) no', async ({
		page
	}) => {
		for (const [w, visible] of [
			[375, false],
			[1280, true]
		] as const) {
			await page.setViewportSize({ width: w, height: 800 });
			await gotoHydrated(page, ROUTES.ca.app);
			const enllac = mainNav(page).getByRole('link', { name: exacte('ca', 'nav_reptes') });
			await expect(enllac).toHaveCount(visible ? 1 : 0);
			if (visible) {
				await enllac.click();
				await expect(page).toHaveURL(base('ca'));
				await expect(
					mainNav(page).getByRole('link', { name: exacte('ca', 'nav_reptes') })
				).toHaveAttribute('aria-current', 'page');
				// I també al detall (pestanya activa per prefix).
				await gotoHydrated(page, detall('ca', 'montseny'));
				await expect(
					mainNav(page).getByRole('link', { name: exacte('ca', 'nav_reptes') })
				).toHaveAttribute('aria-current', 'page');
			}
		}
	});

	test('el detall d’un repte inexistent mostra l’estat "no existeix" i torna a la llista', async ({
		page
	}) => {
		await gotoHydrated(page, `${base('ca')}/no-existeix`);
		await expect(page.getByText(exacte('ca', 'reptes_not_found'))).toBeVisible();
		await page.getByRole('link', { name: exacte('ca', 'reptes_back') }).click();
		await expect(page).toHaveURL(base('ca'));
	});
});

// ---------------------------------------------------------------------------
// Detall per tipus de regla
// ---------------------------------------------------------------------------

test.describe('Reptes · detall per tipus de regla', () => {
	test('massís (totes): Montseny 3/4 amb els pendents; compten les anteriors al 2006, no les futures, esborrades ni amb mètode motoritzat', async ({
		page
	}) => {
		await fixarRellotge(page);
		// Cim 1: del 2006-06-29 (anterior a l'inici del 100 Cims; un repte propi la compta).
		// Cim 2: avui mateix (compta; "no futura" = ≤ avui).
		// Cim 3: 2026-10-17, demà (no compta). Cim 4: esborrada. (Cim 5 de prova: mètode motoritzat.)
		const idLapida = '0190a1b2-c3d4-4e5f-8a6b-00000000a001';
		await sembrar(
			page,
			[
				fila('matagalls', '2006-06-29'),
				fila('les-agudes', AVUI),
				fila('tagamanent', '2026-10-17'),
				fila('turo-de-montsoriu', '2025-05-05', { id: idLapida }),
				fila('turo-de-montsoriu', '2025-06-05', { metode: 'cotxe' as 'a-peu' })
			],
			ROUTES.ca.app
		);
		await ferLapida(page, idLapida);
		await gotoHydrated(page, detall('ca', 'montseny'));

		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			exacte('ca', 'repte_massis_montseny_nom')
		);
		const v = await valorsMeter(meter(page));
		expect(v).toMatchObject({ min: 0, max: 4, now: 2 });
		const pend = page.getByTestId('repte-pendents');
		await expect(pend).toContainText(t('ca', 'reptes_pending_peaks', { count: 2 }));
		const noms = await pend.locator('ul.cims li a').allTextContents();
		expect(noms.sort()).toEqual([cimDe('tagamanent').nom, cimDe('turo-de-montsoriu').nom].sort());
		// Enllaç a la fitxa del cim pendent.
		await expect(pend.getByRole('link', { name: cimDe('tagamanent').nom })).toHaveAttribute(
			'href',
			new RegExp(`/ca/cims/tagamanent$`)
		);
		await expect(page.getByTestId('repte-medalla')).toHaveCount(0);
		// Repte propi: la nota que explica que no és validació oficial, i cap bloc FEEC.
		await expect(page.locator('main')).toContainText(t('ca', 'reptes_own_note'));
		await expect(page.locator('main')).not.toContainText(t('ca', 'reptes_feec_note'));
	});

	test('massís completat: medalla amb la data de la darrera ascensió, sense llista de pendents', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('sant-jeroni', '2024-01-10'),
				fila('montgros', '2025-02-10'),
				fila('elefant-roca-de-sant-salvador', '2026-03-10'),
				// Repetició posterior: no mou la data de la medalla
				fila('sant-jeroni', '2026-09-30')
			],
			detall('ca', 'montserrat')
		);
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 3, max: 3 });
		const medalla = page.getByTestId('repte-medalla');
		await expect(medalla).toBeVisible();
		await expect(medalla.getByRole('heading')).toHaveText(exacte('ca', 'reptes_medal_title'));
		await expect(
			medalla.getByRole('img', {
				name: t('ca', 'medal_sr', {
					name: t('ca', 'repte_massis_montserrat_nom'),
					date: dataLlarga('2026-03-10', 'ca')
				})
			})
		).toBeVisible();
		await expect(page.getByTestId('repte-pendents')).toHaveCount(0);
		await expect(page.locator('main')).toContainText(
			t('ca', 'reptes_completed_on', { date: dataLlarga('2026-03-10', 'ca') })
		);
	});

	test('una-per-comarca: n comarques fetes de N, pendents com a enllaços a /comarques/{slug}', async ({
		page
	}) => {
		await fixarRellotge(page);
		const triats = ['matagalls', 'montcau', 'montgros', 'tagamanent']; // osona, bages, anoia, vallès
		const fetes = new Set(triats.map((s) => cimDe(s).comarca));
		const total = new Set(CIMS.map((c) => c.comarca)).size;
		await sembrar(
			page,
			triats.map((s, i) => fila(s, `2025-0${i + 1}-15`)),
			detall('ca', 'comarques')
		);
		expect(await valorsMeter(meter(page))).toMatchObject({ now: fetes.size, max: total });
		const pend = page.getByTestId('repte-pendents');
		await expect(pend).toContainText(
			t('ca', 'reptes_pending_comarques', { count: total - fetes.size })
		);
		const enllacos = pend.locator('ul.chips a');
		await expect(enllacos).toHaveCount(total - fetes.size);
		const pathnames = await enllacos.evaluateAll((as) =>
			as.map((a) => new URL(a.getAttribute('href') ?? '', document.baseURI).pathname)
		);
		const pendents = [...new Set(CIMS.map((c) => c.comarca))].filter((c) => !fetes.has(c));
		expect(pathnames.sort()).toEqual(pendents.map((c) => `/ca/comarques/${c}`).sort());
		// El nom visible és el de la comarca del catàleg.
		const nom = COMARQUES.find((c) => c.slug === pendents[0])!.nom;
		await expect(enllacos.filter({ hasText: new RegExp(`^${escapeRe(nom)}$`) })).toHaveCount(1);
	});

	test('estacions: 3 de 4 en un any (l’hivern del gener següent no compta per a aquell any) i falta "Hivern"', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2025-04-10'),
				fila('montcau', '2025-07-10'),
				fila('canigo', '2025-10-10'),
				// L'hivern del gener del 2026 és de l'any 2026: no completa el 2025
				fila('pica-d-estats', '2026-01-15')
			],
			detall('ca', 'estacions')
		);
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 3, max: 4 });
		const pend = page.getByTestId('repte-pendents');
		await expect(pend).toContainText(t('ca', 'reptes_pending_seasons', { year: 2025 }));
		await expect(pend.locator('ul.chips li')).toHaveText([exacte('ca', 'season_winter')]);
		await expect(pend).toContainText(t('ca', 'reptes_seasons_hint'));
		await expect(page.getByTestId('repte-medalla')).toHaveCount(0);
	});

	test('estacions: els límits de mes (28/2 hivern, 1/3 primavera, 31/8 estiu, 1/9 tardor) completen l’any i la medalla porta la darrera data', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2025-02-28'), // hivern
				fila('montcau', '2025-03-01'), // primavera
				fila('canigo', '2025-08-31'), // estiu (no tardor)
				fila('pica-d-estats', '2025-09-01') // tardor
			],
			detall('es', 'estacions')
		);
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 4, max: 4 });
		await expect(page.getByTestId('repte-medalla')).toBeVisible();
		await expect(page.locator('main')).toContainText(
			t('es', 'reptes_completed_on', { date: dataLlarga('2025-09-01', 'es') })
		);
		await expect(page.getByTestId('repte-pendents')).toHaveCount(0);
	});

	test('estacions: sense cap ascensió → "Encara no tens cap estació feta" amb les quatre', async ({
		page
	}) => {
		await gotoHydrated(page, detall('ca', 'estacions'));
		const pend = page.getByTestId('repte-pendents');
		await expect(pend).toContainText(t('ca', 'reptes_pending_seasons_none'));
		await expect(pend.locator('ul.chips li')).toHaveCount(4);
	});

	test('12 mesos: la ratxa creua el canvi d’any (30/11 → 31/12 → 1/1) i no és actual', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2025-11-30'),
				fila('montcau', '2025-12-31'),
				fila('canigo', '2026-01-01')
			],
			detall('ca', 'mesos')
		);
		const pend = page.getByTestId('repte-pendents');
		const dds = pend.locator('dl.fites dd');
		await expect(dds.nth(0)).toHaveText(exacte('ca', 'stats_streak_none'));
		await expect(dds.nth(1)).toContainText(t('ca', 'stats_streak_months', { count: 3 }));
		await expect(pend).toContainText(t('ca', 'reptes_months_todo_this_month'));
		// Cap ratxa actual → progrés 0/12
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 0, max: 12 });
	});

	test('12 mesos: una repetició no allarga la ratxa; la ratxa viva acaba aquest mes', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2026-06-10'),
				fila('montcau', '2026-07-10'),
				// Repetició del Matagalls a l'agost: no és un cim nou, no omple l'agost
				fila('matagalls', '2026-08-10'),
				fila('canigo', '2026-09-10'),
				fila('pica-d-estats', '2026-10-05')
			],
			detall('ca', 'mesos')
		);
		const pend = page.getByTestId('repte-pendents');
		const dds = pend.locator('dl.fites dd');
		await expect(dds.nth(0)).toContainText(t('ca', 'stats_streak_months', { count: 2 }));
		await expect(dds.nth(1)).toContainText(t('ca', 'stats_streak_months', { count: 2 }));
		await expect(dds.nth(0)).toContainText(
			t('ca', 'stats_streak_range', {
				from: mesLlarg('2026-09', 'ca'),
				to: mesLlarg('2026-10', 'ca')
			})
		);
		await expect(pend).toContainText(t('ca', 'reptes_months_done_this_month'));
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 2, max: 12 });
	});

	test('12 mesos: 12 mesos seguits completen el repte (medalla amb la data de la 12a)', async ({
		page
	}) => {
		await fixarRellotge(page);
		const slugs = CIMS.slice(0, 12).map((c) => c.slug);
		const mesos = [
			'2025-10',
			'2025-11',
			'2025-12',
			'2026-01',
			'2026-02',
			'2026-03',
			'2026-04',
			'2026-05',
			'2026-06',
			'2026-07',
			'2026-08',
			'2026-09'
		];
		await sembrar(
			page,
			slugs.map((s, i) => fila(s, `${mesos[i]}-15`)),
			detall('ca', 'mesos')
		);
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 12, max: 12 });
		await expect(page.getByTestId('repte-medalla')).toBeVisible();
		await expect(page.locator('main')).toContainText(
			t('ca', 'reptes_completed_on', { date: dataLlarga('2026-09-15', 'ca') })
		);
	});

	test('infantil: compta des del 2026-07-01 (inclòs), no el 06-30 ni les futures; enllaç a la normativa infantil', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2026-06-30'),
				fila('montcau', '2026-07-01'),
				fila('canigo', AVUI),
				fila('pica-d-estats', '2026-10-17')
			],
			detall('ca', 'infantil')
		);
		const v = await valorsMeter(meter(page));
		expect(v).toMatchObject({ now: 2, max: 50 });
		const pend = page.getByTestId('repte-pendents');
		await expect(pend).toContainText(t('ca', 'reptes_pending_peaks', { count: CIMS.length - 2 }));
		await expect(page.locator('main')).toContainText(t('ca', 'reptes_feec_note'));
		await expect(
			page.getByRole('link', { name: t('ca', 'home_repte_link_infantil') + ' →' })
		).toHaveAttribute('href', /\/repte-infantil$/);
	});

	test('100 Cims: 99 → 100 (medalla, data del 100è) i el progrés del nivell següent (105/200)', async ({
		page
	}) => {
		await fixarRellotge(page);
		// 105 cims diferents (un per setmana, ≤ 53 a l'any): el 100è és el de la setmana 99.
		const ordenats = [...CIMS].sort((a, b) => a.id - b.id).slice(0, 105);
		const dataI = (i: number) => sumaDies('2019-01-05', i * 7);
		const files: FilaSembra[] = ordenats.map((c, i) => ({ cimId: c.id, data: dataI(i) }));
		await sembrar(page, files.slice(0, 99), detall('ca', 'cent'));
		// 99: encara sense medalla; falten 51 essencials per al 100
		expect(await valorsMeter(meter(page))).toMatchObject({ now: 99, max: 100 });
		await expect(page.getByTestId('repte-medalla')).toHaveCount(0);
		await expect(page.getByTestId('repte-pendents')).toContainText(
			t('ca', 'reptes_pending_essentials', { count: CIMS.filter((c) => c.essencial).length - 99 })
		);

		// 105: completat el dia del 100è, amb el progrés cap al 2×100 i 45 cims per pujar
		await sembrar(page, files.slice(99), detall('ca', 'cent'));
		const v = await valorsMeter(meter(page));
		expect(v).toMatchObject({ min: 0, max: 200, now: 105 });
		expect(sensePuntsNbsp(v.text)).toMatch(/^105\/200 \(53 ?%\)$/);
		await expect(page.locator('main')).toContainText(
			t('ca', 'reptes_completed_on', { date: dataLlarga(dataI(99), 'ca') })
		);
		await expect(page.locator('main')).toContainText(
			t('ca', 'reptes_level_reached', { level: '100' })
		);
		const medalla = page.getByTestId('repte-medalla');
		await expect(medalla.getByRole('heading')).toHaveText(exacte('ca', 'reptes_medal_title'));
		await expect(
			medalla.getByRole('img', {
				name: t('ca', 'medal_sr', {
					name: t('ca', 'medal_level_name', { name: t('ca', 'repte_cent_cims_nom'), level: '100' }),
					date: dataLlarga(dataI(99), 'ca')
				})
			})
		).toBeVisible();
		const pend = page.getByTestId('repte-pendents');
		await expect(pend).toContainText(t('ca', 'reptes_pending_peaks', { count: CIMS.length - 105 }));
		// Llista plegada: 24 visibles + "Mostra'n N més"
		await expect(pend.locator('ul.cims').first().locator('li')).toHaveCount(24);
		const mes = pend.locator('details.mes');
		await expect(mes.locator('summary')).toHaveText(
			exacte('ca', 'reptes_pending_more', { count: CIMS.length - 105 - 24 })
		);
		await mes.locator('summary').click();
		await expect(pend.locator('ul.cims li')).toHaveCount(CIMS.length - 105);
		// Bloc FEEC
		await expect(page.locator('main')).toContainText(t('ca', 'reptes_feec_note'));
		await expect(
			page.getByRole('link', { name: t('ca', 'reptes_open_carnet') + ' →' })
		).toBeVisible();

		// La llista de reptes el mostra com a completat i amb el mateix progrés
		await gotoHydrated(page, base('ca'));
		const card = targeta(page, 'ca', 'repte_cent_cims_nom');
		await expect(card).toContainText(
			t('ca', 'reptes_completed_on', { date: dataLlarga(dataI(99), 'ca') })
		);
		expect(await valorsMeter(card.getByRole('meter'))).toMatchObject({ now: 105, max: 200 });
		// El resum compta exactament les targetes completades (els 105 primers cims del catàleg
		// completen també algun massís: no se sap quants sense duplicar les llistes).
		const completades = await page
			.getByTestId('targeta-repte')
			.filter({ hasText: t('ca', 'reptes_completed_on', { date: '' }).trim() })
			.count();
		expect(completades).toBeGreaterThanOrEqual(1);
		await expect(page.getByTestId('reptes-resum')).toHaveText(
			exacte('ca', 'reptes_summary', { done: completades, total: N_REPTES })
		);
	});

	test('canvi d’idioma al detall: els slugs ca/es són diferents i el contingut canvia d’idioma', async ({
		page
	}) => {
		await gotoHydrated(page, detall('ca', 'infantil'));
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			exacte('ca', 'repte_infantil_nom')
		);
		await page.getByRole('banner').getByRole('link', { name: 'Español' }).click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		// Ruta localitzada; el repte és el mateix tot i que el slug sigui el del català.
		await expect(page).toHaveURL(new RegExp(`^.*/es/app/retos/`));
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			exacte('es', 'repte_infantil_nom')
		);
		await expect(page.locator('main')).toContainText(t('es', 'repte_infantil_descripcio'));

		// Directe amb el slug castellà
		await gotoHydrated(page, detall('es', 'infantil'));
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			exacte('es', 'repte_infantil_nom')
		);
		await page.getByRole('banner').getByRole('link', { name: 'Català' }).click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
		await expect(page).toHaveURL(new RegExp(`^.*/ca/app/reptes/`));
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			exacte('ca', 'repte_infantil_nom')
		);
	});

	test('ca i es: cada repte té nom i descripció traduïts i un slug propi per idioma', async ({
		page
	}) => {
		test.slow();
		for (const locale of ['ca', 'es'] as Locale[]) {
			await gotoHydrated(page, base(locale));
			const hrefs = await page
				.locator('main [data-testid="targeta-repte"] h3 a')
				.evaluateAll((as) =>
					as.map((a) => new URL(a.getAttribute('href') ?? '', document.baseURI).pathname)
				);
			for (const h of hrefs) {
				await gotoHydrated(page, h);
				const h1 = (await page.getByRole('heading', { level: 1 }).innerText()).trim();
				expect(h1, `${h}: H1 amb clau sense traduir`).not.toMatch(/^repte_/);
				expect(h1.length).toBeGreaterThan(2);
				await expect(page.getByTestId('targeta-repte')).toHaveCount(1);
			}
		}
	});
});

// ---------------------------------------------------------------------------
// Rellotge i zones horàries
// ---------------------------------------------------------------------------

test.describe('Reptes · avui segons l’hora de Madrid', () => {
	test('una ascensió amb data de demà compta només quan a Madrid ja és demà (23:30 → 00:30)', async ({
		page
	}) => {
		// 21:30 UTC = 23:30 a Madrid del 16 (CEST): el 17 encara és futur.
		await fixarRellotge(page, new Date('2026-10-16T21:30:00Z'));
		await sembrar(page, [fila('matagalls', '2026-10-17')], detall('ca', 'montseny'));
		expect((await valorsMeter(meter(page))).now).toBe(0);
		// 22:30 UTC = 00:30 del 17 a Madrid: ja compta.
		await fixarRellotge(page, new Date('2026-10-16T22:30:00Z'));
		await page.reload();
		await expect.poll(async () => (await valorsMeter(meter(page))).now).toBe(1);
	});
});

// ---------------------------------------------------------------------------
// Medalles: toast en registrar i secció a les estadístiques
// ---------------------------------------------------------------------------

test.describe('Medalles', () => {
	test('registrar l’ascensió que completa un massís: toast de medalla a la regió viva, amb el toast del segell', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2025-03-01'),
				fila('les-agudes', '2025-04-01'),
				fila('tagamanent', '2025-05-01')
			],
			ROUTES.ca.app
		);
		await registrarPerUrl(page, 'turo-de-montsoriu', AVUI);

		const medalla = toast(
			page,
			t('ca', 'medal_toast', { name: t('ca', 'repte_massis_montseny_nom') })
		);
		await expect(medalla).toBeVisible();
		await expect(medalla.locator('.medal-ic')).toBeVisible();
		// Dins d'una regió viva (role=status) perquè el lector de pantalla l'anunciï
		await expect(
			page
				.getByRole('status')
				.locator('li')
				.filter({ hasText: t('ca', 'medal_toast', { name: t('ca', 'repte_massis_montseny_nom') }) })
		).toHaveCount(1);
		// I el toast del segell, a part
		await expect(toast(page, 'Segellat: ' + cimDe('turo-de-montsoriu').nom)).toBeVisible();
		await expect(
			page.getByRole('region', { name: t('ca', 'toast_region_label') }).locator('li')
		).toHaveCount(2);
		// Es pot tancar amb el teclat (botó "tanca" del toast)
		await medalla.getByRole('button', { name: exacte('ca', 'toast_dismiss') }).click();
		await expect(medalla).toHaveCount(0);

		// La medalla es deriva: surt a la llista de reptes
		await gotoHydrated(page, base('ca'));
		await expect(page.getByTestId('reptes-resum')).toHaveText(
			exacte('ca', 'reptes_summary', { done: 1, total: N_REPTES })
		);
	});

	test('registrar una ascensió que no completa res no mostra cap toast de medalla (ni repetir un cim ja fet)', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			MONTSENY.map((s, i) => fila(s, `2025-0${i + 1}-01`)),
			ROUTES.ca.app
		);
		// Montseny ja és complet: repetir un dels seus cims no torna a donar la medalla.
		await registrarPerUrl(page, 'matagalls', AVUI);
		// Repetició: "Desat: … No suma per al repte."
		await expect(toast(page, cimDe('matagalls').nom)).toBeVisible();
		await expect(toast(page, /Medalla nova|Medalla nueva/)).toHaveCount(0);
		await registrarPerUrl(page, 'canigo', AVUI);
		await expect(toast(page, 'Segellat: ' + cimDe('canigo').nom)).toBeVisible();
		await expect(toast(page, /Medalla nova|Medalla nueva/)).toHaveCount(0);
	});

	test('medalla en castellano; les ascensions anteriors al 2006 també compten per a un repte propi', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[fila('sant-jeroni', '2005-05-01'), fila('montgros', '2005-06-01')],
			ROUTES.es.app
		);
		await registrarPerUrl(page, 'elefant-roca-de-sant-salvador', '2026-10-01', 'es');
		await expect(
			toast(page, t('es', 'medal_toast', { name: t('es', 'repte_massis_montserrat_nom') }))
		).toBeVisible();
	});

	test('100 Cims: l’ascensió número 100 dona la medalla "Repte 100 Cims · 100" i el comptador 100/100', async ({
		page
	}) => {
		await fixarRellotge(page);
		const ordenats = [...CIMS].sort((a, b) => a.id - b.id).filter((c) => c.id !== CIM.canigo.id);
		await sembrar(
			page,
			ordenats.slice(0, 99).map((c, i): FilaSembra => ({
				cimId: c.id,
				data: `${2023 + (i % 3)}-0${1 + (i % 9)}-1${i % 9}`
			})),
			ROUTES.ca.app
		);
		await registrarPerUrl(page, CIM.canigo.slug, AVUI);
		const nom = t('ca', 'medal_level_name', { name: t('ca', 'repte_cent_cims_nom'), level: '100' });
		await expect(toast(page, t('ca', 'medal_toast', { name: nom }))).toBeVisible();
		const segell = toast(page, 'Segellat: ' + CIM.canigo.nom);
		await expect(segell).toBeVisible();
		// Al moment del 100 el marcador del carnet ja apunta al nivell següent (2×100): "+1 → 100/200".
		await expect(segell.locator('.delta')).toHaveText('+1');
		await expect(segell).toContainText('100/200');

		// A les estadístiques, la medalla amb el nom del nivell i la data
		await gotoHydrated(page, ROUTES.ca.stats);
		const sec = page.getByTestId('stats-medalles');
		// (Els 100 primers cims del catàleg completen també algun massís: hi ha més medalles.)
		const m100 = sec.locator('ul.medalles li').filter({ hasText: nom });
		await expect(m100).toHaveCount(1);
		await expect(m100.locator('time')).toHaveAttribute('datetime', AVUI);
		await expect(m100.locator('time')).toHaveText(dataLlarga(AVUI, 'ca'));
	});

	test('estadístiques: sense medalles (estat buit amb enllaç a reptes) i amb medalles ordenades de la més recent a la més antiga', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(page, [fila('matagalls', '2025-03-01')], ROUTES.ca.stats);
		const sec = page.getByTestId('stats-medalles');
		await expect(sec.getByRole('heading')).toHaveText(exacte('ca', 'medals_title'));
		await expect(sec).toContainText(t('ca', 'medals_empty'));
		await expect(sec.locator('ul.medalles')).toHaveCount(0);
		await sec.getByRole('link', { name: t('ca', 'app_reptes_link') + ' →' }).click();
		await expect(page).toHaveURL(base('ca'));

		// Dues medalles: Montserrat el 2024-05-01 i Montseny el 2026-02-01 (més recent primer)
		await sembrar(
			page,
			[
				fila('sant-jeroni', '2024-03-01'),
				fila('montgros', '2024-04-01'),
				fila('elefant-roca-de-sant-salvador', '2024-05-01'),
				fila('les-agudes', '2025-11-01'),
				fila('tagamanent', '2025-12-01'),
				fila('turo-de-montsoriu', '2026-02-01')
			],
			ROUTES.ca.stats
		);
		const items = page.getByTestId('stats-medalles').locator('ul.medalles li');
		await expect(items).toHaveCount(2);
		await expect(items.nth(0)).toContainText(t('ca', 'repte_massis_montseny_nom'));
		await expect(items.nth(0).locator('time')).toHaveAttribute('datetime', '2026-02-01');
		await expect(items.nth(1)).toContainText(t('ca', 'repte_massis_montserrat_nom'));
		await expect(items.nth(1).locator('time')).toHaveAttribute('datetime', '2024-05-01');
	});

	test('estadístiques en castellà: la secció Medallas i les dates en castellano', async ({
		page
	}) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			MONTSENY.map((s, i) => fila(s, `2025-0${i + 1}-01`)),
			ROUTES.es.stats
		);
		const sec = page.getByTestId('stats-medalles');
		await expect(sec.getByRole('heading')).toHaveText(exacte('es', 'medals_title'));
		await expect(sec.locator('ul.medalles li')).toContainText(t('es', 'repte_massis_montseny_nom'));
		await expect(sec.locator('time')).toHaveText(dataLlarga('2025-04-01', 'es'));
	});
});

// ---------------------------------------------------------------------------
// El teu proper cim
// ---------------------------------------------------------------------------

/** Previsió simulada (4 dies des del 2026-10-16) amb el mateix temps per a tots els cims. */
function previsio(
	dies: { data: string; precipitacio?: number; ratxaMax?: number; codi?: number }[]
) {
	return {
		actualitzat: '2026-10-16T08:00:00.000Z',
		altitud: 2000,
		font: {
			nom: 'Open-Meteo',
			url: 'https://open-meteo.com/',
			llicencia: 'CC BY 4.0',
			llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
		},
		dies: dies.map((d) => ({
			data: d.data,
			tMax: 12,
			tMin: 3,
			ventMax: 15,
			ratxaMax: d.ratxaMax ?? 30,
			precipitacio: d.precipitacio ?? 0,
			probPrecipitacio: 10,
			codi: d.codi ?? 1,
			iso0: 3000
		}))
	};
}

const DIES_FINDE = ['2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19'];

async function mockMeteo(
	page: Page,
	cos: unknown | ((slug: string) => unknown),
	estat = 200
): Promise<string[]> {
	const slugs: string[] = [];
	await page.route(/\/api\/meteo\//, (route) => {
		const slug = new URL(route.request().url()).pathname.split('/').pop()!;
		slugs.push(slug);
		return route.fulfill({
			status: estat,
			contentType: 'application/json; charset=utf-8',
			body: JSON.stringify(typeof cos === 'function' ? (cos as (s: string) => unknown)(slug) : cos)
		});
	});
	return slugs;
}

const proper = (page: Page) => page.getByTestId('proper-cim');
const cimsProper = (page: Page) => proper(page).locator('ol.llista > li.cim');
const nomsProper = async (page: Page) =>
	(await cimsProper(page).locator('.nom a').allTextContents()).map((s) => s.trim());
const peu = (page: Page) => proper(page).locator('p.peu');

test.describe('El teu proper cim', () => {
	test('sense origen: avís amb el botó de triar municipi, 3 cims amb motius i la font de la meteo', async ({
		page
	}) => {
		await fixarRellotge(page);
		const slugs = await mockMeteo(page, previsio(DIES_FINDE.map((data) => ({ data }))));
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(proper(page).getByRole('heading', { level: 2 })).toHaveText(
			exacte('ca', 'proper_cim_title')
		);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(proper(page).locator('.finde')).toHaveText(
			t('ca', 'proper_cim_weekend', {
				from: dataLlarga('2026-10-17', 'ca'),
				to: dataLlarga('2026-10-18', 'ca')
			})
		);
		const avis = proper(page).getByRole('note');
		await expect(avis).toContainText(t('ca', 'proper_cim_no_origin'));
		await expect(
			avis.getByRole('button', { name: exacte('ca', 'stats_far_choose') })
		).toBeVisible();
		// Cada cim: enllaç a la fitxa, altitud i com a mínim un motiu
		for (const li of await cimsProper(page).all()) {
			await expect(li.locator('.nom a')).toHaveAttribute('href', /\/ca\/cims\/[a-z0-9-]+$/);
			await expect(li.locator('.alt')).toContainText(/\d[\d.]* m/);
			expect(await li.locator('ul.motius li').count()).toBeGreaterThan(0);
		}
		// Meteo: bona previsió; font amb enllaç i llicència; no cal avís de "sense previsió"
		await expect(peu(page)).toContainText(t('ca', 'proper_cim_meteo_source'));
		await expect(peu(page).getByRole('link', { name: 'Open-Meteo' })).toHaveAttribute(
			'href',
			'https://open-meteo.com/'
		);
		await expect(peu(page).getByRole('link', { name: 'CC BY 4.0' })).toHaveAttribute(
			'target',
			'_blank'
		);
		await expect(proper(page)).toContainText(t('ca', 'proper_cim_meteo_source'));
		await expect(
			proper(page).locator('li.cim').getByText(t('ca', 'proper_cim_motiu_meteo_bona'))
		).not.toHaveCount(0);
		await expect(proper(page)).toContainText(t('ca', 'proper_cim_disclaimer'));
		// Màxim 6 peticions de meteo (candidates), cap de repetida
		expect(slugs.length).toBeGreaterThan(0);
		expect(slugs.length).toBeLessThanOrEqual(6);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	test('el botó de l’avís obre el full del municipi d’origen; en desar-lo l’avís desapareix', async ({
		page
	}) => {
		await fixarRellotge(page);
		await gotoHydrated(page, ROUTES.ca.app);
		await proper(page)
			.getByRole('button', { name: exacte('ca', 'stats_far_choose') })
			.click();
		const full = page.getByRole('dialog', { name: exacte('ca', 'origin_title') });
		await expect(full).toBeVisible();
		const cb = full.getByRole('combobox', { name: t('ca', 'origin_search_label') });
		await cb.fill('Girona');
		await expect(full.getByRole('option').first()).toContainText('Girona');
		await cb.press('Enter');
		await expect(full).toBeHidden();
		await expect(proper(page).getByRole('note')).toHaveCount(0);
		expect((await llegirOrigen(page))?.valor).toBe(municipi('Girona').codi);
	});

	test('amb origen: sense avís i els motius porten la distància en km', async ({ page }) => {
		await fixarRellotge(page);
		await mockMeteo(page, previsio(DIES_FINDE.map((data) => ({ data }))));
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		await escriureOrigen(page, municipi('Barcelona').codi);
		await page.reload();
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(proper(page).getByRole('note')).toHaveCount(0);
		const km = new RegExp(
			escapeRe(t('ca', 'proper_cim_motiu_distancia', { km: '@@' })).replace('@@', '\\d+([.,]\\d+)?')
		);
		await expect(proper(page).locator('ul.motius li').filter({ hasText: km })).not.toHaveCount(0);
	});

	test('meteo dolenta (pluja i ratxes) → motiu "Mala previsió"; no la fa sortir si hi ha alternatives bones', async ({
		page
	}) => {
		await fixarRellotge(page);
		const dolenta = previsio(
			DIES_FINDE.map((data) => ({ data, precipitacio: 12, ratxaMax: 90, codi: 95 }))
		);
		const bona = previsio(DIES_FINDE.map((data) => ({ data })));
		// Primer, amb temps dolent a tot arreu: tots els cims porten el motiu.
		await mockMeteo(page, dolenta);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		for (const li of await cimsProper(page).all())
			await expect(li).toContainText(t('ca', 'proper_cim_motiu_meteo_dolenta'));
		// Amb temps bo, cap motiu de mala previsió.
		await page.unroute(/\/api\/meteo\//);
		await mockMeteo(page, bona);
		await page.reload();
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(proper(page)).not.toContainText(t('ca', 'proper_cim_motiu_meteo_dolenta'));
	});

	test('una previsió sense els dies del cap de setmana → "Sense previsió per a aquests dies" a cada cim', async ({
		page
	}) => {
		await fixarRellotge(page);
		await mockMeteo(page, previsio(['2026-10-12', '2026-10-13'].map((data) => ({ data }))));
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(proper(page).getByText(exacte('ca', 'proper_cim_no_forecast_peak'))).toHaveCount(
			3
		);
	});

	test('un cim sense previsió no impedeix que els altres es rebin i es mostrin', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource/);
		await fixarRellotge(page);
		let n = 0;
		await page.route(/\/api\/meteo\//, (route) => {
			n++;
			if (n % 2 === 0) return route.fulfill({ status: 502, body: 'x' });
			return route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(previsio(DIES_FINDE.map((data) => ({ data }))))
			});
		});
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		// Hi ha meteo (alguna resposta ha estat bona): font visible, sense l'avís general
		await expect(peu(page)).toContainText(t('ca', 'proper_cim_meteo_source'));
		await expect(peu(page)).not.toContainText(t('ca', 'proper_cim_meteo_unavailable'));
	});

	test('si la meteo falla (502) es mostren igualment 3 cims, sense meteo, amb l’avís', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource/);
		await fixarRellotge(page);
		await mockMeteo(page, { error: 'proveïdor no disponible' }, 502);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(peu(page)).toHaveText(exacte('ca', 'proper_cim_meteo_unavailable'));
		await expect(proper(page)).not.toContainText(t('ca', 'proper_cim_motiu_meteo_bona'));
		await expect(proper(page)).toContainText(t('ca', 'proper_cim_disclaimer'));
	});

	test('resposta de meteo malformada (sense "dies") → es tracta com a sense meteo', async ({
		page
	}) => {
		await fixarRellotge(page);
		await mockMeteo(page, { actualitzat: 'x' }, 200);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(peu(page)).toHaveText(exacte('ca', 'proper_cim_meteo_unavailable'));
	});

	test('sense connexió i sense còpia desada: es demana la meteo, falla i hi ha 3 cims amb l’avís', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource/);
		await fixarRellotge(page);
		await page.addInitScript(() => {
			Object.defineProperty(navigator, 'onLine', { get: () => false, configurable: true });
		});
		const peticions: string[] = [];
		await page.route(/\/api\/meteo\//, (route) => {
			peticions.push(route.request().url());
			return route.abort('internetdisconnected');
		});
		// Les dificultats tampoc arriben (fetch avortat): sense elles també hi ha recomanacions.
		await page.route(/\/api\/dificultats\.json/, (route) => route.abort('internetdisconnected'));
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(peu(page)).toHaveText(exacte('ca', 'proper_cim_meteo_unavailable'));
		// Es demana igualment: el service worker pot tenir l'última previsió desada.
		expect(peticions.length).toBeGreaterThan(0);
	});

	test('sense connexió amb la previsió desada (SW): es fa servir i se’n mostra l’antiguitat', async ({
		page
	}) => {
		await fixarRellotge(page);
		await page.addInitScript(() => {
			Object.defineProperty(navigator, 'onLine', { get: () => false, configurable: true });
		});
		await mockMeteo(page, previsio([{ data: '2026-10-17' }, { data: '2026-10-18' }]));
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		const edat = proper(page).getByTestId('proper-cim-meteo-edat');
		await expect(edat).toBeVisible();
		await expect(edat).toContainText('Sense connexió');
		await expect(edat).toContainText('Previsió actualitzada');
	});

	test('les dificultats no arriben (404): igualment 3 recomanacions', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource/);
		await fixarRellotge(page);
		await page.route(/\/api\/dificultats\.json/, (route) =>
			route.fulfill({ status: 404, body: '' })
		);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
	});

	test('els cims ja fets no es recomanen; amb tot fet menys uns quants, només surten aquests', async ({
		page
	}) => {
		await fixarRellotge(page);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		const primers = await nomsProper(page);
		const fetsIds = primers.map((nom) => CIMS.find((c) => c.nom === nom)!.id);
		await sembrar(
			page,
			fetsIds.map((id, i) => ({ cimId: id, data: `2025-0${i + 1}-10` })),
			ROUTES.ca.app
		);
		await expect(cimsProper(page)).toHaveCount(3);
		const despres = await nomsProper(page);
		for (const nom of primers) expect(despres).not.toContain(nom);
	});

	test('repte a punt: les 4 estacions d’un any tancat no puntuen; el bonus va al massís al qual en falta 1', async ({
		page
	}) => {
		await fixarRellotge(page);
		await mockMeteo(page, previsio(DIES_FINDE.map((data) => ({ data }))));
		// 2025: 3/4 estacions (any tancat). 2026: hivern i primavera (l'estiu ja no es pot fer, som a
		// l'octubre) → Les 4 estacions no és "a punt". Montseny: 3 de 4 fets; en falta 1.
		await sembrar(
			page,
			[
				fila('canigo', '2025-04-10'),
				fila('montcau', '2025-07-10'),
				fila('pica-d-estats', '2025-10-10'),
				fila('matagalls', '2026-01-10'),
				fila('les-agudes', '2026-04-10'),
				fila('tagamanent', '2025-11-10')
			],
			ROUTES.ca.app
		);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(proper(page)).not.toContainText(t('ca', 'repte_les_4_estacions_nom'));
		const montsoriu = cimsProper(page).filter({ hasText: cimDe('turo-de-montsoriu').nom });
		await expect(montsoriu).toHaveCount(1);
		await expect(montsoriu).toContainText(
			t('ca', 'proper_cim_motiu_repte_a_punt', {
				repte: t('ca', 'repte_massis_montseny_nom'),
				falten: 1
			})
		);
		// I és el primer (és l'únic amb el bonus)
		expect((await nomsProper(page))[0]).toBe(cimDe('turo-de-montsoriu').nom);
	});

	test('repte a punt: Les 4 estacions sí puntua amb l’any en curs (3 de 4 i la que falta encara cap)', async ({
		page
	}) => {
		await fixarRellotge(page);
		await mockMeteo(page, previsio(DIES_FINDE.map((data) => ({ data }))));
		await sembrar(
			page,
			[
				fila('canigo', '2026-01-10'),
				fila('montcau', '2026-04-10'),
				fila('pica-d-estats', '2026-07-10')
			],
			ROUTES.ca.app
		);
		await expect(cimsProper(page)).toHaveCount(3);
		for (const li of await cimsProper(page).all())
			await expect(li).toContainText(
				t('ca', 'proper_cim_motiu_repte_a_punt', {
					repte: t('ca', 'repte_les_4_estacions_nom'),
					falten: 1
				})
			);
	});

	test('cada recomanació mostra almenys un motiu, també sense meteo, origen ni dificultats (cims alts a l’octubre)', async ({
		page,
		consoleGuard
	}) => {
		// BUG (informe QA R2, verificació): `ProperCim.svelte` filtra els motius amb `punts !== 0`, i
		// el motiu neutre `pendent` (0 punts) no es veu mai: la targeta queda sense cap motiu. Quan es
		// corregeixi, aquest test fallarà: treure `test.fail()`.
		test.fail();
		consoleGuard.allow(/Failed to load resource/);
		await fixarRellotge(page);
		await mockMeteo(page, { error: 'no disponible' }, 502);
		// Sense dificultats (cap nivell habitual) i amb tots els cims de menys de 2.000 m fets, només
		// queden cims alts, que a l'octubre no tenen cap motiu d'època.
		await page.route(/\/api\/dificultats\.json/, (route) =>
			route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
		);
		await sembrar(
			page,
			CIMS.filter((c) => c.altitud < 2000).map((c, i): FilaSembra => ({
				cimId: c.id,
				data: `${2010 + (i % 14)}-0${1 + (i % 9)}-1${i % 9}`
			})),
			ROUTES.ca.app
		);
		await expect(cimsProper(page)).toHaveCount(3);
		for (const li of await cimsProper(page).all())
			expect(await li.locator('ul.motius li').count(), await li.innerText()).toBeGreaterThan(0);
	});

	test('restriccions: un cim en obres no es recomana mai; La Picossa (15/01–15/06) sí a l’octubre però no al juny', async ({
		page
	}) => {
		const excepcions = new Set([CIM.santSalvador.id, CIM.picossa.id, CIM.montcau.id]);
		const files: FilaSembra[] = CIMS.filter((c) => !excepcions.has(c.id)).map((c, i) => ({
			cimId: c.id,
			data: `${2012 + (i % 12)}-0${1 + (i % 9)}-1${i % 9}`
		}));
		// Octubre (cap de setmana 17–18): La Picossa permesa; Sant Salvador (obres, sense dates) no.
		await fixarRellotge(page);
		await sembrar(page, files, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(2);
		expect((await nomsProper(page)).sort()).toEqual([CIM.montcau.nom, CIM.picossa.nom].sort());

		// Divendres 12/06: el cap de setmana 13–14/06 és dins la veda → només el Montcau.
		await fixarRellotge(page, new Date('2026-06-12T10:00:00+02:00'));
		await page.reload();
		await expect(cimsProper(page)).toHaveCount(1);
		expect(await nomsProper(page)).toEqual([CIM.montcau.nom]);

		// Dijous 18/06: el cap de setmana 20–21/06 és fora de la veda → torna La Picossa.
		await fixarRellotge(page, new Date('2026-06-18T10:00:00+02:00'));
		await page.reload();
		await expect(cimsProper(page)).toHaveCount(2);
	});

	test('el cap de setmana segons el dia: dissabte → dissabte i diumenge, diumenge → només avui, dilluns de matinada → el següent', async ({
		page
	}) => {
		const casos: [string, string[]][] = [
			['2026-10-17T10:00:00+02:00', ['2026-10-17', '2026-10-18']],
			['2026-10-18T10:00:00+02:00', ['2026-10-18']],
			// 22:30 UTC del diumenge = 00:30 del dilluns 19 a Madrid → cap de setmana 24–25
			['2026-10-18T22:30:00Z', ['2026-10-24', '2026-10-25']],
			['2026-10-16T21:30:00Z', ['2026-10-17', '2026-10-18']]
		];
		for (const [quan, dies] of casos) {
			await fixarRellotge(page, new Date(quan));
			await gotoHydrated(page, ROUTES.ca.app);
			const esperat =
				dies.length === 1
					? t('ca', 'proper_cim_day', { date: dataLlarga(dies[0], 'ca') })
					: t('ca', 'proper_cim_weekend', {
							from: dataLlarga(dies[0], 'ca'),
							to: dataLlarga(dies[1], 'ca')
						});
			await expect(proper(page).locator('.finde'), quan).toHaveText(esperat);
		}
	});

	test('en castellano: título, aviso, motivos y fuente', async ({ page }) => {
		await fixarRellotge(page);
		await gotoHydrated(page, ROUTES.es.app);
		await expect(proper(page).getByRole('heading', { level: 2 })).toHaveText(
			exacte('es', 'proper_cim_title')
		);
		await expect(cimsProper(page)).toHaveCount(3);
		await expect(proper(page).getByRole('note')).toContainText(t('es', 'proper_cim_no_origin'));
		await expect(cimsProper(page).first().locator('.nom a')).toHaveAttribute(
			'href',
			/\/es\/cimas\/[a-z0-9-]+$/
		);
		await expect(proper(page)).toContainText(t('es', 'proper_cim_disclaimer'));
	});

	test('registrar un cim des de /app recalcula les recomanacions (i no repeteix el que s’acaba de fer)', async ({
		page
	}) => {
		await fixarRellotge(page);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(cimsProper(page)).toHaveCount(3);
		const primer = (await nomsProper(page))[0];
		const cim = CIMS.find((c) => c.nom === primer)!;
		await registrarPerUrl(page, cim.slug, AVUI);
		await expect(cimsProper(page)).toHaveCount(3);
		expect(await nomsProper(page)).not.toContain(primer);
	});
});

// ---------------------------------------------------------------------------
// Novetats
// ---------------------------------------------------------------------------

test.describe('Novetats', () => {
	const full = (page: Page) => page.getByRole('dialog', { name: exacte('ca', 'news_title') });

	test('usuari nou: no surt cap full i es marca l’última novetat com a vista', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(full(page)).toHaveCount(0);
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_NOVETAT)).toBe(ID_NOVETAT);
		await page.reload();
		await expect(full(page)).toHaveCount(0);
	});

	test('usuari nou a la portada pública: tampoc surt', async ({ page }) => {
		await gotoHydrated(page, ROUTES.ca.home);
		await expect(page.getByRole('dialog')).toHaveCount(0);
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_NOVETAT)).toBe(ID_NOVETAT);
	});

	test('usuari existent (altres claus carnetdecims:*, sense novetat-vista): surt el full, es tanca amb "Entesos" i no torna a sortir', async ({
		page
	}) => {
		await page.addInitScript(() => {
			if (!localStorage.getItem('carnetdecims:novetat-vista'))
				localStorage.setItem('carnetdecims:llest-offline', '1');
		});
		await gotoHydrated(page, ROUTES.ca.app);
		const f = full(page);
		await expect(f).toBeVisible();
		await expect(f.getByRole('heading', { name: NOVETATS[0].titol.ca })).toBeVisible();
		await expect(f.locator('li')).toHaveCount(NOVETATS[0].punts.ca.length);
		await expect(f.locator('time')).toHaveAttribute('datetime', NOVETATS[0].data);
		await f.getByRole('button', { name: exacte('ca', 'news_close') }).click();
		await expect(f).toBeHidden();
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_NOVETAT)).toBe(ID_NOVETAT);
		await page.reload();
		await expect(full(page)).toHaveCount(0);
		await gotoHydrated(page, ROUTES.es.app);
		await expect(page.getByRole('dialog')).toHaveCount(0);
	});

	test('usuari existent en castellano: el full surt en castellano', async ({ page }) => {
		await page.addInitScript(() => {
			if (!localStorage.getItem('carnetdecims:novetat-vista'))
				localStorage.setItem('carnetdecims:avis-installacio', '1');
		});
		await gotoHydrated(page, ROUTES.es.app);
		const f = page.getByRole('dialog', { name: exacte('es', 'news_title') });
		await expect(f).toBeVisible();
		await expect(f.getByRole('heading', { name: NOVETATS[0].titol.es })).toBeVisible();
		await f.getByRole('button', { name: exacte('es', 'news_close') }).click();
		await expect(f).toBeHidden();
	});

	test('Esc tanca el full i desa la novetat; mentre és obert el foco és dins del diàleg', async ({
		page
	}) => {
		await page.addInitScript(() => {
			if (!localStorage.getItem('carnetdecims:novetat-vista'))
				localStorage.setItem('carnetdecims:llest-offline', '1');
		});
		await gotoHydrated(page, ROUTES.ca.app);
		const f = full(page);
		await expect(f).toBeVisible();
		await expect.poll(() => f.evaluate((el) => el.contains(document.activeElement))).toBe(true);
		await page.keyboard.press('Escape');
		await expect(f).toBeHidden();
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_NOVETAT)).toBe(ID_NOVETAT);
	});

	// El full s'obre sol en carregar, sense cap control que l'hagi obert: en tancar-lo, el focus
	// va al contingut principal i no queda a <body> (WCAG 2.4.3).
	test('en tancar el full el foco no queda a <body>', async ({ page, browserName }) => {
		// BUG a WebKit (informe QA R2, verificació): el foco hi queda a <body> igualment (Novetats
		// el mou a `#contingut` abans que WebKit acabi de restaurar-lo en tancar el <dialog>).
		test.fail(browserName === 'webkit', 'Novetats: foco a <body> a WebKit');
		await page.addInitScript(() => {
			if (!localStorage.getItem('carnetdecims:novetat-vista'))
				localStorage.setItem('carnetdecims:llest-offline', '1');
		});
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(full(page)).toBeVisible();
		await full(page)
			.getByRole('button', { name: exacte('ca', 'news_close') })
			.click();
		await expect(full(page)).toBeHidden();
		await expect
			.poll(() => page.evaluate(() => document.activeElement?.tagName.toLowerCase() ?? ''), {
				timeout: 2000
			})
			.not.toBe('body');
	});

	test('una novetat ja vista (o un id desconegut) no torna a sortir', async ({ page }) => {
		await page.addInitScript(
			([k, v]) => localStorage.setItem(k, v),
			[CLAU_NOVETAT, 'id-que-no-existeix']
		);
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(page.getByRole('dialog')).toHaveCount(0);
		// I el valor desat no es sobreescriu
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_NOVETAT)).toBe(
			'id-que-no-existeix'
		);
	});

	test('sense localStorage (bloquejat): la pàgina funciona i no surt cap full', async ({
		page
	}) => {
		await page.addInitScript(() => {
			Object.defineProperty(window, 'localStorage', {
				get() {
					throw new DOMException('denied', 'SecurityError');
				},
				configurable: true
			});
		});
		await gotoHydrated(page, ROUTES.ca.app);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.getByRole('dialog')).toHaveCount(0);
	});

	test('el full obert no té violacions axe (clar i fosc) ni desbordament a 320 px', async ({
		page
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem('carnetdecims:llest-offline', '1');
		});
		for (const scheme of ['light', 'dark'] as const) {
			await page.emulateMedia({ colorScheme: scheme });
			await page
				.evaluate(() => localStorage.removeItem('carnetdecims:novetat-vista'))
				.catch(() => undefined);
			await gotoHydrated(page, ROUTES.ca.app);
			await expect(full(page)).toBeVisible();
			await settleAnimations(page);
			await expectAxeNet(page);
			await page.setViewportSize({ width: 320, height: 640 });
			await expectSenseDesbord(page);
			await page.setViewportSize({ width: 1280, height: 800 });
		}
	});
});

// ---------------------------------------------------------------------------
// Accessibilitat i reflow
// ---------------------------------------------------------------------------

/** Dades que fan que hi hagi de tot: un repte completat, ratxa, estacions parcials, etc. */
const DADES_COMPLETES: FilaSembra[] = [
	fila('matagalls', '2025-03-01'),
	fila('les-agudes', '2025-04-01'),
	fila('tagamanent', '2025-05-01'),
	fila('turo-de-montsoriu', '2025-06-01'),
	fila('sant-jeroni', '2026-08-10'),
	fila('montgros', '2026-09-10'),
	fila('canigo', '2026-10-05'),
	fila('pica-d-estats', '2025-11-05')
];

test.describe('Reptes · accessibilitat', () => {
	for (const scheme of ['light', 'dark'] as const) {
		test(`axe sense violacions (${scheme}): llista, detall de cada tipus de regla, estadístiques amb medalles i /app amb el proper cim`, async ({
			page
		}) => {
			test.slow();
			await page.emulateMedia({ colorScheme: scheme });
			await fixarRellotge(page);
			await sembrar(page, DADES_COMPLETES, ROUTES.ca.app);
			const urls = [
				ROUTES.ca.app,
				base('ca'),
				detall('ca', 'cent'),
				detall('ca', 'infantil'),
				detall('ca', 'comarques'),
				detall('ca', 'estacions'),
				detall('ca', 'mesos'),
				detall('ca', 'montseny'),
				detall('ca', 'montserrat'),
				ROUTES.ca.stats,
				base('es'),
				detall('es', 'mesos'),
				ROUTES.es.app
			];
			for (const u of urls) {
				await gotoHydrated(page, u);
				if (u === ROUTES.ca.app || u === ROUTES.es.app)
					await expect(cimsProper(page)).toHaveCount(3);
				else await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
				await expectAxeNet(page);
			}
		});
	}

	test('toast de medalla sense violacions axe', async ({ page }) => {
		await fixarRellotge(page);
		await sembrar(
			page,
			[
				fila('matagalls', '2025-03-01'),
				fila('les-agudes', '2025-04-01'),
				fila('tagamanent', '2025-05-01')
			],
			ROUTES.ca.app
		);
		await registrarPerUrl(page, 'turo-de-montsoriu', AVUI);
		await expect(toast(page, /Medalla nova/)).toBeVisible();
		await expectAxeNet(page);
	});

	test('teclat al detall: es pot arribar als pendents i desplegar "Mostra\'n més" amb Retorn', async ({
		page
	}) => {
		await fixarRellotge(page);
		await gotoHydrated(page, detall('ca', 'cent'));
		const resum = page.locator('details.mes summary');
		await resum.focus();
		await expect(resum).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('details.mes')).toHaveAttribute('open', '');
		// Cada cim pendent té una àrea tàctil ≥ 44 px d'alt
		const alt = await page
			.locator('ul.cims li')
			.first()
			.evaluate((el) => el.getBoundingClientRect().height);
		expect(alt).toBeGreaterThanOrEqual(44);
	});
});

test.describe('Reptes · reflow (320, 375, 1280)', () => {
	for (const w of [320, 375, 1280]) {
		test(`sense desbordament horitzontal a ${w} px (ca i es, amb dades)`, async ({ page }) => {
			test.slow();
			await fixarRellotge(page);
			await page.setViewportSize({ width: w, height: 800 });
			await sembrar(page, DADES_COMPLETES, ROUTES.ca.app);
			const urls = [
				ROUTES.ca.app,
				base('ca'),
				detall('ca', 'cent'),
				detall('ca', 'comarques'),
				detall('ca', 'estacions'),
				detall('ca', 'mesos'),
				detall('ca', 'montseny'),
				ROUTES.ca.stats,
				base('es'),
				detall('es', 'infantil'),
				detall('es', 'montserrat'),
				detall('es', 'comarques'),
				ROUTES.es.app,
				ROUTES.es.stats
			];
			for (const u of urls) {
				await gotoHydrated(page, u);
				if (u === ROUTES.ca.app || u === ROUTES.es.app)
					await expect(cimsProper(page)).toHaveCount(3);
				else await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
				await settleAnimations(page);
				await expectSenseDesbord(page);
			}
		});
	}

	test('toast de medalla a 320 px: no surt del viewport ni tapa el botó de tancar', async ({
		page
	}) => {
		await fixarRellotge(page);
		await page.setViewportSize({ width: 320, height: 640 });
		await sembrar(
			page,
			[
				fila('matagalls', '2025-03-01'),
				fila('les-agudes', '2025-04-01'),
				fila('tagamanent', '2025-05-01')
			],
			ROUTES.ca.app
		);
		await registrarPerUrl(page, 'turo-de-montsoriu', AVUI);
		const m = toast(page, /Medalla nova/);
		await expect(m).toBeVisible();
		const caixa = await m.boundingBox();
		expect(caixa!.x).toBeGreaterThanOrEqual(0);
		expect(caixa!.x + caixa!.width).toBeLessThanOrEqual(320);
		const boto = m.getByRole('button', { name: exacte('ca', 'toast_dismiss') });
		const b = await boto.boundingBox();
		expect(b!.width).toBeGreaterThanOrEqual(24);
	});
});
