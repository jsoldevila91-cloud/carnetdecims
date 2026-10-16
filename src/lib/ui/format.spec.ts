import { describe, expect, it } from 'vitest';
import {
	formatAltitude,
	formatCoordinate,
	formatDataLlarga,
	formatDurada,
	formatKm,
	formatLlista,
	formatMes,
	formatPercentatge,
	formatStampDate,
	romanPage
} from './format';

describe('format', () => {
	it('durades en hores i minuts', () => {
		expect(formatDurada(195)).toBe('3 h 15 min');
		expect(formatDurada(180)).toBe('3 h');
		expect(formatDurada(45)).toBe('45 min');
		expect(formatDurada(0)).toBe('0 min');
		expect(formatDurada(59.6)).toBe('1 h');
	});

	it('coordenades amb coma decimal i sense signe', () => {
		expect(formatCoordinate(42.66695, 'ca')).toBe('42,66695');
		expect(formatCoordinate(1.3979, 'es')).toBe('1,39790');
		expect(formatCoordinate(-0.5, 'ca', 2)).toBe('0,50');
	});

	it('distàncies en km amb un decimal com a màxim', () => {
		expect(formatKm(3.24, 'ca')).toBe('3,2');
		expect(formatKm(12.04, 'es')).toBe('12');
	});

	it('agrupa els milers amb punt, també amb 4 xifres', () => {
		expect(formatAltitude(2506)).toBe('2.506');
		expect(formatAltitude(987)).toBe('987');
		expect(formatAltitude(3143.4)).toBe('3.143');
	});

	it('data de segell amb el mes en romà', () => {
		expect(formatStampDate(new Date(2026, 8, 14))).toBe('14 · IX · 2026');
	});

	it('pàgines del carnet I–V', () => {
		expect([1, 2, 3, 4, 5].map(romanPage)).toEqual(['I', 'II', 'III', 'IV', 'V']);
	});

	it('data llarga per idioma, sense desplaçament de zona horària', () => {
		expect(formatDataLlarga('2026-09-29', 'es')).toBe('29 de septiembre de 2026');
		expect(formatDataLlarga('2026-09-29', 'ca')).toMatch(/^29 de setembre (de|del) 2026$/);
		expect(formatDataLlarga('2026-01-01', 'ca')).toMatch(/^1 de gener (de|del) 2026$/);
		expect(formatDataLlarga('no-data', 'ca')).toBe('no-data');
	});

	it('percentatges sencers, amb "< 1 %" per als valors molt petits', () => {
		const net = (t: string) => t.replace(/\s/g, ' ');
		expect(net(formatPercentatge(0.453, 'ca'))).toBe('45 %');
		expect(net(formatPercentatge(0, 'es'))).toBe('0 %');
		expect(net(formatPercentatge(1, 'ca'))).toBe('100 %');
		expect(net(formatPercentatge(0.001, 'ca'))).toBe('< 1 %');
	});

	it('mes i any per idioma', () => {
		expect(formatMes('2025-03', 'es')).toBe('marzo de 2025');
		expect(formatMes('2025-03', 'ca')).toMatch(/^març (de|del) 2025$/);
		expect(formatMes('x', 'ca')).toBe('x');
	});

	it('llista de noms amb la conjunció de cada idioma', () => {
		expect(formatLlista(['Inesa', 'Pau', 'Joan'], 'ca')).toBe('Inesa, Pau i Joan');
		expect(formatLlista(['Inesa', 'Pau'], 'es')).toBe('Inesa y Pau');
		expect(formatLlista(['Inesa'], 'ca')).toBe('Inesa');
	});
});
