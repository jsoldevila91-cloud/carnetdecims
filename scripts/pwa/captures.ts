/**
 * Captures de pantalla del manifest (instal·lació enriquida a Android i escriptori), fetes amb
 * l'app real i dades d'exemple.
 *
 *   npm run build && npm run preview      (en una altra terminal)
 *   npm run pwa:captures [-- http://localhost:4173]
 *
 * Escriu `static/screenshots/{ca,es}-{narrow,wide}.webp` (mides de `CAPTURES` a
 * `src/lib/platform/manifest.ts`: 1080×1920 i 1920×1080).
 *
 * Dades d'exemple: ascensions sintètiques a cims **reals del catàleg** (`cims.json`, un de cada
 * quatre essencials per id), amb dates i mètodes deterministes. S'escriuen directament a
 * IndexedDB, com fan els E2E (`e2e/ascensions.ts`), en un context de navegador nou i sense
 * service worker (perquè no surti l'avís "Preparat per funcionar sense connexió").
 */
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ARREL = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = process.argv[2] ?? 'http://localhost:4173';
const NOM_BD = 'carnetdecims';

/** Mateixes mides que `CAPTURES` (manifest.ts): viewport CSS × escala del dispositiu. */
const FORMATS = {
	narrow: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true },
	wide: { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5, isMobile: false }
} as const;

interface Cim {
	id: number;
	essencial: boolean;
}

const METODES = ['a-peu', 'a-peu', 'a-peu', 'raquetes', 'btt', 'esqui'] as const;

async function filesExemple() {
	const cims = JSON.parse(
		await readFile(join(ARREL, 'src/lib/data/catalog/cims.json'), 'utf8')
	) as Cim[];
	const triats = cims
		.filter((c) => c.essencial)
		.sort((a, b) => a.id - b.id)
		.filter((_, i) => i % 4 === 0);
	const inici = Date.UTC(2024, 2, 9);
	return triats.map((c, i) => {
		// Una sortida cada ~19 dies des del març del 2024 (totes abans de l'estiu del 2026).
		const data = new Date(inici + i * 19 * 86_400_000).toISOString().slice(0, 10);
		const ts = `${data}T18:00:00.000Z`;
		const hex = (i + 1).toString(16).padStart(12, '0');
		return {
			id: `0190a1b2-c3d4-7e5f-8a6b-${hex}`,
			cimId: c.id,
			data,
			metode: METODES[i % METODES.length],
			nota: null,
			createdAt: ts,
			updatedAt: ts,
			deletedAt: null
		};
	});
}

async function main() {
	const files = await filesExemple();
	const desti = join(ARREL, 'static', 'screenshots');
	await mkdir(desti, { recursive: true });
	const browser = await chromium.launch();
	try {
		for (const locale of ['ca', 'es'] as const) {
			for (const [format, opcions] of Object.entries(FORMATS)) {
				const context = await browser.newContext({
					...opcions,
					hasTouch: opcions.isMobile,
					colorScheme: 'light',
					reducedMotion: 'reduce',
					locale: locale === 'ca' ? 'ca-ES' : 'es-ES',
					timezoneId: 'Europe/Madrid',
					serviceWorkers: 'block'
				});
				const page = await context.newPage();
				const url = `${BASE}/${locale}/app`;
				await page.goto(url);
				await page.locator('section.passport[aria-busy="false"]').waitFor();
				await page.evaluate(
					({ nom, rows }) =>
						new Promise<void>((resolve, reject) => {
							const req = indexedDB.open(nom);
							req.onerror = () => reject(req.error);
							req.onsuccess = () => {
								const bd = req.result;
								const tx = bd.transaction(['ascensions'], 'readwrite');
								for (const r of rows) tx.objectStore('ascensions').put(r);
								tx.oncomplete = () => (bd.close(), resolve());
								tx.onerror = () => reject(tx.error);
							};
						}),
					{ nom: NOM_BD, rows: files }
				);
				await page.goto(url);
				await page.locator('section.passport[aria-busy="false"]').waitFor();
				await page.locator('[role="tabpanel"]').first().waitFor();
				await page.evaluate(() => document.fonts.ready);
				await page.waitForTimeout(300);
				const png = await page.screenshot({ type: 'png' });
				const fitxer = join(desti, `${locale}-${format}.webp`);
				await sharp(png).webp({ quality: 82, effort: 6 }).toFile(fitxer);
				const { width, height } = await sharp(fitxer).metadata();
				console.log(`  static/screenshots/${locale}-${format}.webp (${width}×${height})`);
				await context.close();
			}
		}
	} finally {
		await browser.close();
	}
}

await main();
