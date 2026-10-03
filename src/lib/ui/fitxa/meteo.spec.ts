import { describe, expect, it } from 'vitest';
import {
	categoriaTemps,
	diesDesDe,
	edatMinuts,
	formatEdat,
	formatPrecipitacio,
	formatProbabilitat,
	formatTemperatura,
	formatVent
} from './meteo';

describe('categoriaTemps (codis WMO)', () => {
	it('classifica els codis coneguts', () => {
		expect(categoriaTemps(0)).toBe('sere');
		expect(categoriaTemps(2)).toBe('poc-nuvol');
		expect(categoriaTemps(3)).toBe('nuvol');
		expect(categoriaTemps(45)).toBe('boira');
		expect(categoriaTemps(53)).toBe('plugim');
		expect(categoriaTemps(63)).toBe('pluja');
		expect(categoriaTemps(81)).toBe('pluja');
		expect(categoriaTemps(73)).toBe('neu');
		expect(categoriaTemps(86)).toBe('neu');
		expect(categoriaTemps(95)).toBe('tempesta');
	});

	it('no inventa res amb codis desconeguts', () => {
		expect(categoriaTemps(4)).toBe('desconegut');
		expect(categoriaTemps(undefined)).toBe('desconegut');
		expect(categoriaTemps(Number.NaN)).toBe('desconegut');
	});
});

describe('unitats', () => {
	it('temperatura arrodonida, sense "-0"', () => {
		expect(formatTemperatura(12.4, 'ca')).toMatch(/^12\s?°C$/);
		expect(formatTemperatura(-0.3, 'es')).toMatch(/^0\s?°C$/);
		expect(formatTemperatura(-5.6, 'ca')).toMatch(/^-6\s?°C$/);
	});

	it('vent en km/h i precipitació en mm amb coma decimal', () => {
		expect(formatVent(23.6, 'ca')).toBe('24 km/h');
		expect(formatPrecipitacio(2.35, 'es')).toMatch(/^2,4 mm$/);
		expect(formatPrecipitacio(0, 'ca')).toBe('0 mm');
	});

	it('probabilitat en percentatge', () => {
		expect(formatProbabilitat(40, 'ca').replace(/\s/g, ' ')).toBe('40 %');
		expect(formatProbabilitat(140, 'es').replace(/\s/g, ' ')).toBe('100 %');
	});

	it('dies relatius', () => {
		expect(diesDesDe('2026-10-03', '2026-10-03')).toBe(0);
		expect(diesDesDe('2026-10-03', '2026-10-04')).toBe(1);
		expect(diesDesDe('2026-10-31', '2026-11-02')).toBe(2);
	});
});

describe('edat de la previsió', () => {
	const ara = new Date('2026-10-03T12:00:00Z');
	it('minuts des de la data', () => {
		expect(edatMinuts('2026-10-03T10:00:00Z', ara)).toBe(120);
		expect(edatMinuts('no és data', ara)).toBeNull();
	});
	it('text relatiu', () => {
		expect(formatEdat(120, 'ca')).toBe('fa 2 hores');
		expect(formatEdat(120, 'es')).toBe('hace 2 horas');
		expect(formatEdat(0, 'ca')).toBe('fa 1 minut');
		expect(formatEdat(3 * 1440, 'es')).toMatch(/hace 3 días/);
	});
});
