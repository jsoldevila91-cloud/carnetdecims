import { describe, expect, it } from 'vitest';
import { wikilocEmbedUrl, wikilocUrl } from './wikiloc';

describe('wikilocUrl', () => {
	it("obre el mapa de Wikiloc centrat al cim, en l'idioma de la pàgina", () => {
		const url = new URL(wikilocUrl(42.2396, 1.7028, 'ca'));
		expect(url.origin).toBe('https://ca.wikiloc.com');
		expect(url.pathname).toBe('/wikiloc/map.do');
		const [swLat, swLon] = url.searchParams.get('sw')!.split(',').map(Number);
		const [neLat, neLon] = url.searchParams.get('ne')!.split(',').map(Number);
		expect((swLat + neLat) / 2).toBeCloseTo(42.2396, 4);
		expect((swLon + neLon) / 2).toBeCloseTo(1.7028, 4);
		// Caixa d'uns 3 km de costat (radi 1,5 km): poques rutes alienes al cim
		expect((neLat - swLat) * 111.32).toBeCloseTo(3, 1);
		expect((neLon - swLon) * 111.32 * Math.cos((42.2396 * Math.PI) / 180)).toBeCloseTo(3, 1);
		expect(neLon - swLon).toBeGreaterThan(neLat - swLat);
	});

	it('castellà al subdomini es.', () => {
		expect(wikilocUrl(42.51876, 2.45677, 'es')).toMatch(/^https:\/\/es\.wikiloc\.com\//);
	});

	it('rebutja coordenades invàlides', () => {
		expect(() => wikilocUrl(Number.NaN, 1, 'ca')).toThrow(RangeError);
		expect(() => wikilocUrl(95, 1, 'ca')).toThrow(RangeError);
	});
});

describe('wikilocEmbedUrl', () => {
	it("dona l'URL del widget oficial en l'idioma de la pàgina", () => {
		const url = new URL(wikilocEmbedUrl(227473032, 'ca'));
		expect(url.origin).toBe('https://ca.wikiloc.com');
		expect(url.pathname).toBe('/wikiloc/embedv2.do');
		expect(url.searchParams.get('id')).toBe('227473032');
		expect(url.searchParams.get('elevation')).toBe('on');
		expect(wikilocEmbedUrl(1, 'es')).toMatch(/^https:\/\/es\.wikiloc\.com\//);
	});

	it('rebutja ids invàlids', () => {
		expect(() => wikilocEmbedUrl(0, 'ca')).toThrow(RangeError);
		expect(() => wikilocEmbedUrl(1.5, 'ca')).toThrow(RangeError);
	});
});
