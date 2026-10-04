/**
 * Consultes síncrones sobre el catàleg estàtic per a la fitxa de cim i la resta de pàgines
 * prerenderitzades. Índexs construïts un sol cop en carregar el mòdul.
 */
import {
	FILTRES_LLISTATS_DIFICULTAT,
	distanciaKm,
	type CimCataleg,
	type ComarcaCataleg,
	type LlistatDificultatId,
	type RutaAmbDificultat
} from '$lib/domain';
import { CIMS, COMARQUES } from './cataleg';

const CIMS_PER_SLUG: ReadonlyMap<string, CimCataleg> = new Map(CIMS.map((c) => [c.slug, c]));
const COMARQUES_PER_SLUG: ReadonlyMap<string, ComarcaCataleg> = new Map(
	COMARQUES.map((c) => [c.slug, c])
);

/** Slugs de totes les fitxes de cim (ordre del catàleg). */
export const SLUGS_CIMS: readonly string[] = Object.freeze(CIMS.map((c) => c.slug));

export function cimPerSlug(slug: string): CimCataleg | undefined {
	return CIMS_PER_SLUG.get(slug);
}

export function comarcaPerSlug(slug: string): ComarcaCataleg | undefined {
	return COMARQUES_PER_SLUG.get(slug);
}

/**
 * Els `n` cims més propers (Haversine), sense el mateix cim, del més proper al més llunyà
 * (empat: ordre del catàleg). Els cims sense coordenades no hi entren; si `cim` no en té,
 * retorna `[]`.
 */
export function cimsPropers(cim: CimCataleg, n = 6): { cim: CimCataleg; distanciaKm: number }[] {
	if (cim.lat === null || cim.lon === null || n <= 0) return [];
	const origen = { lat: cim.lat, lon: cim.lon };
	return CIMS.filter((c) => c.id !== cim.id && c.lat !== null && c.lon !== null)
		.map((c) => ({ cim: c, distanciaKm: distanciaKm(origen, { lat: c.lat!, lon: c.lon! }) }))
		.sort((a, b) => a.distanciaKm - b.distanciaKm || a.cim.id - b.cim.id)
		.slice(0, n);
}

/**
 * Fins a `n` cims de la mateixa comarca, sense el mateix cim, de més alt a més baix
 * (empat: ordre del catàleg).
 */
export function cimsMateixaComarca(cim: CimCataleg, n = 3): CimCataleg[] {
	if (n <= 0) return [];
	return CIMS.filter((c) => c.comarca === cim.comarca && c.id !== cim.id)
		.sort((a, b) => b.altitud - a.altitud || a.id - b.id)
		.slice(0, n);
}

// ── Pàgines de comarca (bloc 3b) ─────────────────────────────────────────────

/** Ordre de visualització per zona: primer les comarques catalanes, després Andorra i la Catalunya Nord. */
const ORDRE_ZONA: Readonly<Record<ComarcaCataleg['zona'], number>> = {
	catalunya: 0,
	andorra: 1,
	'catalunya-nord': 2
};

/** Collation catalana (accents i apòstrofs: "Alt Empordà" < "Alt Penedès" < "Alta Ribagorça"). */
const COLLATOR_CA = new Intl.Collator('ca', { sensitivity: 'base' });

/** Més alt primer; empat: ordre del catàleg. */
const perAltitudDesc = (a: CimCataleg, b: CimCataleg) => b.altitud - a.altitud || a.id - b.id;

/**
 * Tots els cims d'una comarca, de més alt a més baix (empat: ordre del catàleg).
 * Slug desconegut o comarca sense cims → `[]`.
 */
export function cimsPerComarca(slugComarca: string): CimCataleg[] {
	return CIMS.filter((c) => c.comarca === slugComarca).sort(perAltitudDesc);
}

const SLUGS_COMARQUES_AMB_CIMS: ReadonlySet<string> = new Set(CIMS.map((c) => c.comarca));

/**
 * Comarques (i zones) amb almenys un cim al catàleg, per a `/comarques` i el prerender.
 * Ordre: primer les 42 comarques de Catalunya per ordre alfabètic català (`Intl.Collator('ca')`),
 * i al final Andorra i la Catalunya Nord (ordre de `ZONES`), que són zones i no comarques.
 * Les comarques sense cims (p. ex. la Segarra, amb el catàleg d'essencials) no hi surten.
 */
export function comarquesAmbCims(): ComarcaCataleg[] {
	return COMARQUES.filter((c) => SLUGS_COMARQUES_AMB_CIMS.has(c.slug)).sort(
		(a, b) => ORDRE_ZONA[a.zona] - ORDRE_ZONA[b.zona] || COLLATOR_CA.compare(a.nom, b.nom)
	);
}

/**
 * Agrupa cims per comarca, en l'ordre de `comarquesAmbCims()` i conservant l'ordre dels cims
 * dins de cada grup (útil per a `/cims-essencials`, amb un H2 per comarca).
 */
export function agruparPerComarca(
	cims: readonly CimCataleg[]
): { comarca: ComarcaCataleg; cims: CimCataleg[] }[] {
	const grups = new Map<string, CimCataleg[]>();
	for (const c of cims) {
		const g = grups.get(c.comarca);
		if (g) g.push(c);
		else grups.set(c.comarca, [c]);
	}
	return comarquesAmbCims()
		.filter((c) => grups.has(c.slug))
		.map((comarca) => ({ comarca, cims: grups.get(comarca.slug)! }));
}

// ── Llistats curats (bloc 3b) ────────────────────────────────────────────────

/**
 * Llistats curats. Els de catàleg (`essencials`, `tresmils`, `mes-alts`) només depenen de
 * `cims.json`; els de dificultat (`cims-facils`, `cims-amb-nens`) depenen de la dificultat
 * orientativa de les rutes (`domain/dificultat.ts`), que surt del contingut editorial: només
 * hi entren cims **amb contingut**, i es calculen al servidor passant `ContextLlistat`.
 */
export type LlistatId = 'essencials' | 'tresmils' | 'mes-alts' | LlistatDificultatId;

/**
 * Dades del contingut editorial que necessiten els llistats de dificultat. Les donen
 * `rutesAmbDificultatPerCim()` i `rutesNormalsAmbDificultat()` de `$lib/content/fitxes`
 * (**només servidor/prerender**: el contingut de les fitxes no pot anar al JS del client).
 * - `cims-facils` només mira la ruta normal: n'hi ha prou amb `rutesNormals` (o `rutes`).
 * - `cims-amb-nens` pot fer servir qualsevol ruta: cal `rutes`.
 */
export interface ContextLlistat {
	/** Totes les rutes amb dificultat (la normal primer) de cada cim amb contingut (clau: slug). */
	rutes?: ReadonlyMap<string, readonly RutaAmbDificultat[]>;
	/** Ruta normal amb dificultat de cada cim amb contingut (clau: slug). */
	rutesNormals?: ReadonlyMap<string, RutaAmbDificultat>;
}

export interface LlistatDef {
	id: LlistatId;
	/** Camí intern (deslocalitzat) de `LOCALIZED_ROUTES` i `LLISTAT_PATHS`. */
	path: '/cims-essencials' | '/tresmils' | '/cims-mes-alts' | '/cims-facils' | '/cims-amb-nens';
	/** Ordre dels cims retornats per `cimsDelLlistat`. */
	ordre: 'comarca' | 'altitud';
	/** Criteri d'inclusió. */
	filtre: (cim: CimCataleg, ctx: ContextLlistat) => boolean;
	/** Nombre màxim de cims (rànquing), si n'hi ha. */
	limit?: number;
	/**
	 * Depèn del contingut editorial: `ruta-normal` necessita `ctx.rutes` o `ctx.rutesNormals`;
	 * `totes-les-rutes`, `ctx.rutes` (si no, `cimsDelLlistat` llança).
	 */
	requereixContingut?: 'ruta-normal' | 'totes-les-rutes';
}

/** Altitud mínima (m) per ser un "tresmil". */
export const ALTITUD_TRESMIL = 3000;
/** Mida del rànquing de `/cims-mes-alts`. */
export const MIDA_RANQUING_MES_ALTS = 25;

/** Rutes d'un cim segons el context (la normal primer); `[]` si no té contingut. */
function rutesDelCim(slug: string, ctx: ContextLlistat): readonly RutaAmbDificultat[] {
	const rutes = ctx.rutes?.get(slug);
	if (rutes) return rutes;
	const normal = ctx.rutesNormals?.get(slug);
	return normal ? [normal] : [];
}

const llistatDificultat = (
	id: LlistatDificultatId,
	requereixContingut: NonNullable<LlistatDef['requereixContingut']>
): LlistatDef => ({
	id,
	path: `/${id}`,
	// Agrupats per comarca (com `/cims-essencials`), i dins de cada una per altitud.
	ordre: 'comarca',
	filtre: (c, ctx) => FILTRES_LLISTATS_DIFICULTAT[id](rutesDelCim(c.slug, ctx)),
	requereixContingut
});

export const LLISTATS: Readonly<Record<LlistatId, LlistatDef>> = Object.freeze({
	essencials: {
		id: 'essencials',
		path: '/cims-essencials',
		// Agrupats per comarca (docs/02 §4.3: un H2 per comarca), i dins de cada una per altitud.
		ordre: 'comarca',
		filtre: (c) => c.essencial
	},
	tresmils: {
		id: 'tresmils',
		path: '/tresmils',
		ordre: 'altitud',
		filtre: (c) => c.altitud >= ALTITUD_TRESMIL
	},
	'mes-alts': {
		id: 'mes-alts',
		path: '/cims-mes-alts',
		ordre: 'altitud',
		filtre: () => true,
		limit: MIDA_RANQUING_MES_ALTS
	},
	'cims-facils': llistatDificultat('cims-facils', 'ruta-normal'),
	'cims-amb-nens': llistatDificultat('cims-amb-nens', 'totes-les-rutes')
});

export const LLISTAT_IDS: readonly LlistatId[] = Object.freeze(
	Object.keys(LLISTATS) as LlistatId[]
);

/**
 * Cims d'un llistat curat. Ordre `altitud`: de més alt a més baix (empat: ordre del catàleg).
 * Ordre `comarca`: per comarca (ordre de `comarquesAmbCims()`) i, dins de cada una, per altitud.
 * Els llistats de dificultat necessiten el context de contingut (servidor/prerender).
 * @throws RangeError si l'id no existeix.
 * @throws TypeError si el llistat depèn del contingut i el context no porta les rutes que cal.
 */
export function cimsDelLlistat(id: LlistatId, ctx: ContextLlistat = {}): CimCataleg[] {
	const def = Object.hasOwn(LLISTATS, id) ? LLISTATS[id] : undefined;
	if (!def) throw new RangeError(`Llistat desconegut: ${id}`);
	if (def.requereixContingut === 'totes-les-rutes' && !ctx.rutes)
		throw new TypeError(`El llistat ${id} necessita ctx.rutes (totes les rutes de les fitxes)`);
	if (def.requereixContingut === 'ruta-normal' && !ctx.rutes && !ctx.rutesNormals)
		throw new TypeError(`El llistat ${id} necessita ctx.rutes o ctx.rutesNormals`);
	const cims = CIMS.filter((c) => def.filtre(c, ctx)).sort(perAltitudDesc);
	const ordenats = def.ordre === 'comarca' ? agruparPerComarca(cims).flatMap((g) => g.cims) : cims;
	return def.limit === undefined ? ordenats : ordenats.slice(0, def.limit);
}
