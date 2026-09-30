import { describe, expect, it } from 'vitest';
import {
	CASELLES_PAGINA,
	dataSegellCurta,
	dataSegellLlarga,
	inclinacioSegell,
	inicialsCim,
	rangsCasellesBuides
} from './carnet';

describe('carnet (presentació)', () => {
	it('inicials dels cims', () => {
		expect(inicialsCim('Pedraforca')).toBe('PE');
		expect(inicialsCim('Puig de la Canal Baridana')).toBe('PCB');
		expect(inicialsCim("L'Elefant")).toBe('EL');
		expect(inicialsCim('Tossal de la Truita')).toBe('TT');
		expect(inicialsCim('La Tossa (Tivissa)')).toBe('TO');
		expect(inicialsCim('Pic de Comapedrosa')).toBe('PC');
		expect(inicialsCim('Sant Salvador de les Espases')).toBe('SSE');
		expect(inicialsCim('Àliga')).toBe('AL');
		expect(inicialsCim('')).toBe('?');
	});

	it('dates dels segells', () => {
		expect(dataSegellCurta('2025-06-12')).toBe('12.6.25');
		expect(dataSegellCurta('2006-07-01')).toBe('1.7.06');
		expect(dataSegellCurta('2024-12-23')).toBe('23.12.24');
		expect(dataSegellLlarga('2025-06-12')).toBe('12 · VI · 2025');
		expect(dataSegellCurta('x')).toBe('x');
	});

	it('inclinació estable i acotada', () => {
		for (let i = 1; i <= 500; i++) {
			const r = inclinacioSegell(i);
			expect(r).toBeGreaterThanOrEqual(-7);
			expect(r).toBeLessThanOrEqual(7);
			expect(inclinacioSegell(i)).toBe(r);
		}
	});

	it('rangs de caselles buides', () => {
		expect(rangsCasellesBuides(new Set([1, 2, 5]))).toBe('3–4, 6–100');
		expect(rangsCasellesBuides(new Set())).toBe('1–100');
		expect(rangsCasellesBuides(new Set([100]))).toBe('1–99');
		expect(rangsCasellesBuides(new Set([1, 3]), 4)).toBe('2, 4');
		expect(rangsCasellesBuides(new Set(CASELLES_PAGINA))).toBe('');
	});

	it('100 caselles per pàgina', () => {
		expect(CASELLES_PAGINA).toHaveLength(100);
		expect(CASELLES_PAGINA[0]).toBe(1);
		expect(CASELLES_PAGINA[99]).toBe(100);
	});
});
