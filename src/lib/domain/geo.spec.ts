import { describe, expect, it } from 'vitest';
import { bboxPunts, distanciaKm } from './geo';

describe('distanciaKm (Haversine)', () => {
	it('és 0 per al mateix punt i simètrica', () => {
		const a = { lat: 42.2386, lon: 1.7036 };
		const b = { lat: 42.66694, lon: 1.3979 };
		expect(distanciaKm(a, a)).toBe(0);
		expect(distanciaKm(a, b)).toBeCloseTo(distanciaKm(b, a), 10);
	});

	it('1° de latitud ≈ 111,2 km i 1° de longitud a l’equador igual', () => {
		expect(distanciaKm({ lat: 0, lon: 0 }, { lat: 1, lon: 0 })).toBeCloseTo(111.195, 2);
		expect(distanciaKm({ lat: 0, lon: 0 }, { lat: 0, lon: 1 })).toBeCloseTo(111.195, 2);
	});

	it('distàncies reals conegudes (±1 %)', () => {
		// Barcelona (Pl. Catalunya) – Girona (catedral): ≈ 86,2 km en línia recta
		const bcn = { lat: 41.387, lon: 2.17 };
		const girona = { lat: 41.9875, lon: 2.8258 };
		expect(Math.abs(distanciaKm(bcn, girona) - 86.2) / 86.2).toBeLessThan(0.01);
		// Pica d'Estats – Canigó: ≈ 88,2 km
		const pica = { lat: 42.66694, lon: 1.3979 };
		const canigo = { lat: 42.51876, lon: 2.45677 };
		expect(Math.abs(distanciaKm(pica, canigo) - 88.2) / 88.2).toBeLessThan(0.01);
	});

	it('punts antipodals: mig perímetre sense NaN', () => {
		const d = distanciaKm({ lat: 0, lon: 0 }, { lat: 0, lon: 180 });
		expect(d).toBeCloseTo(Math.PI * 6371.0088, 3);
	});
});

describe('bboxPunts', () => {
	it('null sense punts; sense marge, la caixa exacta', () => {
		expect(bboxPunts([])).toBeNull();
		expect(
			bboxPunts([
				{ lat: 42, lon: 1 },
				{ lat: 41, lon: 3 }
			])
		).toEqual([1, 41, 3, 42]);
	});

	it('el marge són km reals a cada costat', () => {
		const [o, s, e, n] = bboxPunts([{ lat: 42, lon: 2 }], 10)!;
		expect(distanciaKm({ lat: 42, lon: 2 }, { lat: n, lon: 2 })).toBeCloseTo(10, 3);
		expect(distanciaKm({ lat: 42, lon: 2 }, { lat: s, lon: 2 })).toBeCloseTo(10, 3);
		// En longitud, com a mínim 10 km (es corregeix amb la latitud més alta de la caixa).
		expect(distanciaKm({ lat: 42, lon: 2 }, { lat: 42, lon: e })).toBeGreaterThanOrEqual(10);
		expect(distanciaKm({ lat: 42, lon: 2 }, { lat: 42, lon: o })).toBeLessThan(10.2);
	});
});
