import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, settleAnimations } from './fixtures';

/**
 * Dades del catàleg i utilitats compartides pels E2E del bloc 3b (comarques, llistats, filtres).
 * Les dades esperades es llegeixen de `src/lib/data/catalog/*.json` (font única): els tests no
 * dupliquen cap xifra del catàleg.
 */

export type Locale = 'ca' | 'es';
export type Zona = 'catalunya' | 'andorra' | 'catalunya-nord';

export interface Cim {
	id: number;
	slug: string;
	nom: string;
	nom_oficial: string;
	toponim: string | null;
	alies: string[];
	altitud: number;
	lat: number | null;
	lon: number | null;
	comarca: string;
	zona: Zona;
	essencial: boolean;
}
export interface Comarca {
	slug: string;
	nom: string;
	zona: Zona;
}

const readJson = <T>(file: string): T =>
	JSON.parse(readFileSync(new URL(`../src/lib/data/catalog/${file}`, import.meta.url), 'utf8'));

export const CIMS = readJson<Cim[]>('cims.json');
export const COMARQUES = readJson<Comarca[]>('comarques.json');
export const LOCALES: Locale[] = ['ca', 'es'];

/** Més alt primer; empat: ordre del catàleg (el mateix criteri que `queries.ts`). */
export const perAltitudDesc = (a: Cim, b: Cim) => b.altitud - a.altitud || a.id - b.id;

export const cimsDe = (comarca: string) =>
	CIMS.filter((c) => c.comarca === comarca).sort(perAltitudDesc);

const ORDRE_ZONA: Record<Zona, number> = { catalunya: 0, andorra: 1, 'catalunya-nord': 2 };
const COLLATOR = new Intl.Collator('ca', { sensitivity: 'base' });

/** Comarques amb almenys un cim, en l'ordre esperat de l'índex. */
export const COMARQUES_AMB_CIMS = COMARQUES.filter((c) =>
	CIMS.some((x) => x.comarca === c.slug)
).sort((a, b) => ORDRE_ZONA[a.zona] - ORDRE_ZONA[b.zona] || COLLATOR.compare(a.nom, b.nom));

export const comarca = (slug: string) => {
	const c = COMARQUES.find((x) => x.slug === slug);
	if (!c) throw new Error(`La comarca ${slug} no és al catàleg`);
	return c;
};

export const fitxaUrl = (slug: string, locale: Locale) =>
	locale === 'ca' ? `/ca/cims/${slug}` : `/es/cimas/${slug}`;
export const comarcaUrl = (slug: string, locale: Locale) =>
	locale === 'ca' ? `/ca/comarques/${slug}` : `/es/comarcas/${slug}`;
export const comarquesUrl = (locale: Locale) =>
	locale === 'ca' ? '/ca/comarques' : '/es/comarcas';
export const ORIGIN = 'https://carnetdecims.cat';

/** Mateix format que `formatAltitude`: 3143 → "3.143". */
export const alt = (m: number) => String(Math.round(m)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** PNG transparent 1×1: els mapes WMS externs no fan dependre els E2E de la xarxa. */
const PNG_1PX = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);
export async function stubMaps(page: Page) {
	await page.route(/geoserveis\.icgc\.cat|data\.geopf\.fr/, (route) =>
		route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1PX })
	);
}

/** Tots els nodes JSON-LD de la pàgina (falla si algun bloc no és JSON vàlid). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON-LD arbitrari
export type LdNode = Record<string, any>;
export async function jsonLdNodes(page: Page): Promise<LdNode[]> {
	const blocs = await page.locator('script[type="application/ld+json"]').allTextContents();
	expect(blocs.length, 'hi ha JSON-LD').toBeGreaterThan(0);
	return blocs.map((b) => JSON.parse(b)).flatMap((j) => j['@graph'] ?? [j]);
}

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export async function expectNoAxeViolations(page: Page) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const summary = violations.map((v) => ({
		id: v.id,
		nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	expect(summary, 'violacions axe').toEqual([]);
}

/** Desbordament horitzontal del document i primer element de `main` que surt del viewport. */
export async function overflowX(page: Page) {
	return page.evaluate(() => {
		const vw = document.documentElement.clientWidth;
		const wide = [...document.querySelectorAll<HTMLElement>('main *')].find(
			(el) => el.getBoundingClientRect().right > vw + 0.5
		);
		return {
			px: document.documentElement.scrollWidth - vw,
			culprit: wide ? `${wide.tagName.toLowerCase()}.${wide.className}` : null
		};
	});
}
