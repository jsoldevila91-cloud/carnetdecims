/**
 * Compartir una ascensió (R5): imatge 1080×1350 generada al client, full del sistema amb el
 * fitxer o descàrrega, i estat a la regió viva.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { CIMS } from '$lib/data/catalog';
import CompartirAscensio from './CompartirAscensio.svelte';
import { dibuixarImatgeAscensio } from './imatge-ascensio';
import { ALT_IMATGE, AMPLE_IMATGE, pngDelCanvas } from './imatge-comu';
import { formatDataLlarga } from '../format';

const cim = CIMS.find((c) => c.essencial)!;

/** Substitueix `navigator.share` / `canShare` només durant la prova. */
function simulaShare(share: unknown, canShare: unknown) {
	Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true });
	Object.defineProperty(navigator, 'canShare', {
		value: canShare,
		configurable: true,
		writable: true
	});
}

afterEach(() => {
	delete (navigator as unknown as Record<string, unknown>).share;
	delete (navigator as unknown as Record<string, unknown>).canShare;
	vi.restoreAllMocks();
});

describe('imatge de l’ascensió', () => {
	it('dibuixa un PNG de 1080×1350 en tema clar i fosc', async () => {
		for (const tema of ['clar', 'fosc'] as const) {
			const canvas = document.createElement('canvas');
			dibuixarImatgeAscensio(canvas, {
				nom: 'Puig de les Morreres de la Muntanya Llarguíssima',
				altitud: '2.913',
				comarca: 'Pallars Sobirà',
				essencial: true,
				dataSegell: '12 · VII · 2024',
				tema,
				textos: {
					marca: 'Carnet de Cims',
					etiqueta: 'Ascensió',
					essencial: 'Cim essencial',
					meta: '2.913 m · Pallars Sobirà',
					data: '12 de juliol de 2024',
					web: 'carnetdecims.cat'
				}
			});
			expect([canvas.width, canvas.height]).toEqual([AMPLE_IMATGE, ALT_IMATGE]);
			const blob = await pngDelCanvas(canvas);
			expect(blob?.type).toBe('image/png');
		}
	});
});

describe('CompartirAscensio', () => {
	it('botó amb nom accessible (cim i data)', async () => {
		render(CompartirAscensio, { cimId: cim.id, data: '2024-07-12' });
		await expect
			.element(
				page.getByRole('button', {
					name: `Comparteix una imatge de l'ascensió a ${cim.nom} del ${formatDataLlarga('2024-07-12', 'ca')}`
				})
			)
			.toBeVisible();
	});

	it('comparteix el PNG amb el full del sistema', async () => {
		const share = vi.fn().mockResolvedValue(undefined);
		simulaShare(share, () => true);
		render(CompartirAscensio, { cimId: cim.id, data: '2024-07-12' });
		await page.getByTestId('compartir-ascensio').click();
		await vi.waitFor(() => expect(share).toHaveBeenCalledOnce());
		const { files, title } = share.mock.calls[0][0] as { files: File[]; title: string };
		expect(files[0].type).toBe('image/png');
		expect(files[0].name).toBe(`carnetdecims-${cim.slug}-2024-07-12.png`);
		expect(title).toBe(`La meva ascensió a ${cim.nom}`);
	});

	it('sense compartir fitxers, la descarrega i ho anuncia', async () => {
		simulaShare(undefined, undefined);
		const clic = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
		render(CompartirAscensio, { cimId: cim.id, data: '2024-07-12' });
		await page.getByTestId('compartir-ascensio').click();
		await expect.element(page.getByRole('status')).toHaveTextContent('Imatge descarregada.');
		expect(clic).toHaveBeenCalledOnce();
	});

	it('si es perd el gest, demana un segon toc', async () => {
		const share = vi
			.fn()
			.mockRejectedValueOnce(new DOMException('gest', 'NotAllowedError'))
			.mockResolvedValueOnce(undefined);
		simulaShare(share, () => true);
		render(CompartirAscensio, { cimId: cim.id, data: '2024-07-12' });
		await page.getByTestId('compartir-ascensio').click();
		await expect.element(page.getByRole('status')).toHaveTextContent(/torna a tocar/);
		await page.getByTestId('compartir-ascensio').click();
		await vi.waitFor(() => expect(share).toHaveBeenCalledTimes(2));
		await expect.element(page.getByRole('status')).toHaveTextContent('');
	});
});
