import { describe, expect, it } from 'vitest';
import { formatFins, horaCurta, textAcces, textCondicio } from './info-rapida';

describe('info ràpida (R5.2)', () => {
	it('condició: sol de dia "Assolellat", de nit "Serè"', () => {
		expect(textCondicio({ categoria: 'sol', esDia: true })).toBe('Assolellat');
		expect(textCondicio({ categoria: 'sol', esDia: false })).toBe('Serè');
		expect(textCondicio({ categoria: 'tempesta', esDia: false })).toBe('Tempesta');
	});

	it('hora curta', () => {
		expect(horaCurta('2026-10-18T10:15')).toBe('10:15');
		expect(horaCurta('10:15')).toBe('10:15');
	});

	it('data de fi: sense any si és el mateix any', () => {
		expect(formatFins('2026-07-15', '2026-03-01', 'ca')).toBe('15 de juliol');
		expect(formatFins('2027-01-31', '2026-12-01', 'ca')).toMatch(/2027/);
	});

	it('avís: fins a, sense data de fi i incerta (mai "tancat")', () => {
		expect(
			textAcces({ tipus: 'fauna', fins: '2026-07-15', incerta: false }, '2026-03-01', 'ca')
		).toBe('Accés restringit fins al dia 15 de juliol · Protecció de la fauna');
		expect(textAcces({ tipus: 'militar', fins: null, incerta: false }, '2026-03-01', 'ca')).toBe(
			'Accés restringit (sense data de fi) · Zona militar'
		);
		const incerta = textAcces({ tipus: 'obres', fins: null, incerta: true }, '2026-03-01', 'ca');
		expect(incerta).toBe('Possible restricció (obres): comprova-ho a la FEEC');
		expect(incerta).not.toMatch(/tancat/i);
	});
});
