import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	CAPCALERA_DEFLATE_RAW,
	CAPCALERA_SENSE_COMPRIMIR,
	comprimeix,
	descomprimeix
} from './compressio';

const repetitiu = (n: number) => Uint8Array.from({ length: n }, (_, i) => i % 7);

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('comprimeix / descomprimeix', () => {
	it('round-trip amb deflate-raw quan surt a compte', async () => {
		const dades = repetitiu(5000);
		const c = await comprimeix(dades);
		expect(c[0]).toBe(CAPCALERA_DEFLATE_RAW);
		expect(c.length).toBeLessThan(dades.length / 10);
		expect(await descomprimeix(c, 10_000)).toEqual(dades);
	});

	it('dades curtes o aleatòries: sense comprimir (capçalera 0)', async () => {
		const curt = Uint8Array.from([1, 0, 0]);
		const c = await comprimeix(curt);
		expect([...c]).toEqual([CAPCALERA_SENSE_COMPRIMIR, 1, 0, 0]);
		expect(await descomprimeix(c, 100)).toEqual(curt);
	});

	it('buit', async () => {
		const c = await comprimeix(new Uint8Array(0));
		expect(await descomprimeix(c, 10)).toEqual(new Uint8Array(0));
		expect(await descomprimeix(new Uint8Array(0), 10)).toBeNull();
	});

	it('bomba de descompressió: s’atura en superar el límit', async () => {
		const bomba = await comprimeix(new Uint8Array(4_000_000));
		expect(bomba[0]).toBe(CAPCALERA_DEFLATE_RAW);
		expect(bomba.length).toBeLessThan(10_000);
		expect(await descomprimeix(bomba, 16_000)).toBeNull();
	});

	it('el límit és inclusiu', async () => {
		const dades = repetitiu(3000);
		const c = await comprimeix(dades);
		expect(await descomprimeix(c, 3000)).toEqual(dades);
		expect(await descomprimeix(c, 2999)).toBeNull();
		const cru = await comprimeix(Uint8Array.from([9, 9]));
		expect(await descomprimeix(cru, 1)).toBeNull();
	});

	it('dades corruptes, truncades o capçalera desconeguda → null', async () => {
		const c = await comprimeix(repetitiu(5000));
		expect(await descomprimeix(c.subarray(0, Math.floor(c.length / 2)), 10_000)).toBeNull();
		expect(await descomprimeix(Uint8Array.from([1, 0xff, 0xff, 0xff, 0xff]), 10_000)).toBeNull();
		expect(await descomprimeix(Uint8Array.from([2, 1, 2, 3]), 10_000)).toBeNull();
		expect(await descomprimeix(Uint8Array.from([255]), 10_000)).toBeNull();
	});

	it('sense CompressionStream: desa sense comprimir i no pot llegir deflate', async () => {
		const c = await comprimeix(repetitiu(5000));
		vi.stubGlobal('CompressionStream', undefined);
		vi.stubGlobal('DecompressionStream', undefined);
		const dades = repetitiu(5000);
		const cru = await comprimeix(dades);
		expect(cru[0]).toBe(CAPCALERA_SENSE_COMPRIMIR);
		expect(cru.length).toBe(dades.length + 1);
		expect(await descomprimeix(cru, 10_000)).toEqual(dades);
		expect(await descomprimeix(c, 10_000)).toBeNull();
	});

	it('si CompressionStream falla, desa sense comprimir', async () => {
		vi.stubGlobal(
			'CompressionStream',
			class {
				constructor() {
					throw new TypeError('format no suportat');
				}
			}
		);
		const c = await comprimeix(repetitiu(100));
		expect(c[0]).toBe(CAPCALERA_SENSE_COMPRIMIR);
	});
});
