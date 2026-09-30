import { describe, expect, it } from 'vitest';
import { demanarPosicio, errorDeCodi } from './geolocalitzacio';

function geoFals(
	comportament: { lat: number; lon: number } | { code: number } | 'llança'
): Geolocation {
	return {
		getCurrentPosition(ok, ko) {
			if (comportament === 'llança') throw new Error('x');
			if ('code' in comportament) ko?.({ code: comportament.code } as GeolocationPositionError);
			else
				ok({
					coords: { latitude: comportament.lat, longitude: comportament.lon }
				} as GeolocationPosition);
		},
		watchPosition: () => 0,
		clearWatch: () => {}
	};
}

describe('geolocalitzacio', () => {
	it('tradueix els codis d’error', () => {
		expect(errorDeCodi(1)).toBe('denegada');
		expect(errorDeCodi(2)).toBe('no-disponible');
		expect(errorDeCodi(3)).toBe('temps');
	});

	it('sense API → no-suportada', async () => {
		expect(await demanarPosicio(undefined)).toEqual({ ok: false, error: 'no-suportada' });
	});

	it('retorna el punt', async () => {
		expect(await demanarPosicio(geoFals({ lat: 42.1, lon: 1.8 }))).toEqual({
			ok: true,
			punt: { lat: 42.1, lon: 1.8 }
		});
	});

	it('permís denegat i excepcions no llancen', async () => {
		expect(await demanarPosicio(geoFals({ code: 1 }))).toEqual({ ok: false, error: 'denegada' });
		expect(await demanarPosicio(geoFals('llança'))).toEqual({
			ok: false,
			error: 'no-disponible'
		});
	});
});
