import { describe, expect, it } from 'vitest';
import { IndexLru, MIDA_DESCONEGUDA } from './lru';

const lim = (maxEntrades: number, maxBytes = 1e9) => ({ maxEntrades, maxBytes });

describe('IndexLru', () => {
	it('expulsa la menys usada quan se supera el nombre màxim', () => {
		const idx = new IndexLru(lim(3));
		expect(idx.afegir('a', 1)).toEqual([]);
		expect(idx.afegir('b', 1)).toEqual([]);
		expect(idx.afegir('c', 1)).toEqual([]);
		expect(idx.afegir('d', 1)).toEqual(['a']);
		expect(idx.claus()).toEqual(['b', 'c', 'd']);
	});

	it('tocar una entrada la fa la més recent', () => {
		const idx = new IndexLru(lim(3));
		['a', 'b', 'c'].forEach((c) => idx.afegir(c, 1));
		expect(idx.tocar('a')).toBe(true);
		expect(idx.tocar('z')).toBe(false);
		expect(idx.afegir('d', 1)).toEqual(['b']);
		expect(idx.claus()).toEqual(['c', 'a', 'd']);
	});

	it('respecta el límit de bytes i en porta el compte', () => {
		const idx = new IndexLru(lim(100, 100));
		idx.afegir('a', 40);
		idx.afegir('b', 40);
		expect(idx.bytes).toBe(80);
		expect(idx.afegir('c', 40)).toEqual(['a']);
		expect(idx.bytes).toBe(80);
		expect(idx.mida).toBe(2);
	});

	it('una entrada que sola supera maxBytes no es desa (i es retorna per esborrar-la)', () => {
		const idx = new IndexLru(lim(10, 100));
		idx.afegir('a', 10);
		expect(idx.afegir('gegant', 101)).toEqual(['gegant']);
		expect(idx.te('gegant')).toBe(false);
		expect(idx.claus()).toEqual(['a']);
	});

	it('reafegir una clau actualitza la mida sense duplicar-la', () => {
		const idx = new IndexLru(lim(10));
		idx.afegir('a', 10);
		idx.afegir('b', 10);
		idx.afegir('a', 30);
		expect(idx.claus()).toEqual(['b', 'a']);
		expect(idx.bytes).toBe(40);
	});

	it('mida invàlida → mida estimada', () => {
		const idx = new IndexLru(lim(10));
		idx.afegir('a', Number.NaN);
		expect(idx.bytes).toBe(MIDA_DESCONEGUDA);
	});

	it('serialitza i deserialitza conservant l’ordre i els bytes', () => {
		const idx = new IndexLru(lim(10));
		idx.afegir('a', 5);
		idx.afegir('b', 7);
		idx.tocar('a');
		const copia = IndexLru.deserialitzar(JSON.parse(JSON.stringify(idx.serialitzar())), lim(10));
		expect(copia.claus()).toEqual(['b', 'a']);
		expect(copia.bytes).toBe(12);
	});

	it('dades desades invàlides → índex buit', () => {
		expect(IndexLru.deserialitzar(null, lim(5)).mida).toBe(0);
		expect(IndexLru.deserialitzar({ v: 2, entrades: [] }, lim(5)).mida).toBe(0);
		expect(
			IndexLru.deserialitzar(
				{
					v: 1,
					entrades: [
						['a', 'x'],
						[3, 1],
						['b', 2]
					]
				},
				lim(5)
			).claus()
		).toEqual(['b']);
	});

	it('reconciliar: treu el que ja no és a la cache i afegeix com a antic el desconegut', () => {
		const idx = new IndexLru(lim(3));
		idx.afegir('a', 1);
		idx.afegir('b', 1);
		const fora = idx.reconciliar(['b', 'x', 'y']);
		expect(idx.te('a')).toBe(false);
		// x i y entren com a més antigues; 3 entrades → dins del límit
		expect(fora).toEqual([]);
		expect(idx.claus()).toEqual(['x', 'y', 'b']);
		expect(idx.bytes).toBe(1 + 2 * MIDA_DESCONEGUDA);
	});

	it('reconciliar retalla per sobre del límit començant per les desconegudes', () => {
		const idx = new IndexLru(lim(2));
		idx.afegir('b', 1);
		expect(idx.reconciliar(['b', 'x', 'y'])).toEqual(['x']);
		expect(idx.claus()).toEqual(['y', 'b']);
	});

	it('rebutja límits invàlids', () => {
		expect(() => new IndexLru(lim(0))).toThrow(RangeError);
	});
});
