import { describe, expect, it } from 'vitest';
import {
	buildUrlPatterns,
	cimEntries,
	localizeCimPath,
	localizePath,
	prerenderEntries
} from './routes';

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

	it('fitxa de cim: segment traduït i mateix slug', () => {
		expect(localizeCimPath('pedraforca-pollego-superior', 'ca')).toBe(
			'/ca/cims/pedraforca-pollego-superior'
		);
		expect(localizeCimPath('canigo', 'es')).toBe('/es/cimas/canigo');
		expect(() => localizeCimPath('Canigó', 'ca')).toThrow(RangeError);
		expect(() => localizeCimPath('', 'es')).toThrow(RangeError);
		expect(() => localizeCimPath('a/../b', 'es')).toThrow(RangeError);
	});

	it('cimEntries: 300 URL de fitxes (150 × ca/es), úniques', () => {
		const entries = cimEntries();
		expect(entries).toHaveLength(300);
		expect(new Set(entries).size).toBe(300);
		expect(entries.filter((e) => e.startsWith('/ca/cims/'))).toHaveLength(150);
		expect(entries.filter((e) => e.startsWith('/es/cimas/'))).toHaveLength(150);
		expect(entries.slice(0, 2)).toEqual([
			'/ca/cims/el-cogullo-de-cabra',
			'/es/cimas/el-cogullo-de-cabra'
		]);
		expect(entries).toContain('/es/cimas/comapedrosa');
	});
});
