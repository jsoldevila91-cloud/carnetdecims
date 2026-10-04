/**
 * Índex del contingut editorial de les fitxes de cim (fase 6; contracte a `types.ts`).
 *
 * Cada `{slug}.ts` d'aquesta carpeta exporta `default` un `ContingutFitxa`. Es carreguen tots
 * amb `import.meta.glob` (eager), de manera estàtica.
 *
 * **Només per al servidor i el prerender** (`+page.server.ts`, sitemap, tests): si un mòdul del
 * client l'importés, el text de totes les fitxes aniria al JS de cada pàgina. La fitxa rep el
 * contingut del seu cim pel `load` del servidor (prerender → `__data.json` d'aquella fitxa).
 *
 * L'importa `$lib/seo/sitemap.ts` (i, per tant, `vite.config.ts`): només imports relatius, i el
 * `glob` s'avalua de manera **mandrosa** (a la primera crida), perquè el carregador de la config
 * de Vite no transforma `import.meta.glob` i fallaria en importar el mòdul. A la config no es
 * crida mai (`vite.config.ts` només hi agafa `SITEMAP_INDEX_PATH`).
 */
import type { LlistatDificultatId, RutaAmbDificultat } from '../../domain/dificultat.ts';
import { FILTRES_LLISTATS_DIFICULTAT } from '../../domain/dificultat.ts';
import { rutaNormalAmbDificultat } from './dificultat.ts';
import type { ContingutFitxa } from './types.ts';

// `export type`: `types.ts` només té tipus (i un import sense extensió que la config de Vite no ha de tocar).
export type * from './types.ts';
export { comptarParaules, paraulesFitxa } from './paraules.ts';
export { contingutFitxaLocal, type ContingutFitxaLocal, type RutaAccesLocal } from './local.ts';
export { validarContingutFitxa, type CatalegValidacio } from './validacio.ts';
export {
	dificultatFitxa,
	dificultatsRutes,
	entradaDificultat,
	rutaNormalAmbDificultat
} from './dificultat.ts';

/** Fitxers de la carpeta que no són contingut d'un cim. */
const NO_SON_FITXES = ['index', 'types', 'local', 'paraules', 'validacio', 'dificultat'];

let fitxes: ReadonlyMap<string, ContingutFitxa> | null = null;

/** Mòduls `./{slug}.ts` (clau: camí relatiu). Una sola crida a `glob`, avaluada en cridar-la. */
function moduls(): Record<string, ContingutFitxa | undefined> {
	return import.meta.glob<ContingutFitxa>(
		[
			'./*.ts',
			'!./index.ts',
			'!./types.ts',
			'!./local.ts',
			'!./paraules.ts',
			'!./validacio.ts',
			'!./dificultat.ts',
			'!./*.spec.ts',
			'!./*.test.ts'
		],
		{ eager: true, import: 'default' }
	);
}

const nomFitxer = (cami: string) => cami.replace(/^.*\//, '').replace(/\.ts$/, '');

function carregar(): ReadonlyMap<string, ContingutFitxa> {
	if (fitxes) return fitxes;
	const mapa = new Map<string, ContingutFitxa>();
	for (const [cami, contingut] of Object.entries(moduls())) {
		const nom = nomFitxer(cami);
		if (NO_SON_FITXES.includes(nom)) continue;
		// El nom del fitxer és el slug; si no coincideixen, la fitxa no es publica
		// (`fitxes.spec.ts` ho detecta).
		if (contingut?.slug !== nom) continue;
		mapa.set(nom, contingut);
	}
	fitxes = mapa;
	return mapa;
}

/** Contingut editorial d'un cim, o `undefined` si encara no en té (fitxa de plantilla). */
export function contingutFitxa(slug: string): ContingutFitxa | undefined {
	return carregar().get(slug);
}

/** Tots els continguts de fitxa, ordenats per slug (tests, sitemap). */
export function totsElsContingutsFitxa(): ContingutFitxa[] {
	return [...carregar().values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Noms dels fitxers `{nom}.ts` de la carpeta que s'han carregat, encara que el slug intern no hi
 * coincideixi (per al test de coherència nom de fitxer ↔ slug).
 */
export function fitxersContingutFitxa(): { fitxer: string; slug: unknown }[] {
	return Object.entries(moduls()).map(([cami, c]) => ({ fitxer: nomFitxer(cami), slug: c?.slug }));
}

/**
 * Ruta normal amb la seva dificultat de cada cim **amb contingut** (clau: slug). És el context
 * dels llistats de dificultat (`cimsDelLlistat('cims-facils', { rutesNormals })`).
 */
export function rutesNormalsAmbDificultat(): ReadonlyMap<string, RutaAmbDificultat> {
	const mapa = new Map<string, RutaAmbDificultat>();
	for (const c of carregar().values()) {
		const r = rutaNormalAmbDificultat(c);
		if (r) mapa.set(c.slug, r);
	}
	return mapa;
}

/**
 * Slugs dels cims amb contingut que entren a un llistat de dificultat (ordre de slug). El fa
 * servir el sitemap (que no pot importar `$lib/data/catalog`); `cimsDelLlistat` aplica el mateix
 * predicat (`FILTRES_LLISTATS_DIFICULTAT`) i un test comprova que coincideixen.
 */
export function slugsLlistatDificultat(id: LlistatDificultatId): string[] {
	const filtre = FILTRES_LLISTATS_DIFICULTAT[id];
	return [...rutesNormalsAmbDificultat()]
		.filter(([, r]) => filtre(r))
		.map(([slug]) => slug)
		.sort();
}
