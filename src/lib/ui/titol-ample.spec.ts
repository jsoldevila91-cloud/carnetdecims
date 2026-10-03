import { describe, expect, it } from 'vitest';
import {
	ampleLiniesEm,
	ampleParaulaMesLlargaEm,
	ampleTextEm,
	capacitatLiniaEm,
	saltsTitolEm
} from './titol-ample';

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

describe('ampleLiniesEm', () => {
	it('una línia: el text sencer; paraula única: la paraula', () => {
		expect(ampleLiniesEm('Tuc deth Pòrt de Vielha', 1)).toBeCloseTo(
			ampleTextEm('Tuc deth Pòrt de Vielha'),
			3
		);
		expect(ampleLiniesEm('Castellsapera', 3)).toBeCloseTo(
			ampleParaulaMesLlargaEm('Castellsapera'),
			5
		);
	});

	it('té en compte que les paraules no es parteixen', () => {
		const nom = 'Sant Salvador de les Espases';
		const ample = ampleLiniesEm(nom, 3);
		// Més que un terç del total: "SANT SALVADOR" no cap en un terç
		expect(ample).toBeGreaterThan(ampleTextEm(nom) / 3);
		// "SANT / SALVADOR DE / LES ESPASES": la línia més llarga
		expect(ample).toBeCloseTo(ampleTextEm('Salvador de'), 2);
		expect(ample).toBeGreaterThanOrEqual(ampleParaulaMesLlargaEm(nom));
	});

	it('el sufix va a la seva escala i no es parteix', () => {
		const sense = ampleLiniesEm('Pica', 1);
		const amb = ampleLiniesEm('Pica', 1, { text: '(3.143 m)', escala: 0.5 });
		expect(amb).toBeCloseTo(sense + 0.3 + 0.5 * ampleTextEm('(3.143 m)'), 3);
		expect(ampleLiniesEm('Pica', 2, { text: '(3.143 m)', escala: 0.5 })).toBeCloseTo(
			Math.max(sense, 0.5 * ampleTextEm('(3.143 m)')),
			3
		);
	});

	it('text buit', () => {
		expect(ampleLiniesEm('  ', 3)).toBe(1);
	});
});

describe('saltsTitolEm (H1 de la fitxa al mòbil)', () => {
	const salts = (nom: string, alt: string) => {
		const sufix = { text: `(${alt} m)`, escala: 0.5 };
		return saltsTitolEm(nom, sufix, ampleParaulaMesLlargaEm(nom), ampleLiniesEm(nom, 3, sufix));
	};

	it("noms curts: l'altitud a la segona línia si no hi cap amb marge", () => {
		// "PUIGMAL (2.910 M)" queda just al límit: el salt és explícit per a les dues fonts.
		expect(salts('Puigmal', '2.910')).toEqual([1]);
	});

	it('cap salt si tot hi cap amb marge', () => {
		expect(salts('Taga', '2.040')).toEqual([]);
	});

	it('mai més de 3 línies i cap línia més ampla que la capacitat', () => {
		for (const [nom, alt] of [
			['Sant Salvador de les Espases', '413'],
			['Torre de Madeloc', '652'],
			['Molló-Puntaire', '1.032'],
			['Castellsapera', '1.000']
		] as const) {
			const s = salts(nom, alt);
			expect(s.length, nom).toBeLessThanOrEqual(2);
			const sufix = { text: `(${alt} m)`, escala: 0.5 };
			const cap = capacitatLiniaEm(ampleParaulaMesLlargaEm(nom), ampleLiniesEm(nom, 3, sufix));
			expect(cap).toBeGreaterThanOrEqual(100 / 11);
		}
	});
});
