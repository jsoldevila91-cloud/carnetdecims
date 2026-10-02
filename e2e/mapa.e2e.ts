/**
 * Bloc 4c · Mapa interactiu (/mapa) i "Cims a prop" (/app/a-prop).
 *
 * - Sense JS: la imatge estàtica de l'ICGC (LCP) amb alt i atribució, i la llista alternativa.
 * - MapLibre (chunk de ~1 MB + worker propi) NOMÉS es descarrega a /mapa, i amb "estalvi de
 *   dades" només en prémer el botó.
 * - Mapa actiu: canvas, atribució ICGC única, worker de producció que funciona (els clústers es
 *   calculen al worker: si fos buit, no es dibuixaria cap cim), filtres ↔ query, full del cim
 *   (`?cim=`), conmutador Mapa|Llista, "La meva ubicació", respatlla IGN a la Catalunya Nord.
 * - /app/a-prop: concedit (des de Berga), denegat, "Només pendents".
 *
 * El mapa interactiu fa servir la xarxa real (estil i tessel·les de l'ICGC, Plan IGN): és el
 * que es vol comprovar. On només cal el dibuix dels cims, l'estil de l'ICGC se substitueix per un
 * estil mínim (un fons llis): els píxels que no són del fons són els marcadors i clústers.
 *
 * WebGL: Chromium (headless) i WebKit (Windows) en tenen. Si un navegador no en tingués, els tests
 * que necessiten el mapa comproven el fallback (missatge + llista) i se salten la resta
 * (`requereixWebGL`); el fallback també es prova sempre forçant `getContext('webgl*') = null`.
 *
 * El component no exposa la instància de MapLibre: `queryRenderedFeatures` no és accessible.
 * El dibuix es verifica amb píxels del canvas, i les animacions de càmera amb
 * `prefers-reduced-motion` no són observables sense un ganxo de test (només la transició CSS).
 */
import type { BrowserContext, Page } from '@playwright/test';
import {
	test,
	expect,
	gotoHydrated,
	hrefsAbsoluts,
	expectHref,
	toleraAvortamentsWebKit,
	ROUTES
} from './fixtures';
import { CIM, sembrar } from './ascensions';
import { CIMS, alt, comarca, expectNoAxeViolations, fitxaUrl, overflowX } from './cataleg';

const MAPA = ROUTES.ca.map;
const A_PROP = ROUTES.ca.nearby;
const TOTAL = CIMS.length;
const BERGA = { latitude: 42.1037, longitude: 1.8456 };
const PEDRAFORCA = CIMS.find((c) => c.slug === CIM.pedraforca.slug)!;

// WebKit (WebGL per programari) amb tessel·les reals i 3 projectes en paral·lel pot trigar >30 s
// a activar el mapa: temps triple.
test.slow(({ browserName }) => browserName === 'webkit', 'WebGL i tessel·les reals sota càrrega');
// Molts tests fan `page.goto` amb el mapa carregant: vegeu `toleraAvortamentsWebKit`.
test.beforeEach(({ consoleGuard, browserName }) =>
	toleraAvortamentsWebKit(consoleGuard, browserName)
);

// ── Localitzadors ───────────────────────────────────────────────────────────

const comptador = (page: Page) => page.locator('main p.resultat[role="status"]');
const controls = (page: Page) => page.getByRole('group', { name: 'Controls del mapa' });
const boto = (page: Page, name: string | RegExp) =>
	page.getByRole('button', typeof name === 'string' ? { name, exact: true } : { name });
const MES_FILTRES = /^Més filtres/;
const fullCim = (page: Page, nom: string) => page.getByRole('dialog', { name: nom });
const errorMapa = (page: Page) =>
	page.getByRole('alert').filter({ hasText: "No s'ha pogut carregar el mapa interactiu" });
const llistaVisible = (page: Page) => page.locator('section.vista-llista li:not([hidden]) a');
const estatAProp = (page: Page) => page.locator('main p.estat[role="status"]');
const nomsAProp = (page: Page) => page.locator('main ol.llista li a.nom').allInnerTexts();

const textComptador = (n: number, fets = 0) =>
	new RegExp(`^\\s*${n === 1 ? '1' : n} de ${TOTAL} cims${fets ? `\\s*· ${fets} fets?` : ''}\\s*$`);

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Recursos que només es baixen amb el mapa interactiu (MapLibre, el seu CSS, el worker, l'estil). */
const RE_MAPLIBRE =
	/\/workers\/maplibre-worker|\/assets\/motor\.[^/]*\.css|geoserveis\.icgc\.cat\/styles\//;

/**
 * Vigila si es baixa MapLibre: per URL (worker, CSS del motor, estil ICGC) i pel contingut dels
 * chunks JS propis (el de MapLibre conté l'URL del worker; els noms dels chunks són hash).
 */
function espiaMapLibre(page: Page) {
	const baixats: string[] = [];
	const pendents: Promise<void>[] = [];
	page.on('request', (r) => {
		if (RE_MAPLIBRE.test(r.url())) baixats.push(r.url());
	});
	page.on('response', (r) => {
		const url = r.url();
		if (!/^http:\/\/localhost:\d+\/_app\/.*\.js$/.test(url)) return;
		pendents.push(
			r
				.text()
				.then((t) => {
					if (t.includes('maplibre-worker')) baixats.push(url);
				})
				.catch(() => undefined)
		);
	});
	return async () => {
		await Promise.all(pendents);
		return baixats;
	};
}

/** Simula "estalvi de dades" (Save-Data) abans que s'executi cap script de la pàgina. */
async function estalviDeDades(page: Page) {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'connection', {
			configurable: true,
			value: { saveData: true, effectiveType: '4g', addEventListener() {} }
		});
	});
}

async function teWebGL(page: Page) {
	return page.evaluate(() => {
		const c = document.createElement('canvas');
		return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
	});
}

/**
 * Espera el mapa interactiu. Sense WebGL comprova el fallback (missatge + llista) i salta el test.
 */
async function esperaMapa(page: Page) {
	if (!(await teWebGL(page))) {
		await expect(errorMapa(page)).toBeVisible({ timeout: 30_000 });
		await boto(page, 'Llista').click();
		await expect(llistaVisible(page).first()).toBeVisible();
		test.skip(true, 'Sense WebGL en aquest navegador: comprovat el fallback (missatge + llista)');
	}
	await expect(controls(page)).toBeVisible({ timeout: 60_000 });
	await expect(page.locator('.maplibregl-canvas')).toBeVisible();
}

/** Estil mínim (fons magenta i cap capa base): el que no és magenta són cims i clústers. */
const FONS = { r: 255, g: 0, b: 255 };
async function estilMinim(page: Page) {
	await page.route(/geoserveis\.icgc\.cat\/styles\//, (route) =>
		route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify({
				version: 8,
				name: 'test',
				glyphs:
					'https://geoserveis.icgc.cat/vector-tiles/simbologia/glyphs/{fontstack}/{range}.pbf',
				sources: {},
				layers: [{ id: 'fons', type: 'background', paint: { 'background-color': '#ff00ff' } }]
			})
		})
	);
}

/**
 * Fracció de píxels del canvas del mapa que no són el fons (controls i atribució emmascarats amb
 * el color del fons). S'analitza en una pestanya auxiliar per no tocar la pàgina provada.
 */
async function fraccioDibuixada(page: Page, context: BrowserContext): Promise<number> {
	const png = await page.locator('.viu').screenshot({
		mask: [controls(page), page.locator('.maplibregl-ctrl-attrib')],
		maskColor: '#ff00ff',
		animations: 'disabled',
		scale: 'css'
	});
	const aux = await context.newPage();
	try {
		return await aux.evaluate(
			async ({ b64, fons }) => {
				const img = new Image();
				img.src = `data:image/png;base64,${b64}`;
				await img.decode();
				const c = document.createElement('canvas');
				c.width = img.naturalWidth;
				c.height = img.naturalHeight;
				const ctx = c.getContext('2d')!;
				ctx.drawImage(img, 0, 0);
				const d = ctx.getImageData(0, 0, c.width, c.height).data;
				let n = 0;
				for (let i = 0; i < d.length; i += 4) {
					const dist =
						Math.abs(d[i] - fons.r) + Math.abs(d[i + 1] - fons.g) + Math.abs(d[i + 2] - fons.b);
					if (dist > 90) n++;
				}
				return n / (c.width * c.height);
			},
			{ b64: png.toString('base64'), fons: FONS }
		);
	} finally {
		await aux.close();
	}
}

/** Espera que el dibuix s'estabilitzi (fade dels símbols) i en retorna la fracció. */
async function dibuixEstable(page: Page, context: BrowserContext) {
	let anterior = -1;
	let ara = await fraccioDibuixada(page, context);
	for (let i = 0; i < 8 && Math.abs(ara - anterior) > 0.0005; i++) {
		await page.waitForTimeout(400);
		anterior = ara;
		ara = await fraccioDibuixada(page, context);
	}
	return ara;
}

function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
	const rad = Math.PI / 180;
	const dLat = (b.lat - a.lat) * rad;
	const dLon = (b.lon - a.lon) * rad;
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
	return 2 * 6371.0088 * Math.asin(Math.sqrt(h));
}

const DES_DE_BERGA = [...CIMS]
	.filter((c) => c.lat !== null && c.lon !== null)
	.map((c) => ({
		c,
		d: distanciaKm({ lat: BERGA.latitude, lon: BERGA.longitude }, { lat: c.lat!, lon: c.lon! })
	}))
	.sort((a, b) => a.d - b.d || a.c.id - b.c.id)
	.map((x) => x.c);

/** Denegació determinista de la geolocalització (tots els navegadors). */
async function geoDenegada(page: Page) {
	await page.addInitScript(() => {
		navigator.geolocation.getCurrentPosition = (_ok, ko) =>
			ko?.({ code: 1, message: 'denied', PERMISSION_DENIED: 1 } as GeolocationPositionError);
	});
}

// ── 1. Sense JS ─────────────────────────────────────────────────────────────

test.describe('Mapa sense JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('imatge estàtica amb alt i atribució, avís i llista amb tots els cims', async ({ page }) => {
		const res = await page.goto(MAPA);
		expect(res?.status()).toBe(200);

		const img = page.locator('main figure .estatic img');
		await expect(img).toBeVisible();
		await expect(img).toHaveAttribute(
			'alt',
			`Mapa topogràfic de Catalunya, Andorra i la Catalunya Nord amb la situació dels ${TOTAL} cims del catàleg`
		);
		await expect(img).toHaveAttribute(
			'src',
			/^https:\/\/geoserveis\.icgc\.cat\/.*FORMAT=image\/jpeg/
		);
		// Sense CLS: mides intrínseques al HTML
		await expect(img).toHaveAttribute('width', /\d+/);
		await expect(img).toHaveAttribute('height', /\d+/);
		await expect(img).toHaveAttribute('fetchpriority', 'high');

		const atribucio = page.locator('main figcaption .atribucio a');
		await expect(atribucio).toBeVisible();
		await expect(atribucio).toContainText('Imatge: Mapa topogràfic © ICGC');
		await expect(atribucio).toHaveAttribute('rel', /license/);

		await expect(page.locator('main p.noscript')).toBeVisible();
		await expect(page.locator('main p.noscript')).toContainText('Sense JavaScript');

		// Controls que necessiten JS, amagats
		await expect(page.locator('main .barra')).toBeHidden();
		await expect(page.locator('main .filtres-w')).toBeHidden();
		await expect(page.locator('main .capa')).toBeHidden();

		// Llista alternativa visible amb tots els cims i enllaços a les fitxes
		await expect(page.getByRole('heading', { level: 2, name: 'Llista de cims' })).toBeVisible();
		const enllacos = page.locator('section.vista-llista li a');
		await expect(enllacos).toHaveCount(TOTAL);
		await expect(enllacos.first()).toBeVisible();
		const hrefs = await hrefsAbsoluts(enllacos);
		expect(new Set(hrefs)).toEqual(new Set(CIMS.map((c) => fitxaUrl(c.slug, 'ca'))));
	});
});

// ── 2. Càrrega diferida ─────────────────────────────────────────────────────

test.describe('MapLibre: càrrega diferida', () => {
	for (const url of ['/ca', '/ca/cims', fitxaUrl(CIM.pedraforca.slug, 'ca'), '/ca/app', A_PROP]) {
		test(`${url} no baixa MapLibre`, async ({ page }) => {
			const baixats = espiaMapLibre(page);
			await gotoHydrated(page, url);
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			// Temps de sobres perquè s'executin les càrregues en repòs (requestIdleCallback)
			await page.waitForTimeout(3000);
			expect(await baixats()).toEqual([]);
		});
	}

	test('/mapa amb estalvi de dades: no es baixa fins que es prem el botó', async ({ page }) => {
		await estalviDeDades(page);
		const baixats = espiaMapLibre(page);
		await gotoHydrated(page, MAPA);
		await page.waitForTimeout(3000);
		expect(await baixats(), 'MapLibre abans de prémer el botó').toEqual([]);
		await expect(page.locator('main figure .estatic img')).toBeVisible();

		await boto(page, 'Activa el mapa interactiu').click();
		await esperaMapa(page);
		expect((await baixats()).length).toBeGreaterThan(0);
	});

	// BUG: un enllaç `?cim=` (p. ex. "Mapa" a /app/a-prop) carrega MapLibre encara que hi hagi
	// estalvi de dades: `afterNavigate` crida `activarMapa()` sense mirar `estalviDades()`.
	test('/mapa?cim= amb estalvi de dades tampoc no baixa MapLibre sense el botó', async ({
		page
	}) => {
		test.fail(
			true,
			'Bug obert: ?cim= ignora l’estalvi de dades (mapa/+page.svelte, afterNavigate)'
		);
		await estalviDeDades(page);
		const baixats = espiaMapLibre(page);
		await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
		await expect(fullCim(page, PEDRAFORCA.nom)).toBeVisible();
		await page.waitForTimeout(3000);
		expect(await baixats()).toEqual([]);
	});

	test('/mapa sense estalvi: es carrega sol en repòs (sense cap interacció)', async ({ page }) => {
		const baixats = espiaMapLibre(page);
		await gotoHydrated(page, MAPA);
		await esperaMapa(page);
		expect(await baixats()).toContainEqual(expect.stringMatching(/maplibre-worker/));
	});
});

// ── 3. Mapa interactiu ──────────────────────────────────────────────────────

test.describe('Mapa interactiu', () => {
	test('canvas, atribució ICGC visible i única, worker propi, sense errors', async ({ page }) => {
		const workers: string[] = [];
		page.on('worker', (w) => workers.push(w.url()));
		await gotoHydrated(page, MAPA);
		await esperaMapa(page);

		await expect(page.locator('.maplibregl-canvas')).toHaveCount(1);
		// El canvas és una regió amb nom (lector de pantalla) i es pot enfocar
		await expect(page.locator('.maplibregl-canvas')).toHaveAttribute(
			'aria-label',
			/Mapa interactiu dels cims/
		);
		// La imatge fixa i la seva atribució surten de la vista (no hi ha atribució duplicada)
		await expect(page.locator('main figure .estatic')).toBeHidden();
		await expect(page.locator('main figcaption .atribucio')).toBeHidden();
		const attrib = page.locator('.maplibregl-ctrl-attrib');
		await expect(attrib).toBeVisible();
		await expect(attrib).toContainText('© ICGC');
		const text = await attrib.innerText();
		expect(text.match(/ICGC/g), `atribució: ${text}`).toHaveLength(1);
		// Sense la capa IGN visible (vista general), no s'atribueix l'IGN
		expect(text).not.toContain('IGN');

		expect(workers).toContainEqual(expect.stringMatching(/\/workers\/maplibre-worker-[^/]+\.js$/));
	});

	/** Fracció dibuixada amb el mapa obert directament a `url` (estil mínim). */
	async function dibuixA(page: Page, context: BrowserContext, url: string) {
		await gotoHydrated(page, url);
		await esperaMapa(page);
		return dibuixEstable(page, context);
	}

	test('el worker de producció dibuixa els cims (clústers), també amb filtres a la query', async ({
		page,
		context
	}) => {
		test.setTimeout(90_000);
		await estilMinim(page);
		const tots = await dibuixA(page, context, MAPA);
		const andorra = await dibuixA(page, context, `${MAPA}?zona=andorra`);
		// Cap resultat (cerca impossible): només queden les vores del marc
		const cap = await dibuixA(page, context, `${MAPA}?q=zzzzzz`);
		await expect(comptador(page)).toHaveText(textComptador(0));

		test
			.info()
			.annotations.push({ type: 'píxels', description: JSON.stringify({ tots, andorra, cap }) });
		// Llindar ample: al mòbil el marc és petit i les vores (i la barra inferior) hi pesen més
		expect(cap, 'sense resultats gairebé no hi ha dibuix').toBeLessThan(0.03);
		expect(andorra, 'Andorra (5 cims) dibuixa un clúster').toBeGreaterThan(cap + 0.0005);
		expect(tots, 'tots els cims dibuixen més que Andorra').toBeGreaterThan(andorra * 2);
	});

	// BUG: amb el mapa ja actiu, un filtre que necessita una icona nova (p. ex. el clúster "5" en
	// triar Andorra) deixa el mapa buit. MapLibre 6 dispara `styleimagemissing` DESPRÉS d'haver
	// respost al worker (image_manager.ts `_getImagesForIds`): la icona que s'hi afegeix no entra a
	// la tessel·la que la demanava. Cal `map.setMissingStyleImageResolver` (motor.ts).
	test('canviar un filtre amb el mapa actiu redibuixa els cims', async ({ page, context }) => {
		test.fail(true, 'Bug obert: icones creades a styleimagemissing no es dibuixen (motor.ts)');
		await estilMinim(page);
		await gotoHydrated(page, MAPA);
		await esperaMapa(page);
		await page.getByRole('searchbox').fill('zzzzzz');
		await expect(comptador(page)).toHaveText(textComptador(0));
		const cap = await dibuixEstable(page, context);
		await page.getByRole('searchbox').fill('');
		await boto(page, MES_FILTRES).click();
		await page.getByLabel('Zona', { exact: true }).selectOption('andorra');
		await expect(comptador(page)).toHaveText(textComptador(5));
		const andorra = await dibuixEstable(page, context);
		expect(andorra, 'Andorra dibuixa el seu clúster').toBeGreaterThan(cap + 0.0005);
	});

	test('filtres (essencials, estat, zona) actualitzen el comptador i la query', async ({
		page
	}) => {
		await estalviDeDades(page); // el mapa no cal: filtres, comptador i URL
		await gotoHydrated(page, MAPA);
		await expect(comptador(page)).toHaveText(textComptador(TOTAL));

		const ess = boto(page, 'Només essencials');
		await ess.click();
		await expect(ess).toHaveAttribute('aria-pressed', 'true');
		await expect(page).toHaveURL(/[?&]essencials=1(&|$)/);
		// Avui el catàleg només té essencials
		await expect(comptador(page)).toHaveText(textComptador(CIMS.filter((c) => c.essencial).length));

		await boto(page, MES_FILTRES).click();
		await expect(boto(page, MES_FILTRES)).toHaveAttribute('aria-expanded', 'true');
		await page.getByLabel('Zona', { exact: true }).selectOption('andorra');
		const nAndorra = CIMS.filter((c) => c.zona === 'andorra').length;
		await expect(comptador(page)).toHaveText(textComptador(nAndorra));
		await expect(page).toHaveURL(/[?&]zona=andorra(&|$)/);

		await page.getByLabel('Estat', { exact: true }).selectOption('fet');
		await expect(page).toHaveURL(/[?&]estat=fet(&|$)/);
		await expect(comptador(page)).toHaveText(textComptador(0));

		await page.getByLabel('Estat', { exact: true }).selectOption('pendent');
		await expect(page).toHaveURL(/[?&]estat=pendent(&|$)/);
		await expect(boto(page, 'Només pendents')).toHaveAttribute('aria-pressed', 'true');
		await expect(comptador(page)).toHaveText(textComptador(nAndorra));

		// La llista mostra la mateixa selecció
		await boto(page, 'Llista').click();
		await expect(llistaVisible(page)).toHaveCount(nAndorra);

		await boto(page, 'Treu els filtres').click();
		await expect(comptador(page)).toHaveText(textComptador(TOTAL));
		await expect(page).toHaveURL(`${MAPA}?vista=llista`);
	});

	test('els filtres es llegeixen de la query (enllaç compartit)', async ({ page }) => {
		await estalviDeDades(page);
		await gotoHydrated(page, `${MAPA}?zona=catalunya-nord&alt=2000-3000`);
		const esperats = CIMS.filter(
			(c) => c.zona === 'catalunya-nord' && c.altitud >= 2000 && c.altitud < 3000
		).length;
		await expect(comptador(page)).toHaveText(textComptador(esperats));
		await boto(page, MES_FILTRES).click();
		await expect(page.getByLabel('Zona', { exact: true })).toHaveValue('catalunya-nord');
		await expect(page.getByLabel('Altitud', { exact: true })).toHaveValue('2000-3000');
		// Valors desconeguts s'ignoren
		await gotoHydrated(page, `${MAPA}?zona=marte&estat=x`);
		await expect(comptador(page)).toHaveText(textComptador(TOTAL));
	});

	test('estat amb dades sembrades: comptador de fets i filtre "Només pendents"', async ({
		page
	}) => {
		await estalviDeDades(page);
		await sembrar(
			page,
			[
				{ cimId: CIM.pedraforca.id, data: '2024-06-15' },
				{ cimId: CIM.canigo.id, data: '2023-08-01' }
			],
			MAPA
		);
		await expect(comptador(page)).toHaveText(textComptador(TOTAL, 2));
		await boto(page, 'Només pendents').click();
		await expect(page).toHaveURL(/[?&]estat=pendent(&|$)/);
		await expect(comptador(page)).toHaveText(textComptador(TOTAL - 2));
	});

	// BUG (i18n): amb 1 cim fet el comptador diu "· 1 fets" (map_count_done sense singular).
	test('comptador amb un sol cim fet en singular', async ({ page }) => {
		test.fail(true, 'Bug obert: "1 fets" (messages/ca.json map_count_done sense forma singular)');
		await estalviDeDades(page);
		await sembrar(page, [{ cimId: CIM.pedraforca.id, data: '2024-06-15' }], MAPA);
		await expect(comptador(page)).toContainText('· 1 fet');
		await expect(comptador(page)).not.toContainText('1 fets');
	});

	test('?cim= obre el full amb les dades del cim; enrere el tanca', async ({ page }) => {
		await gotoHydrated(page, MAPA);
		await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
		const full = fullCim(page, PEDRAFORCA.nom);
		await expect(full).toBeVisible();
		await expect(page).toHaveURL(`${MAPA}?cim=${CIM.pedraforca.slug}`);
		await expect(full).toContainText(`${alt(PEDRAFORCA.altitud)} m`);
		await expect(full).toContainText(comarca(PEDRAFORCA.comarca).nom);
		await expect(full).toContainText('Essencial');
		await expect(full).toContainText('Pendent');
		await expectHref(
			full.getByRole('link', { name: `Fitxa de ${PEDRAFORCA.nom}` }),
			fitxaUrl(PEDRAFORCA.slug, 'ca')
		);
		await expectHref(
			full.getByRole('link', { name: `Registrar una ascensió a ${PEDRAFORCA.nom}` }),
			`/ca/app/registrar?cim=${PEDRAFORCA.slug}`
		);

		await page.goBack();
		await expect(full).toBeHidden();
		await expect(page).toHaveURL(MAPA);
		await expect(comptador(page)).toHaveText(textComptador(TOTAL));
	});

	test('Esc tanca el full i un cim inexistent avisa', async ({ page }) => {
		await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
		await expect(fullCim(page, PEDRAFORCA.nom)).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(fullCim(page, PEDRAFORCA.nom)).toBeHidden();
		await expect(page).toHaveURL(MAPA);

		await gotoHydrated(page, `${MAPA}?cim=no-existeix`);
		await expect(page.getByRole('alert')).toContainText('Aquest cim no és al catàleg.');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page).toHaveURL(MAPA);
	});

	test('amb una ascensió sembrada el full diu "Fet el …"', async ({ page }) => {
		await sembrar(
			page,
			[
				{ cimId: CIM.pedraforca.id, data: '2024-06-15' },
				{ cimId: CIM.pedraforca.id, data: '2025-02-01' }
			],
			`${MAPA}?cim=${CIM.pedraforca.slug}`
		);
		const full = fullCim(page, PEDRAFORCA.nom);
		await expect(full).toBeVisible();
		// La data és la de la primera ascensió vàlida
		await expect(full).toContainText(/Fet el 15 de juny d(e |el )2024/);
		await expect(full).not.toContainText('Pendent');
	});

	test('el full obre el registre amb el cim triat', async ({ page }) => {
		await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
		await fullCim(page, PEDRAFORCA.nom)
			.getByRole('link', { name: `Registrar una ascensió a ${PEDRAFORCA.nom}` })
			.click();
		const reg = page.getByRole('dialog', { name: 'Registrar una ascensió' });
		await expect(reg).toBeVisible();
		await expect(page).toHaveURL(`/ca/app/registrar?cim=${PEDRAFORCA.slug}`);
		await expect(reg.getByRole('button', { name: /\(Pedraforca\)/ })).toBeVisible();
	});

	test('conmutador Mapa | Llista amb el teclat', async ({ page, browserName }) => {
		await estalviDeDades(page);
		await gotoHydrated(page, MAPA);
		const mapa = boto(page, 'Mapa');
		const llista = boto(page, 'Llista');
		await expect(mapa).toHaveAttribute('aria-pressed', 'true');
		await expect(page.getByRole('group', { name: 'Vista' })).toBeVisible();

		await mapa.focus();
		// WebKit no enfoca botons amb Tab per defecte (preferència del sistema)
		if (browserName === 'webkit') await llista.focus();
		else await page.keyboard.press('Tab');
		await expect(llista).toBeFocused();
		await page.keyboard.press('Space');
		await expect(llista).toHaveAttribute('aria-pressed', 'true');
		await expect(mapa).toHaveAttribute('aria-pressed', 'false');
		await expect(page.getByRole('heading', { level: 2, name: 'Llista de cims' })).toBeVisible();
		await expect(page.locator('main figure.vista-mapa')).toBeHidden();
		await expect(page).toHaveURL(`${MAPA}?vista=llista`);
		await expect(llistaVisible(page)).toHaveCount(TOTAL);

		await mapa.focus();
		await page.keyboard.press('Enter');
		await expect(mapa).toHaveAttribute('aria-pressed', 'true');
		await expect(page.locator('main figure.vista-mapa')).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Llista de cims' })).toBeHidden();
		await expect(page).toHaveURL(MAPA);

		// L'enllaç amb ?vista=llista obre directament la llista
		await gotoHydrated(page, `${MAPA}?vista=llista`);
		await expect(llista).toHaveAttribute('aria-pressed', 'true');
		await expect(page.getByRole('heading', { level: 2, name: 'Llista de cims' })).toBeVisible();
	});

	test('"La meva ubicació" amb permís: centra el mapa i ho anuncia', async ({ page, context }) => {
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BERGA);
		await gotoHydrated(page, MAPA);
		await esperaMapa(page);
		await controls(page).getByRole('button', { name: 'La meva ubicació' }).click();
		await expect(page.locator('main .geo[role="status"]')).toHaveText(
			'Mapa centrat en la teva posició.'
		);
		await expect(page.getByRole('alert')).toHaveCount(0);
	});

	test('"La meva ubicació" denegada: missatge i el mapa continua', async ({ page }) => {
		await geoDenegada(page);
		await gotoHydrated(page, MAPA);
		await esperaMapa(page);
		await controls(page).getByRole('button', { name: 'La meva ubicació' }).click();
		await expect(page.getByRole('alert')).toContainText('No hi ha permís per saber on ets');
		await expect(controls(page)).toBeVisible();
	});

	test('Catalunya Nord (?cim=canigo): es mostra la capa Plan IGN amb la seva atribució', async ({
		page
	}) => {
		const ign: string[] = [];
		page.on('request', (r) => {
			if (r.url().startsWith('https://data.geopf.fr/wmts')) ign.push(r.url());
		});
		await gotoHydrated(page, `${MAPA}?cim=${CIM.canigo.slug}`);
		await expect(fullCim(page, CIM.canigo.nom)).toBeVisible();
		await esperaMapa(page);
		await expect.poll(() => ign.length, { timeout: 20_000 }).toBeGreaterThan(0);
		await expect(page.locator('.maplibregl-ctrl-attrib')).toContainText('IGN');
		expect(ign[0]).toContain('LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2');
	});

	test('fora de la Catalunya Nord (?cim=pedraforca) no es demana el Plan IGN', async ({ page }) => {
		const ign: string[] = [];
		page.on('request', (r) => {
			if (r.url().startsWith('https://data.geopf.fr/')) ign.push(r.url());
		});
		await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
		await esperaMapa(page);
		await page.waitForTimeout(2000);
		expect(ign).toEqual([]);
		await expect(page.locator('.maplibregl-ctrl-attrib')).not.toContainText('IGN');
	});

	test('sense WebGL: missatge clar, "Torna-ho a provar" i la llista funciona', async ({ page }) => {
		await page.addInitScript(() => {
			const orig = HTMLCanvasElement.prototype.getContext;
			HTMLCanvasElement.prototype.getContext = function (
				this: HTMLCanvasElement,
				tipus: string,
				...rest: unknown[]
			) {
				if (/webgl/i.test(tipus)) return null;
				return (orig as (...a: unknown[]) => unknown).call(this, tipus, ...rest);
			} as typeof orig;
		});
		await gotoHydrated(page, MAPA);
		await expect(errorMapa(page)).toBeVisible({ timeout: 30_000 });
		await expect(boto(page, 'Torna-ho a provar')).toBeVisible();
		await expect(page.locator('main figure .estatic img')).toBeVisible();
		await expect(page.locator('main figcaption .atribucio')).toBeVisible();
		await boto(page, 'Llista').click();
		await expect(llistaVisible(page)).toHaveCount(TOTAL);
	});

	test('sense connexió amb l’estil de l’ICGC: missatge d’error i es pot tornar a provar', async ({
		page,
		consoleGuard
	}) => {
		consoleGuard.allow(/Failed to load resource|net::ERR_FAILED|access control|Load failed/i);
		let bloquejat = true;
		await page.route(/geoserveis\.icgc\.cat\/styles\//, (route) =>
			bloquejat ? route.abort('internetdisconnected') : route.continue()
		);
		await gotoHydrated(page, MAPA);
		await expect(errorMapa(page)).toBeVisible({ timeout: 30_000 });
		bloquejat = false;
		await boto(page, 'Torna-ho a provar').click();
		await esperaMapa(page);
		await expect(errorMapa(page)).toHaveCount(0);
	});
});

// ── 4. Cims a prop ──────────────────────────────────────────────────────────

test.describe('Cims a prop (/app/a-prop)', () => {
	test('no demana la posició en carregar', async ({ page }) => {
		await page.addInitScript(() => {
			const w = window as unknown as { __geo: number };
			w.__geo = 0;
			const g = navigator.geolocation;
			const orig = g.getCurrentPosition.bind(g);
			g.getCurrentPosition = (...a: Parameters<Geolocation['getCurrentPosition']>) => {
				w.__geo++;
				return orig(...a);
			};
		});
		await gotoHydrated(page, A_PROP);
		await expect(page.getByRole('heading', { level: 1, name: 'Cims a prop' })).toBeVisible();
		await page.waitForTimeout(500);
		expect(await page.evaluate(() => (window as unknown as { __geo: number }).__geo)).toBe(0);
		await expect(page.locator('main ol.llista')).toHaveCount(0);
	});

	test('permís concedit des de Berga: els 15 més propers, per distància', async ({
		page,
		context
	}) => {
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BERGA);
		await gotoHydrated(page, A_PROP);
		await boto(page, 'Troba cims a prop').click();
		await expect(estatAProp(page)).toHaveText('Els 15 cims més propers a la teva posició.');
		const noms = await nomsAProp(page);
		expect(noms[0]).toBe(DES_DE_BERGA[0].nom);
		expect(noms).toEqual(DES_DE_BERGA.slice(0, 15).map((c) => c.nom));
		await expect(page.getByRole('alert')).toHaveCount(0);
		// Distància i direcció també per al lector de pantalla
		await expect(page.locator('main ol.llista li').first().locator('.sr-only').first()).toHaveText(
			/^a [\d,]+ km, cap al /
		);
		// "Mapa" porta al full del cim al mapa
		const primer = DES_DE_BERGA[0];
		await expectHref(
			page.getByRole('link', { name: `Veure ${primer.nom} al mapa` }),
			`${MAPA}?cim=${primer.slug}`
		);
		await page.getByRole('link', { name: `Veure ${primer.nom} al mapa` }).click();
		await expect(fullCim(page, primer.nom)).toBeVisible();
	});

	test('"Només pendents" treu els fets', async ({ page, context }) => {
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BERGA);
		const [primer, segon] = DES_DE_BERGA;
		await sembrar(page, [{ cimId: primer.id, data: '2024-05-01' }], A_PROP);
		await boto(page, 'Troba cims a prop').click();
		await expect(estatAProp(page)).toHaveText('Els 15 cims més propers a la teva posició.');
		expect((await nomsAProp(page))[0]).toBe(primer.nom);
		await expect(page.locator('main ol.llista li').first()).toContainText('Fet');

		await page.getByRole('checkbox', { name: 'Només pendents' }).check();
		await expect(estatAProp(page)).toHaveText(
			'Els 15 cims pendents més propers a la teva posició.'
		);
		const noms = await nomsAProp(page);
		expect(noms[0]).toBe(segon.nom);
		expect(noms).not.toContain(primer.nom);
		expect(noms).toEqual(DES_DE_BERGA.slice(1, 16).map((c) => c.nom));
	});

	test('permís denegat: missatge i cap llista', async ({ page }) => {
		await geoDenegada(page);
		await gotoHydrated(page, A_PROP);
		await boto(page, 'Troba cims a prop').click();
		await expect(page.getByRole('alert')).toContainText('No hi ha permís per saber on ets');
		await expect(page.locator('main ol.llista')).toHaveCount(0);
		await expect(boto(page, 'Troba cims a prop')).toBeVisible();
	});

	// BUG conegut: després d'una posició bona, si en actualitzar-la es denega, l'error surt però
	// la llista anterior continua com si fos vàlida (a-prop/+page.svelte: `localitzar` no buida
	// `posicio` en error).
	test('denegat després d’una posició bona: no es mostra la llista antiga', async ({
		page,
		context
	}) => {
		test.fail(true, 'Bug conegut: la llista anterior es manté amb la posició denegada');
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BERGA);
		await gotoHydrated(page, A_PROP);
		await boto(page, 'Troba cims a prop').click();
		await expect(page.locator('main ol.llista li')).toHaveCount(15);

		await page.evaluate(() => {
			navigator.geolocation.getCurrentPosition = (_ok, ko) =>
				ko?.({ code: 1, message: 'denied', PERMISSION_DENIED: 1 } as GeolocationPositionError);
		});
		await boto(page, 'Actualitza la posició').click();
		await expect(page.getByRole('alert')).toContainText('No hi ha permís per saber on ets');
		await expect(page.locator('main ol.llista')).toHaveCount(0, { timeout: 2000 });
	});
});

// ── 5. Accessibilitat, reflow i moviment ────────────────────────────────────

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe · ${colorScheme} · mapa i a prop`, () => {
		test.use({ colorScheme });

		test('/mapa amb la imatge estàtica (abans del mapa interactiu)', async ({ page }) => {
			await estalviDeDades(page);
			await gotoHydrated(page, MAPA);
			await expect(boto(page, 'Activa el mapa interactiu')).toBeVisible();
			await expectNoAxeViolations(page);
		});

		test('/mapa amb el mapa interactiu, el full del cim i la llista', async ({ page }) => {
			test.setTimeout(90_000);
			await gotoHydrated(page, MAPA);
			await esperaMapa(page);
			await expectNoAxeViolations(page);

			await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
			await expect(fullCim(page, PEDRAFORCA.nom)).toBeVisible();
			await expectNoAxeViolations(page);

			await gotoHydrated(page, `${MAPA}?vista=llista&zona=andorra`);
			await expect(llistaVisible(page).first()).toBeVisible();
			await expectNoAxeViolations(page);
		});

		test('/app/a-prop abans i després de buscar', async ({ page, context }) => {
			await context.grantPermissions(['geolocation']);
			await context.setGeolocation(BERGA);
			await gotoHydrated(page, A_PROP);
			await expectNoAxeViolations(page);
			await boto(page, 'Troba cims a prop').click();
			await expect(page.locator('main ol.llista li')).toHaveCount(15);
			await expectNoAxeViolations(page);
		});
	});
}

test.describe('Reflow a 320 px', () => {
	test.use({ viewport: { width: 320, height: 640 } });

	test('/mapa (mapa, full i llista) i /app/a-prop sense scroll horitzontal', async ({
		page,
		context
	}) => {
		test.setTimeout(90_000);
		await context.grantPermissions(['geolocation']);
		await context.setGeolocation(BERGA);

		await gotoHydrated(page, MAPA);
		await esperaMapa(page);
		expect.soft(await overflowX(page), 'mapa').toEqual({ px: 0, culprit: null });

		await boto(page, MES_FILTRES).click();
		expect.soft(await overflowX(page), 'mapa amb filtres oberts').toEqual({ px: 0, culprit: null });

		await gotoHydrated(page, `${MAPA}?cim=${CIM.pedraforca.slug}`);
		await expect(fullCim(page, PEDRAFORCA.nom)).toBeVisible();
		expect.soft(await overflowX(page), 'full del cim').toEqual({ px: 0, culprit: null });

		await gotoHydrated(page, `${MAPA}?vista=llista`);
		expect.soft(await overflowX(page), 'llista').toEqual({ px: 0, culprit: null });

		await gotoHydrated(page, A_PROP);
		await boto(page, 'Troba cims a prop').click();
		await expect(page.locator('main ol.llista li')).toHaveCount(15);
		expect.soft(await overflowX(page), 'a prop').toEqual({ px: 0, culprit: null });
	});
});

test.describe('Moviment reduït', () => {
	test.use({ reducedMotion: 'reduce' });

	test('el mapa interactiu apareix sense transició', async ({ page }) => {
		await gotoHydrated(page, MAPA);
		const durada = await page
			.locator('main .viu')
			.evaluate((el) => getComputedStyle(el).transitionDuration);
		// El reset global deixa 0,01 ms
		expect(durada.split(',').every((d) => parseFloat(d) <= 0.001)).toBe(true);
	});
});

test.describe('Moviment normal', () => {
	test.use({ reducedMotion: 'no-preference' });

	test('el mapa interactiu apareix amb una transició d’opacitat', async ({ page }) => {
		await gotoHydrated(page, MAPA);
		const durada = await page
			.locator('main .viu')
			.evaluate((el) => getComputedStyle(el).transitionDuration);
		expect(durada.split(',').some((d) => parseFloat(d) >= 0.1)).toBe(true);
	});
});

// ── 6. Landmarks (enllaços nous cap a /mapa) ────────────────────────────────

test.describe('Landmarks de navegació amb noms únics', () => {
	for (const url of [
		MAPA,
		ROUTES.es.map,
		'/ca',
		'/ca/cims',
		'/ca/cims-essencials',
		fitxaUrl(CIM.pedraforca.slug, 'ca')
	]) {
		test(`${url}: cap <nav> repetit amb el mateix nom`, async ({ page }) => {
			await gotoHydrated(page, url);
			const noms = await page
				.locator('nav')
				.evaluateAll((ns) =>
					ns.map((n) => n.getAttribute('aria-label') ?? n.getAttribute('aria-labelledby') ?? '')
				);
			expect(
				noms.filter((n) => n === ''),
				'nav sense nom'
			).toEqual([]);
			expect(noms.length, `noms: ${noms.join(' | ')}`).toBe(new Set(noms).size);
		});
	}

	test('/mapa: "Sobre aquest mapa" amb enllaços que funcionen', async ({ page, request }) => {
		await gotoHydrated(page, MAPA);
		await expect(page.getByRole('heading', { level: 2, name: 'Sobre aquest mapa' })).toBeVisible();
		const enllacos = page.getByRole('navigation', { name: 'Explora els cims' }).getByRole('link');
		await expect(enllacos).toHaveCount(4);
		for (const h of await hrefsAbsoluts(enllacos))
			expect((await request.get(h, { maxRedirects: 0 })).status(), h).toBe(200);
	});
});
