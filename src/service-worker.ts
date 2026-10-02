/**
 * Service worker de Carnet de Cims (docs/05-frontend-arquitectura.md §2).
 *
 * - Precache (cache-first) de la versió: JS/CSS/fonts amb hash, icones, el shell de `/app` i
 *   les pàgines offline. MapLibre i el seu worker en queden fora (`sw/diferits.ts`): entren a
 *   `recursos` quan es visita el mapa.
 * - Pàgines públiques (fitxes, comarques…): stale-while-revalidate amb LRU de 200 entrades.
 *   Sense xarxa i sense còpia → pàgina offline de l'idioma.
 * - Tesel·les ICGC/IGN/Mapterhorn: cache-first amb LRU (3.000 entrades / 60 MB). Només es desen
 *   respostes 200 CORS (mai opaques ni errors).
 * - No s'intercepta `/api/*` ni cap petició que no sigui GET. Les dades de l'usuari són a
 *   IndexedDB, no aquí.
 * - Actualització controlada: sense `skipWaiting` automàtic; la pàgina envia
 *   `{ type: 'SKIP_WAITING' }` quan l'usuari tria "Actualitza" (`platform/pwa.ts`).
 *
 * La lògica que es pot provar sense navegador és a `$lib/platform/sw/`.
 */
/// <reference types="@sveltejs/kit" />
import { build, files, prerendered, version } from '$service-worker';
import { connexioPermetPrecarrega, type InfoConnexio } from '$lib/platform/sw/connexio';
import {
	CACHES,
	CAPCALERA_VERSIO,
	LIMITS,
	MISSATGE,
	cachesObsoletes,
	esFitxaOComarca,
	estrategiaPer,
	htmlEsDeLaVersio,
	llistaPrecache,
	normalitzaCami,
	paginaOffline,
	type Estrategia,
	type LocaleSW
} from '$lib/platform/sw/estrategia';
import { IndexLru, type LimitsLru } from '$lib/platform/sw/lru';

// --- Tipus mínims del context de service worker (el projecte carrega els tipus de Cloudflare
// Workers i del DOM, no `lib.webworker`). ---
type EventAmpliable = Event & { waitUntil(p: Promise<unknown>): void };
type EventFetch = EventAmpliable & {
	request: Request;
	respondWith(r: Response | Promise<Response>): void;
};
type EventMissatge = EventAmpliable & { data: unknown; ports: readonly MessagePort[] };
type AmbitSW = {
	location: Location;
	navigator: Navigator & { connection?: InfoConnexio };
	clients: { claim(): Promise<void> };
	skipWaiting(): Promise<void>;
	addEventListener(tipus: 'install' | 'activate', f: (e: EventAmpliable) => void): void;
	addEventListener(tipus: 'fetch', f: (e: EventFetch) => void): void;
	addEventListener(tipus: 'message', f: (e: EventMissatge) => void): void;
};
const sw = globalThis as unknown as AmbitSW;

// Fitxers diferits calculats en el build del client (`sw/plugin-vite.ts`). En dev pot no existir.
const diferitsJson = import.meta.glob<string[]>('/.svelte-kit/sw-diferits.json', {
	eager: true,
	import: 'default'
});
const DIFERITS = new Set<string>(Object.values(diferitsJson)[0] ?? []);

const NOM_PRECACHE = CACHES.precache(version);
const PRECACHE = llistaPrecache({ build, files, prerendered, diferits: DIFERITS });
const CLAUS_PRECACHE = new Set(PRECACHE.map((e) => e.url));
const BUILD = new Set(build);
const ORIGEN = sw.location.origin;
const CLAU_REVALIDAR = `${ORIGEN}/__sw/revalidar`;

// --- Utilitats ---

async function ambConcurrencia<T>(
	elements: readonly T[],
	maxim: number,
	feina: (e: T) => Promise<void>
): Promise<void> {
	let seguent = 0;
	const fil = async () => {
		while (seguent < elements.length) await feina(elements[seguent++]);
	};
	await Promise.all(Array.from({ length: Math.min(maxim, elements.length) }, fil));
}

/** Capçaleres per a una resposta reconstruïda (el cos ja és descomprimit). */
function capcaleres(origen: Headers, extra?: Record<string, string>): Headers {
	const h = new Headers(origen);
	h.delete('content-length');
	h.delete('content-encoding');
	for (const [k, v] of Object.entries(extra ?? {})) h.set(k, v);
	return h;
}

function esHtml(res: Response): boolean {
	return (res.headers.get('content-type') ?? '').includes('text/html');
}

function respostaSenseXarxa(): Response {
	return Response.error();
}

// --- Índexs LRU persistents (a la cache `meta`) ---

class CacheLru {
	readonly nom: string;
	readonly limits: LimitsLru;
	#index: Promise<IndexLru> | null = null;
	#desat: Promise<void> | null = null;

	constructor(nom: string, limits: LimitsLru) {
		this.nom = nom;
		this.limits = limits;
	}

	get #clauMeta(): string {
		return `${ORIGEN}/__sw/lru/${this.nom}`;
	}

	index(): Promise<IndexLru> {
		this.#index ??= this.#carrega().catch(() => new IndexLru(this.limits));
		return this.#index;
	}

	async #carrega(): Promise<IndexLru> {
		const meta = await caches.open(CACHES.meta);
		const desat = await meta.match(this.#clauMeta);
		const dades: unknown = desat ? await desat.json().catch(() => null) : null;
		const index = IndexLru.deserialitzar(dades, this.limits);
		const cache = await caches.open(this.nom);
		const fora = index.reconciliar((await cache.keys()).map((r) => r.url));
		await Promise.all(fora.map((c) => cache.delete(c, { ignoreVary: true })));
		return index;
	}

	/** Desa la resposta i aplica els límits. Si ella sola no hi cap, no queda desada. */
	async desa(
		clau: string,
		resposta: Response,
		bytes: number,
		event: EventAmpliable
	): Promise<void> {
		const cache = await caches.open(this.nom);
		try {
			await cache.put(clau, resposta);
		} catch {
			return; // quota plena, `Vary: *`…: no es desa
		}
		const index = await this.index();
		const fora = index.afegir(clau, bytes);
		await Promise.all(fora.map((c) => cache.delete(c, { ignoreVary: true })));
		this.programaDesat(event);
	}

	async toca(clau: string, event: EventAmpliable): Promise<void> {
		const index = await this.index();
		if (index.tocar(clau)) this.programaDesat(event);
	}

	async elimina(clau: string, event: EventAmpliable): Promise<void> {
		const index = await this.index();
		if (index.eliminar(clau)) this.programaDesat(event);
	}

	/** Desa l'índex al cap d'uns segons (agrupa molts canvis seguits, p. ex. en moure el mapa). */
	programaDesat(event: EventAmpliable): void {
		this.#desat ??= new Promise<void>((r) => setTimeout(r, 3000))
			.then(async () => {
				this.#desat = null;
				const index = await this.index();
				const meta = await caches.open(CACHES.meta);
				await meta.put(
					this.#clauMeta,
					new Response(JSON.stringify(index.serialitzar()), {
						headers: { 'content-type': 'application/json' }
					})
				);
			})
			.catch(() => {
				this.#desat = null;
			});
		event.waitUntil(this.#desat);
	}
}

const lruPagines = new CacheLru(CACHES.pagines, LIMITS.pagines);
const lruTeseles = new CacheLru(CACHES.teseles, LIMITS.teseles);

// --- Instal·lació: precache ---

async function precarrega(): Promise<void> {
	const cache = await caches.open(NOM_PRECACHE);
	const ja = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
	await ambConcurrencia(
		PRECACHE.filter((e) => !ja.has(e.url)),
		6,
		async ({ url, pagina }) => {
			const res = await fetch(new Request(url, { cache: 'reload', credentials: 'same-origin' }));
			if (res.status !== 200) throw new Error(`Precache ${url}: HTTP ${res.status}`);
			if (pagina) {
				const html = await res.text();
				// Si el servidor ja serveix una altra versió, la instal·lació falla i es reintenta.
				if (!htmlEsDeLaVersio(html, BUILD)) throw new Error(`Precache ${url}: altra versió`);
				await cache.put(url, new Response(html, { headers: capcaleres(res.headers) }));
			} else if (res.redirected) {
				await cache.put(url, new Response(await res.blob(), { headers: capcaleres(res.headers) }));
			} else {
				await cache.put(url, res);
			}
		}
	);
}

sw.addEventListener('install', (event) => {
	// Sense `skipWaiting()`: la versió nova espera que l'usuari triï "Actualitza".
	event.waitUntil(precarrega());
});

// --- Activació: neteja de versions ---

async function neteja(): Promise<void> {
	await Promise.all(cachesObsoletes(await caches.keys(), version).map((n) => caches.delete(n)));

	// `recursos`: només els fitxers d'aquesta versió (MapLibre i el worker, si no han canviat).
	const recursos = await caches.open(CACHES.recursos);
	for (const req of await recursos.keys()) {
		if (!BUILD.has(new URL(req.url).pathname)) await recursos.delete(req);
	}

	// Pàgines desades amb una altra versió: apunten a fitxers que ja no hi són. Es treuen i es
	// tornen a baixar en segon pla a la primera navegació (`revalidaPendents`).
	const pagines = await caches.open(CACHES.pagines);
	const pendents: string[] = [];
	for (const req of await pagines.keys()) {
		const res = await pagines.match(req);
		if (res?.headers.get(CAPCALERA_VERSIO) !== version) {
			pendents.push(req.url);
			await pagines.delete(req);
		}
	}
	if (pendents.length > 0) {
		const meta = await caches.open(CACHES.meta);
		await meta.put(CLAU_REVALIDAR, new Response(JSON.stringify(pendents)));
	}
}

sw.addEventListener('activate', (event) => {
	// `claim()`: la primera instal·lació ja controla la pàgina oberta (offline sense recarregar).
	// En una actualització només s'arriba aquí després de SKIP_WAITING (o amb totes les pestanyes
	// tancades), i la pàgina recarrega en `controllerchange`.
	event.waitUntil(neteja().then(() => sw.clients.claim()));
});

// --- Pàgines ---

function urlPagina(url: string): string {
	const u = new URL(url);
	return `${u.origin}${normalitzaCami(u.pathname)}`;
}

/**
 * Baixa una pàgina pública i, si és HTML d'aquesta versió, la desa a `pagines`.
 * Retorna la resposta per a la pàgina (reconstruïda si se n'ha llegit el cos).
 */
async function baixaPagina(
	peticio: Request | string,
	clau: string,
	event: EventAmpliable
): Promise<Response> {
	const res = await fetch(peticio);
	if (res.status !== 200 || res.type !== 'basic' || !esHtml(res)) return res;
	const html = await res.text();
	const resposta = new Response(html, { status: 200, headers: capcaleres(res.headers) });
	if (htmlEsDeLaVersio(html, BUILD)) {
		const desar = new Response(html, {
			status: 200,
			headers: capcaleres(res.headers, { [CAPCALERA_VERSIO]: version })
		});
		event.waitUntil(lruPagines.desa(clau, desar, html.length, event));
	}
	return resposta;
}

async function respostaOffline(locale: LocaleSW): Promise<Response> {
	return (
		(await caches.match(paginaOffline(locale), { cacheName: NOM_PRECACHE })) ?? respostaSenseXarxa()
	);
}

async function paginaSwr(
	event: EventFetch,
	e: Extract<Estrategia, { tipus: 'pagina' }>
): Promise<Response> {
	if (!e.desa) {
		try {
			return await fetch(event.request);
		} catch {
			return respostaOffline(e.locale);
		}
	}
	revalidaPendents(event);
	const clau = urlPagina(event.request.url);
	const cache = await caches.open(CACHES.pagines);
	const desada = await cache.match(clau);
	const xarxa = baixaPagina(event.request, clau, event);
	if (desada && desada.headers.get(CAPCALERA_VERSIO) === version) {
		event.waitUntil(xarxa.then(() => undefined).catch(() => undefined));
		event.waitUntil(lruPagines.toca(clau, event));
		return desada;
	}
	try {
		return await xarxa;
	} catch {
		return desada ?? respostaOffline(e.locale);
	}
}

/** Torna a baixar (en segon pla, amb bona connexió) les pàgines d'una versió anterior. */
let revalidant = false;
function revalidaPendents(event: EventAmpliable): void {
	if (revalidant) return;
	revalidant = true;
	const feina = (async () => {
		const meta = await caches.open(CACHES.meta);
		const desat = await meta.match(CLAU_REVALIDAR);
		if (!desat) return;
		if (!connexioPermetPrecarrega(sw.navigator.connection, sw.navigator.onLine)) return;
		await meta.delete(CLAU_REVALIDAR);
		const urls = ((await desat.json().catch(() => [])) as unknown[]).filter(
			(u): u is string => typeof u === 'string' && u.startsWith(`${ORIGEN}/`)
		);
		await ambConcurrencia(urls, 2, async (url) => {
			await lruPagines.elimina(url, event);
			await baixaPagina(url, url, event).catch(() => undefined);
		});
	})()
		.catch(() => undefined)
		.finally(() => {
			revalidant = false;
		});
	event.waitUntil(feina);
}

/** Precàrrega demanada per la pàgina (`precarregarFitxes`): només fitxes i comarques. */
async function precarregaPagines(
	camins: readonly unknown[],
	event: EventAmpliable
): Promise<{ descarregades: number; omeses: number; errors: number }> {
	const resultat = { descarregades: 0, omeses: 0, errors: 0 };
	const cache = await caches.open(CACHES.pagines);
	const valids = [
		...new Set(
			camins
				.filter((c): c is string => typeof c === 'string' && esFitxaOComarca(c))
				.map((c) => `${ORIGEN}${normalitzaCami(c)}`)
		)
	].slice(0, LIMITS.pagines.maxEntrades);
	resultat.omeses = camins.length - valids.length;
	await ambConcurrencia(valids, 2, async (url) => {
		const desada = await cache.match(url);
		if (desada?.headers.get(CAPCALERA_VERSIO) === version) {
			resultat.omeses++;
			return;
		}
		try {
			const res = await baixaPagina(url, url, event);
			if (res.status === 200) resultat.descarregades++;
			else resultat.errors++;
		} catch {
			resultat.errors++;
		}
	});
	return resultat;
}

// --- Recursos i tesel·les ---

async function deLaPrecache(event: EventFetch, clau: string, locale: LocaleSW | null) {
	const desada = await caches.match(clau, { cacheName: NOM_PRECACHE });
	if (desada) return desada;
	try {
		return await fetch(event.request);
	} catch {
		return locale ? respostaOffline(locale) : respostaSenseXarxa();
	}
}

async function recursImmutable(event: EventFetch): Promise<Response> {
	const cache = await caches.open(CACHES.recursos);
	const desat = await cache.match(event.request, { ignoreVary: true });
	if (desat) return desat;
	const res = await fetch(event.request);
	if (res.status === 200 && res.type === 'basic') {
		event.waitUntil(cache.put(event.request, res.clone()).catch(() => undefined));
	}
	return res;
}

/** Desa una resposta de mapa (només 200 i CORS o del mateix origen; mai opaca). */
function desaMapa(event: EventFetch, res: Response): void {
	if (res.status !== 200 || (res.type !== 'cors' && res.type !== 'basic')) return;
	const copia = res.clone();
	event.waitUntil(
		copia
			.blob()
			.then((cos) =>
				lruTeseles.desa(
					event.request.url,
					new Response(cos, { status: 200, headers: capcaleres(copia.headers) }),
					cos.size,
					event
				)
			)
			.catch(() => undefined)
	);
}

async function tesela(event: EventFetch): Promise<Response> {
	const cache = await caches.open(CACHES.teseles);
	const desada = await cache.match(event.request.url, { ignoreVary: true });
	if (desada) {
		event.waitUntil(lruTeseles.toca(event.request.url, event));
		return desada;
	}
	const res = await fetch(event.request);
	desaMapa(event, res);
	return res;
}

async function estilMapa(event: EventFetch): Promise<Response> {
	const cache = await caches.open(CACHES.teseles);
	const desada = await cache.match(event.request.url, { ignoreVary: true });
	const xarxa = fetch(event.request).then((res) => {
		desaMapa(event, res);
		return res;
	});
	if (desada) {
		event.waitUntil(xarxa.then(() => undefined).catch(() => undefined));
		return desada;
	}
	return xarxa;
}

// --- Encaminament ---

sw.addEventListener('fetch', (event) => {
	const { request } = event;
	const e = estrategiaPer(
		{
			url: request.url,
			method: request.method,
			mode: request.mode,
			destination: request.destination
		},
		ORIGEN,
		CLAUS_PRECACHE
	);
	switch (e.tipus) {
		case 'xarxa':
			return;
		case 'precache': {
			const locale = request.mode === 'navigate' ? (e.clau.startsWith('/es/') ? 'es' : 'ca') : null;
			event.respondWith(deLaPrecache(event, e.clau, locale));
			return;
		}
		case 'shell-app':
			event.respondWith(
				(async () =>
					(await caches.match(e.clau, { cacheName: NOM_PRECACHE })) ??
					(await caches.match(e.alternativa, { cacheName: NOM_PRECACHE })) ??
					fetch(request).catch(() => respostaSenseXarxa()))()
			);
			return;
		case 'recurs-immutable':
			event.respondWith(recursImmutable(event));
			return;
		case 'pagina':
			event.respondWith(paginaSwr(event, e));
			return;
		case 'tesela':
			event.respondWith(tesela(event));
			return;
		case 'estil-mapa':
			event.respondWith(estilMapa(event));
			return;
	}
});

// --- Missatges de la pàgina ---

sw.addEventListener('message', (event) => {
	const dades = event.data as { type?: unknown; urls?: unknown } | null;
	if (dades?.type === MISSATGE.skipWaiting) {
		event.waitUntil(sw.skipWaiting());
	} else if (dades?.type === MISSATGE.precarregar && Array.isArray(dades.urls)) {
		const port = event.ports[0];
		event.waitUntil(
			precarregaPagines(dades.urls, event).then((r) =>
				port?.postMessage({ type: MISSATGE.precarregaFeta, ...r })
			)
		);
	}
});
