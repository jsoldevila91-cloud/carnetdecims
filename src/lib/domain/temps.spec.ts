import { describe, expect, it } from 'vitest';
import { CATEGORIES_TEMPS, categoriaTemps, esCategoriaTemps } from './index';

describe('categoriaTemps (codi WMO → icona)', () => {
	it.each([
		[0, 'sol'],
		[1, 'sol'],
		[2, 'poc-nuvol'],
		[3, 'nuvol'],
		[45, 'boira'],
		[48, 'boira'],
		[51, 'pluja'],
		[53, 'pluja'],
		[55, 'pluja'],
		[56, 'pluja'],
		[57, 'pluja'],
		[61, 'pluja'],
		[63, 'pluja'],
		[65, 'pluja'],
		[66, 'pluja'],
		[67, 'pluja'],
		[80, 'pluja'],
		[81, 'pluja'],
		[82, 'pluja'],
		[71, 'neu'],
		[73, 'neu'],
		[75, 'neu'],
		[77, 'neu'],
		[85, 'neu'],
		[86, 'neu'],
		[95, 'tempesta'],
		[96, 'tempesta'],
		[99, 'tempesta']
	] as const)('%i → %s', (codi, categoria) => {
		expect(categoriaTemps(codi)).toBe(categoria);
	});

	it('codis no documentats o no enters → null (sense icona inventada)', () => {
		for (const c of [4, 10, 44, 50, 60, 70, 90, 98, 100, -1, 1.5, Number.NaN, Infinity]) {
			expect(categoriaTemps(c), String(c)).toBeNull();
		}
	});

	it('tots els codis documentats (0–99) donen una categoria coneguda', () => {
		const vistes = new Set<string>();
		for (let c = 0; c <= 99; c++) {
			const cat = categoriaTemps(c);
			if (cat) {
				expect(esCategoriaTemps(cat)).toBe(true);
				vistes.add(cat);
			}
		}
		expect([...vistes].sort()).toEqual([...CATEGORIES_TEMPS].sort());
		expect(esCategoriaTemps('lluna')).toBe(false);
		expect(esCategoriaTemps(3)).toBe(false);
	});
});
