import { describe, expect, it } from 'vitest';
import { NOVETATS, darreraNovetat, novetatsPerMostrar, type Novetat } from './novetats';

const n = (id: string): Novetat => ({
	id,
	data: id.slice(0, 10),
	titol: { ca: id, es: id },
	punts: { ca: ['a'], es: ['a'] }
});
const LLISTA = [n('2026-12-01-c'), n('2026-11-01-b'), n('2026-10-01-a')];

describe('novetats', () => {
	it('usuari nou (res desat): cap novetat', () => {
		expect(novetatsPerMostrar(null, false, LLISTA)).toEqual([]);
	});

	it('usuari existent sense res desat: només la darrera', () => {
		expect(novetatsPerMostrar(null, true, LLISTA).map((x) => x.id)).toEqual(['2026-12-01-c']);
	});

	it('mostra les més noves que la vista', () => {
		expect(novetatsPerMostrar('2026-10-01-a', false, LLISTA).map((x) => x.id)).toEqual([
			'2026-12-01-c',
			'2026-11-01-b'
		]);
	});

	it('ja ha vist la darrera o un id desconegut: res', () => {
		expect(novetatsPerMostrar('2026-12-01-c', true, LLISTA)).toEqual([]);
		expect(novetatsPerMostrar('no-existeix', true, LLISTA)).toEqual([]);
	});

	it('darreraNovetat', () => {
		expect(darreraNovetat(LLISTA)).toBe('2026-12-01-c');
		expect(darreraNovetat([])).toBeNull();
	});

	it('les entrades reals tenen id únic, ordre descendent i textos en tots dos idiomes', () => {
		const ids = NOVETATS.map((x) => x.id);
		expect(new Set(ids).size).toBe(ids.length);
		const dates = NOVETATS.map((x) => x.data);
		expect([...dates].sort().reverse()).toEqual(dates);
		for (const x of NOVETATS) {
			expect(x.punts.ca.length).toBe(x.punts.es.length);
			expect(x.titol.ca && x.titol.es).toBeTruthy();
		}
	});
});
