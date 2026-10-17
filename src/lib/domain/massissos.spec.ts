import { describe, expect, it } from 'vitest';
import cims from '$lib/data/catalog/cims.json';
import { MASSISSOS, MIN_CIMS_MASSIS } from './massissos';

/** Llistes curades verificades contra el catàleg real (vegeu la capçalera de `massissos.ts`). */
describe('MASSISSOS contra el catàleg', () => {
	const perSlug = new Map(cims.map((c) => [c.slug, c]));

	it('ids únics i cap cim en dos massissos', () => {
		expect(new Set(MASSISSOS.map((m) => m.id)).size).toBe(MASSISSOS.length);
		const tots = MASSISSOS.flatMap((m) => m.cims);
		expect(new Set(tots).size).toBe(tots.length);
	});

	for (const m of MASSISSOS) {
		it(`${m.id}: ≥ ${MIN_CIMS_MASSIS} cims, tots al catàleg i dins la caixa`, () => {
			expect(m.cims.length).toBeGreaterThanOrEqual(MIN_CIMS_MASSIS);
			const [o, s, e, n] = m.bbox;
			for (const slug of m.cims) {
				const c = perSlug.get(slug);
				expect(c, slug).toBeDefined();
				expect(c!.lat, slug).not.toBeNull();
				expect(c!.lon! >= o && c!.lon! <= e && c!.lat! >= s && c!.lat! <= n, slug).toBe(true);
			}
		});
	}

	it('instantània de les llistes (canvis conscients)', () => {
		expect(Object.fromEntries(MASSISSOS.map((m) => [m.id, m.cims.length]))).toEqual({
			montseny: 4,
			montserrat: 3,
			'sant-llorenc-del-munt': 3,
			ports: 5,
			'cadi-moixero': 5,
			prades: 3,
			montsec: 3
		});
	});
});
