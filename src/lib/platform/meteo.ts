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
