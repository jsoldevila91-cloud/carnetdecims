/**
 * Helpers dels E2E del bloc R1 (estadístiques, diari i municipi d'origen).
 *
 * - Els textos de les claus noves es llegeixen de `messages/*.json` (font única; l'equip de SEO
 *   els pot reescriure): els tests no en fixen el literal. Si es canvia un text després de
 *   compilar el servidor dels E2E, cal tornar a compilar.
 * - Els oracles de les estadístiques es calculen aquí a partir de `cims.json` i `municipis.json`
 *   (no es copia la lògica de `src/lib/domain/estadistiques.ts`).
 */
import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { NOM_BD } from './ascensions';
import { CIMS, COMARQUES, type Cim } from './cataleg';
import { expect, settleAnimations } from './fixtures';

export type Locale = 'ca' | 'es';

const MISSATGES: Record<Locale, Record<string, unknown>> = {
	ca: JSON.parse(readFileSync(new URL('../messages/ca.json', import.meta.url), 'utf8')),
	es: JSON.parse(readFileSync(new URL('../messages/es.json', import.meta.url), 'utf8'))
};

/** Text d'una clau de Paraglide amb els paràmetres substituïts (`{nom}`). */
export function t(
	locale: Locale,
	clau: string,
	params: Record<string, string | number> = {}
): string {
	const s = MISSATGES[locale][clau];
	if (typeof s !== 'string') throw new Error(`Clau de missatge desconeguda o no textual: ${clau}`);
	return s.replace(/\{(\w+)\}/g, (_, k: string) => (k in params ? String(params[k]) : `{${k}}`));
}

export function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** RegExp exacta (amb ancoratges) del text d'una clau. */
export const exacte = (
	locale: Locale,
	clau: string,
	params: Record<string, string | number> = {}
) => new RegExp(`^\\s*${escapeRe(t(locale, clau, params))}\\s*$`);

/** RegExp que conté el text d'una clau. */
export const conte = (locale: Locale, clau: string, params: Record<string, string | number> = {}) =>
	new RegExp(escapeRe(t(locale, clau, params)));

// ---------------------------------------------------------------------------
// Municipis (oracle)
// ---------------------------------------------------------------------------

interface DadesMunicipis {
	comarques: [string, string, string][];
	municipis: (
		[string, string, number, number, number] | [string, string, number, number, number, string]
	)[];
}
const DADES_MUNICIPIS: DadesMunicipis = JSON.parse(
	readFileSync(new URL('../src/lib/data/municipis/municipis.json', import.meta.url), 'utf8')
);

export interface MunicipiE2E {
	codi: string;
	nom: string;
	comarca: string;
	lat: number;
	lon: number;
	cap: string | null;
}

export const MUNICIPIS: MunicipiE2E[] = DADES_MUNICIPIS.municipis.map((m) => ({
	codi: m[0],
	nom: m[1],
	comarca: DADES_MUNICIPIS.comarques[m[2]][1],
	lat: m[3],
	lon: m[4],
	cap: m[5] ?? null
}));

export function municipi(nom: string): MunicipiE2E {
	const m = MUNICIPIS.find((x) => x.nom === nom);
	if (!m) throw new Error(`Municipi desconegut al conjunt: ${nom}`);
	return m;
}

/** Haversine (radi mitjà de la Terra, IUGG). Independent de `domain/geo.ts`. */
export function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
	const R = 6371.0088;
	const toRad = (g: number) => (g * Math.PI) / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLon = toRad(b.lon - a.lon);
	const x =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export const cimPerId = (id: number): Cim => {
	const c = CIMS.find((x) => x.id === id);
	if (!c) throw new Error(`Cim ${id} no és al catàleg`);
	return c;
};

export { CIMS, COMARQUES };

// ---------------------------------------------------------------------------
// Estat local
// ---------------------------------------------------------------------------

/** Escriu la preferència `origen` a IndexedDB (la pàgina ha d'haver obert ja la BD v3). */
export async function escriureOrigen(
	page: Page,
	valor: string | null,
	opcions: { updatedAt?: string; pendent?: 0 | 1 } = {}
) {
	await page.evaluate(
		({ nom, fila }) =>
			new Promise<void>((resolve, reject) => {
				const req = indexedDB.open(nom);
				req.onerror = () => reject(req.error);
				req.onsuccess = () => {
					const bd = req.result;
					const tx = bd.transaction('preferencies', 'readwrite');
					tx.objectStore('preferencies').put(fila);
					tx.oncomplete = () => {
						bd.close();
						resolve();
					};
					tx.onerror = () => reject(tx.error);
				};
			}),
		{
			nom: NOM_BD,
			fila: {
				clau: 'origen',
				valor,
				updatedAt: opcions.updatedAt ?? '2026-01-01T10:00:00.000Z',
				pendent: opcions.pendent ?? 1
			}
		}
	);
}

/** Preferència `origen` desada (o `undefined`). */
export function llegirOrigen(page: Page) {
	return page.evaluate(
		(nom) =>
			new Promise<
				{ clau: string; valor: string | null; updatedAt: string; pendent: number } | undefined
			>((resolve, reject) => {
				const req = indexedDB.open(nom);
				req.onerror = () => reject(req.error);
				req.onsuccess = () => {
					const bd = req.result;
					if (!bd.objectStoreNames.contains('preferencies')) {
						bd.close();
						return resolve(undefined);
					}
					const g = bd.transaction('preferencies').objectStore('preferencies').get('origen');
					g.onsuccess = () => {
						bd.close();
						resolve(g.result);
					};
					g.onerror = () => reject(g.error);
				};
			}),
		NOM_BD
	);
}

/** Totes les files d'ascensions amb els companys (també la presència de la clau). */
export function filesAmbCompanys(page: Page) {
	return page.evaluate(
		(nom) =>
			new Promise<
				{
					id: string;
					cimId: number;
					data: string;
					nota: string | null;
					companys?: string[];
					updatedAt: string;
					deletedAt: string | null;
				}[]
			>((resolve, reject) => {
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
			}),
		NOM_BD
	);
}

// ---------------------------------------------------------------------------
// Comprovacions comunes
// ---------------------------------------------------------------------------

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** axe WCAG 2.2 AA sense violacions (opcionalment, només dins d'un selector). */
export async function expectAxeNet(page: Page, include?: string) {
	await settleAnimations(page);
	let b = new AxeBuilder({ page }).withTags(WCAG_TAGS);
	if (include) b = b.include(include);
	const { violations } = await b.analyze();
	const resum = violations.map((v) => ({
		id: v.id,
		impact: v.impact,
		nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' '))
	}));
	expect(resum, 'violacions axe').toEqual([]);
}

/** Cap element no fa scroll horitzontal del document (reflow WCAG 1.4.10). */
export async function expectSenseDesbord(page: Page) {
	const r = await page.evaluate(() => ({
		doc: document.documentElement.scrollWidth,
		vw: document.documentElement.clientWidth,
		culpables: [...document.querySelectorAll<HTMLElement>('main *, dialog[open] *')]
			.filter((el) => {
				const b = el.getBoundingClientRect();
				return b.width > 0 && b.right > document.documentElement.clientWidth + 1;
			})
			.slice(0, 5)
			.map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
	}));
	expect(r.culpables, 'elements que sobresurten del viewport').toEqual([]);
	expect(r.doc).toBeLessThanOrEqual(r.vw);
}
