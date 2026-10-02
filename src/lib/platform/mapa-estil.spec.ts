import { describe, expect, it } from 'vitest';
import type { StyleSpecification } from 'maplibre-gl';
import { CIMS } from '$lib/data/catalog';
import {
	ATRIBUCIO_ICGC,
	ATRIBUCIO_IGN,
	ATRIBUCIO_MAPA,
	ATRIBUCIO_MAPTERHORN,
	ATRIBUCIO_OSM,
	BBOX_CATALUNYA_NORD,
	BOUNDS_CATALEG,
	CAPA_IGN_ID,
	CENTRE_INICIAL,
	CONTORN_CATALUNYA_NORD,
	ESTIL_ICGC_URL,
	OMBREJAT_FOSC,
	FONT_IGN_ID,
	PLAN_IGN_WMTS,
	ZOOM_MIN_IGN,
	dinsCatalunyaNord,
	estilMapa,
	mostraRespatllaIgn,
	transformarEstil
} from './mapa-estil';

/** Estil mínim amb la mateixa estructura que els de l'ICGC (fonts i ids reals). */
function estilIcgc(): StyleSpecification {
	return {
		version: 8,
		glyphs: 'https://geoserveis.icgc.cat/vector-tiles/simbologia/glyphs/{fontstack}/{range}.pbf',
		sources: {
			openmaptiles: {
				type: 'vector',
				tiles: ['https://geoserveis.icgc.cat/servei/catalunya/mapa-base2/vt/{z}/{x}/{y}.pbf'],
				attribution: '<b>ContextMaps</b>: ICGC | © OpenMapTiles © OpenStreetMap contributors'
			},
			terrainICGC: {
				type: 'raster-dem',
				tiles: [
					'https://geoserveis.icgc.cat/servei/catalunya/contextmaps-terreny-5m-rgb/wmts/{z}/{x}/{y}.png'
				]
			},
			terrainMapZen: { type: 'raster-dem', url: 'https://tiles.mapterhorn.com/tilejson.json' },
			ortoEsri: {
				type: 'raster',
				tiles: [
					'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
				]
			}
		},
		layers: [
			{ id: 'background', type: 'background', paint: { 'background-color': '#464646' } },
			{
				id: 'terrainICGC_fosca',
				type: 'hillshade',
				source: 'terrainICGC',
				layout: { visibility: 'none' }
			},
			{
				id: 'terrainMapZen_fosca',
				type: 'hillshade',
				source: 'terrainMapZen',
				layout: { visibility: 'none' }
			},
			{
				id: 'contour-mestres',
				type: 'line',
				source: 'openmaptiles',
				'source-layer': 'contour',
				layout: { visibility: 'none', 'line-join': 'round' }
			},
			{ id: 'orto', type: 'raster', source: 'ortoEsri', layout: { visibility: 'none' } },
			{ id: 'place', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place' }
		]
	};
}

const visibilitat = (s: StyleSpecification, id: string) => {
	const l = s.layers.find((x) => x.id === id)!;
	return 'layout' in l ? (l.layout as { visibility?: string } | undefined)?.visibility : undefined;
};

describe('estilMapa', () => {
	it('URL dels estils vectorials oficials de l’ICGC', () => {
		expect(estilMapa('clar')).toBe('https://geoserveis.icgc.cat/styles/mapa-base-topografic.json');
		expect(estilMapa('fosc')).toBe('https://geoserveis.icgc.cat/styles/icgc_mapa_base_fosc.json');
		expect(Object.values(ESTIL_ICGC_URL).every((u) => u.startsWith('https://'))).toBe(true);
	});
});

describe('atribució', () => {
	it('conté les llicències exigides amb enllaç', () => {
		expect(ATRIBUCIO_MAPA).toContain('ICGC');
		expect(ATRIBUCIO_MAPA).toContain('https://creativecommons.org/licenses/by/4.0/');
		expect(ATRIBUCIO_MAPA).toContain('OpenStreetMap contributors');
		expect(ATRIBUCIO_MAPA).toContain('https://www.openstreetmap.org/copyright');
		expect(ATRIBUCIO_MAPA).toContain('OpenMapTiles');
		expect(ATRIBUCIO_MAPA).toContain('Mapterhorn');
		expect(ATRIBUCIO_IGN).toContain('IGN');
		expect(ATRIBUCIO_IGN).toContain('Etalab 2.0');
		for (const a of [ATRIBUCIO_MAPA, ATRIBUCIO_IGN])
			expect(a.match(/<a /g)!.length).toBe(a.match(/rel="noopener"/g)!.length);
	});
});

describe('transformarEstil', () => {
	it('normalitza l’atribució de cada font', () => {
		const s = transformarEstil('clar')(undefined, estilIcgc());
		expect(s.sources.openmaptiles).toMatchObject({
			attribution: `${ATRIBUCIO_ICGC} · ${ATRIBUCIO_OSM}`
		});
		expect(s.sources.terrainICGC).toMatchObject({ attribution: ATRIBUCIO_ICGC });
		expect(s.sources.terrainMapZen).toMatchObject({ attribution: ATRIBUCIO_MAPTERHORN });
		// Una font que no és de l'ICGC (i no es fa servir) es deixa tal qual.
		expect(s.sources.ortoEsri).toEqual(estilIcgc().sources.ortoEsri);
	});

	it('afegeix la font i la capa IGN (amagada, a sobre del mapa base)', () => {
		const s = transformarEstil('clar')(undefined, estilIcgc());
		expect(s.sources[FONT_IGN_ID]).toMatchObject({
			type: 'raster',
			tiles: [PLAN_IGN_WMTS],
			bounds: [...BBOX_CATALUNYA_NORD],
			attribution: ATRIBUCIO_IGN
		});
		expect(s.layers.at(-1)).toMatchObject({
			id: CAPA_IGN_ID,
			source: FONT_IGN_ID,
			minzoom: ZOOM_MIN_IGN,
			layout: { visibility: 'none' }
		});
		expect(PLAN_IGN_WMTS).toContain('{z}');
		expect(PLAN_IGN_WMTS).toContain('{x}');
		expect(PLAN_IGN_WMTS).toContain('{y}');
	});

	it('clar no canvia la visibilitat; fosc hi activa relleu i corbes', () => {
		const clar = transformarEstil('clar')(undefined, estilIcgc());
		expect(visibilitat(clar, 'terrainICGC_fosca')).toBe('none');
		const fosc = transformarEstil('fosc')(undefined, estilIcgc());
		expect(visibilitat(fosc, 'terrainICGC_fosca')).toBe('visible');
		expect(visibilitat(fosc, 'terrainMapZen_fosca')).toBe('visible');
		expect(visibilitat(fosc, 'contour-mestres')).toBe('visible');
		expect(fosc.layers.find((l) => l.id === 'contour-mestres')).toMatchObject({
			layout: { 'line-join': 'round' }
		});
		expect(fosc.layers.find((l) => l.id === 'terrainICGC_fosca')).toMatchObject({
			paint: OMBREJAT_FOSC
		});
		expect(visibilitat(fosc, 'orto')).toBe('none');
		expect(fosc.layers.find((l) => l.id === CAPA_IGN_ID)).toMatchObject({
			paint: { 'raster-hue-rotate': 180 }
		});
	});

	it('és pura i idempotent (no duplica la capa IGN)', () => {
		const original = estilIcgc();
		const copia = structuredClone(original);
		const t = transformarEstil('fosc');
		const un = t(undefined, original);
		expect(original).toEqual(copia);
		const dos = t(un, un);
		expect(dos.layers.filter((l) => l.id === CAPA_IGN_ID)).toHaveLength(1);
		expect(dos.layers.map((l) => l.id)).toEqual(un.layers.map((l) => l.id));
	});
});

describe('Catalunya Nord (respatlla IGN)', () => {
	it('tots els cims de la Catalunya Nord hi són a dins', () => {
		const cn = CIMS.filter((c) => c.zona === 'catalunya-nord');
		expect(cn.length).toBeGreaterThan(0);
		for (const c of cn) expect(dinsCatalunyaNord({ lat: c.lat!, lon: c.lon! }), c.slug).toBe(true);
	});

	it('Catalunya i Andorra hi queden fora, també els cims fronterers', () => {
		const dins = CIMS.filter(
			(c) => c.zona !== 'catalunya-nord' && dinsCatalunyaNord({ lat: c.lat!, lon: c.lon! })
		);
		expect(dins.map((c) => c.slug)).toEqual([]);
	});

	it('llocs coneguts', () => {
		expect(dinsCatalunyaNord({ lat: 42.6986, lon: 2.8954 })).toBe(true); // Perpinyà
		expect(dinsCatalunyaNord({ lat: 42.5, lon: 2.25 })).toBe(true); // Font-romeu/Cerdanya
		expect(dinsCatalunyaNord({ lat: 42.4317, lon: 1.928 })).toBe(false); // Puigcerdà
		expect(dinsCatalunyaNord({ lat: 42.5063, lon: 1.5218 })).toBe(false); // Andorra la Vella
		expect(dinsCatalunyaNord({ lat: 41.3874, lon: 2.1686 })).toBe(false); // Barcelona
		expect(dinsCatalunyaNord({ lat: 42.3876, lon: 2.1897 })).toBe(false); // Núria
		expect(dinsCatalunyaNord({ lat: 42.9, lon: 3.03 })).toBe(false); // Leucate (Aude)
	});

	it('la caixa de la font IGN conté el contorn', () => {
		const [o, s, e, n] = BBOX_CATALUNYA_NORD;
		for (const [lon, lat] of CONTORN_CATALUNYA_NORD) {
			expect(lon).toBeGreaterThanOrEqual(o);
			expect(lon).toBeLessThanOrEqual(e);
			expect(lat).toBeGreaterThanOrEqual(s);
			expect(lat).toBeLessThanOrEqual(n);
		}
	});

	it('mostraRespatllaIgn: centre a la Catalunya Nord i zoom ≥ mínim; accepta LngLat', () => {
		const canigo = { lat: 42.5188, lon: 2.4568 };
		expect(mostraRespatllaIgn(canigo, ZOOM_MIN_IGN)).toBe(true);
		expect(mostraRespatllaIgn(canigo, ZOOM_MIN_IGN - 0.1)).toBe(false);
		expect(mostraRespatllaIgn({ lat: 42.5188, lng: 2.4568 }, 14)).toBe(true);
		expect(mostraRespatllaIgn({ lat: 42.2395, lng: 1.7018 }, 14)).toBe(false); // Pedraforca
	});
});

describe('encaix inicial', () => {
	it('BOUNDS_CATALEG conté tots els cims amb marge', () => {
		const [[o, s], [e, n]] = BOUNDS_CATALEG;
		expect(o).toBeLessThan(e);
		expect(s).toBeLessThan(n);
		for (const c of CIMS) {
			expect(c.lon! - o, c.slug).toBeGreaterThan(0.1);
			expect(e - c.lon!, c.slug).toBeGreaterThan(0.1);
			expect(c.lat! - s, c.slug).toBeGreaterThan(0.08);
			expect(n - c.lat!, c.slug).toBeGreaterThan(0.08);
		}
		// Raonable: Pirineu i Catalunya, no mig món.
		expect(e - o).toBeLessThan(4);
		expect(n - s).toBeLessThan(3);
	});

	it('CENTRE_INICIAL és el centre de la caixa, [lon, lat]', () => {
		const [[o, s], [e, n]] = BOUNDS_CATALEG;
		expect(CENTRE_INICIAL[0]).toBeCloseTo((o + e) / 2, 3);
		expect(CENTRE_INICIAL[1]).toBeCloseTo((s + n) / 2, 3);
		expect(CENTRE_INICIAL[0]).toBeGreaterThan(0.5);
		expect(CENTRE_INICIAL[0]).toBeLessThan(3);
		expect(CENTRE_INICIAL[1]).toBeGreaterThan(41);
		expect(CENTRE_INICIAL[1]).toBeLessThan(42.5);
	});
});
