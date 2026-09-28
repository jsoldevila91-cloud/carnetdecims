import { describe, expect, it } from 'vitest';
import { formatAltitude, formatCoordinate, formatKm, formatStampDate, romanPage } from './format';

describe('format', () => {
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
});
