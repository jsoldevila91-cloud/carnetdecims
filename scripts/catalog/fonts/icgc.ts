/**
 * ICGC (Institut Cartogràfic i Geològic de Catalunya), dades obertes CC BY 4.0.
 *
 * - Geocodificador ICGC (https://eines.icgc.cat/geocodificador, doc:
 *   https://openicgc.github.io/geocodificador-doc/): topònims del Nomenclàtor/Base topogràfica
 *   amb tipus (`Cim`, `Orografia`...), comarca i coordenades.
 * - WCS del Model d'Elevacions del Terreny 5×5 m (https://geoserveis.icgc.cat/icc_mdt/wcs/service,
 *   cobertura `met5`). Cobreix Catalunya i Andorra; fora hi ha NODATA.
 *   Nota: el servei afegeix "5" al paràmetre COVERAGE (per això s'hi envia `icc:met`).
 */
import { aUtm31, deUtm31 } from '../lib/geo.ts';
import { fetchJson, fetchText } from '../lib/http.ts';

const GEOCODER = 'https://eines.icgc.cat/geocodificador';
const WCS = 'https://geoserveis.icgc.cat/icc_mdt/wcs/service';

export interface ToponimIcgc {
	nom: string;
	tipus: string;
	lat: number;
	lon: number;
	utm: [number, number];
	municipi: string;
	comarca: string;
	idComarca: number | null;
	municipisExtra: string;
	/** Distància al punt de consulta (només `invers`, en km). */
	distanciaKm?: number;
}

interface FeatureIcgc {
	geometry: { coordinates: [number, number] };
	properties: {
		layer: string;
		nom: string;
		municipi?: string;
		comarca?: string;
		id_comarca?: string;
		distancia?: number;
		addendum?: { tipus?: string; coordinates_utm?: [number, number]; municipis_extra?: string };
	};
}

const esGeoJson = (t: string) => t.trimStart().startsWith('{') && t.includes('"features"');

function aToponim(f: FeatureIcgc): ToponimIcgc {
	const p = f.properties;
	const [lon, lat] = f.geometry.coordinates;
	return {
		nom: p.nom,
		tipus: p.addendum?.tipus ?? p.layer,
		lat,
		lon,
		utm: p.addendum?.coordinates_utm ?? [0, 0],
		municipi: p.municipi ?? '',
		comarca: p.comarca ?? '',
		idComarca: p.id_comarca ? Number(p.id_comarca) : null,
		municipisExtra: p.addendum?.municipis_extra ?? '',
		distanciaKm: p.distancia
	};
}

export function urlCerca(text: string) {
	return `${GEOCODER}/cerca?text=${encodeURIComponent(text)}&layers=topo1,topo2&size=25`;
}

/** Cerca de topònims (capes topo1/topo2; sense adreces). */
export async function cercaIcgc(text: string): Promise<ToponimIcgc[]> {
	const j = await fetchJson<{ features: FeatureIcgc[] }>({
		font: 'icgc',
		url: urlCerca(text),
		valida: esGeoJson
	});
	return j.features.filter((f) => f.properties.layer.startsWith('topo')).map(aToponim);
}

/** Topònims més propers a un punt (per saber comarca i nom oficial d'un punt d'OSM/IGN). */
export async function inversIcgc(lat: number, lon: number): Promise<ToponimIcgc[]> {
	const j = await fetchJson<{ features: FeatureIcgc[] }>({
		font: 'icgc',
		url: `${GEOCODER}/invers?lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}&size=5&layers=topo1,topo2`,
		valida: esGeoJson
	});
	return j.features.map(aToponim);
}

export interface MaxMdt {
	/** Cota màxima del MET-5 dins del radi (m, 1 decimal). */
	z: number;
	/** Posició de la cel·la més alta (WGS84). */
	lat: number;
	lon: number;
	/** Distància del punt consultat a la cel·la més alta (m). */
	desplacamentM: number;
	/** La cel·la més alta toca la vora del cercle (el punt pot no ser al cim). */
	aLaVora: boolean;
}

/**
 * Cota màxima del MET-5 en un radi al voltant d'un punt. `null` si no hi ha dades
 * (fora de Catalunya/Andorra).
 */
export async function maxMdtIcgc(lat: number, lon: number, radiM = 40): Promise<MaxMdt | null> {
	const { x, y } = aUtm31(lat, lon);
	// Finestra alineada a la malla de 5 m perquè les cel·les coincideixin amb el MDT original.
	const x0 = Math.floor((x - radiM) / 5) * 5;
	const y0 = Math.floor((y - radiM) / 5) * 5;
	const n = Math.ceil((2 * radiM) / 5) + 1;
	const url =
		`${WCS}?SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&COVERAGE=icc:met&CRS=EPSG:25831` +
		`&BBOX=${x0},${y0},${x0 + n * 5},${y0 + n * 5}&WIDTH=${n}&HEIGHT=${n}&FORMAT=ArcGrid`;
	const t = await fetchText({ font: 'icgc-mdt', url, valida: (s) => s.startsWith('NCOLS') });
	return maxDeArcGrid(t, x, y, radiM);
}

/**
 * Límits comarcals de l'ICGC (Divisions administratives, escala 1:250.000, CC BY 4.0) via
 * WFS (GML 3.2, UTM 31N). Només s'usen per decidir si un candidat és a la comarca assignada
 * o a prop de la frontera; no es publiquen.
 */
const WFS_DIVISIONS =
	'https://geoserveis.icgc.cat/servei/catalunya/divisions-administratives/wfs?SERVICE=WFS&VERSION=2.0.0' +
	'&REQUEST=GetFeature&TYPENAMES=divisions_administratives_wfs:divisions_administratives_comarques_250000' +
	'&SRSNAME=EPSG:25831';

export interface ComarcaPoligon {
	codi: number;
	nom: string;
	/** Anells (exteriors i interiors) com a llistes de [x, y] en UTM 31N. */
	anells: { exterior: boolean; punts: [number, number][] }[];
}

export async function comarquesIcgc(): Promise<ComarcaPoligon[]> {
	const t = await fetchText({
		font: 'icgc-divisions',
		url: WFS_DIVISIONS,
		valida: (s) => s.includes('CODICOMAR')
	});
	return t
		.split('<wfs:member>')
		.slice(1)
		.map((m) => {
			const anells: ComarcaPoligon['anells'] = [];
			const re = /<gml:(exterior|interior)>[\s\S]*?<gml:posList>([^<]*)<\/gml:posList>/g;
			for (let r = re.exec(m); r; r = re.exec(m)) {
				const nums = r[2].trim().split(/\s+/).map(Number);
				const punts: [number, number][] = [];
				for (let i = 0; i + 1 < nums.length; i += 2) punts.push([nums[i], nums[i + 1]]);
				anells.push({ exterior: r[1] === 'exterior', punts });
			}
			return {
				codi: Number(/CODICOMAR>([^<]+)/.exec(m)![1]),
				nom: /NOMCOMAR>([^<]+)/.exec(m)![1],
				anells
			};
		});
}

/** Distància (m) d'un punt a una comarca: 0 si és a dins. */
export function distanciaAComarca(c: ComarcaPoligon, lat: number, lon: number): number {
	const { x, y } = aUtm31(lat, lon);
	let dins = false;
	let min = Infinity;
	for (const { punts } of c.anells) {
		for (let i = 0, j = punts.length - 1; i < punts.length; j = i++) {
			const [xi, yi] = punts[i];
			const [xj, yj] = punts[j];
			if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dins = !dins;
			// Distància al segment
			const dx = xj - xi;
			const dy = yj - yi;
			const l2 = dx * dx + dy * dy;
			const t = l2 ? Math.max(0, Math.min(1, ((x - xi) * dx + (y - yi) * dy) / l2)) : 0;
			min = Math.min(min, Math.hypot(x - (xi + t * dx), y - (yi + t * dy)));
		}
	}
	// Paritat de creuaments sobre tots els anells: exteriors i forats es compensen.
	return dins ? 0 : Math.round(min);
}

/** Analitza un ArcGrid ASCII i retorna la cota màxima dins del cercle (x, y, radi). */
export function maxDeArcGrid(t: string, x: number, y: number, radiM: number): MaxMdt | null {
	const tokens = t.trim().split(/\s+/);
	const cap: Record<string, number> = {};
	let i = 0;
	while (i < tokens.length && /^[A-Z_]+$/i.test(tokens[i])) {
		cap[tokens[i].toUpperCase()] = Number(tokens[i + 1]);
		i += 2;
	}
	const { NCOLS: nc, NROWS: nr, XLLCORNER: xll, YLLCORNER: yll, CELLSIZE: cs } = cap;
	const nodata = cap.NODATA_VALUE ?? -9999;
	let millor: { z: number; cx: number; cy: number; d: number } | null = null;
	for (let r = 0; r < nr; r++) {
		for (let c = 0; c < nc; c++) {
			const z = Number(tokens[i + r * nc + c]);
			if (!Number.isFinite(z) || z === nodata) continue;
			const cx = xll + (c + 0.5) * cs;
			const cy = yll + (nr - r - 0.5) * cs;
			const d = Math.hypot(cx - x, cy - y);
			if (d > radiM) continue;
			if (!millor || z > millor.z) millor = { z, cx, cy, d };
		}
	}
	if (!millor) return null;
	const p = deUtm31(millor.cx, millor.cy);
	return {
		z: Math.round(millor.z * 10) / 10,
		lat: p.lat,
		lon: p.lon,
		desplacamentM: Math.round(millor.d),
		aLaVora: millor.d > radiM - cs * 1.5
	};
}
