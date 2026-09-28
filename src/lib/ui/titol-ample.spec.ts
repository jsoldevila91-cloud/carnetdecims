import { describe, expect, it } from 'vitest';
import { ampleParaulaMesLlargaEm, ampleTextEm } from './titol-ample';

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

	it('amplada del nom sencer amb els espais', () => {
		expect(ampleTextEm('Taga')).toBeCloseTo(ampleParaulaMesLlargaEm('Taga'), 5);
		expect(ampleTextEm('de de')).toBeCloseTo(2 * ampleParaulaMesLlargaEm('de') + 0.3, 5);
		expect(ampleTextEm('Tuc deth Pòrt de Vielha')).toBeGreaterThan(
			3 * ampleParaulaMesLlargaEm('Tuc deth Pòrt de Vielha')
		);
		expect(ampleTextEm('  ')).toBe(1);
	});
});
