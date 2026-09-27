import { describe, expect, it } from 'vitest';
import { formatAltitude, formatStampDate, romanPage } from './format';

describe('format', () => {
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
