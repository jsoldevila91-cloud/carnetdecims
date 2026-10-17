/**
 * Càrrega del conjunt de municipis al navegador: `fetch` del fitxer estàtic del propi web (no
 * `import()`, que Chromium desa fallit a la memòria de mòduls i no permet reintentar).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import dades from './municipis.json';

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	vi.resetModules();
});

/** El mòdul de nou (sense la promesa desada) i com al client (`import.meta.env.SSR` fals). */
async function moduClient() {
	vi.stubEnv('SSR', false);
	vi.resetModules();
	return import('./index');
}

describe('carregarMunicipis al client (fetch)', () => {
	it('demana el fitxer al mateix origen, una sola vegada', async () => {
		const fetchMock = vi.fn(async () => Response.json(dades));
		vi.stubGlobal('fetch', fetchMock);
		const { carregarMunicipis } = await moduClient();
		const tots = await carregarMunicipis();
		expect(tots).toHaveLength(980);
		expect(await carregarMunicipis()).toBe(tots);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, opcions] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
		// Camí del propi web (sense origen extern) i sense dades de l'usuari a la URL
		expect(url).toMatch(/^\/[^?#]*municipis[^/?#]*\.json$/);
		expect(opcions).toMatchObject({ credentials: 'same-origin' });
	});

	it('un error (sense xarxa o HTTP) no queda desat: el reintent torna a demanar el fitxer', async () => {
		const fetchMock = vi
			.fn<() => Promise<Response>>()
			.mockRejectedValueOnce(new TypeError('Failed to fetch'))
			.mockResolvedValueOnce(new Response('', { status: 503 }))
			.mockResolvedValueOnce(Response.json(dades));
		vi.stubGlobal('fetch', fetchMock);
		const { carregarMunicipis, municipiDeCodi } = await moduClient();
		await expect(carregarMunicipis()).rejects.toThrow('Failed to fetch');
		await expect(municipiDeCodi('080193')).rejects.toThrow(/503/);
		expect(await municipiDeCodi('080193')).toMatchObject({ nom: 'Barcelona' });
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});
});
