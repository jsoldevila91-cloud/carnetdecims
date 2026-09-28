/**
 * IGN France – Géoplateforme (Licence Ouverte / Open Licence 2.0 d'Etalab: només atribució).
 *
 * - Geocodificació de POI (BD TOPO): https://data.geopf.fr/geocodage/search?index=poi
 *   Els topònims de la Catalunya Nord sovint hi surten en català ("la Torre d'Eina").
 * - Altimetria (RGE ALTI): https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json
 */
import { fetchJson } from '../lib/http.ts';

const GEOCODAGE = 'https://data.geopf.fr/geocodage/search';
const ALTI = 'https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json';

export interface PoiIgn {
	nom: string;
	categories: string[];
	lat: number;
	lon: number;
	id: string;
	departament: string;
}

interface RespostaGeocodage {
	features: {
		geometry: { coordinates: [number, number] };
		properties: {
			toponym?: string;
			name?: string[];
			category?: string[];
			depcode?: string[];
			extrafields?: { cleabs?: string };
		};
	}[];
}

export function urlCercaIgn(text: string) {
	return `${GEOCODAGE}?q=${encodeURIComponent(text)}&index=poi&limit=10&lat=42.5&lon=2.3`;
}

/** POI orogràfics (cims, pics) que coincideixen amb el text. */
export async function cercaIgn(text: string): Promise<PoiIgn[]> {
	const j = await fetchJson<RespostaGeocodage>({
		font: 'ign',
		url: urlCercaIgn(text),
		valida: (t) => t.includes('"features"')
	});
	return j.features
		.map((f) => ({
			nom: f.properties.toponym ?? f.properties.name?.[0] ?? '',
			categories: f.properties.category ?? [],
			lon: f.geometry.coordinates[0],
			lat: f.geometry.coordinates[1],
			id: f.properties.extrafields?.cleabs ?? '',
			departament: f.properties.depcode?.[0] ?? ''
		}))
		.filter((p) => p.categories.some((c) => /sommet|pic|orographique|col|crête|rocher/i.test(c)));
}

/**
 * Cota màxima del RGE ALTI en una graella de 9×9 punts (pas ≈ 10 m) al voltant del punt.
 * `null` si el servei no té dades (retorna -99999 fora de cobertura).
 */
export async function maxAltiIgn(
	lat: number,
	lon: number
): Promise<{ z: number; lat: number; lon: number } | null> {
	const dLat = 10 / 111_320;
	const dLon = 10 / (111_320 * Math.cos((lat * Math.PI) / 180));
	const lats: string[] = [];
	const lons: string[] = [];
	for (let i = -4; i <= 4; i++) {
		for (let j = -4; j <= 4; j++) {
			lats.push((lat + i * dLat).toFixed(6));
			lons.push((lon + j * dLon).toFixed(6));
		}
	}
	const url = `${ALTI}?lon=${lons.join('|')}&lat=${lats.join('|')}&resource=ign_rge_alti_wld&zonly=false`;
	const j = await fetchJson<{ elevations: { lat: number; lon: number; z: number }[] }>({
		font: 'ign-alti',
		url,
		valida: (t) => t.includes('"elevations"')
	});
	const valids = j.elevations.filter((e) => e.z > -1000);
	if (!valids.length) return null;
	const max = valids.reduce((a, b) => (b.z > a.z ? b : a));
	return { z: Math.round(max.z * 10) / 10, lat: max.lat, lon: max.lon };
}
