/**
 * Lògica pura del service worker (`src/service-worker.ts`): quina estratègia toca a cada
 * petició, què entra al precache, quines caches s'han d'esborrar en activar una versió nova i
 * si un HTML és compatible amb els fitxers de la versió activa. Sense APIs del navegador:
 * tot es prova a `estrategia.spec.ts` (docs/05-frontend-arquitectura.md §2).
 *
 * Els camins localitzats es repeteixen aquí (en lloc d'importar `$lib/i18n/routes`) perquè el
 * service worker no arrossegui el catàleg JSON que importa `routes.ts`; `estrategia.spec.ts`
 * comprova que coincideixen amb `LOCALIZED_ROUTES`.
 */

export const LOCALES_SW = ['ca', 'es'] as const;
export type LocaleSW = (typeof LOCALES_SW)[number];

/** Prefix de totes les caches d'aquest web (les altres no es toquen mai). */
export const PREFIX_CACHE = 'carnet-';

/** Noms de cache. Les de runtime porten versió d'esquema (`-v1`), no de desplegament. */
export const CACHES = {
	/** Shell, assets amb hash i pàgines clau de la versió `version`. */
	precache: (version: string) => `${PREFIX_CACHE}precache-${version}`,
	/** Fitxers de `/_app/immutable/` fora del precache (MapLibre i el seu worker): en visitar-los. */
	recursos: `${PREFIX_CACHE}recursos-v1`,
	/** HTML de fitxes, comarques i la resta de pàgines públiques: stale-while-revalidate + LRU. */
	pagines: `${PREFIX_CACHE}pagines-v1`,
	/** Tesel·les, estils, sprites i glifs dels mapes (ICGC, IGN, Mapterhorn): cache-first + LRU. */
	teseles: `${PREFIX_CACHE}teseles-v1`,
	/** Darrera previsió de cada cim (`/api/meteo/{slug}`): network-first, per a l'ús sense xarxa. */
	meteo: `${PREFIX_CACHE}meteo-v1`,
	/** Índexs LRU serialitzats de `pagines`, `teseles` i `meteo`. */
	meta: `${PREFIX_CACHE}meta-v1`
} as const;

/** Límits LRU (docs/05 §2). */
export const LIMITS = {
	pagines: { maxEntrades: 200, maxBytes: 25 * 1024 * 1024 },
	teseles: { maxEntrades: 3000, maxBytes: 60 * 1024 * 1024 },
	/** Una previsió fa ~1 kB: 40 cims consultats és de sobres. */
	meteo: { maxEntrades: 40, maxBytes: 1024 * 1024 }
} as const;

/**
 * Meteo (`/api/meteo/{slug}`), decisió del bloc 6a: **network-first** amb temps màxim i, sense
 * xarxa (o si el servidor falla), la darrera previsió desada d'aquell cim. A la muntanya és
 * habitual consultar la previsió a casa i tornar-la a obrir sense cobertura al punt de sortida;
 * la resposta porta `actualitzat` i la UI l'ha de mostrar. Una còpia de més de
 * `MAX_EDAT_METEO_MS` ja no es fa servir (una previsió de fa dies enganya més que no ajuda).
 */
export const TIMEOUT_METEO_MS = 6000;
export const MAX_EDAT_METEO_MS = 3 * 24 * 60 * 60 * 1000;
/** Capçalera amb l'instant (ms) en què el SW va desar la previsió. */
export const CAPCALERA_DESAT = 'x-carnet-sw-desat';

/** Camí de l'API de meteo d'un cim (`/api/meteo/{slug}`). */
const CAMI_METEO = /^\/api\/meteo\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** La còpia desada de la meteo (desada a `desatMs`) encara es pot servir a `araMs`. */
export function meteoDesadaUtil(desatMs: number, araMs: number): boolean {
	return Number.isFinite(desatMs) && araMs - desatMs >= 0 && araMs - desatMs <= MAX_EDAT_METEO_MS;
}

/** Capçalera que el SW afegeix a les pàgines desades: la versió de l'app amb què encaixen. */
export const CAPCALERA_VERSIO = 'x-carnet-sw-versio';

/** Missatges entre la pàgina (`platform/pwa.ts`) i el SW. */
export const MISSATGE = {
	/** Pàgina → SW en espera: activa't (l'usuari ha triat "Actualitza"). */
	skipWaiting: 'SKIP_WAITING',
	/** Pàgina → SW: descarrega aquestes URL de fitxa a la cache de pàgines. */
	precarregar: 'PRECARREGAR_PAGINES',
	/** SW → pàgina (pel `MessagePort`): resultat de la precàrrega. */
	precarregaFeta: 'PRECARREGA_FETA'
} as const;

/** Orígens dels mapes (vegeu `platform/mapa-estil.ts` i `platform/mapa-estatic.ts`). */
export const HOSTS_MAPA: ReadonlySet<string> = new Set([
	'geoserveis.icgc.cat',
	'data.geopf.fr',
	'tiles.mapterhorn.com'
]);

/** Segments localitzats de les pàgines de la zona `/app` que es precarreguen (shell SPA). */
const APP_SEGMENTS: Record<LocaleSW, readonly string[]> = {
	ca: ['', '/registrar', '/historial', '/compte', '/a-prop', '/essencials', '/comarques'],
	es: ['', '/registrar', '/historial', '/cuenta', '/cerca', '/esenciales', '/comarcas']
};

const SEGMENT_FITXA: Record<LocaleSW, string> = { ca: 'cims', es: 'cimas' };
const SEGMENT_COMARCA: Record<LocaleSW, string> = { ca: 'comarques', es: 'comarcas' };

/** Pàgines de la zona `/app` que van al precache (ca i es). */
export function paginesAppPrecache(): string[] {
	return LOCALES_SW.flatMap((l) => APP_SEGMENTS[l].map((s) => `/${l}/app${s}`));
}

/** Pàgina offline pròpia (prerenderitzada) per idioma. */
export function paginaOffline(locale: LocaleSW): string {
	return `/${locale}/offline`;
}

/** Camí de la fitxa d'un cim (`/ca/cims/{slug}`, `/es/cimas/{slug}`). */
export function camiFitxa(slug: string, locale: LocaleSW): string {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new RangeError(`Slug invàlid: ${slug}`);
	return `/${locale}/${SEGMENT_FITXA[locale]}/${slug}`;
}

/** Idioma pel prefix del camí (`/ca/…`, `/es/…`), o `null` si no en porta. */
export function localeDelCami(pathname: string): LocaleSW | null {
	const m = /^\/(ca|es)(?:\/|$)/.exec(pathname);
	return m ? (m[1] as LocaleSW) : null;
}

/** Treu la barra final (excepte a l'arrel): `/ca/app/` → `/ca/app`. */
export function normalitzaCami(pathname: string): string {
	return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

export function esFitxaOComarca(pathname: string): boolean {
	const l = localeDelCami(pathname);
	if (!l) return false;
	const re = new RegExp(`^/${l}/(${SEGMENT_FITXA[l]}|${SEGMENT_COMARCA[l]})/[a-z0-9-]+$`);
	return re.test(normalitzaCami(pathname));
}

/**
 * Fitxers de `static/` que entren al precache: icones i favicon (els fa servir la interfície i
 * el sistema en instal·lar). Fora: `robots.txt`, captures del manifest i qualsevol altre fitxer
 * pesat que s'hi afegeixi (una captura de pantalla pot fer centenars de kB).
 */
export function fitxerEstaticPrecache(fitxer: string): boolean {
	const cami = fitxer.replace(/^\/+/, '');
	if (/screenshot|captura/i.test(cami)) return false;
	if (cami === 'favicon.svg' || cami === 'favicon.ico') return true;
	return /^icons\/[\w.-]+\.(png|svg|webp)$/i.test(cami);
}

export type EntradaPrecache = { url: string; pagina: boolean };

/**
 * Llista del precache inicial: `build` sense els fitxers diferits (MapLibre i el seu worker,
 * que entren a `recursos` quan es visita el mapa), els fitxers estàtics lleugers, els manifests
 * prerenderitzats, les pàgines de `/app` i les pàgines offline.
 */
export function llistaPrecache(opcions: {
	build: readonly string[];
	files: readonly string[];
	prerendered: readonly string[];
	diferits: ReadonlySet<string>;
}): EntradaPrecache[] {
	const { build, files, prerendered, diferits } = opcions;
	const recursos = [
		...build.filter((f) => !diferits.has(f)),
		...files.filter(fitxerEstaticPrecache),
		...prerendered.filter((p) => p.endsWith('.webmanifest'))
	].map((url) => ({ url, pagina: false }));
	const pagines = [...paginesAppPrecache(), ...LOCALES_SW.map(paginaOffline)].map((url) => ({
		url,
		pagina: true
	}));
	const vistos = new Set<string>();
	return [...recursos, ...pagines].filter((e) => !vistos.has(e.url) && vistos.add(e.url));
}

export type Estrategia =
	/** No s'intercepta: el navegador va a la xarxa com sempre. */
	| { tipus: 'xarxa' }
	/** Cache-first des del precache de la versió (clau sense query). */
	| { tipus: 'precache'; clau: string }
	/** Navegació a `/app`: shell SPA del precache (la pàgina exacta o, si no hi és, `/{l}/app`). */
	| { tipus: 'shell-app'; clau: string; alternativa: string }
	/** `/_app/immutable/` fora del precache: cache-first a `recursos` (són immutables). */
	| { tipus: 'recurs-immutable' }
	/** Navegació a una pàgina pública: stale-while-revalidate + LRU; offline → pàgina offline. */
	| { tipus: 'pagina'; locale: LocaleSW; desa: boolean }
	/** Tesel·la de mapa: cache-first + LRU. */
	| { tipus: 'tesela' }
	/** Estil, TileJSON o sprite JSON d'un mapa: stale-while-revalidate a la cache de tesel·les. */
	| { tipus: 'estil-mapa' }
	/** Previsió d'un cim (`/api/meteo/{slug}`): network-first; sense xarxa, la darrera desada. */
	| { tipus: 'meteo'; clau: string };

export type PeticioSW = {
	url: string;
	method: string;
	/** `Request.mode`: `navigate`, `cors`, `no-cors`, `same-origin`. */
	mode: string;
	/** `Request.destination` (`document`, `image`, `script`…). */
	destination?: string;
};

/**
 * Decideix l'estratègia per a una petició. `origen` és l'origen del SW i `precache` el conjunt
 * de camins (sense query) que hi ha al precache d'aquesta versió.
 */
export function estrategiaPer(
	peticio: PeticioSW,
	origen: string,
	precache: ReadonlySet<string>
): Estrategia {
	if (peticio.method !== 'GET') return { tipus: 'xarxa' };
	let url: URL;
	try {
		url = new URL(peticio.url);
	} catch {
		return { tipus: 'xarxa' };
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return { tipus: 'xarxa' };

	if (url.origin !== origen) {
		if (!HOSTS_MAPA.has(url.hostname)) return { tipus: 'xarxa' };
		// Les respostes opaques (`<img>` sense `crossorigin`) no es poden validar: no es desen.
		if (peticio.mode === 'no-cors' || peticio.mode === 'navigate') return { tipus: 'xarxa' };
		if (/\.json$/i.test(url.pathname)) return { tipus: 'estil-mapa' };
		return { tipus: 'tesela' };
	}

	const cami = url.pathname;
	// La query no forma part de la clau: una previsió per cim.
	if (CAMI_METEO.test(cami) && peticio.mode !== 'navigate') {
		return { tipus: 'meteo', clau: `${url.origin}${cami}` };
	}
	if (
		cami.startsWith('/api/') ||
		cami === '/service-worker.js' ||
		cami === '/_app/version.json' ||
		cami.startsWith('/_app/env')
	) {
		return { tipus: 'xarxa' };
	}

	const navegacio = peticio.mode === 'navigate' || peticio.destination === 'document';
	const normal = normalitzaCami(cami);

	if (!navegacio) {
		if (precache.has(cami)) return { tipus: 'precache', clau: cami };
		if (cami.startsWith('/_app/immutable/')) return { tipus: 'recurs-immutable' };
		return { tipus: 'xarxa' };
	}

	const locale = localeDelCami(normal);
	if (!locale) {
		// `/` i camins sense idioma: el servidor redirigeix (301 → /ca…). Sense xarxa, offline en català.
		return /\.[a-z0-9]+$/i.test(normal)
			? { tipus: 'xarxa' }
			: { tipus: 'pagina', locale: 'ca', desa: false };
	}
	if (normal === `/${locale}/app` || normal.startsWith(`/${locale}/app/`)) {
		const alternativa = `/${locale}/app`;
		return { tipus: 'shell-app', clau: precache.has(normal) ? normal : alternativa, alternativa };
	}
	if (precache.has(normal)) return { tipus: 'precache', clau: normal };
	return { tipus: 'pagina', locale, desa: true };
}

/**
 * Caches a esborrar en activar la versió `version`: els precache d'altres versions i les
 * caches pròpies (`carnet-…`) que ja no existeixen en aquest esquema. Les alienes no es toquen.
 */
export function cachesObsoletes(noms: readonly string[], version: string): string[] {
	const vigents = new Set<string>([
		CACHES.precache(version),
		CACHES.recursos,
		CACHES.pagines,
		CACHES.teseles,
		CACHES.meteo,
		CACHES.meta
	]);
	return noms.filter((n) => n.startsWith(PREFIX_CACHE) && !vigents.has(n));
}

/** Fitxers del cos d'arrencada de SvelteKit referenciats per un HTML (`_app/immutable/entry/…`). */
export function entradesReferenciades(html: string): string[] {
	const re = /(?:^|["'(\s,])(?:\.{1,2}\/)*\/?(_app\/immutable\/entry\/[\w.-]+\.js)/g;
	const fitxers = new Set<string>();
	for (const m of html.matchAll(re)) fitxers.add(`/${m[1]}`);
	return [...fitxers];
}

/**
 * L'HTML és d'aquesta versió de l'app: tots els fitxers d'arrencada que referencia són al
 * `build` del SW. Si no (p. ex. una revalidació que porta l'HTML d'un desplegament més nou
 * mentre aquest SW encara controla), no s'ha de desar: sense xarxa apuntaria a fitxers que
 * aquest SW no té. Un HTML sense cap referència (p. ex. una pàgina d'error) no es considera
 * compatible.
 */
export function htmlEsDeLaVersio(html: string, build: ReadonlySet<string>): boolean {
	const entrades = entradesReferenciades(html);
	return entrades.length > 0 && entrades.every((f) => build.has(f));
}
