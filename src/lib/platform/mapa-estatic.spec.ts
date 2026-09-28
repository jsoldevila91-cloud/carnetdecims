import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug } from '$lib/data/catalog';
import {
	MAPA_ESTATIC_ATRIBUCIO,
	MAPA_IGN_ATRIBUCIO,
	aWebMercator,
	mapaEstaticCobert,
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
