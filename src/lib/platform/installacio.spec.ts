import { describe, expect, it } from 'vitest';
import { esIos, installacio } from './installacio.svelte';

const UA = {
	iphone:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
	ipadMac:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
	android:
		'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
};

describe('esIos', () => {
	it('iPhone i iPad (també el que s’anuncia com a Mac tàctil)', () => {
		expect(esIos({ userAgent: UA.iphone, maxTouchPoints: 5 })).toBe(true);
		expect(esIos({ userAgent: UA.ipadMac, maxTouchPoints: 5 })).toBe(true);
	});

	it('Mac d’escriptori i Android: no', () => {
		expect(esIos({ userAgent: UA.ipadMac, maxTouchPoints: 0 })).toBe(false);
		expect(esIos({ userAgent: UA.android, maxTouchPoints: 5 })).toBe(false);
	});
});

describe('installacio (sense navegador)', () => {
	it('no és disponible ni deixa l’avís pendent si no es pot instal·lar', () => {
		expect(installacio.disponible).toBe(false);
		installacio.despresDeRegistrar();
		expect(installacio.avisPendent).toBe(false);
	});
});
