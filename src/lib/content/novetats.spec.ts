import { describe, expect, it } from 'vitest';
import { contrasenyaAuthActiu } from '$lib/platform/flags';
import {
	NOVETATS,
	TOTES_LES_NOVETATS,
	darreraNovetat,
	novetatsActives,
	novetatsPerMostrar,
	type Novetat
} from './novetats';

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

	it('novetatsActives: sense nomesSi sempre; amb nomesSi només si el flag és actiu', () => {
		const condicionada: Novetat = { ...n('2026-12-15-d'), nomesSi: 'contrasenya' };
		const llista = [condicionada, ...LLISTA];
		expect(novetatsActives(llista, {}).map((x) => x.id)).toEqual(LLISTA.map((x) => x.id));
		expect(novetatsActives(llista, { contrasenya: false })).toEqual(LLISTA);
		expect(novetatsActives(llista, { contrasenya: true }).map((x) => x.id)).toEqual([
			'2026-12-15-d',
			...LLISTA.map((x) => x.id)
		]);
	});

	it('en activar el flag, qui havia vist la darrera veu la condicionada', () => {
		const condicionada: Novetat = { ...n('2026-12-15-d'), nomesSi: 'contrasenya' };
		const actives = novetatsActives([condicionada, ...LLISTA], { contrasenya: true });
		expect(novetatsPerMostrar('2026-12-01-c', false, actives).map((x) => x.id)).toEqual([
			'2026-12-15-d'
		]);
	});

	it('NOVETATS aplica el flag del build (PUBLIC_PASSWORD_AUTH)', () => {
		expect(NOVETATS).toEqual(
			novetatsActives(TOTES_LES_NOVETATS, { contrasenya: contrasenyaAuthActiu })
		);
		const contrasenya = TOTES_LES_NOVETATS.find((x) => x.nomesSi === 'contrasenya');
		expect(contrasenya).toBeDefined();
		expect(NOVETATS.some((x) => x.id === contrasenya?.id)).toBe(contrasenyaAuthActiu);
	});

	it('les entrades reals tenen id únic, ordre descendent i textos en tots dos idiomes', () => {
		const ids = TOTES_LES_NOVETATS.map((x) => x.id);
		expect(new Set(ids).size).toBe(ids.length);
		const dates = TOTES_LES_NOVETATS.map((x) => x.data);
		expect([...dates].sort().reverse()).toEqual(dates);
		for (const x of TOTES_LES_NOVETATS) {
			expect(x.punts.ca.length).toBe(x.punts.es.length);
			expect(x.titol.ca && x.titol.es).toBeTruthy();
		}
	});
});
