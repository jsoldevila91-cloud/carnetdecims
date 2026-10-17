import { describe, expect, it } from 'vitest';
import { REPTES } from '$lib/domain';
import { capDeSetmanaVinent, medallesNoves, nivellText, repteDeSlugQualsevol } from './reptes';

describe('ui/reptes', () => {
	it('cap de setmana vinent', () => {
		expect(capDeSetmanaVinent('2026-10-14')).toEqual(['2026-10-17', '2026-10-18']); // dimecres
		expect(capDeSetmanaVinent('2026-10-17')).toEqual(['2026-10-17', '2026-10-18']); // dissabte
		expect(capDeSetmanaVinent('2026-10-18')).toEqual(['2026-10-18']); // diumenge
		expect(capDeSetmanaVinent('2026-12-28')).toEqual(['2027-01-02', '2027-01-03']);
	});

	it('medalles noves: només les que no hi eren', () => {
		const a = [{ repteId: 'cent-cims', nivell: 1, data: '2026-01-01' }];
		const b = [...a, { repteId: 'cent-cims', nivell: 2, data: '2026-02-01' }];
		expect(medallesNoves(a, b)).toEqual([b[1]]);
		expect(medallesNoves(b, b)).toEqual([]);
	});

	it('nivellText', () => {
		expect(nivellText(1)).toBe('100');
		expect(nivellText(3)).toBe('3×100');
	});

	it('troba el repte pel slug de qualsevol idioma', () => {
		const r = REPTES.find((x) => x.slug.ca !== x.slug.es)!;
		expect(repteDeSlugQualsevol(r.slug.ca, 'es')?.id).toBe(r.id);
		expect(repteDeSlugQualsevol(r.slug.es, 'ca')?.id).toBe(r.id);
		expect(repteDeSlugQualsevol('no-existeix', 'ca')).toBeUndefined();
	});
});
