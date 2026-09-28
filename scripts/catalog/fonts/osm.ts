/**
 * OpenStreetMap via Overpass API (© OpenStreetMap contributors, ODbL 1.0).
 *
 * Una sola consulta per a tot l'àmbit (bbox Catalunya + Andorra + Catalunya Nord) amb els
 * nodes `natural=peak|volcano|hill` que tenen nom; la resposta es desa a la caché i el
 * build treballa en local. Política d'ús: https://wiki.openstreetmap.org/wiki/Overpass_API
 * (User-Agent identificable i consultes esporàdiques).
 */
import { fetchJson } from '../lib/http.ts';

const OVERPASS = 'https://overpass-api.de/api/interpreter';
export const BBOX = { s: 40.45, w: 0.1, n: 42.95, e: 3.35 };

export interface CimOsm {
	id: number;
	lat: number;
	lon: number;
	noms: string[];
	ele: number | null;
	eleText: string | null;
	natural: string;
}

interface RespostaOverpass {
	elements: { type: string; id: number; lat: number; lon: number; tags: Record<string, string> }[];
}

const CLAUS_NOM = [
	'name',
	'name:ca',
	'alt_name',
	'alt_name:ca',
	'official_name',
	'old_name',
	'loc_name',
	'name:fr',
	'name:oc'
];

/** Interpreta `ele` ("3143", "3143 m", "3.143", "3143;3141"). */
export function parseEle(v: string | undefined): number | null {
	if (!v) return null;
	const m = /^\s*(-?\d+(?:[.,]\d+)?)/.exec(v.split(';')[0]);
	if (!m) return null;
	let s = m[1];
	// "3.143" (separador de milers) → 3143
	if (/^\d\.\d{3}$/.test(s)) s = s.replace('.', '');
	const n = Number(s.replace(',', '.'));
	return Number.isFinite(n) ? n : null;
}

export async function cimsOsm(): Promise<CimOsm[]> {
	const { s, w, n, e } = BBOX;
	const q = `[out:json][timeout:300];
(
  node["natural"~"^(peak|volcano|hill)$"]["name"](${s},${w},${n},${e});
  node["natural"~"^(peak|volcano|hill)$"]["name:ca"](${s},${w},${n},${e});
);
out body;`;
	const j = await fetchJson<RespostaOverpass>({
		font: 'osm',
		url: OVERPASS,
		method: 'POST',
		body: `data=${encodeURIComponent(q)}`,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		valida: (t) => t.includes('"elements"')
	});
	return j.elements
		.filter((el) => el.type === 'node')
		.map((el) => {
			const noms = new Set<string>();
			for (const k of CLAUS_NOM) {
				for (const v of (el.tags[k] ?? '').split(';')) if (v.trim()) noms.add(v.trim());
			}
			return {
				id: el.id,
				lat: el.lat,
				lon: el.lon,
				noms: [...noms],
				ele: parseEle(el.tags.ele),
				eleText: el.tags.ele ?? null,
				natural: el.tags.natural
			};
		});
}

export const urlNodeOsm = (id: number) => `https://www.openstreetmap.org/node/${id}`;
