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
 * - **La foto no depèn que el visitant esperi** (el client abandona als 8 s i Open-Meteo pot
 *   trigar ~20 s en fred): en un MISS la foto (crida + `cache.put`) es comença en segon pla
 *   (`enSegonPla` = `ctx.waitUntil`, que la deixa acabar fins a 30 s després de la resposta) i la
 *   petició n'espera com a molt `ESPERA_MAX_ARA_MS`. Si no ha arribat: la foto anterior (STALE) si
 *   n'hi ha; si no, 503 amb `retry-after` i sense cache. El visitant següent la troba a la cache.
 *   Si la foto falla (502 o STALE), l'isolate no en torna a demanar cap durant
 *   `REPOS_DESPRES_ERROR_MS` (límit per minut d'Open-Meteo, que compta per punt).
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
	/** `ctx.waitUntil` del Worker: la foto i el `cache.put` acaben encara que la resposta surti. */
	enSegonPla?: (p: Promise<unknown>) => void;
	ara?: () => Date;
	/** Espera màxima de la foto nova (per defecte `ESPERA_MAX_ARA_MS`; els tests l'escurcen). */
	esperaMaxMs?: number;
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

/** Temps màxim que una petició espera la foto nova abans de respondre sense (~6 s). */
export const ESPERA_MAX_ARA_MS = 6000;
/** Sense foto ni còpia: `retry-after` (s) del 503 mentre la foto es prepara en segon pla. */
export const RETRY_AFTER_ARA_S = 30;
/**
 * Després d'una foto fallida, l'isolate no en torna a demanar cap durant aquest temps. Open-Meteo
 * compta cada punt com una crida (comprovat el 2026-10-18: amb ~900 punts en un minut torna 429
 * "Minutely API request limit exceeded", límit 600/min) i una foto en són 150.
 */
export const REPOS_DESPRES_ERROR_MS = 60_000;

interface EstatIsolate {
	/** Foto en curs: totes les peticions de l'isolate esperen la mateixa (inclou el `cache.put`). */
	enCurs?: Promise<MeteoAra>;
	/** Instant (ms) del darrer error del proveïdor. */
	darrerError?: number;
}

/** Estat per proveïdor dins del mateix isolate. */
const estats = new WeakMap<ProveidorMeteoActual, EstatIsolate>();

function estatDe(p: ProveidorMeteoActual): EstatIsolate {
	let e = estats.get(p);
	if (!e) estats.set(p, (e = {}));
	return e;
}

/**
 * Comença (o reaprofita) la foto i la desa a la cache quan arriba. La promesa es registra amb
 * `enSegonPla` (`ctx.waitUntil`) perquè la crida i el `cache.put` acabin encara que la resposta
 * ja hagi sortit. `undefined` si som en repòs després d'un error.
 */
function fotoEnSegonPla(
	o: OpcionsServeiAra,
	ara: Date,
	clau: Request
): Promise<MeteoAra> | undefined {
	const estat = estatDe(o.proveidor);
	if (estat.enCurs) {
		// També es registra a aquesta petició: la foto no depèn que la primera continuï viva.
		o.enSegonPla?.(estat.enCurs.catch(() => undefined));
		return estat.enCurs;
	}
	if (
		estat.darrerError !== undefined &&
		ara.getTime() - estat.darrerError < REPOS_DESPRES_ERROR_MS
	) {
		return undefined;
	}
	const p = (async () => {
		const foto = await obtenirFoto(o, ara);
		if (o.cache) {
			const perDesar = json(foto, 200, {
				'cache-control': `public, max-age=${TTL_CACHE_ARA_S}`,
				[CAPCALERA_OBTINGUT]: String(Date.parse(foto.actualitzat))
			});
			await o.cache.put(clau, perDesar).catch(() => undefined);
		}
		return foto;
	})();
	estat.enCurs = p;
	p.then(
		() => {
			estat.darrerError = undefined;
		},
		(e) => {
			estat.darrerError = ara.getTime();
			console.error(`[meteo-ara] ${(e as Error)?.message ?? e}`);
		}
	).finally(() => {
		if (estat.enCurs === p) estat.enCurs = undefined;
	});
	// Sempre resolta: `waitUntil` no ha de veure un rebuig.
	o.enSegonPla?.(p.catch(() => undefined));
	return p;
}

const ESGOTAT = Symbol('esgotat');

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

	// MISS: la foto es fa en segon pla i aquí només s'espera `ESPERA_MAX_ARA_MS`.
	const enCurs = fotoEnSegonPla(o, ara, clau);
	let resultat: MeteoAra | typeof ESGOTAT | Error = ESGOTAT;
	if (enCurs) {
		let temporitzador: ReturnType<typeof setTimeout> | undefined;
		const espera = new Promise<typeof ESGOTAT>((r) => {
			temporitzador = setTimeout(() => r(ESGOTAT), o.esperaMaxMs ?? ESPERA_MAX_ARA_MS);
		});
		resultat = await Promise.race([enCurs.catch((e: unknown) => toError(e)), espera]);
		clearTimeout(temporitzador);
	}
	if (resultat !== ESGOTAT && !(resultat instanceof Error)) {
		return json(filtrar(resultat, filtre), 200, {
			...PER_AL_NAVEGADOR,
			[CAPCALERA_ESTAT_CACHE]: 'MISS'
		});
	}

	if (desada && edatS >= 0 && edatS < TTL_CACHE_ARA_S) {
		const antiga = (await desada.json()) as MeteoAra;
		return json(filtrar(antiga, filtre), 200, {
			'cache-control': 'public, max-age=300',
			[CAPCALERA_ESTAT_CACHE]: 'STALE'
		});
	}
	if (resultat instanceof Error) {
		return json({ error: 'proveidor_no_disponible' }, 502, SENSE_CACHE);
	}
	// Encara es prepara (o repòs després d'un error): el visitant següent la trobarà a la cache.
	return json({ error: 'meteo_en_preparacio' }, 503, {
		...SENSE_CACHE,
		'retry-after': String(RETRY_AFTER_ARA_S)
	});
}

function toError(e: unknown): Error {
	return e instanceof Error ? e : new Error(String(e));
}
