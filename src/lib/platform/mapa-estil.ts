/**
 * Estil base del mapa interactiu (MapLibre GL JS, bloc 4c). Funcions pures: no fan cap petició
 * (MapLibre descarrega l'estil i les tessel·les).
 *
 * ## Servei (verificat el 2026-09-30 amb peticions reals)
 *
 * Estils vectorials oficials de l'ICGC, els que recomana https://openicgc.github.io/
 * ("Mapa base vectorial"), servits amb `Access-Control-Allow-Origin: *`:
 * - clar: `mapa-base-topografic.json` (tessel·les `mapa-base2/vt`, maxzoom 15; ombrejat
 *   ICGC 5 m + Mapterhorn; corbes de nivell, cims, camins, toponímia; glifs i sprites ICGC).
 * - fosc: `icgc_mapa_base_fosc.json` ("Ombra fosca"): variant fosca oficial, però sense relleu,
 *   corbes ni cims visibles. `transformarEstil('fosc')` hi activa les capes que el mateix estil
 *   porta amagades (`terrainICGC_fosca`, `terrainMapZen_fosca`, amb pintura fosca pròpia, i les
 *   corbes de nivell grises). Els cims ja els dibuixa la capa de punts de l'app.
 *
 * Cobertura (mida de tessel·la z13 i capes presents):
 * - Catalunya (Pedraforca, 490 KB) i Andorra (Comapedrosa, 320 KB): detall complet, amb corbes.
 * - Catalunya Nord (Canigó 19 KB, Carlit 6 KB, Puig Peric 25 KB): només OpenMapTiles/OSM
 *   (cims i pobles, **sense corbes**), i a z15 el servidor respon `204` (buit): a partir de z15
 *   només hi queda l'ombrejat. Per això hi ha una capa de respatlla **Plan IGN v2** (WMTS
 *   raster de la Géoplateforme, sense clau, CORS `*`, fins a z19), amagada per defecte: la UI
 *   l'activa amb `mostraRespatllaIgn()` quan la vista és a la Catalunya Nord. El Plan IGN és
 *   opac i en blanc fora de França: per això no es pot deixar sempre visible.
 *
 * ## Atribució
 *
 * `transformarEstil` posa a cada font la seva atribució exacta (ICGC CC BY 4.0; OpenMapTiles i
 * OpenStreetMap, ODbL; Mapterhorn per a l'ombrejat fora de Catalunya; IGN, Llicència Oberta
 * Etalab 2.0, només quan la capa IGN és visible) i el control d'atribució de MapLibre les mostra
 * soles. **No** afegiu `ATRIBUCIO_MAPA` com a `customAttribution` a més: sortiria duplicada.
 * `ATRIBUCIO_MAPA` és el text complet per a llocs sense MapLibre (llegenda, imatge estàtica).
 *
 * Ús:
 * ```ts
 * const map = new maplibregl.Map({ container, bounds: BOUNDS_CATALEG, attributionControl: { compact: true } });
 * map.setStyle(estilMapa(tema), { transformStyle: transformarEstil(tema) });
 * map.on('moveend', () =>
 *   map.setLayoutProperty(CAPA_IGN_ID, 'visibility',
 *     mostraRespatllaIgn(map.getCenter(), map.getZoom()) ? 'visible' : 'none'));
 * ```
 */
import type {
	LayerSpecification,
	RasterLayerSpecification,
	RasterSourceSpecification,
	SourceSpecification,
	StyleSpecification
} from 'maplibre-gl';
import { bboxPunts, type Punt } from '$lib/domain';
import { CIMS } from '$lib/data/catalog/cataleg';
import spriteIcgc from './sprite-icgc.json';

export type TemaMapa = 'clar' | 'fosc';

/** Estils vectorials de l'ICGC (URL que MapLibre descarrega). */
export const ESTIL_ICGC_URL: Readonly<Record<TemaMapa, string>> = Object.freeze({
	clar: 'https://geoserveis.icgc.cat/styles/mapa-base-topografic.json',
	fosc: 'https://geoserveis.icgc.cat/styles/icgc_mapa_base_fosc.json'
});

/**
 * Estil base per a `Map#setStyle` (o l'opció `style`). És la URL de l'estil oficial (així es
 * reben les actualitzacions de l'ICGC sense redesplegar); passeu-hi `transformarEstil(tema)`
 * com a `transformStyle` per a l'atribució exacta, la variant fosca amb relleu i la capa IGN.
 */
export function estilMapa(tema: TemaMapa): StyleSpecification | string {
	return ESTIL_ICGC_URL[tema];
}

// ---------------------------------------------------------------------------
// Atribució
// ---------------------------------------------------------------------------

const enllac = (url: string, text: string) =>
	`<a href="${url}" target="_blank" rel="noopener">${text}</a>`;

export const ATRIBUCIO_ICGC = `© ${enllac('https://www.icgc.cat/', 'ICGC')} (${enllac('https://creativecommons.org/licenses/by/4.0/', 'CC BY 4.0')})`;
export const ATRIBUCIO_OSM = `© ${enllac('https://openmaptiles.org/', 'OpenMapTiles')} © ${enllac('https://www.openstreetmap.org/copyright', 'OpenStreetMap contributors')}`;
export const ATRIBUCIO_MAPTERHORN = `© ${enllac('https://mapterhorn.com/attribution', 'Mapterhorn')}`;
export const ATRIBUCIO_IGN = `© ${enllac('https://www.ign.fr/', 'IGN')} – Plan IGN (${enllac('https://www.etalab.gouv.fr/licence-ouverte-open-licence/', 'Licence Ouverte Etalab 2.0')})`;

/** Atribució completa del mapa base (sense la capa IGN, que porta la seva a la font). */
export const ATRIBUCIO_MAPA = [ATRIBUCIO_ICGC, ATRIBUCIO_OSM, ATRIBUCIO_MAPTERHORN].join(' · ');

/** Font de l'estil ICGC amb dades OpenMapTiles/OSM fora de Catalunya. */
const FONT_OMT = 'openmaptiles';
/** Fonts d'ombrejat global (Mapterhorn, TileJSON). */
const FONTS_MAPTERHORN = new Set(['terrainMapZen']);

function atribucioFont(id: string, font: SourceSpecification): string | undefined {
	if (id === FONT_IGN_ID) return ATRIBUCIO_IGN;
	if (FONTS_MAPTERHORN.has(id)) return ATRIBUCIO_MAPTERHORN;
	if (id === FONT_OMT) return `${ATRIBUCIO_ICGC} · ${ATRIBUCIO_OSM}`;
	// La resta de fonts de l'estil són serveis de l'ICGC (geoserveis.icgc.cat).
	const url = 'url' in font ? font.url : undefined;
	const tiles = 'tiles' in font ? font.tiles : undefined;
	const icgc = [url, ...(tiles ?? [])].some((u) => u?.startsWith('https://geoserveis.icgc.cat/'));
	return icgc ? ATRIBUCIO_ICGC : undefined;
}

// ---------------------------------------------------------------------------
// Respatlla IGN (Catalunya Nord)
// ---------------------------------------------------------------------------

export const FONT_IGN_ID = 'ign-plan';
export const CAPA_IGN_ID = 'ign-plan-catalunya-nord';
/** Zoom a partir del qual la respatlla IGN aporta detall que l'ICGC no té. */
export const ZOOM_MIN_IGN = 10;

export const PLAN_IGN_WMTS =
	'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
	'&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM' +
	'&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png';

/**
 * Contorn aproximat de la Catalunya Nord (Pirineus Orientals), [lon, lat], amb marge al mar.
 * Només serveix per decidir quan mostrar el Plan IGN (error admès ~1–2 km a la frontera; la
 * Llívia queda a dins). Passa just al nord dels cims fronterers del catàleg (Puig Neulós, Roc del
 * Comptador, Comanegra, Costabona, Bastiments, Puigmal), que són de la zona Catalunya.
 */
export const CONTORN_CATALUNYA_NORD: readonly (readonly [number, number])[] = Object.freeze([
	[3.35, 42.43],
	[3.17, 42.435],
	[3.08, 42.445],
	[2.947, 42.487],
	[2.86, 42.462],
	[2.727, 42.427],
	[2.65, 42.37],
	[2.528, 42.337],
	[2.48, 42.376],
	[2.344, 42.421],
	[2.233, 42.43],
	[2.117, 42.387],
	[1.99, 42.388],
	[1.95, 42.43],
	[1.87, 42.465],
	[1.725, 42.505],
	[1.73, 42.55],
	[1.78, 42.58],
	[1.9, 42.62],
	[2.05, 42.66],
	[2.1, 42.72],
	[2.17, 42.78],
	[2.3, 42.82],
	[2.55, 42.85],
	[2.75, 42.86],
	[2.95, 42.89],
	[3.05, 42.87],
	[3.35, 42.87]
] as const);

/** Caixa del contorn [oest, sud, est, nord]: `bounds` de la font IGN (no demana res fora). */
export const BBOX_CATALUNYA_NORD: readonly [number, number, number, number] = [
	1.72, 42.32, 3.35, 42.9
];

/** El punt és dins de la Catalunya Nord? (ray casting sobre `CONTORN_CATALUNYA_NORD`). */
export function dinsCatalunyaNord(p: Punt): boolean {
	const c = CONTORN_CATALUNYA_NORD;
	let dins = false;
	for (let i = 0, j = c.length - 1; i < c.length; j = i++) {
		const [xi, yi] = c[i];
		const [xj, yj] = c[j];
		if (yi > p.lat !== yj > p.lat && p.lon < ((xj - xi) * (p.lat - yi)) / (yj - yi) + xi)
			dins = !dins;
	}
	return dins;
}

/**
 * Cal mostrar la capa IGN? Quan el centre de la vista és a la Catalunya Nord i el zoom ≥
 * `ZOOM_MIN_IGN`. Accepta `LngLat` de MapLibre (`{ lng, lat }`) o `{ lat, lon }`.
 */
export function mostraRespatllaIgn(
	centre: { lat: number; lon: number } | { lat: number; lng: number },
	zoom: number
): boolean {
	const lon = 'lon' in centre ? centre.lon : centre.lng;
	return zoom >= ZOOM_MIN_IGN && dinsCatalunyaNord({ lat: centre.lat, lon });
}

export function fontIgn(): RasterSourceSpecification {
	return {
		type: 'raster',
		tiles: [PLAN_IGN_WMTS],
		tileSize: 256,
		minzoom: 0,
		maxzoom: 19,
		bounds: [...BBOX_CATALUNYA_NORD],
		attribution: ATRIBUCIO_IGN
	};
}

/** Capa raster IGN, amagada per defecte. En fosc s'inverteix la lluminositat. */
export function capaIgn(tema: TemaMapa): RasterLayerSpecification {
	return {
		id: CAPA_IGN_ID,
		type: 'raster',
		source: FONT_IGN_ID,
		minzoom: ZOOM_MIN_IGN,
		layout: { visibility: 'none' },
		paint:
			tema === 'fosc'
				? {
						'raster-brightness-min': 0.85,
						'raster-brightness-max': 0.08,
						'raster-hue-rotate': 180,
						'raster-saturation': -0.3
					}
				: {}
	};
}

// ---------------------------------------------------------------------------
// Transformació de l'estil
// ---------------------------------------------------------------------------

/** Capes amagades de l'estil fosc de l'ICGC que s'hi activen (relleu i corbes de nivell). */
export const CAPES_FOSC_ACTIVADES: readonly string[] = Object.freeze([
	'terrainMapZen_fosca',
	'terrainICGC_fosca',
	'contour-250m',
	'contour-mestres',
	'contour-senzilles',
	'contour-intercalades'
]);

/**
 * Ombrejat per a l'estil fosc. Les capes `*_fosca` de l'ICGC tenen llums gairebé blanques
 * (240, 240, 240) i, activades tal qual, aclareixen tot el mapa (comprovat en un navegador el
 * 2026-09-30): se'ls substitueix la pintura per una de fosca.
 */
export const OMBREJAT_FOSC = Object.freeze({
	'hillshade-highlight-color': 'rgba(255, 255, 255, 0.10)',
	'hillshade-shadow-color': 'rgba(0, 0, 0, 0.55)',
	'hillshade-accent-color': 'rgba(0, 0, 0, 0.2)',
	'hillshade-exaggeration': 0.6
});

function activadaFosc(capa: LayerSpecification): LayerSpecification {
	const layout = { ...('layout' in capa ? capa.layout : undefined), visibility: 'visible' };
	if (capa.type === 'hillshade')
		return { ...capa, layout, paint: { ...capa.paint, ...OMBREJAT_FOSC } } as LayerSpecification;
	return { ...capa, layout } as LayerSpecification;
}

// ---------------------------------------------------------------------------
// Sanejament de l'estil de l'ICGC (avisos de MapLibre a la consola)
// ---------------------------------------------------------------------------

/** Sprite dels estils de l'ICGC (el de la instantània `sprite-icgc.json`). */
export const SPRITE_ICGC = 'https://geoserveis.icgc.cat/vector-tiles/simbologia/sprites1/sprite';

/** Noms d'icona del sprite de l'ICGC (instantània: `scripts/mapa/sprite-icgc.ts`). */
export const IMATGES_ICGC: ReadonlySet<string> = new Set(spriteIcgc.noms);

/** Valor per defecte de `text-size` a l'especificació: el que MapLibre fa servir si falla. */
export const TEXT_SIZE_PER_DEFECTE = 16;

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const TOKEN = /\{([^{}]+)\}/g;

/** "{class}_11" → `["concat", ["to-string", ["get", "class"]], "_11"]` (com resol MapLibre). */
function tokensAExpressio(text: string): Json {
	const parts: Json[] = [];
	let darrer = 0;
	for (const m of text.matchAll(TOKEN)) {
		if (m.index > darrer) parts.push(text.slice(darrer, m.index));
		parts.push(['to-string', ['get', m[1]]]);
		darrer = m.index + m[0].length;
	}
	if (darrer < text.length) parts.push(text.slice(darrer));
	return ['concat', ...parts];
}

/**
 * `icon-image` que només demana icones que existeixen: un nom absent del sprite passa a ""
 * (MapLibre no hi dibuixa icona, igual que quan no la troba, però sense avís). Els tokens
 * (`{class}_11`) es converteixen en una expressió que comprova el nom resultant.
 */
export function sanejarIconImage(valor: unknown, imatges: ReadonlySet<string>): unknown {
	if (typeof valor === 'string') {
		if (/\{[^{}]+\}/.test(valor)) {
			return [
				'let',
				'nom',
				tokensAExpressio(valor),
				['match', ['var', 'nom'], [...imatges], ['var', 'nom'], '']
			];
		}
		return imatges.has(valor) ? valor : '';
	}
	// Funció antiga de zoom ({ stops: [[z, "nom"], …] }): es saneja cada parada literal.
	if (valor && typeof valor === 'object' && !Array.isArray(valor) && 'stops' in valor) {
		const f = valor as { stops: [unknown, unknown][]; property?: string };
		if (f.property !== undefined) return valor;
		return {
			...f,
			stops: f.stops.map(([z, v]) => [
				z,
				typeof v === 'string' && !v.includes('{') && !imatges.has(v) ? '' : v
			])
		};
	}
	return valor;
}

const OPERADORS_ARITMETICS = new Set(['+', '-', '*', '/', '%', '^', 'min', 'max']);

/**
 * Propietats llegides per una expressió aritmètica simple (números, `["literal", n]`,
 * `["get", p]` i operadors aritmètics). `null` si l'expressió té qualsevol altra cosa
 * (`case`, `coalesce`…): llavors no es toca, perquè protegir-la podria canviar-ne el valor.
 */
function propietatsAritmetica(e: unknown, acc = new Set<string>()): Set<string> | null {
	if (typeof e === 'number') return acc;
	if (!Array.isArray(e)) return null;
	if (e[0] === 'literal') return typeof e[1] === 'number' ? acc : null;
	if (e[0] === 'get') {
		if (e.length !== 2 || typeof e[1] !== 'string') return null;
		acc.add(e[1]);
		return acc;
	}
	if (!OPERADORS_ARITMETICS.has(e[0] as string)) return null;
	for (const x of e.slice(1)) if (propietatsAritmetica(x, acc) === null) return null;
	return acc;
}

/** `["case", <totes les propietats són números>, e, 16]` (o `e` si no en llegeix cap). */
function protegit(e: unknown, props: ReadonlySet<string>): unknown {
	if (props.size === 0) return e;
	const numeriques = [...props].map((p) => ['==', ['typeof', ['get', p]], 'number']);
	const condicio = numeriques.length === 1 ? numeriques[0] : ['all', ...numeriques];
	return ['case', condicio, e, TEXT_SIZE_PER_DEFECTE];
}

/** Separació entre una parada duplicada i l'original (en nivells de zoom): imperceptible. */
const EPSILON_ZOOM = 1e-6;

/**
 * `text-size` sense errors d'avaluació. Les expressions de l'ICGC fan aritmètica amb
 * propietats de les tessel·les (`["+", 3, ["get", "fontsize"]]`) que de vegades no hi són:
 * MapLibre avisa ("Expected value to be of type number, but found null") i fa servir el valor per
 * defecte, 16. Aquí es retorna el mateix 16 explícitament quan alguna propietat no és un número:
 * mateix resultat, sense avís.
 *
 * Amb `interpolate` de zoom (el zoom ha de quedar a dalt de tot), MapLibre avalua les dues
 * sortides del tram i falla si en falla una; per reproduir-ho, cada tram té les seves parades
 * (les interiors es dupliquen a `EPSILON_ZOOM`) protegides amb les propietats de tot el tram.
 * Amb `step` de zoom només s'avalua una sortida i n'hi ha prou de protegir-les una a una.
 * Qualsevol altra forma es deixa igual.
 */
export function sanejarTextSize(valor: unknown): unknown {
	if (!Array.isArray(valor)) return valor;
	const zoom = (x: unknown) => Array.isArray(x) && x[0] === 'zoom' && x.length === 1;

	if (valor[0] === 'step' && zoom(valor[1])) {
		const sortides = valor.map((x, i) => (i >= 2 && i % 2 === 0 ? propietatsAritmetica(x) : null));
		if (sortides.some((p, i) => i >= 2 && i % 2 === 0 && p === null)) return valor;
		return valor.map((x, i) => (i >= 2 && i % 2 === 0 ? protegit(x, sortides[i]!) : x));
	}

	if (valor[0] === 'interpolate' && zoom(valor[2])) {
		const parades: [number, unknown, Set<string>][] = [];
		for (let i = 3; i + 1 < valor.length; i += 2) {
			const props = propietatsAritmetica(valor[i + 1]);
			if (typeof valor[i] !== 'number' || props === null) return valor;
			parades.push([valor[i] as number, valor[i + 1], props]);
		}
		if (parades.every(([, , p]) => p.size === 0)) return valor;
		const n = parades.length;
		const [z0, o0, p0] = parades[0];
		if (n === 1) return [...valor.slice(0, 3), z0, protegit(o0, p0)];
		// MapLibre: z ≤ z0 → només o0; z ≥ zn → només on; za ≤ z < zb → oa i ob (tram [za, zb)).
		const noves: [number, unknown][] = [[z0, protegit(o0, p0)]];
		for (let k = 0; k + 1 < n; k++) {
			const [za, oa, pa] = parades[k];
			const [zb, ob, pb] = parades[k + 1];
			const tram = new Set([...pa, ...pb]);
			noves.push([k === 0 ? za + EPSILON_ZOOM : za, protegit(oa, tram)]);
			noves.push([zb - EPSILON_ZOOM, protegit(ob, tram)]);
		}
		const [zn, on, pn] = parades[n - 1];
		noves.push([zn, protegit(on, pn)]);
		return [...valor.slice(0, 3), ...noves.flat()];
	}

	const props = propietatsAritmetica(valor);
	return props === null ? valor : protegit(valor, props);
}

function sanejarCapa(capa: LayerSpecification, imatges: ReadonlySet<string> | null) {
	if (capa.type !== 'symbol' || !capa.layout) return capa;
	const layout: Record<string, unknown> = { ...capa.layout };
	if (imatges && layout['icon-image'] !== undefined)
		layout['icon-image'] = sanejarIconImage(layout['icon-image'], imatges);
	if (layout['text-size'] !== undefined) layout['text-size'] = sanejarTextSize(layout['text-size']);
	return { ...capa, layout } as LayerSpecification;
}

export interface OpcionsTransformarEstil {
	/** Noms d'icona disponibles al sprite (per defecte, la instantània de l'ICGC). */
	imatges?: ReadonlySet<string>;
}

/**
 * `transformStyle` per a `Map#setStyle`: normalitza l'atribució de cada font, activa el relleu
 * de l'estil fosc, afegeix la font i la capa IGN (amagada) damunt del mapa base i saneja les
 * capes de símbols de l'ICGC (icones que no existeixen al sprite i `text-size` que falla), sense
 * canviar l'aspecte. Pura: no modifica l'estil rebut. Si l'ICGC canvia els identificadors de
 * capa, simplement no s'activen; si l'estil no fa servir el sprite de l'ICGC, les icones no es
 * toquen.
 */
export function transformarEstil(
	tema: TemaMapa,
	opcions: OpcionsTransformarEstil = {}
): (previous: StyleSpecification | undefined, next: StyleSpecification) => StyleSpecification {
	return (_previous, next) => {
		const imatges = next.sprite === SPRITE_ICGC ? (opcions.imatges ?? IMATGES_ICGC) : null;
		const sources: Record<string, SourceSpecification> = {};
		for (const [id, font] of Object.entries(next.sources)) {
			const attribution = atribucioFont(id, font);
			sources[id] =
				attribution === undefined ? font : ({ ...font, attribution } as SourceSpecification);
		}
		sources[FONT_IGN_ID] = fontIgn();

		const activar = tema === 'fosc' ? new Set(CAPES_FOSC_ACTIVADES) : new Set<string>();
		const layers = next.layers
			.filter((l) => l.id !== CAPA_IGN_ID)
			.map((l) => (activar.has(l.id) && l.type !== 'background' ? activadaFosc(l) : l))
			.map((l) => sanejarCapa(l, imatges));
		layers.push(capaIgn(tema));

		return { ...next, sources, layers };
	};
}

// ---------------------------------------------------------------------------
// Encaix inicial
// ---------------------------------------------------------------------------

/** Marge al voltant dels cims del catàleg, en km. */
export const MARGE_BOUNDS_KM = 10;

const arrodonir = (v: number, cap: 'avall' | 'amunt') =>
	(cap === 'avall' ? Math.floor(v * 100) : Math.ceil(v * 100)) / 100;

function boundsCataleg(): [[number, number], [number, number]] {
	const bbox = bboxPunts(
		CIMS.flatMap((c) => (c.lat === null || c.lon === null ? [] : [{ lat: c.lat, lon: c.lon }])),
		MARGE_BOUNDS_KM
	);
	if (!bbox) throw new Error('Catàleg sense coordenades');
	const [oest, sud, est, nord] = bbox;
	return [
		[arrodonir(oest, 'avall'), arrodonir(sud, 'avall')],
		[arrodonir(est, 'amunt'), arrodonir(nord, 'amunt')]
	];
}

/**
 * Caixa [[oest, sud], [est, nord]] (`LngLatBoundsLike`) de tots els cims del catàleg amb
 * `MARGE_BOUNDS_KM` de marge: per a l'opció `bounds`/`fitBounds` inicial.
 */
export const BOUNDS_CATALEG: [[number, number], [number, number]] = boundsCataleg();

/** Centre de `BOUNDS_CATALEG`, [lon, lat] (`LngLatLike`). */
export const CENTRE_INICIAL: [number, number] = [
	Math.round(((BOUNDS_CATALEG[0][0] + BOUNDS_CATALEG[1][0]) / 2) * 1e4) / 1e4,
	Math.round(((BOUNDS_CATALEG[0][1] + BOUNDS_CATALEG[1][1]) / 2) * 1e4) / 1e4
];

/** Zoom orientatiu per a `CENTRE_INICIAL` en un mòbil (la caixa sencera hi cap). */
export const ZOOM_INICIAL = 6.3;
