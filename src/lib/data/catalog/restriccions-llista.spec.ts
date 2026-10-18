import { describe, expect, it } from 'vitest';
import { restriccionsVigents } from '$lib/domain';
import { CIMS } from './cataleg';
import { cimPerSlug } from './queries';

// Restriccions reals del catàleg (llista de la FEEC, docs/03-modelo-datos.md §3.3.5).
describe('restriccions vigents a la llista de cims (catàleg real)', () => {
	it('La Picossa: tancada del 15/01 al 15/06; fora de temporada, cap avís', () => {
		const picossa = cimPerSlug('la-picossa')!;
		expect(restriccionsVigents(CIMS, '2027-03-01').get(picossa.id)).toMatchObject({
			tipus: 'fauna',
			fins: '2027-06-15',
			incerta: false
		});
		expect(restriccionsVigents(CIMS, '2026-10-18').has(picossa.id)).toBe(false);
	});

	it('Sant Salvador de les Espases: obres sense dates → avís incert tot l’any', () => {
		const espases = cimPerSlug('sant-salvador-de-les-espases')!;
		for (const data of ['2026-10-18', '2027-03-01']) {
			expect(restriccionsVigents(CIMS, data).get(espases.id)).toMatchObject({
				tipus: 'obres',
				fins: null,
				incerta: true
			});
		}
	});
});
