/**
 * Fitxers del build que NO van al precache inicial del service worker: els que només es
 * carreguen des d'un mòdul diferit pesat (el motor del mapa amb MapLibre, ~1 MB sense
 * comprimir, i el seu worker). Entren a la cache `recursos` la primera vegada que es visita
 * el mapa (docs/05 §2).
 *
 * El calcula el plugin de Vite `pluginSwDiferits` (`vite.config.ts`) a partir del bundle del
 * client i el desa a `.svelte-kit/sw-diferits.json`, que `src/service-worker.ts` importa en
 * construir-se. Aquí només hi ha la part pura (provada a `diferits.spec.ts`).
 */

/** Mòduls (camí relatiu a l'arrel del projecte) que es carreguen diferits i no es precarreguen. */
export const MODULS_DIFERITS = ['src/lib/ui/mapa/motor.ts'] as const;

/** Camí (relatiu a l'arrel) del JSON que llegeix el service worker. */
export const FITXER_DIFERITS = '.svelte-kit/sw-diferits.json';

export type ChunkResum = {
	fileName: string;
	isEntry: boolean;
	isDynamicEntry: boolean;
	/** Mòdul principal del chunk, relatiu a l'arrel i amb `/`. */
	modul: string | null;
	/** Imports estàtics (noms de fitxer d'altres chunks). */
	imports: readonly string[];
	css: readonly string[];
	assets: readonly string[];
};

/**
 * Fitxers (amb `/` inicial, com a `$service-worker.build`) que només fan servir els mòduls
 * diferits: el seu chunk, els chunks que importen i ningú més no importa, i el seu CSS i
 * assets (el worker de MapLibre) que no comparteixen amb la resta.
 */
export function calculaDiferits(
	chunks: readonly ChunkResum[],
	moduls: readonly string[]
): string[] {
	const perNom = new Map(chunks.map((c) => [c.fileName, c]));
	const esDiferit = (c: ChunkResum) =>
		c.isDynamicEntry && c.modul !== null && moduls.includes(c.modul);

	const tanca = (arrels: ChunkResum[]): Set<string> => {
		const vistos = new Set<string>();
		const pila = arrels.map((c) => c.fileName);
		while (pila.length > 0) {
			const nom = pila.pop()!;
			if (vistos.has(nom)) continue;
			vistos.add(nom);
			for (const i of perNom.get(nom)?.imports ?? []) pila.push(i);
		}
		return vistos;
	};

	const arrelsDiferides = chunks.filter(esDiferit);
	if (arrelsDiferides.length === 0) return [];
	const normals = tanca(chunks.filter((c) => (c.isEntry || c.isDynamicEntry) && !esDiferit(c)));
	const diferits = [...tanca(arrelsDiferides)].filter((n) => !normals.has(n));

	const recursosNormals = new Set<string>();
	for (const nom of normals) {
		const c = perNom.get(nom);
		c?.css.forEach((f) => recursosNormals.add(f));
		c?.assets.forEach((f) => recursosNormals.add(f));
	}
	const fitxers = new Set<string>();
	for (const nom of diferits) {
		const c = perNom.get(nom)!;
		fitxers.add(nom);
		for (const f of [...c.css, ...c.assets]) if (!recursosNormals.has(f)) fitxers.add(f);
	}
	return [...fitxers].map((f) => `/${f}`).sort();
}
