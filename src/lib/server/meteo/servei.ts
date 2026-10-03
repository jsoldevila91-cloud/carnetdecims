/**
 * Servei de `GET /api/meteo/{slug}` (Worker de Cloudflare): proxy amb cache cap al proveïdor.
 *
 * - Clau de cache per cim (només slugs del catàleg → nombre de claus acotat, el proveïdor rep com
 *   a màxim ~8 crides per cim i dia per centre de dades, passi el que passi amb el trànsit).
 * - Fresca durant 3 h (`TTL_FRESCA_S`). Es guarda fins a 24 h (`TTL_CACHE_S`) per poder tornar
 *   la darrera previsió si el proveïdor falla (*stale-if-error*, capçalera `x-carnet-meteo: STALE`).
 * - Al navegador: `max-age` curt (15 min). El service worker, a més, en desa la darrera resposta
 *   per a l'ús sense xarxa (`platform/sw/estrategia.ts`, estratègia `meteo`).
 * - Errors: 404 JSON si el cim no existeix o no té coordenades; 502 JSON si el proveïdor falla i
 *   no hi ha còpia. Mai es reenvia la resposta del proveïdor tal qual.
 *
 * Cache API: `platform.caches.default` (per centre de dades). No funciona als subdominis
 * `*.workers.dev` (allà cada petició va al proveïdor); sí amb el domini propi i a `wrangler dev`.
 * A més, el worker de `adapter-cloudflare` desa a `caches.default` (per URL) tota resposta < 400
 * amb `Cache-Control`: davant d'aquesta cache n'hi ha una altra de 15 min (`max-age`) que serveix
 * la resposta tal com va sortir (amb la seva capçalera `x-carnet-meteo`).
 */
import type { PrevisioMeteo } from '$lib/platform/meteo';
import type { ProveidorMeteo, PuntMeteo } from './proveidor';

/** Dies de previsió: avui + 3. */
export const DIES_PREVISIO = 4;
/** Temps durant el qual una previsió desada es serveix sense tornar a preguntar (3 h). */
export const TTL_FRESCA_S = 3 * 60 * 60;
/** Temps que es guarda a la cache del Worker (per al *stale-if-error*). */
export const TTL_CACHE_S = 24 * 60 * 60;
/** `max-age` per al navegador. */
export const MAX_AGE_NAVEGADOR_S = 15 * 60;
/** Versió del format de la resposta: forma part de la clau de cache. */
export const VERSIO_FORMAT = 1;

const CAPCALERA_OBTINGUT = 'x-carnet-meteo-obtingut';
export const CAPCALERA_ESTAT_CACHE = 'x-carnet-meteo';

/** El subconjunt de la Cache API que es fa servir (es pot substituir als tests). */
export interface CacheMeteo {
	match(req: Request): Promise<Response | undefined>;
	put(req: Request, res: Response): Promise<void>;
}

export interface OpcionsServei {
	slug: string;
	/** Origen de la petició (`https://carnetdecims.cat`): base de la clau de cache. */
	origen: string;
	/** Punt del cim, o `undefined` si el slug no és del catàleg (o no té coordenades). */
	punt: PuntMeteo | undefined;
	proveidor: ProveidorMeteo;
	cache?: CacheMeteo;
	/** `ctx.waitUntil` del Worker: desar a la cache sense fer esperar la resposta. */
	enSegonPla?: (p: Promise<unknown>) => void;
	ara?: () => Date;
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

const PER_AL_NAVEGADOR = { 'cache-control': `public, max-age=${MAX_AGE_NAVEGADOR_S}` };
const SENSE_CACHE = { 'cache-control': 'no-store' };

export function clauCache(origen: string, slug: string): Request {
	return new Request(`${origen}/api/meteo/${slug}?v=${VERSIO_FORMAT}`, { method: 'GET' });
}

export async function respostaMeteo(o: OpcionsServei): Promise<Response> {
	if (!o.punt) return json({ error: 'cim_desconegut' }, 404, SENSE_CACHE);
	const ara = o.ara ?? (() => new Date());
	const clau = clauCache(o.origen, o.slug);

	let desada: Response | undefined;
	try {
		desada = await o.cache?.match(clau);
	} catch {
		desada = undefined;
	}
	const obtingut = Number(desada?.headers.get(CAPCALERA_OBTINGUT));
	const edatS = Number.isFinite(obtingut) ? (ara().getTime() - obtingut) / 1000 : Infinity;
	if (desada && edatS >= 0 && edatS < TTL_FRESCA_S) {
		return json(await desada.json(), 200, { ...PER_AL_NAVEGADOR, [CAPCALERA_ESTAT_CACHE]: 'HIT' });
	}

	let previsio: PrevisioMeteo;
	try {
		const dies = await o.proveidor.previsio(o.punt, DIES_PREVISIO);
		previsio = {
			actualitzat: ara().toISOString(),
			altitud: Math.round(o.punt.altitud),
			font: o.proveidor.font,
			dies
		};
	} catch (e) {
		console.error(`[meteo] ${o.slug}: ${(e as Error)?.message ?? e}`);
		if (desada && edatS < TTL_CACHE_S) {
			return json(await desada.json(), 200, {
				'cache-control': 'public, max-age=300',
				[CAPCALERA_ESTAT_CACHE]: 'STALE'
			});
		}
		return json({ error: 'proveidor_no_disponible' }, 502, SENSE_CACHE);
	}

	if (o.cache) {
		const perDesar = json(previsio, 200, {
			'cache-control': `public, max-age=${TTL_CACHE_S}`,
			[CAPCALERA_OBTINGUT]: String(ara().getTime())
		});
		const desar = o.cache.put(clau, perDesar).catch(() => undefined);
		if (o.enSegonPla) o.enSegonPla(desar);
		else await desar;
	}
	return json(previsio, 200, { ...PER_AL_NAVEGADOR, [CAPCALERA_ESTAT_CACHE]: 'MISS' });
}
