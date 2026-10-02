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

/**
 * `transformStyle` per a `Map#setStyle`: normalitza l'atribució de cada font, activa el relleu
 * de l'estil fosc i afegeix la font i la capa IGN (amagada) damunt del mapa base. Pura: no
 * modifica l'estil rebut. Si l'ICGC canvia els identificadors de capa, simplement no s'activen.
 */
export function transformarEstil(
	tema: TemaMapa
): (previous: StyleSpecification | undefined, next: StyleSpecification) => StyleSpecification {
	return (_previous, next) => {
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
			.map((l) => (activar.has(l.id) && l.type !== 'background' ? activadaFosc(l) : l));
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
