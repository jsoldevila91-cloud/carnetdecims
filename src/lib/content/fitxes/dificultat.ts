/**
 * Dificultat orientativa de les rutes d'una fitxa (fórmula a `domain/dificultat.ts`).
 *
 * Com `index.ts`, **només per al servidor i el prerender**, i només imports relatius (l'importa
 * `$lib/seo/sitemap.ts`, que arriba a `vite.config.ts`). L'altitud del cim surt de `cims.json`.
 */
import cimsJson from '../../data/catalog/cims.json' with { type: 'json' };
import {
	dificultatOrientativa,
	rutaAmbNens,
	type DificultatOrientativa,
	type EntradaDificultat,
	type RutaAmbDificultat
} from '../../domain/dificultat.ts';
import type { ContingutFitxa, RutaAcces } from './types.ts';

let altituds: ReadonlyMap<string, number> | null = null;

/** Altitud del cim al catàleg (m), o `undefined` si el slug no hi és. */
function altitudCim(slug: string): number | undefined {
	altituds ??= new Map(
		(cimsJson as unknown as { slug: string; altitud: number }[]).map((c) => [c.slug, c.altitud])
	);
	return altituds.get(slug);
}

/** Dades d'una ruta per a `dificultatOrientativa`. */
export function entradaDificultat(ruta: RutaAcces, altitud: number): EntradaDificultat {
	return {
		desnivellPositiuM: ruta.desnivellPositiuM,
		distanciaKm: ruta.distanciaKm,
		tempsMinuts: ruta.tempsMinuts,
		tecnicitat: ruta.tecnicitat,
		altitudCim: altitud
	};
}

/**
 * Ruta normal (la primera) d'una fitxa amb la seva dificultat. `undefined` si la fitxa no té
 * rutes; `dificultat: null` si la ruta no té prou dades.
 */
export function rutaNormalAmbDificultat(c: ContingutFitxa): RutaAmbDificultat | undefined {
	const [normal] = c.rutes;
	if (!normal) return undefined;
	const ruta = entradaDificultat(normal, altitudCim(c.slug) ?? Number.NaN);
	return { id: normal.id, ruta, dificultat: dificultatOrientativa(ruta) };
}

/** Totes les rutes d'una fitxa amb la seva dificultat, en l'ordre de `rutes` (la normal primer). */
export function rutesAmbDificultat(c: ContingutFitxa): RutaAmbDificultat[] {
	const altitud = altitudCim(c.slug) ?? Number.NaN;
	return c.rutes.map((r) => {
		const ruta = entradaDificultat(r, altitud);
		return { id: r.id, ruta, dificultat: dificultatOrientativa(ruta) };
	});
}

/**
 * Ruta de la fitxa per anar-hi amb nens (`rutaAmbNens` del domini: la més fàcil que compleix
 * els criteris de `cims-amb-nens`), o `undefined` si cap no els compleix. Retorna la `RutaAcces`
 * sencera perquè la interfície pugui dir "des de …" (`nom`, `sortida`).
 */
export function rutaAmbNensFitxa(c: ContingutFitxa): RutaAcces | undefined {
	const id = rutaAmbNens(rutesAmbDificultat(c))?.id;
	return id === undefined ? undefined : c.rutes.find((r) => r.id === id);
}

/**
 * Dificultat orientativa de la **ruta normal** (la primera) d'una fitxa, per a la fitxa i els
 * llistats. `null` si no hi ha rutes o no hi ha prou dades (ni esforç ni tecnicitat).
 */
export function dificultatFitxa(c: ContingutFitxa): DificultatOrientativa | null {
	return rutaNormalAmbDificultat(c)?.dificultat ?? null;
}

/** Dificultat de cada ruta de la fitxa, en el mateix ordre que `rutes`. */
export function dificultatsRutes(c: ContingutFitxa): (DificultatOrientativa | null)[] {
	const altitud = altitudCim(c.slug) ?? Number.NaN;
	return c.rutes.map((r) => dificultatOrientativa(entradaDificultat(r, altitud)));
}
