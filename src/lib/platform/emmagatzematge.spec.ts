import { afterEach, describe, expect, it, vi } from 'vitest';
import { demanarPersistencia } from './emmagatzematge';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('demanarPersistencia', () => {
	it('retorna false sense navigator.storage', async () => {
		vi.stubGlobal('navigator', {});
		expect(await demanarPersistencia()).toBe(false);
	});

	it('retorna true si ja és persistent, sense tornar-ho a demanar', async () => {
		const persist = vi.fn(async () => false);
		vi.stubGlobal('navigator', { storage: { persisted: async () => true, persist } });
		expect(await demanarPersistencia()).toBe(true);
		expect(persist).not.toHaveBeenCalled();
	});

	it('retorna el resultat de persist()', async () => {
		vi.stubGlobal('navigator', {
			storage: { persisted: async () => false, persist: async () => true }
		});
		expect(await demanarPersistencia()).toBe(true);
		vi.stubGlobal('navigator', {
			storage: { persisted: async () => false, persist: async () => false }
		});
		expect(await demanarPersistencia()).toBe(false);
	});

	it('no llança si persist() falla', async () => {
		vi.stubGlobal('navigator', {
			storage: {
				persist: async () => {
					throw new Error('denegat');
				}
			}
		});
		expect(await demanarPersistencia()).toBe(false);
	});
});
