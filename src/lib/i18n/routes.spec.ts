import { describe, expect, it } from 'vitest';
import { PAGINES_CONTINGUT } from '$lib/content/types';
import {
	CONTINGUT_PATHS,
	LOCALIZED_ROUTES,
	PRERENDER_PATHS,
	buildUrlPatterns,
	cimEntries,
	comarcaEntries,
	localizeCimPath,
	localizeComarcaPath,
	localizePath,
	prerenderEntries,
	slugsComarquesAmbCims
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
			'/es/mapa',
			'/ca/comarques',
			'/es/comarcas',
			'/ca/cims-essencials',
			'/es/cimas-esenciales',
			'/ca/tresmils',
			'/es/tresmiles',
			'/ca/cims-mes-alts',
			'/es/cimas-mas-altas',
			'/ca/repte-100-cims',
			'/es/reto-100-cims',
			'/ca/repte-100-cims/normativa',
			'/es/reto-100-cims/normativa',
			'/ca/repte-100-cims/com-validar',
			'/es/reto-100-cims/como-validar',
			'/ca/repte-100-cims/repte-infantil',
			'/es/reto-100-cims/reto-infantil',
			'/ca/metodologia',
			'/es/metodologia',
			'/ca/sobre-el-projecte',
			'/es/sobre-el-proyecto',
			'/ca/avis-legal',
			'/es/aviso-legal',
			'/ca/privacitat',
			'/es/privacidad'
		]);
	});

	it('pàgines de contingut: totes tenen ruta localitzada explícita i es prerenderitzen', () => {
		expect(CONTINGUT_PATHS).toEqual(Object.values(PAGINES_CONTINGUT));
		for (const p of CONTINGUT_PATHS) {
			expect(LOCALIZED_ROUTES.some((r) => r.path === p)).toBe(true);
			expect(PRERENDER_PATHS).toContain(p);
		}
		expect(localizePath('/metodologia', 'es')).toBe('/es/metodologia');
		const patro = buildUrlPatterns().find((p) => p.pattern === '/metodologia');
		expect(patro?.localized).toEqual([
			['ca', '/ca/metodologia'],
			['es', '/es/metodologia']
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

	it('pàgina de comarca: segment traduït i mateix slug', () => {
		expect(localizeComarcaPath('bergueda', 'ca')).toBe('/ca/comarques/bergueda');
		expect(localizeComarcaPath('val-d-aran', 'es')).toBe('/es/comarcas/val-d-aran');
		expect(localizeComarcaPath('catalunya-nord', 'es')).toBe('/es/comarcas/catalunya-nord');
		expect(() => localizeComarcaPath('Berguedà', 'ca')).toThrow(RangeError);
		expect(() => localizeComarcaPath('', 'ca')).toThrow(RangeError);
		expect(() => localizeComarcaPath('../x', 'es')).toThrow(RangeError);
	});

	it('comarcaEntries: només les comarques amb cims, en tots dos idiomes', () => {
		const slugs = slugsComarquesAmbCims();
		expect(slugs).toHaveLength(43);
		expect(slugs).not.toContain('segarra');
		expect(slugs).toContain('andorra');
		expect(slugs).toContain('catalunya-nord');
		const entries = comarcaEntries();
		expect(entries).toHaveLength(86);
		expect(new Set(entries).size).toBe(86);
		expect(entries.slice(0, 2)).toEqual(['/ca/comarques/alt-camp', '/es/comarcas/alt-camp']);
		expect(entries).not.toContain('/ca/comarques/segarra');
		expect(entries).toContain('/es/comarcas/andorra');
	});
});
