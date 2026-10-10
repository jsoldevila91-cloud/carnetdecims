import { readdirSync, readFileSync } from 'node:fs';
import type { ContingutFitxa, RutaAcces } from '../src/lib/content/fitxes/types.ts';

/**
 * Contingut editorial de TOTES les fitxes (`src/lib/content/fitxes/{slug}.ts`) i oracle
 * independent de la "dificultat orientativa" per als E2E (bloc 6b).
 *
 * - Les fitxes es descobreixen al disc (cap llista copiada a mà): un fitxer és una fitxa si
 *   declara `const fitxa: ContingutFitxa`. Afegir-ne una de nova l'afegeix sola als tests.
 * - L'oracle reimplementa la fórmula documentada (docs/05 i capçalera de
 *   `src/lib/domain/dificultat.ts`) **sense importar el codi de l'app**: els llindars s'escriuen
 *   aquí a partir de la documentació. Els E2E de dades el contrasten amb el domini; si algú
 *   canvia la fórmula a l'app sense canviar-la a la documentació, el test ho detecta.
 */

const DIR = new URL('../src/lib/content/fitxes/', import.meta.url);

const fitxers = readdirSync(DIR)
	.filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'))
	.filter((f) => /const fitxa: ContingutFitxa\b/.test(readFileSync(new URL(f, DIR), 'utf8')))
	.sort();

/** Totes les fitxes amb contingut, ordenades per slug. */
export const FITXES: ContingutFitxa[] = (
	await Promise.all(
		fitxers.map(
			async (f) => ((await import(new URL(f, DIR).href)) as { default: ContingutFitxa }).default
		)
	)
).sort((a, b) => a.slug.localeCompare(b.slug));

/** Noms de fitxer (sense `.ts`) de les fitxes, per comprovar que coincideixen amb el slug. */
export const FITXERS_FITXES = fitxers.map((f) => f.replace(/\.ts$/, ''));

export const SLUGS_FITXES = new Set(FITXES.map((f) => f.slug));

/**
 * Les 10 fitxes pilot del bloc 6a. Només serveixen per limitar les proves de render als
 * projectes mòbils (a `desktop-chrome` es proven les 50): no són cap oracle.
 */
export const SLUGS_PILOTS = new Set([
	'canigo',
	'comapedrosa',
	'la-mola-de-sant-llorenc-del-munt',
	'matagalls',
	'montcau',
	'pedraforca-pollego-superior',
	'pica-d-estats',
	'puigmal',
	'sant-jeroni',
	'taga'
]);
export const PILOTS = FITXES.filter((f) => SLUGS_PILOTS.has(f.slug));

const ALTITUDS = new Map(
	(
		JSON.parse(
			readFileSync(new URL('../src/lib/data/catalog/cims.json', import.meta.url), 'utf8')
		) as { slug: string; altitud: number }[]
	).map((c) => [c.slug, c.altitud])
);
export const altitudCim = (slug: string) => {
	const a = ALTITUDS.get(slug);
	if (a === undefined) throw new Error(`${slug} no és al catàleg`);
	return a;
};

// ── Oracle de la dificultat orientativa (docs/05 · capçalera de domain/dificultat.ts) ────────

export type Nivell = 1 | 2 | 3 | 4;
export type Dada = 'desnivell' | 'distancia' | 'temps' | 'tecnicitat';

export interface DificultatOracle {
	nivell: Nivell;
	aproximada: boolean;
	dadesQueFalten: Dada[];
	/** km-esforç sense arrodonir (per desempatar a "amb nens"). */
	kmEsforc?: number;
	factors: { esforc?: Nivell; tecnica?: Nivell; altitud?: Nivell };
}

/** Llindars documentats (km-esforç d'anada): ≤ 7 Fàcil, ≤ 15 Moderada, ≤ 22 Exigent, més Molt exigent. */
const nivellEsforc = (km: number): Nivell => (km <= 7 ? 1 : km <= 15 ? 2 : km <= 22 ? 3 : 4);
/** Pas més tècnic documentat. */
const TECNICA: Record<string, Nivell> = {
	cap: 1,
	'terreny-irregular': 2,
	'grimpada-facil': 2,
	grimpada: 3,
	'via-equipada': 4
};
/** Altitud: < 2.500 → 1; 2.500–2.999 → 2; ≥ 3.000 → 3 (mínim). */
const nivellAltitud = (m: number): Nivell => (m >= 3000 ? 3 : m >= 2500 ? 2 : 1);

/**
 * km-esforç = km + D+/100; si no, minuts/15; si només hi ha D+ (> 0), D+/100 × 1,4.
 * Nivell = el factor més alt; `null` si no hi ha ni esforç ni tècnica.
 */
export function dificultatOracle(r: RutaAcces, altitud: number): DificultatOracle | null {
	const d = r.desnivellPositiuM;
	const km = r.distanciaKm;
	const t = r.tempsMinuts;
	const teD = typeof d === 'number' && d >= 0;
	const teKm = typeof km === 'number' && km > 0;
	const teT = typeof t === 'number' && t > 0;
	const tec = r.tecnicitat !== undefined ? TECNICA[r.tecnicitat] : undefined;

	let kmEsforc: number | undefined;
	if (teD && teKm) kmEsforc = km! + d! / 100;
	else if (teT) kmEsforc = t! / 15;
	else if (teD && d! > 0) kmEsforc = (d! / 100) * 1.4;

	const esforc = kmEsforc === undefined ? undefined : nivellEsforc(kmEsforc);
	if (esforc === undefined && tec === undefined) return null;
	const alt = nivellAltitud(altitud);

	const falten: Dada[] = [];
	if (!teD) falten.push('desnivell');
	if (!teKm) falten.push('distancia');
	if (!(teD && teKm) && !teT) falten.push('temps');
	if (tec === undefined) falten.push('tecnicitat');

	const factors: DificultatOracle['factors'] = {};
	if (esforc !== undefined) factors.esforc = esforc;
	if (tec !== undefined) factors.tecnica = tec;
	factors.altitud = alt;
	return {
		nivell: Math.max(esforc ?? 1, tec ?? 1, alt) as Nivell,
		aproximada: falten.length > 0,
		dadesQueFalten: falten,
		kmEsforc,
		factors
	};
}

export const dificultatRutaOracle = (slug: string, r: RutaAcces) =>
	dificultatOracle(r, altitudCim(slug));

/** Criteri estricte "amb nens" (docs/05): D+ ≤ 600 m, ≤ 150 min, tècnica cap/terreny irregular, nivell ≤ 2. */
export const NENS = { desnivellMaxM: 600, tempsMaxMinuts: 150, nivellMax: 2 } as const;

/** La ruta compleix el criteri "amb nens": totes les dades obligatòries amb font i dins dels límits. */
export function rutaAptaNensOracle(slug: string, r: RutaAcces): boolean {
	const d = dificultatRutaOracle(slug, r);
	if (!d || d.factors.esforc === undefined || d.factors.tecnica === undefined) return false;
	if (d.nivell > NENS.nivellMax) return false;
	if (r.tecnicitat !== 'cap' && r.tecnicitat !== 'terreny-irregular') return false;
	if (r.desnivellPositiuM === undefined || r.desnivellPositiuM > NENS.desnivellMaxM) return false;
	if (r.tempsMinuts === undefined || r.tempsMinuts > NENS.tempsMaxMinuts) return false;
	// "Amb font": la ruta cita fonts (el contracte les exigeix si hi ha cap dada numèrica).
	return r.fonts.length > 0;
}

/**
 * Ruta triada per anar-hi amb nens: la més fàcil de les aptes (menys nivell, després menys
 * km-esforç, després menys temps); en cas d'empat, la primera de la fitxa (la normal).
 */
export function rutaNensOracle(f: ContingutFitxa): RutaAcces | undefined {
	let millor: { r: RutaAcces; d: DificultatOracle } | undefined;
	for (const r of f.rutes) {
		if (!rutaAptaNensOracle(f.slug, r)) continue;
		const d = dificultatRutaOracle(f.slug, r)!;
		if (
			!millor ||
			d.nivell < millor.d.nivell ||
			(d.nivell === millor.d.nivell &&
				(round1(d.kmEsforc) < round1(millor.d.kmEsforc) ||
					(round1(d.kmEsforc) === round1(millor.d.kmEsforc) &&
						r.tempsMinuts! < millor.r.tempsMinuts!)))
		)
			millor = { r, d };
	}
	return millor?.r;
}
/** km-esforç tal com es mostren (0,1): dues rutes amb la mateixa xifra visible empaten. */
const round1 = (n: number | undefined) =>
	n === undefined ? Number.POSITIVE_INFINITY : Math.round(n * 10) / 10;

/** Llistat `cims-facils`: ruta normal amb esforç i tecnicitat calculats i nivell Fàcil. */
export function esFacilOracle(f: ContingutFitxa): boolean {
	const r = f.rutes[0];
	if (!r) return false;
	const d = dificultatRutaOracle(f.slug, r);
	return !!d && d.factors.esforc !== undefined && d.factors.tecnica !== undefined && d.nivell === 1;
}

/**
 * Nom curt d'una ruta per a "Des de …" (`/cims-amb-nens`): el nom fins a " per/pel/pels/por " o
 * la primera coma, si el que queda té més d'una paraula; si no, el nom sencer.
 */
export function nomCurtOracle(nom: string): string {
	const m = /\s+(?:per|pel|pels|por)\s|,\s/.exec(nom);
	const curt = m ? nom.slice(0, m.index).trim() : '';
	return curt.includes(' ') ? curt : nom;
}

/**
 * Bugs coneguts (oberts) del H1 de la fitxa a 768 px: amb Archivo el títol passa a tenir una línia
 * més que amb la font de reserva i la capçalera creix en arribar la woff2 (CLS). Els tests de CLS
 * els anoten a part i fallen si deixen de reproduir-se (per treure'ls d'aquí quan s'arreglin).
 * BUG QA-6b-1: "Castell de Sant Miquel (386 m)" passa de 2 a 3 línies (+45 px) a 768 px.
 */
export const BUGS_H1_768 = new Set(['castell-de-sant-miquel']);

/** Separa els problemes trobats entre nous i bugs coneguts (`slug: …`). */
export function separaConeguts(
	dolents: readonly string[],
	coneguts: ReadonlySet<string>,
	provats: readonly string[]
) {
	const slug = (d: string) => d.split(':')[0];
	return {
		nous: dolents.filter((d) => !coneguts.has(slug(d))),
		/** Bugs coneguts provats aquí que ja no es reprodueixen (cal treure'ls de la llista). */
		arreglats: provats.filter((s) => coneguts.has(s) && !dolents.some((d) => slug(d) === s))
	};
}
