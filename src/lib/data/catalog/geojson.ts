/**
 * Cims del catàleg per al mapa interactiu (bloc 4c): filtres compartits amb `/cims` i
 * GeoJSON per a la font de MapLibre. Funcions pures: l'estat de l'usuari (fet/pendent)
 * s'injecta com a paràmetre (vegeu `estatCims` a `$lib/domain`).
 *
 * Els filtres de text, zona i "només essencials" són exactament els de `/cims`
 * (`passaFiltres` de `$lib/domain/filtres-cims`), i la query string hi és compatible:
 * `?q=…&zona=…&alt=…&essencials=1` vol dir el mateix a totes dues pàgines. El mapa hi afegeix
 * `comarca`, `altmin`/`altmax` (quan no coincideixen amb cap franja) i `estat`, que `/cims`
 * ignora. Cap d'aquestes URL no és indexable (canonical a la base).
 */
import type { Feature, FeatureCollection, Point } from 'geojson';
import {
	ZONES,
	estatDe,
	type CimCataleg,
	type EstatCim,
	type EstatsCims,
	type Zona
} from '$lib/domain';
import {
	FILTRES_BUITS,
	FRANGES,
	FRANGES_ALTITUD,
	passaFiltres,
	textCerca,
	type FiltresCims
} from '$lib/domain/filtres-cims';
import { COMARQUES } from './cataleg';
import { comarcaPerSlug } from './queries';

export type EstatFiltre = EstatCim | 'tots';
export const ESTATS_FILTRE: readonly EstatFiltre[] = ['tots', 'fet', 'pendent'];

/** Filtres del mapa (i de qualsevol llista del catàleg). Un camp absent no filtra. */
export interface FiltresMapa {
	/** Text lliure (nom, àlies o comarca), amb la mateixa normalització que `/cims`. */
	q?: string;
	zona?: Zona;
	/** Slug de la comarca. */
	comarca?: string;
	/** Altitud mínima en m (**inclosa**). */
	altMin?: number;
	/** Altitud màxima en m (**exclosa**, com les franges de `/cims`: [altMin, altMax)). */
	altMax?: number;
	/** `true` = només essencials; `false` = només no essencials; absent = tots. */
	essencial?: boolean;
	/** Estat de l'usuari; absent o `tots` = tots. */
	estat?: EstatFiltre;
}

/** Longitud màxima del text de cerca (igual que `/cims`). */
export const MAX_Q = 80;
/** Rang admès per `altmin`/`altmax` a la query. */
export const ALTITUD_MAX_QUERY = 9999;

// Text de cerca precalculat per cim (normalitzar a cada tecla és car amb 522 cims).
const cacheCerca = new WeakMap<CimCataleg, string>();
function cercaDe(cim: CimCataleg): string {
	let t = cacheCerca.get(cim);
	if (t === undefined) {
		t = textCerca(cim, comarcaPerSlug(cim.comarca)?.nom);
		cacheCerca.set(cim, t);
	}
	return t;
}

/** Hi ha algun filtre actiu? */
export function filtresMapaActius(f: FiltresMapa): boolean {
	return (
		(f.q ?? '').trim() !== '' ||
		f.zona !== undefined ||
		f.comarca !== undefined ||
		f.altMin !== undefined ||
		f.altMax !== undefined ||
		f.essencial !== undefined ||
		(f.estat !== undefined && f.estat !== 'tots')
	);
}

/** El cim passa els filtres? `estat` = estat de l'usuari (absent = tots pendents). */
export function passaFiltresMapa(cim: CimCataleg, f: FiltresMapa, estat?: EstatsCims): boolean {
	const base: FiltresCims = {
		...FILTRES_BUITS,
		text: f.q ?? '',
		zona: f.zona ?? '',
		nomesEssencials: f.essencial === true
	};
	if (!passaFiltres(cim, cercaDe(cim), base)) return false;
	if (f.essencial === false && cim.essencial) return false;
	if (f.comarca !== undefined && cim.comarca !== f.comarca) return false;
	if (f.altMin !== undefined && cim.altitud < f.altMin) return false;
	if (f.altMax !== undefined && cim.altitud >= f.altMax) return false;
	if (f.estat === 'fet' || f.estat === 'pendent') return estatDe(estat, cim.id) === f.estat;
	return true;
}

/** Cims que passen els filtres, en l'ordre rebut. */
export function filtrarCims<C extends CimCataleg>(
	cims: readonly C[],
	filtres: FiltresMapa = {},
	estat?: EstatsCims
): C[] {
	if (!filtresMapaActius(filtres)) return [...cims];
	return cims.filter((c) => passaFiltresMapa(c, filtres, estat));
}

/** Propietats de cada punt de la font GeoJSON del mapa. */
export interface PropietatsCimMapa {
	id: number;
	slug: string;
	nom: string;
	altitud: number;
	/** Slug de la comarca. */
	comarca: string;
	zona: Zona;
	essencial: boolean;
	estat: EstatCim;
}

export type FeatureCimMapa = Feature<Point, PropietatsCimMapa>;
export type GeojsonCims = FeatureCollection<Point, PropietatsCimMapa>;

/**
 * FeatureCollection de punts ([lon, lat]) per a una font GeoJSON de MapLibre. Cada feature
 * porta `id` = id del cim (vàlid per a `feature-state`). Els cims sense coordenades s'ometen.
 * Amb `filtres`, només hi entren els que els passen (alternativa: filtrar amb `setFilter`).
 */
export function geojsonCims(
	cims: readonly CimCataleg[],
	estat?: EstatsCims,
	filtres?: FiltresMapa
): GeojsonCims {
	const features: FeatureCimMapa[] = [];
	for (const c of filtres ? filtrarCims(cims, filtres, estat) : cims) {
		if (c.lat === null || c.lon === null) continue;
		features.push({
			type: 'Feature',
			id: c.id,
			geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
			properties: {
				id: c.id,
				slug: c.slug,
				nom: c.nom,
				altitud: c.altitud,
				comarca: c.comarca,
				zona: c.zona,
				essencial: c.essencial,
				estat: estatDe(estat, c.id)
			}
		});
	}
	return { type: 'FeatureCollection', features };
}

// ---------------------------------------------------------------------------
// Query string (compatible amb `/cims`)
// ---------------------------------------------------------------------------

const esZona = (v: string | null): v is Zona =>
	v !== null && (ZONES as readonly string[]).includes(v);
const SLUGS_COMARQUES = new Set(COMARQUES.map((c) => c.slug));

function altitudQuery(v: string | null): number | undefined {
	if (v === null || !/^\d{1,4}$/.test(v)) return undefined;
	const n = Number(v);
	return n <= ALTITUD_MAX_QUERY ? n : undefined;
}

/** Franja de `/cims` equivalent a [altMin, altMax), si n'hi ha. */
function franjaDe(altMin: number | undefined, altMax: number | undefined) {
	const min = altMin ?? 0;
	const max = altMax ?? Infinity;
	return FRANGES.find((k) => FRANGES_ALTITUD[k][0] === min && FRANGES_ALTITUD[k][1] === max);
}

/**
 * Filtres a partir de la query string (amb o sense `?`). Els valors desconeguts o invàlids
 * s'ignoren. `alt=<franja>` (el de `/cims`) fixa `altMin`/`altMax`; `altmin`/`altmax`
 * explícits hi tenen prioritat.
 */
export function filtresDesDeQuery(query: URLSearchParams | string): FiltresMapa {
	const p = typeof query === 'string' ? new URLSearchParams(query) : query;
	const f: FiltresMapa = {};

	const q = (p.get('q') ?? '').slice(0, MAX_Q).trim();
	if (q) f.q = q;
	const zona = p.get('zona');
	if (esZona(zona)) f.zona = zona;
	const comarca = p.get('comarca');
	if (comarca !== null && SLUGS_COMARQUES.has(comarca)) f.comarca = comarca;

	const alt = p.get('alt');
	if (alt !== null && Object.hasOwn(FRANGES_ALTITUD, alt)) {
		const [min, max] = FRANGES_ALTITUD[alt as keyof typeof FRANGES_ALTITUD];
		if (min > 0) f.altMin = min;
		if (max !== Infinity) f.altMax = max;
	}
	const altMin = altitudQuery(p.get('altmin'));
	if (altMin !== undefined) f.altMin = altMin;
	const altMax = altitudQuery(p.get('altmax'));
	if (altMax !== undefined) f.altMax = altMax;

	const essencials = p.get('essencials');
	if (essencials === '1') f.essencial = true;
	else if (essencials === '0') f.essencial = false;

	const estat = p.get('estat');
	if (estat === 'fet' || estat === 'pendent') f.estat = estat;
	return f;
}

/**
 * Query string dels filtres actius, sense `?` (buida si no n'hi ha cap). Mateixos noms i ordre
 * que `/cims` (`q`, `zona`, `alt`, `essencials`) i després els propis del mapa.
 */
export function filtresAQuery(f: FiltresMapa): string {
	const p = new URLSearchParams();
	const q = (f.q ?? '').trim().slice(0, MAX_Q);
	if (q) p.set('q', q);
	if (f.zona) p.set('zona', f.zona);
	const senseAltitud = f.altMin === undefined && f.altMax === undefined;
	const franja = senseAltitud ? undefined : franjaDe(f.altMin, f.altMax);
	if (franja) p.set('alt', franja);
	if (f.essencial === true) p.set('essencials', '1');
	else if (f.essencial === false) p.set('essencials', '0');
	if (f.comarca) p.set('comarca', f.comarca);
	if (!senseAltitud && !franja) {
		if (f.altMin !== undefined) p.set('altmin', String(Math.round(f.altMin)));
		if (f.altMax !== undefined) p.set('altmax', String(Math.round(f.altMax)));
	}
	if (f.estat === 'fet' || f.estat === 'pendent') p.set('estat', f.estat);
	return p.toString();
}

/** Filtres del mapa equivalents als de `/cims` (per passar d'una vista a l'altra). */
export function filtresMapaDesDeFiltresCims(f: FiltresCims): FiltresMapa {
	const r: FiltresMapa = {};
	if (f.text.trim()) r.q = f.text.trim();
	if (f.zona) r.zona = f.zona;
	if (f.altitud) {
		const [min, max] = FRANGES_ALTITUD[f.altitud];
		if (min > 0) r.altMin = min;
		if (max !== Infinity) r.altMax = max;
	}
	if (f.nomesEssencials) r.essencial = true;
	return r;
}
