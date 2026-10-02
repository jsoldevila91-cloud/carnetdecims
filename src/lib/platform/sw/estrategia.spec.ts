import { describe, expect, it } from 'vitest';
import { LOCALES, localizeCimPath, localizeComarcaPath, localizePath } from '$lib/i18n/routes';
import {
	CACHES,
	camiFitxa,
	cachesObsoletes,
	entradesReferenciades,
	esFitxaOComarca,
	estrategiaPer,
	fitxerEstaticPrecache,
	htmlEsDeLaVersio,
	llistaPrecache,
	paginaOffline,
	paginesAppPrecache,
	type PeticioSW
} from './estrategia';

const ORIGEN = 'https://carnetdecims.cat';
const BUILD = [
	'/_app/immutable/entry/start.AAA.js',
	'/_app/immutable/entry/app.BBB.js',
	'/_app/immutable/chunks/x.js',
	'/_app/immutable/chunks/motor.js',
	'/_app/immutable/workers/maplibre-worker.js',
	'/_app/immutable/assets/archivo.woff2'
];
const DIFERITS = new Set([
	'/_app/immutable/chunks/motor.js',
	'/_app/immutable/workers/maplibre-worker.js'
]);
const PRECACHE_LLISTA = llistaPrecache({
	build: BUILD,
	files: ['/favicon.svg', '/robots.txt', '/icons/icon-192.png', '/screenshots/carnet.png'],
	prerendered: ['/ca', '/ca/cims/montcau', '/manifest-ca.webmanifest', '/ca/offline'],
	diferits: DIFERITS
});
const PRECACHE = new Set(PRECACHE_LLISTA.map((e) => e.url));

const nav = (cami: string): PeticioSW => ({
	url: ORIGEN + cami,
	method: 'GET',
	mode: 'navigate',
	destination: 'document'
});
const recurs = (url: string, mode = 'cors', destination = 'script'): PeticioSW => ({
	url: /^[a-z-]+:/.test(url) ? url : ORIGEN + url,
	method: 'GET',
	mode,
	destination
});
const decideix = (p: PeticioSW) => estrategiaPer(p, ORIGEN, PRECACHE);

describe('camins localitzats (han de coincidir amb $lib/i18n/routes)', () => {
	it('pàgines de /app del precache = localizePath de les rutes de la zona app', () => {
		const esperades = [
			'/app',
			'/app/registrar',
			'/app/historial',
			'/app/compte',
			'/app/a-prop',
			'/app/essencials',
			'/app/comarques'
		];
		expect(new Set(paginesAppPrecache())).toEqual(
			new Set(LOCALES.flatMap((l) => esperades.map((p) => localizePath(p, l))))
		);
	});

	it('fitxa i comarca', () => {
		for (const l of LOCALES) {
			expect(camiFitxa('montcau', l)).toBe(localizeCimPath('montcau', l));
			expect(esFitxaOComarca(localizeCimPath('montcau', l))).toBe(true);
			expect(esFitxaOComarca(localizeComarcaPath('valles-occidental', l))).toBe(true);
		}
		expect(esFitxaOComarca('/ca/cimas/montcau')).toBe(false);
		expect(esFitxaOComarca('/ca/cims')).toBe(false);
		expect(esFitxaOComarca('/ca/app/registrar')).toBe(false);
		expect(() => camiFitxa('../x', 'ca')).toThrow(RangeError);
	});
});

describe('llistaPrecache', () => {
	it('inclou el build excepte MapLibre i el seu worker', () => {
		expect(PRECACHE.has('/_app/immutable/entry/app.BBB.js')).toBe(true);
		expect(PRECACHE.has('/_app/immutable/assets/archivo.woff2')).toBe(true);
		expect(PRECACHE.has('/_app/immutable/chunks/motor.js')).toBe(false);
		expect(PRECACHE.has('/_app/immutable/workers/maplibre-worker.js')).toBe(false);
	});

	it('només els estàtics lleugers (icones, favicon) i els manifests', () => {
		expect(PRECACHE.has('/favicon.svg')).toBe(true);
		expect(PRECACHE.has('/icons/icon-192.png')).toBe(true);
		expect(PRECACHE.has('/robots.txt')).toBe(false);
		expect(PRECACHE.has('/screenshots/carnet.png')).toBe(false);
		expect(PRECACHE.has('/manifest-ca.webmanifest')).toBe(true);
		expect(fitxerEstaticPrecache('/apple-touch-icon.png')).toBe(false);
	});

	it('pàgines: el shell de /app (14) i les offline; cap fitxa prerenderitzada', () => {
		const pagines = PRECACHE_LLISTA.filter((e) => e.pagina).map((e) => e.url);
		expect(pagines).toHaveLength(16);
		expect(pagines).toContain('/ca/app');
		expect(pagines).toContain('/es/app/cuenta');
		expect(pagines).toContain(paginaOffline('ca'));
		expect(pagines).toContain(paginaOffline('es'));
		expect(PRECACHE.has('/ca/cims/montcau')).toBe(false);
		expect(PRECACHE.has('/ca')).toBe(false);
	});

	it('sense duplicats', () => {
		expect(PRECACHE.size).toBe(PRECACHE_LLISTA.length);
	});
});

describe('estrategiaPer', () => {
	it('no intercepta peticions que no són GET, /api ni el propi SW', () => {
		expect(decideix({ ...recurs('/api/meteo/montcau'), method: 'POST' })).toEqual({
			tipus: 'xarxa'
		});
		expect(decideix(recurs('/api/meteo/montcau', 'cors', ''))).toEqual({ tipus: 'xarxa' });
		expect(decideix(nav('/api/x'))).toEqual({ tipus: 'xarxa' });
		expect(decideix(recurs('/service-worker.js'))).toEqual({ tipus: 'xarxa' });
		expect(decideix(recurs('/_app/version.json', 'cors', ''))).toEqual({ tipus: 'xarxa' });
		expect(decideix(recurs('/sitemap-index.xml', 'cors', ''))).toEqual({ tipus: 'xarxa' });
		expect(decideix({ ...recurs('chrome-extension://abc/x.js') })).toEqual({ tipus: 'xarxa' });
	});

	it('assets del precache → precache; immutables diferits → recurs-immutable', () => {
		expect(decideix(recurs('/_app/immutable/entry/app.BBB.js'))).toEqual({
			tipus: 'precache',
			clau: '/_app/immutable/entry/app.BBB.js'
		});
		expect(decideix(recurs('/_app/immutable/chunks/motor.js'))).toEqual({
			tipus: 'recurs-immutable'
		});
		expect(
			decideix(recurs('/_app/immutable/workers/maplibre-worker.js', 'same-origin', 'worker'))
		).toEqual({
			tipus: 'recurs-immutable'
		});
		expect(decideix(recurs('/apple-touch-icon.png', 'no-cors', 'image'))).toEqual({
			tipus: 'xarxa'
		});
	});

	it('navegacions a /app → shell del precache (exacte o el de l’idioma)', () => {
		expect(decideix(nav('/ca/app'))).toEqual({
			tipus: 'shell-app',
			clau: '/ca/app',
			alternativa: '/ca/app'
		});
		expect(decideix(nav('/ca/app?source=pwa'))).toEqual({
			tipus: 'shell-app',
			clau: '/ca/app',
			alternativa: '/ca/app'
		});
		expect(decideix(nav('/ca/app/registrar/'))).toEqual({
			tipus: 'shell-app',
			clau: '/ca/app/registrar',
			alternativa: '/ca/app'
		});
		expect(decideix(nav('/es/app/progreso'))).toEqual({
			tipus: 'shell-app',
			clau: '/es/app',
			alternativa: '/es/app'
		});
		// `/ca/apps` no és la zona app
		expect(decideix(nav('/ca/apps'))).toEqual({ tipus: 'pagina', locale: 'ca', desa: true });
	});

	it('navegacions a pàgines públiques → SWR amb l’idioma per a la pàgina offline', () => {
		expect(decideix(nav('/ca/cims/montcau'))).toEqual({
			tipus: 'pagina',
			locale: 'ca',
			desa: true
		});
		expect(decideix(nav('/es/comarcas/valles-occidental'))).toEqual({
			tipus: 'pagina',
			locale: 'es',
			desa: true
		});
		expect(decideix(nav('/es'))).toEqual({ tipus: 'pagina', locale: 'es', desa: true });
		expect(decideix(nav('/ca/offline'))).toEqual({ tipus: 'precache', clau: '/ca/offline' });
		// sense idioma: el servidor redirigeix; no es desa
		expect(decideix(nav('/'))).toEqual({ tipus: 'pagina', locale: 'ca', desa: false });
		expect(decideix(nav('/cims/montcau'))).toEqual({ tipus: 'pagina', locale: 'ca', desa: false });
		expect(decideix(nav('/sitemap-index.xml'))).toEqual({ tipus: 'xarxa' });
	});

	it('mapes: tesel·les cache-first, estils SWR, opaques i altres orígens fora', () => {
		const vt = 'https://geoserveis.icgc.cat/servei/catalunya/mapa-base2/vt/12/2071/1529.pbf';
		expect(decideix(recurs(vt, 'cors', ''))).toEqual({ tipus: 'tesela' });
		expect(
			decideix(
				recurs('https://data.geopf.fr/wmts?LAYER=x&TILEMATRIX=12&TILEROW=1&TILECOL=2', 'cors', '')
			)
		).toEqual({
			tipus: 'tesela'
		});
		expect(decideix(recurs('https://tiles.mapterhorn.com/12/1/2.webp', 'cors', ''))).toEqual({
			tipus: 'tesela'
		});
		expect(
			decideix(recurs('https://geoserveis.icgc.cat/styles/mapa-base-topografic.json', 'cors', ''))
		).toEqual({
			tipus: 'estil-mapa'
		});
		expect(decideix(recurs('https://tiles.mapterhorn.com/tilejson.json', 'cors', ''))).toEqual({
			tipus: 'estil-mapa'
		});
		// `<img>` sense crossorigin (mapa estàtic): resposta opaca → no es desa
		expect(
			decideix(
				recurs(
					'https://geoserveis.icgc.cat/servei/catalunya/mapa-base/wms?REQUEST=GetMap',
					'no-cors',
					'image'
				)
			)
		).toEqual({
			tipus: 'xarxa'
		});
		expect(decideix(recurs('https://ca.wikiloc.com/x', 'cors', ''))).toEqual({ tipus: 'xarxa' });
		expect(decideix({ ...recurs(vt, 'cors', ''), method: 'HEAD' })).toEqual({ tipus: 'xarxa' });
	});
});

describe('cachesObsoletes', () => {
	it('esborra precaches d’altres versions i caches pròpies desconegudes; no toca les alienes', () => {
		const noms = [
			CACHES.precache('100'),
			CACHES.precache('200'),
			CACHES.recursos,
			CACHES.pagines,
			CACHES.teseles,
			CACHES.meta,
			'carnet-pagines-v0',
			'workbox-precache-v2',
			'altra-cosa'
		];
		expect(cachesObsoletes(noms, '200')).toEqual([CACHES.precache('100'), 'carnet-pagines-v0']);
	});

	it('res a esborrar si només hi ha les vigents', () => {
		expect(cachesObsoletes([CACHES.precache('1'), CACHES.pagines], '1')).toEqual([]);
	});
});

describe('htmlEsDeLaVersio', () => {
	const build = new Set(BUILD);
	const html = (start: string, app: string) =>
		`<link href="${start}" rel="modulepreload"><script>import("${start}"), import("${app}")</script>`;

	it('troba les entrades amb camins absoluts o relatius', () => {
		expect(
			entradesReferenciades(
				html('/_app/immutable/entry/start.AAA.js', '../../_app/immutable/entry/app.BBB.js')
			)
		).toEqual(['/_app/immutable/entry/start.AAA.js', '/_app/immutable/entry/app.BBB.js']);
	});

	it('sí si totes les entrades són al build; no si n’hi ha d’una altra versió o cap', () => {
		expect(
			htmlEsDeLaVersio(
				html('/_app/immutable/entry/start.AAA.js', '/_app/immutable/entry/app.BBB.js'),
				build
			)
		).toBe(true);
		expect(
			htmlEsDeLaVersio(
				html('/_app/immutable/entry/start.NOU.js', '/_app/immutable/entry/app.BBB.js'),
				build
			)
		).toBe(false);
		expect(htmlEsDeLaVersio('<html><body>Error 500</body></html>', build)).toBe(false);
	});
});
