/**
 * Imatge estàtica del mapa topogràfic per a la fitxa de cim (SSR, sense JS): una URL GetMap
 * WMS que es posa directament a `<img src>`. Funcions pures, sense cap petició.
 *
 * Font principal: WMS "Mapa Base" de l'ICGC, capa `topografic`, WMS 1.1.1 + `SRS=EPSG:3857`
 * (https://geoserveis.icgc.cat/servei/catalunya/mapa-base/wms). Llicència CC BY 4.0.
 *
 * Cobertura verificada el 2026-09-28 (GetCapabilities + GetMap, PNG 640×400):
 * - Catalunya (Pedraforca, Lo Tormo) i Andorra (Comapedrosa, Tristaina): mapa detallat i
 *   el símbol del cim de l'ICGC cau al centre de la imatge.
 * - Catalunya Nord (Canigó, Carlit, Puig Peric): la imatge es genera, però amb poc detall i els
 *   símbols/etiquetes dels cims de l'ICGC desplaçats 1–2 km del cim real (el relleu sí que és
 *   correcte). Per no mostrar un mapa enganyós, `mapaEstaticCobert` hi retorna `false` i
 *   `mapaEstaticPerCim` fa servir el **Plan IGN v2** (Géoplateforme de l'IGN, Llicència Oberta
 *   Etalab 2.0), verificat amb el Canigó centrat.
 *
 * La imatge sempre queda centrada en el cim: la UI hi pot dibuixar el marcador al centre.
 */
import type { Cim } from '$lib/domain';

export const MAPA_ESTATIC_WMS = 'https://geoserveis.icgc.cat/servei/catalunya/mapa-base/wms';
export const MAPA_ESTATIC_CAPA = 'topografic';
export const MAPA_ESTATIC_ATRIBUCIO = 'Mapa: © Institut Cartogràfic i Geològic de Catalunya';
export const MAPA_ESTATIC_LLICENCIA_URL = 'https://creativecommons.org/licenses/by/4.0/';

/** Alternativa per a la Catalunya Nord: Plan IGN v2 (WMS raster de la Géoplateforme). */
export const MAPA_IGN_WMS = 'https://data.geopf.fr/wms-r/wms';
export const MAPA_IGN_CAPA = 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2';
export const MAPA_IGN_ATRIBUCIO = 'Mapa: © IGN – Plan IGN';
export const MAPA_IGN_LLICENCIA_URL = 'https://www.etalab.gouv.fr/licence-ouverte-open-licence/';

/** Radi de l'esfera de Web Mercator (EPSG:3857), en metres. */
const R_MERCATOR = 6378137;
/** Límit de latitud de Web Mercator. */
const LAT_MAX_MERCATOR = 85.0511287798066;

export interface OpcionsMapaEstatic {
	/** Amplada de la imatge en píxels (per defecte 640). */
	ample?: number;
	/** Alçada de la imatge en píxels (per defecte 400). */
	alt?: number;
	/** Amplada real (sobre el terreny) que cobreix la imatge, en km (per defecte 4). */
	zoomKm?: number;
}

/** Coordenades WGS84 → Web Mercator (EPSG:3857), en metres. */
export function aWebMercator(lat: number, lon: number): { x: number; y: number } {
	const rad = Math.PI / 180;
	return {
		x: R_MERCATOR * lon * rad,
		y: R_MERCATOR * Math.log(Math.tan(Math.PI / 4 + (lat * rad) / 2))
	};
}

function midaPx(valor: number | undefined, perDefecte: number, nom: string): number {
	const v = valor ?? perDefecte;
	if (!Number.isInteger(v) || v <= 0 || v > 4096) throw new RangeError(`${nom} invàlid: ${v}`);
	return v;
}

/** Paràmetres GetMap comuns: caixa EPSG:3857 centrada en el punt, amb píxels quadrats. */
function getMap(lat: number, lon: number, opts: OpcionsMapaEstatic) {
	if (!Number.isFinite(lat) || Math.abs(lat) > LAT_MAX_MERCATOR)
		throw new RangeError(`Latitud invàlida: ${lat}`);
	if (!Number.isFinite(lon) || Math.abs(lon) > 180)
		throw new RangeError(`Longitud invàlida: ${lon}`);
	const ample = midaPx(opts.ample, 640, 'ample');
	const alt = midaPx(opts.alt, 400, 'alt');
	const zoomKm = opts.zoomKm ?? 4;
	if (!Number.isFinite(zoomKm) || zoomKm <= 0 || zoomKm > 500)
		throw new RangeError(`zoomKm invàlid: ${zoomKm}`);

	const { x, y } = aWebMercator(lat, lon);
	// Mercator estira les distàncies en 1/cos(lat): així `zoomKm` són km reals a la latitud del cim.
	const semiAmple = (zoomKm * 1000) / Math.cos((lat * Math.PI) / 180) / 2;
	const semiAlt = (semiAmple * alt) / ample;
	const bbox = [x - semiAmple, y - semiAlt, x + semiAmple, y + semiAlt]
		.map((v) => v.toFixed(2))
		.join(',');
	return { bbox, ample, alt };
}

/** Querystring llegible (`:`, `,` i `/` sense codificar, vàlids a la query). */
function query(params: Record<string, string>): string {
	return new URLSearchParams(params)
		.toString()
		.replace(/%3A/g, ':')
		.replace(/%2C/g, ',')
		.replace(/%2F/g, '/');
}

/**
 * URL GetMap (PNG) del mapa topogràfic de l'ICGC centrada en `lat`/`lon`.
 * @throws RangeError si les coordenades o les opcions no són vàlides.
 */
export function mapaEstaticUrl(lat: number, lon: number, opts: OpcionsMapaEstatic = {}): string {
	const { bbox, ample, alt } = getMap(lat, lon, opts);
	return `${MAPA_ESTATIC_WMS}?${query({
		SERVICE: 'WMS',
		VERSION: '1.1.1',
		REQUEST: 'GetMap',
		LAYERS: MAPA_ESTATIC_CAPA,
		STYLES: '',
		SRS: 'EPSG:3857',
		BBOX: bbox,
		WIDTH: String(ample),
		HEIGHT: String(alt),
		FORMAT: 'image/png'
	})}`;
}

/** URL GetMap (PNG) del Plan IGN v2 (WMS 1.3.0; en EPSG:3857 l'ordre d'eixos és x,y). */
export function mapaEstaticIgnUrl(lat: number, lon: number, opts: OpcionsMapaEstatic = {}): string {
	const { bbox, ample, alt } = getMap(lat, lon, opts);
	return `${MAPA_IGN_WMS}?${query({
		SERVICE: 'WMS',
		VERSION: '1.3.0',
		REQUEST: 'GetMap',
		LAYERS: MAPA_IGN_CAPA,
		STYLES: '',
		CRS: 'EPSG:3857',
		BBOX: bbox,
		WIDTH: String(ample),
		HEIGHT: String(alt),
		FORMAT: 'image/png'
	})}`;
}

type CimMapa = Pick<Cim, 'lat' | 'lon' | 'zona'>;

/**
 * El mapa de l'ICGC (`mapaEstaticUrl`) representa bé el cim? Cal tenir coordenades i ser a
 * Catalunya o Andorra (a la Catalunya Nord els cims de l'ICGC surten desplaçats: vegeu la capçalera).
 */
export function mapaEstaticCobert(cim: CimMapa): boolean {
	return (
		cim.lat !== null && cim.lon !== null && (cim.zona === 'catalunya' || cim.zona === 'andorra')
	);
}

export interface MapaEstatic {
	url: string;
	/** Text d'atribució obligatori, visible al costat de la imatge. */
	atribucio: string;
	llicenciaUrl: string;
	font: 'icgc' | 'ign';
}

/**
 * Mapa estàtic per a una fitxa: ICGC a Catalunya i Andorra, Plan IGN a la Catalunya Nord;
 * `null` si el cim no té coordenades.
 */
export function mapaEstaticPerCim(cim: CimMapa, opts: OpcionsMapaEstatic = {}): MapaEstatic | null {
	if (cim.lat === null || cim.lon === null) return null;
	if (mapaEstaticCobert(cim))
		return {
			url: mapaEstaticUrl(cim.lat, cim.lon, opts),
			atribucio: MAPA_ESTATIC_ATRIBUCIO,
			llicenciaUrl: MAPA_ESTATIC_LLICENCIA_URL,
			font: 'icgc'
		};
	return {
		url: mapaEstaticIgnUrl(cim.lat, cim.lon, opts),
		atribucio: MAPA_IGN_ATRIBUCIO,
		llicenciaUrl: MAPA_IGN_LLICENCIA_URL,
		font: 'ign'
	};
}
