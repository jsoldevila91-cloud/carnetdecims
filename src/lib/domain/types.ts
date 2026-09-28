/**
 * Tipos del dominio de Carnet de Cims (fase 1).
 *
 * Alineados con `docs/03-modelo-datos.md` §1. Solo incluyen lo que necesitan las
 * reglas del reto (`repte.ts`) y la UI de la fase 1. Sin dependencias de framework.
 *
 * Convención de fechas: las fechas de ascensión son **fechas de calendario** en
 * formato ISO `YYYY-MM-DD` (sin hora ni zona horaria). Se comparan como strings,
 * lo que es correcto porque el formato es de ancho fijo.
 */

/** Fecha de calendario ISO `YYYY-MM-DD` (sin hora). Ver `esDataIsoValida`. */
export type DataISO = string;

/** Instante ISO 8601 con hora (p. ej. `2026-09-27T10:00:00.000Z`). Solo metadatos. */
export type InstantISO = string;

/** Ámbito geográfico de la lista FEEC (en SQL: enum `ambit`, con `_`). */
export const ZONES = ['catalunya', 'andorra', 'catalunya-nord'] as const;
export type Zona = (typeof ZONES)[number];

/**
 * Métodos de ascensión admitidos: sin vehículos a motor; se aceptan BTT, esquí y
 * raquetas (normativa FEEC, `03-modelo-datos.md` §3.1). En SQL el enum usa `_`
 * (`a_peu`); la capa de datos hace la conversión.
 */
export const METODES = ['a-peu', 'btt', 'esqui', 'raquetes'] as const;
export type Metode = (typeof METODES)[number];

/** Valoración MIDE (1–5 en cada eje) de la ruta normal. */
export interface Mide {
	medi: 1 | 2 | 3 | 4 | 5;
	itinerari: 1 | 2 | 3 | 4 | 5;
	desplacament: 1 | 2 | 3 | 4 | 5;
	esforc: 1 | 2 | 3 | 4 | 5;
}

export type TipusRestriccio = 'fauna' | 'obres' | 'propietat' | 'militar' | 'altres';

/**
 * Restricción de acceso a una cima (`restriccions_acces`, §1.1).
 * - Periodo recurrente anual `MM-DD`..`MM-DD` (puede cruzar el cambio de año).
 * - Rango puntual de fechas (`dataInici`/`dataFi`; `null` = abierto por ese lado).
 * - Si no hay ni periodo ni rango, es permanente.
 */
export interface RestriccioAcces {
	tipus: TipusRestriccio;
	periodeIniciMmdd: string | null;
	periodeFiMmdd: string | null;
	dataInici: DataISO | null;
	dataFi: DataISO | null;
	fontUrl: string;
	/** `false` = restricción ya no vigente (se ignora). Por defecto se considera vigente. */
	vigent?: boolean;
}

/** Cima del catálogo (lectura pública). */
export interface Cim {
	/** Id estable propio (1..n); nunca se reutiliza. */
	id: number;
	slug: string;
	/** Nombre visible (catalán). */
	nom: string;
	/** Con artículo: "el Pedraforca", "la Picossa". */
	nom_amb_article: string;
	/** Con preposición: "del Pedraforca", "de la Picossa". */
	nom_amb_de: string;
	/** Altitud en metros (entero). Catálogo propio: ICGC/IGN/OSM/Wikidata, no la tabla FEEC. */
	altitud: number;
	/** Identificador (slug/código) de la comarca asignada por la FEEC. */
	comarca: string;
	zona: Zona;
	/** Pertenece a la lista de 150 esenciales (normativa desde el 01/07/2019). */
	essencial: boolean;
	/** WGS84; `null` hasta que la coordenada esté verificada. */
	lat: number | null;
	lon: number | null;
	mide?: Mide;
	restriccions: RestriccioAcces[];
}

/** Procedencia de un dato del catálogo (`fonts_dades.font` en SQL). */
export const FONTS_DADES = [
	'feec_pdf_essencials',
	'icgc',
	'icgc_mdt',
	'ign',
	'ign_alti',
	'osm',
	'wikidata',
	'manual'
] as const;
export type FontDada = (typeof FONTS_DADES)[number];

/** Procedencia de un campo concreto: fuente + identificador/URL del registro original. */
export interface FontCamp {
	font: FontDada;
	/** Id del registro en la fuente (nodo OSM, Qid, cleabs IGN, topónimo ICGC...). */
	ref: string | null;
	url: string | null;
	/** Obligatoria si `font = 'manual'`: de dónde sale el dato y cómo se ha comprobado. */
	nota?: string;
}

export type Confianca = 'alta' | 'mitjana' | 'baixa';
export type EstatRevisio = 'esborrany' | 'revisat';

/**
 * Cima tal como está en el catálogo estático (`src/lib/data/catalog/cims.json`):
 * `Cim` + metadatos de procedencia y revisión.
 */
export interface CimCataleg extends Cim {
	/** Nombre tal cual en la lista de esenciales de la FEEC (PDF). */
	nom_oficial: string;
	/** Topónimo en la fuente geográfica usada (ICGC/IGN/OSM); `null` si no hay. */
	toponim: string | null;
	/** Otros nombres para la búsqueda ("Pedraforca", "Mont Caro"...). */
	alies: string[];
	fonts: { nom: FontCamp; coordenades: FontCamp | null; altitud: FontCamp | null };
	confianca: Confianca;
	estat_revisio: EstatRevisio;
}

/** Comarca o zona (`comarques.json`). */
export interface ComarcaCataleg {
	slug: string;
	nom: string;
	/** "l'Alt Camp", "el Bages", "Osona", "la Catalunya Nord". */
	nom_amb_article: string;
	/** "de l'Alt Camp", "del Bages", "d'Osona". */
	nom_amb_de: string;
	zona: Zona;
	/** `id_comarca` del ICGC (1..43); `null` fuera de Catalunya. */
	codi_icgc: number | null;
	n_essencials: number;
}

/** Ascensión registrada por el usuario (local-first; mismos campos que la nube). */
export interface Ascensio {
	/** UUIDv7 generado en el cliente. */
	id: string;
	cimId: number;
	/** Fecha de calendario de la ascensión. */
	data: DataISO;
	metode: Metode;
	nota: string | null;
	createdAt: InstantISO;
	updatedAt: InstantISO;
	/** Tombstone de sincronización: si tiene valor, la ascensión está borrada. */
	deletedAt?: InstantISO | null;
}

/** Nivel de reconocimiento: 0 = aún sin el 100; 1..5 = 100, 2×100 … 5×100. */
export type Nivell = 0 | 1 | 2 | 3 | 4 | 5;

/** El catálogo se acepta como lista o como mapa indexado por `id`. */
export type Cataleg = readonly Cim[] | ReadonlyMap<number, Cim>;
