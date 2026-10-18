/**
 * Previsió meteorològica d'un cim (fase 6): contracte de `GET /api/meteo/{slug}` i client.
 *
 * - El navegador **només** parla amb el nostre servidor (`/api/meteo/{slug}`, mateix origen): el
 *   Worker de Cloudflare demana la previsió al proveïdor (avui Open-Meteo) i la desa 3 h a la seva
 *   cache. El proveïdor no rep mai la IP ni cap dada del visitant (vegeu `content/privacitat.ts`).
 * - Resposta pròpia i compacta, independent del proveïdor (`ProveidorMeteo` al servidor): canviar
 *   a MET Norway no canvia aquest contracte.
 * - Dades amb llicència CC BY 4.0: la UI ha de mostrar `font` (nom amb enllaç i llicència).
 * - Sense xarxa, el service worker torna l'última previsió desada d'aquell cim (network-first):
 *   la UI ha de mostrar `actualitzat` perquè es vegi si és antiga.
 */
import type { DataISO, InstantISO } from '$lib/domain';
// Import directe (no l'índex de `$lib/domain`): aquest mòdul el carreguen pàgines públiques.
import { categoriaTemps, esCategoriaTemps, type CategoriaTemps } from '$lib/domain/temps';

export interface FontMeteo {
	/** "Open-Meteo". */
	nom: string;
	/** Web del proveïdor (enllaç de l'atribució). */
	url: string;
	/** "CC BY 4.0". */
	llicencia: string;
	/** URL del text de la llicència. */
	llicenciaUrl: string;
}

export interface DiaMeteo {
	/** Dia local (Europe/Madrid), `AAAA-MM-DD`. */
	data: DataISO;
	/** Temperatura màxima i mínima a l'altitud del cim (°C, 1 decimal). */
	tMax: number;
	tMin: number;
	/** Vent mitjà màxim i ratxa màxima a 10 m (km/h, enters). */
	ventMax: number;
	ratxaMax: number;
	/** Precipitació total del dia (mm, 1 decimal). */
	precipitacio: number;
	/** Probabilitat màxima de precipitació (%), si el model la dona. */
	probPrecipitacio: number | null;
	/** Codi de temps WMO (0 serè … 95–99 tempesta). */
	codi: number;
	/** Isoterma de 0 °C: la cota més baixa del dia (m, arrodonida a 10 m), si el model la dona. */
	iso0?: number;
	/** Nuvolositat mitjana del dia (%), si el model la dona. */
	nuvolositat?: number;
}

export interface PrevisioMeteo {
	/** Quan es va obtenir del proveïdor (ISO amb hora, UTC). */
	actualitzat: InstantISO;
	/** Altitud (m) per a la qual s'ha calculat la previsió: la del cim. */
	altitud: number;
	font: FontMeteo;
	/** Avui i els dies següents (3–4 dies), en ordre. */
	dies: DiaMeteo[];
}

/** Camí de l'API de meteo d'un cim (mateix origen; sense idioma). */
export function camiMeteo(slug: string): string {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new RangeError(`Slug invàlid: ${slug}`);
	return `/api/meteo/${slug}`;
}

export class ErrorMeteo extends Error {
	/** 404: el cim no existeix; 502/503: proveïdor no disponible; 0: sense xarxa. */
	readonly estat: number;
	constructor(estat: number, missatge: string) {
		super(missatge);
		this.name = 'ErrorMeteo';
		this.estat = estat;
	}
}

/**
 * Previsió d'un cim per a la UI (client). Llança `ErrorMeteo` si no se'n pot obtenir cap
 * (ni de la xarxa ni de la còpia del service worker).
 */
export async function obtenirMeteo(
	slug: string,
	opcions: { signal?: AbortSignal; fetch?: typeof fetch } = {}
): Promise<PrevisioMeteo> {
	const f = opcions.fetch ?? fetch;
	let res: Response;
	try {
		res = await f(camiMeteo(slug), {
			signal: opcions.signal,
			headers: { accept: 'application/json' }
		});
	} catch (e) {
		if ((e as Error)?.name === 'AbortError') throw e;
		throw new ErrorMeteo(0, 'Sense connexió');
	}
	if (!res.ok) throw new ErrorMeteo(res.status, `Meteo no disponible (HTTP ${res.status})`);
	const dades = (await res.json()) as PrevisioMeteo;
	if (!Array.isArray(dades?.dies)) throw new ErrorMeteo(502, 'Resposta de meteo no vàlida');
	return dades;
}

// ---------------------------------------------------------------------------
// Temps actual de molts cims alhora (R5.2: icona a les llistes)
// ---------------------------------------------------------------------------

/**
 * Camí de `GET /api/meteo/ara`: el temps actual de **tots** els cims del catàleg en una sola
 * resposta (~5 kB per a 150 cims). Al servidor és una sola foto del catàleg sencer (una sola
 * clau de cache, renovada cada hora), de manera que demanar-ho tot no costa més que demanar-ne
 * uns quants. `?slugs=a,b,c` (màx. `MAX_SLUGS_METEO_ARA`) només retalla la resposta.
 */
export const CAMI_METEO_ARA = '/api/meteo/ara';
/** Màxim de slugs a `?slugs=` (una llista de cims en mostra com a molt 150). */
export const MAX_SLUGS_METEO_ARA = 150;

/** Temps actual compacte d'un cim. */
export interface TempsActual {
	/** Categoria d'icona (`categoriaTemps` del codi WMO). */
	categoria: CategoriaTemps;
	/** Codi de temps WMO original. */
	codi: number;
	/** Temperatura actual a l'altitud del cim (°C, enter). */
	temperatura: number;
	/** De dia (`true`) o de nit: `sol` de nit es pot pintar com a lluna. */
	esDia: boolean;
}

export interface MeteoAra {
	/** Quan el servidor ho va obtenir del proveïdor (ISO amb hora, UTC). */
	actualitzat: InstantISO;
	/** Hora local (Europe/Madrid) de validesa de les dades, `AAAA-MM-DDTHH:MM` (quarts d'hora). */
	hora: string;
	/** Atribució CC BY 4.0 que la UI ha de mostrar a prop de les icones. */
	font: FontMeteo;
	/** Per slug. Els cims sense dades (o sense coordenades) no hi surten. */
	cims: Record<string, TempsActual>;
}

const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Camí de l'API amb el filtre opcional de slugs (ordenats i sense repetits: millor cache). */
export function camiMeteoAra(slugs?: readonly string[]): string {
	if (!slugs) return CAMI_METEO_ARA;
	const unics = [...new Set(slugs)].sort();
	if (unics.length === 0 || unics.length > MAX_SLUGS_METEO_ARA) {
		throw new RangeError(`Nombre de slugs invàlid: ${unics.length}`);
	}
	for (const s of unics) if (!RE_SLUG.test(s)) throw new RangeError(`Slug invàlid: ${s}`);
	return `${CAMI_METEO_ARA}?slugs=${unics.join(',')}`;
}

/** Temps màxim d'espera al client: una icona que no arriba no ha de bloquejar res. */
export const TIMEOUT_METEO_ARA_MS = 8000;

function esTempsActual(v: unknown): v is TempsActual {
	const t = v as TempsActual | null;
	return (
		typeof t === 'object' &&
		t !== null &&
		esCategoriaTemps(t.categoria) &&
		Number.isInteger(t.codi) &&
		categoriaTemps(t.codi) === t.categoria &&
		Number.isFinite(t.temperatura) &&
		typeof t.esDia === 'boolean'
	);
}

/**
 * Temps actual dels cims per a les llistes (client). **No llança mai**: sense xarxa, amb error
 * del servidor, resposta mal formada, temps d'espera esgotat o petició cancel·lada torna `null`
 * i la llista es pinta sense icones. Les entrades mal formades es descarten una a una.
 *
 * El service worker no en desa còpia (estratègia `xarxa`): el temps "actual" de fa hores enganya.
 */
export async function obtenirMeteoAra(
	opcions: { slugs?: readonly string[]; signal?: AbortSignal; fetch?: typeof fetch } = {}
): Promise<MeteoAra | null> {
	const f = opcions.fetch ?? fetch;
	try {
		const timeout = AbortSignal.timeout(TIMEOUT_METEO_ARA_MS);
		const res = await f(camiMeteoAra(opcions.slugs), {
			signal: opcions.signal ? AbortSignal.any([opcions.signal, timeout]) : timeout,
			headers: { accept: 'application/json' }
		});
		if (!res.ok) return null;
		const d = (await res.json()) as Partial<MeteoAra> | null;
		if (
			typeof d !== 'object' ||
			d === null ||
			typeof d.actualitzat !== 'string' ||
			typeof d.hora !== 'string' ||
			typeof d.font?.nom !== 'string' ||
			typeof d.cims !== 'object' ||
			d.cims === null
		) {
			return null;
		}
		const cims: Record<string, TempsActual> = {};
		for (const [slug, t] of Object.entries(d.cims)) {
			if (RE_SLUG.test(slug) && esTempsActual(t)) cims[slug] = t;
		}
		return { actualitzat: d.actualitzat, hora: d.hora, font: d.font as FontMeteo, cims };
	} catch {
		return null;
	}
}
