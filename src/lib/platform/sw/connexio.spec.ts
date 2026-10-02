import { describe, expect, it } from 'vitest';
import { connexioPermetPrecarrega } from './connexio';

describe('connexioPermetPrecarrega', () => {
	it('sense connexió, mai', () => {
		expect(connexioPermetPrecarrega(undefined, false)).toBe(false);
		expect(connexioPermetPrecarrega({ type: 'wifi' }, false)).toBe(false);
	});

	it('sense navigator.connection (Safari, Firefox): es permet', () => {
		expect(connexioPermetPrecarrega(undefined, true)).toBe(true);
		expect(connexioPermetPrecarrega(null, true)).toBe(true);
	});

	it('amb estalvi de dades, no', () => {
		expect(connexioPermetPrecarrega({ saveData: true, type: 'wifi' }, true)).toBe(false);
	});

	it('per dades mòbils o sense xarxa, no; per wifi o cable, sí', () => {
		expect(connexioPermetPrecarrega({ type: 'cellular', effectiveType: '4g' }, true)).toBe(false);
		expect(connexioPermetPrecarrega({ type: 'none' }, true)).toBe(false);
		expect(connexioPermetPrecarrega({ type: 'wifi', effectiveType: '4g' }, true)).toBe(true);
		expect(connexioPermetPrecarrega({ type: 'ethernet' }, true)).toBe(true);
	});

	it('sense `type` (Chrome d’escriptori) decideix per la velocitat efectiva', () => {
		expect(connexioPermetPrecarrega({ effectiveType: '4g' }, true)).toBe(true);
		expect(connexioPermetPrecarrega({ effectiveType: '3g' }, true)).toBe(true);
		expect(connexioPermetPrecarrega({ effectiveType: '2g' }, true)).toBe(false);
		expect(connexioPermetPrecarrega({ effectiveType: 'slow-2g' }, true)).toBe(false);
	});
});
