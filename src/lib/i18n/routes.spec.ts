import { describe, expect, it } from 'vitest';
import { buildUrlPatterns, localizePath, prerenderEntries } from './routes';

describe('rutes localitzades', () => {
	it("l'arrel va primer i el comodí al final", () => {
		const patterns = buildUrlPatterns();
		expect(patterns[0]).toEqual({
			pattern: '/',
			localized: [
				['ca', '/ca'],
				['es', '/es']
			]
		});
		expect(patterns.at(-1)?.pattern).toBe('/:path(.*)?');
	});

	it('tradueix el segment de secció i conserva el slug', () => {
		const cim = buildUrlPatterns().find((p) => p.pattern === '/cims/:slug');
		expect(cim?.localized).toEqual([
			['ca', '/ca/cims/:slug'],
			['es', '/es/cimas/:slug']
		]);
	});

	it('els patrons amb paràmetre van abans del seu pare', () => {
		const order = buildUrlPatterns().map((p) => p.pattern);
		expect(order.indexOf('/cims/:slug')).toBeLessThan(order.indexOf('/cims'));
		expect(order.indexOf('/comarques/:slug')).toBeLessThan(order.indexOf('/comarques'));
	});

	it('entrades de prerender en tots dos idiomes', () => {
		expect(localizePath('/comarques', 'es')).toBe('/es/comarcas');
		expect(localizePath('/mapa', 'es')).toBe('/es/mapa');
		expect(prerenderEntries()).toEqual([
			'/ca',
			'/es',
			'/ca/cims',
			'/es/cimas',
			'/ca/mapa',
			'/es/mapa'
		]);
	});
});
