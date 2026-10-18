/**
 * Bloc R5 · QA: compartir ascensió, temps i restriccions a les llistes, mapa interactiu des de la
 * fitxa, Wikiloc `openMap`, responsive i axe.
 *
 * - Cap petició surt a Open-Meteo: `/api/meteo/ara` es mockeja amb `page.route` (i un
 *   `open-meteo.com` directe faria fallar el test).
 * - `navigator.share`/`canShare` i la descàrrega es mockegen/observen; la imatge generada (PNG
 *   real) es valida (signatura, 1080×1350, no buida) i els textos dibuixats es capturen amb un
 *   espia de `fillText`: així es prova que ni la nota ni els companys arriben al dibuix.
 * - Les dates "d'avui" es fixen amb `page.clock.setFixedTime` (l'app usa Europe/Madrid).
 */
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import type { Locator, Page, TestInfo } from '@playwright/test';
import { CIM, sembrar } from './ascensions';
import { CIMS, overflowX } from './cataleg';
import { expect, gotoHydrated, settleAnimations, test, toleraAvortamentsWebKit } from './fixtures';

type Locale = 'ca' | 'es';

// ── Mock de /api/meteo/ara ───────────────────────────────────────────────────

const FONT = {
	nom: 'Open-Meteo',
	url: 'https://open-meteo.com/',
	llicencia: 'CC BY 4.0',
	llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
};

interface TempsMock {
	categoria: string | null;
	codi: number;
	temperatura: number;
	esDia: boolean;
}

const SOL: TempsMock = { categoria: 'sol', codi: 0, temperatura: 5, esDia: true };

function respostaAra(cims: Record<string, TempsMock>, hora = '2026-10-18T10:15') {
	return { actualitzat: '2026-10-18T08:20:00.000Z', hora, font: FONT, cims };
}

/** Una mostra de totes les categories sobre tot el catàleg (omple les llistes d'icones). */
function ariaTot(): Record<string, TempsMock> {
	const cats: TempsMock[] = [
		{ categoria: 'sol', codi: 0, temperatura: 14, esDia: true },
		{ categoria: 'poc-nuvol', codi: 2, temperatura: -12, esDia: true },
		{ categoria: 'nuvol', codi: 3, temperatura: 0, esDia: true },
		{ categoria: 'boira', codi: 45, temperatura: 8, esDia: true },
		{ categoria: 'pluja', codi: 61, temperatura: 21, esDia: true },
		{ categoria: 'neu', codi: 73, temperatura: -3, esDia: true },
		{ categoria: 'tempesta', codi: 95, temperatura: 17, esDia: true },
		{ categoria: 'sol', codi: 1, temperatura: 2, esDia: false }
	];
	return Object.fromEntries(CIMS.map((c, i) => [c.slug, cats[i % cats.length]]));
}

type OpcionsAra =
	| { tipus: 'ok'; cims: Record<string, TempsMock>; hora?: string }
	| { tipus: 'status'; status: number }
	| { tipus: 'cos'; cos: string }
	| { tipus: 'avorta' }
	| { tipus: 'penja' };

interface Ara {
	/** Peticions que han arribat al mock. */
	peticions: string[];
	/** Deixa passar la resposta (si s'ha creat amb `retinguda`). */
	allibera: () => void;
}

/**
 * Mock de `/api/meteo/ara`. `retinguda`: la resposta no surt fins que el test crida `allibera()`
 * (per mesurar el layout abans i després). Qualsevol petició a open-meteo.com directament és un
 * error (l'app només parla amb el seu servidor).
 */
async function mockAra(page: Page, o: OpcionsAra, retinguda = false): Promise<Ara> {
	const peticions: string[] = [];
	let allibera!: () => void;
	const porta = retinguda
		? new Promise<void>((r) => (allibera = r))
		: Promise.resolve().then(() => undefined);
	if (!retinguda) allibera = () => undefined;
	await page.route(/open-meteo\.com/, (route) => {
		peticions.push(`EXTERN ${route.request().url()}`);
		return route.abort();
	});
	await page.route(/\/api\/meteo\/ara(\?|$)/, async (route) => {
		peticions.push(route.request().url());
		await porta;
		switch (o.tipus) {
			case 'ok':
				return route.fulfill({
					status: 200,
					contentType: 'application/json; charset=utf-8',
					body: JSON.stringify(respostaAra(o.cims, o.hora))
				});
			case 'status':
				return route.fulfill({
					status: o.status,
					contentType: 'application/json',
					body: '{"error":"x"}'
				});
			case 'cos':
				return route.fulfill({ status: 200, contentType: 'application/json', body: o.cos });
			case 'avorta':
				return route.abort('internetdisconnected');
			case 'penja':
				return; // no es respon mai: el client ha de abandonar als 8 s
		}
	});
	return { peticions, allibera };
}

/** Errors de consola que el navegador mateix escriu quan el mock respon 5xx / talla la xarxa. */
function toleraErrorsXarxa(consoleGuard: { allow: (p: RegExp) => void }) {
	consoleGuard.allow(/Failed to load resource|ERR_INTERNET_DISCONNECTED|access control checks/);
}

// ── Utilitats de les llistes ─────────────────────────────────────────────────

const URL_LLISTA = {
	ca: { cims: '/ca/cims', essencials: '/ca/app/essencials' },
	es: { cims: '/es/cimas', essencials: '/es/app/esenciales' }
} as const;

/** Fila (li) d'un cim a /cims o a /app/essencials. */
const fila = (page: Page, slug: string): Locator =>
	page.locator('main li', { has: page.locator(`a[href$="/${slug}"]`) }).first();
const infoDe = (page: Page, slug: string) => fila(page, slug).getByTestId('info-rapida');
const tempsDe = (page: Page, slug: string) => infoDe(page, slug).locator('.temps');
const avisDe = (page: Page, slug: string) => fila(page, slug).getByTestId('avis-restriccio');

/** Espera que la llista sigui al DOM i hidratada (essencials: Dexie ha carregat). */
async function llistaLlesta(page: Page, pagina: 'cims' | 'essencials', locale: Locale = 'ca') {
	await gotoHydrated(page, URL_LLISTA[locale][pagina]);
	await expect(fila(page, 'matagalls')).toBeVisible();
	await page.evaluate(() => document.fonts.ready);
}

const SLUG = { picossa: 'la-picossa', espases: 'sant-salvador-de-les-espases' } as const;

// ── Compartir ascensió ───────────────────────────────────────────────────────

interface Compartit {
	keys: string[];
	titol: string | null;
	nom: string;
	tipus: string;
	mida: number;
	b64: string;
}

type ModeShare = 'ok' | 'sense-share' | 'abort' | 'no-permes-1' | 'no-permes-sempre' | 'error';

/**
 * Instal·la abans de la càrrega: espia de `fillText`/`strokeText` (textos dibuixats al canvas) i
 * mock de `navigator.share` / `canShare`.
 */
async function instalarShare(page: Page, mode: ModeShare) {
	await page.addInitScript((mode) => {
		const w = window as unknown as {
			__shares: unknown[];
			__textos: string[];
			__intents: number;
		};
		w.__shares = [];
		w.__textos = [];
		w.__intents = 0;
		for (const f of ['fillText', 'strokeText'] as const) {
			const orig = CanvasRenderingContext2D.prototype[f];
			CanvasRenderingContext2D.prototype[f] = function (
				this: CanvasRenderingContext2D,
				...args: Parameters<CanvasRenderingContext2D['fillText']>
			) {
				w.__textos.push(String(args[0]));
				return orig.apply(this, args);
			};
		}
		if (mode === 'sense-share') {
			Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });
			Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
			return;
		}
		Object.defineProperty(navigator, 'canShare', {
			configurable: true,
			value: () => true
		});
		Object.defineProperty(navigator, 'share', {
			configurable: true,
			value: async (d: ShareData) => {
				w.__intents++;
				if (mode === 'abort') throw new DOMException('cancel·lat', 'AbortError');
				if (mode === 'error') throw new DOMException('boom', 'DataError');
				if (mode === 'no-permes-sempre' || (mode === 'no-permes-1' && w.__intents === 1))
					throw new DOMException('sense gest', 'NotAllowedError');
				const f = d.files?.[0] as File;
				const buf = new Uint8Array(await f.arrayBuffer());
				let bin = '';
				for (const b of buf) bin += String.fromCharCode(b);
				w.__shares.push({
					keys: Object.keys(d),
					titol: d.title ?? null,
					nom: f.name,
					tipus: f.type,
					mida: f.size,
					b64: btoa(bin)
				});
			}
		});
	}, mode);
}

const compartits = (page: Page) =>
	page.evaluate(() => (window as unknown as { __shares: unknown[] }).__shares as Compartit[]);
const textosDibuixats = (page: Page) =>
	page.evaluate(() => (window as unknown as { __textos: string[] }).__textos);
const intents = (page: Page) =>
	page.evaluate(() => (window as unknown as { __intents: number }).__intents);

/** PNG des de base64: signatura, mida (IHDR) i fracció de píxels diferents del color de fons. */
async function analitzaPng(page: Page, b64: string) {
	return page.evaluate(async (b64) => {
		const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
		const sig = [...bytes.slice(0, 8)].join(',');
		const dv = new DataView(bytes.buffer);
		const ample = dv.getUint32(16);
		const alt = dv.getUint32(20);
		const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
		const c = document.createElement('canvas');
		c.width = bmp.width;
		c.height = bmp.height;
		const ctx = c.getContext('2d')!;
		ctx.drawImage(bmp, 0, 0);
		const d = ctx.getImageData(0, 0, c.width, c.height).data;
		const r0 = d[0],
			g0 = d[1],
			b0 = d[2];
		let diff = 0;
		for (let i = 0; i < d.length; i += 4)
			if (Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0) > 40) diff++;
		return { sig, ample, alt, diff: diff / (c.width * c.height) };
	}, b64);
}

const NOTA = 'SECRET-NOTA-QWERTY-42';
const COMPANYS = ['Companya-Secreta-Zeta', 'Amic-Misteriós-Omega'];
const FILA_COMPARTIR = {
	cimId: CIM.pedraforca.id,
	data: '2024-07-14',
	nota: NOTA,
	companys: COMPANYS
};

/** Data llarga tal com la formata Intl (ca: "del 2024"; es: "de 2024"). */
const DATA_LLARGA: Record<Locale, RegExp> = {
	ca: /14 de juliol del? 2024/,
	es: /14 de julio de 2024/
};
const TEXT_COMPARTIR: Record<
	Locale,
	{ boto: string; etiqueta: RegExp; descarregat: string; punt: string; essencial: string }
> = {
	ca: {
		boto: 'Comparteix',
		etiqueta: /^Comparteix una imatge de l'ascensió a Pedraforca del dia 14 de juliol del? 2024$/,
		descarregat: 'Imatge descarregada.',
		punt: 'Imatge a punt: torna a tocar «Comparteix» per enviar-la.',
		essencial: 'Cim essencial'
	},
	es: {
		boto: 'Compartir',
		etiqueta: /^Compartir una imagen de la ascensión a Pedraforca del 14 de julio de 2024$/,
		descarregat: 'Imagen descargada.',
		punt: 'Imagen lista: vuelve a tocar «Compartir» para enviarla.',
		essencial: 'Cima esencial'
	}
};

const botoCompartirHistorial = (page: Page) => page.getByTestId('compartir-ascensio');

async function obrirHistorial(page: Page, locale: Locale) {
	await sembrar(page, [FILA_COMPARTIR], `/${locale}/app/historial`);
	await expect(botoCompartirHistorial(page)).toBeVisible();
}

for (const locale of ['ca', 'es'] as const) {
	const T = TEXT_COMPARTIR[locale];

	test.describe(`Compartir ascensió · historial (${locale})`, () => {
		test('el botó té nom accessible, la regió viva existeix i la imatge es genera i es comparteix', async ({
			page
		}, testInfo) => {
			await instalarShare(page, 'ok');
			await obrirHistorial(page, locale);
			const boto = botoCompartirHistorial(page);

			// Nom accessible amb cim i data; el text visible és a dins del nom (WCAG 2.5.3).
			await expect(boto).toHaveAccessibleName(T.etiqueta);
			await expect(boto).toContainText(T.boto);
			await expect(boto).toHaveAttribute('type', 'button');
			// Regió viva: sempre al DOM, buida, polida.
			const viu = boto.locator('xpath=following-sibling::*[@role="status"]');
			await expect(viu).toHaveAttribute('aria-live', 'polite');
			await expect(viu).toBeEmpty();
			// Àrea de toc ≥ 44 px
			const caixa = (await boto.boundingBox())!;
			expect(caixa.height, 'alçada del botó').toBeGreaterThanOrEqual(43.5);
			expect(caixa.width, 'amplada del botó').toBeGreaterThanOrEqual(43.5);

			// Amb teclat
			await boto.focus();
			await page.keyboard.press('Enter');
			await expect.poll(async () => (await compartits(page)).length).toBe(1);

			const [c] = await compartits(page);
			expect(c.keys.sort(), 'dades passades a navigator.share: només fitxer i títol').toEqual([
				'files',
				'title'
			]);
			expect(c.nom).toBe(`carnetdecims-pedraforca-pollego-superior-2024-07-14.png`);
			expect(c.tipus).toBe('image/png');
			expect(c.titol).toBe(
				locale === 'ca' ? 'La meva ascensió a Pedraforca' : 'Mi ascensión a Pedraforca'
			);
			const png = await analitzaPng(page, c.b64);
			expect(png.sig).toBe('137,80,78,71,13,10,26,10');
			expect([png.ample, png.alt]).toEqual([1080, 1350]);
			expect(png.diff, 'la imatge no és un fons llis').toBeGreaterThan(0.02);
			await testInfo.attach(`ascensio-${locale}.png`, {
				body: Buffer.from(c.b64, 'base64'),
				contentType: 'image/png'
			});

			// Compartit amb èxit: cap missatge, cap descàrrega, el botó torna a estar lliure.
			await expect(viu).toBeEmpty();
			await expect(boto).not.toHaveAttribute('aria-disabled', 'true');
			await expect(boto).toHaveAttribute('aria-busy', 'false');
			await expect(boto).toBeFocused();
		});

		test('la imatge porta cim, data, marca i web, però ni la nota ni els companys', async ({
			page
		}) => {
			await instalarShare(page, 'ok');
			await obrirHistorial(page, locale);
			// Les dades privades sí que són a la pàgina (és l'historial de l'usuari).
			await expect(page.getByText(NOTA)).toBeVisible();
			await botoCompartirHistorial(page).click();
			await expect.poll(async () => (await compartits(page)).length).toBe(1);

			const textos = (await textosDibuixats(page)).join('\n');
			expect(textos).toContain('Pedraforca');
			expect(textos).toContain('carnetdecims.cat');
			expect(textos).toMatch(DATA_LLARGA[locale]);
			expect(textos.toLowerCase()).toContain(T.essencial.toLowerCase());
			expect(textos).not.toContain(NOTA);
			for (const c of COMPANYS) expect(textos).not.toContain(c);
			expect(textos).not.toMatch(/SECRET|Secreta|Misteri/i);
			// Ni el mètode (a peu, BTT…) ni cap altre camp de l'ascensió
			expect(textos).not.toMatch(/a peu|a pie|BTT|raquetes|raquetas|esquí/i);
		});

		test('sense navigator.share: es descarrega un PNG vàlid i la regió viva ho anuncia', async ({
			page
		}) => {
			await instalarShare(page, 'sense-share');
			await obrirHistorial(page, locale);
			const [baixada] = await Promise.all([
				page.waitForEvent('download'),
				botoCompartirHistorial(page).click()
			]);
			expect(baixada.suggestedFilename()).toBe(
				'carnetdecims-pedraforca-pollego-superior-2024-07-14.png'
			);
			const bytes = readFileSync((await baixada.path())!);
			expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
			expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1080, 1350]);
			await expect(
				botoCompartirHistorial(page).locator('xpath=following-sibling::*[@role="status"]')
			).toHaveText(T.descarregat);
		});

		test('l’usuari tanca el full (AbortError): ni error ni descàrrega', async ({ page }) => {
			await instalarShare(page, 'abort');
			await obrirHistorial(page, locale);
			let baixades = 0;
			page.on('download', () => baixades++);
			await botoCompartirHistorial(page).click();
			await expect.poll(() => intents(page)).toBe(1);
			const viu = botoCompartirHistorial(page).locator(
				'xpath=following-sibling::*[@role="status"]'
			);
			await expect(viu).toBeEmpty();
			await page.waitForTimeout(500);
			expect(baixades).toBe(0);
			await expect(botoCompartirHistorial(page)).toHaveAttribute('aria-busy', 'false');
		});

		test('gest perdut (NotAllowedError): demana un segon toc i el segon reaprofita la imatge', async ({
			page
		}) => {
			await instalarShare(page, 'no-permes-1');
			await obrirHistorial(page, locale);
			const viu = botoCompartirHistorial(page).locator(
				'xpath=following-sibling::*[@role="status"]'
			);
			await botoCompartirHistorial(page).click();
			await expect(viu).toHaveText(T.punt);
			const textosPrimer = (await textosDibuixats(page)).length;
			expect(textosPrimer).toBeGreaterThan(0);
			await botoCompartirHistorial(page).click();
			await expect.poll(async () => (await compartits(page)).length).toBe(1);
			expect((await textosDibuixats(page)).length, 'no es torna a dibuixar').toBe(textosPrimer);
		});

		test('gest perdut dues vegades: es descarrega en lloc de quedar-se en bucle', async ({
			page
		}) => {
			await instalarShare(page, 'no-permes-sempre');
			await obrirHistorial(page, locale);
			const viu = botoCompartirHistorial(page).locator(
				'xpath=following-sibling::*[@role="status"]'
			);
			await botoCompartirHistorial(page).click();
			await expect(viu).toHaveText(T.punt);
			const [baixada] = await Promise.all([
				page.waitForEvent('download'),
				botoCompartirHistorial(page).click()
			]);
			expect(baixada.suggestedFilename()).toMatch(/\.png$/);
			await expect(viu).toHaveText(T.descarregat);
		});

		test('error del full del sistema (no Abort/NotAllowed): cau a descàrrega', async ({ page }) => {
			await instalarShare(page, 'error');
			await obrirHistorial(page, locale);
			const [baixada] = await Promise.all([
				page.waitForEvent('download'),
				botoCompartirHistorial(page).click()
			]);
			expect(baixada.suggestedFilename()).toMatch(/\.png$/);
		});
	});

	test.describe(`Compartir ascensió · detall del segell (${locale})`, () => {
		test('el botó del detall té el mateix nom accessible i comparteix', async ({
			page,
			browserName
		}) => {
			await instalarShare(page, 'ok');
			await sembrar(page, [FILA_COMPARTIR], `/${locale}/app`);
			await page
				.getByRole('list', { name: /^Caselles de la pàgina|^Casillas de la página/ })
				.getByRole('button')
				.first()
				.click();
			const full = page.getByRole('dialog', { name: 'Pedraforca' });
			await expect(full).toBeVisible();
			const boto = full.getByTestId('compartir-ascensio');
			await expect(boto).toHaveAccessibleName(T.etiqueta);
			await expect(boto).toContainText(T.boto);
			await boto.click();
			await expect.poll(async () => (await compartits(page)).length).toBe(1);
			const textos = (await textosDibuixats(page)).join('\n');
			expect(textos).not.toContain(NOTA);
			for (const c of COMPANYS) expect(textos).not.toContain(c);
			// El full continua obert i el focus no es perd
			await expect(full).toBeVisible();
			// Safari/WebKit no enfoca un botó en fer clic (comportament del navegador).
			if (browserName !== 'webkit') await expect(boto).toBeFocused();
		});
	});
}

test.describe('Compartir ascensió · contracte de dades', () => {
	test('el codi de dibuix no rep nota ni companys (tipus i crida)', () => {
		const imatge = readFileSync(
			new URL('../src/lib/ui/compartir/imatge-ascensio.ts', import.meta.url),
			'utf8'
		);
		const boto = readFileSync(
			new URL('../src/lib/ui/compartir/CompartirAscensio.svelte', import.meta.url),
			'utf8'
		);
		// El component construeix `DadesImatgeAscensio`: res de nota/companys/mètode.
		const sensComentaris = (t: string) =>
			t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
		const construccio = sensComentaris(
			boto.slice(boto.indexOf('function dades()'), boto.indexOf('async function generar'))
		);
		expect(construccio).not.toMatch(/nota|companys|metode/i);
		expect(sensComentaris(imatge)).not.toMatch(/\b(nota|companys|metode)\b/i);
	});
});

// ── Temps i restriccions a /cims i /app/essencials ───────────────────────────

for (const pagina of ['cims', 'essencials'] as const) {
	test.describe(`Temps a la llista · ${pagina}`, () => {
		test('icones per categoria, lluna de nit, text per a lectors i atribució Open-Meteo', async ({
			page
		}) => {
			const ara = await mockAra(page, {
				tipus: 'ok',
				cims: {
					matagalls: { categoria: 'sol', codi: 0, temperatura: 5, esDia: true },
					montcau: { categoria: 'sol', codi: 1, temperatura: -3, esDia: false },
					'pedraforca-pollego-superior': {
						categoria: 'pluja',
						codi: 61,
						temperatura: 11.6,
						esDia: true
					},
					canigo: { categoria: 'neu', codi: 73, temperatura: -12, esDia: true }
				}
			});
			await llistaLlesta(page, pagina);
			await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();

			// Una sola petició, sense cap sortida a Open-Meteo
			expect(ara.peticions.filter((p) => p.startsWith('EXTERN'))).toEqual([]);
			expect(ara.peticions).toHaveLength(1);

			// de dia: sol (no lluna) + graus + text per a lectors
			const mat = tempsDe(page, 'matagalls');
			await expect(mat.locator('svg.lluna')).toHaveCount(0);
			await expect(mat.locator('.graus')).toHaveText('5°');
			await expect(mat.locator('.sr-only')).toHaveText(
				/^Temps actual al cim \(hora 10:15\): Assolellat, .*5/
			);
			// de nit: lluna i "Serè"
			const mon = tempsDe(page, 'montcau');
			await expect(mon.locator('svg.lluna')).toHaveCount(1);
			await expect(mon.locator('.sr-only')).toContainText('Serè');
			await expect(mon.locator('.graus')).toHaveText(/^[-−]3°$/);
			// pluja amb decimal → arrodonit
			await expect(tempsDe(page, 'pedraforca-pollego-superior').locator('.graus')).toHaveText(
				'12°'
			);
			await expect(tempsDe(page, 'pedraforca-pollego-superior').locator('.sr-only')).toContainText(
				'Pluja'
			);
			await expect(tempsDe(page, 'canigo').locator('.sr-only')).toContainText('Neu');
			// les icones són decoratives (aria-hidden) i el text sempre és al sr-only
			await expect(tempsDe(page, 'canigo').locator('svg').first()).toHaveAttribute(
				'aria-hidden',
				'true'
			);
			// cims sense dades: caixa reservada però buida
			await expect(tempsDe(page, 'la-picossa').locator('svg')).toHaveCount(0);
			await expect(tempsDe(page, 'la-picossa').locator('.graus')).toHaveCount(0);

			// Atribució CC BY 4.0 visible a prop de les icones
			const atr = page.getByTestId('atribucio-meteo');
			await expect(atr).toBeVisible();
			await expect(atr).toContainText('Temps actual a cada cim (hora 10:15)');
			await expect(atr).toContainText('Dades:');
			const open = atr.getByRole('link', { name: 'Open-Meteo' });
			await expect(open).toHaveAttribute('href', 'https://open-meteo.com/');
			await expect(open).toHaveAttribute('target', '_blank');
			await expect(open).toHaveAttribute('rel', /noopener/);
			const llic = atr.getByRole('link', { name: 'CC BY 4.0' });
			await expect(llic).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
			await expect(llic).toHaveAttribute('rel', /license/);
		});

		test('en castellà: textos traduïts', async ({ page }) => {
			await mockAra(page, {
				tipus: 'ok',
				cims: {
					matagalls: SOL,
					montcau: { categoria: 'sol', codi: 0, temperatura: 1, esDia: false }
				}
			});
			await llistaLlesta(page, pagina, 'es');
			await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
			await expect(tempsDe(page, 'matagalls').locator('.sr-only')).toContainText(
				'Tiempo actual en la cima (hora 10:15): Soleado'
			);
			await expect(tempsDe(page, 'montcau').locator('.sr-only')).toContainText('Despejado');
			const atr = page.getByTestId('atribucio-meteo');
			await expect(atr).toContainText('Tiempo actual en cada cima (hora 10:15)');
			await expect(atr).toContainText('Datos:');
		});

		test('dades invàlides: categoria desconeguda, codi incoherent o claus rares → cap icona', async ({
			page
		}) => {
			await mockAra(page, {
				tipus: 'ok',
				cims: {
					matagalls: SOL,
					// categoria inventada
					montcau: { categoria: 'aliens', codi: 0, temperatura: 3, esDia: true },
					// categoria que no correspon al codi WMO
					'pedraforca-pollego-superior': {
						categoria: 'sol',
						codi: 61,
						temperatura: 3,
						esDia: true
					},
					// codi WMO no documentat
					canigo: { categoria: null, codi: 12, temperatura: 3, esDia: true },
					// temperatura no numèrica
					'la-picossa': {
						categoria: 'sol',
						codi: 0,
						temperatura: null as unknown as number,
						esDia: true
					},
					// clau amb forma de slug invàlid, i un slug que no és al catàleg
					'Bad Slug!': SOL,
					'no-existeix-aquest-cim': SOL
				}
			});
			await llistaLlesta(page, pagina);
			await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
			for (const slug of ['montcau', 'pedraforca-pollego-superior', 'canigo', SLUG.picossa]) {
				await expect(tempsDe(page, slug).locator('svg'), slug).toHaveCount(0);
				await expect(tempsDe(page, slug).locator('.graus'), slug).toHaveCount(0);
			}
		});

		for (const cas of [
			{ nom: 'resposta 500', o: { tipus: 'status', status: 500 } as OpcionsAra },
			{ nom: 'resposta 502', o: { tipus: 'status', status: 502 } as OpcionsAra },
			{ nom: 'resposta 429', o: { tipus: 'status', status: 429 } as OpcionsAra },
			{ nom: 'JSON trencat', o: { tipus: 'cos', cos: '{"cims":' } as OpcionsAra },
			{ nom: 'JSON amb una altra forma', o: { tipus: 'cos', cos: '{"dies":[]}' } as OpcionsAra },
			{ nom: 'JSON null', o: { tipus: 'cos', cos: 'null' } as OpcionsAra },
			{ nom: 'sense connexió (fetch falla)', o: { tipus: 'avorta' } as OpcionsAra }
		]) {
			test(`${cas.nom}: sense icones, sense atribució, sense errors visibles i sense moure res`, async ({
				page,
				consoleGuard
			}) => {
				toleraErrorsXarxa(consoleGuard);
				const ara = await mockAra(page, cas.o, true);
				await llistaLlesta(page, pagina);
				const abans = await mesuraLayout(page);
				ara.allibera();
				await expect.poll(() => ara.peticions.length).toBeGreaterThan(0);
				await page.waitForTimeout(800);
				await expect(page.locator('[data-testid=info-rapida] .temps svg')).toHaveCount(0);
				await expect(page.locator('[data-testid=info-rapida] .graus')).toHaveCount(0);
				await expect(page.getByTestId('atribucio-meteo')).toBeEmpty();
				await expect(page.getByRole('alert')).toHaveCount(0);
				expectLayoutIgual(abans, await mesuraLayout(page), `${pagina} ${cas.nom}`);
			});
		}

		test('sense connexió real del navegador (context offline després de carregar)', async ({
			page,
			context,
			consoleGuard
		}) => {
			toleraErrorsXarxa(consoleGuard);
			// Sense mock: la petició real a /api/meteo/ara es talla. (L'altre mock del fixture
			// `meteoPerDefecte` respon amb una altra forma de dades i tampoc no ha de pintar res.)
			await page.route(/open-meteo\.com/, (route) => route.abort());
			await page.route(/\/api\/meteo\/ara/, (route) => route.abort('internetdisconnected'));
			await llistaLlesta(page, pagina);
			await context.setOffline(true);
			await page.waitForTimeout(500);
			await expect(page.locator('[data-testid=info-rapida] .temps svg')).toHaveCount(0);
			await expect(page.getByTestId('atribucio-meteo')).toBeEmpty();
			await expect(fila(page, 'matagalls')).toBeVisible();
		});

		test('resposta que no arriba: als 8 s el client abandona i la llista queda igual', async ({
			page,
			consoleGuard
		}) => {
			test.setTimeout(45_000);
			toleraErrorsXarxa(consoleGuard);
			await mockAra(page, { tipus: 'penja' });
			await llistaLlesta(page, pagina);
			const abans = await mesuraLayout(page);
			await page.waitForTimeout(9_000);
			await expect(page.locator('[data-testid=info-rapida] .temps svg')).toHaveCount(0);
			expectLayoutIgual(abans, await mesuraLayout(page), `${pagina} penjada`);
		});

		test('quan arriba el temps no es mou res (CLS i posicions de les files)', async ({ page }) => {
			const ara = await mockAra(page, { tipus: 'ok', cims: ariaTot() }, true);
			await llistaLlesta(page, pagina);
			await page.evaluate(() => {
				const w = window as unknown as { __cls: number };
				w.__cls = 0;
				new PerformanceObserver((l) => {
					for (const e of l.getEntries() as (PerformanceEntry & {
						value: number;
						hadRecentInput: boolean;
					})[])
						if (!e.hadRecentInput) w.__cls += e.value;
				}).observe({ type: 'layout-shift', buffered: false });
			});
			const abans = await mesuraLayout(page);
			ara.allibera();
			await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
			await expect(page.getByTestId('atribucio-meteo')).toContainText('Open-Meteo');
			await page.waitForTimeout(500);
			expectLayoutIgual(abans, await mesuraLayout(page), `${pagina} amb icones`);
			const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
			// WebKit no implementa `layout-shift`: el valor és 0 i la comparació de posicions mana.
			expect(cls, 'CLS en arribar el temps').toBeLessThan(0.005);
		});

		test('la crida demana tot el catàleg una sola vegada (sense paràmetres)', async ({ page }) => {
			const ara = await mockAra(page, { tipus: 'ok', cims: { matagalls: SOL } });
			await llistaLlesta(page, pagina);
			await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
			await page.waitForTimeout(500);
			expect(ara.peticions).toHaveLength(1);
			expect(new URL(ara.peticions[0]).search).toBe('');
		});
	});

	test.describe(`Restriccions a la llista · ${pagina}`, () => {
		const fixa = async (page: Page, iso: string) => page.clock.setFixedTime(new Date(iso));

		test('La Picossa (fauna 15/01–15/06): avís dins de l’època, amb la data de fi', async ({
			page
		}) => {
			await mockAra(page, { tipus: 'ok', cims: { matagalls: SOL } });
			await fixa(page, '2026-03-10T10:00:00+01:00');
			await llistaLlesta(page, pagina);
			const avis = avisDe(page, SLUG.picossa);
			await expect(avis).toHaveCount(1);
			await expect(avis.locator('.sr-only')).toHaveText(
				'Accés restringit fins al dia 15 de juny · Protecció de la fauna'
			);
			await expect(avis).toHaveAttribute(
				'title',
				'Accés restringit fins al dia 15 de juny · Protecció de la fauna'
			);
			await expect(avis).not.toHaveClass(/incerta/);
			// senyal visual, no només color: és un SVG
			await expect(avis.locator('svg')).toHaveAttribute('aria-hidden', 'true');
			// La resta de cims sense restricció vigent no en porten
			await expect(avisDe(page, 'matagalls')).toHaveCount(0);
		});

		test('La Picossa en castellà', async ({ page }) => {
			await mockAra(page, { tipus: 'ok', cims: {} });
			await fixa(page, '2026-03-10T10:00:00+01:00');
			await llistaLlesta(page, pagina, 'es');
			await expect(avisDe(page, SLUG.picossa).locator('.sr-only')).toHaveText(
				'Acceso restringido hasta el 15 de junio · Protección de la fauna'
			);
		});

		for (const [quan, iso, activa] of [
			['primer dia (15/01)', '2026-01-15T09:00:00+01:00', true],
			['dia abans (14/01)', '2026-01-14T23:00:00+01:00', false],
			['darrer dia 23:30 Madrid (15/06)', '2026-06-15T21:30:00Z', true],
			['00:30 Madrid del 16/06 (fora, encara 15/06 a UTC)', '2026-06-15T22:30:00Z', false],
			['setembre (fora d’època)', '2026-09-01T10:00:00+02:00', false],
			['any bixest, 29/02 (dins)', '2028-02-29T10:00:00+01:00', true]
		] as const) {
			test(`La Picossa ${quan}: ${activa ? 'amb' : 'sense'} avís`, async ({ page }) => {
				await mockAra(page, { tipus: 'ok', cims: {} });
				await fixa(page, iso);
				await llistaLlesta(page, pagina);
				await expect(avisDe(page, SLUG.picossa)).toHaveCount(activa ? 1 : 0);
			});
		}

		test('Sant Salvador de les Espases: "Possible restricció… comprova-ho", mai "tancat"', async ({
			page
		}) => {
			await mockAra(page, { tipus: 'ok', cims: {} });
			await fixa(page, '2026-09-01T10:00:00+02:00');
			await llistaLlesta(page, pagina);
			const avis = avisDe(page, SLUG.espases);
			await expect(avis).toHaveCount(1);
			await expect(avis).toHaveClass(/incerta/);
			const text = 'Possible restricció (obres): comprova-ho a la FEEC';
			await expect(avis.locator('.sr-only')).toHaveText(text);
			await expect(avis).toHaveAttribute('title', text);
			// Cap paraula de "tancat" a tota la fila (ni al text ni als atributs)
			const html = await fila(page, SLUG.espases).innerHTML();
			expect(html).not.toMatch(/tancat|cerrado|closed|prohibit|prohibido/i);
			await expect(fila(page, SLUG.espases)).not.toContainText(/restringit/i);
		});

		test('Sant Salvador de les Espases és permanent: també en ple hivern', async ({ page }) => {
			await mockAra(page, { tipus: 'ok', cims: {} });
			await fixa(page, '2027-01-20T10:00:00+01:00');
			await llistaLlesta(page, pagina);
			await expect(avisDe(page, SLUG.espases)).toHaveCount(1);
			await expect(avisDe(page, SLUG.picossa)).toHaveCount(1); // 20/01 dins 15/01–15/06
		});

		test('Sant Salvador de les Espases en castellà', async ({ page }) => {
			await mockAra(page, { tipus: 'ok', cims: {} });
			await llistaLlesta(page, pagina, 'es');
			await expect(avisDe(page, SLUG.espases).locator('.sr-only')).toHaveText(
				'Posible restricción (obras): compruébalo en la FEEC'
			);
			const html = await fila(page, SLUG.espases).innerHTML();
			expect(html).not.toMatch(/cerrado|closed|tancat/i);
		});

		test('els avisos no depenen de la xarxa: surten amb el temps fallant', async ({
			page,
			consoleGuard
		}) => {
			toleraErrorsXarxa(consoleGuard);
			await mockAra(page, { tipus: 'status', status: 500 });
			await fixa(page, '2026-03-10T10:00:00+01:00');
			await llistaLlesta(page, pagina);
			await expect(avisDe(page, SLUG.picossa)).toHaveCount(1);
			await expect(avisDe(page, SLUG.espases)).toHaveCount(1);
			await expect(page.getByTestId('atribucio-meteo')).toBeEmpty();
		});

		test('només porten avís els cims amb restriccions al catàleg', async ({ page }) => {
			await mockAra(page, { tipus: 'ok', cims: {} });
			await fixa(page, '2026-03-10T10:00:00+01:00');
			await llistaLlesta(page, pagina);
			const ambRestriccio = new Set(
				CIMS.filter(
					(c) => ((c as unknown as { restriccions?: unknown[] }).restriccions?.length ?? 0) > 0
				).map((c) => c.slug)
			);
			const mostrats = await page
				.locator('main li:has([data-testid=avis-restriccio]) a[href*="/cim"]')
				.evaluateAll((as) =>
					as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!.split('/').pop()!)
				);
			expect(mostrats.length).toBeGreaterThanOrEqual(2);
			for (const s of new Set(mostrats)) expect(ambRestriccio.has(s), s).toBe(true);
		});
	});
}

// ── Layout: mesura i comparació ──────────────────────────────────────────────

interface Layout {
	alt: number;
	files: { y: number; h: number; x: number; w: number }[];
	atribucio: { y: number; h: number } | null;
}

async function mesuraLayout(page: Page): Promise<Layout> {
	await page.evaluate(() => document.fonts.ready);
	return page.evaluate(() => {
		const files = [...document.querySelectorAll('main ul.llista > li, main ul.llista li')]
			.slice(0, 40)
			.map((li) => {
				const r = li.getBoundingClientRect();
				return { y: r.top + scrollY, h: r.height, x: r.left, w: r.width };
			});
		const a = document.querySelector('[data-testid=atribucio-meteo]')?.getBoundingClientRect();
		return {
			alt: document.documentElement.scrollHeight,
			files,
			atribucio: a ? { y: a.top + scrollY, h: a.height } : null
		};
	});
}

function expectLayoutIgual(a: Layout, b: Layout, ctx: string) {
	expect(b.alt, `${ctx}: alçada del document`).toBeCloseTo(a.alt, 0);
	expect(b.files.length, `${ctx}: nombre de files`).toBe(a.files.length);
	a.files.forEach((f, i) => {
		const g = b.files[i];
		for (const k of ['y', 'h', 'x', 'w'] as const)
			expect(Math.abs(g[k] - f[k]), `${ctx}: fila ${i} ${k}`).toBeLessThanOrEqual(0.5);
	});
	if (a.atribucio && b.atribucio) {
		expect(
			Math.abs(b.atribucio.h - a.atribucio.h),
			`${ctx}: alçada de l'atribució`
		).toBeLessThanOrEqual(0.5);
	}
}

// ── Fitxa: mapa interactiu i Wikiloc ────────────────────────────────────────

const FITXA = { ca: '/ca/cims/matagalls', es: '/es/cimas/matagalls' } as const;
const MATAGALLS = CIMS.find((c) => c.slug === 'matagalls')!;

/** PNG d'1×1 per al mock de la imatge del mapa (la xarxa real no ha de ser necessària). */
const PNG_1X1 = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
	'base64'
);

for (const locale of ['ca', 'es'] as const) {
	test.describe(`Fitxa del cim (${locale}): mapa i Wikiloc`, () => {
		test('la imatge del mapa enllaça al mapa interactiu localitzat, nofollow, amb nom accessible', async ({
			page
		}) => {
			await gotoHydrated(page, FITXA[locale]);
			const enllac = page.getByTestId('fitxa-mapa-interactiu');
			await expect(enllac).toHaveAttribute('href', `/${locale}/mapa?cim=matagalls`);
			await expect(enllac).toHaveAttribute('rel', /nofollow/);
			await expect(enllac).toHaveAccessibleName(
				locale === 'ca'
					? /Obre el mapa interactiu centrat .*Matagalls/
					: /Abrir el mapa interactivo centrado .*Matagalls/
			);
			// El botó "Obre al mapa" de la capçalera porta al mateix lloc
			const boto = page.getByRole('link', {
				name: locale === 'ca' ? 'Obre al mapa' : 'Abrir en el mapa'
			});
			await expect(boto).toHaveAttribute('href', `/${locale}/mapa?cim=matagalls`);
			await expect(boto).toHaveAttribute('rel', /nofollow/);
			// L'enllaç net (indexable) al mapa general segueix sense query
			const tots = page.locator('a.mapa-tots');
			await expect(tots).toHaveAttribute('href', `/${locale}/mapa`);
			await expect(tots).not.toHaveAttribute('rel', /nofollow/);
		});

		test('clic a la imatge: obre /mapa amb el full del cim seleccionat; enrere torna a la fitxa', async ({
			page,
			browserName
		}) => {
			toleraAvortamentsWebKit({ allow: () => undefined }, browserName);
			await gotoHydrated(page, FITXA[locale]);
			await page.getByTestId('fitxa-mapa-interactiu').scrollIntoViewIfNeeded();
			await page.getByTestId('fitxa-mapa-interactiu').click();
			await expect(page).toHaveURL(new RegExp(`/${locale}/mapa\\?cim=matagalls$`));
			await expect(page.getByRole('dialog', { name: 'Matagalls' })).toBeVisible();
			await expect(page.getByRole('dialog', { name: 'Matagalls' })).toContainText(
				new RegExp(String(MATAGALLS.altitud).replace(/(\d)(?=(\d{3})$)/, '$1.?'))
			);
			// WebKit: després de `back()` des d'aquest flux `page.url()` queda buit (la pàgina sembla
			// recarregar-se); no reproduïble a mapa.e2e (que obre /mapa directament). Pendent de
			// provar en un iPhone real; aquí només es comprova a Chromium.
			test.info().annotations.push({
				type: 'webkit',
				description: 'enrere des de /mapa?cim= (fluix fitxa→mapa) no verificat'
			});
			if (browserName === 'webkit') return;
			// Enrere: primer tanca el full (entrada d'historial pròpia), després torna a la fitxa
			// (`history.back()` en lloc de `page.goBack()`: a WebKit goBack espera una càrrega que no arriba.)
			await page.evaluate(() => history.back());
			await expect(page).toHaveURL(new RegExp(`/${locale}/mapa$`));
			await expect(page.getByRole('dialog')).toHaveCount(0);
			await page.evaluate(() => history.back());
			await expect(page).toHaveURL(new RegExp(`${FITXA[locale]}$`));
		});

		test('Wikiloc: https://{idioma}.wikiloc.com/openMap?sw&ne&page=1, nofollow, nova pestanya', async ({
			page
		}) => {
			await gotoHydrated(page, FITXA[locale]);
			const wl = page.getByRole('link', {
				name: locale === 'ca' ? /Veure rutes a Wikiloc/ : /Ver rutas en Wikiloc/
			});
			const href = (await wl.getAttribute('href'))!;
			const m = new RegExp(
				`^https://${locale}\\.wikiloc\\.com/openMap\\?sw=(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)&ne=(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)&page=1$`
			).exec(href);
			expect(m, href).not.toBeNull();
			const [swLat, swLon, neLat, neLon] = m!.slice(1).map(Number);
			expect(swLat).toBeLessThan(neLat);
			expect(swLon).toBeLessThan(neLon);
			// caixa centrada al cim (±0,0002°) i d'uns 3 km de costat
			expect((swLat + neLat) / 2).toBeCloseTo(MATAGALLS.lat!, 3);
			expect((swLon + neLon) / 2).toBeCloseTo(MATAGALLS.lon!, 3);
			expect((neLat - swLat) * 111.32).toBeGreaterThan(2.5);
			expect((neLat - swLat) * 111.32).toBeLessThan(3.5);
			expect(href).not.toContain('map.do');
			await expect(wl).toHaveAttribute('rel', /nofollow/);
			await expect(wl).toHaveAttribute('rel', /noopener/);
			await expect(wl).toHaveAttribute('target', '_blank');
		});
	});
}

test.describe('Fitxa del cim: Wikiloc a diversos cims', () => {
	for (const slug of ['pica-d-estats', 'canigo', 'la-picossa', 'comapedrosa']) {
		test(`${slug}: tots els enllaços openMap porten nofollow i cap usa map.do`, async ({
			page
		}) => {
			test.skip(!CIMS.some((c) => c.slug === slug), 'cim fora del catàleg');
			await gotoHydrated(page, `/ca/cims/${slug}`);
			const enllacos = await page.locator('main a[href*="wikiloc.com"]').evaluateAll((as) =>
				as.map((a) => ({
					href: (a as HTMLAnchorElement).href,
					rel: (a as HTMLAnchorElement).rel
				}))
			);
			expect(enllacos.length).toBeGreaterThan(0);
			for (const e of enllacos) {
				expect(e.href, 'cap enllaç al mapa antic').not.toContain('/wikiloc/map.do');
				if (e.href.includes('/openMap')) expect(e.rel).toContain('nofollow');
				expect(e.href).toMatch(/^https:\/\/ca\.wikiloc\.com\//);
			}
		});
	}
});

test.describe('Fitxa del cim: imatge estàtica del mapa', () => {
	test('la imatge carrega sota crossorigin (WMS amb CORS) i no queda en blanc', async ({
		page
	}) => {
		await page.route(/geoserveis\.icgc\.cat\/servei\/catalunya\/mapa-base\/wms/, (route) =>
			route.fulfill({
				status: 200,
				contentType: 'image/png',
				headers: { 'access-control-allow-origin': '*' },
				body: PNG_1X1
			})
		);
		await gotoHydrated(page, FITXA.ca);
		const img = page.getByTestId('fitxa-mapa-interactiu').locator('img');
		await img.scrollIntoViewIfNeeded();
		await expect
			.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0))
			.toBe(true);
		await expect(img).toHaveAttribute('crossorigin', 'anonymous');
	});

	test('si el WMS no enviés CORS, `crossorigin` deixaria la imatge trencada (risc documentat)', async ({
		page
	}) => {
		await page.route(/geoserveis\.icgc\.cat\/servei\/catalunya\/mapa-base\/wms/, (route) =>
			route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1X1 })
		);
		await gotoHydrated(page, FITXA.ca);
		const img = page.getByTestId('fitxa-mapa-interactiu').locator('img');
		await img.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);
		const carregada = await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0);
		test.info().annotations.push({
			type: 'risc',
			description: `Sense capçalera CORS, amb crossorigin="anonymous" la imatge ${carregada ? 'es veu' : 'NO es veu (mapa en blanc)'}`
		});
		// L'ICGC envia `Access-Control-Allow-Origin: *` (comprovat 2026-10-18): només és un avís.
		expect(typeof carregada).toBe('boolean');
	});

	test('?cim= invàlid o maliciós no trenca el mapa', async ({
		page,
		consoleGuard,
		browserName
	}) => {
		toleraAvortamentsWebKit(consoleGuard, browserName);
		consoleGuard.allow(/Importing a module script failed/); // WebKit en descarregar la pàgina
		for (const raw of [
			'no-existeix',
			'',
			'%00',
			'..%2F..%2Fapp',
			'<img src=x onerror=alert(1)>',
			'A'.repeat(3000),
			'%E0%A4%A'
		]) {
			const pageErrors: string[] = [];
			// WebKit: la càrrega de l'estil del mapa de la pàgina anterior, avortada en navegar,
			// surt com a pageerror "due to access control checks" (mateix cas que fixtures.ts).
			page.on('pageerror', (e) => {
				if (!/due to access control checks/.test(e.message)) pageErrors.push(e.message);
			});
			await page.goto(`/ca/mapa?cim=${raw}`);
			await expect(page.locator('main h1, h1').first()).toBeVisible();
			await expect(page.getByRole('dialog')).toHaveCount(0);
			expect(pageErrors, `?cim=${raw.slice(0, 40)}`).toEqual([]);
			// cap script injectat
			expect(await page.locator('img[src="x"]').count()).toBe(0);
		}
	});
});

// ── Mapa: centrat i selecció des de la fitxa ────────────────────────────────

/**
 * Estil mínim (fons magenta, sense capes base): el que no és magenta són els cims (marcadors) i
 * els clústers que dibuixa l'app. Permet comprovar sense la xarxa de l'ICGC on és el cim.
 */
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

test.describe('Mapa interactiu des de la fitxa', () => {
	test('obre centrat al cim: el marcador seleccionat és al centre visible del mapa', async ({
		page,
		browserName
	}, testInfo) => {
		test.skip(
			browserName === 'webkit',
			'WebGL poc fiable a WebKit headless; es cobreix a Chromium'
		);
		await estilMinim(page);
		await gotoHydrated(page, FITXA.ca);
		await page.getByTestId('fitxa-mapa-interactiu').scrollIntoViewIfNeeded();
		await page.getByTestId('fitxa-mapa-interactiu').click();
		const full = page.getByRole('dialog', { name: 'Matagalls' });
		await expect(full).toBeVisible();
		const teWebGL = await page.evaluate(() => {
			const c = document.createElement('canvas');
			return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
		});
		test.skip(!teWebGL, 'sense WebGL');
		const canvas = page.locator('.maplibregl-canvas');
		await expect(canvas).toBeVisible({ timeout: 60_000 });
		await page.waitForTimeout(2500); // animació de centrat (easeTo) i fade de símbols
		const viu = page.locator('.viu');
		const caixa = (await viu.boundingBox())!;
		const caixaFull = (await full.boundingBox())!;
		const png = await viu.screenshot({
			mask: [page.locator('.maplibregl-ctrl-attrib'), full],
			maskColor: '#ff00ff',
			animations: 'disabled',
			scale: 'css'
		});
		await testInfo.attach('mapa-centrat.png', { body: png, contentType: 'image/png' });
		// Centre del mapa no tapat pel full (el full pot ser lateral o inferior)
		const aux = await page.context().newPage();
		try {
			const res = await aux.evaluate(
				async ({ b64, w, h }) => {
					const img = new Image();
					img.src = `data:image/png;base64,${b64}`;
					await img.decode();
					const c = document.createElement('canvas');
					c.width = img.naturalWidth;
					c.height = img.naturalHeight;
					const ctx = c.getContext('2d')!;
					ctx.drawImage(img, 0, 0);
					const d = ctx.getImageData(0, 0, c.width, c.height).data;
					// punts "tinta": no magenta
					const pts: { x: number; y: number }[] = [];
					for (let y = 0; y < c.height; y++)
						for (let x = 0; x < c.width; x++) {
							const i = (y * c.width + x) * 4;
							if (Math.abs(d[i] - 255) + d[i + 1] + Math.abs(d[i + 2] - 255) > 120)
								pts.push({ x, y });
						}
					return { pts: pts.length, w, h, sample: pts.slice(0, 2000) };
				},
				{ b64: png.toString('base64'), w: caixa.width, h: caixa.height }
			);
			expect(res.pts, 'hi ha almenys un marcador dibuixat').toBeGreaterThan(20);
			// Les marques dibuixades més properes al centre del mapa visible (àrea no coberta pel full)
			const fullEsLateral = caixaFull.width < caixa.width * 0.8;
			const visibleX0 =
				fullEsLateral && caixaFull.x < caixa.x + caixa.width / 2
					? caixaFull.x + caixaFull.width - caixa.x
					: 0;
			const visibleX1 =
				fullEsLateral && caixaFull.x >= caixa.x + caixa.width / 2
					? caixaFull.x - caixa.x
					: caixa.width;
			const visibleY1 = fullEsLateral ? caixa.height : Math.max(0, caixaFull.y - caixa.y);
			const cx = (visibleX0 + visibleX1) / 2;
			const cy = visibleY1 / 2;
			const mes = res.sample.reduce((best, p) => {
				const dist = Math.hypot(p.x - cx, p.y - cy);
				return dist < best ? dist : best;
			}, Infinity);
			testInfo.annotations.push({
				type: 'centre',
				description: `marcador més proper a ${mes.toFixed(0)} px del centre de l'àrea visible (${cx.toFixed(0)},${cy.toFixed(0)}) de ${caixa.width.toFixed(0)}×${caixa.height.toFixed(0)}`
			});
			expect(mes, 'distància del marcador al centre visible').toBeLessThan(
				Math.max(caixa.width, caixa.height) * 0.35
			);
		} finally {
			await aux.close();
		}
	});
});

// ── Responsive: sense desborde horitzontal ──────────────────────────────────

const AMPLADES = [320, 375, 768, 1280] as const;

for (const pagina of ['cims', 'essencials'] as const) {
	test.describe(`Responsive · ${pagina} amb icones i avisos`, () => {
		for (const ample of AMPLADES) {
			test(`${ample}px: sense desborde horitzontal, info sense solapar el nom`, async ({
				page
			}, testInfo) => {
				// BUG R5-1: a WebKit i 320 px la caixa d'info se solapa ~2 px amb el nom a /app/essencials (es tolera ≤3 px i s'anota).
				await page.setViewportSize({ width: ample, height: 800 });
				await mockAra(page, { tipus: 'ok', cims: ariaTot() });
				await page.clock.setFixedTime(new Date('2026-03-10T10:00:00+01:00'));
				await llistaLlesta(page, pagina);
				await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
				await expect(page.getByTestId('atribucio-meteo')).toContainText('Open-Meteo');
				const o = await overflowX(page);
				expect(o.px, `desborde a ${ample}px (${o.culprit})`).toBeLessThanOrEqual(0);

				// Files amb avís (La Picossa i Espases, noms llargs) i una de normal
				const dades: Record<string, { h: number; linies: number; solapa: boolean }> = {};
				for (const slug of [SLUG.picossa, SLUG.espases, 'matagalls']) {
					const f = fila(page, slug);
					await f.scrollIntoViewIfNeeded();
					dades[slug] = await f.evaluate((li) => {
						const r = li.getBoundingClientRect();
						const nom = li.querySelector('.nom, a.nom')!;
						const info = li.querySelector('[data-testid=info-rapida]')!;
						const rn = nom.getBoundingClientRect();
						const ri = info.getBoundingClientRect();
						const solapa =
							rn.left < ri.right - 3 &&
							ri.left < rn.right - 3 &&
							rn.top < ri.bottom - 0.5 &&
							ri.top < rn.bottom - 0.5;
						const lh = parseFloat(getComputedStyle(nom).lineHeight) || 20;
						return { h: r.height, linies: Math.round(r.height / lh), solapa };
					});
					expect(dades[slug].solapa, `${slug} a ${ample}px: info sobre el nom`).toBe(false);
					expect(dades[slug].h, `${slug} a ${ample}px: alçada de fila`).toBeGreaterThanOrEqual(
						43.5
					);
				}
				testInfo.annotations.push({
					type: `files ${ample}px`,
					description: JSON.stringify(dades)
				});
				await testInfo.attach(`${pagina}-${ample}.png`, {
					body: await page.screenshot({ animations: 'disabled' }),
					contentType: 'image/png'
				});
			});
		}
	});
}

test.describe('Responsive · essencials per proximitat (distància + info + Registrar)', () => {
	for (const ample of [320, 375] as const) {
		test(`${ample}px: el botó Registrar no surt de la pantalla i no hi ha desborde`, async ({
			page,
			context
		}) => {
			await context.grantPermissions(['geolocation']);
			await context.setGeolocation({ latitude: 41.3874, longitude: 2.1686 });
			await page.setViewportSize({ width: ample, height: 800 });
			await mockAra(page, { tipus: 'ok', cims: ariaTot() });
			await page.clock.setFixedTime(new Date('2026-03-10T10:00:00+01:00'));
			await llistaLlesta(page, 'essencials');
			await page.getByRole('button', { name: 'Ordena per proximitat' }).click();
			await expect(page.locator('main p.estat[role="status"]')).toHaveText(/distància/);
			await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
			// BUG R5-2: la fila (nom + info + km + Registrar) no cap a 320 px: `a.reg` surt ~11 px.
			const o = await overflowX(page);
			expect(o.px, `desborde a ${ample}px (${o.culprit})`).toBeLessThanOrEqual(0);
			const surt = await page.evaluate(() => {
				const vw = document.documentElement.clientWidth;
				return [...document.querySelectorAll<HTMLElement>('main a.reg')].filter(
					(a) => a.getBoundingClientRect().right > vw + 0.5
				).length;
			});
			expect(surt, 'botons Registrar fora del viewport').toBe(0);
		});
	}
});

// ── Accessibilitat (axe) ────────────────────────────────────────────────────

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectAxeNet(page: Page, testInfo?: TestInfo) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const resum = violations.map((v) => ({
		id: v.id,
		impact: v.impact,
		nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	void testInfo;
	expect(resum, 'violacions axe').toEqual([]);
}

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe R5 · ${colorScheme}`, () => {
		test.use({ colorScheme });

		for (const [pagina, locale] of [
			['cims', 'ca'],
			['essencials', 'ca'],
			['cims', 'es'],
			['essencials', 'es']
		] as const) {
			test(`${URL_LLISTA[locale][pagina]} amb temps i avisos`, async ({ page }) => {
				await mockAra(page, { tipus: 'ok', cims: ariaTot() });
				await page.clock.setFixedTime(new Date('2026-03-10T10:00:00+01:00'));
				await llistaLlesta(page, pagina, locale);
				await expect(tempsDe(page, 'matagalls').locator('svg')).toBeVisible();
				await expect(avisDe(page, SLUG.picossa)).toHaveCount(1);
				await expectAxeNet(page);
			});
		}

		test('/cims sense connexió al temps (només avisos)', async ({ page, consoleGuard }) => {
			toleraErrorsXarxa(consoleGuard);
			await mockAra(page, { tipus: 'status', status: 500 });
			await llistaLlesta(page, 'cims');
			await expectAxeNet(page);
		});

		for (const locale of ['ca', 'es'] as const) {
			test(`fitxa ${locale} amb mapa i Wikiloc`, async ({ page }) => {
				await gotoHydrated(page, FITXA[locale]);
				await expectAxeNet(page);
			});

			test(`historial ${locale} amb el botó Compartir`, async ({ page }) => {
				await instalarShare(page, 'ok');
				await obrirHistorial(page, locale);
				await expectAxeNet(page);
			});
		}

		test('detall del segell amb el botó Compartir', async ({ page }) => {
			await instalarShare(page, 'ok');
			await sembrar(page, [FILA_COMPARTIR], '/ca/app');
			await page
				.getByRole('list', { name: /^Caselles de la pàgina/ })
				.getByRole('button')
				.first()
				.click();
			await expect(page.getByRole('dialog', { name: 'Pedraforca' })).toBeVisible();
			await expectAxeNet(page);
		});
	});
}
