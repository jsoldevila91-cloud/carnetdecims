import { describe, expect, it } from 'vitest';
import { ampleParaulaMesLlargaEm } from './titol-ample';

describe('ampleParaulaMesLlargaEm', () => {
	it('suma les amplades de la paraula més llarga (en em)', () => {
		// Mesurat al navegador: "COMABONA" fa 7,898 em
		expect(ampleParaulaMesLlargaEm('Comabona')).toBeCloseTo(7.9, 1);
		expect(ampleParaulaMesLlargaEm('Pic de Comaloforno')).toBeCloseTo(
			ampleParaulaMesLlargaEm('Comaloforno'),
			5
		);
	});

	it('les lletres estretes compten menys que les amples', () => {
		expect(ampleParaulaMesLlargaEm('Castellsapera')).toBeLessThan(13);
		expect(ampleParaulaMesLlargaEm('Montcorbison')).toBeGreaterThan(
			ampleParaulaMesLlargaEm('Castellsapera') - 1.5
		);
		expect(ampleParaulaMesLlargaEm('MMM')).toBeGreaterThan(ampleParaulaMesLlargaEm('III'));
	});

	it('accents, apòstrofs i caràcters desconeguts', () => {
		expect(ampleParaulaMesLlargaEm("d'Estats")).toBeCloseTo(
			0.92 + 0.31 + 0.85 + 0.87 + 0.87 + 0.94 + 0.87 + 0.87,
			5
		);
		expect(ampleParaulaMesLlargaEm('123')).toBe(3);
		expect(ampleParaulaMesLlargaEm('')).toBe(1);
	});
});
