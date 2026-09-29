/**
 * Helpers dels E2E del bloc 4a (registre, historial i dades locals).
 *
 * Cada test de Playwright té un context de navegador nou, i per tant un IndexedDB buit.
 * `expectBdBuida` ho comprova explícitament; `sembrar` hi escriu files directament (IndexedDB
 * natiu, sense passar per la UI) i recarrega perquè Dexie les llegeixi.
 */
import type { Locator, Page } from '@playwright/test';
import { expect, gotoHydrated, mainNav } from './fixtures';

export const NOM_BD = 'carnetdecims';

export const SHEET_REGISTRE = { ca: 'Registrar una ascensió', es: 'Registrar una ascensión' };
export const SHEET_EDICIO = "Editar l'ascensió";

/** Cims del catàleg que fan servir els tests (id i slug estables). */
export const CIM = {
	pedraforca: { id: 54, slug: 'pedraforca-pollego-superior', nom: 'Pedraforca' },
	picossa: { id: 106, slug: 'la-picossa', nom: 'La Picossa' },
	santSalvador: {
		id: 45,
		slug: 'sant-salvador-de-les-espases',
		nom: 'Sant Salvador de les Espases'
	},
	matagalls: { id: 83, slug: 'matagalls', nom: 'Matagalls' },
	montcau: { id: 30, slug: 'montcau', nom: 'Montcau' },
	canigo: { id: 144, slug: 'canigo', nom: 'Canigó' },
	pica: { id: 99, slug: 'pica-d-estats', nom: "Pica d'Estats" },
	aliga: { id: 63, slug: 'puig-de-l-aliga', nom: "Puig de l'Àliga" }
} as const;

export interface FilaSembra {
	id?: string;
	cimId: number;
	data: string;
	metode?: 'a-peu' | 'btt' | 'esqui' | 'raquetes';
	nota?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

let seq = 0;
/** UUID v4 sintètic i únic dins del procés (vàlid per a `esUuid`). */
export function uuidTest(): string {
	seq++;
	const hex = (seq + Math.floor(Math.random() * 1e6) * 1000).toString(16).padStart(12, '0');
	return `0190a1b2-c3d4-4e5f-8a6b-${hex.slice(-12)}`;
}

export function completar(f: FilaSembra, i = 0) {
	const ts = f.createdAt ?? new Date(Date.UTC(2025, 0, 1, 10, 0, i)).toISOString();
	return {
		id: f.id ?? uuidTest(),
		cimId: f.cimId,
		data: f.data,
		metode: f.metode ?? 'a-peu',
		nota: f.nota ?? null,
		createdAt: ts,
		updatedAt: f.updatedAt ?? ts,
		deletedAt: null
	};
}

/** Fitxer d'exportació vàlid (format v1) amb aquestes ascensions. */
export function fitxerExportacio(files: FilaSembra[]) {
	return {
		format: 'carnetdecims.ascensions',
		versio: 1,
		app: 'carnetdecims.cat',
		exportatAt: '2025-12-31T10:00:00.000Z',
		catalegVersio: 'test',
		avis: 'test',
		total: files.length,
		ascensions: files.map((f, i) => {
			const c = completar(f, i);
			return {
				id: c.id,
				cimId: c.cimId,
				data: c.data,
				metode: c.metode,
				nota: c.nota,
				createdAt: c.createdAt,
				updatedAt: c.updatedAt
			};
		})
	};
}

/** L'IndexedDB de l'app no té cap ascensió (o encara no existeix). */
export async function expectBdBuida(page: Page) {
	const n = await page.evaluate(
		(nom) =>
			new Promise<number>((resolve) => {
				let creada = false;
				const req = indexedDB.open(nom);
				req.onupgradeneeded = () => {
					creada = true;
					req.transaction!.abort();
				};
				req.onerror = () => resolve(0);
				req.onsuccess = () => {
					const bd = req.result;
					if (creada || !bd.objectStoreNames.contains('ascensions')) {
						bd.close();
						return resolve(0);
					}
					const c = bd.transaction('ascensions').objectStore('ascensions').count();
					c.onsuccess = () => {
						bd.close();
						resolve(c.result);
					};
				};
			}),
		NOM_BD
	);
	expect(n, 'IndexedDB ha de començar buit').toBe(0);
}

/**
 * Escriu ascensions directament a IndexedDB. Primer obre /ca/app perquè Dexie creï la BD amb
 * el seu esquema; després hi escriu amb l'API nativa i recarrega (Dexie no veu escriptures
 * externes fins a rellegir).
 */
export async function sembrar(page: Page, files: FilaSembra[], url = '/ca/app') {
	await gotoHydrated(page, '/ca/app');
	await expect(page.getByText('Carregant el carnet…')).toHaveCount(0);
	const rows = files.map((f, i) => completar(f, i));
	await page.evaluate(
		({ nom, rows }) =>
			new Promise<void>((resolve, reject) => {
				const req = indexedDB.open(nom);
				req.onerror = () => reject(req.error);
				req.onsuccess = () => {
					const bd = req.result;
					const tx = bd.transaction(['ascensions', 'outbox'], 'readwrite');
					for (const r of rows) {
						tx.objectStore('ascensions').put(r);
						tx.objectStore('outbox').put({ ascensioId: r.id, encuaAt: r.updatedAt, intents: 0 });
					}
					tx.oncomplete = () => {
						bd.close();
						resolve();
					};
					tx.onerror = () => reject(tx.error);
				};
			}),
		{ nom: NOM_BD, rows }
	);
	await gotoHydrated(page, url);
	return rows;
}

/** Totes les files de la taula `ascensions` (també les làpides). */
export function filesBd(page: Page) {
	return page.evaluate(
		(nom) =>
			new Promise<{ id: string; cimId: number; data: string; deletedAt: string | null }[]>(
				(resolve, reject) => {
					const req = indexedDB.open(nom);
					req.onerror = () => reject(req.error);
					req.onsuccess = () => {
						const bd = req.result;
						const all = bd.transaction('ascensions').objectStore('ascensions').getAll();
						all.onsuccess = () => {
							bd.close();
							resolve(all.result);
						};
					};
				}
			),
		NOM_BD
	);
}

export const sheetRegistre = (page: Page, locale: 'ca' | 'es' = 'ca') =>
	page.getByRole('dialog', { name: SHEET_REGISTRE[locale] });

/** Obre el full des de la barra inferior (o lateral). */
export async function obrirFullNav(page: Page, locale: 'ca' | 'es' = 'ca') {
	await mainNav(page, locale).getByRole('link', { name: SHEET_REGISTRE[locale] }).click();
	const s = sheetRegistre(page, locale);
	await expect(s).toBeVisible();
	// El formulari es carrega amb import(): espera el botó d'enviar.
	await expect(
		s.getByRole('button', { name: /Registrar i segellar|Registrar y sellar/ })
	).toBeVisible();
	return s;
}

export const combobox = (scope: Page | Locator) =>
	scope.getByRole('combobox', { name: /^Cim$|^Cima$/ });
export const campData = (scope: Page | Locator) => scope.getByLabel(/^Data$|^Fecha$/);
export const campNota = (scope: Page | Locator) => scope.getByLabel(/Nota \(opcional\)/);
export const botoRegistrar = (scope: Page | Locator) =>
	scope.getByRole('button', { name: /Registrar i segellar|Registrar y sellar/ });

/** Tria un cim amb el teclat (escriu, Retorn tria el primer resultat). */
export async function triarCim(scope: Page | Locator, consulta: string, nom: string) {
	const cb = combobox(scope);
	await cb.fill(consulta);
	const opcio = scope.getByRole('option').first();
	await expect(opcio).toContainText(nom);
	await cb.press('Enter');
	await expect(
		scope.getByRole('button', { name: new RegExp(`\\(${escapeRe(nom)}\\)`) })
	).toBeVisible();
}

export function escapeRe(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Toast (element de la llista de notificacions) que conté un text. */
export const toast = (page: Page, text: string | RegExp) =>
	page
		.getByRole('region', { name: /Notificacions|Notificaciones/ })
		.locator('li')
		.filter({ hasText: text });
