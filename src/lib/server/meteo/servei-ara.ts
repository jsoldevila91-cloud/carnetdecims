/**
 * Servei de `GET /api/meteo/ara` (Worker de Cloudflare): temps actual de tots els cims per a les
 * icones de les llistes (R5.2).
 *
 * - **Una sola foto** del catàleg sencer (una clau de cache, `clauCacheAra`), obtinguda amb una
 *   crida multipunt a Open-Meteo (trossos de `MAX_PUNTS_PER_CRIDA`). El filtre `?slugs=` només
 *   retalla la resposta: qualsevol combinació de cims surt de la mateixa foto, de manera que el
 *   proveïdor rep com a màxim una foto per hora i centre de dades, passi el que passi amb el
 *   trànsit. Pressupost (pitjor cas, comptant cada punt com una crida): 150 punts × 24 = 3.600
 *   crides/dia per centre de dades, a sumar a les de `/api/meteo/{slug}` (límit: 10.000/dia).
 *   Amb el catàleg de 522 caldrà revisar-ho (allargar `TTL_FRESCA_ARA_S` o reduir punts).
 * - Fresca durant 1 h (`TTL_FRESCA_ARA_S`): les dades "actuals" d'Open-Meteo són de quarts
 *   d'hora i per a una icona n'hi ha prou. Es guarda fins a 3 h (`TTL_CACHE_ARA_S`) per tornar la
 *   darrera foto si el proveïdor falla (*stale-if-error*, `x-carnet-meteo: STALE`); més antiga ja
 *   no es fa servir (el temps "actual" de fa hores enganya).
 * - Al navegador: `max-age` de 10 min. El service worker no la desa (`estrategia.ts`: `xarxa`).
 * - Validació estricta de la query: només `slugs`, un sol cop, 1..`MAX_SLUGS_METEO_ARA` slugs
 *   ben formats separats per comes; si no, 400 JSON. Els slugs ben formats que no són del
 *   catàleg s'ignoren (una pàgina desada pot ser d'una versió anterior del catàleg).
 */
import { MAX_SLUGS_METEO_ARA, type MeteoAra, type TempsActual } from '$lib/platform/meteo';
import { categoriaTemps } from '$lib/domain/temps';
import type { ProveidorMeteoActual, PuntMeteo } from './proveidor';
import { CAPCALERA_ESTAT_CACHE, type CacheMeteo } from './servei';

/** Temps durant el qual la foto desada es serveix sense tornar a preguntar (1 h). */
export const TTL_FRESCA_ARA_S = 60 * 60;
/** Temps màxim que es pot servir una foto antiga si el proveïdor falla (3 h). */
export const TTL_CACHE_ARA_S = 3 * 60 * 60;
/** `max-age` per al navegador. */
export const MAX_AGE_NAVEGADOR_ARA_S = 10 * 60;
/** Versió del format de la foto desada: forma part de la clau de cache. */
export const VERSIO_FORMAT_ARA = 1;

const CAPCALERA_OBTINGUT = 'x-carnet-meteo-obtingut';
const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Longitud màxima de la query (150 slugs llargs hi caben de sobres). */
const MAX_LLARGADA_QUERY = 8 * 1024;

export interface CimMeteoAra {
	slug: string;
	punt: PuntMeteo;
}

export interface OpcionsServeiAra {
	/** URL de la petició (per a la query i l'origen de la clau de cache). */
	url: URL;
	/** Cims del catàleg amb coordenades (ordre del catàleg). */
	cims: readonly CimMeteoAra[];
	proveidor: ProveidorMeteoActual;
	cache?: CacheMeteo;
	enSegonPla?: (p: Promise<unknown>) => void;
	ara?: () => Date;
}

export type ErrorQueryAra =
	| 'parametre_desconegut'
	| 'slugs_repetit'
	| 'slugs_buit'
	| 'slug_invalid'
	| 'massa_slugs'
	| 'query_massa_llarga';

/**
 * Valida la query: `null` = tots els cims; un conjunt = filtre; `{ error }` = 400.
 * Els slugs repetits dins la llista es compten un cop.
 */
export function llegirQueryAra(url: URL): Set<string> | null | { error: ErrorQueryAra } {
	if (url.search.length > MAX_LLARGADA_QUERY) return { error: 'query_massa_llarga' };
	const claus = [...url.searchParams.keys()];
	if (claus.some((k) => k !== 'slugs')) return { error: 'parametre_desconegut' };
	const valors = url.searchParams.getAll('slugs');
	if (valors.length === 0) return null;
	if (valors.length > 1) return { error: 'slugs_repetit' };
	if (valors[0] === '') return { error: 'slugs_buit' };
	const slugs = valors[0].split(',');
	if (slugs.some((s) => !RE_SLUG.test(s))) return { error: 'slug_invalid' };
	const unics = new Set(slugs);
	if (unics.size > MAX_SLUGS_METEO_ARA) return { error: 'massa_slugs' };
	return unics;
}

export function clauCacheAra(origen: string): Request {
	return new Request(`${origen}/api/meteo/ara?v=${VERSIO_FORMAT_ARA}`, { method: 'GET' });
}

function json(cos: unknown, estat: number, capcaleres: Record<string, string>): Response {
	return new Response(JSON.stringify(cos), {
		status: estat,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'x-robots-tag': 'noindex',
			...capcaleres
		}
	});
}

const SENSE_CACHE = { 'cache-control': 'no-store' };
const PER_AL_NAVEGADOR = { 'cache-control': `public, max-age=${MAX_AGE_NAVEGADOR_ARA_S}` };

function filtrar(foto: MeteoAra, filtre: Set<string> | null): MeteoAra {
	if (!filtre) return foto;
	const cims: Record<string, TempsActual> = {};
	for (const s of filtre) if (Object.hasOwn(foto.cims, s)) cims[s] = foto.cims[s];
	return { ...foto, cims };
}

async function obtenirFoto(o: OpcionsServeiAra, ara: Date): Promise<MeteoAra> {
	const brut = await o.proveidor.actual(o.cims.map((c) => c.punt));
	const cims: Record<string, TempsActual> = {};
	let hora: string | null = null;
	o.cims.forEach((c, i) => {
		const a = brut[i];
		if (!a) return;
		const categoria = categoriaTemps(a.codi);
		if (!categoria) return;
		cims[c.slug] = {
			categoria,
			codi: a.codi,
			temperatura: Math.round(a.temperatura) || 0,
			esDia: a.esDia
		};
		if (hora === null || a.hora > hora) hora = a.hora;
	});
	if (hora === null) throw new Error('cap cim amb dades');
	return { actualitzat: ara.toISOString(), hora, font: o.proveidor.font, cims };
}

/**
 * Foto en curs per proveïdor dins del mateix isolate: si arriben moltes peticions just quan la
 * foto caduca, només la primera pregunta al proveïdor i la resta l'esperen.
 */
const enCurs = new WeakMap<ProveidorMeteoActual, Promise<MeteoAra>>();

function fotoCompartida(o: OpcionsServeiAra, ara: Date): Promise<MeteoAra> {
	const existent = enCurs.get(o.proveidor);
	if (existent) return existent;
	const p = obtenirFoto(o, ara).finally(() => enCurs.delete(o.proveidor));
	enCurs.set(o.proveidor, p);
	return p;
}

export async function respostaMeteoAra(o: OpcionsServeiAra): Promise<Response> {
	const filtre = llegirQueryAra(o.url);
	if (filtre && !(filtre instanceof Set)) return json(filtre, 400, SENSE_CACHE);

	const ara = (o.ara ?? (() => new Date()))();
	const clau = clauCacheAra(o.url.origin);

	let desada: Response | undefined;
	try {
		desada = await o.cache?.match(clau);
	} catch {
		desada = undefined;
	}
	const obtingut = Number(desada?.headers.get(CAPCALERA_OBTINGUT));
	const edatS = Number.isFinite(obtingut) ? (ara.getTime() - obtingut) / 1000 : Infinity;
	if (desada && edatS >= 0 && edatS < TTL_FRESCA_ARA_S) {
		const foto = (await desada.json()) as MeteoAra;
		return json(filtrar(foto, filtre), 200, {
			...PER_AL_NAVEGADOR,
			[CAPCALERA_ESTAT_CACHE]: 'HIT'
		});
	}

	let foto: MeteoAra;
	try {
		foto = await fotoCompartida(o, ara);
	} catch (e) {
		console.error(`[meteo-ara] ${(e as Error)?.message ?? e}`);
		if (desada && edatS >= 0 && edatS < TTL_CACHE_ARA_S) {
			const antiga = (await desada.json()) as MeteoAra;
			return json(filtrar(antiga, filtre), 200, {
				'cache-control': 'public, max-age=300',
				[CAPCALERA_ESTAT_CACHE]: 'STALE'
			});
		}
		return json({ error: 'proveidor_no_disponible' }, 502, SENSE_CACHE);
	}

	if (o.cache) {
		const perDesar = json(foto, 200, {
			'cache-control': `public, max-age=${TTL_CACHE_ARA_S}`,
			[CAPCALERA_OBTINGUT]: String(ara.getTime())
		});
		const desar = o.cache.put(clau, perDesar).catch(() => undefined);
		if (o.enSegonPla) o.enSegonPla(desar);
		else await desar;
	}
	return json(filtrar(foto, filtre), 200, { ...PER_AL_NAVEGADOR, [CAPCALERA_ESTAT_CACHE]: 'MISS' });
}
