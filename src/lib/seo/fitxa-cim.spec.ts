import { describe, expect, it } from 'vitest';
import { nomAmbA, primerQueHiCapi } from './fitxa-cim';

describe('fitxa de cim · SEO', () => {
	it('contracció amb "a" en català', () => {
		expect(nomAmbA('el Pedraforca', 'ca')).toBe('al Pedraforca');
		expect(nomAmbA('lo Tormo', 'ca')).toBe('al Tormo');
		expect(nomAmbA("la Pica d'Estats", 'ca')).toBe("a la Pica d'Estats");
		expect(nomAmbA("l'Elefant", 'ca')).toBe("a l'Elefant");
		expect(nomAmbA('els Bessons', 'ca')).toBe('als Bessons');
		expect(nomAmbA('Sant Salvador de les Espases', 'ca')).toBe('a Sant Salvador de les Espases');
	});

	it('en castellà només contrau el/lo', () => {
		expect(nomAmbA('el Pedraforca', 'es')).toBe('al Pedraforca');
		expect(nomAmbA("la Pica d'Estats", 'es')).toBe("a la Pica d'Estats");
		expect(nomAmbA('els Bessons', 'es')).toBe('a els Bessons');
		expect(nomAmbA('Montcau', 'es')).toBe('a Montcau');
	});

	it('tria el primer títol que hi cap', () => {
		expect(primerQueHiCapi(['a'.repeat(61), 'curt'])).toBe('curt');
		expect(primerQueHiCapi(['a'.repeat(70), 'b'.repeat(65)])).toBe('b'.repeat(65));
		expect(primerQueHiCapi(['ok'])).toBe('ok');
	});
});
