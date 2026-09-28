/**
 * Wikidata (CC0). Una sola consulta SPARQL: elements de tipus muntanya/cim/turó dins del bbox
 * amb coordenades, etiquetes (ca/es/fr/oc/en), àlies en català i altitud (P2044).
 * Només es fa servir per validar i com a font d'altitud declarada (CC0, sense restriccions).
 */
import { fetchJson } from '../lib/http.ts';
import { BBOX } from './osm.ts';

const SPARQL = 'https://query.wikidata.org/sparql';

export interface CimWikidata {
	qid: string;
	lat: number;
	lon: number;
	noms: string[];
	ele: number | null;
	eles: number[];
}

interface Binding {
	[k: string]: { value: string } | undefined;
}

export async function cimsWikidata(): Promise<CimWikidata[]> {
	const { s, w, n, e } = BBOX;
	const q = `SELECT ?item ?coord ?ele ?lab WHERE {
  SERVICE wikibase:box {
    ?item wdt:P625 ?coord .
    bd:serviceParam wikibase:cornerSouthWest "Point(${w} ${s})"^^geo:wktLiteral .
    bd:serviceParam wikibase:cornerNorthEast "Point(${e} ${n})"^^geo:wktLiteral .
  }
  ?item wdt:P31 ?cls . VALUES ?cls { wd:Q8502 wd:Q207326 wd:Q54050 wd:Q1595289 }
  OPTIONAL { ?item wdt:P2044 ?ele }
  OPTIONAL { { ?item rdfs:label ?lab } UNION { ?item skos:altLabel ?lab }
             FILTER(lang(?lab) IN ("ca","es","fr","oc","en")) }
}`;
	const j = await fetchJson<{ results: { bindings: Binding[] } }>({
		font: 'wikidata',
		url: SPARQL,
		method: 'POST',
		body: `query=${encodeURIComponent(q)}`,
		headers: {
			Accept: 'application/sparql-results+json',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		valida: (t) => t.includes('"bindings"')
	});
	type Parcial = Omit<CimWikidata, 'ele' | 'eles'> & { eles: Set<number> };
	const perItem = new Map<string, Parcial>();
	for (const b of j.results.bindings) {
		const qid = b.item!.value.split('/').pop()!;
		const m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(b.coord!.value);
		if (!m) continue;
		let it = perItem.get(qid);
		if (!it) {
			it = { qid, lon: Number(m[1]), lat: Number(m[2]), noms: [], eles: new Set() };
			perItem.set(qid, it);
		}
		if (b.lab && !it.noms.includes(b.lab.value)) it.noms.push(b.lab.value);
		if (b.ele) it.eles.add(Number(b.ele.value));
	}
	return [...perItem.values()].map(({ eles, ...it }) => ({
		...it,
		// Hi pot haver diversos valors (fonts diferents): el build tria el més coherent amb el MDT.
		eles: [...eles],
		ele: eles.size ? Math.max(...eles) : null
	}));
}

export const urlWikidata = (qid: string) => `https://www.wikidata.org/wiki/${qid}`;
