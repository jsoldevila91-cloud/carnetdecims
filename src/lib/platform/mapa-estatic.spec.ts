import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug, cimsPerComarca, comarquesAmbCims } from '$lib/data/catalog';
import {
	MAPA_ESTATIC_ATRIBUCIO,
	MAPA_IGN_ATRIBUCIO,
	aWebMercator,
	mapaEstaticCobert,
	mapaEstaticComarca,
	mapaEstaticIgnUrl,
	mapaEstaticPerCim,
	mapaEstaticUrl
} from './mapa-estatic';

/** Llegeix la BBOX d'una URL GetMap. */
function bbox(url: string): number[] {
	return new URL(url).searchParams.get('BBOX')!.split(',').map(Number);
}

describe('mapaEstaticUrl (WMS topogràfic de l’ICGC)', () => {
	it('URL GetMap del servei i capa verificats, amb els valors per defecte', () => {
		const url = mapaEstaticUrl(42.2386, 1.7036);
		expect(url.startsWith('https://geoserveis.icgc.cat/servei/catalunya/mapa-base/wms?')).toBe(
			true
		);
		const p = new URL(url).searchParams;
		expect(Object.fromEntries(p)).toMatchObject({
			SERVICE: 'WMS',
			VERSION: '1.1.1',
			REQUEST: 'GetMap',
			LAYERS: 'topografic',
			STYLES: '',
			SRS: 'EPSG:3857',
			WIDTH: '640',
			HEIGHT: '400',
			FORMAT: 'image/png'
		});
		// Llegible: sense ':' ni ',' codificats
		expect(url).toContain('SRS=EPSG:3857');
		expect(url).not.toMatch(/%3A|%2C/);
	});

	it('BBOX centrada en el cim, amb píxels quadrats i km reals', () => {
		const lat = 42.51876;
		const lon = 2.45677;
		const [minx, miny, maxx, maxy] = bbox(
			mapaEstaticUrl(lat, lon, { zoomKm: 5, ample: 800, alt: 600 })
		);
		const { x, y } = aWebMercator(lat, lon);
		expect((minx + maxx) / 2).toBeCloseTo(x, 1);
		expect((miny + maxy) / 2).toBeCloseTo(y, 1);
		expect((maxx - minx) / (maxy - miny)).toBeCloseTo(800 / 600, 5);
		// Amplada Mercator × cos(lat) = amplada real
		expect(((maxx - minx) * Math.cos((lat * Math.PI) / 180)) / 1000).toBeCloseTo(5, 2);
	});

	it('Web Mercator: origen i valors coneguts', () => {
		expect(aWebMercator(0, 0)).toEqual({ x: 0, y: expect.closeTo(0, 6) });
		const { x } = aWebMercator(0, 180);
		expect(x).toBeCloseTo(20037508.34, 1);
	});

	it('rebutja coordenades i mides invàlides', () => {
		expect(() => mapaEstaticUrl(Number.NaN, 1)).toThrow(RangeError);
		expect(() => mapaEstaticUrl(90, 1)).toThrow(RangeError);
		expect(() => mapaEstaticUrl(42, 181)).toThrow(RangeError);
		expect(() => mapaEstaticUrl(42, 1, { ample: 0 })).toThrow(RangeError);
		expect(() => mapaEstaticUrl(42, 1, { alt: 10.5 })).toThrow(RangeError);
		expect(() => mapaEstaticUrl(42, 1, { zoomKm: -1 })).toThrow(RangeError);
	});
});

describe('cobertura i alternativa (Catalunya Nord → Plan IGN)', () => {
	it('ICGC per a Catalunya i Andorra; no per a la Catalunya Nord', () => {
		expect(mapaEstaticCobert(cimPerSlug('pedraforca-pollego-superior')!)).toBe(true);
		expect(mapaEstaticCobert(cimPerSlug('comapedrosa')!)).toBe(true);
		expect(mapaEstaticCobert(cimPerSlug('canigo')!)).toBe(false);
		expect(mapaEstaticCobert({ lat: null, lon: null, zona: 'catalunya' })).toBe(false);
		expect(
			CIMS.filter((c) => !mapaEstaticCobert(c)).every((c) => c.zona === 'catalunya-nord')
		).toBe(true);
	});

	it('mapaEstaticPerCim tria la font i l’atribució', () => {
		const icgc = mapaEstaticPerCim(cimPerSlug('comapedrosa')!)!;
		expect(icgc.font).toBe('icgc');
		expect(icgc.atribucio).toBe(MAPA_ESTATIC_ATRIBUCIO);
		expect(icgc.url).toContain('geoserveis.icgc.cat');

		const ign = mapaEstaticPerCim(cimPerSlug('canigo')!, { zoomKm: 3 })!;
		expect(ign.font).toBe('ign');
		expect(ign.atribucio).toBe(MAPA_IGN_ATRIBUCIO);
		expect(ign.url).toBe(mapaEstaticIgnUrl(42.51876, 2.45677, { zoomKm: 3 }));
		const p = new URL(ign.url).searchParams;
		expect(p.get('LAYERS')).toBe('GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2');
		expect(p.get('CRS')).toBe('EPSG:3857');
		expect(p.get('VERSION')).toBe('1.3.0');

		expect(mapaEstaticPerCim({ lat: null, lon: null, zona: 'andorra' })).toBeNull();
		for (const c of CIMS) expect(mapaEstaticPerCim(c), c.slug).not.toBeNull();
	});
});

/** Inversa de Web Mercator (EPSG:3857 → WGS84), independent del codi provat. */
function deWebMercator(x: number, y: number) {
	const R = 6378137;
	return {
		lat: ((2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180) / Math.PI,
		lon: ((x / R) * 180) / Math.PI
	};
}

describe('mapaEstaticComarca (mapa amb tots els cims d’una comarca)', () => {
	it('projecció: dos cims a la mateixa latitud cauen als % esperats', () => {
		// Amplada 1° de longitud; l'alçada és la mínima (8 km) i l'eix curt s'amplia a 16:10.
		// x: marge del 10 % per banda → 0,1 / 1,2 = 8,33 % i 1,1 / 1,2 = 91,67 %; y: al centre.
		const m = mapaEstaticComarca([
			{ slug: 'oest', lat: 42, lon: 1, zona: 'catalunya' },
			{ slug: 'est', lat: 42, lon: 2, zona: 'catalunya' }
		])!;
		expect(m.punts).toEqual([
			{ slug: 'oest', xPct: 8.33, yPct: 50 },
			{ slug: 'est', xPct: 91.67, yPct: 50 }
		]);
		const [x0, y0, x1, y1] = m.bbox;
		expect((x1 - x0) / (y1 - y0)).toBeCloseTo(640 / 400, 4);
		expect(bbox(m.url)).toEqual(m.bbox);
	});

	it('un sol cim: centrat, amb l’extensió mínima i la proporció de la imatge', () => {
		const pedraforca = cimPerSlug('pedraforca-pollego-superior')!;
		const m = mapaEstaticComarca([pedraforca], { ample: 600, alt: 600 })!;
		expect(m.punts).toEqual([{ slug: pedraforca.slug, xPct: 50, yPct: 50 }]);
		const [x0, y0, x1, y1] = m.bbox;
		expect(x1 - x0).toBeCloseTo(y1 - y0, 1);
		// 8 km reals + 10 % per banda = 9,6 km
		const kmReals = ((x1 - x0) * Math.cos((pedraforca.lat! * Math.PI) / 180)) / 1000;
		expect(kmReals).toBeCloseTo(9.6, 2);
		const p = new URL(m.url).searchParams;
		expect(p.get('WIDTH')).toBe('600');
		expect(p.get('HEIGHT')).toBe('600');
	});

	it('Berguedà: el % de cada cim desfà la projecció fins a les seves coordenades', () => {
		const cims = cimsPerComarca('bergueda');
		const m = mapaEstaticComarca(cims, { ample: 800, alt: 500 })!;
		expect(m.font).toBe('icgc');
		expect(m.atribucio).toBe(MAPA_ESTATIC_ATRIBUCIO);
		expect(m.punts.map((p) => p.slug)).toEqual(cims.map((c) => c.slug));
		const [x0, y0, x1, y1] = m.bbox;
		expect((x1 - x0) / (y1 - y0)).toBeCloseTo(800 / 500, 4);
		for (const p of m.punts) {
			const cim = cimPerSlug(p.slug)!;
			const { lat, lon } = deWebMercator(
				x0 + (p.xPct / 100) * (x1 - x0),
				y1 - (p.yPct / 100) * (y1 - y0)
			);
			// 0,01 % d'una imatge de ~50 km ≈ 5 m
			expect(lat, p.slug).toBeCloseTo(cim.lat!, 3);
			expect(lon, p.slug).toBeCloseTo(cim.lon!, 3);
		}
	});

	it('totes les comarques: cims dins la imatge i amb el marge (≥ 8,33 % de les vores)', () => {
		for (const comarca of comarquesAmbCims()) {
			const m = mapaEstaticComarca(cimsPerComarca(comarca.slug))!;
			expect(m, comarca.slug).not.toBeNull();
			for (const p of m.punts) {
				expect(p.xPct, `${comarca.slug}/${p.slug}`).toBeGreaterThanOrEqual(8.33);
				expect(p.xPct, `${comarca.slug}/${p.slug}`).toBeLessThanOrEqual(91.67);
				expect(p.yPct, `${comarca.slug}/${p.slug}`).toBeGreaterThanOrEqual(8.33);
				expect(p.yPct, `${comarca.slug}/${p.slug}`).toBeLessThanOrEqual(91.67);
			}
			expect(m.font, comarca.slug).toBe(comarca.zona === 'catalunya-nord' ? 'ign' : 'icgc');
		}
	});

	it('Catalunya Nord → Plan IGN; Andorra → ICGC', () => {
		const cn = mapaEstaticComarca(cimsPerComarca('catalunya-nord'))!;
		expect(cn.font).toBe('ign');
		expect(cn.atribucio).toBe(MAPA_IGN_ATRIBUCIO);
		expect(new URL(cn.url).searchParams.get('CRS')).toBe('EPSG:3857');
		expect(mapaEstaticComarca(cimsPerComarca('andorra'))!.font).toBe('icgc');
	});

	it('sense cims amb coordenades → null; mides invàlides → RangeError', () => {
		expect(mapaEstaticComarca([])).toBeNull();
		expect(mapaEstaticComarca([{ slug: 'x', lat: null, lon: null, zona: 'catalunya' }])).toBeNull();
		const c = cimPerSlug('canigo')!;
		expect(() => mapaEstaticComarca([c], { ample: 0 })).toThrow(RangeError);
		expect(() => mapaEstaticComarca([c], { alt: 5000 })).toThrow(RangeError);
	});
});
